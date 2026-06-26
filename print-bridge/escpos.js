/**
 * escpos.js — Constructor de comandos ESC/POS para impresora térmica 80mm
 * Compatible con Approx appPOS80WIFI+LAN
 *
 * Estrategia de encoding:
 *  - Texto latino (cabeceras, separadores, modificaciones):
 *      ESC/POS texto normal, CP437
 *  - Texto chino (nombres de platos):
 *      Renderizado con node-canvas → bitmap 1-bit → GS v 0
 *      Fuente: PingFang SC (macOS, incluida en sistema)
 *      Fallback: NotoSansSC (si hay TTF/OTF en ./fonts/)
 */

'use strict';
console.log('  escpos: require iconv-lite...');
const iconv        = require('iconv-lite');
console.log('  escpos: require canvas...');
const { createCanvas, GlobalFonts } = require('@napi-rs/canvas');
const registerFont = (fp, opts) => GlobalFonts.registerFromPath(fp, opts.family);
console.log('  escpos: canvas OK');
const path         = require('path');
const fs           = require('fs');

// ── Configuración ─────────────────────────────────────────────────────────────

// Ancho imprimible en píxeles (80mm @ 203dpi ≈ 576px / 72 bytes)
// Ajusta si tu impresora usa un ancho diferente.
const PRINTER_PX  = 576;
const PRINTER_BYTES = Math.ceil(PRINTER_PX / 8); // 72

// Tamaño de fuente para nombres de platos
const FONT_SIZE_PLATO = 44;
// Tamaño de fuente para modificaciones en chino (si existiesen)
const FONT_SIZE_MOD   = 34;

// Umbral luminancia para conversión 1-bit (0-255; 128 = 50% gris)
const THRESHOLD = 128;

// ── Fuente china ──────────────────────────────────────────────────────────────

// Intentar registrar NotoSansSC local si existe (fuente completa)
let chineseFontFamily = 'Noto Sans CJK SC';
const localFonts = [
  path.join(__dirname, 'fonts', 'NotoSansSC-Regular.ttf'),
  path.join(__dirname, 'fonts', 'NotoSansSC-Regular.otf'),
];
for (const fp of localFonts) {
  if (fs.existsSync(fp)) {
    try {
      registerFont(fp, { family: 'NotoSansSC' });
      chineseFontFamily = 'NotoSansSC';
      console.log(`✅ Fuente local registrada: ${path.basename(fp)}`);
    } catch (e) {
      console.warn(`⚠️  No se pudo registrar ${fp}: ${e.message}`);
    }
    break;
  }
}

console.log(`🔤 Fuente china activa: "${chineseFontFamily}"`);

// ── Detección de chino ────────────────────────────────────────────────────────

function tieneChino(str) {
  return /[一-鿿㐀-䶿豈-﫿]/.test(str);
}

// ── Renderizado bitmap ────────────────────────────────────────────────────────

/**
 * Envuelve texto para que quepa en PRINTER_PX píxeles.
 * Char a char (funciona bien con CJK + latin mezclados).
 */
function envolverTexto(ctx, texto, maxWidth) {
  const chars = [...texto]; // Unicode-safe split
  const lineas = [];
  let linea = '';

  for (const c of chars) {
    const prueba = linea + c;
    if (ctx.measureText(prueba).width > maxWidth && linea !== '') {
      lineas.push(linea);
      linea = c;
    } else {
      linea = prueba;
    }
  }
  if (linea) lineas.push(linea);
  return lineas;
}

/**
 * Renderiza texto con la fuente china y devuelve el comando GS v 0 completo.
 * El canvas siempre tiene PRINTER_PX de ancho para alinearse con el papel.
 *
 * @param {string} texto
 * @param {object} opts
 * @param {number} opts.fontSize  - tamaño de fuente en px
 * @param {boolean} opts.bold     - negrita
 * @param {boolean} opts.centrar  - centrar horizontalmente
 */
