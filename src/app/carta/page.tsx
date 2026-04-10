import type { Metadata } from "next";
import ReservarButton from "@/components/ReservarButton";

export const metadata: Metadata = {
  title: "Carta · LiDu Garden",
  description:
    "Descubre nuestra carta de cocina fusión asiática: entrantes, sushi, platos principales, postres y más. Restaurante LiDu Garden en Mutxamel, Alicante.",
};

const menuSections = [
  {
    id: "entrantes",
    title: "Entrantes",
    subtitle: "Para empezar",
    items: [
      { name: "Gyozas de cerdo y verduras", desc: "6 piezas · salsa de soja y jengibre", price: "7,90" },
      { name: "Rollitos de primavera", desc: "4 piezas · salsa agridulce", price: "6,50" },
      { name: "Edamame al vapor", desc: "Con sal marina y limón", price: "4,50" },
      { name: "Sopa miso", desc: "Tofu, alga wakame, cebolleta", price: "4,00" },
      { name: "Tempura de gambas", desc: "4 piezas · salsa tentsuyu", price: "9,50" },
      { name: "Ensalada wakame", desc: "Alga, pepino, sésamo y vinagreta ponzu", price: "7,00" },
    ],
  },
  {
    id: "sushi",
    title: "Sushi",
    subtitle: "Del día",
    items: [
      { name: "Nigiri de salmón", desc: "2 piezas · salmón fresco", price: "5,50" },
      { name: "Nigiri de gamba", desc: "2 piezas · gamba cocida", price: "5,50" },
      { name: "Nigiri de atún", desc: "2 piezas · atún rojo", price: "6,50" },
      { name: "Nigiri de anguila", desc: "2 piezas · glaseado teriyaki", price: "6,00" },
      { name: "California Roll", desc: "8 piezas · aguacate, surimi, pepino", price: "9,50" },
      { name: "Maki de aguacate", desc: "6 piezas · clásico", price: "5,50" },
      { name: "Maki de salmón", desc: "6 piezas · salmón fresco", price: "6,50" },
      { name: "Spicy Tuna Roll", desc: "8 piezas · atún, sriracha, pepino", price: "10,50" },
      { name: "Bandeja sushi mixta", desc: "20 piezas variadas · para compartir", price: "24,00" },
    ],
  },
  {
    id: "principales",
    title: "Platos principales",
    subtitle: "De cocina china, japonesa, tailandesa y vietnamita",
    items: [
      { name: "Pato Pekín", desc: "Crepes, salsa hoisin, pepino y cebolleta", price: "18,50" },
      { name: "Pollo kung pao", desc: "Cacahuetes, pimientos y chili", price: "14,00" },
      { name: "Ternera con brócoli", desc: "Salsa de ostras, arroz basmati", price: "15,50" },
      { name: "Pad thai de gambas", desc: "Fideos de arroz, huevo, cacahuetes", price: "15,00" },
      { name: "Ramen tonkotsu", desc: "Caldo de cerdo, cerdo chāshū, huevo onsen", price: "14,50" },
      { name: "Yakitori de pollo", desc: "6 brochetas glaseadas · salsa teriyaki", price: "13,50" },
      { name: "Curry verde tailandés", desc: "Pollo o tofu, leche de coco, arroz jazmín", price: "14,50" },
      { name: "Pho bo vietnamita", desc: "Caldo de ternera, fideos de arroz, hierbas", price: "13,50" },
    ],
  },
  {
    id: "arroz",
    title: "Arroces y fideos",
    subtitle: "Para compartir o como plato principal",
    items: [
      { name: "Arroz frito tres delicias", desc: "Huevo, jamón, gambas y verduras", price: "9,50" },
      { name: "Arroz frito con pato Pekín", desc: "Especialidad de la casa", price: "12,50" },
      { name: "Fideos udon salteados", desc: "Verduras, shiitake y salsa de soja", price: "11,50" },
      { name: "Chow mein de gambas", desc: "Fideos cantoneses salteados", price: "12,00" },
    ],
  },
  {
    id: "postres",
    title: "Postres",
    subtitle: "Para terminar bien",
    items: [
      { name: "Mochi de helado", desc: "Vainilla, fresa o matcha · 3 piezas", price: "5,50" },
      { name: "Tarta de queso japonesa", desc: "Esponjosa, con mermelada de yuzu", price: "5,00" },
      { name: "Helado de té matcha", desc: "2 bolas con galleta", price: "4,50" },
      { name: "Banana frita con miel", desc: "Sésamo y helado de vainilla", price: "5,50" },
    ],
  },
  {
    id: "bebidas",
    title: "Bebidas",
    subtitle: "Para acompañar",
    items: [
      { name: "Sake frío", desc: "Junmai · 180 ml", price: "6,50" },
      { name: "Té de jazmín", desc: "Tetera · para dos", price: "4,50" },
      { name: "Matcha latte", desc: "Frío o caliente", price: "4,00" },
      { name: "Cerveza Asahi", desc: "33 cl", price: "3,50" },
      { name: "Agua mineral", desc: "50 cl · con o sin gas", price: "2,00" },
    ],
  },
];

