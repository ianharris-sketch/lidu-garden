"use client";

import { useState } from "react";

const reviews = [
  {
    name: "Andrés y Paula",
    text: "Queríamos hacer algo distinto a cenar fuera y encontramos este taller. Nos encantó la dinámica: cocinar juntos, probar lo que hacíamos y hasta vestirnos con kimono. Fue divertido, romántico y con muy buen ambiente.",
    stars: 5,
  },
  {
    name: "Lucía H.",
    text: "Le regalé el taller a mi hermana por su cumpleaños y fue un acierto total. La organización es impecable y nos lo pasamos genial. Se fue feliz con su foto Polaroid y la experiencia.",
    stars: 5,
  },
  {
    name: "Carlos R.",
    text: "Trabajo muchas horas y buscaba un plan distinto. El ambiente fue relajado, divertido y me olvidé de todo durante dos horas. Acabé conociendo gente nueva y disfrutando muchísimo.",
    stars: 5,
  },
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((prev) => (prev === reviews.length - 1 ? 0 : prev + 1));
  const prev = () => setCurrent((prev) => (prev === 0 ? reviews.length - 1 : prev - 1));

  return (
    <div className="relative w-full max-w-3xl mx-auto px-10 md:px-14">
      <button
        onClick={prev}
        className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white shadow-lg rounded-full flex items-center justify-center text-[#6B3F8C] hover:scale-110 hover:bg-[#F0EBF7] transition z-10 border border-[#E8D9F5]"
        aria-label="Anterior"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <div className="bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-[#E8D9F5] min-h-[200px] flex flex-col justify-center text-center">
        <div className="text-[#C8973D] text-xl mb-4 tracking-widest">{"★".repeat(reviews[current].stars)}</div>
        <p className="text-[#1C0F2E] italic mb-6 leading-relaxed font-medium md:text-lg">
          &ldquo;{reviews[current].text}&rdquo;
        </p>
        <div className="font-semibold text-sm uppercase tracking-wide text-[#7A6585]">
          — {reviews[current].name}
        </div>
      </div>

      <button
        onClick={next}
        className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white shadow-lg rounded-full flex items-center justify-center text-[#6B3F8C] hover:scale-110 hover:bg-[#F0EBF7] transition z-10 border border-[#E8D9F5]"
        aria-label="Siguiente"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <div className="flex justify-center gap-2 mt-6">
        {reviews.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2.5 h-2.5 rounded-full transition-colors ${
              i === current ? "bg-[#6B3F8C]" : "bg-[#E8D9F5]"
            }`}
            aria-label={`Ir a reseña ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