function renderizarBitmap(texto, opts = {}) {
  const { fontSize = FONT_SIZE_PLATO, bold = false, centrar = false } = opts;
  const fontSpec = `${bold ? 'bold ' : ''}${fontSize}px "${chineseFontFamily}"`;
  const padding  = 4;
  const lineH    = Math.ceil(fontSize * 1.35);

  // ── Medición ───────────────────────────────────────────────────────────────
  const tmpCanvas = createCanvas(PRINTER_PX, 10);
  const tmpCtx    = tmpCanvas.getContext('2d');
  tmpCtx.font = fontSpec;
  const lineas = envolverTexto(tmpCtx, texto, PRINTER_PX - padding * 2);

  // La altura debe ser múltiplo de 8 para compatibilidad con impresoras ESC/POS
  const alturaRaw  = lineas.length * lineH + padding * 2;
  const altura      = Math.ceil(alturaRaw / 8) * 8;

  // ── Render ─────────────────────────────────────────────────────────────────
  const canvas = createCanvas(PRINTER_PX, altura);
  const ctx    = canvas.getContext('2d');

  // Fondo blanco
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, PRINTER_PX, altura);

  // Texto negro
  ctx.fillStyle = '#000000';
  ctx.font = fontSpec;
  ctx.textBaseline = 'top';

  lineas.forEach((linea, i) => {
    let x = padding;
    if (centrar) {
      x = (PRINTER_PX - ctx.measureText(linea).width) / 2;
    }
    ctx.fillText(linea, x, padding + i * lineH);
  });

  // ── Conversión a 1-bit ────────────────────────────────────────────────────
  const imgData  = ctx.getImageData(0, 0, PRINTER_PX, altura);
  const widthBytesActual = Math.ceil(PRINTER_PX / 8);
  const bitmap   = Buffer.alloc(widthBytesActual * altura, 0x00); // 0 = blanco

  for (let y = 0; y < altura; y++) {
    for (let x = 0; x < PRINTER_PX; x++) {
      const idx = (y * PRINTER_PX + x) * 4;
      const r   = imgData.data[idx];
      const g   = imgData.data[idx + 1];
      const b   = imgData.data[idx + 2];
      // Luminancia perceptual (BT.601)
      const lum = 0.299 * r + 0.587 * g + 0.114 * b;

      if (lum < THRESHOLD) { // pixel oscuro → imprimir
        const byteIdx = y * widthBytesActual + Math.floor(x / 8);
        const bit     = 7 - (x % 8); // MSB primero
        bitmap[byteIdx] |= (1 << bit);
      }
    }
  }

  // ── Comando GS v 0 ────────────────────────────────────────────────────────
  // 1D 76 30 m xL xH yL yH [data]
  // m=0 (normal), x = bytes por fila (LE), y = filas (LE)
  const xL = widthBytesActual & 0xFF;
  const xH = (widthBytesActual >> 8) & 0xFF;
  const yL = altura & 0xFF;
  const yH = (altura >> 8) & 0xFF;

  return Buffer.concat([
    Buffer.from([0x1D, 0x76, 0x30, 0x00, xL, xH, yL, yH]),
    bitmap,
  ]);
}

// ── Comandos ESC/POS (texto latino) ──────────────────────────────────────────

const ESC = 0x1B;
const GS  = 0x1D;
const ANCHO_CHARS = 48;

const CMD = {
  INIT:         Buffer.from([ESC, 0x40]),
  ALIGN_LEFT:   Buffer.from([ESC, 0x61, 0x00]),
  ALIGN_CENTER: Buffer.from([ESC, 0x61, 0x01]),
  BOLD_ON:      Buffer.from([ESC, 0x45, 0x01]),
  BOLD_OFF:     Buffer.from([ESC, 0x45, 0x00]),
  SIZE_NORMAL:  Buffer.from([GS,  0x21, 0x00]),
  SIZE_2H:      Buffer.from([GS,  0x21, 0x01]),
  SIZE_2W:      Buffer.from([GS,  0x21, 0x10]),
  SIZE_2HW:     Buffer.from([GS,  0x21, 0x11]),
  SIZE_4X:      Buffer.from([GS,  0x21, 0x33]),
  LF:           Buffer.from([0x0A]),
  FEED_3:       Buffer.from([ESC, 0x64, 0x03]),
  CUT_PARTIAL:  Buffer.from([GS,  0x56, 0x01]),
};

// ── Helpers de texto latino ───────────────────────────────────────────────────

function separador(char = '-') {
  return Buffer.concat([
    CMD.ALIGN_LEFT,
    CMD.SIZE_NORMAL,
    iconv.encode(char.repeat(ANCHO_CHARS), 'cp437'),
    CMD.LF,
  ]);
}

