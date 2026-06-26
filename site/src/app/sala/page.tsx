'use client';

import { useState, useEffect, useRef } from 'react';
import {
  onMesasChange,
  onTodosPedidosChange,
  marcarMesaServida,
  camareroAnadirItems,
  marcarItemListo,
  enviarPedidoRecoger,
  marcarRecogidaEntregada,
} from '@/lib/db';
import type { Mesa, Pedido, EstadoMesa, ItemPedido } from '@/types';
import {
  MESAS_INICIALES, PLATOS, CATEGORIAS, getDestinoFromPlatoId, getDestino, stripAlergenos,
  SELECTORES_OBLIGATORIOS, MENUS_FIJOS,
  MENU_DIA_PRIMER, MENU_DIA_SEGUNDO, MENU_DIA_PRINCIPAL, MENU_DIA_PRECIO_BASE,
} from '@/data/menu';
import type { Categoria, Plato } from '@/types';
import {
  CheckCircle, Clock, Circle, ChevronLeft, Plus, Minus, X,
  UtensilsCrossed, ShoppingBag, Package, ChevronRight,
} from 'lucide-react';

const PASSWORD = '1234';

type VistaActual = 'grid' | 'mesa';
type ItemConPedido = ItemPedido & { pedidoId: string };
interface MesaEnriquecida extends Mesa { id: string; pedidos: Pedido[]; }

type CarritoSalaEntry = {
  plato: Plato;
  cantidad: number;
  nota?: string;
  mods?: string[];
};

type MenuDiaItemSel = { nombre: string; cantidad: number };

type MenuDiaEntry = {
  numero: number;
  numPersonas: number;
  entrante: MenuDiaItemSel[];
  arrozFideos: MenuDiaItemSel[];
  principal: MenuDiaItemSel[];
  precio: number;
  nota?: string;
};

/** Suma del suplemento de las opciones elegidas en una sección (cantidad × suplemento) */
function sumarSuplementos(sel: Record<string, number>, opciones: { nombre: string; suplemento: number }[]): number {
  return Object.entries(sel).reduce((s, [nombre, cantidad]) => {
    const op = opciones.find(o => o.nombre === nombre);
    return s + (op ? op.suplemento * cantidad : 0);
  }, 0);
}

function EstadoBadge({ estado }: { estado: EstadoMesa }) {
  if (estado === 'vacia')
    return (
      <span className="text-xs text-muted-foreground flex items-center gap-1">
        <Circle size={8} className="fill-current" /> Libre
      </span>
    );
  if (estado === 'con-pedido')
    return (
      <span className="text-xs text-amber-600 flex items-center gap-1 font-medium">
        <Clock size={10} /> En cocina
      </span>
    );
  return (
    <span className="text-xs text-green-600 flex items-center gap-1 font-medium">
      <CheckCircle size={10} /> Listo
    </span>
  );
}

