import type { Metadata } from "next";
import ReservarButton from "@/components/ReservarButton";
import CartaAccordion from "@/components/CartaAccordion";

export const metadata: Metadata = {
  title: "Carta · LiDu Garden",
  description:
    "Descubre nuestra carta de cocina fusión asiática: ensaladas, sopas, entrantes, pato, sushi, postres y más. Restaurante LiDu Garden en Mutxamel, Alicante.",
};

export default function CartaPage() {
  return (
    <>
      {/* Header */}
      <section className="pt-32 pb-12 px-4 text-center bg-[#FDFAF6]">
        <p className="text-xs uppercase tracking-[0.2em] text-[#7A52A0] font-semibold mb-3">
          LiDu Garden
        </p>
        <h1 className="font-display text-5xl md:text-6xl text-[#1C0F2E] mb-4">Nuestra carta</h1>
        <p className="text-[#7A6585] max-w-md mx-auto text-sm leading-relaxed">
          Cocina china, japonesa, tailandesa y vietnamita. Los precios incluyen IVA.
          Consulta posibles alergenos con nuestro equipo.
        </p>
      </section>

      {/* Accordion menu */}
      <CartaAccordion />

      {/* Allergen legend */}
      <section className="max-w-5xl mx-auto px-4 pb-14">
        <div className="rounded-2xl bg-[#F0EBF7] px-6 md:px-10 py-8">
          <p className="text-xs uppercase tracking-[0.2em] text-[#7A52A0] font-semibold mb-1">
            Información de alérgenos
          </p>
          <p className="text-sm text-[#7A6585] mb-5 leading-relaxed">
            Los números junto a cada plato indican los alérgenos presentes según el Reglamento Europeo 1169/2011.
            Consulta con nuestro equipo si tienes dudas o alergias.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2">
            {([
              [1, "Gluten"], [2, "Crustáceos"], [3, "Huevos"], [4, "Pescado"],
              [5, "Cacahuetes"], [6, "Soja"], [7, "Lácteos"], [8, "Frutos de cáscara"],
              [9, "Apio"], [10, "Mostaza"], [11, "Sésamo"], [12, "Moluscos"],
              [13, "Altramuces"], [14, "Sulfitos"],
            ] as [number, string][]).map(([n, name]) => (
              <div key={n} className="flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#7A52A0] text-white text-[10px] font-bold shrink-0">
                  {n}
                </span>
                <span className="text-xs text-[#1C0F2E] leading-tight">{name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reserva CTA */}
      <section className="py-16 px-4 bg-[#2A1444] text-center text-white">
        <h2 className="font-display text-3xl md:text-4xl mb-4">¿Preparado para disfrutar?</h2>
        <p className="text-white/60 mb-8 text-sm">Reserva tu mesa y te esperamos con todo listo.</p>
        <ReservarButton className="bg-[#C8973D] hover:bg-[#b5872e] text-white font-semibold px-9 py-3.5 rounded-full text-sm transition-colors shadow-sm">
          Reservar mesa
        </ReservarButton>
      </section>
    </>
  );
}
