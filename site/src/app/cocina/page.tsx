'use client';

import { useState, useEffect } from 'react';
import { onTodosPedidosChange, marcarItemListo, marcarMesaServida } from '@/lib/db';
import type { Pedido, ItemPedido } from '@/types';
import { PLATOS_MAP, getDestinoFromPlatoId, stripAlergenos, MENU_DIA_NOMBRE_ZH } from '@/data/menu';
import { CheckCircle, Clock, ChefHat, Package } from 'lucide-react';

const PASSWORD = '1234';

// Orden de categorías en pantalla de cocina (de arriba a abajo)
const CATEGORIA_ORDEN_COCINA: Record<string, number> = {
  entrantes:       0,
  sopas:           1,
  arroces:         2,
  sushi_maki:      3,
  sushi_pieza:     4,
  sashimi:         5,
  pescado:         6,
  pato:            7,
  pollo:           8,
  ternera:         9,
  recien_llegados: 10,
  postres:         11,
  bebidas:         12,
  cafe_te:         13,
  novedades:       14,
  ensaladas:       15,
  vinos:           16,
  menus:           17,
};

function ordenCategoria(item: ItemPedido): number {
  const plato = PLATOS_MAP[item.platoId] ?? PLATOS_MAP[item.platoId.split('_')[0]];
  if (!plato) return 99;
  return CATEGORIA_ORDEN_COCINA[plato.categoria] ?? 99;
}

