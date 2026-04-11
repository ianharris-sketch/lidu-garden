import type { Metadata } from "next";
import ReservarButton from "@/components/ReservarButton";
import { Check, Phone, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Menús · LiDu Garden",
  description:
    "Menú del día, menú japonés, cantonés, vegetariano, degustación y menú de grupo en LiDu Garden. Cocina fusión asiática en Mutxamel, Alicante.",
};

type MenuCard = {
  id: string;
  tag: string;
  title: string;
  price?: string;
  priceNote?: string;
  description: string;
  includes: string[];
  highlight: boolean;
  type: "reservar" | "grupo";
};

const menus: MenuCard[] = [
  {
    id: "del-dia",
    tag: "Martes a viernes · Solo mediodía",
    title: "Menú del Día",
    price: "13,95",
    priceNote: "por persona",
    description:
      "Primer plato, segundo, principal, postre y bebida. Cambia cada día según lo que manda el mercado.",
    includes: [
      "1.º plato: ensalada, rollito, sopa miso o agripicante",
      "2.º plato: arroz frito tres delicias, tallarines con pollo, arroz blanco o arroz Lidu (+1€)",
      "Principal: pollo al curry, al limón, almendrado, ternera con ostras, cerdo agridulce, verduras al wok o pescado (+2€)",
      "Postre o café",
      "Bebida incluida (agua, refresco o cerveza)",
    ],
    highlight: false,
    type: "reservar",
  },
  {
    id: "cantones",
    tag: "Mínimo 2 personas",
    title: "Menú Cantonés",
    price: "22,00",
    priceNote: "por persona",
    description:
      "Un viaje por la cocina del sur de China. Dim sum, arroz frito, pollo y los postres caseros de Linda.",
    includes: [
      "Surtido de Dim Sum",
      "Rollito de Verdura",
      "Arroz Frito Tres Delicias",
      "Pollo al Limón",
      "Ternera con Salsa de Ostras",
      "Pastel de Calabaza",
      "Crepe Casero con Crema de Soja Roja",
    ],
    highlight: false,
    type: "reservar",
  },
  {
    id: "japones",
    tag: "Mínimo 2 personas",
    title: "Menú Japonés",
    price: "29,00",
    priceNote: "por persona",
    description:
      "Sushi, gyozas, arroz japonés y solomillo teriyaki. Para los que no se conforman con media experiencia.",
    includes: [
      "California Roll",
      "Nigiri de Salmón",
      "Nigiri de Pez de Mantequilla con Trufa",
      "Gioza Empanadilla de Pollo y Verdura",
      "Arroz Frito Japonés",
      "Solomillo de Ternera con Salsa Teriyaki",
      "Mochi Pastel Japonés",
    ],
    highlight: false,
    type: "reservar",
  },
  {
    id: "vegetariano",
    tag: "Mínimo 2 personas · 100% vegetal",
    title: "Menú Vegetariano",
    price: "21,50",
    priceNote: "por persona",
    description:
      "Sin carne, sin pescado, con todo el sabor. Platos que gustan a todo el mundo, no solo a quien no come carne.",
    includes: [
      "Rollito de Verdura",
      "Maki de Aguacate (vegan)",
      "Arroz Frito con Huevo y Verdura",
      "Tofu con Salsa",
      "Tirabeques Salteados con Hongo de Madera",
      "Pudding de Mango Casero o Helado de Matcha",
    ],
    highlight: false,
    type: "reservar",
  },
  {
    id: "degustacion",
    tag: "Mínimo 2 personas",
    title: "Menú Degustación",
    price: "29,95",
    priceNote: "por persona",
    description:
      "Lo mejor de LiDu en una mesa. Saquitos de fortuna, gyozas, pato con ciruela, langostinos al curry rojo y los postres de siempre.",
    includes: [
      "Saquito de Fortuna",
      "Gioza Empanadilla de Pollo y Verdura",
      "Arroz Frito Especial Shanghai",
      "Pato Asado con Salsa de Ciruela y Jengibre",
      "Langostino Salteado con Curry Rojo Thai",
      "Tiramisú Casero o Mini Rollito con Helado de Chocolate",
    ],
    highlight: true,
    type: "reservar",
  },
  {
    id: "grupo",
    tag: "Para grupos y celebraciones",
    title: "Menú de Grupo",
    description:
      "Cumpleaños, reuniones familiares, empresas, despedidas. Sin carta fija: diseñamos el menú contigo según el tamaño del grupo, preferencias y presupuesto. Llámanos o escríbenos y lo organizamos.",
    includes: [
      "Menú personalizado según el grupo",
      "Adaptable a alergias e intolerancias",
      "Posibilidad de incluir sushi",
      "Reserva anticipada recomendada",
    ],
    highlight: false,
    type: "grupo",
  },
];

export default function MenusPage() {
  return (
    <>
      {/* Header */}
      <section className="pt-32 pb-16 px-4 text-center bg-[#FDFAF6]">
        <p className="text-xs uppercase tracking-[0.2em] text-[#6B3F8C] font-semibold mb-3">
          LiDu Garden
        </p>
        <h1 className="font-display text-5xl md:text-6xl text-[#1C0F2E] mb-4">Menús</h1>
        <p className="text-[#7A6585] max-w-md mx-auto text-sm leading-relaxed">
          Del menú del día a una noche de degustación. Todos los precios incluyen IVA.
          Postre incluido en todos los menús, bebida solo en el menú del día.
        </p>
      </section>

      {/* Menu cards */}
      <section className="pb-20 px-4">
        <div className="max-w-5xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  className={`font-display text-3xl mb-3 ${
                    menu.highlight ? "text-white" : "text-[#1C0F2E]"
                  }`}
                >
                  {menu.title}
                </h2>

                {menu.price ? (
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
                ) : (
                  <div className="mb-4">
                    <span
                      className={`font-display text-2xl font-semibold ${
                        menu.highlight ? "text-[#C8973D]" : "text-[#6B3F8C]"
                      }`}
                    >
                      A medida
                    </span>
                  </div>
                )}

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

                {menu.type === "reservar" ? (
                  <ReservarButton
                    className={`w-full py-3.5 rounded-full text-sm font-semibold transition-colors ${
                      menu.highlight
                        ? "bg-[#C8973D] hover:bg-[#b5872e] text-white"
                        : "bg-[#6B3F8C] hover:bg-[#5a3378] text-white"
                    }`}
                  >
                    Reservar mesa
                  </ReservarButton>
                ) : (
                  <div className="flex flex-col gap-2">
                    <a
                      href="tel:965951170"
                      className="w-full py-3.5 rounded-full text-sm font-semibold transition-colors bg-[#6B3F8C] hover:bg-[#5a3378] text-white flex items-center justify-center gap-2"
                    >
                      <Phone size={15} />
                      965 951 170
                    </a>
                    <a
                      href="mailto:info@lidugarden.com"
                      className="w-full py-3 rounded-full text-sm font-medium transition-colors border border-[#E8D9F5] text-[#6B3F8C] hover:bg-[#F0EBF7] flex items-center justify-center gap-2"
                    >
                      <Mail size={15} />
                      info@lidugarden.com
                    </a>
                  </div>
                )}
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