export default function SalaPage() {
  const [autenticado, setAutenticado] = useState(false);
  const [password, setPassword] = useState('');
  const [errorLogin, setErrorLogin] = useState(false);

  const [mesas, setMesas] = useState<Record<string, Mesa>>({});
  const [pedidos, setPedidos] = useState<Record<string, Pedido>>({});
  const [vista, setVista] = useState<VistaActual>('grid');
  const [mesaSeleccionada, setMesaSeleccionada] = useState<string | null>(null);

  // ── Panel añadir platos (mesa) ─────────────────────────────────────────────
  const [mostrarAnadir, setMostrarAnadir] = useState(false);
  const [categoriaActiva, setCategoriaActiva] = useState<Categoria>('entrantes');
  const [carrito, setCarrito] = useState<Record<string, CarritoSalaEntry>>({});
  const [menusDiaCarrito, setMenusDiaCarrito] = useState<MenuDiaEntry[]>([]);
  const [enviando, setEnviando] = useState(false);
  const [confirmarEnvio, setConfirmarEnvio] = useState(false);

  // ── Modal selector / menú fijo (compartido entre mesa y recoger) ───────────
  const [modalPlato, setModalPlato] = useState<Plato | null>(null);
  const [modalOpcion, setModalOpcion] = useState('');
  const [modalNota, setModalNota] = useState('');
  const [modalPersonas, setModalPersonas] = useState(2);
  const [modalContexto, setModalContexto] = useState<'mesa' | 'recoger'>('mesa');

  // ── Modal Menú del Día ─────────────────────────────────────────────────────
  const [menuDiaPaso, setMenuDiaPaso] = useState<0 | 1 | 2 | 3>(0);
  const [menuDiaEntrante, setMenuDiaEntrante] = useState<Record<string, number>>({});
  const [menuDiaArroz, setMenuDiaArroz] = useState<Record<string, number>>({});
  const [menuDiaPrincipalSel, setMenuDiaPrincipalSel] = useState<Record<string, number>>({});
  const [menuDiaNumPersonas, setMenuDiaNumPersonas] = useState(1);
  const [menuDiaNota, setMenuDiaNota] = useState('');
  const [menuDiaContexto, setMenuDiaContexto] = useState<'mesa' | 'recoger'>('mesa');

  // ── Panel pedido para recoger ──────────────────────────────────────────────
  const [mostrarPanelRecoger, setMostrarPanelRecoger] = useState(false);
  const [categoriaRecoger, setCategoriaRecoger] = useState<Categoria>('entrantes');
  const [carritoRecoger, setCarritoRecoger] = useState<Record<string, CarritoSalaEntry>>({});
  const [menusDiaRecoger, setMenusDiaRecoger] = useState<MenuDiaEntry[]>([]);
  const [enviandoRecoger, setEnviandoRecoger] = useState(false);
  const [confirmarEnvioRecoger, setConfirmarEnvioRecoger] = useState(false);

  // ── Misc ───────────────────────────────────────────────────────────────────
  const [marcandoSala, setMarcandoSala] = useState<Set<string>>(new Set());
  const [mesasConAlerta, setMesasConAlerta] = useState<Set<string>>(new Set());
  const initialLoadRef = useRef(true);
  const seenPedidoIdsRef = useRef(new Set<string>());

  useEffect(() => {
    if (!autenticado) return;
    const unsubMesas = onMesasChange(setMesas);
    const unsubPedidos = onTodosPedidosChange((todos) => {
      setPedidos(todos);
      if (initialLoadRef.current) {
        seenPedidoIdsRef.current = new Set(Object.keys(todos));
        initialLoadRef.current = false;
        return;
      }
      const nuevosIds = Object.keys(todos).filter(
        id => !seenPedidoIdsRef.current.has(id) && todos[id].estado !== 'listo'
      );
      if (nuevosIds.length > 0) {
        const nuevasMesas = nuevosIds.map(id => todos[id].mesaId).filter(m => !m.startsWith('recoger-'));
        if (nuevasMesas.length > 0) setMesasConAlerta(prev => new Set([...prev, ...nuevasMesas]));
        nuevosIds.forEach(id => seenPedidoIdsRef.current.add(id));
      }
    });
    return () => { unsubMesas(); unsubPedidos(); };
  }, [autenticado]);

  // ── Handlers generales ────────────────────────────────────────────────────

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === PASSWORD) { setAutenticado(true); setErrorLogin(false); }
    else setErrorLogin(true);
  };

  const handleOpenMesa = (mesaId: string) => {
    setMesaSeleccionada(mesaId);
    setVista('mesa');
    setMesasConAlerta(prev => { const n = new Set(prev); n.delete(mesaId); return n; });
  };

  const handleServir = async () => {
    if (!mesaActual) return;
    await marcarMesaServida(mesaActual.id, mesaActual.pedidos.map(p => p.id));
    setVista('grid');
    setMesaSeleccionada(null);
  };

  const handleItemServidoSala = async (pedidoId: string, itemId: string, mesaId: string) => {
    const key = `${pedidoId}-${itemId}`;
    if (marcandoSala.has(key)) return;
    setMarcandoSala(prev => new Set(prev).add(key));
    try { await marcarItemListo(pedidoId, itemId, mesaId); }
    finally { setMarcandoSala(prev => { const n = new Set(prev); n.delete(key); return n; }); }
  };

  // ── Carrito helpers ────────────────────────────────────────────────────────

  const getCarrito = (ctx: 'mesa' | 'recoger') => ctx === 'mesa' ? carrito : carritoRecoger;
  const setCtxCarrito = (ctx: 'mesa' | 'recoger') => ctx === 'mesa' ? setCarrito : setCarritoRecoger;
  const getMenusDia = (ctx: 'mesa' | 'recoger') => ctx === 'mesa' ? menusDiaCarrito : menusDiaRecoger;
  const setMenusDia = (ctx: 'mesa' | 'recoger') => ctx === 'mesa' ? setMenusDiaCarrito : setMenusDiaRecoger;

  /** Clic en "Añadir" de un plato — abre modal si especial, añade directo si normal */
  const handleClickAnadir = (plato: Plato, ctx: 'mesa' | 'recoger' = 'mesa') => {
    if (plato.id === 'men001') {
      setMenuDiaPaso(1);
      setMenuDiaEntrante({}); setMenuDiaArroz({});
      setMenuDiaPrincipalSel({}); setMenuDiaNumPersonas(1); setMenuDiaNota('');
      setMenuDiaContexto(ctx);
      return;
    }
    if (plato.id in SELECTORES_OBLIGATORIOS || plato.id in MENUS_FIJOS) {
      setModalPlato(plato);
      setModalOpcion(''); setModalNota('');
      if (plato.id in MENUS_FIJOS) setModalPersonas(MENUS_FIJOS[plato.id].minPersonas);
      setModalContexto(ctx);
      return;
    }
    // Plato normal — añadir directo, nota aparece inline
    setCtxCarrito(ctx)(prev => ({
      ...prev,
      [plato.id]: { plato, cantidad: (prev[plato.id]?.cantidad || 0) + 1, nota: prev[plato.id]?.nota },
    }));
  };

  const handleQuitar = (key: string, ctx: 'mesa' | 'recoger' = 'mesa') => {
    setCtxCarrito(ctx)(prev => {
      const actual = prev[key]?.cantidad || 0;
      if (actual <= 1) { const n = { ...prev }; delete n[key]; return n; }
      return { ...prev, [key]: { ...prev[key], cantidad: actual - 1 } };
    });
  };

  const handleSetNota = (key: string, nota: string, ctx: 'mesa' | 'recoger' = 'mesa') => {
    setCtxCarrito(ctx)(prev => prev[key] ? { ...prev, [key]: { ...prev[key], nota } } : prev);
  };

  /** Confirmar modal selector / menú fijo */
  const confirmarModalPlato = () => {
    if (!modalPlato) return;
    const plato = modalPlato;
    let key: string;
    let mods: string[] = [];

    if (plato.id in SELECTORES_OBLIGATORIOS) {
      if (!modalOpcion) return; // opción obligatoria
      key = `${plato.id}__${modalOpcion.replace(/\s+/g, '_')}`;
      mods = [modalOpcion];
    } else {
      // Menú fijo
      key = plato.id;
      mods = [...MENUS_FIJOS[plato.id].platos];
    }
    if (modalNota.trim()) mods = [...mods, modalNota.trim()];

    setCtxCarrito(modalContexto)(prev => ({
      ...prev,
      [key]: {
        plato,
        cantidad: plato.id in MENUS_FIJOS ? modalPersonas : ((prev[key]?.cantidad || 0) + 1),
        nota: undefined,
        mods: mods.length ? mods : undefined,
      },
    }));
    setModalPlato(null);
  };

  /** Confirmar Menú del Día */
  const confirmarMenuDelDia = () => {
    const totalEntrante = Object.values(menuDiaEntrante).reduce((s, n) => s + n, 0);
    const totalArroz = Object.values(menuDiaArroz).reduce((s, n) => s + n, 0);
    const totalPrincipal = Object.values(menuDiaPrincipalSel).reduce((s, n) => s + n, 0);
    if (totalEntrante === 0 || totalArroz === 0 || totalPrincipal === 0) return;

    const precio =
      menuDiaNumPersonas * MENU_DIA_PRECIO_BASE +
      sumarSuplementos(menuDiaEntrante, MENU_DIA_PRIMER) +
      sumarSuplementos(menuDiaArroz, MENU_DIA_SEGUNDO) +
      sumarSuplementos(menuDiaPrincipalSel, MENU_DIA_PRINCIPAL);

    const toList = (sel: Record<string, number>): MenuDiaItemSel[] =>
      Object.entries(sel).map(([nombre, cantidad]) => ({ nombre, cantidad }));

    const ctx = menuDiaContexto;
    setMenusDia(ctx)(prev => [
      ...prev,
      {
        numero: prev.length + 1,
        numPersonas: menuDiaNumPersonas,
        entrante: toList(menuDiaEntrante),
        arrozFideos: toList(menuDiaArroz),
        principal: toList(menuDiaPrincipalSel),
        precio,
        nota: menuDiaNota.trim() || undefined,
      },
    ]);
    setMenuDiaPaso(0);
  };

  /** Resumen corto de un Menú del Día para mostrar en el listado del carrito */
  const resumenMenuDia = (menu: MenuDiaEntry): string => {
    const partes = [...menu.entrante, ...menu.arrozFideos, ...menu.principal]
      .map(it => `${it.cantidad} ${stripAlergenos(it.nombre)}`);
    return partes.join(' · ');
  };

  // ── Helpers de cantidad para las secciones del Menú del Día ────────────────
  const menuDiaInc = (setter: React.Dispatch<React.SetStateAction<Record<string, number>>>, nombre: string) =>
    setter(prev => ({ ...prev, [nombre]: (prev[nombre] || 0) + 1 }));

  const menuDiaDec = (setter: React.Dispatch<React.SetStateAction<Record<string, number>>>, nombre: string) =>
    setter(prev => {
      const c = (prev[nombre] || 0) - 1;
      if (c <= 0) { const n = { ...prev }; delete n[nombre]; return n; }
      return { ...prev, [nombre]: c };
    });

  /** Construir lista de items para enviar a Firebase */
  const buildItems = (
    cart: Record<string, CarritoSalaEntry>,
    menusDia: MenuDiaEntry[]
  ): Omit<ItemPedido, 'id' | 'addedAt' | 'estado'>[] => {
    const items: Omit<ItemPedido, 'id' | 'addedAt' | 'estado'>[] = [];
    for (const entry of Object.values(cart)) {
      const allMods = [...(entry.mods || []), ...(entry.nota?.trim() ? [entry.nota.trim()] : [])];
      items.push({
        platoId: entry.plato.id,
        nombreEs: entry.plato.nombreEs,
        nombreZh: entry.plato.nombreZh,
        precio: entry.plato.precio,
        cantidad: entry.cantidad,
        destino: getDestino(entry.plato.categoria),
        ...(allMods.length ? { modificacionesSeleccionadas: allMods } : {}),
      });
    }
    for (const [i, menu] of menusDia.entries()) {
      const mods = [
        `Personas:${menu.numPersonas}`,
        ...menu.entrante.map(it => `Entrante:${it.cantidad}:${it.nombre}`),
        ...menu.arrozFideos.map(it => `ArrozFideos:${it.cantidad}:${it.nombre}`),
        ...menu.principal.map(it => `Principal:${it.cantidad}:${it.nombre}`),
        ...(menu.nota ? [menu.nota] : []),
      ];
      items.push({
        platoId: `men001_${Date.now()}_${i}`,
        nombreEs: `Menú del Día (${menu.numPersonas})`,
        nombreZh: `Menú del Día (${menu.numPersonas})`,
        precio: menu.precio,
        cantidad: 1,
        destino: 'cocina',
        modificacionesSeleccionadas: mods,
      });
    }
    return items;
  };

  const enviarAdicional = async () => {
    if (!mesaActual) return;
    const items = buildItems(carrito, menusDiaCarrito);
    if (!items.length) return;
    setEnviando(true);
    await camareroAnadirItems(mesaActual.id, mesaActual.numero, items);
    setCarrito({}); setMenusDiaCarrito([]);
    setMostrarAnadir(false); setConfirmarEnvio(false);
    setEnviando(false);
  };

  const enviarRecoger = async () => {
    const items = buildItems(carritoRecoger, menusDiaRecoger);
    if (!items.length || enviandoRecoger) return;
    setEnviandoRecoger(true);
    try {
      await enviarPedidoRecoger(items);
      setCarritoRecoger({}); setMenusDiaRecoger([]);
      setMostrarPanelRecoger(false); setConfirmarEnvioRecoger(false);
    } finally { setEnviandoRecoger(false); }
  };

  // ── Datos derivados ────────────────────────────────────────────────────────

  const mesasEnriquecidas: MesaEnriquecida[] = MESAS_INICIALES.map(({ id, numero, zona }) => ({
    id, numero, zona,
    estado: mesas[id]?.estado || 'vacia',
    pedidos: Object.values(pedidos).filter(p => p.mesaId === id),
  }));

  const pedidosRecoger = Object.values(pedidos)
    .filter(p => p.tipo === 'recoger' || p.mesaId?.startsWith('recoger-'))
    .sort((a, b) => a.timestamp - b.timestamp);

  const mesaActual = mesaSeleccionada ? mesasEnriquecidas.find(m => m.id === mesaSeleccionada) : null;

  const totalCarritoMesa = Object.values(carrito).reduce((s, i) => s + i.cantidad, 0) + menusDiaCarrito.length;
  const totalCarritoRecoger = Object.values(carritoRecoger).reduce((s, i) => s + i.cantidad, 0) + menusDiaRecoger.length;

  // ── Helpers de renderizado ────────────────────────────────────────────────

  /** Cuenta cuántas unidades de un plato hay en el carrito (incluye entradas con clave extendida) */
  const cantEnCarrito = (platoId: string, ctx: 'mesa' | 'recoger') => {
    const cart = getCarrito(ctx);
    return Object.entries(cart)
      .filter(([k]) => k === platoId || k.startsWith(`${platoId}__`))
      .reduce((s, [, v]) => s + v.cantidad, 0);
  };

  /** JSX del listado de platos de un panel (mesa o recoger) */
  const renderPlatosList = (ctx: 'mesa' | 'recoger', categoriaFiltro: Categoria) => {
    const cart = getCarrito(ctx);
    return PLATOS.filter(p => p.categoria === categoriaFiltro).map(plato => {
      const isMenuDia = plato.id === 'men001';
      const hasSelector = plato.id in SELECTORES_OBLIGATORIOS;
      const isMenuFijo = plato.id in MENUS_FIJOS;
      const isSpecial = isMenuDia || hasSelector || isMenuFijo;

      // Para platos normales: clave simple
      const cant = !isSpecial ? (cart[plato.id]?.cantidad || 0) : 0;
      // Para selectores: entradas con clave extendida
      const selectorEntries = hasSelector
        ? Object.entries(cart).filter(([k]) => k.startsWith(`${plato.id}__`))
        : [];
      // Cuenta total para badge
      const totalEspecial = isMenuDia
        ? getMenusDia(ctx).length
        : cantEnCarrito(plato.id, ctx);

      return (
        <div key={plato.id} className="rounded-xl border border-border overflow-hidden">
          <div className="flex items-center justify-between gap-3 p-3">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground leading-tight">{plato.nombreEs}</p>
              <p className="text-xs text-accent mt-0.5">{plato.precio.toFixed(2)} €</p>
            </div>

            {isSpecial ? (
              <div className="flex items-center gap-2 flex-shrink-0">
                {totalEspecial > 0 && (
                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                    {totalEspecial}×
                  </span>
                )}
                <button
                  onClick={() => handleClickAnadir(plato, ctx)}
                  className="px-3 py-1.5 bg-primary text-white rounded-full text-xs font-medium cursor-pointer flex items-center gap-1"
                >
                  <Plus size={12} /> Añadir
                </button>
              </div>
            ) : cant > 0 ? (
              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={() => handleQuitar(plato.id, ctx)} className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center cursor-pointer"><Minus size={12} /></button>
                <span className="w-4 text-center text-sm font-semibold">{cant}</span>
                <button onClick={() => handleClickAnadir(plato, ctx)} className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center cursor-pointer"><Plus size={12} /></button>
              </div>
            ) : (
              <button onClick={() => handleClickAnadir(plato, ctx)} className="px-3 py-1.5 bg-primary text-white rounded-full text-xs font-medium cursor-pointer flex items-center gap-1 flex-shrink-0">
                <Plus size={12} /> Añadir
              </button>
            )}
          </div>

          {/* Nota inline para platos normales */}
          {!isSpecial && cant > 0 && (
            <div className="px-3 pb-3">
              <input
                type="text"
                placeholder="Nota: ej. sin picante, sin zanahoria..."
                value={cart[plato.id]?.nota || ''}
                onChange={e => handleSetNota(plato.id, e.target.value, ctx)}
                className="w-full text-xs border border-border rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary placeholder-muted-foreground/50"
              />
            </div>
          )}

          {/* Sub-entradas de selector (ej: dos Cocas + una Fanta) */}
          {hasSelector && selectorEntries.length > 0 && (
            <div className="px-3 pb-2 space-y-1 border-t border-border/50 pt-2">
              {selectorEntries.map(([key, entry]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{entry.cantidad} {entry.mods?.[0]}</span>
                  <div className="flex items-center gap-1">
                    <button onClick={() => handleQuitar(key, ctx)} className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center cursor-pointer"><Minus size={9} /></button>
                    <button
                      onClick={() => setCtxCarrito(ctx)(prev => ({ ...prev, [key]: { ...prev[key], cantidad: prev[key].cantidad + 1 } }))}
                      className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center cursor-pointer"
                    ><Plus size={9} /></button>
                    <button
                      onClick={() => setCtxCarrito(ctx)(prev => { const n = { ...prev }; delete n[key]; return n; })}
                      className="w-5 h-5 rounded-full bg-red-50 text-red-500 flex items-center justify-center cursor-pointer ml-1"
                    ><X size={9} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    });
  };

  // ── LOGIN ─────────────────────────────────────────────────────────────────

  if (!autenticado) {
    return (
      <div className="min-h-screen bg-foreground flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center mx-auto mb-4">
              <UtensilsCrossed size={32} className="text-white" />
            </div>
            <h1 className="text-3xl font-serif text-white font-semibold">Sala</h1>
            <p className="text-white/60 mt-1 text-sm">LiDu Garden</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Contraseña"
              className={`w-full bg-white/10 border rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-accent text-base ${errorLogin ? 'border-red-400' : 'border-white/20'}`}
              autoFocus
            />
            {errorLogin && <p className="text-red-400 text-sm text-center">Contraseña incorrecta</p>}
            <button type="submit" className="w-full bg-accent text-white rounded-xl py-3 font-semibold hover:bg-accent/90 transition-colors cursor-pointer">
              Entrar
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ── VISTA DETALLE DE MESA ─────────────────────────────────────────────────

  if (vista === 'mesa' && mesaActual) {
    const todosLosItems: ItemConPedido[] = mesaActual.pedidos.flatMap(p =>
      Object.values(p.items || {}).map(item => ({ ...item, pedidoId: p.id }))
    );
    const itemsCocina = todosLosItems.filter(i => (i.destino ?? getDestinoFromPlatoId(i.platoId)) !== 'barra');
    const itemsBarra = todosLosItems.filter(i => (i.destino ?? getDestinoFromPlatoId(i.platoId)) === 'barra');
    const itemsCocinaPendientes = itemsCocina.filter(i => i.estado === 'pendiente');
    const itemsBarraPendientes = itemsBarra.filter(i => i.estado === 'pendiente');
    const itemsListos = todosLosItems.filter(i => i.estado === 'listo');
    const totalConsumo = todosLosItems.reduce((s, i) => s + i.precio * i.cantidad, 0);

    return (
      <div className="min-h-screen bg-background flex flex-col">
        <header className="sticky top-0 z-30 bg-white border-b border-border px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => { setVista('grid'); setMesaSeleccionada(null); }}
            className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center hover:bg-muted transition-colors cursor-pointer"
            aria-label="Volver"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-serif font-semibold">Mesa {mesaActual.numero}</h1>
            <p className="text-xs text-muted-foreground capitalize">{mesaActual.zona}</p>
          </div>
          <button
            onClick={() => setMostrarAnadir(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors cursor-pointer"
          >
            <Plus size={16} />
            Añadir plato
          </button>
        </header>

        <main className="flex-1 p-4 space-y-4 max-w-2xl mx-auto w-full pb-32">
          {todosLosItems.length > 0 && (
            <div className="bg-white rounded-2xl border border-border p-4 flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Total mesa</span>
              <span className="text-2xl font-serif font-semibold text-accent">{totalConsumo.toFixed(2)} €</span>
            </div>
          )}

          {itemsCocinaPendientes.length > 0 && (
            <div className="bg-amber-50 rounded-2xl border border-amber-200 p-4">
              <h2 className="text-sm font-semibold text-amber-800 mb-3 flex items-center gap-2">
                🍳 En cocina ({itemsCocinaPendientes.length})
              </h2>
              <div className="space-y-2.5">
                {itemsCocinaPendientes.map(item => {
                  const key = `${item.pedidoId}-${item.id}`;
                  return (
                    <div key={item.id} className="flex items-center justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <span className="text-sm font-medium text-amber-900">{item.cantidad} {item.nombreEs}</span>
                        {item.modificacionesSeleccionadas && item.modificacionesSeleccionadas.length > 0 && (
                          <p className="text-xs text-red-600 mt-0.5">{item.modificacionesSeleccionadas.map(stripAlergenos).join(' · ')}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-amber-600">{(item.precio * item.cantidad).toFixed(2)} €</span>
                        <button
                          onClick={() => handleItemServidoSala(item.pedidoId, item.id, mesaActual.id)}
                          disabled={marcandoSala.has(key)}
                          className="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center hover:bg-green-200 transition-colors disabled:opacity-50 cursor-pointer"
                          aria-label="Marcar como servido"
                        >
                          <CheckCircle size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {itemsBarraPendientes.length > 0 && (
            <div className="bg-blue-50 rounded-2xl border border-blue-200 p-4 animate-pulse" style={{ animationDuration: '1.5s' }}>
              <h2 className="text-sm font-semibold text-blue-800 mb-3 flex items-center gap-2">
                🍺 Pendiente en barra ({itemsBarraPendientes.length})
              </h2>
              <div className="space-y-2.5">
                {itemsBarraPendientes.map(item => {
                  const key = `${item.pedidoId}-${item.id}`;
                  return (
                    <div key={item.id} className="flex items-center justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <span className="text-sm font-medium text-blue-900">{item.cantidad} {item.nombreEs}</span>
                        {item.modificacionesSeleccionadas && item.modificacionesSeleccionadas.length > 0 && (
                          <p className="text-xs text-blue-600 mt-0.5">{item.modificacionesSeleccionadas.map(stripAlergenos).join(' · ')}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-blue-600">{(item.precio * item.cantidad).toFixed(2)} €</span>
                        <button
                          onClick={() => handleItemServidoSala(item.pedidoId, item.id, mesaActual.id)}
                          disabled={marcandoSala.has(key)}
                          className="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center hover:bg-green-200 transition-colors disabled:opacity-50 cursor-pointer"
                          aria-label="Marcar como servido"
                        >
                          <CheckCircle size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* CAMBIO 4: "Listo para servir" → "Servido" */}
          {itemsListos.length > 0 && (
            <div className="bg-green-50 rounded-2xl border border-green-200 p-4">
              <h2 className="text-sm font-semibold text-green-800 mb-3 flex items-center gap-2">
                <CheckCircle size={14} /> Servido ({itemsListos.length} items)
              </h2>
              <div className="space-y-2">
                {itemsListos.map(item => (
                  <div key={item.id} className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <span className="text-sm text-green-800">{item.cantidad} {item.nombreEs}</span>
                      {item.modificacionesSeleccionadas && item.modificacionesSeleccionadas.length > 0 && (
                        <p className="text-xs text-green-600 mt-0.5">{item.modificacionesSeleccionadas.map(stripAlergenos).join(' · ')}</p>
                      )}
                    </div>
                    <span className="text-xs text-green-600 flex-shrink-0">{(item.precio * item.cantidad).toFixed(2)} €</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {todosLosItems.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              <ShoppingBag size={40} className="mx-auto mb-3 opacity-30" />
              <p>Sin pedidos todavía</p>
            </div>
          )}
        </main>

        {todosLosItems.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background via-background/95 to-transparent pt-8">
            <div className="max-w-2xl mx-auto">
              <button
                onClick={handleServir}
                className="w-full bg-green-600 text-white rounded-2xl py-4 font-semibold text-base hover:bg-green-500 transition-colors cursor-pointer active:scale-[0.98]"
              >
                Mesa servida — Limpiar pedidos
              </button>
            </div>
          </div>
        )}

        {/* ── Panel añadir platos ─────────────────────────────────────────── */}
        {mostrarAnadir && (
          <div className="fixed inset-0 z-50 flex flex-col">
            <div className="absolute inset-0 bg-black/40" onClick={() => { setMostrarAnadir(false); setCarrito({}); setMenusDiaCarrito([]); }} />
            <div className="relative mt-auto bg-white rounded-t-3xl max-h-[92vh] flex flex-col">
              <div className="p-4 border-b border-border flex items-center justify-between">
                <h2 className="font-serif font-semibold text-lg">Añadir a Mesa {mesaActual.numero}</h2>
                <button onClick={() => { setMostrarAnadir(false); setCarrito({}); setMenusDiaCarrito([]); }} className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center cursor-pointer">
                  <X size={18} />
                </button>
              </div>

              <div className="overflow-x-auto border-b border-border">
                <div className="flex gap-1 px-4 py-2 min-w-max">
                  {CATEGORIAS.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setCategoriaActiva(cat.id)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${categoriaActiva === cat.id ? 'bg-primary text-white' : 'bg-secondary text-muted-foreground'}`}
                    >
                      {cat.labelEs}
                    </button>
                  ))}
                </div>
              </div>

              <div className="overflow-y-auto flex-1 p-4 space-y-2">
                {renderPlatosList('mesa', categoriaActiva)}

                {/* Menús del día ya añadidos */}
                {menusDiaCarrito.length > 0 && (
                  <div className="mt-3 space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-1">Menús del día añadidos</p>
                    {menusDiaCarrito.map((menu, i) => (
                      <div key={i} className="flex items-start justify-between gap-2 p-3 bg-primary/5 rounded-xl border border-primary/20">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">Menú del Día ({menu.numPersonas})</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{resumenMenuDia(menu)}</p>
                          {menu.nota && <p className="text-xs text-red-600 mt-0.5">{menu.nota}</p>}
                        </div>
                        <button onClick={() => setMenusDiaCarrito(prev => prev.filter((_, j) => j !== i))} className="w-7 h-7 rounded-full bg-red-50 text-red-500 flex items-center justify-center cursor-pointer flex-shrink-0">
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* CAMBIO 3: botón envío con confirmación */}
              {totalCarritoMesa > 0 && (
                <div className="p-4 border-t border-border">
                  <button
                    onClick={() => setConfirmarEnvio(true)}
                    disabled={enviando}
                    className="w-full bg-accent text-white rounded-2xl py-3.5 font-semibold hover:bg-accent/90 transition-colors disabled:opacity-60 cursor-pointer"
                  >
                    {enviando ? 'Enviando...' : `Enviar ${totalCarritoMesa} plato${totalCarritoMesa !== 1 ? 's' : ''} a cocina`}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── GRID DE MESAS ─────────────────────────────────────────────────────────

  const interior = mesasEnriquecidas.filter(m => m.zona === 'interior');
  const exterior = mesasEnriquecidas.filter(m => m.zona === 'exterior');

  const mesasConBarraPendiente = new Set(
    mesasEnriquecidas
      .filter(mesa => mesa.pedidos.some(p =>
        Object.values(p.items || {}).some(item =>
          item.estado === 'pendiente' &&
          (item.destino === 'barra' || getDestinoFromPlatoId(item.platoId) === 'barra')
        )
      ))
      .map(m => m.id)
  );

  const contadores = {
    vacia: mesasEnriquecidas.filter(m => m.estado === 'vacia').length,
    pedido: mesasEnriquecidas.filter(m => m.estado === 'con-pedido').length,
    lista: mesasEnriquecidas.filter(m => m.estado === 'listo-servir').length,
  };

  function colorMesa(estado: EstadoMesa) {
    if (estado === 'vacia') return 'bg-[var(--mesa-vacia)] border-[var(--mesa-vacia-border)] text-foreground';
    if (estado === 'con-pedido') return 'bg-[var(--mesa-pedido)] border-[var(--mesa-pedido-border)] text-amber-900';
    return 'bg-[var(--mesa-lista)] border-[var(--mesa-lista-border)] text-green-900';
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 bg-white border-b border-border px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-serif font-semibold">Sala — LiDu Garden</h1>
            <p className="text-xs text-muted-foreground">Vista camarero</p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1 text-muted-foreground">
              <span className="w-2 h-2 rounded-full bg-[var(--mesa-vacia-border)]" />{contadores.vacia}
            </span>
            <span className="flex items-center gap-1 text-amber-600 font-medium">
              <span className="w-2 h-2 rounded-full bg-[var(--mesa-pedido-border)]" />{contadores.pedido}
            </span>
            <span className="flex items-center gap-1 text-green-600 font-medium">
              <span className="w-2 h-2 rounded-full bg-[var(--mesa-lista-border)]" />{contadores.lista}
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-5 space-y-6">
        <button
          onClick={() => setMostrarPanelRecoger(true)}
          className="w-full flex items-center justify-center gap-3 px-5 py-4 bg-amber-50 border-2 border-amber-300 text-amber-800 rounded-2xl font-semibold text-sm hover:bg-amber-100 transition-colors cursor-pointer"
        >
          <Package size={20} />
          Nuevo pedido para recoger
        </button>

        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-[var(--mesa-vacia)] border border-[var(--mesa-vacia-border)]" /> Libre
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-[var(--mesa-pedido)] border border-[var(--mesa-pedido-border)]" /> En cocina
          </span>
          {/* CAMBIO 4: "Listo para servir" → "Servido" */}
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-[var(--mesa-lista)] border border-[var(--mesa-lista-border)]" /> Servido
          </span>
        </div>

        <section>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
            Interior · {interior.length} mesas
          </h2>
          <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
            {interior.map(mesa => (
              <button
                key={mesa.id}
                onClick={() => handleOpenMesa(mesa.id)}
                className={`aspect-square rounded-xl border-2 flex flex-col items-center justify-center gap-0.5 transition-all hover:scale-105 active:scale-95 cursor-pointer relative ${colorMesa(mesa.estado)} ${mesasConAlerta.has(mesa.id) ? '!border-amber-400' : ''} ${mesasConBarraPendiente.has(mesa.id) ? 'ring-2 ring-orange-500 ring-offset-1' : ''}`}
              >
                {mesasConBarraPendiente.has(mesa.id) && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center animate-bounce z-10">
                    <span className="text-[9px] text-white font-bold leading-none">!</span>
                  </span>
                )}
                <span className="text-2xl font-serif font-bold leading-none">{mesa.numero}</span>
                <EstadoBadge estado={mesa.estado} />
              </button>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
            Exterior · {exterior.length} mesas
          </h2>
          <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
            {exterior.map(mesa => (
              <button
                key={mesa.id}
                onClick={() => handleOpenMesa(mesa.id)}
                className={`aspect-square rounded-xl border-2 flex flex-col items-center justify-center gap-0.5 transition-all hover:scale-105 active:scale-95 cursor-pointer relative ${colorMesa(mesa.estado)} ${mesasConAlerta.has(mesa.id) ? '!border-amber-400' : ''} ${mesasConBarraPendiente.has(mesa.id) ? 'ring-2 ring-orange-500 ring-offset-1' : ''}`}
              >
                {mesasConBarraPendiente.has(mesa.id) && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center animate-bounce z-10">
                    <span className="text-[9px] text-white font-bold leading-none">!</span>
                  </span>
                )}
                <span className="text-2xl font-serif font-bold leading-none">{mesa.numero}</span>
                <EstadoBadge estado={mesa.estado} />
              </button>
            ))}
          </div>
        </section>

        {pedidosRecoger.length > 0 && (
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
              <Package size={12} /> Pedidos para recoger · {pedidosRecoger.length}
            </h2>
            <div className="space-y-3">
              {pedidosRecoger.map(pedido => {
                const items = Object.values(pedido.items || {});
                const itemsPendientes = items.filter(i => i.estado === 'pendiente');
                const itemsListos = items.filter(i => i.estado === 'listo');
                const numero = pedido.numeroRecoger ?? pedido.mesaId?.replace('recoger-', '');
                const total = items.reduce((s, i) => s + i.precio * i.cantidad, 0);

                return (
                  <div key={pedido.id} className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Package size={16} className="text-amber-600" />
                        <span className="font-semibold text-amber-900">Recoger #{numero}</span>
                        {pedido.estado === 'listo' && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Listo</span>
                        )}
                      </div>
                      <span className="text-sm font-semibold text-accent">{total.toFixed(2)} €</span>
                    </div>

                    {itemsPendientes.length > 0 && (
                      <div className="space-y-1.5 mb-2">
                        {itemsPendientes.map(item => {
                          const key = `${pedido.id}-${item.id}`;
                          return (
                            <div key={item.id} className="flex items-center justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <span className="text-sm text-amber-900">{item.cantidad} {item.nombreEs}</span>
                                {item.modificacionesSeleccionadas && item.modificacionesSeleccionadas.length > 0 && (
                                  <p className="text-xs text-red-600">{item.modificacionesSeleccionadas.map(stripAlergenos).join(' · ')}</p>
                                )}
                              </div>
                              <button
                                onClick={() => handleItemServidoSala(pedido.id, item.id, pedido.mesaId)}
                                disabled={marcandoSala.has(key)}
                                className="w-7 h-7 rounded-full bg-green-100 text-green-700 flex items-center justify-center hover:bg-green-200 transition-colors disabled:opacity-50 cursor-pointer flex-shrink-0"
                                aria-label="Marcar listo"
                              >
                                <CheckCircle size={14} />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {itemsListos.length > 0 && (
                      <div className="space-y-1 mb-3 opacity-60">
                        {itemsListos.map(item => (
                          <div key={item.id} className="flex items-center gap-2">
                            <CheckCircle size={12} className="text-green-600 flex-shrink-0" />
                            <span className="text-xs text-green-800 line-through">{item.cantidad} {item.nombreEs}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <button
                      onClick={() => marcarRecogidaEntregada(pedido.id)}
                      className="w-full py-2.5 bg-green-600 text-white rounded-xl text-sm font-semibold hover:bg-green-500 transition-colors cursor-pointer"
                    >
                      Pedido entregado
                    </button>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </main>

      <footer className="text-center py-6 text-xs text-muted-foreground">
        Built with Claude Web Builder by{' '}
        <a href="https://tododeia.com" className="hover:underline" target="_blank" rel="noopener noreferrer">Tododeia</a>
      </footer>

      {/* ── Panel pedido para recoger ───────────────────────────────────────── */}
      {mostrarPanelRecoger && (
        <div className="fixed inset-0 z-50 flex flex-col">
          <div className="absolute inset-0 bg-black/40" onClick={() => { setMostrarPanelRecoger(false); setCarritoRecoger({}); setMenusDiaRecoger([]); }} />
          <div className="relative mt-auto bg-white rounded-t-3xl max-h-[92vh] flex flex-col">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div>
                <h2 className="font-serif font-semibold text-lg flex items-center gap-2">
                  <Package size={20} className="text-amber-600" />
                  Pedido para recoger
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">Se asignará número automáticamente</p>
              </div>
              <button onClick={() => { setMostrarPanelRecoger(false); setCarritoRecoger({}); setMenusDiaRecoger([]); }} className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <div className="overflow-x-auto border-b border-border">
              <div className="flex gap-1 px-4 py-2 min-w-max">
                {CATEGORIAS.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setCategoriaRecoger(cat.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${categoriaRecoger === cat.id ? 'bg-amber-600 text-white' : 'bg-secondary text-muted-foreground'}`}
                  >
                    {cat.labelEs}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-y-auto flex-1 p-4 space-y-2">
              {renderPlatosList('recoger', categoriaRecoger)}

              {menusDiaRecoger.length > 0 && (
                <div className="mt-3 space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-1">Menús del día añadidos</p>
                  {menusDiaRecoger.map((menu, i) => (
                    <div key={i} className="flex items-start justify-between gap-2 p-3 bg-primary/5 rounded-xl border border-primary/20">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">Menú del Día ({menu.numPersonas})</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{resumenMenuDia(menu)}</p>
                        {menu.nota && <p className="text-xs text-red-600 mt-0.5">{menu.nota}</p>}
                      </div>
                      <button onClick={() => setMenusDiaRecoger(prev => prev.filter((_, j) => j !== i))} className="w-7 h-7 rounded-full bg-red-50 text-red-500 flex items-center justify-center cursor-pointer flex-shrink-0">
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {totalCarritoRecoger > 0 && (
              <div className="p-4 border-t border-border">
                <button
                  onClick={() => setConfirmarEnvioRecoger(true)}
                  disabled={enviandoRecoger}
                  className="w-full bg-amber-600 text-white rounded-2xl py-3.5 font-semibold hover:bg-amber-500 transition-colors disabled:opacity-60 cursor-pointer"
                >
                  {enviandoRecoger ? 'Enviando...' : `Enviar ${totalCarritoRecoger} plato${totalCarritoRecoger !== 1 ? 's' : ''} a cocina`}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          MODALES GLOBALES (z-60, por encima de los paneles z-50)
      ════════════════════════════════════════════════════════════════════════ */}

      {/* CAMBIO 3 — Confirmación envío (mesa) */}
      {confirmarEnvio && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setConfirmarEnvio(false)} />
          <div className="relative bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <h3 className="text-lg font-serif font-semibold text-center mb-2">¿Enviar a cocina?</h3>
            <p className="text-sm text-muted-foreground text-center mb-6">
              {totalCarritoMesa} plato{totalCarritoMesa !== 1 ? 's' : ''} se enviarán a cocina y se imprimirá el ticket.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmarEnvio(false)} className="flex-1 py-3 rounded-xl border border-border text-sm font-medium hover:bg-secondary transition-colors cursor-pointer">
                Cancelar
              </button>
              <button onClick={enviarAdicional} disabled={enviando} className="flex-1 py-3 bg-accent text-white rounded-xl text-sm font-semibold hover:bg-accent/90 transition-colors disabled:opacity-60 cursor-pointer">
                {enviando ? 'Enviando...' : 'Sí, enviar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CAMBIO 3 — Confirmación envío (recoger) */}
      {confirmarEnvioRecoger && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setConfirmarEnvioRecoger(false)} />
          <div className="relative bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <h3 className="text-lg font-serif font-semibold text-center mb-2">¿Enviar a cocina?</h3>
            <p className="text-sm text-muted-foreground text-center mb-6">
              {totalCarritoRecoger} plato{totalCarritoRecoger !== 1 ? 's' : ''} se enviarán a cocina y se imprimirá el ticket.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmarEnvioRecoger(false)} className="flex-1 py-3 rounded-xl border border-border text-sm font-medium hover:bg-secondary transition-colors cursor-pointer">
                Cancelar
              </button>
              <button onClick={enviarRecoger} disabled={enviandoRecoger} className="flex-1 py-3 bg-amber-600 text-white rounded-xl text-sm font-semibold hover:bg-amber-500 transition-colors disabled:opacity-60 cursor-pointer">
                {enviandoRecoger ? 'Enviando...' : 'Sí, enviar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CAMBIO 1 — Modal selector / menú fijo */}
      {modalPlato && (
        <div className="fixed inset-0 z-60 flex flex-col">
          <div className="absolute inset-0 bg-black/50" onClick={() => setModalPlato(null)} />
          <div className="relative mt-auto bg-white rounded-t-3xl max-h-[85vh] flex flex-col">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3 className="font-serif font-semibold text-lg">{modalPlato.nombreEs}</h3>
              <button onClick={() => setModalPlato(null)} className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 p-4 space-y-4">
              {/* Opciones selector */}
              {modalPlato.id in SELECTORES_OBLIGATORIOS && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">
                    {SELECTORES_OBLIGATORIOS[modalPlato.id].label}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {SELECTORES_OBLIGATORIOS[modalPlato.id].opciones.map(op => (
                      <button
                        key={op}
                        onClick={() => setModalOpcion(op)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium border-2 transition-colors cursor-pointer ${modalOpcion === op ? 'border-primary bg-primary text-white' : 'border-border bg-white text-foreground hover:border-primary/50'}`}
                      >
                        {op}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Platos del menú fijo */}
              {modalPlato.id in MENUS_FIJOS && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Incluye</p>
                  <ul className="space-y-1.5">
                    {MENUS_FIJOS[modalPlato.id].platos.map((dish, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <span className="text-primary font-bold mt-0.5">·</span>
                        <span>{stripAlergenos(dish)}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center gap-4 mt-4">
                    <p className="text-sm font-medium">Personas</p>
                    <div className="flex items-center gap-3">
                      <button onClick={() => setModalPersonas(p => Math.max(MENUS_FIJOS[modalPlato.id].minPersonas, p - 1))} className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center cursor-pointer"><Minus size={14} /></button>
                      <span className="w-6 text-center font-semibold text-lg">{modalPersonas}</span>
                      <button onClick={() => setModalPersonas(p => p + 1)} className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center cursor-pointer"><Plus size={14} /></button>
                    </div>
                  </div>
                </div>
              )}

              {/* Nota opcional */}
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Nota (opcional)</p>
                <input
                  type="text"
                  placeholder="ej: sin picante, sin cebolla..."
                  value={modalNota}
                  onChange={e => setModalNota(e.target.value)}
                  className="w-full border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div className="p-4 border-t border-border">
              <button
                onClick={confirmarModalPlato}
                disabled={modalPlato.id in SELECTORES_OBLIGATORIOS && !modalOpcion}
                className="w-full bg-primary text-white rounded-2xl py-3.5 font-semibold hover:bg-primary/90 transition-colors disabled:opacity-40 cursor-pointer"
              >
                {modalPlato.id in MENUS_FIJOS
                  ? `Añadir — ${(modalPlato.precio * modalPersonas).toFixed(2)} €`
                  : 'Confirmar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CAMBIO 1 — Modal Menú del Día (3 secciones, selección múltiple con cantidad) */}
      {menuDiaPaso > 0 && (
        <div className="fixed inset-0 z-60 flex flex-col">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMenuDiaPaso(0)} />
          <div className="relative mt-auto bg-white rounded-t-3xl max-h-[85vh] flex flex-col">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setMenuDiaPaso(p => Math.max(1, p - 1) as 0 | 1 | 2 | 3)}
                  className={`w-8 h-8 rounded-full bg-secondary flex items-center justify-center cursor-pointer ${menuDiaPaso === 1 ? 'opacity-30 pointer-events-none' : ''}`}
                >
                  <ChevronLeft size={16} />
                </button>
                <h3 className="font-serif font-semibold text-lg">
                  {menuDiaPaso === 1 && 'Entrante'}
                  {menuDiaPaso === 2 && 'Arroz / Fideos'}
                  {menuDiaPaso === 3 && 'Principal'}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{menuDiaPaso}/3</span>
                <button onClick={() => setMenuDiaPaso(0)} className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center cursor-pointer">
                  <X size={16} />
                </button>
              </div>
            </div>

            <div className="overflow-y-auto flex-1 p-4">
              {/* Paso 1: entrante — selección múltiple con cantidad */}
              {menuDiaPaso === 1 && (
                <div className="space-y-2">
                  {MENU_DIA_PRIMER.map(op => {
                    const cant = menuDiaEntrante[op.nombre] || 0;
                    return (
                      <div key={op.nombre} className={`w-full flex items-center justify-between p-3.5 rounded-xl border-2 transition-colors ${cant > 0 ? 'border-primary bg-primary/5' : 'border-border'}`}>
                        <div className="flex-1 min-w-0">
                          <span className="text-sm font-medium">{stripAlergenos(op.nombre)}</span>
                          {op.suplemento > 0 && <span className="text-xs text-accent font-medium ml-2">+{op.suplemento}€/ud</span>}
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button onClick={() => menuDiaDec(setMenuDiaEntrante, op.nombre)} disabled={cant === 0} className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center cursor-pointer disabled:opacity-30"><Minus size={12} /></button>
                          <span className="w-5 text-center text-sm font-semibold">{cant}</span>
                          <button onClick={() => menuDiaInc(setMenuDiaEntrante, op.nombre)} className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center cursor-pointer"><Plus size={12} /></button>
                        </div>
                      </div>
                    );
                  })}
                  <button
                    onClick={() => setMenuDiaPaso(2)}
                    disabled={Object.keys(menuDiaEntrante).length === 0}
                    className="w-full mt-2 bg-primary text-white rounded-2xl py-3 font-semibold hover:bg-primary/90 transition-colors disabled:opacity-40 cursor-pointer"
                  >
                    Siguiente — Arroz / Fideos
                  </button>
                </div>
              )}

              {/* Paso 2: arroz/fideos — selección múltiple con cantidad */}
              {menuDiaPaso === 2 && (
                <div className="space-y-2">
                  {MENU_DIA_SEGUNDO.map(op => {
                    const cant = menuDiaArroz[op.nombre] || 0;
                    return (
                      <div key={op.nombre} className={`w-full flex items-center justify-between p-3.5 rounded-xl border-2 transition-colors ${cant > 0 ? 'border-primary bg-primary/5' : 'border-border'}`}>
                        <div className="flex-1 min-w-0">
                          <span className="text-sm font-medium">{stripAlergenos(op.nombre)}</span>
                          {op.suplemento > 0 && <span className="text-xs text-accent font-medium ml-2">+{op.suplemento}€/ud</span>}
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button onClick={() => menuDiaDec(setMenuDiaArroz, op.nombre)} disabled={cant === 0} className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center cursor-pointer disabled:opacity-30"><Minus size={12} /></button>
                          <span className="w-5 text-center text-sm font-semibold">{cant}</span>
                          <button onClick={() => menuDiaInc(setMenuDiaArroz, op.nombre)} className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center cursor-pointer"><Plus size={12} /></button>
                        </div>
                      </div>
                    );
                  })}
                  <button
                    onClick={() => setMenuDiaPaso(3)}
                    disabled={Object.keys(menuDiaArroz).length === 0}
                    className="w-full mt-2 bg-primary text-white rounded-2xl py-3 font-semibold hover:bg-primary/90 transition-colors disabled:opacity-40 cursor-pointer"
                  >
                    Siguiente — Principal
                  </button>
                </div>
              )}

              {/* Paso 3: principal + número de menús + nota + confirmar */}
              {menuDiaPaso === 3 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    {MENU_DIA_PRINCIPAL.map(op => {
                      const cant = menuDiaPrincipalSel[op.nombre] || 0;
                      return (
                        <div key={op.nombre} className={`w-full flex items-center justify-between p-3.5 rounded-xl border-2 transition-colors ${cant > 0 ? 'border-primary bg-primary/5' : 'border-border'}`}>
                          <div className="flex-1 min-w-0">
                            <span className="text-sm font-medium">{stripAlergenos(op.nombre)}</span>
                            {op.suplemento > 0 && <span className="text-xs text-accent font-medium ml-2">+{op.suplemento}€/ud</span>}
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <button onClick={() => menuDiaDec(setMenuDiaPrincipalSel, op.nombre)} disabled={cant === 0} className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center cursor-pointer disabled:opacity-30"><Minus size={12} /></button>
                            <span className="w-5 text-center text-sm font-semibold">{cant}</span>
                            <button onClick={() => menuDiaInc(setMenuDiaPrincipalSel, op.nombre)} className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center cursor-pointer"><Plus size={12} /></button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {Object.keys(menuDiaPrincipalSel).length > 0 && (
                    <>
                      {/* Número de menús (para precio) */}
                      <div className="flex items-center justify-between bg-secondary/50 rounded-xl p-3">
                        <p className="text-sm font-medium text-foreground">Número de menús</p>
                        <div className="flex items-center gap-3">
                          <button onClick={() => setMenuDiaNumPersonas(n => Math.max(1, n - 1))} className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center cursor-pointer"><Minus size={14} /></button>
                          <span className="w-6 text-center font-semibold text-lg">{menuDiaNumPersonas}</span>
                          <button onClick={() => setMenuDiaNumPersonas(n => n + 1)} className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center cursor-pointer"><Plus size={14} /></button>
                        </div>
                      </div>

                      {/* Nota */}
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-2">Nota (opcional)</p>
                        <input
                          type="text"
                          placeholder="ej: sin gluten, alergia a..."
                          value={menuDiaNota}
                          onChange={e => setMenuDiaNota(e.target.value)}
                          className="w-full border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {menuDiaPaso === 3 && Object.keys(menuDiaPrincipalSel).length > 0 && (
              <div className="p-4 border-t border-border">
                <button
                  onClick={confirmarMenuDelDia}
                  className="w-full bg-primary text-white rounded-2xl py-3.5 font-semibold hover:bg-primary/90 transition-colors cursor-pointer"
                >
                  Añadir Menú del Día ({menuDiaNumPersonas})
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
