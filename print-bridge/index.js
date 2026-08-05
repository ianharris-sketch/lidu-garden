'use strict';
console.log('INICIO');

// Firebase web SDK necesita WebSocket global en Node.js
if (typeof WebSocket === 'undefined') {
  global.WebSocket = require('ws');
}

const net = require('net');
console.log('net OK');
const { initializeApp } = require('firebase/app');
console.log('firebase/app OK');
const { getDatabase, ref, onValue } = require('firebase/database');
console.log('firebase/database OK');
const { getAuth, signInAnonymously } = require('firebase/auth');
console.log('firebase/auth OK');
const { generarTicket } = require('./escpos');
console.log('escpos OK');

// ── Config ────────────────────────────────────────────────────────────────────

const FIREBASE = {
  apiKey:            'AIzaSyD7Sf8UUAxn7GPwaaWH2W9UwntcXw98kd0',
  authDomain:        'lidu-camarero.firebaseapp.com',
  databaseURL:       'https://lidu-camarero-default-rtdb.europe-west1.firebasedatabase.app',
  projectId:         'lidu-camarero',
  storageBucket:     'lidu-camarero.firebasestorage.app',
  messagingSenderId: '129339383693',
  appId:             '1:129339383693:web:125f972cfdaf22e3cc67c4',
};

const PRINTER_IP   = '192.168.1.100';
const PRINTER_PORT = 9100;

// ── Lookups ───────────────────────────────────────────────────────────────────

const MENU_DIA_ZH = {
  'Ensalada de la Casa':               '本店沙拉',
  'Rollo Vegetal Thai':                '泰卷',
  'Sopa Miso':                         '味增汤',
  'Sopa Agripicante':                  '酸辣汤',
  'Gyozas de Verdura con Pollo':       '锅贴',
  'Arroz Frito Tres Delicias':         '三鲜炒饭',
  'Tallarines con Pollo':              '鸡肉面',
  'Arroz Blanco':                      '白饭',
  'Arroz Frito LiDu':                  '丽都炒饭',
  'Dados de Pollo con Salsa de Curry': '咖喱鸡',
  'Pollo al Limón':                    '柠檬鸡',
  'Tiras de Pollo Almendrados':        '杏仁鸡白',
  'Pollo con Bambú y Setas Chinas':    '双冬鸡',
  'Ternera con Salsa de Ostras':       '耗油牛肉',
  'Ternera con Cebolla':               '洋葱牛肉',
  'Cerdo Agridulce':                   '古老肉',
  'Verduras al Wok':                   '炒什锦',
  'Pescado al Vapor':                  '蒸鱼',
};

const MENUS_FIJOS_ZH = {
  'Gyoza de Pollo con Verduras':             '锅贴',
  'Arroz Frito Japonés':                     '日本饭',
  'Solomillo de Ternera con Salsa Teriyaki': '日牛',
  'Dim Sum':                                 '点心',
  'Rollito Vegetal':                         '泰卷',
  'Arroz Frito con Huevo y Verduras':        '素菜饭',
  'Arroz Frito Tres Delicias':               '三鲜炒饭',
  'Pollo al Limón':                          '柠檬鸡',
  'Ternera con Salsa de Ostras':             '耗油牛肉',
  'Saquito de Fortuna':                      '发财袋',
  'Arroz Frito Estilo Shanghai':             '上海菜饭',
  'Pato con Salsa Ciruela y Jengibre':       '苏梅鸭',
  'Langostino con Salsa Curry Rojo Thai':    '咖喱虾',
  'Tofu con Salsa':                          '豆腐',
  'Tirabeques con Hongos Salteados':         '荷兰豆',
};

const CATEGORIA_ORDEN = {
  men: 0, nov: 1, ens: 2, sop: 3, ent: 4,
  arr: 5, mak: 6, sus: 7, sas: 8, pes: 9,
  pat: 10, pol: 11, ter: 12, rec: 13,
  pos: 14, beb: 15, caf: 16, vin: 17,
};

const CATEGORIAS_BARRA = new Set(['pos', 'beb', 'caf', 'vin']);

// ── Helpers ───────────────────────────────────────────────────────────────────

function stripSufijos(s) {
  return s.replace(/(\s*\([\+\d€][^)]*\))+\s*$/g, '').trim();
}

function prefijoCat(platoId) {
  return platoId.split('_')[0].replace(/\d+$/, '');
}

function esBarra(item) {
  if (item.destino === 'barra') return true;
  return CATEGORIAS_BARRA.has(prefijoCat(item.platoId));
}

function claveItem(item) {
  return item.platoId + '_' + (item.addedAt || 0);
}

