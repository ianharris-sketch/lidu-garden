'use client';

import {
  ref,
  set,
  get,
  push,
  update,
  remove,
  onValue,
  runTransaction,
  off,
  DataSnapshot,
} from 'firebase/database';
import { db } from './firebase';
import type { Mesa, Pedido, ItemPedido, LogEntry, EstadoItem, EstadoMesa } from '@/types';

// ─── Logging ────────────────────────────────────────────────────────────────

export async function writeLog(tipo: string, datos: Record<string, unknown>, mesaId?: string) {
  const logsRef = ref(db, 'logs');
  const entry: Omit<LogEntry, 'id'> = {
    timestamp: Date.now(),
    tipo,
    datos,
    ...(mesaId ? { mesaId } : {}),
  };
  await push(logsRef, entry);
}

// ─── Mesas ───────────────────────────────────────────────────────────────────

export function onMesasChange(callback: (mesas: Record<string, Mesa>) => void) {
  const mesasRef = ref(db, 'mesas');
  onValue(mesasRef, (snap) => {
    callback(snap.val() || {});
  });
  return () => off(mesasRef);
}

export async function updateEstadoMesa(mesaId: string, estado: EstadoMesa) {
  await update(ref(db, `mesas/${mesaId}`), { estado });
}

// ─── Pedidos ─────────────────────────────────────────────────────────────────

export function onPedidosMesaChange(
  mesaId: string,
  callback: (pedidos: Record<string, Pedido>) => void
) {
  const pedidosRef = ref(db, `pedidos`);
  const handler = (snap: DataSnapshot) => {
    const all = snap.val() || {};
    const filtered: Record<string, Pedido> = {};
    Object.entries(all).forEach(([id, p]) => {
      const pedido = p as Pedido;
      if (pedido.mesaId === mesaId) filtered[id] = { ...pedido, id };
    });
    callback(filtered);
  };
  onValue(pedidosRef, handler);
  return () => off(pedidosRef);
}

export function onTodosPedidosChange(callback: (pedidos: Record<string, Pedido>) => void) {
  const pedidosRef = ref(db, 'pedidos');
  onValue(pedidosRef, (snap) => {
    const val = snap.val() || {};
    const withIds: Record<string, Pedido> = {};
    Object.entries(val).forEach(([id, p]) => {
      withIds[id] = { ...(p as Pedido), id };
    });
    callback(withIds);
  });
  return () => off(pedidosRef);
}

// Operación atómica: añadir items a un pedido activo de la mesa o crear uno nuevo.
// Usa runTransaction para evitar race conditions cuando varios comensales piden a la vez.
export async function enviarPedido(
  mesaId: string,
  mesaNumero: number,
  items: Omit<ItemPedido, 'id' | 'addedAt' | 'estado'>[]
): Promise<void> {
  const pedidosRef = ref(db, 'pedidos');
  const mesaRef = ref(db, `mesas/${mesaId}`);

  // Buscar pedido activo (no listo) de esta mesa
  const snap = await get(pedidosRef);
  const allPedidos = snap.val() || {};
  let pedidoActivoId: string | null = null;

  for (const [id, p] of Object.entries(allPedidos)) {
    const pedido = p as Pedido;
    if (pedido.mesaId === mesaId && pedido.estado !== 'listo') {
      pedidoActivoId = id;
      break;
    }
  }

  const now = Date.now();

  if (pedidoActivoId) {
    // Añadir items al pedido existente con transacción atómica
    const pedidoRef = ref(db, `pedidos/${pedidoActivoId}`);
    await runTransaction(pedidoRef, (currentPedido) => {
      if (!currentPedido) return currentPedido;
      const itemsActuales = currentPedido.items || {};
      items.forEach((item) => {
        const newItemRef = push(ref(db, `pedidos/${pedidoActivoId}/items`));
        const newKey = newItemRef.key!;
        itemsActuales[newKey] = {
          ...item,
          id: newKey,
          estado: 'pendiente' as EstadoItem,
          addedAt: now,
        };
      });
      return { ...currentPedido, items: itemsActuales, estado: 'pendiente' };
    });
  } else {
    // Crear pedido nuevo
    const newPedidoRef = push(pedidosRef);
    const newItems: Record<string, ItemPedido> = {};
    items.forEach((item) => {
      const key = push(ref(db, '_')).key!;
      newItems[key] = {
        ...item,
        id: key,
        estado: 'pendiente',
        addedAt: now,
      };
    });

    await set(newPedidoRef, {
      id: newPedidoRef.key,
      mesaId,
      items: newItems,
      timestamp: now,
      estado: 'pendiente',
      enviado: true,
    } satisfies Pedido);
  }

  // Actualizar estado de la mesa
  await update(mesaRef, { estado: 'con-pedido' as EstadoMesa });

  await writeLog('pedido_enviado', { mesaId, mesaNumero, items: items.length }, mesaId);
}

