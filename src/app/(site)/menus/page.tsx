import type { Metadata } from "next";
import MenusClient from "@/components/MenusClient";

export const metadata: Metadata = {
  title: "Menús · LiDu Garden",
  description:
    "Menú del día, japonés, cantonés, vegetariano, degustación y menú de grupo en LiDu Garden. Cocina fusión asiática en Mutxamel, Alicante.",
};

export default function MenusPage() {
  return (
    <>
      {/* Header */}
      <section className="pt-32 pb-12 px-4 text-center bg-[#FDFAF6]">
        <p className="text-xs uppercase tracking-[0.2em] text-[#7A52A0] font-semibold mb-3">
          LiDu Garden
        </p>
        <h1 className="font-display text-5xl md:text-6xl text-[#1C0F2E] mb-4">Menús</h1>
        <p className="text-[#7A6585] max-w-md mx-auto text-sm leading-relaxed">
          Del menú del día a una noche de degustación. Todos los precios incluyen IVA.
          Postre incluido en todos los menús, bebida solo en el menú del día.
        </p>
      </section>

      {/* Interactive menus */}
      <MenusClient />

      {/* Allergen legend */}
      <section className="px-4 pb-16 bg-[#FDFAF6]">
        <div className="max-w-5xl mx-auto">
          <div className="rounded-2xl bg-[#F0EBF7] px-6 md:px-10 py-8">
            <p className="text-xs uppercase tracking-[0.2em] text-[#7A52A0] font-semibold mb-1">
              Información de alérgenos
            </p>
            <p className="text-sm text-[#7A6585] mb-5 leading-relaxed">
              Los números junto a cada plato indican los alérgenos presentes según el Reglamento Europeo 1169/2011.
              Si tienes alguna alergia o intolerancia, consúltanos antes de pedir —{" "}
              <a href="tel:965951170" className="text-[#7A52A0] font-medium hover:underline">965 951 170</a>.
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
        </div>
      </section>
    </>
  );
}
