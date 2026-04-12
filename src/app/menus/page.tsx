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

      {/* Nota alérgenos */}
      <section className="py-12 px-4 bg-[#F0EBF7]">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-sm text-[#7A6585] leading-relaxed">
            Si tienes alguna alergia o intolerancia alimentaria, consúltanos antes de pedir.
            Adaptamos los platos siempre que sea posible.{" "}
            <a href="tel:965951170" className="text-[#7A52A0] font-medium hover:underline">
              965 951 170
            </a>{" "}
            ·{" "}
            <a
              href="mailto:info@lidugarden.com"
              className="text-[#7A52A0] font-medium hover:underline"
            >
              info@lidugarden.com
            </a>
          </p>
        </div>
      </section>
    </>
  );
}
