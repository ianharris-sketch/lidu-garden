import type { Metadata } from "next";
import ReservarButton from "@/components/ReservarButton";
import { Check } from "lucide-react";

export const metadata: Metadata = {
  title: "Menús · LiDu Garden",
  description:
    "Menús del día, menú de grupo y opciones especiales en LiDu Garden. Cocina fusión asiática en Mutxamel, Alicante.",
};

const menus = [
  {
    id: "diario",
    tag: "De lunes a viernes",
    title: "Menú del día",
    price: "13,50",
    priceNote: "por persona",
    description:
      "Un primer plato, un segundo, postre o café y bebida. Cambia cada día según el mercado. Siempre cocinado al momento.",
    includes: [
      "1 primer plato a elegir",
      "1 segundo plato a elegir",
      "Pan",
      "Bebida incluida (agua, refresco o cerveza)",
      "Postre o café",
    ],
    highlight: false,
    cta: "Reservar para comer",
  },
  {
    id: "degustacion",
    tag: "Todo el año",
    title: "Menú degustación",
    price: "32,00",
    priceNote: "por persona · mínimo 2",
    description:
      "Un recorrido por las cuatro cocinas de LiDu Garden. Gyozas, sushi, un principal y postre. Para los que quieren probarlo todo.",
    includes: [
      "Entrante surtido (gyozas, rollitos y edamame)",
      "Bandeja de sushi mixta (8 piezas por persona)",
      "Principal a elegir",
      "Postre del día",
      "Té de jazmín o agua mineral",
    ],
    highlight: true,
    cta: "Reservar menú degustación",
  },
  {
    id: "grupos",
    tag: "Para 8 o más personas",
    title: "Menú de grupo",
    price: "27,00",
    priceNote: "por persona",
    description:
      "Perfecto para cumpleaños, reuniones familiares o cualquier celebración que merezca una mesa larga y buena comida. Se reserva con antelación.",
    includes: [
      "Entrantes para compartir (variados)",
      "Plato de arroz o fideos para la mesa",
      "Principal a elegir por persona",
      "Postre o fruta de temporada",
      "Bebida incluida",
      "Café al final",
    ],
    highlight: false,
    cta: "Consultar disponibilidad",
  },
];

export default function MenusPage() {
  return (
    <>
      {/* Header */}
      <section className="pt-32 pb-16 px-4 text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-[#6B3F8C] font-semibold mb-3">
          LiDu Garden
        </p>
        <h1 className="font-display text-5xl md:text-6xl text-[#1C0F2E] mb-4">Menús</h1>
        <p className="text-[#7A6585] max-w-md mx-auto text-sm leading-relaxed">
          Para el día a día y para los momentos que se celebran. Todos los precios incluyen IVA.
        </p>
      </section>

      {/* Menu cards */}
      <section className="pb-20 px-4">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
          {menus.map((menu) => (
            <div
              key={menu.id}
              className={`rounded-2xl overflow-hidden flex flex-col ${
                menu.highlight
                  ? "bg-[#2A1444] text-white shadow-xl ring-2 ring-[#C8973D]"
                  : "bg-white shadow-sm border border-[#E8D9F5]"
              }`}
            >
              {menu.highlight && (
                <div className="bg-[#C8973D] text-white text-center text-xs font-semibold uppercase tracking-[0.15em] py-2">
                  El más pedido
                </div>
              )}
              <div className="p-7 flex flex-col flex-1">
                <p
                  className={`text-xs uppercase tracking-[0.15em] font-semibold mb-2 ${
                    menu.highlight ? "text-[#C8973D]" : "text-[#6B3F8C]"
                  }`}
                >
                  {menu.tag}
                </p>
                <h2
                  className={`font-display text-3xl mb-2 ${
                    menu.highlight ? "text-white" : "text-[#1C0F2E]"
                  }`}
                >
                  {menu.title}
                </h2>
                <div className="flex items-baseline gap-1 mb-4">
                  <span
                    className={`font-display text-4xl font-semibold ${
                      menu.highlight ? "text-[#C8973D]" : "text-[#6B3F8C]"
                    }`}
                  >
                    {menu.price} €
                  </span>
                  <span
                    className={`text-xs ${menu.highlight ? "text-white/50" : "text-[#7A6585]"}`}
                  >
                    {menu.priceNote}
                  </span>
                </div>
                <p
                  className={`text-sm leading-relaxed mb-6 ${
                    menu.highlight ? "text-white/70" : "text-[#7A6585]"
                  }`}
                >
                  {menu.description}
                </p>

                <ul className="space-y-2.5 mb-8 flex-1">
                  {menu.includes.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <Check
                        size={15}
                        className={`mt-0.5 shrink-0 ${
                          menu.highlight ? "text-[#C8973D]" : "text-[#6B3F8C]"
                        }`}
                      />
                      <span
                        className={`text-sm ${
                          menu.highlight ? "text-white/80" : "text-[#1C0F2E]"
                        }`}
                      >
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>

                <ReservarButton
                  className={`w-full py-3.5 rounded-full text-sm font-semibold transition-colors ${
                    menu.highlight
                      ? "bg-[#C8973D] hover:bg-[#b5872e] text-white"
                      : "bg-[#6B3F8C] hover:bg-[#5a3378] text-white"
                  }`}
                >
                  {menu.cta}
                </ReservarButton>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Nota alérgenos */}
      <section className="py-12 px-4 bg-[#F0EBF7]">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-sm text-[#7A6585] leading-relaxed">
            Si tienes alguna alergia o intolerancia alimentaria, consúltanos antes de pedir.
            Adaptamos los platos siempre que sea posible.{" "}
            <a href="tel:965951170" className="text-[#6B3F8C] font-medium hover:underline">
              965 951 170
            </a>{" "}
            ·{" "}
            <a href="mailto:info@lidugarden.com" className="text-[#6B3F8C] font-medium hover:underline">
              info@lidugarden.com
            </a>
          </p>
        </div>
      </section>
    </>
  );
}
