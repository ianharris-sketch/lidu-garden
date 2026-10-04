"use client";

import { useState } from "react";
import { Snowflake } from "lucide-react";

const PRICE = 45.0;
const SOLD_OUT_DATES = ["2026-07-25", "2026-09-26"];
const CHRISTMAS_DATES: Record<string, number> = { "2026-12-26": 50 };

function toISODate(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function isSoldOut(date: Date) {
  return SOLD_OUT_DATES.includes(toISODate(date));
}

function isChristmas(date: Date | null) {
  return date !== null && toISODate(date) in CHRISTMAS_DATES;
}

function priceFor(date: Date | null) {
  return (date && CHRISTMAS_DATES[toISODate(date)]) || PRICE;
}

function SantaHat({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        d="M4 16C4.5 9 9 4.5 15 4.5c2.6 0 4.5 1.8 4.5 4.6V16Z"
        fill="#D32F2F"
        stroke="#8E1B1B"
        strokeWidth="1"
        strokeLinejoin="round"
      />
      <rect x="2" y="14.5" width="20" height="5" rx="2.5" fill="#fff" stroke="#E3D5D5" strokeWidth="0.8" />
      <circle cx="19.5" cy="5" r="2.6" fill="#fff" stroke="#E3D5D5" strokeWidth="0.8" />
    </svg>
  );
}

const CLOSED_MONTHS = [7]; // agosto (0-indexado): cerrado por vacaciones

function getLastSaturdays(monthsAhead = 5) {
  const dates: Date[] = [];
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  for (let i = 0; i < monthsAhead; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i + 1, 0);
    const daysBack = (d.getDay() - 6 + 7) % 7;
    d.setDate(d.getDate() - daysBack);
    if (d >= now && !CLOSED_MONTHS.includes(d.getMonth())) dates.push(new Date(d));
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
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    dates.find((d) => !isSoldOut(d)) || null
  );
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
            const soldOut = isSoldOut(date);
            const christmas = isChristmas(date);
            return (
              <button
                key={date.toISOString()}
                onClick={() => !soldOut && setSelectedDate(date)}
                disabled={soldOut}
                className={`relative px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide border transition-all ${
                  soldOut
                    ? "bg-[#F0EBF7]/60 text-[#B8AFC2] border-[#E8D9F5] line-through cursor-not-allowed"
                    : christmas
                    ? `bg-[#C62828] text-white border-[#C62828] hover:bg-[#B71C1C] ${
                        isSelected ? "ring-2 ring-offset-2 ring-[#C8973D] shadow-md" : ""
                      }`
                    : isSelected
                    ? "bg-[#7A52A0] text-white border-[#7A52A0] shadow-md"
                    : "bg-white text-[#7A6585] border-[#E8D9F5] hover:border-[#7A52A0] hover:text-[#7A52A0]"
                }`}
              >
                {christmas && (
                  <SantaHat className="absolute -top-3.5 -left-2.5 w-7 h-7 -rotate-[18deg] drop-shadow-sm" />
                )}
                {soldOut ? (
                  `${formatShort(date)} · Agotado`
                ) : christmas ? (
                  <span className="inline-flex items-center gap-1">
                    {formatShort(date)}
                    <Snowflake size={11} aria-hidden="true" />
                  </span>
                ) : (
                  formatShort(date)
                )}
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
          <span
            className={`text-xs ${
              isChristmas(selectedDate) ? "text-[#C62828] font-semibold" : "text-[#7A6585]"
            }`}
          >
            {priceFor(selectedDate)}€/pers
            {isChristmas(selectedDate) && " · Especial Navidad"}
          </span>
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
          €{(priceFor(selectedDate) * quantity).toFixed(2)}
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