// Marcar un item individual como listo (desde cocina o camarero)
export async function marcarItemListo(pedidoId: string, itemId: string, mesaId: string) {
  await update(ref(db, `pedidos/${pedidoId}/items/${itemId}`), { estado: 'listo' as EstadoItem });

  // Comprobar si todos los items del pedido están listos → actualizar pedido y mesa
  const pedidoSnap = await get(ref(db, `pedidos/${pedidoId}`));
  const pedido = pedidoSnap.val() as Pedido;
  const allItems = Object.values(pedido.items || {});
  const todosListos = allItems.every((i) => i.estado === 'listo' || i.id === itemId);

  if (todosListos) {
    await update(ref(db, `pedidos/${pedidoId}`), { estado: 'listo' as EstadoPedido });
    // Los pedidos de recoger no tienen mesa que actualizar
    if (!mesaId.startsWith('recoger-')) {
      await update(ref(db, `mesas/${mesaId}`), { estado: 'listo-servir' as EstadoMesa });
    }
    await writeLog('pedido_listo', { pedidoId, mesaId }, mesaId);
  }
}

// Marcar mesa completa como servida → limpiar pedidos y vaciar mesa
export async function marcarMesaServida(mesaId: string, pedidoIds: string[]) {
  const updates: Record<string, null | EstadoMesa> = {};

  pedidoIds.forEach((id) => {
    updates[`pedidos/${id}`] = null;
  });

  await update(ref(db, '/'), updates as Record<string, unknown>);
  await update(ref(db, `mesas/${mesaId}`), { estado: 'vacia' as EstadoMesa });
  await writeLog('mesa_servida', { mesaId, pedidosEliminados: pedidoIds.length }, mesaId);
}

// Camarero añade items a una mesa manualmente
export async function camareroAnadirItems(
  mesaId: string,
  mesaNumero: number,
  items: Omit<ItemPedido, 'id' | 'addedAt' | 'estado'>[]
) {
  return enviarPedido(mesaId, mesaNumero, items);
}

// ─── Pedidos para recoger ────────────────────────────────────────────────────

// Incrementa el contador atómicamente y devuelve el nuevo número
async function siguienteNumeroRecoger(): Promise<number> {
  const contRef = ref(db, 'contadores/recoger');
  const result = await runTransaction(contRef, (current) => (current || 0) + 1);
  return result.snapshot.val() as number;
}

// Crear un pedido para recoger con número secuencial
export async function enviarPedidoRecoger(
  items: Omit<ItemPedido, 'id' | 'addedAt' | 'estado'>[]
): Promise<void> {
  const numero = await siguienteNumeroRecoger();
  const mesaId = `recoger-${numero}`;
  const pedidosRef = ref(db, 'pedidos');
  const newPedidoRef = push(pedidosRef);
  const now = Date.now();

  const newItems: Record<string, ItemPedido> = {};
  items.forEach((item) => {
    const key = push(ref(db, '_')).key!;
    newItems[key] = { ...item, id: key, estado: 'pendiente', addedAt: now };
  });

  await set(newPedidoRef, {
    id: newPedidoRef.key,
    mesaId,
    tipo: 'recoger',
    numeroRecoger: numero,
    items: newItems,
    timestamp: now,
    estado: 'pendiente',
    enviado: true,
  } satisfies Pedido);

  await writeLog('pedido_recoger_enviado', { numero, mesaId, items: items.length });
}

