"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

type MenuItem = { name: string; price: string; a?: number[] };
type SubSection = { title: string; items: MenuItem[] };
type Section = {
  id: string;
  title: string;
  subtitle: string;
  items?: MenuItem[];
  subsections?: SubSection[];
};

export const allergenNames: Record<number, string> = {
  1: "Gluten", 2: "Crustáceos", 3: "Huevos", 4: "Pescado",
  5: "Cacahuetes", 6: "Soja", 7: "Lácteos", 8: "Frutos de cáscara",
  9: "Apio", 10: "Mostaza", 11: "Sésamo", 12: "Moluscos",
  13: "Altramuces", 14: "Sulfitos",
};

const menuSections: Section[] = [
  {
    id: "ensaladas", title: "Ensaladas", subtitle: "Frescas y ligeras",
    items: [
      { name: "Ensalada Japonesa", price: "14,50", a: [2,4,6,12] },
      { name: "Ensalada de Tres Algas con Gambas", price: "9,95", a: [2,3,12] },
      { name: "Ensalada de la Casa", price: "8,95", a: [3,12] },
    ],
  },
  {
    id: "sopas", title: "Sopas", subtitle: "Para entrar en calor",
    items: [
      { name: "Sopa Miso", price: "4,95", a: [4,6] },
      { name: "Sopa Agripicante Estilo Beijing", price: "4,95", a: [3,6,12] },
      { name: "Sopa Wonton Pollo & Gamba", price: "5,25", a: [1,2,6] },
      { name: "Sopa Cremosa de Coco", price: "7,95", a: [2] },
      { name: "Sopa Thai Tom-Yum-Kon", price: "8,95", a: [2] },
    ],
  },
  {
    id: "entrantes", title: "Entrantes", subtitle: "Para compartir",
    items: [
      { name: "Pan Chino Frito", price: "2,20", a: [1,7] },
      { name: "Alga Frita", price: "6,50", a: [11] },
      { name: "Pan de Gamba", price: "3,95", a: [2] },
      { name: "Tempura de Verdura", price: "7,95", a: [1] },
      { name: "Tempura de Marisco & Verdura", price: "13,95", a: [1,2] },
      { name: "Tempura de Langostino", price: "13,95", a: [1,2] },
      { name: "Pechuga de Pollo Relleno de Queso (4 ud.)", price: "6,00", a: [1,3,7] },
      { name: "Rollito Estilo Thai (2 ud.)", price: "6,00", a: [1] },
      { name: "Langostino Cubierto de Pan Rallado y Sésamo (6 ud.)", price: "9,95", a: [1,2,3] },
      { name: "Rollito Vietnamita (2 ud.)", price: "5,50", a: [1] },
      { name: "Minirollito de Gamba (4 ud.)", price: "6,40", a: [1,2] },
      { name: "Gioza Empanadilla de Carne y Verdura (4 ud.)", price: "5,00", a: [1] },
      { name: "Saquito de Fortuna (4 ud.)", price: "6,40", a: [1,4,7] },
      { name: "Brocheta de Pollo Yakitori (2 ud.)", price: "5,40", a: [6,11] },
      { name: "Bola de Dragón", price: "5,00", a: [1] },
      { name: "Surtido de Dim Sum", price: "6,50", a: [1,2,4] },
    ],
  },
  {
    id: "pato", title: "Pato", subtitle: "Especialidad de la casa",
    items: [
      { name: "Pato Laqueado Pekín (entero)", price: "69,00", a: [1] },
      { name: "½ Pato Laqueado Pekín", price: "36,00", a: [1] },
      { name: "Ración de Pato Laqueado Pekín", price: "18,50", a: [1] },
      { name: "Pato Asado Estilo Cantón", price: "14,50", a: [1] },
      { name: "Pato Asado con Salsa de Naranja", price: "16,95", a: [1] },
      { name: "Pato Salteado con Piña y Salsa de Curry Rojo", price: "15,50", a: [1,6] },
      { name: "Pato Asado Estilo Osaka", price: "13,95", a: [1,11] },
      { name: "Pato Asado con Salsa de Ciruela y Jengibre (½)", price: "16,95", a: [1,6] },
      { name: "Pato Asado con Salsa de Ciruela y Jengibre", price: "18,95", a: [1,6] },
    ],
  },
  {
    id: "ternera", title: "Ternera", subtitle: "Platos principales",
    items: [
      { name: "Ternera con Salsa de Ostras", price: "8,50", a: [6] },
      { name: "Ternera con Setas Chinas y Bambú", price: "9,25", a: [6] },
      { name: "Ternera Crujiente con Salsa Agridulce", price: "9,25", a: [6] },
      { name: "Ternera Salteada con Verduras y Salsa de Curry", price: "11,95", a: [6,11] },
      { name: "Solomillo de Ternera con Salsa Teriyaki", price: "15,50", a: [6,11] },
      { name: "Solomillo de Ternera con Salsa de Ciruela", price: "16,50", a: [6] },
    ],
  },
  {
    id: "pollo", title: "Pollo", subtitle: "Platos principales",
    items: [
      { name: "Tiras de Pollo Almendrado", price: "8,50", a: [1,8] },
      { name: "Pechuga de Pollo Rebozado con Salsa de Limón", price: "8,50", a: [1,3] },
      { name: "Dados de Pollo con Verdura y Curry Verde", price: "11,95", a: [6] },
      { name: "Pollo con Bambú y Setas Chinas", price: "8,95", a: [6] },
      { name: "Pollo Teppanyaki con Puerros", price: "10,95", a: [6] },
      { name: "Dados de Pollo con Brócoli y Champiñones", price: "9,50", a: [6] },
      { name: "Delicias de Pollo Agridulce con Sésamo", price: "9,75", a: [6,11] },
      { name: "Dado de Pollo con Cacahuete y Picante", price: "8,50", a: [5,6] },
    ],
  },
  {
    id: "acompañamientos", title: "Acompañamientos", subtitle: "Arroces, fideos y más",
    items: [
      { name: "Arroz Frito Tres Delicias", price: "5,95", a: [3] },
      { name: "Arroz Frito Lidu", price: "7,50", a: [2,3,6] },
      { name: "Arroz Frito Japonés", price: "8,95", a: [2,3,6] },
      { name: "Arroz Frito Thai", price: "7,95", a: [3] },
      { name: "Arroz Frito Especial Shanghai", price: "7,95", a: [2,3] },
      { name: "Kubak de Gambas", price: "9,95", a: [2,6] },
      { name: "Tallarines Teppanyaki con Gambas y Verdura", price: "8,50", a: [1,2,6] },
      { name: "Arroz Frito con Curry, Piña y Gambas", price: "7,95", a: [2] },
      { name: "Tallarines de Soja Frito Tres Delicias", price: "8,50", a: [2,3,6] },
      { name: "Tallarines Caseros de Mi Madre", price: "9,50", a: [1,2,6] },
      { name: "Pai-Tai Tallarines de Arroz con Ternera Estilo Thai", price: "8,95", a: [3,6] },
      { name: "Fideo de Arroz Frito con Gambas y Verduras", price: "8,50", a: [2,3] },
      { name: "Fideo de Arroz Frito Estilo Singapur", price: "8,50", a: [2,3] },
      { name: "Cangrejos Fritos con Pasta de Arroz", price: "10,95", a: [2,3,6] },
      { name: "Albóndigas Estilo Shanghai", price: "8,50", a: [6] },
      { name: "Albóndigas de Cerdo Agridulce con Piña", price: "8,25", a: [1,3,11] },
      { name: "Tartar de Salmón con Trufa y Aguacate", price: "15,95", a: [4,6] },
      { name: "Tofu con Salsa", price: "7,95", a: [6] },
      { name: "Tirabeques Salteados con Hongo de Madera", price: "8,50" },
      { name: "Verduras al Wok", price: "7,25" },
    ],
  },
  {
    id: "sushi", title: "Sushi & Sashimi", subtitle: "Japonés del día",
    subsections: [
      {
        title: "Sushi",
        items: [
          { name: "Sushi de Salmón", price: "5,50", a: [4] },
          { name: "Sushi de Atún", price: "6,00", a: [4] },
          { name: "Sushi de Gambas", price: "5,40", a: [2] },
          { name: "Sushi de Anguila", price: "6,00", a: [4] },
          { name: "Sushi de Pez de Mantequilla con Trufa", price: "6,50", a: [4] },
          { name: "Sushi Variado", price: "18,00", a: [2,4] },
        ],
      },
      {
        title: "Maki",
        items: [
          { name: "Maki de Salmón", price: "6,20", a: [4] },
          { name: "Maki de Atún", price: "6,50", a: [4] },
          { name: "Maki de Surimi, Pepino o Aguacate", price: "5,50", a: [2] },
          { name: "Maki de Anguila con Aguacate", price: "8,50", a: [4,6] },
          { name: "Sésamo Roll", price: "8,95", a: [2,3,11] },
          { name: "California Roll", price: "10,95", a: [2,3,4] },
          { name: "Gambas Roll", price: "7,95", a: [2,3,11] },
        ],
      },
      {
        title: "Sashimi",
        items: [
          { name: "Sashimi de Salmón", price: "9,90", a: [4] },
          { name: "Sashimi de Atún (6 cortes)", price: "12,00", a: [4] },
          { name: "Sashimi Variado (9 cortes)", price: "14,00", a: [4] },
          { name: "Sashimi y Sushi Variado (15 ud.)", price: "21,00", a: [2,3,4] },
        ],
      },
    ],
  },
  {
    id: "pescados", title: "Pescados y Mariscos", subtitle: "Del mar",
    items: [
      { name: "Pescado al Vapor Estilo Thai", price: "15,95", a: [2,4,6] },
      { name: "Salmón con Salsa Teriyaki", price: "13,95", a: [2,6,11] },
      { name: "Langostino Salteado con Brócoli y Champiñones", price: "13,95", a: [2] },
      { name: "Langostino Salteado con Verduras y Curry Rojo Thai", price: "13,95", a: [2] },
      { name: "Langostino Salteado con Crema de Coco", price: "13,95", a: [2] },
      { name: "Langostino con Teriyaki Salsa", price: "13,95", a: [2,6,11] },
      { name: "Langostino Salteado con Albahaca", price: "13,95", a: [2] },
      { name: "Langostino Salteado con Bambú y Setas Chinas", price: "13,95", a: [2,6] },
    ],
  },
  {
    id: "postres", title: "Postres", subtitle: "Para terminar bien",
    items: [
      { name: "Pastel de Calabaza", price: "5,20" },
      { name: "Mini Rollito con Helado de Chocolate", price: "7,90", a: [1,3,7] },
      { name: "Tiramisú Casero", price: "5,95", a: [1,7] },
      { name: "Crepe Casero con Crema de Soja Roja", price: "5,50", a: [1,3,7] },
      { name: "Crepe Relleno de Nata y Frutas", price: "5,20", a: [1,3,7] },
      { name: "Leche Frita con Helado de Sésamo", price: "7,50", a: [3,7,11] },
      { name: "Plátano Frito con Coco Rallado", price: "5,95", a: [3] },
      { name: "Pudding de Mango Casero", price: "4,95", a: [7] },
      { name: "Bola de Sésamo Frito", price: "3,95", a: [11] },
      { name: "Mochi Pastel Japonés (2 ud.)", price: "5,50", a: [7] },
      { name: "Trufa de Té Verde (4 ud.)", price: "5,20", a: [7] },
      { name: "Lychees", price: "3,95" },
      { name: "Trufa de Sake", price: "5,20", a: [7] },
      { name: "Helado Frito con Miel", price: "5,50", a: [1,3,7,11] },
      { name: "Helado Frito Flambeado", price: "6,50", a: [1,3,7,11] },
      { name: "Bola de Helado", price: "3,50", a: [7] },
      { name: "Bola de Helado Especial", price: "4,50", a: [7] },
    ],
  },
  {
    id: "vinos", title: "Vinos", subtitle: "Nuestra selección",
    subsections: [
      {
        title: "Ribera del Duero Tinto",
        items: [
          { name: "Melior", price: "18,95" },
          { name: "Finca Resalso", price: "17,95" },
          { name: "Pago de los Capellanes", price: "25,95" },
          { name: "Figuero Tempranillo", price: "19,95" },
          { name: "Tamara", price: "16,95" },
        ],
      },
      {
        title: "Rioja Tinto",
        items: [
          { name: "Rosario Vera", price: "17,95" },
          { name: "Ramón Bilbao", price: "17,95" },
          { name: "LAN Crianza", price: "16,95" },
          { name: "Luis Cañas Crianza", price: "19,95" },
        ],
      },
      {
        title: "Otras DO Tinto",
        items: [
          { name: "Habla del Silencio", price: "21,95" },
          { name: "Juan Gil Crianza", price: "22,50" },
          { name: "Lambrusco Tinto", price: "10,50", a: [14] },
          { name: "Honoro Vera", price: "15,50" },
        ],
      },
      {
        title: "DO Alicante Tinto",
        items: [
          { name: "Tarima Hill", price: "19,95" },
          { name: "Mo Salinas Monastrell", price: "13,95" },
          { name: "Enrique Mendoza Merlot", price: "19,95" },
          { name: "Sericis Cepas Viejas", price: "19,50" },
        ],
      },
      {
        title: "Vino Blanco",
        items: [
          { name: "Sanz Rueda", price: "14,95" },
          { name: "Finca la Colina Verdejo", price: "22,95" },
          { name: "Shaya D.O. Rueda", price: "19,95" },
          { name: "Meilo", price: "15,95" },
          { name: "Perro Verde", price: "22,95" },
          { name: "Palomo Cojo", price: "19,95" },
          { name: "Tamaral", price: "15,95" },
        ],
      },
      {
        title: "Otra Denominación Blanco",
        items: [
          { name: "Juan Gil Moscatel Seco", price: "15,50" },
          { name: "Godello Brezo de Gregory Pérez", price: "19,95" },
        ],
      },
      {
        title: "Albariño",
        items: [
          { name: "Terras Gauda", price: "24,95" },
          { name: "José Pariente", price: "23,95" },
          { name: "Lolo", price: "18,95" },
          { name: "Martín Códax Albariño", price: "22,95" },
          { name: "Chan de Rosas", price: "21,95" },
        ],
      },
      {
        title: "DO Alicante Blanco",
        items: [
          { name: "Tarima Hill", price: "19,95" },
          { name: "Marina Alta Alicante", price: "11,95" },
          { name: "Marina Espumante", price: "11,95" },
        ],
      },
      {
        title: "Vino Rosado",
        items: [
          { name: "Lambrusco Rosado", price: "10,50", a: [14] },
          { name: "Homenaje", price: "11,95" },
          { name: "Muga Rosé", price: "19,95" },
          { name: "Protos", price: "15,95" },
          { name: "Tarima Alicante", price: "15,50" },
          { name: "Enrique Mendoza Monastrell", price: "19,50" },
        ],
      },
    ],
  },
  {
    id: "bebidas", title: "Bebidas", subtitle: "Para acompañar",
    subsections: [
      {
        title: "Refrescos",
        items: [
          { name: "Agua Mineral 1L", price: "3,60" },
          { name: "Agua Mineral ½L", price: "2,60" },
          { name: "Agua con Gas", price: "3,25" },
          { name: "Refresco", price: "2,90" },
          { name: "Zumo", price: "2,75" },
          { name: "Cerveza", price: "2,95" },
          { name: "Cerveza sin Alcohol", price: "3,50" },
          { name: "Cerveza Heineken", price: "3,50" },
          { name: "Cerveza Especial", price: "3,50" },
          { name: "Alhambra Especial", price: "3,50" },
          { name: "Tinto de Verano", price: "3,75" },
          { name: "Casera", price: "2,60" },
        ],
      },
      {
        title: "Café & Té",
        items: [
          { name: "Café Solo", price: "2,00" },
          { name: "Café Cortado", price: "2,25" },
          { name: "Café con Leche", price: "2,50", a: [7] },
          { name: "Café Descafeinado", price: "2,50" },
          { name: "Café Bombón", price: "2,25", a: [7] },
          { name: "Cappuccino", price: "2,95", a: [7] },
          { name: "Carajillo", price: "2,95" },
          { name: "Carajillo Quemado", price: "3,95" },
          { name: "Infusiones", price: "1,95" },
          { name: "Té Chino", price: "2,75" },
          { name: "Té Verde", price: "2,95" },
          { name: "Té Japonés Secha", price: "3,50" },
        ],
      },
    ],
  },
];