function formatHora(timestamp: number) {
  return new Date(timestamp).toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function minutosDesde(timestamp: number) {
  return Math.floor((Date.now() - timestamp) / 60000);
}

export default function CocinaPage() {
  const [autenticado, setAutenticado] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [pedidos, setPedidos] = useState<Record<string, Pedido>>({});
  const [marcando, setMarcando] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!autenticado) return;
    const unsub = onTodosPedidosChange((todos) => {
      // Solo mostrar pedidos pendientes o parciales (no listos)
      const activos: Record<string, Pedido> = {};
      Object.entries(todos).forEach(([id, p]) => {
        if (p.estado !== 'listo') activos[id] = p;
      });
      setPedidos(activos);
    });
    return unsub;
  }, [autenticado]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === PASSWORD) {
      setAutenticado(true);
      setError(false);
    } else {
      setError(true);
    }
  };

  const handleItemListo = async (pedidoId: string, itemId: string, mesaId: string) => {
    const key = `${pedidoId}-${itemId}`;
    if (marcando.has(key)) return;
    setMarcando((prev) => new Set(prev).add(key));
    try {
      await marcarItemListo(pedidoId, itemId, mesaId);
    } finally {
      setMarcando((prev) => {
        const next = new Set(prev);
        next.delete(key);
        return next;
      });
    }
  };

  const handleMesaLista = async (pedidoId: string, mesaId: string, itemIds: string[]) => {
    for (const itemId of itemIds) {
      const key = `${pedidoId}-${itemId}`;
      if (!marcando.has(key)) {
        await marcarItemListo(pedidoId, itemId, mesaId);
      }
    }
  };

  // Pantalla de login
  if (!autenticado) {
    return (
      <div className="min-h-screen bg-foreground flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ChefHat size={32} className="text-white" />
            </div>
            <h1 className="text-3xl font-serif text-white font-semibold">Cocina</h1>
            <p className="text-white/60 mt-1 text-sm">LiDu Garden</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              className={`w-full bg-white/10 border rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary text-base ${
                error ? 'border-red-400' : 'border-white/20'
              }`}
              autoFocus
            />
            {error && (
              <p className="text-red-400 text-sm text-center">Contraseña incorrecta</p>
            )}
            <button
              type="submit"
              className="w-full bg-primary text-white rounded-xl py-3 font-semibold hover:bg-primary/90 transition-colors cursor-pointer"
            >
              Entrar
            </button>
          </form>
        </div>
      </div>
    );
  }

  const pedidosOrdenados = Object.values(pedidos)
    .filter(pedido => {
      const allItems = Object.values(pedido.items || {});
      return allItems.some(item => (item.destino ?? getDestinoFromPlatoId(item.platoId)) !== 'barra');
    })
    .sort((a, b) => a.timestamp - b.timestamp);

  return (
    <div className="min-h-screen bg-[#0f0a1a] text-white">
      {/* Header */}
      <header className="bg-[#1a1028] border-b border-white/10 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <ChefHat size={22} className="text-primary" />
          <h1 className="text-xl font-serif font-semibold">Cocina — LiDu Garden</h1>
        </div>
        <div className="flex items-center gap-2 text-white/50 text-sm">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span>{pedidosOrdenados.length} pedidos activos</span>
        </div>
      </header>

      {/* Pedidos */}
      <main className="p-4 md:p-6">
        {pedidosOrdenados.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-white/30">
            <CheckCircle size={48} className="mb-4" />
            <p className="text-lg font-medium">Todo al día</p>
            <p className="text-sm">No hay pedidos pendientes</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {pedidosOrdenados.map((pedido) => {
              const items = Object.values(pedido.items || {})
                .filter(item => {
                  const dest = item.destino ?? getDestinoFromPlatoId(item.platoId);
                  return dest !== 'barra';
                })
                .sort((a, b) => ordenCategoria(a) - ordenCategoria(b));
              const itemsPendientes = items.filter((i) => i.estado === 'pendiente');
              const mins = minutosDesde(pedido.timestamp);
              const urgente = mins >= 15;
              const esRecoger = pedido.tipo === 'recoger' || pedido.mesaId?.startsWith('recoger-');
              const numeroRecoger = pedido.numeroRecoger ?? pedido.mesaId?.replace('recoger-', '');
              const mesaNumero = pedido.mesaId.replace('mesa-', '');

              return (
                <div
                  key={pedido.id}
                  className={`rounded-2xl border p-5 flex flex-col gap-4 ${
                    esRecoger
                      ? 'bg-amber-900/20 border-amber-500/60'
                      : urgente
                      ? 'bg-red-900/30 border-red-500/50'
                      : 'bg-white/5 border-white/10'
                  }`}
                >
                  {/* Cabecera pedido */}
                  <div className="flex items-start justify-between">
                    <div>
                      {esRecoger ? (
                        <div>
                          <div className="flex items-center gap-2 mb-0.5">
                            <Package size={16} className="text-amber-400" />
                            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
                              Para recoger
                            </span>
                          </div>
                          <span className="text-4xl font-serif font-bold text-amber-300">
                            #{numeroRecoger}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-4xl font-serif font-bold text-primary">
                            {mesaNumero}
                          </span>
                          <span className="text-white/50 text-sm mt-1">Mesa</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1.5 text-white/50 text-xs mt-1">
                        <Clock size={12} />
                        <span>{formatHora(pedido.timestamp)}</span>
                        <span
                          className={`font-medium ${urgente && !esRecoger ? 'text-red-400' : 'text-white/40'}`}
                        >
                          ({mins} min)
                        </span>
                      </div>
                    </div>
                    {itemsPendientes.length > 0 && (
                      <button
                        onClick={() =>
                          handleMesaLista(
                            pedido.id,
                            pedido.mesaId,
                            itemsPendientes.map((i) => i.id)
                          )
                        }
                        className="px-3 py-1.5 bg-green-500 text-white rounded-lg text-xs font-semibold hover:bg-green-400 transition-colors cursor-pointer"
                      >
                        Todo listo
                      </button>
                    )}
                  </div>

                  {/* Items */}
                  <div className="space-y-2">
                    {items.map((item) => {
                      const key = `${pedido.id}-${item.id}`;
                      const estaMarcando = marcando.has(key);
                      const yaListo = item.estado === 'listo';

                      return (
                        <div
                          key={item.id}
                          className={`flex items-center justify-between gap-3 p-3 rounded-xl transition-all ${
                            yaListo
                              ? 'bg-green-900/20 opacity-50'
                              : 'bg-white/5 hover:bg-white/8'
                          }`}
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span
                                className={`text-sm font-bold px-2 py-0.5 rounded-md ${
                                  yaListo
                                    ? 'bg-green-500/20 text-green-400'
                                    : 'bg-primary/30 text-primary-foreground'
                                }`}
                              >
                                {item.cantidad}
                              </span>
                              <span className="text-white font-medium text-lg leading-tight">
                                {item.nombreZh}
                              </span>
                            </div>
                            <p className="text-white/40 text-xs mt-0.5 ml-10">{stripAlergenos(item.nombreEs)}</p>
                            {/* Modificaciones seleccionadas */}
                            {item.modificacionesSeleccionadas && item.modificacionesSeleccionadas.length > 0 && (
                              <p className="text-amber-300/80 text-xs mt-0.5 ml-10 font-medium">
                                {item.modificacionesSeleccionadas.map((mod) => {
                                  // "Primer: Ensalada de la Casa (3,12)" → "一: 本店沙拉"
                                  const match = mod.match(/^(Primer|Segundo|Principal):\s*(.+)$/);
                                  if (match) {
                                    const etiquetas: Record<string, string> = { Primer: '一', Segundo: '二', Principal: '主' };
                                    const nombreEs = stripAlergenos(match[2]);
                                    const nombreZh = MENU_DIA_NOMBRE_ZH[nombreEs] ?? nombreEs;
                                    return `${etiquetas[match[1]]}: ${nombreZh}`;
                                  }
                                  return stripAlergenos(mod);
                                }).join(' · ')}
                              </p>
                            )}
                          </div>
                          {!yaListo && (
                            <button
                              onClick={() =>
                                handleItemListo(pedido.id, item.id, pedido.mesaId)
                              }
                              disabled={estaMarcando}
                              className="flex-shrink-0 w-9 h-9 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center hover:bg-green-500 hover:text-white transition-colors disabled:opacity-50 cursor-pointer"
                              aria-label="Marcar como listo"
                            >
                              <CheckCircle size={18} />
                            </button>
                          )}
                          {yaListo && (
                            <CheckCircle size={18} className="text-green-500 flex-shrink-0" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
