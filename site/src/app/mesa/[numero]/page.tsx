import MesaClient from '@/components/mesa/MesaClient';

export function generateStaticParams() {
  return Array.from({ length: 23 }, (_, i) => ({ numero: String(i + 1) }));
}

type Props = { params: Promise<{ numero: string }> };

export default async function MesaPage({ params }: Props) {
  const { numero } = await params;
  const mesaNum = parseInt(numero, 10);

  if (isNaN(mesaNum) || mesaNum < 1 || mesaNum > 23) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground text-lg">Mesa no encontrada.</p>
      </div>
    );
  }

  return <MesaClient mesaNum={mesaNum} mesaId={`mesa-${mesaNum}`} />;
}
