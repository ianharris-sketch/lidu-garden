"use client";

import { useState } from "react";

const PRICE = 45.0;

function getLastSaturdays(monthsAhead = 5) {
  const dates: Date[] = [];
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  for (let i = 0; i < monthsAhead; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i + 1, 0);
    const daysBack = (d.getDay() - 6 + 7) % 7;
    d.setDate(d.getDate() - daysBack);
    if (d >= now) dates.push(new Date(d));
  }

  return dates;
}

function formatShort(date: Date) {
  return date
    .toLocaleDateString("es-ES", { day: "numeric", month: "short" })
    .replace(".", "");
}

function formatFull(date: Date) {
  return date.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function BookingWidget() {
  const dates = getLastSaturdays();
  const [selectedDate, setSelectedDate] = useState<Date | null>(dates[0] || null);
  const [quantity, setQuantity] = useState(1);

  const handleWhatsApp = () => {
    const dateStr = selectedDate ? formatFull(selectedDate) : "próximo taller";
    const mensaje = `Hola! Me gustaría reservar ${quantity} plaza${quantity > 1 ? "s" : ""} para el taller de sushi del ${dateStr}. ¿Hay disponibilidad?`;
    window.open(`https://wa.me/34674969177?text=${encodeURIComponent(mensaje)}`, "_blank");
  };

  return (
    <div className="bg-white p-6 rounded-3xl shadow-xl border border-[#E8D9F5] w-full max-w-sm mx-auto">
      <h3 className="font-display text-2xl text-[#1C0F2E] mb-1 text-center font-semibold">
        Reserva tu plaza
      </h3>
      <p className="text-[#7A6585] text-xs text-center mb-6 italic">
        {selectedDate
          ? `Fecha seleccionada: ${formatFull(selectedDate)}`
          : "Selecciona una fecha"}
      </p>

      {/* Date selector */}
      <div className="mb-6">
        <span className="text-xs font-semibold text-[#1C0F2E] uppercase tracking-widest block text-center mb-3">
          ¿Qué fecha?
        </span>
        <div className="flex flex-wrap gap-2 justify-center">
          {dates.map((date) => {
            const isSelected =
              selectedDate && date.toDateString() === selectedDate.toDateString();
            return (
              <button
                key={date.toISOString()}
                onClick={() => setSelectedDate(date)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide border transition-all ${
                  isSelected
                    ? "bg-[#7A52A0] text-white border-[#7A52A0] shadow-md"
                    : "bg-white text-[#7A6585] border-[#E8D9F5] hover:border-[#7A52A0] hover:text-[#7A52A0]"
                }`}
              >
                {formatShort(date)}
              </button>
            );
          })}
        </div>
      </div>

      {/* Quantity selector */}
      <div className="text-center mb-2">
        <span className="text-xs font-semibold text-[#1C0F2E] uppercase tracking-widest">
          ¿Cuántos sois?
        </span>
      </div>

      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          className="w-12 h-12 flex items-center justify-center text-2xl font-bold text-[#1C0F2E] hover:bg-[#F0EBF7] rounded-full transition"
          aria-label="Reducir cantidad"
        >
          −
        </button>
        <div className="flex flex-col items-center">
          <span className="text-xl font-bold text-[#1C0F2E]">
            {quantity} Persona{quantity > 1 ? "s" : ""}
          </span>
          <span className="text-xs text-[#7A6585]">{PRICE}€/pers</span>
        </div>
        <button
          onClick={() => setQuantity((q) => q + 1)}
          className="w-12 h-12 flex items-center justify-center text-2xl font-bold text-[#1C0F2E] hover:bg-[#F0EBF7] rounded-full transition"
          aria-label="Aumentar cantidad"
        >
          +
        </button>
      </div>

      <div className="border-t border-[#E8D9F5] my-4" />

      <div className="flex justify-between items-center mb-6">
        <span className="text-[#7A6585] font-medium text-sm">Total</span>
        <span className="font-display text-4xl font-semibold text-[#1C0F2E]">
          €{(PRICE * quantity).toFixed(2)}
        </span>
      </div>

      <button
        onClick={handleWhatsApp}
        className="w-full bg-[#25D366] hover:brightness-110 text-white font-bold py-4 rounded-xl text-base uppercase tracking-wide shadow-lg transition-all active:scale-95 flex items-center justify-center gap-3"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
        Reservar por WhatsApp
      </button>

      <p className="text-[10px] text-center text-[#7A6585] mt-4 italic">
        Pago por Bizum al confirmar · Sin comisiones
      </p>
    </div>
  );
}
