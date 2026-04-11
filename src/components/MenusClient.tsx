"use client";

import { useState } from "react";
import ReservarButton from "@/components/ReservarButton";
import { Check, Phone, Mail, ChevronDown } from "lucide-react";

type CourseGroup = { label: string; options: string[] };

type MenuCard = {
  id: string;
  tag: string;
  title: string;
  shortTitle: string;
  price?: string;
  priceNote?: string;
  description: string;
  courses?: CourseGroup[];
  includes?: string[];
  highlight: boolean;
  type: "reservar" | "grupo";
};

const menus: MenuCard[] = [
  {
    id: "del-dia",
    tag: "Martes a viernes · Solo mediodía",
    title: "Menú del Día",
    shortTitle: "Menú del Día",
    price: "13,95",
    priceNote: "por persona",
    description:
      "Primer plato, segundo, principal, postre y bebida. Cambia cada día según el mercado.",
    courses: [
      {
        label: "Primer plato · elige uno",
        options: [
          "Ensalada de la Casa",
          "Rollito Estilo Thai de Verdura",
          "Sopa Miso",
          "Sopa Agripicante Estilo Beijing",
          "Gioza Empanadilla de Verdura (+2 €)",
          "Maki de Aguacate vegan (+2 €)",
        ],
      },
      {
        label: "Segundo plato · arroz o fideos",
        options: [
          "Arroz Frito Tres Delicias",
          "Tallarines con Pollo",
          "Arroz Blanco (vegan)",
          "Arroz Frito Lidu (+1 €)",
        ],
      },
      {
        label: "Principal · elige uno",
        options: [
          "Pollo al Curry",
          "Pollo al Limón",
          "Pollo Almendrado",
          "Pollo con Bambú y Setas Chinas",
          "Ternera con Salsa de Ostras",
          "Ternera con Cebolla",
          "Cerdo Agridulce con Piña",
          "Verduras al Wok (vegan)",
          "Pescado al Vapor Estilo Thai (+2 €)",
        ],
      },
      {
        label: "Para terminar",
        options: ["Postre o café", "Bebida incluida (agua, refresco o cerveza)"],
      },
    ],
    highlight: false,
    type: "reservar",
  },
  {
    id: "cantones",
    tag: "Mínimo 2 personas",
    title: "Menú Cantonés",
    shortTitle: "Cantonés",
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
    shortTitle: "Japonés",
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
    shortTitle: "Vegetariano",
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
    shortTitle: "Degustación",
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
    shortTitle: "Grupo",
    description:
      "Cumpleaños, reuniones familiares, empresas, despedidas. Sin carta fija: diseñamos el menú contigo según el grupo, preferencias y presupuesto.",
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

function MenuCardContent({ menu }: { menu: MenuCard }) {
  const [openCourse, setOpenCourse] = useState<number | null>(null);

  return (
    <div
      className={`rounded-2xl overflow-hidden flex flex-col w-full ${
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
            <span className={`text-xs ${menu.highlight ? "text-white/50" : "text-[#7A6585]"}`}>
              {menu.priceNote}
            </span>
          </div>
        ) : (
          <div className="mb-4">
            <span className={`font-display text-2xl font-semibold ${menu.highlight ? "text-[#C8973D]" : "text-[#6B3F8C]"}`}>
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

        {/* Courses (Menú del Día) */}
        {menu.courses && (
          <div className="space-y-2 mb-8 flex-1">
            {menu.courses.map((course, idx) => (
              <div
                key={course.label}
                className="border border-[#E8D9F5] rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenCourse(openCourse === idx ? null : idx)}
                  className="w-full flex items-center justify-between px-4 py-3 text-left"
                >
                  <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[#6B3F8C]">
                    {course.label}
                  </span>
                  <ChevronDown
                    size={15}
                    className={`text-[#6B3F8C] shrink-0 transition-transform duration-200 ${
                      openCourse === idx ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openCourse === idx && (
                  <ul className="px-4 pb-3 space-y-1.5 border-t border-[#E8D9F5]">
                    {course.options.map((opt) => (
                      <li key={opt} className="flex items-start gap-2 pt-1.5">
                        <Check size={13} className="mt-0.5 shrink-0 text-[#6B3F8C]" />
                        <span className="text-sm text-[#1C0F2E]">{opt}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Includes list (other menus) */}
        {menu.includes && (
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
                  className={`text-sm ${menu.highlight ? "text-white/80" : "text-[#1C0F2E]"}`}
                >
                  {item}
                </span>
              </li>
            ))}
          </ul>
        )}

        {/* CTA */}
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
              className="w-full py-3.5 rounded-full text-sm font-semibold bg-[#6B3F8C] hover:bg-[#5a3378] text-white flex items-center justify-center gap-2 transition-colors"
            >
              <Phone size={15} />
              965 951 170
            </a>
            <a
              href="mailto:info@lidugarden.com"
              className="w-full py-3 rounded-full text-sm font-medium border border-[#E8D9F5] text-[#6B3F8C] hover:bg-[#F0EBF7] flex items-center justify-center gap-2 transition-colors"
            >
              <Mail size={15} />
              info@lidugarden.com
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default function MenusClient() {
  const [selected, setSelected] = useState("del-dia");
  const activeMenu = menus.find((m) => m.id === selected)!;

  return (
    <>
      {/* ── MOBILE: selector buttons + single card ── */}
      <div className="md:hidden px-4 pb-20">

        {/* Floating button grid */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          {menus.map((menu) => {
            const isActive = selected === menu.id;
            return (
              <button
                key={menu.id}
                onClick={() => setSelected(menu.id)}
                className={`relative rounded-2xl px-4 py-4 text-left shadow-md transition-all duration-200 ${
                  isActive
                    ? menu.highlight
                      ? "bg-[#2A1444] ring-2 ring-[#C8973D]"
                      : "bg-[#6B3F8C]"
                    : "bg-white border border-[#E8D9F5]"
                }`}
              >
                {menu.highlight && (
                  <span className="absolute -top-2 left-3 bg-[#C8973D] text-white text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full">
                    ★ Más pedido
                  </span>
                )}
                <p
                  className={`font-display text-base leading-tight mb-1 ${
                    isActive ? "text-white" : "text-[#1C0F2E]"
                  }`}
                >
                  {menu.shortTitle}
                </p>
                <p
                  className={`text-xs font-semibold ${
                    isActive
                      ? menu.highlight
                        ? "text-[#C8973D]"
                        : "text-white/70"
                      : "text-[#6B3F8C]"
                  }`}
                >
                  {menu.price ? `${menu.price} €` : "A medida"}
                </p>
              </button>
            );
          })}
        </div>

        {/* Active menu card */}
        <MenuCardContent menu={activeMenu} />
      </div>

      {/* ── DESKTOP: all 6 cards ── */}
      <div className="hidden md:block pb-20 px-4">
        <div className="max-w-5xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {menus.map((menu) => (
            <MenuCardContent key={menu.id} menu={menu} />
          ))}
        </div>
      </div>
    </>
  );
}