function formatHora(ts) {
  return new Date(ts).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
}

// Formato antiguo (comensal, un plato por sección) — "Primer: X", "Segundo: X", "Principal: X"
function parsearMenuDiaViejo(item) {
  const m = (item.nombreEs || '').match(/#(\d+)/);
  const titulo = 'MENU DEL DIA #' + (m ? m[1] : '?');
  const platos = (item.modificacionesSeleccionadas || [])
    .filter(function(mod) { return /^(Primer|Segundo|Principal):\s/.test(mod); })
    .map(function(mod) {
      const sinPrefijo = mod.replace(/^(Primer|Segundo|Principal):\s*/, '');
      const nombreEs = stripSufijos(sinPrefijo);
      return { nombreEs: nombreEs, nombreZh: MENU_DIA_ZH[nombreEs] || '' };
    });
  return { esMenuDia: true, titulo: titulo, platos: platos };
}

// Formato nuevo (camarero, por secciones con cantidad) — "Entrante:3:X", "ArrozFideos:4:X", "Principal:2:X"
function parsearMenuDiaGrupo(item) {
  const mods = item.modificacionesSeleccionadas || [];
  let numPersonas = '?';
  const secciones = { Entrante: [], ArrozFideos: [], Principal: [] };
  mods.forEach(function(mod) {
    const mPersonas = mod.match(/^Personas:(\d+)$/);
    if (mPersonas) { numPersonas = mPersonas[1]; return; }
    const mItem = mod.match(/^(Entrante|ArrozFideos|Principal):(\d+):(.+)$/);
    if (mItem) {
      const nombreEs = stripSufijos(mItem[3]);
      secciones[mItem[1]].push({
        cantidad: parseInt(mItem[2], 10),
        nombreEs: nombreEs,
        nombreZh: MENU_DIA_ZH[nombreEs] || '',
      });
    }
  });
  return { esMenuDia: true, titulo: 'MENU DEL DIA (' + numPersonas + ')', secciones: secciones };
}

function parsearMenuDia(item) {
  const mods = item.modificacionesSeleccionadas || [];
  const esGrupo = mods.some(function(mod) { return /^(Entrante|ArrozFideos|Principal):\d+:/.test(mod); });
  return esGrupo ? parsearMenuDiaGrupo(item) : parsearMenuDiaViejo(item);
}

const MENUS_FIJOS_BARRA = new Set([
  'Mochi Japonés',
  'Pastel de Calabaza',
  'Crêpe Relleno de Crema de Soja',
  'Tiramisú Casero',
  'Mini Rollitos con Helado de Chocolate',
  'Pudding de Mango',
  'Helado de Té Matcha',
]);

function parsearMenuFijo(item) {
  const nombre = (item.nombreEs || '')
    .replace(/\s*\(mín\.[^)]*\)/i, '').trim().toUpperCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '');
  const titulo = nombre + ' ' + item.cantidad;
  const platos = (item.modificacionesSeleccionadas || [])
    .map(function(mod) {
      const nombreEs = stripSufijos(mod);
      return { nombreEs: nombreEs, nombreZh: MENUS_FIJOS_ZH[nombreEs] || '' };
    })
    .filter(function(p) { return !MENUS_FIJOS_BARRA.has(p.nombreEs); });
  return { esMenuDia: true, titulo: titulo, platos: platos };
}

// ── Estado ────────────────────────────────────────────────────────────────────

var itemsImpresos = new Map();
var primeraLectura = true;
var debounceTimer = null;
var imprimiendo = false;

// ── Impresión ─────────────────────────────────────────────────────────────────

function imprimirBuffer(buffer, etiqueta) {
  return new Promise(function(resolve) {
    var client = new net.Socket();
    var done = false;

    console.log('  🖨️  Conectando a ' + PRINTER_IP + ':' + PRINTER_PORT + ' ...');

    var timer = setTimeout(function() {
      if (!done) { done = true; client.destroy(); console.error('  ❌ Timeout (8s): ' + etiqueta); resolve(); }
    }, 8000);

    client.connect(PRINTER_PORT, PRINTER_IP, function() {
      console.log('  📤 Enviando ' + buffer.length + ' bytes...');
      client.write(buffer, function() { client.end(); });
    });

    client.on('close', function() {
      if (!done) { done = true; clearTimeout(timer); console.log('  ✅ Impreso: ' + etiqueta); resolve(); }
    });

    client.on('error', function(err) {
      if (!done) { done = true; clearTimeout(timer); console.error('  ❌ Error: ' + etiqueta + ' — ' + err.message); resolve(); }
    });
  });
}

