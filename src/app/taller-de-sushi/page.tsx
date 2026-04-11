import type { Metadata } from "next";
import Image from "next/image";
import BookingWidget from "@/components/BookingWidget";
import Testimonials from "@/components/Testimonials";
import { Check, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "Taller de Sushi · LiDu Garden · Alicante",
  description:
    "Aprende a hacer sushi con Linda en LiDu Garden. Último sábado de cada mes. Kimono, foto Polaroid y todo el sushi que prepares es tuyo. 45€ por persona. Solo 12 plazas.",
};

const includes = [
  "Ingredientes y utensilios profesionales",
  "Uso de kimono durante el taller",
  "Foto Polaroid de recuerdo",
  "3 bebidas a elegir (cerveza, vino o refresco)",
  "Agua mineral ilimitada",
  "Todo lo que prepares es tuyo",
];

const menu = [
  { name: "Maki de aguacate", detail: "6 piezas · tradicional" },
  { name: "California Roll", detail: "8 piezas · aguacate & surimi" },
  { name: "Nigiri de salmón", detail: "2 piezas · fresco del día" },
  { name: "Nigiri de gamba", detail: "2 piezas · al punto" },
  { name: "Nigiri de anguila", detail: "2 piezas · glaseado teriyaki" },
];

const faqs = [
  {
    q: "¿Necesito saber cocinar?",
    a: "¡Para nada! Este taller está diseñado para principiantes. Linda te guiará paso a paso, desde cómo tratar el arroz hasta el corte del pescado.",
  },
  {
    q: "¿Puedo ir solo/a?",
    a: "¡Claro que sí! Puedes venir solo, con amigos o en pareja. El ambiente es muy acogedor y social, ideal para conocer gente nueva.",
  },
  {
    q: "¿Qué incluye el precio?",
    a: 'El precio es "Todo Incluido": todos los ingredientes, utensilios, kimono, barra libre de agua, 3 bebidas y tu foto Polaroid.',
  },
  {
    q: "¿Puedo llevarme el sushi?",
    a: "¡Por supuesto! Todo lo que cocines es tuyo. Puedes comértelo aquí o te facilitaremos envases para llevártelo.",
  },
  {
    q: "¿Y si no se alcanza el mínimo?",
    a: "Si no se alcanzara el grupo mínimo, te avisaremos con antelación y te ofreceremos reprogramar o la devolución íntegra.",
  },
  {
    q: "¿Política de cancelación?",
    a: "Las reservas pueden modificarse o cancelarse con al menos 48 horas de antelación para un reembolso completo.",
  },
];