function lineaCentrada(texto, size = 'normal') {
  const sizeMap = {
    normal: CMD.SIZE_NORMAL,
    '2h':   CMD.SIZE_2H,
    '2w':   CMD.SIZE_2W,
    '2hw':  CMD.SIZE_2HW,
    '4x':   CMD.SIZE_4X,
  };
  return Buffer.concat([
    CMD.ALIGN_CENTER,
    sizeMap[size] || CMD.SIZE_NORMAL,
    iconv.encode(texto, 'cp437'),
    CMD.LF,
    CMD.SIZE_NORMAL,
  ]);
}

// ── Línea de plato ────────────────────────────────────────────────────────────

/**
 * Genera el bloque para un plato:
 *  - Si tiene chino: bitmap con nombre chino + línea en español entre paréntesis
 *  - Si es latino (sushi, etc.): todo en ESC/POS CP437
 */
function lineaPlato(cantidad, nombreZh, nombreEs, modificaciones) {
  const partes = [];

  // Limpiar modificaciones para usarlas en ambos bloques
  const notasLimpias = (modificaciones || [])
    .map(m => m.replace(/\s*\(\+?[\d€][^)]*\)/g, '').trim())
    .filter(Boolean);
  const notaSufijo = notasLimpias.length > 0
    ? ' ---- ' + notasLimpias.join(', ').toUpperCase()
    : '';

  if (tieneChino(nombreZh)) {
    console.log(`  🖼️  Bitmap: "${cantidad}  ${nombreZh}"`);

    // Nombre chino + nota pequeña en el mismo bitmap
    if (notaSufijo) {
      // Renderizado mixto: chino grande + nota pequeña en la misma línea
      const fontGrande  = `${FONT_SIZE_PLATO}px "${chineseFontFamily}"`;
      const fontPequeno = `28px "${chineseFontFamily}"`;
      const padding = 4;
      const lineH = Math.ceil(FONT_SIZE_PLATO * 1.35);

      const tmpCanvas = createCanvas(PRINTER_PX, 10);
      const tmpCtx = tmpCanvas.getContext('2d');

      tmpCtx.font = fontGrande;
      const textoChino = `${cantidad}  ${nombreZh}  `;
      const anchoChino = tmpCtx.measureText(textoChino).width;

      tmpCtx.font = fontPequeno;
      const nota = notaSufijo.replace(/^ ---- /, '-- ');
      const anchoNota = tmpCtx.measureText(nota).width;

      // Si caben en una línea, misma línea; si no, segunda línea
      const cabenJuntos = (anchoChino + anchoNota) <= (PRINTER_PX - padding * 2);

      const alturaRaw = cabenJuntos ? lineH + padding * 2 : lineH * 2 + padding * 2;
      const altura = Math.ceil(alturaRaw / 8) * 8;

      const canvas = createCanvas(PRINTER_PX, altura);
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, PRINTER_PX, altura);
      ctx.fillStyle = '#000000';
      ctx.textBaseline = 'top';

      // Chino grande
      ctx.font = fontGrande;
      ctx.fillText(textoChino, padding, padding);

      // Nota pequeña — misma línea si cabe, si no segunda línea
      ctx.font = fontPequeno;
      const notaY = cabenJuntos
        ? padding + (FONT_SIZE_PLATO - 28) / 2  // centrado vertical respecto al chino
        : padding + lineH;
      const notaX = cabenJuntos ? padding + anchoChino : padding;
      ctx.fillText(nota, notaX, notaY);

      // Convertir a bitmap 1-bit
      const imgData = ctx.getImageData(0, 0, PRINTER_PX, altura);
      const widthBytes = Math.ceil(PRINTER_PX / 8);
      const bitmap = Buffer.alloc(widthBytes * altura, 0x00);
      for (let y = 0; y < altura; y++) {
        for (let x = 0; x < PRINTER_PX; x++) {
          const idx = (y * PRINTER_PX + x) * 4;
          const lum = 0.299 * imgData.data[idx] + 0.587 * imgData.data[idx+1] + 0.114 * imgData.data[idx+2];
          if (lum < THRESHOLD) {
            bitmap[y * widthBytes + Math.floor(x / 8)] |= (1 << (7 - (x % 8)));
          }
        }
      }
      const xL = widthBytes & 0xFF, xH = (widthBytes >> 8) & 0xFF;
      const yL = altura & 0xFF,     yH = (altura >> 8) & 0xFF;
      partes.push(CMD.ALIGN_LEFT);
      partes.push(Buffer.concat([Buffer.from([0x1D, 0x76, 0x30, 0x00, xL, xH, yL, yH]), bitmap]));
    } else {
      partes.push(CMD.ALIGN_LEFT);
      partes.push(renderizarBitmap(`${cantidad}  ${nombreZh}`, { fontSize: FONT_SIZE_PLATO, bold: false }));
    }

    // Nombre en español debajo
    if (nombreEs) {
      partes.push(CMD.ALIGN_LEFT);
      partes.push(iconv.encode(`     (${nombreEs})`, 'cp437'));
      partes.push(CMD.LF);
    }

  } else {
    // Nombre en español / romanji — ESC/POS normal
    console.log(`  📝 Texto: "${cantidad}  ${nombreZh}"`);
    partes.push(CMD.ALIGN_LEFT);
    partes.push(CMD.BOLD_ON);
    partes.push(CMD.SIZE_2H);
    partes.push(iconv.encode(`${cantidad}  ${nombreZh}`, 'cp437'));
    partes.push(CMD.SIZE_NORMAL);
    partes.push(CMD.LF);
    partes.push(CMD.BOLD_OFF);

    // Nota en la misma línea debajo
    if (notaSufijo) {
      partes.push(iconv.encode(`     ${notaSufijo.trim()}`, 'cp437'));
      partes.push(CMD.LF);
    }
  }

  return Buffer.concat(partes);
}

