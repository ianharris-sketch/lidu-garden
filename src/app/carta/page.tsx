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

      {/* Reserva CTA */}
      <section className="py-16 px-4 bg-[#2A1444] text-center text-white">
        <h2 className="font-display text-3xl md:text-4xl mb-4">Preparado para disfrutar</h2>
        <p className="text-white/60 mb-8 text-sm">Reserva tu mesa y te esperamos con todo listo.</p>
        <ReservarButton className="bg-[#C8973D] hover:bg-[#b5872e] text-white font-semibold px-9 py-3.5 rounded-full text-sm transition-colors shadow-sm">
          Reservar mesa
        </ReservarButton>
      </section>
    </>
  );
}