export default function TallerSushiPage() {
  return (
    <>
      {/* HERO */}
      <section className="relative min-h-[85vh] flex flex-col justify-center items-center text-center overflow-hidden pt-20 pb-16">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/DSCF8019.jpg"
            alt="Taller de sushi en LiDu Garden"
            fill
            className="object-cover object-center"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-[#1C0F2E]/65" />
        </div>

        <div className="relative z-10 px-4 max-w-4xl mx-auto text-white">
          <p className="text-xs md:text-sm uppercase tracking-[0.25em] text-[#C8973D] font-semibold mb-5">
            Alicante · Último sábado de cada mes
          </p>
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-semibold leading-tight mb-6 drop-shadow-xl">
            Transforma tu tarde<br />en una{" "}
            <em className="text-[#C8973D]">experiencia única</em>
          </h1>
          <p className="text-base md:text-xl font-light text-white/85 max-w-2xl mx-auto leading-relaxed mb-10">
            Aprende a hacer sushi con Linda, vístete con kimono tradicional y llévate tu recuerdo en una foto Polaroid.
          </p>
          <a
            href="#reservar"
            className="inline-flex items-center bg-[#C8973D] hover:bg-[#b5872e] text-white font-bold py-4 px-10 rounded-full text-sm uppercase tracking-widest shadow-2xl transition-all"
          >
            Reservar mi plaza
          </a>
          <div className="mt-8 inline-flex items-center gap-2 bg-black/40 backdrop-blur-md px-6 py-2.5 rounded-full border border-white/20">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <p className="text-xs font-bold uppercase tracking-wider">Solo 12 plazas por fecha</p>
          </div>
        </div>
      </section>

      {/* TESTIMONIOS */}
      <section className="py-20 md:py-24 px-4 bg-[#F0EBF7]">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="font-display text-4xl md:text-5xl mb-3 text-[#1C0F2E]">
            Así se vive la experiencia
          </h2>
          <p className="text-[#7A6585] italic mb-12 text-sm">
            Historias reales de personas que ya lo disfrutaron en LiDu Garden.
          </p>
          <Testimonials />
        </div>
      </section>

      {/* QUÉ INCLUYE */}
      <section className="py-20 md:py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-display text-4xl md:text-5xl text-[#1C0F2E] mb-3">
              ¿Qué incluye tu plaza?
            </h2>
            <p className="text-xs uppercase tracking-[0.2em] text-[#C8973D] font-semibold">
              La experiencia completa
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                emoji: "🍣",
                title: "Taller paso a paso",
                desc: "Aprende a preparar makis, california rolls y nigiris con técnica profesional y ayuda experta.",
              },
              {
                emoji: "🧑‍🍳",
                title: "Come lo que preparas",
                desc: "Disfruta de tu sushi recién hecho en el restaurante o te facilitamos envases para llevarlo a casa.",
              },
              {
                emoji: "📷",
                title: "Recuerdo Polaroid",
                desc: "Llévate una foto única del momento usando el kimono tradicional durante el taller.",
              },
            ].map((item) => (
              <div key={item.title} className="bg-[#F0EBF7] p-8 rounded-3xl text-center group hover:shadow-md transition-shadow">
                <div className="text-6xl mb-5">{item.emoji}</div>
                <h3 className="font-display text-2xl text-[#1C0F2E] mb-3">{item.title}</h3>
                <p className="text-sm text-[#7A6585] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MENÚ DEL TALLER */}
      <section className="py-20 md:py-24 px-4 bg-[#F0EBF7]">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-14 items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#6B3F8C] font-semibold mb-3">
              Lo que vas a preparar
            </p>
            <h2 className="font-display text-4xl md:text-5xl text-[#1C0F2E] mb-6 leading-tight">
              Ingredientes frescos,<br />técnica real
            </h2>
            <p className="text-[#7A6585] mb-8 leading-relaxed">
              Seleccionados por nuestros chefs para que crees auténticas delicias.
            </p>

            <ul className="space-y-4 max-w-sm">
              {menu.map((item) => (
                <li
                  key={item.name}
                  className="flex justify-between items-center border-b border-[#E8D9F5] pb-4"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-[#C8973D] shrink-0" />
                    <span className="font-medium text-[#1C0F2E]">{item.name}</span>
                  </div>
                  <span className="text-xs text-[#7A6585]">{item.detail}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-[#7A6585] italic">
              &ldquo;¡Todo lo que cocines es para ti!&rdquo;
            </p>
          </div>

          <div className="relative h-80 md:h-[440px] rounded-3xl overflow-hidden shadow-xl rotate-1 hover:rotate-0 transition-all duration-500">
            <Image
              src="/images/DSCF7945.png"
              alt="Plato de sushi preparado en el taller"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>

      {/* RESERVA */}
      <section id="reservar" className="py-20 md:py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-14 items-start">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#6B3F8C] font-semibold mb-3">
              Reserva tu plaza
            </p>
            <h2 className="font-display text-4xl md:text-5xl text-[#1C0F2E] mb-6 leading-tight">
              Información<br />y reserva
            </h2>
            <p className="text-[#7A6585] leading-relaxed mb-8">
              Una tarde diferente en Alicante: aprender a hacer sushi desde cero en un ambiente íntimo
              y divertido, guiado por <strong className="text-[#1C0F2E]">Linda</strong>.
            </p>

            <div className="bg-[#F0EBF7] p-7 rounded-2xl mb-8">
              <h3 className="font-semibold text-[#1C0F2E] mb-5">Tu plaza incluye:</h3>
              <ul className="space-y-3">
                {includes.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <Check size={16} className="text-[#6B3F8C] mt-0.5 shrink-0" />
                    <span className="text-sm text-[#7A6585]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm font-medium text-[#1C0F2E]">
              <div className="bg-[#F0EBF7] p-4 rounded-xl flex items-center gap-3">
                <span className="text-xl">📅</span>
                <span className="text-xs">Último sábado del mes</span>
              </div>
              <div className="bg-[#F0EBF7] p-4 rounded-xl flex items-center gap-3">
                <span className="text-xl">⏰</span>
                <span className="text-xs">17:30 – 19:30</span>
              </div>
              <div className="bg-[#F0EBF7] p-4 rounded-xl flex items-center gap-3">
                <span className="text-xl">💶</span>
                <span className="text-xs">45€ / persona</span>
              </div>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Lidu+garden+Mutxamel+Alicante"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#F0EBF7] p-4 rounded-xl flex items-center gap-3 hover:bg-[#E8D9F5] transition-colors"
              >
                <MapPin size={18} className="text-[#C8973D] shrink-0" />
                <div>
                  <p className="text-xs font-semibold">LiDu Garden</p>
                  <p className="text-[10px] text-[#7A6585]">Mutxamel · Abrir mapa ↗</p>
                </div>
              </a>
            </div>
          </div>

          <div className="w-full max-w-sm mx-auto lg:sticky lg:top-28">
            <BookingWidget />
            <div className="mt-8 text-center px-4">
              <p className="text-[#7A6585] italic text-base leading-relaxed font-display">
                &ldquo;Me hace mucha ilusión compartir esta parte de mi cultura con vosotros.
                Quiero que os sintáis como en casa, y que pasemos un rato especial
                aprendiendo y disfrutando.&rdquo;
              </p>
              <p className="font-semibold text-[#1C0F2E] uppercase tracking-widest text-sm mt-3">
                — Linda
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 md:py-24 px-4 bg-[#F0EBF7]">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-4xl md:text-5xl text-center text-[#1C0F2E] mb-3">
            Preguntas frecuentes
          </h2>
          <p className="text-center text-[#7A6585] mb-12 text-sm">
            Resolvemos tus dudas antes de reservar.
          </p>

          <div className="space-y-3">
            {faqs.map((f) => (
              <details
                key={f.q}
                className="group bg-white rounded-xl p-5 cursor-pointer hover:shadow-sm transition-all border border-[#E8D9F5]"
              >
                <summary className="flex justify-between items-center font-semibold text-[#1C0F2E] list-none select-none text-sm">
                  {f.q}
                  <span className="text-2xl font-light text-[#6B3F8C] group-open:rotate-45 transition-transform duration-300">
                    +
                  </span>
                </summary>
                <div className="mt-4 text-sm text-[#7A6585] leading-relaxed border-t border-[#E8D9F5] pt-4">
                  {f.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* GRUPOS */}
      <section className="py-20 md:py-24 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-[0.2em] text-[#C8973D] font-semibold mb-3">
              Talleres personalizados
            </p>
            <h2 className="font-display text-4xl md:text-5xl text-[#1C0F2E] mb-4">
              ¿Tienes algo que celebrar?
            </h2>
            <p className="text-[#7A6585] max-w-xl mx-auto text-sm leading-relaxed">
              Organizamos talleres privados a medida para grupos. Dinos tu idea y lo hacemos posible.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {[
              { emoji: "🏢", title: "Team Building", sub: "Empresas y equipos" },
              { emoji: "🎂", title: "Cumpleaños", sub: "Celebra diferente" },
              { emoji: "💍", title: "Despedidas", sub: "De soltera o soltero" },
              { emoji: "🥂", title: "Celebraciones", sub: "Cualquier ocasión" },
            ].map((item) => (
              <div key={item.title} className="bg-[#F0EBF7] p-5 rounded-2xl text-center hover:shadow-sm transition-shadow">
                <div className="text-4xl mb-3">{item.emoji}</div>
                <p className="font-semibold text-sm text-[#1C0F2E]">{item.title}</p>
                <p className="text-xs text-[#7A6585] mt-1">{item.sub}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <p className="text-sm text-[#7A6585] mb-2">
              Consulta sin compromiso · Respuesta en menos de 24h
            </p>
            <a
              href="https://wa.me/34674969177?text=Hola%2C+estoy+interesado%2Fa+en+organizar+un+taller+privado.+%C2%BFMe+pod%C3%A9is+mandar+m%C3%A1s+informaci%C3%B3n%3F"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-[#25D366] text-white font-bold py-4 px-10 rounded-full text-sm uppercase tracking-widest shadow-lg hover:brightness-110 transition-all mt-4"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Escríbenos por WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
