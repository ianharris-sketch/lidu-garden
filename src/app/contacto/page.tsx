import type { Metadata } from "next";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import ReservarButton from "@/components/ReservarButton";

export const metadata: Metadata = {
  title: "Contacto · LiDu Garden",
  description:
    "Contacta con LiDu Garden. Teléfono: 965 951 170. Email: info@lidugarden.com. Restaurante de fusión asiática en Mutxamel, Alicante.",
};

const horario = [
  { dias: "Martes – Viernes", horas: "13:00 – 16:00 · 20:00 – 23:30" },
  { dias: "Sábados", horas: "13:00 – 16:30 · 20:00 – 23:30" },
  { dias: "Domingos", horas: "13:00 – 16:30" },
  { dias: "Lunes", horas: "Cerrado" },
];

export default function ContactoPage() {
  return (
    <>
      {/* Header */}
      <section className="pt-32 pb-16 px-4 text-center bg-[#FDFAF6]">
        <p className="text-xs uppercase tracking-[0.2em] text-[#6B3F8C] font-semibold mb-3">
          LiDu Garden
        </p>
        <h1 className="font-display text-5xl md:text-6xl text-[#1C0F2E] mb-4">Contacto</h1>
        <p className="text-[#7A6585] max-w-md mx-auto text-sm leading-relaxed">
          Para reservas, preguntas o simplemente saludarnos. Respondemos en menos de 24 horas.
        </p>
      </section>

      {/* Main content */}
      <section className="pb-20 px-4">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10">

          {/* Contact info */}
          <div className="space-y-6">
            {/* Teléfono */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E8D9F5]">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#F0EBF7] flex items-center justify-center shrink-0">
                  <Phone size={18} className="text-[#6B3F8C]" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.15em] text-[#7A6585] font-semibold mb-1">
                    Teléfono
                  </p>
                  <a
                    href="tel:965951170"
                    className="text-xl font-semibold text-[#1C0F2E] hover:text-[#6B3F8C] transition-colors font-display"
                  >
                    965 951 170
                  </a>
                  <p className="text-xs text-[#7A6585] mt-1">
                    Para reservas y consultas en horario de apertura
                  </p>
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E8D9F5]">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#F0EBF7] flex items-center justify-center shrink-0">
                  <Mail size={18} className="text-[#6B3F8C]" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.15em] text-[#7A6585] font-semibold mb-1">
                    Email
                  </p>
                  <a
                    href="mailto:info@lidugarden.com"
                    className="text-lg font-semibold text-[#1C0F2E] hover:text-[#6B3F8C] transition-colors"
                  >
                    info@lidugarden.com
                  </a>
                  <p className="text-xs text-[#7A6585] mt-1">
                    Respondemos en menos de 24h
                  </p>
                </div>
              </div>
            </div>

            {/* Dirección */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E8D9F5]">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#F0EBF7] flex items-center justify-center shrink-0">
                  <MapPin size={18} className="text-[#6B3F8C]" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.15em] text-[#7A6585] font-semibold mb-1">
                    Dónde estamos
                  </p>
                  <p className="font-semibold text-[#1C0F2E]">Mutxamel, Alicante</p>
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=Lidu+garden+Mutxamel+Alicante"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-[#6B3F8C] hover:underline mt-1 inline-block"
                  >
                    Abrir en Google Maps ↗
                  </a>
                </div>
              </div>
            </div>

            {/* Horario */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E8D9F5]">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#F0EBF7] flex items-center justify-center shrink-0">
                  <Clock size={18} className="text-[#6B3F8C]" />
                </div>
                <div className="flex-1">
                  <p className="text-xs uppercase tracking-[0.15em] text-[#7A6585] font-semibold mb-3">
                    Horario
                  </p>
                  <ul className="space-y-2">
                    {horario.map((h) => (
                      <li key={h.dias} className="flex justify-between items-baseline text-sm gap-3">
                        <span className={`font-medium ${h.horas === "Cerrado" ? "text-[#7A6585]" : "text-[#1C0F2E]"}`}>
                          {h.dias}
                        </span>
                        <span className={`text-xs shrink-0 ${h.horas === "Cerrado" ? "text-[#C8973D]" : "text-[#7A6585]"}`}>
                          {h.horas}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Redes sociales */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E8D9F5]">
              <p className="text-xs uppercase tracking-[0.15em] text-[#7A6585] font-semibold mb-4">
                Síguenos
              </p>
              <div className="flex items-center gap-4">
                <a
                  href="https://www.instagram.com/lidugarden"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-[#1C0F2E] hover:text-[#6B3F8C] transition-colors group"
                >
                  <div className="w-9 h-9 rounded-full bg-[#F0EBF7] group-hover:bg-[#E8D9F5] flex items-center justify-center transition-colors">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                  </div>
                  <span className="text-sm font-medium">@lidugarden</span>
                </a>
                <a
                  href="https://www.facebook.com/people/LiDu-Garden/61573793048546/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-[#1C0F2E] hover:text-[#6B3F8C] transition-colors group"
                >
                  <div className="w-9 h-9 rounded-full bg-[#F0EBF7] group-hover:bg-[#E8D9F5] flex items-center justify-center transition-colors">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  </div>
                  <span className="text-sm font-medium">Facebook</span>
                </a>
              </div>
            </div>
          </div>

          {/* Contact form + reserva */}
          <div className="space-y-6">
            {/* Reserva */}
            <div className="bg-[#2A1444] rounded-2xl p-7 text-white">
              <h2 className="font-display text-3xl mb-2">Reserva tu mesa</h2>
              <p className="text-white/60 text-sm mb-6 leading-relaxed">
                Sistema de reservas online disponible las 24 horas. Confirma tu mesa en segundos.
              </p>
              <ReservarButton className="w-full bg-[#C8973D] hover:bg-[#b5872e] text-white font-semibold py-3.5 rounded-full text-sm transition-colors">
                Reservar mesa ahora
              </ReservarButton>
            </div>

            {/* Formulario de contacto */}
            <div className="bg-white rounded-2xl p-7 shadow-sm border border-[#E8D9F5]">
              <h2 className="font-display text-2xl text-[#1C0F2E] mb-2">Escríbenos</h2>
              <p className="text-sm text-[#7A6585] mb-6">
                Para grupos, eventos privados, talleres o cualquier otra consulta.
              </p>

              {/* TODO: Replace with Formspree form if form ID is provided */}
              <form
                action="mailto:info@lidugarden.com"
                method="GET"
                className="space-y-4"
              >
                <div>
                  <label htmlFor="nombre" className="block text-xs font-semibold text-[#1C0F2E] uppercase tracking-[0.1em] mb-1.5">
                    Nombre
                  </label>
                  <input
                    id="nombre"
                    type="text"
                    name="nombre"
                    required
                    className="w-full border border-[#E8D9F5] rounded-xl px-4 py-3 text-sm text-[#1C0F2E] placeholder-[#7A6585] focus:outline-none focus:ring-2 focus:ring-[#6B3F8C]/30 focus:border-[#6B3F8C] transition-colors bg-[#FDFAF6]"
                    placeholder="Tu nombre"
                  />
                </div>
                <div>
                  <label htmlFor="correo" className="block text-xs font-semibold text-[#1C0F2E] uppercase tracking-[0.1em] mb-1.5">
                    Correo electrónico
                  </label>
                  <input
                    id="correo"
                    type="email"
                    name="correo"
                    required
                    className="w-full border border-[#E8D9F5] rounded-xl px-4 py-3 text-sm text-[#1C0F2E] placeholder-[#7A6585] focus:outline-none focus:ring-2 focus:ring-[#6B3F8C]/30 focus:border-[#6B3F8C] transition-colors bg-[#FDFAF6]"
                    placeholder="tu@correo.com"
                  />
                </div>
                <div>
                  <label htmlFor="mensaje" className="block text-xs font-semibold text-[#1C0F2E] uppercase tracking-[0.1em] mb-1.5">
                    Mensaje
                  </label>
                  <textarea
                    id="mensaje"
                    name="body"
                    required
                    rows={4}
                    className="w-full border border-[#E8D9F5] rounded-xl px-4 py-3 text-sm text-[#1C0F2E] placeholder-[#7A6585] focus:outline-none focus:ring-2 focus:ring-[#6B3F8C]/30 focus:border-[#6B3F8C] transition-colors bg-[#FDFAF6] resize-none"
                    placeholder="¿En qué podemos ayudarte?"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#6B3F8C] hover:bg-[#5a3378] text-white font-semibold py-3.5 rounded-full text-sm transition-colors"
                >
                  Enviar mensaje
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Google Maps embed */}
      <section className="h-72 md:h-96 w-full">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3170.0!2d-0.4341!3d38.4082!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzjCsDI0JzI5LjUiTiAwwrAyNicwMi44Ilc!5e0!3m2!1ses!2ses!4v1234567890"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Ubicación de LiDu Garden en Mutxamel, Alicante"
        />
      </section>
    </>
  );
}
