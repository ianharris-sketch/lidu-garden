'use client';

import { useState, useCallback, useEffect } from 'react';
import { PLATOS, CATEGORIAS, PLATOS_MAP, getDestino, getDestinoFromPlatoId,
  MENU_DIA_PRECIO_BASE, MENU_DIA_PRIMER, MENU_DIA_SEGUNDO, MENU_DIA_PRINCIPAL,
  MENUS_FIJOS, SELECTORES_OBLIGATORIOS, ALERGENOS_LEYENDA } from '@/data/menu';
import {
  enviarPedido, onPedidosMesaChange, onCarritoChange,
  añadirAlCarrito, quitarDelCarrito, limpiarCarrito,
  añadirMenuDelDia, setCarritoItemDirecto,
} from '@/lib/db';
import type { CarritoItem } from '@/lib/db';
import type { Categoria, Plato, Pedido, ItemPedido } from '@/types';
import { Plus, Minus, X, CheckCircle, ChevronRight, ClipboardList, Clock,
  ChevronDown, ChevronUp, Users } from 'lucide-react';

interface Props {
  mesaNum: number;
  mesaId: string;
}

// ── Componente pequeño para números de alérgenos ──────────────────────────────
function Alergenos({ numeros }: { numeros?: number[] }) {
  if (!numeros || numeros.length === 0) return null;
  return (
    <span className="text-[10px] text-muted-foreground/60 font-normal ml-1 tracking-tight">
      {numeros.map((n) => `(${n})`).join('')}
    </span>
  );
}

// ── Renderiza un nombre de plato separando el sufijo de alérgenos ─────────────
// Ej: "California Roll (2,3,4)" → "California Roll" + "(2,3,4)" pequeño
function DishName({ text }: { text: string }) {
  const match = text.match(/^(.*?)\s*(\(\+?\d[\d,]*€?\))$/);
  if (!match) return <>{text}</>;
  return (
    <>
      {match[1]}
      <span className="text-[10px] text-muted-foreground/60 font-normal ml-1 tracking-tight">{match[2]}</span>
    </>
  );
}