// ── Menú del Día ──────────────────────────────────────────────────────────────

/**
 * Genera el bloque para un Menú del Día completo.
 * Formato:
 *   MENU DEL DIA #1   (bold)
 *   * [bitmap 本店沙拉]
 *     (Ensalada de la Casa)
 *   * [bitmap 三鲜炒饭]
 *     (Arroz Frito Tres Delicias)
 *   ...
 */
function lineaMenuDia(titulo, platos) {
  const partes = [];

  // Título en bold y doble alto
  partes.push(CMD.ALIGN_LEFT);
  partes.push(CMD.BOLD_ON);
  partes.push(CMD.SIZE_2H);
  partes.push(iconv.encode(titulo, 'cp437'));
  partes.push(CMD.SIZE_NORMAL);
  partes.push(CMD.LF);
  partes.push(CMD.BOLD_OFF);

  for (const plato of platos) {
    if (plato.nombreZh && tieneChino(plato.nombreZh)) {
      console.log(`     🖼️  Menu bitmap: "* ${plato.nombreZh}"`);
      // "* 本店沙拉" como bitmap (tamaño ligeramente menor que platos normales)
      partes.push(CMD.ALIGN_LEFT);
      partes.push(renderizarBitmap(`* ${plato.nombreZh}`, { fontSize: 44 }));
      // "(Ensalada de la Casa)" como texto
      partes.push(CMD.ALIGN_LEFT);
      partes.push(iconv.encode(`  (${plato.nombreEs})`, 'cp437'));
      partes.push(CMD.LF);
    } else {
      // Sin traducción — solo español
      partes.push(CMD.ALIGN_LEFT);
      partes.push(iconv.encode(`* ${plato.nombreEs}`, 'cp437'));
      partes.push(CMD.LF);
    }
  }

  return Buffer.concat(partes);
}

// ── Menú del Día por secciones (camarero) ─────────────────────────────────────

const SECCION_LABEL = {
  Entrante: 'ENTRANTE:',
  ArrozFideos: 'PRIMER PLATO:',
  Principal: 'SEGUNDO PLATO:',
};
const SECCION_ORDEN = ['Entrante', 'ArrozFideos', 'Principal'];

/**
 * Genera el bloque para un Menú del Día agrupado por secciones, cada una
 * con varios platos y su cantidad.
 * Formato:
 *   MENU DEL DIA (4)
 *   ENTRANTE:
 *   3 [bitmap 味增汤]
 *     (Sopa Miso)
 *   1 [bitmap 本店沙拉]
 *     (Ensalada de la Casa)
 *   PRIMER PLATO:
 *   ...
 */
