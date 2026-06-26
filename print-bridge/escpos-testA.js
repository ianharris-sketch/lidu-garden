/**
 * escpos-testA.js — Test de codificación GB2312 (Chino Simplificado)
 *
 * Secuencia:
 *   FS C 0x00  → Seleccionar GB2312
 *   FS &       → Activar modo dos bytes
 *   [texto GBK]
 *   FS .       → Desactivar modo dos bytes
 *
 * Uso: node escpos-testA.js | nc 192.168.1.137 9100
 */

'use strict';

const net   = require('net');
const iconv = require('iconv-lite');

const PRINTER = { ip: '192.168.1.137', port: 9100 };

const ESC = 0x1B;
const GS  = 0x1D;
const FS  = 0x1C;

// Muestras de texto chino para el test
const MUESTRAS = [
  'x1  三鲜炒饭',
  'x1  味增汤',
];

function buildTestA() {
  const partes = [];

  // Inicializar impresora
  partes.push(Buffer.from([ESC, 0x40]));
  partes.push(Buffer.from([0x0A]));

  // Cabecera (CP437, sin modo chino)
  partes.push(Buffer.from([ESC, 0x61, 0x01])); // centrar
  partes.push(iconv.encode('=== TEST: FS& sin FS C ===', 'cp437'));
  partes.push(Buffer.from([0x0A]));
  partes.push(iconv.encode('Solo FS & + GBK + FS .', 'cp437'));
  partes.push(Buffer.from([0x0A, 0x0A]));

  partes.push(Buffer.from([ESC, 0x61, 0x00])); // izquierda

  // SIN FS C — solo FS & + GBK puro + FS .
  // Si la impresora entiende modo dos bytes, debe imprimir el chino directamente.

  for (const texto of MUESTRAS) {
    partes.push(Buffer.from([FS, 0x26]));        // FS & — activar modo dos bytes
    partes.push(iconv.encode(texto, 'gbk'));
    partes.push(Buffer.from([FS, 0x2E]));        // FS . — desactivar modo dos bytes
    partes.push(Buffer.from([0x0A]));
  }

  partes.push(Buffer.from([0x0A]));
  partes.push(iconv.encode('Chino legible? -> FS& sin FS C funciona', 'cp437'));
  partes.push(Buffer.from([0x0A, 0x0A, 0x0A]));

  // Corte parcial
  partes.push(Buffer.from([GS, 0x56, 0x01]));

  return Buffer.concat(partes);
}

console.log(`[1] Conectando a ${PRINTER.ip}:${PRINTER.port}...`);

const socket = new net.Socket();
let enviado = false;

// Sin esto el socket cuelga en silencio si la IP no responde
socket.setTimeout(5000);

socket.connect(PRINTER.port, PRINTER.ip, () => {
  console.log('[2] Conexión establecida. Construyendo buffer...');
  const buf = buildTestA();
  console.log(`[3] Enviando ${buf.length} bytes...`);
  socket.write(buf, () => {
    enviado = true;
    console.log('[4] Buffer enviado. Cerrando socket...');
    socket.end();
  });
});

socket.on('close', () => {
  if (enviado) {
    console.log('[5] Socket cerrado OK. Ticket enviado.');
  } else {
    console.error('[5] Socket cerrado ANTES de enviar. No llegó nada a la impresora.');
  }
});

socket.on('timeout', () => {
  console.error(`[!] Timeout: la impresora no respondió en 5s (${PRINTER.ip}:${PRINTER.port})`);
  socket.destroy();
});

socket.on('error', (err) => {
  console.error(`[!] Error de red: ${err.message}`);
});
