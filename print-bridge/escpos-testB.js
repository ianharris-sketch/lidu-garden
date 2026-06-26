/**
 * escpos-testB.js — Test de codificación BIG5 (Chino Tradicional)
 *
 * Secuencia:
 *   FS C 0x01  → Seleccionar BIG5
 *   FS &       → Activar modo dos bytes
 *   [texto BIG5]
 *   FS .       → Desactivar modo dos bytes
 *
 * Uso: node escpos-testB.js | nc 192.168.1.100 9100
 */

'use strict';

const net   = require('net');
const iconv = require('iconv-lite');

const PRINTER = { ip: '192.168.1.137', port: 9100 };

const ESC = 0x1B;
const GS  = 0x1D;
const FS  = 0x1C;

// Mismas muestras — pero codificadas en BIG5
const MUESTRAS = [
  '三鮮炒飯',  // versión tradicional
  '宮保雞丁',
  '紅燒肉',
  '餃子',
];

function buildTestB() {
  const partes = [];

  // Inicializar impresora
  partes.push(Buffer.from([ESC, 0x40]));
  partes.push(Buffer.from([0x0A]));

  // Cabecera (CP437, sin modo chino)
  partes.push(Buffer.from([ESC, 0x61, 0x01])); // centrar
  partes.push(iconv.encode('=== TEST B: BIG5 ===', 'cp437'));
  partes.push(Buffer.from([0x0A]));
  partes.push(iconv.encode('FS C 0x01 + FS &', 'cp437'));
  partes.push(Buffer.from([0x0A, 0x0A]));

  partes.push(Buffer.from([ESC, 0x61, 0x00])); // izquierda

  // Seleccionar BIG5 (ANTES de activar el modo)
  partes.push(Buffer.from([FS, 0x43, 0x01])); // FS C 1 → BIG5

  for (const texto of MUESTRAS) {
    // Activar modo dos bytes
    partes.push(Buffer.from([FS, 0x26]));                // FS &
    partes.push(iconv.encode(texto, 'big5'));
    partes.push(Buffer.from([FS, 0x2E]));                // FS .
    partes.push(Buffer.from([0x0A]));
  }

  partes.push(Buffer.from([0x0A]));
  partes.push(iconv.encode('Si el chino es legible -> BIG5 correcto', 'cp437'));
  partes.push(Buffer.from([0x0A, 0x0A, 0x0A]));

  // Corte parcial
  partes.push(Buffer.from([GS, 0x56, 0x01]));

  return Buffer.concat(partes);
}

const socket = new net.Socket();
socket.connect(PRINTER.port, PRINTER.ip, () => {
  socket.write(buildTestB(), () => {
    console.log('Test B (BIG5) enviado.');
    socket.end();
  });
});
socket.on('error', err => console.error('Error:', err.message));