function lineaMenuDiaGrupo(titulo, secciones) {
  const partes = [];

  partes.push(CMD.ALIGN_LEFT);
  partes.push(CMD.BOLD_ON);
  partes.push(CMD.SIZE_2H);
  partes.push(iconv.encode(titulo, 'cp437'));
  partes.push(CMD.SIZE_NORMAL);
  partes.push(CMD.LF);
  partes.push(CMD.BOLD_OFF);

  for (const key of SECCION_ORDEN) {
    const items = secciones[key] || [];
    if (items.length === 0) continue;

    partes.push(CMD.ALIGN_LEFT);
    partes.push(CMD.BOLD_ON);
    partes.push(iconv.encode(SECCION_LABEL[key], 'cp437'));
    partes.push(CMD.LF);
    partes.push(CMD.BOLD_OFF);

    for (const plato of items) {
      if (plato.nombreZh && tieneChino(plato.nombreZh)) {
        console.log(`     🖼️  Menu bitmap: "${plato.cantidad} ${plato.nombreZh}"`);
        partes.push(CMD.ALIGN_LEFT);
        partes.push(renderizarBitmap(`${plato.cantidad}  ${plato.nombreZh}`, { fontSize: 44 }));
        partes.push(CMD.ALIGN_LEFT);
        partes.push(iconv.encode(`     (${plato.nombreEs})`, 'cp437'));
        partes.push(CMD.LF);
      } else {
        partes.push(CMD.ALIGN_LEFT);
        partes.push(iconv.encode(`${plato.cantidad} ${plato.nombreEs}`, 'cp437'));
        partes.push(CMD.LF);
      }
    }
  }

  return Buffer.concat(partes);
}

// ── Ticket principal ──────────────────────────────────────────────────────────

/**
 * Genera el buffer completo listo para enviar al socket TCP.
 *
 * @param {object} opts
 * @param {'mesa'|'recoger'} opts.tipo
 * @param {number}  opts.mesaNumero
 * @param {number}  [opts.numRecoger]
 * @param {string}  opts.hora          "HH:MM"
 * @param {boolean} opts.esAnadido
 * @param {Array}   opts.items         [{cantidad, nombreZh, modificaciones}]
 */
function generarTicket({ tipo, mesaNumero, numRecoger, hora, esAnadido, items }) {
  console.log(`\n🎫 Generando ticket: ${tipo === 'recoger' ? `RECOGER #${numRecoger}` : `MESA ${mesaNumero}`}${esAnadido ? ' (AÑADIDO)' : ''}`);

  const p = [];

  p.push(CMD.INIT);
  p.push(CMD.LF);

  // ── Cabecera ──────────────────────────────────────────────────────────────

  if (tipo === 'recoger') {
    p.push(separador('='));
    p.push(lineaCentrada('PARA RECOGER', '2hw'));
    p.push(separador('='));
    p.push(lineaCentrada(`N. ${numRecoger}`, '4x'));
    p.push(CMD.LF);
  } else {
    if (esAnadido) {
      p.push(separador('*'));
      p.push(lineaCentrada('** ANADIDO **', '2hw'));
      // 加 = "añadido" en chino — como bitmap centrado
      p.push(renderizarBitmap('加', { fontSize: 56, bold: true, centrar: true }));
      p.push(separador('*'));
    }
    p.push(lineaCentrada('MESA', '2w'));
    p.push(lineaCentrada(String(mesaNumero), '4x'));
    p.push(CMD.LF);
  }

  p.push(lineaCentrada(hora));
  p.push(CMD.LF);

  // ── Platos ────────────────────────────────────────────────────────────────

  p.push(separador('-'));

  for (const item of items) {
    if (item.esMenuDia) {
      if (item.secciones) p.push(lineaMenuDiaGrupo(item.titulo, item.secciones));
      else p.push(lineaMenuDia(item.titulo, item.platos));
    } else {
      p.push(lineaPlato(item.cantidad, item.nombreZh, item.nombreEs, item.modificaciones));
    }
  }

  p.push(separador('-'));

  // ── Corte ─────────────────────────────────────────────────────────────────

  p.push(CMD.FEED_3);
  p.push(CMD.CUT_PARTIAL);

  const total = Buffer.concat(p);
  console.log(`   Buffer total: ${total.length} bytes`);
  return total;
}

module.exports = { generarTicket };