function esperar(ms) {
  return new Promise(function(resolve) { setTimeout(resolve, ms); });
}

async function imprimirTicket(buffer, desc) {
  for (var i = 1; i <= 3; i++) {
    await imprimirBuffer(buffer, desc + ' (' + i + '/3)');
    if (i < 3) await esperar(3000);
  }
}

// ── Procesado ─────────────────────────────────────────────────────────────────

async function procesarPedidos(pedidos) {
  if (imprimiendo) {
    setTimeout(function() { procesarPedidos(pedidos); }, 1000);
    return;
  }
  imprimiendo = true;
  try {
  for (var pedidoId in pedidos) {
    var pedido = pedidos[pedidoId];
    if (!itemsImpresos.has(pedidoId)) itemsImpresos.set(pedidoId, new Set());
    var impresos = itemsImpresos.get(pedidoId);

    var todosItems = Object.values(pedido.items || {});
    var itemsCocina = todosItems.filter(function(i) { return !esBarra(i); });
    var itemsNuevos = itemsCocina.filter(function(i) { return !impresos.has(claveItem(i)); });

    if (itemsNuevos.length === 0) continue;

    itemsNuevos.forEach(function(i) { impresos.add(claveItem(i)); });
    itemsNuevos.sort(function(a, b) {
      return (CATEGORIA_ORDEN[prefijoCat(a.platoId)] || 99) - (CATEGORIA_ORDEN[prefijoCat(b.platoId)] || 99);
    });

    var tipo = pedido.tipo === 'recoger' ? 'recoger' : 'mesa';
    var mesaNum = (pedido.mesaId || '').replace('mesa-', '');
    var numRecoger = pedido.numeroRecoger || (pedido.mesaId || '').replace('recoger-', '');
    var hora = formatHora((itemsNuevos[0].addedAt || pedido.timestamp || Date.now()));
    var esAnadido = itemsCocina.length > itemsNuevos.length;

    var itemsTicket = itemsNuevos.map(function(item) {
      if (item.platoId.startsWith('men001_')) return parsearMenuDia(item);
      if (['men002','men003','men004','men005'].indexOf(item.platoId) >= 0) return parsearMenuFijo(item);
      return {
        cantidad:       item.cantidad,
        nombreZh:       item.nombreZh || '',
        nombreEs:       item.nombreEs || item.platoId,
        modificaciones: item.modificacionesSeleccionadas || [],
      };
    });

    var buffer = generarTicket({
      tipo:        tipo,
      mesaNumero:  mesaNum,
      numRecoger:  numRecoger,
      hora:        hora,
      esAnadido:   esAnadido,
      items:       itemsTicket,
    });

    var desc = tipo === 'recoger'
      ? 'PARA RECOGER #' + numRecoger
      : 'MESA ' + mesaNum + (esAnadido ? ' (AÑADIDO)' : '');

    console.log('\n📋 Nuevo pedido: ' + desc + ' — ' + itemsTicket.length + ' plato(s)');
    await imprimirTicket(buffer, desc);
  }
  } finally {
    imprimiendo = false;
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────

console.log('\n🍽️  LiDu Garden — Print Bridge');
console.log('📡 Impresora: ' + PRINTER_IP + ':' + PRINTER_PORT);
console.log('🔌 Conectando a Firebase...\n');

var app = initializeApp(FIREBASE);
var db = getDatabase(app);
var auth = getAuth(app);

console.log('🔑 Autenticando...');
signInAnonymously(auth).then(function(cred) {
  console.log('✅ Autenticado (uid: ' + cred.user.uid + ')');
  arrancarListener();
}).catch(function(err) {
  console.error('❌ Error de autenticación: ' + err.message);
  console.error('   Comprueba que Anonymous Auth está activado en Firebase Console.');
  process.exit(1);
});

function arrancarListener() {
var pedidosRef = ref(db, 'pedidos');

onValue(pedidosRef, function(snap) {
  var pedidos = snap.val() || {};

  if (primeraLectura) {
    primeraLectura = false;
    for (var pedidoId in pedidos) {
      var items = Object.values(pedidos[pedidoId].items || {});
      itemsImpresos.set(pedidoId, new Set(items.map(claveItem)));
    }
    console.log('✅ Firebase conectado — ' + Object.keys(pedidos).length + ' pedidos activos');
    console.log('👁️  Escuchando pedidos nuevos...\n');
    return;
  }

  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(function() { procesarPedidos(pedidos); }, 300);
});

process.on('SIGINT', function() {
  console.log('\n⛔ Print Bridge detenido.');
  process.exit(0);
});
} // fin arrancarListener