// Marcar pedido de recoger como entregado → eliminar de Firebase
export async function marcarRecogidaEntregada(pedidoId: string) {
  await update(ref(db, '/'), { [`pedidos/${pedidoId}`]: null } as Record<string, unknown>);
  await writeLog('recoger_entregado', { pedidoId });
}

type EstadoPedido = 'pendiente' | 'parcial' | 'listo';

// ─── Carrito compartido de mesa (tiempo real entre dispositivos) ─────────────

export interface CarritoItem {
  platoId: string;
  nombreEs: string;
  nombreZh: string;
  precio: number;
  cantidad: number;
  destino?: 'cocina' | 'barra';
  modificaciones?: string[];
}

export function onCarritoChange(
  mesaId: string,
  callback: (carrito: Record<string, CarritoItem>) => void
) {
  const carritoRef = ref(db, `carritos/${mesaId}`);
  onValue(carritoRef, (snap) => {
    callback(snap.val() || {});
  });
  return () => off(carritoRef);
}

// Añadir una unidad de un plato al carrito compartido (transacción atómica)
export async function añadirAlCarrito(
  mesaId: string,
  plato: { id: string; nombreEs: string; nombreZh: string; precio: number },
  modificaciones: string[],
  destino: 'cocina' | 'barra' = 'cocina'
) {
  const itemRef = ref(db, `carritos/${mesaId}/${plato.id}`);
  await runTransaction(itemRef, (current) => {
    if (current === null) {
      return {
        platoId: plato.id,
        nombreEs: plato.nombreEs,
        nombreZh: plato.nombreZh,
        precio: plato.precio,
        cantidad: 1,
        destino,
        ...(modificaciones.length > 0 ? { modificaciones } : {}),
      };
    }
    return {
      ...current,
      cantidad: current.cantidad + 1,
      ...(modificaciones.length > 0 ? { modificaciones } : {}),
    };
  });
}

// Quitar una unidad; elimina el nodo si la cantidad llega a 0
export async function quitarDelCarrito(mesaId: string, platoId: string) {
  const itemRef = ref(db, `carritos/${mesaId}/${platoId}`);
  await runTransaction(itemRef, (current) => {
    if (!current || current.cantidad <= 1) return null;
    return { ...current, cantidad: current.cantidad - 1 };
  });
}

// Vaciar el carrito completo de una mesa (tras enviar el pedido)
export async function limpiarCarrito(mesaId: string) {
  await remove(ref(db, `carritos/${mesaId}`));
}

// Añadir un Menú del Día configurado (con platos elegidos)
export async function añadirMenuDelDia(
  mesaId: string,
  numero: number,
  primer: string,
  segundo: string,
  principal: string,
  precio: number
): Promise<void> {
  const key = `men001_${Date.now()}`;
  const item: CarritoItem = {
    platoId: key,
    nombreEs: `Menú del Día #${numero}`,
    nombreZh: `Menú del Día #${numero}`,
    precio,
    cantidad: 1,
    destino: 'cocina',
    modificaciones: [
      `Primer: ${primer}`,
      `Segundo: ${segundo}`,
      `Principal: ${principal}`,
    ],
  };
  await set(ref(db, `carritos/${mesaId}/${key}`), item);
}

// Establecer (o reemplazar) un menú fijo con N personas
export async function setCarritoItemDirecto(
  mesaId: string,
  item: CarritoItem
): Promise<void> {
  if (item.cantidad <= 0) {
    await remove(ref(db, `carritos/${mesaId}/${item.platoId}`));
  } else {
    await set(ref(db, `carritos/${mesaId}/${item.platoId}`), item);
  }
}