export default function MesaClient({ mesaNum, mesaId }: Props) {
  const [categoriaActiva, setCategoriaActiva] = useState<Categoria>('menus');
  const [carrito, setCarrito] = useState<Record<string, CarritoItem>>({});
  const [modificacionesPorPlato, setModificacionesPorPlato] = useState<Record<string, string[]>>({});
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [mostrarCarrito, setMostrarCarrito] = useState(false);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [mostrarResumen, setMostrarResumen] = useState(false);
  const [pedidos, setPedidos] = useState<Record<string, Pedido>>({});
  // Menú del Día
  const [menuDiaOpen, setMenuDiaOpen] = useState(false);
  const [menuDiaPrimer, setMenuDiaPrimer] = useState('');
  const [menuDiaSegundo, setMenuDiaSegundo] = useState('');
  const [menuDiaPrincipal, setMenuDiaPrincipal] = useState('');
  // Menú fijo expandido
  const [menuFijoExpandido, setMenuFijoExpandido] = useState<string | null>(null);
  const [menuFijoPersonas, setMenuFijoPersonas] = useState(2);
  // Selector obligatorio
  const [selectorPlatoId, setSelectorPlatoId] = useState<string | null>(null);
  const [selectorChoice, setSelectorChoice] = useState('');

  // Escuchar carrito compartido de esta mesa en tiempo real
  useEffect(() => {
    const unsub = onCarritoChange(mesaId, setCarrito);
    return unsub;
  }, [mesaId]);

  // Escuchar pedidos ya enviados de esta mesa en tiempo real
  useEffect(() => {
    const unsub = onPedidosMesaChange(mesaId, setPedidos);
    return unsub;
  }, [mesaId]);

  // Computed values
  const menuDiaCount = Object.keys(carrito).filter(k => k.startsWith('men001_')).length;
  const todosLosItems: ItemPedido[] = Object.values(pedidos).flatMap(p => Object.values(p.items || {}));
  const totalGastado = todosLosItems.reduce((s, i) => s + i.precio * i.cantidad, 0);
  const itemsPendientes = todosLosItems.filter(i => i.estado === 'pendiente');
  const itemsListos = todosLosItems.filter(i => i.estado === 'listo');
  const platosFiltrados = PLATOS.filter(p => p.categoria === categoriaActiva);
  const totalItems = Object.values(carrito).reduce((sum, i) => sum + i.cantidad, 0);
  const totalPrecio = Object.values(carrito).reduce((sum, i) => sum + i.precio * i.cantidad, 0);

  // Count selector variants in cart (e.g. beb004_* items total)
  const contadorVariantes = (basePlatoId: string): number =>
    Object.entries(carrito)
      .filter(([k]) => k.startsWith(basePlatoId + '_'))
      .reduce((sum, [, v]) => sum + v.cantidad, 0);

  // Calculate Menú del Día price
  const calcularPrecioMenuDia = () => {
    let s = 0;
    const p = MENU_DIA_PRIMER.find(o => o.nombre === menuDiaPrimer);
    const sg = MENU_DIA_SEGUNDO.find(o => o.nombre === menuDiaSegundo);
    const pr = MENU_DIA_PRINCIPAL.find(o => o.nombre === menuDiaPrincipal);
    if (p) s += p.suplemento;
    if (sg) s += sg.suplemento;
    if (pr) s += pr.suplemento;
    return MENU_DIA_PRECIO_BASE + s;
  };

  const toggleMod = useCallback((platoId: string, mod: string) => {
    setModificacionesPorPlato(prev => {
      const current = prev[platoId] || [];
      const isSelected = current.includes(mod);
      return { ...prev, [platoId]: isSelected ? current.filter(m => m !== mod) : [...current, mod] };
    });
  }, []);

  const añadir = useCallback(async (plato: Plato) => {
    const mods = modificacionesPorPlato[plato.id] || [];
    await añadirAlCarrito(mesaId, plato, mods, getDestino(plato.categoria));
  }, [mesaId, modificacionesPorPlato]);

  const quitar = useCallback(async (platoId: string) => {
    await quitarDelCarrito(mesaId, platoId);
  }, [mesaId]);

  // Selector obligatorio
  const handleSelectorConfirm = async () => {
    if (!selectorPlatoId || !selectorChoice) return;
    const basePlato = PLATOS_MAP[selectorPlatoId];
    if (!basePlato) return;
    const slug = selectorChoice.toLowerCase().replace(/[^a-z0-9]/g, '');
    const syntheticId = `${selectorPlatoId}_${slug}`;
    let nombre: string;
    if (selectorPlatoId === 'mak003') {
      nombre = `Maki de ${selectorChoice} (6 uds)`;
    } else {
      const base = basePlato.nombreEs.split('(')[0].trim().split('–')[0].trim();
      nombre = `${base} – ${selectorChoice}`;
    }
    await añadirAlCarrito(
      mesaId,
      { id: syntheticId, nombreEs: nombre, nombreZh: nombre, precio: basePlato.precio },
      [],
      getDestino(basePlato.categoria)
    );
    setSelectorPlatoId(null);
    setSelectorChoice('');
  };

  // Menú del Día
  const handleAgregarMenuDia = async () => {
    if (!menuDiaPrimer || !menuDiaSegundo || !menuDiaPrincipal) return;
    const precio = calcularPrecioMenuDia();
    const numero = menuDiaCount + 1;
    await añadirMenuDelDia(mesaId, numero, menuDiaPrimer, menuDiaSegundo, menuDiaPrincipal, precio);
    setMenuDiaPrimer('');
    setMenuDiaSegundo('');
    setMenuDiaPrincipal('');
    setMenuDiaOpen(false);
  };

  // Menú fijo
  const handleAgregarMenuFijo = async (plato: Plato) => {
    const info = MENUS_FIJOS[plato.id];
    if (!info) return;
    await setCarritoItemDirecto(mesaId, {
      platoId: plato.id,
      nombreEs: plato.nombreEs,
      nombreZh: plato.nombreZh,
      precio: plato.precio,
      cantidad: menuFijoPersonas,
      destino: 'cocina',
      modificaciones: info.platos,
    });
    setMenuFijoExpandido(null);
    setMenuFijoPersonas(2);
  };

  // Enviar pedido
  const enviar = async () => {
    if (totalItems === 0 || enviando) return;
    setEnviando(true);
    const items = Object.values(carrito).map(i => {
      const base = {
        platoId: i.platoId,
        nombreEs: i.nombreEs,
        nombreZh: i.nombreZh,
        precio: i.precio,
        cantidad: i.cantidad,
        destino: i.destino ?? getDestinoFromPlatoId(i.platoId),
      };
      return i.modificaciones?.length
        ? { ...base, modificacionesSeleccionadas: i.modificaciones }
        : base;
    });
    try {
      await enviarPedido(mesaId, mesaNum, items);
      await limpiarCarrito(mesaId);
      setEnviado(true);
      setMostrarCarrito(false);
      setMostrarConfirmacion(false);
    } catch (err) {
      console.error('Error enviando pedido:', err);
      alert('Error al enviar el pedido. Inténtalo de nuevo.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-border shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-serif font-semibold text-foreground">LiDu Garden</h1>
            <p className="text-xs text-muted-foreground tracking-widest uppercase">
              Mutxamel · Alicante
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Botón resumen pedido */}
            {todosLosItems.length > 0 && (
              <button
                onClick={() => setMostrarResumen(true)}
                className="relative flex items-center gap-1.5 px-3 py-2 bg-secondary rounded-xl text-sm font-medium text-foreground hover:bg-muted transition-colors cursor-pointer"
              >
                <ClipboardList size={16} className="text-primary" />
                <span className="text-primary font-semibold">{todosLosItems.length}</span>
              </button>
            )}
            <div className="text-right">
              <div className="text-4xl font-serif font-bold text-primary leading-none">{mesaNum}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-widest">Mesa</div>
            </div>
          </div>
        </div>
      </header>

      {/* Confirmación enviado */}
      {enviado && (
        <div className="bg-green-50 border-b border-green-200 px-4 py-3 text-center">
          <div className="flex items-center justify-center gap-2 text-green-700">
            <CheckCircle size={18} />
            <span className="font-medium text-sm">
              Pedido enviado. Puedes seguir añadiendo platos.
            </span>
          </div>
        </div>
      )}

      {/* Categorías */}
      <div className="sticky top-[61px] z-30 bg-white border-b border-border overflow-x-auto">
        <div className="flex gap-1 px-4 py-2 min-w-max">
          {CATEGORIAS.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoriaActiva(cat.id)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
                categoriaActiva === cat.id
                  ? 'bg-primary text-white'
                  : 'bg-secondary text-muted-foreground hover:bg-muted'
              }`}
            >
              {cat.labelEs}
            </button>
          ))}
        </div>
      </div>

      {/* Platos */}
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-4">
        <div className="space-y-3">
          {platosFiltrados.map((plato) => {
            // ── Menú del Día special card ────────────────────────────────────
            if (plato.id === 'men001') {
              return (
                <div key={plato.id} className="bg-white rounded-xl border border-border p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-foreground text-sm">{plato.nombreEs}</h3>
                      <p className="text-xs text-muted-foreground/70 mt-0.5">{plato.notas}</p>
                      <p className="text-xs text-muted-foreground mt-1">Incluye bebida (agua, refresco o cerveza)</p>
                    </div>
                    <span className="text-accent font-semibold text-base flex-shrink-0">{plato.precio.toFixed(2)} €</span>
                  </div>
                  {menuDiaCount > 0 && (
                    <p className="text-xs text-primary font-medium mt-2">✓ {menuDiaCount} menú{menuDiaCount > 1 ? 's' : ''} en tu pedido</p>
                  )}
                  <button
                    onClick={() => setMenuDiaOpen(true)}
                    className="mt-3 w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors cursor-pointer"
                  >
                    <Plus size={14} />
                    {menuDiaCount === 0 ? 'Configurar menú' : 'Añadir otro menú'}
                  </button>
                </div>
              );
            }

            // ── Menús fijos (men002–men005) ──────────────────────────────────
            if (plato.id in MENUS_FIJOS) {
              const isExpanded = menuFijoExpandido === plato.id;
              const enCarrito = carrito[plato.id]?.cantidad ?? 0;
              return (
                <div key={plato.id} className="bg-white rounded-xl border border-border overflow-hidden">
                  <button
                    onClick={() => setMenuFijoExpandido(isExpanded ? null : plato.id)}
                    className="w-full p-4 flex items-start justify-between gap-2 text-left cursor-pointer"
                  >
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-foreground text-sm">{plato.nombreEs}</h3>
                      <p className="text-xs text-muted-foreground/70 mt-0.5">{plato.notas}</p>
                      {enCarrito > 0 && (
                        <p className="text-xs text-primary font-medium mt-0.5">✓ {enCarrito} persona{enCarrito > 1 ? 's' : ''}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-accent font-semibold text-sm">{plato.precio.toFixed(2)} €/p</span>
                      {isExpanded ? <ChevronUp size={16} className="text-muted-foreground" /> : <ChevronDown size={16} className="text-muted-foreground" />}
                    </div>
                  </button>
                  {isExpanded && (
                    <div className="px-4 pb-4 space-y-3 border-t border-border/50 pt-3">
                      <ul className="space-y-1">
                        {MENUS_FIJOS[plato.id].platos.map((dish, i) => (
                          <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                            <span className="text-primary mt-0.5">·</span><DishName text={dish} />
                          </li>
                        ))}
                      </ul>
                      <p className="text-xs text-muted-foreground italic">Solo postre · Mínimo 2 personas</p>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 bg-secondary rounded-xl px-3 py-2">
                          <Users size={14} className="text-muted-foreground" />
                          <button onClick={() => setMenuFijoPersonas(p => Math.max(MENUS_FIJOS[plato.id].minPersonas, p - 1))} className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-foreground hover:bg-muted cursor-pointer"><Minus size={12} /></button>
                          <span className="w-6 text-center font-semibold text-sm">{menuFijoPersonas}</span>
                          <button onClick={() => setMenuFijoPersonas(p => p + 1)} className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary/90 cursor-pointer"><Plus size={12} /></button>
                        </div>
                        <button
                          onClick={() => handleAgregarMenuFijo(plato)}
                          className="flex-1 py-2 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors cursor-pointer"
                        >
                          Añadir — {(plato.precio * menuFijoPersonas).toFixed(2)} €
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            }

            // ── Selector obligatorio ─────────────────────────────────────────
            if (plato.id in SELECTORES_OBLIGATORIOS) {
              const totalVariantes = contadorVariantes(plato.id);
              return (
                <div key={plato.id} className="bg-white rounded-xl border border-border p-4 flex items-start gap-3">
                  <div className="w-20 h-20 rounded-lg bg-secondary flex-shrink-0 flex items-center justify-center overflow-hidden">
                    {plato.foto ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={plato.foto} alt={plato.nombreEs} className="w-full h-full object-cover" style={{ objectPosition: plato.fotoPosition ?? 'center center' }} />
                    ) : (
                      <span className="text-2xl text-muted-foreground/40">🍜</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-foreground text-base leading-snug">
                          {plato.nombreEs}<Alergenos numeros={plato.alergenos} />
                        </h3>
                        {plato.notas && <p className="text-sm text-muted-foreground/70 mt-0.5 font-medium">{plato.notas}</p>}
                        {plato.descripcion && <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">{plato.descripcion}</p>}
                      </div>
                      <span className="text-accent font-semibold text-base flex-shrink-0">{plato.precio.toFixed(2)} €</span>
                    </div>
                    {totalVariantes > 0 && (
                      <p className="text-xs text-primary font-medium mt-1">✓ {totalVariantes} en pedido</p>
                    )}
                    <div className="mt-3">
                      <button
                        onClick={() => { setSelectorPlatoId(plato.id); setSelectorChoice(''); }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary text-white text-xs font-medium hover:bg-primary/90 transition-colors cursor-pointer"
                      >
                        <Plus size={12} />Añadir
                      </button>
                    </div>
                  </div>
                </div>
              );
            }

            // ── Plato normal ────────────────────────────────────────────────
            const enCarrito = carrito[plato.id]?.cantidad || 0;
            const modsSeleccionadas = modificacionesPorPlato[plato.id] || [];
            return (
              <div
                key={plato.id}
                className="bg-white rounded-xl border border-border p-4 flex items-start gap-3"
              >
                <div className="w-20 h-20 rounded-lg bg-secondary flex-shrink-0 flex items-center justify-center overflow-hidden">
                  {plato.foto ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={plato.foto} alt={plato.nombreEs} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl text-muted-foreground/40">🍜</span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-foreground text-base leading-snug">
                        {plato.nombreEs}<Alergenos numeros={plato.alergenos} />
                      </h3>
                      {plato.notas && (
                        <p className="text-sm text-muted-foreground/70 mt-0.5 font-medium">
                          {plato.notas}
                        </p>
                      )}
                      {plato.descripcion && (
                        <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">
                          {plato.descripcion}
                        </p>
                      )}
                      {plato.ingredientes.length > 0 && (
                        <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">
                          {plato.ingredientes.join(', ')}
                        </p>
                      )}
                      {/* Opciones de modificación */}
                      {plato.modificaciones && plato.modificaciones.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {plato.modificaciones.map((mod) => {
                            const seleccionada = modsSeleccionadas.includes(mod);
                            return (
                              <button
                                key={mod}
                                onClick={() => toggleMod(plato.id, mod)}
                                className={`text-xs px-2 py-0.5 rounded-full border transition-colors cursor-pointer ${
                                  seleccionada
                                    ? 'bg-red-50 border-red-300 text-red-700 font-medium'
                                    : 'bg-secondary border-border text-muted-foreground hover:border-muted-foreground'
                                }`}
                              >
                                {seleccionada ? '✕ ' : ''}{mod}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                    <span className="text-accent font-semibold text-sm flex-shrink-0">
                      {plato.precio.toFixed(2)} €
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mt-3">
                    {enCarrito > 0 ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => quitar(plato.id)}
                          className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition-colors cursor-pointer"
                          aria-label="Quitar uno"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="text-foreground font-semibold w-5 text-center">
                          {enCarrito}
                        </span>
                        <button
                          onClick={() => añadir(plato)}
                          className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary/90 transition-colors cursor-pointer"
                          aria-label="Añadir uno"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => añadir(plato)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary text-white text-xs font-medium hover:bg-primary/90 transition-colors cursor-pointer"
                      >
                        <Plus size={12} />
                        Añadir
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Leyenda de alérgenos */}
        <div className="mt-6 px-1 pb-20">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50 mb-2">Alérgenos</p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-0.5">
            {Object.entries(ALERGENOS_LEYENDA).map(([num, nombre]) => (
              <span key={num} className="text-[10px] text-muted-foreground/50 leading-relaxed">
                ({num}) {nombre}
              </span>
            ))}
          </div>
        </div>
      </main>

      {/* Carrito flotante */}
      {totalItems > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-gradient-to-t from-background via-background/95 to-transparent pt-8">
          <div className="max-w-2xl mx-auto">
            <button
              onClick={() => setMostrarCarrito(true)}
              className="w-full bg-primary text-white rounded-2xl px-5 py-4 flex items-center justify-between shadow-lg hover:bg-primary/90 transition-colors cursor-pointer active:scale-[0.98]"
            >
              <div className="flex items-center gap-3">
                <div className="bg-white/20 rounded-full w-7 h-7 flex items-center justify-center">
                  <span className="text-sm font-bold">{totalItems}</span>
                </div>
                <span className="font-semibold">Ver pedido</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-semibold">{totalPrecio.toFixed(2)} €</span>
                <ChevronRight size={18} />
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Panel carrito */}
      {mostrarCarrito && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMostrarCarrito(false)} />
          <div className="relative bg-white rounded-t-3xl max-h-[85vh] flex flex-col">
            <div className="p-5 border-b border-border flex items-center justify-between">
              <div>
                <h2 className="text-xl font-serif font-semibold">Tu selección</h2>
                <p className="text-sm text-muted-foreground">Mesa {mesaNum}</p>
              </div>
              <button
                onClick={() => setMostrarCarrito(false)}
                className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center hover:bg-muted transition-colors cursor-pointer"
                aria-label="Cerrar"
              >
                <X size={18} />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 p-5 space-y-3">
              {Object.values(carrito).map((item) => {
                const isMenuDia = item.platoId.startsWith('men001_');
                const isMenuFijo = ['men002', 'men003', 'men004', 'men005'].includes(item.platoId);

                if (isMenuDia) {
                  return (
                    <div key={item.platoId} className="flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <span className="text-sm text-foreground font-medium">{item.nombreEs}</span>
                        {item.modificaciones && item.modificaciones.length > 0 && (
                          <p className="text-xs text-muted-foreground mt-0.5">{item.modificaciones.join(' · ')}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-accent flex-shrink-0">
                          {item.precio.toFixed(2)} €
                        </span>
                        <button
                          onClick={() => quitar(item.platoId)}
                          className="w-7 h-7 rounded-full bg-secondary text-muted-foreground flex items-center justify-center hover:bg-muted cursor-pointer"
                          aria-label="Eliminar"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    </div>
                  );
                }

                if (isMenuFijo) {
                  return (
                    <div key={item.platoId} className="flex items-start gap-3">
                      <div className="flex items-center gap-2 mt-0.5">
                        <button
                          onClick={() => quitar(item.platoId)}
                          className="w-7 h-7 rounded-full bg-secondary text-muted-foreground flex items-center justify-center hover:bg-muted cursor-pointer"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-5 text-center font-semibold text-sm">{item.cantidad}</span>
                        <button
                          onClick={() => añadirAlCarrito(
                            mesaId,
                            { id: item.platoId, nombreEs: item.nombreEs, nombreZh: item.nombreZh, precio: item.precio },
                            item.modificaciones || [],
                            'cocina'
                          )}
                          className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary/90 cursor-pointer"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-sm text-foreground">{item.nombreEs}</span>
                      </div>
                      <span className="text-sm font-medium text-accent flex-shrink-0">
                        {(item.precio * item.cantidad).toFixed(2)} €
                      </span>
                    </div>
                  );
                }

                // Regular items (including selector variants)
                return (
                  <div key={item.platoId} className="flex items-start gap-3">
                    <div className="flex items-center gap-2 mt-0.5">
                      <button
                        onClick={() => quitar(item.platoId)}
                        className="w-7 h-7 rounded-full bg-secondary text-muted-foreground flex items-center justify-center hover:bg-muted cursor-pointer"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-5 text-center font-semibold text-sm">{item.cantidad}</span>
                      <button
                        onClick={() =>
                          añadirAlCarrito(
                            mesaId,
                            { id: item.platoId, nombreEs: item.nombreEs, nombreZh: item.nombreZh, precio: item.precio },
                            item.modificaciones || []
                          )
                        }
                        className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary/90 cursor-pointer"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-sm text-foreground">{item.nombreEs}</span>
                      {item.modificaciones && item.modificaciones.length > 0 && (
                        <p className="text-xs text-red-600 mt-0.5">{item.modificaciones.join(', ')}</p>
                      )}
                    </div>
                    <span className="text-sm font-medium text-accent flex-shrink-0">
                      {(item.precio * item.cantidad).toFixed(2)} €
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="p-5 border-t border-border space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground text-sm">Total selección</span>
                <span className="text-xl font-serif font-semibold text-foreground">
                  {totalPrecio.toFixed(2)} €
                </span>
              </div>
              <p className="text-xs text-muted-foreground text-center">
                El pago se realizará en efectivo o datáfono
              </p>
              <button
                onClick={() => setMostrarConfirmacion(true)}
                disabled={enviando}
                className="w-full bg-accent text-white rounded-2xl py-4 font-semibold text-base hover:bg-accent/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer active:scale-[0.98]"
              >
                Enviar pedido a cocina
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación de envío */}
      {mostrarConfirmacion && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMostrarConfirmacion(false)} />
          <div className="relative bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl">
            <div className="text-center space-y-3 mb-6">
              <div className="text-4xl">🍜</div>
              <h3 className="text-xl font-serif font-semibold text-foreground">
                ¿Estáis todos listos para pedir?
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Una vez enviado, el pedido va a cocina.
              </p>
            </div>
            <div className="space-y-3">
              <button
                onClick={() => { setMostrarConfirmacion(false); enviar(); }}
                disabled={enviando}
                className="w-full bg-accent text-white rounded-2xl py-4 font-semibold text-base hover:bg-accent/90 transition-colors disabled:opacity-60 cursor-pointer active:scale-[0.98]"
              >
                {enviando ? 'Enviando a cocina...' : 'Sí, enviar'}
              </button>
              <button
                onClick={() => setMostrarConfirmacion(false)}
                className="w-full bg-secondary text-foreground rounded-2xl py-3.5 font-medium text-base hover:bg-muted transition-colors cursor-pointer"
              >
                Esperar un poco más
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Panel resumen — todo lo pedido en la mesa */}
      {mostrarResumen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMostrarResumen(false)} />
          <div className="relative bg-white rounded-t-3xl max-h-[85vh] flex flex-col">
            <div className="p-5 border-b border-border flex items-center justify-between">
              <div>
                <h2 className="text-xl font-serif font-semibold">Resumen de mesa</h2>
                <p className="text-sm text-muted-foreground">Todo lo pedido — Mesa {mesaNum}</p>
              </div>
              <button
                onClick={() => setMostrarResumen(false)}
                className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center hover:bg-muted transition-colors cursor-pointer"
                aria-label="Cerrar"
              >
                <X size={18} />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 p-5 space-y-4">
              {/* En cocina */}
              {itemsPendientes.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Clock size={13} className="text-amber-500" />
                    <span className="text-xs font-semibold uppercase tracking-widest text-amber-600">
                      En cocina
                    </span>
                  </div>
                  <div className="space-y-2">
                    {itemsPendientes.map((item) => (
                      <div key={item.id} className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <span className="text-sm text-foreground">
                            {item.cantidad} {item.nombreEs}
                          </span>
                          {item.modificacionesSeleccionadas && item.modificacionesSeleccionadas.length > 0 && (
                            <p className="text-xs text-red-600 mt-0.5">
                              {item.modificacionesSeleccionadas.join(', ')}
                            </p>
                          )}
                        </div>
                        <span className="text-sm text-muted-foreground flex-shrink-0">
                          {(item.precio * item.cantidad).toFixed(2)} €
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Listos */}
              {itemsListos.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle size={13} className="text-green-500" />
                    <span className="text-xs font-semibold uppercase tracking-widest text-green-600">
                      Servido
                    </span>
                  </div>
                  <div className="space-y-2">
                    {itemsListos.map((item) => (
                      <div key={item.id} className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <span className="text-sm text-muted-foreground line-through">
                            {item.cantidad} {item.nombreEs}
                          </span>
                          {item.modificacionesSeleccionadas && item.modificacionesSeleccionadas.length > 0 && (
                            <p className="text-xs text-muted-foreground/60 mt-0.5 line-through">
                              {item.modificacionesSeleccionadas.join(', ')}
                            </p>
                          )}
                        </div>
                        <span className="text-sm text-muted-foreground flex-shrink-0">
                          {(item.precio * item.cantidad).toFixed(2)} €
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {todosLosItems.length === 0 && (
                <p className="text-center text-muted-foreground py-8 text-sm">
                  Aún no has pedido nada.
                </p>
              )}
            </div>

            {/* Total acumulado */}
            <div className="p-5 border-t border-border space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground text-sm">Total acumulado</span>
                <span className="text-2xl font-serif font-bold text-accent">
                  {totalGastado.toFixed(2)} €
                </span>
              </div>
              <p className="text-xs text-muted-foreground text-center">
                El pago se realizará en efectivo o datáfono
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Menú del Día modal */}
      {menuDiaOpen && (
        <div className="fixed inset-0 z-[70] flex flex-col">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMenuDiaOpen(false)} />
          <div className="relative mt-auto bg-white rounded-t-3xl max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="p-5 border-b border-border flex items-center justify-between flex-shrink-0">
              <div>
                <h2 className="text-xl font-serif font-semibold">Menú del Día</h2>
                <p className="text-sm text-muted-foreground">13.95 € · Elige tus platos</p>
              </div>
              <button onClick={() => setMenuDiaOpen(false)} className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center cursor-pointer"><X size={18} /></button>
            </div>

            {/* Scrollable content */}
            <div className="overflow-y-auto flex-1 p-5 space-y-6">

              {/* Step 1: Primer plato */}
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-primary text-white text-xs flex items-center justify-center font-bold">1</span>
                  Primer plato
                </h3>
                <div className="space-y-1.5">
                  {MENU_DIA_PRIMER.map(op => (
                    <button
                      key={op.nombre}
                      onClick={() => setMenuDiaPrimer(op.nombre)}
                      className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-colors cursor-pointer text-sm ${
                        menuDiaPrimer === op.nombre
                          ? 'border-primary bg-primary/5 font-medium text-primary'
                          : 'border-border bg-white text-foreground hover:border-primary/50'
                      }`}
                    >
                      <DishName text={op.nombre} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Segundo plato */}
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-primary text-white text-xs flex items-center justify-center font-bold">2</span>
                  Arroz o Fideos
                </h3>
                <div className="space-y-1.5">
                  {MENU_DIA_SEGUNDO.map(op => (
                    <button
                      key={op.nombre}
                      onClick={() => setMenuDiaSegundo(op.nombre)}
                      className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-colors cursor-pointer text-sm ${
                        menuDiaSegundo === op.nombre
                          ? 'border-primary bg-primary/5 font-medium text-primary'
                          : 'border-border bg-white text-foreground hover:border-primary/50'
                      }`}
                    >
                      <DishName text={op.nombre} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 3: Principal */}
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-primary text-white text-xs flex items-center justify-center font-bold">3</span>
                  Plato principal
                </h3>
                <div className="space-y-1.5">
                  {MENU_DIA_PRINCIPAL.map(op => (
                    <button
                      key={op.nombre}
                      onClick={() => setMenuDiaPrincipal(op.nombre)}
                      className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-colors cursor-pointer text-sm ${
                        menuDiaPrincipal === op.nombre
                          ? 'border-primary bg-primary/5 font-medium text-primary'
                          : 'border-border bg-white text-foreground hover:border-primary/50'
                      }`}
                    >
                      <DishName text={op.nombre} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Para terminar - informational */}
              <div className="bg-secondary rounded-2xl p-4">
                <h3 className="text-sm font-semibold text-foreground mb-2">Para terminar</h3>
                <p className="text-sm text-muted-foreground">El camarero pasará a tomarte nota del postre o café</p>
                <p className="text-sm text-foreground mt-2 font-medium">✓ Bebida incluida (agua, refresco o cerveza)</p>
              </div>
            </div>

            {/* Footer */}
            <div className="p-5 border-t border-border flex-shrink-0">
              {(menuDiaPrimer || menuDiaSegundo || menuDiaPrincipal) && (
                <div className="mb-3 text-sm text-muted-foreground">
                  {calcularPrecioMenuDia() > MENU_DIA_PRECIO_BASE && (
                    <span className="text-primary font-medium">Total: {calcularPrecioMenuDia().toFixed(2)} € (incluye suplementos)</span>
                  )}
                </div>
              )}
              <button
                onClick={handleAgregarMenuDia}
                disabled={!menuDiaPrimer || !menuDiaSegundo || !menuDiaPrincipal}
                className="w-full bg-primary text-white rounded-2xl py-4 font-semibold text-base hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer active:scale-[0.98]"
              >
                {(!menuDiaPrimer || !menuDiaSegundo || !menuDiaPrincipal)
                  ? 'Elige todos los platos'
                  : `Añadir Menú del Día — ${calcularPrecioMenuDia().toFixed(2)} €`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Selector obligatorio modal */}
      {selectorPlatoId && (() => {
        const sel = SELECTORES_OBLIGATORIOS[selectorPlatoId];
        const basePlato = PLATOS_MAP[selectorPlatoId];
        if (!sel || !basePlato) return null;
        return (
          <div className="fixed inset-0 z-[70] flex items-end justify-center">
            <div className="absolute inset-0 bg-black/50" onClick={() => setSelectorPlatoId(null)} />
            <div className="relative bg-white rounded-t-3xl w-full max-w-lg p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-serif font-semibold">{basePlato.nombreEs.split('(')[0].trim()}</h2>
                <button onClick={() => setSelectorPlatoId(null)} className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center cursor-pointer"><X size={18} /></button>
              </div>
              <p className="text-sm font-medium text-muted-foreground">{sel.label}</p>
              <div className="space-y-2">
                {sel.opciones.map(op => (
                  <button
                    key={op}
                    onClick={() => setSelectorChoice(op)}
                    className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-colors cursor-pointer text-sm ${
                      selectorChoice === op
                        ? 'border-primary bg-primary/5 font-medium text-primary'
                        : 'border-border bg-white text-foreground hover:border-primary/50'
                    }`}
                  >
                    {op}
                  </button>
                ))}
              </div>
              <button
                onClick={handleSelectorConfirm}
                disabled={!selectorChoice}
                className="w-full bg-primary text-white rounded-2xl py-3.5 font-semibold hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                {selectorChoice ? `Añadir ${selectorChoice}` : 'Elige una opción'}
              </button>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