function AllergenBadges({ codes }: { codes: number[] }) {
  return (
    <span className="inline-flex gap-0.5 ml-1.5 flex-wrap">
      {codes.map((n) => (
        <span
          key={n}
          title={allergenNames[n]}
          className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-[#F0EBF7] text-[#7A52A0] text-[9px] font-semibold leading-none cursor-default"
        >
          {n}
        </span>
      ))}
    </span>
  );
}

export default function CartaAccordion() {
  const [openSections, setOpenSections] = useState<Set<string>>(new Set(["entrantes"]));

  const toggle = (id: string) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const openAndScroll = (id: string) => {
    setOpenSections((prev) => new Set([...prev, id]));
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  return (
    <>
      {/* Sticky nav — desktop only */}
      <div className="hidden md:block sticky top-20 z-40 bg-white/95 backdrop-blur-sm border-b border-[#E8D9F5]">
        <div className="max-w-5xl mx-auto px-4 overflow-x-auto">
          <div className="flex items-center gap-1 py-3">
            {menuSections.map((section) => (
              <button
                key={section.id}
                onClick={() => openAndScroll(section.id)}
                className="px-4 py-1.5 rounded-full text-xs font-medium text-[#7A6585] hover:text-[#7A52A0] hover:bg-[#F0EBF7] transition-colors whitespace-nowrap cursor-pointer"
              >
                {section.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Accordion sections */}
      <div className="max-w-5xl mx-auto px-4 py-10 space-y-3">
        {menuSections.map((section, i) => {
          const isOpen = openSections.has(section.id);
          return (
            <div
              key={section.id}
              id={section.id}
              className={`rounded-2xl overflow-hidden shadow-sm scroll-mt-32 ${
                i % 2 === 0 ? "bg-white" : "bg-[#F0EBF7]"
              }`}
            >
              <button
                onClick={() => toggle(section.id)}
                className="w-full flex items-center justify-between px-6 md:px-10 py-5 text-left group"
              >
                <div>
                  <p className="text-xs uppercase tracking-[0.15em] text-[#C8973D] font-semibold mb-0.5">
                    {section.subtitle}
                  </p>
                  <h2 className="font-display text-2xl md:text-3xl text-[#1C0F2E]">
                    {section.title}
                  </h2>
                </div>
                <ChevronDown
                  size={20}
                  className={`text-[#7A52A0] shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                />
              </button>

              {isOpen && (
                <div className="px-6 md:px-10 pb-8">
                  {section.items && (
                    <div className="grid sm:grid-cols-2 gap-x-8">
                      {section.items.map((item) => (
                        <div
                          key={item.name}
                          className="flex items-center justify-between gap-4 py-3 border-b border-[#E8D9F5] last:border-0"
                        >
                          <p className="text-sm text-[#1C0F2E] leading-snug flex items-center flex-wrap">
                            {item.name}
                            {item.a && <AllergenBadges codes={item.a} />}
                          </p>
                          <span className="font-semibold text-[#7A52A0] text-sm shrink-0">
                            {item.price} €
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {section.subsections && (
                    <div className="space-y-7">
                      {section.subsections.map((sub) => (
                        <div key={sub.title}>
                          <p className="text-xs uppercase tracking-[0.15em] text-[#7A52A0] font-semibold mb-3 pb-1 border-b border-[#E8D9F5]">
                            {sub.title}
                          </p>
                          <div className="grid sm:grid-cols-2 gap-x-8">
                            {sub.items.map((item) => (
                              <div
                                key={item.name}
                                className="flex items-center justify-between gap-4 py-3 border-b border-[#E8D9F5] last:border-0"
                              >
                                <p className="text-sm text-[#1C0F2E] leading-snug flex items-center flex-wrap">
                                  {item.name}
                                  {item.a && <AllergenBadges codes={item.a} />}
                                </p>
                                <span className="font-semibold text-[#7A52A0] text-sm shrink-0">
                                  {item.price} €
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