export default function CartaPage() {
  return (
    <>
      {/* Header */}
      <section className="pt-32 pb-16 px-4 text-center bg-[#FDFAF6]">
        <p className="text-xs uppercase tracking-[0.2em] text-[#6B3F8C] font-semibold mb-3">
          LiDu Garden
        </p>
        <h1 className="font-display text-5xl md:text-6xl text-[#1C0F2E] mb-4">Nuestra carta</h1>
        <p className="text-[#7A6585] max-w-md mx-auto text-sm leading-relaxed">
          Cocina china, japonesa, tailandesa y vietnamita. Los precios incluyen IVA.
          Consulta posibles alergenos con nuestro equipo.
        </p>
      </section>

      {/* Nav anchors */}
      <div className="sticky top-16 md:top-20 z-40 bg-white/95 backdrop-blur-sm border-b border-[#E8D9F5]">
        <div className="max-w-5xl mx-auto px-4 overflow-x-auto">
          <div className="flex items-center gap-1 py-3 min-w-max">
            {menuSections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="px-4 py-1.5 rounded-full text-xs font-medium text-[#7A6585] hover:text-[#6B3F8C] hover:bg-[#F0EBF7] transition-colors whitespace-nowrap"
              >
                {section.title}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Menu sections */}
      <div className="max-w-5xl mx-auto px-4 py-12 space-y-16">
        {menuSections.map((section, i) => (
          <section
            key={section.id}
            id={section.id}
            className={`rounded-2xl p-6 md:p-10 ${i % 2 === 0 ? "bg-white shadow-sm" : "bg-[#F0EBF7]"}`}
          >
            <div className="mb-8">
              <p className="text-xs uppercase tracking-[0.15em] text-[#C8973D] font-semibold mb-1">
                {section.subtitle}
              </p>
              <h2 className="font-display text-3xl md:text-4xl text-[#1C0F2E]">{section.title}</h2>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {section.items.map((item) => (
                <div
                  key={item.name}
                  className="flex items-start justify-between gap-4 py-4 border-b border-[#E8D9F5] last:border-0"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[#1C0F2E] text-sm leading-snug">{item.name}</p>
                    <p className="text-xs text-[#7A6585] mt-0.5 leading-relaxed">{item.desc}</p>
                  </div>
                  <span className="font-semibold text-[#6B3F8C] text-sm shrink-0">{item.price} €</span>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Reserva CTA */}
      <section className="py-16 px-4 bg-[#2A1444] text-center text-white">
        <h2 className="font-display text-3xl md:text-4xl mb-4">¿Lista la elección?</h2>
        <p className="text-white/60 mb-8 text-sm">Reserva tu mesa y te esperamos con todo listo.</p>
        <ReservarButton className="bg-[#C8973D] hover:bg-[#b5872e] text-white font-semibold px-9 py-3.5 rounded-full text-sm transition-colors shadow-sm">
          Reservar mesa
        </ReservarButton>
      </section>
    </>
  );
}
