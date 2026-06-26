import Link from 'next/link';
import { ALERGENOS_LEYENDA } from '@/data/menu';

export default function AlergenosPage() {
  const entradas = Object.entries(ALERGENOS_LEYENDA) as [string, string][];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-border px-4 py-4 flex items-center gap-3">
        <Link
          href="javascript:history.back()"
          className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-foreground hover:bg-muted transition-colors cursor-pointer text-sm"
          aria-label="Volver"
        >
          ←
        </Link>
        <h1 className="text-lg font-serif font-semibold text-foreground">Alérgenos</h1>
      </header>

      {/* Contenido */}
      <main className="flex-1 flex flex-col justify-center px-5 py-8 max-w-lg mx-auto w-full">
        <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
          Según el Reglamento (UE) n.º 1169/2011, los 14 alérgenos de declaración obligatoria son:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
          {entradas.map(([num, nombre]) => (
            <div key={num} className="flex items-baseline gap-2">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center leading-none">
                {num}
              </span>
              <span className="text-base text-foreground">{nombre}</span>
            </div>
          ))}
        </div>

        <p className="text-xs text-muted-foreground/60 mt-8 leading-relaxed">
          Si tienes alguna alergia o intolerancia alimentaria, informa al personal antes de realizar tu pedido.
        </p>
      </main>
    </div>
  );
}
