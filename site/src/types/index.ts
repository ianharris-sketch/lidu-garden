export type Zona = 'interior' | 'exterior';
export type EstadoMesa = 'vacia' | 'con-pedido' | 'listo-servir';
export type EstadoItem = 'pendiente' | 'listo';
export type EstadoPedido = 'pendiente' | 'parcial' | 'listo';
export type Categoria =
  | 'novedades'
  | 'ensaladas'
  | 'sopas'
  | 'entrantes'
  | 'arroces'
  | 'sushi_maki'
  | 'sushi_pieza'
  | 'sashimi'
  | 'pescado'
  | 'pato'
  | 'pollo'
  | 'ternera'
  | 'recien_llegados'
  | 'postres'
  | 'bebidas'
  | 'cafe_te'
  | 'vinos'
  | 'menus';

export interface Plato {
  id: string;
  nombreEs: string;
  nombreZh: string;
  precio: number;
  foto: string;
  ingredientes: string[];
  categoria: Categoria;
  notas?: string;
  modificaciones?: string[];
  descripcion?: string;
  alergenos?: number[];
  fotoPosition?: string;
}

export interface ItemPedido {
  id: string;
  platoId: string;
  nombreEs: string;
  nombreZh: string;
  precio: number;
  cantidad: number;
  estado: EstadoItem;
  addedAt: number;
  modificacionesSeleccionadas?: string[];
  destino?: 'cocina' | 'barra';
}

export interface Pedido {
  id: string;
  mesaId: string;
  tipo?: 'mesa' | 'recoger';
  numeroRecoger?: number;
  items: Record<string, ItemPedido>;
  timestamp: number;
  estado: EstadoPedido;
  enviado: boolean;
}

export interface Mesa {
  numero: number;
  zona: Zona;
  estado: EstadoMesa;
}

export interface LogEntry {
  timestamp: number;
  tipo: string;
  mesaId?: string;
  datos: Record<string, unknown>;
}
