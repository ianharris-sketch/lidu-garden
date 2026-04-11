import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ReservarButton from "@/components/ReservarButton";

export const metadata: Metadata = {
  title: "LiDu Garden · Fusión Asiática en Mutxamel, Alicante",
  description:
    "Donde Asia se sienta a tu mesa. Restaurante de cocina fusión asiática — china, japonesa, tailandesa y vietnamita — en Mutxamel, Alicante. Ambiente familiar, 25 años de experiencia.",
};

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/DSCF7746.jpg"
            alt="Interior del restaurante LiDu Garden"
            fill
            className="object-cover object-center"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1C0F2E]/70 via-[#1C0F2E]/50 to-[#1C0F2E]/80" />
        </div>

        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <p className="text-xs md:text-sm uppercase tracking-[0.25em] font-medium text-[#C8973D] mb-6">
            Mutxamel · Alicante
          </p>
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-semibold leading-tight mb-6 drop-shadow-lg">
            Donde Asia<br />
            <em className="text-[#C8973D]">se sienta a tu mesa</em>
          </h1>
          <p className="text-base md:text-xl font-light text-white/85 max-w-2xl mx-auto leading-relaxed mb-10">
            Cocina china, japonesa, tailandesa y vietnamita. Un lugar familiar, sin pretensiones,
            donde llevas más de 25 años comiendo bien de verdad.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <ReservarButton className="bg-[#C8973D] hover:bg-[#b5872e] text-white font-semibold px-8 py-4 rounded-full text-sm tracking-wide shadow-lg transition-colors">
              Reservar mesa
            </ReservarButton>
            <Link
              href="/carta"
              className="border border-white/40 text-white font-medium px-8 py-4 rounded-full text-sm tracking-wide hover:bg-white/10 transition-colors"
            >
              Ver la carta
            </Link>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
          <div className="w-px h-10 bg-white/30 mx-auto" />
        </div>
      </section>

      {/* SOBRE NOSOTROS */}
      <section className="py-20 md:py-28 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          <div className="relative">
            <div className="relative h-[420px] md:h-[520px] rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="/images/DSCF7787.jpg"
                alt="Ambiente íntimo del restaurante LiDu Garden"
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="absolute -bottom-4 -right-4 w-32 h-32 border-2 border-[#C8973D] rounded-2xl -z-10 hidden md:block" />
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#6B3F8C] font-semibold mb-4">
              Nuestra historia
            </p>
            <h2 className="font-display text-4xl md:text-5xl text-[#1C0F2E] mb-6 leading-tight">
              Veinticinco años<br />cocinando desde casa
            </h2>
            <p className="text-[#7A6585] leading-relaxed mb-4">
              LiDu Garden nació de algo sencillo: la voluntad de compartir una cocina que viene de familia.
              Cuatro países, cuatro tradiciones, una sala en Mutxamel donde nadie se sienta con prisa.
            </p>
            <p className="text-[#7A6585] leading-relaxed mb-8">
              Familias que llevan años viniendo, grupos que celebran aquí lo que merece celebrarse,
              y gente nueva que llega por primera vez y se queda con ganas de volver. Eso es lo que somos.
            </p>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <span className="font-display text-4xl font-semibold text-[#6B3F8C]">+25</span>
                <p className="text-xs text-[#7A6585] mt-1 uppercase tracking-wide">Años</p>
              </div>
              <div className="w-px h-10 bg-[#E8D9F5]" />
              <div className="text-center">
                <span className="font-display text-4xl font-semibold text-[#6B3F8C]">4</span>
                <p className="text-xs text-[#7A6585] mt-1 uppercase tracking-wide">Tradiciones</p>
              </div>
              <div className="w-px h-10 bg-[#E8D9F5]" />
              <div className="text-center">
                <span className="font-display text-4xl font-semibold text-[#6B3F8C]">1</span>
                <p className="text-xs text-[#7A6585] mt-1 uppercase tracking-wide">Lugar</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LO QUE HACEMOS */}
      <section className="py-20 md:py-28 px-4 bg-[#F0EBF7]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs uppercase tracking-[0.2em] text-[#6B3F8C] font-semibold mb-3">
              La experiencia
            </p>
            <h2 className="font-display text-4xl md:text-5xl text-[#1C0F2E]">
              Cuatro razones para venir
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1 — Ambiente familiar */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
              <div className="relative h-48 overflow-hidden">
                <Image
                  src="/images/DSCF7754.jpg"
                  alt="Mesa familiar en LiDu Garden"
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              </div>
              <div className="p-5">
                <h3 className="font-display text-xl text-[#1C0F2E] mb-2">Ambiente familiar</h3>
                <p className="text-sm text-[#7A6585] leading-relaxed">
                  Una sala donde los niños son bienvenidos y los adultos pueden tomarse su tiempo. Sin prisa, sin ruido innecesario.
                </p>
              </div>
            </div>

            {/* Card 2 — Cocina auténtica */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
              <div className="relative h-48 overflow-hidden">
                <Image
                  src="/images/cocina-autentica.jpg"
                  alt="Fideos wok con gambas en LiDu Garden"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  style={{ objectPosition: "50% 65%" }}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              </div>
              <div className="p-5">
                <h3 className="font-display text-xl text-[#1C0F2E] mb-2">Cocina auténtica</h3>
                <p className="text-sm text-[#7A6585] leading-relaxed">
                  Recetas chinas, japonesas, tailandesas y vietnamitas. Cada plato tiene una historia detrás de la carta.
                </p>
              </div>
            </div>

            {/* Card 3 — Sushi hecho aquí */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
              <div className="relative h-48 overflow-hidden">
                <Image
                  src="/images/sushi-hecho.png"
                  alt="Nigiri de salmón en LiDu Garden"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  style={{ objectPosition: "50% 52%" }}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              </div>
              <div className="p-5">
                <h3 className="font-display text-xl text-[#1C0F2E] mb-2">Sushi hecho aquí</h3>
                <p className="text-sm text-[#7A6585] leading-relaxed">
                  Piezas preparadas en el momento. También puedes aprender a hacerlo tú mismo en nuestro taller mensual.
                </p>
              </div>
            </div>

            {/* Card 4 — Taller de sushi */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
              <div className="relative h-48 overflow-hidden">
                <Image
                  src="/images/grupo-taller.png"
                  alt="Grupo disfrutando el taller de sushi en LiDu Garden"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  style={{ objectPosition: "50% 42%" }}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              </div>
              <div className="p-5">
                <h3 className="font-display text-xl text-[#1C0F2E] mb-2">Taller de sushi</h3>
                <p className="text-sm text-[#7A6585] leading-relaxed">
                  El último sábado de cada mes, kimono incluido. Una tarde diferente para parejas, familias o grupos.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* GALERÍA PLATOS */}
      <section className="py-20 md:py-28 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#6B3F8C] font-semibold mb-4">
                La cocina
              </p>
              <h2 className="font-display text-4xl md:text-5xl text-[#1C0F2E] mb-6 leading-tight">
                Platos que no<br />se improvisan
              </h2>
              <p className="text-[#7A6585] leading-relaxed mb-4">
                Cada receta lleva tiempo, técnica y producto. Los entrantes fritos que crujen,
                los nigiris de salmón del día, las brochetas glaseadas con teriyaki. Nada de atajos.
              </p>
              <p className="text-[#7A6585] leading-relaxed mb-8">
                La carta cambia cuando cambia la temporada. Aquí manda el producto, no el calendario.
              </p>
              <Link
                href="/carta"
                className="inline-flex items-center gap-2 bg-[#6B3F8C] text-white font-semibold px-7 py-3.5 rounded-full text-sm hover:bg-[#5a3378] transition-colors shadow-sm"
              >
                Ver carta completa
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="relative h-48 rounded-xl overflow-hidden">
                <Image
                  src="/images/DSCF7869.jpg"
                  alt="Gyozas de LiDu Garden"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>
              <div className="relative h-48 rounded-xl overflow-hidden mt-6">
                <Image
                  src="/images/DSCF7898.jpg"
                  alt="Brochetas yakitori"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>
              {/* DSCF8015 — bajado para ver el plato principal */}
              <div className="relative h-48 rounded-xl overflow-hidden">
                <Image
                  src="/images/DSCF8015.jpg"
                  alt="Entrantes crujientes"
                  fill
                  className="object-cover object-[50%_65%]"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>
              <div className="relative h-48 rounded-xl overflow-hidden mt-6">
                <Image
                  src="/images/DSCF7847.jpg"
                  alt="Mesa junto a la ventana"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TALLER CTA */}
      <section className="py-20 md:py-28 px-4 bg-[#2A1444]">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div className="relative h-80 md:h-[460px] rounded-2xl overflow-hidden shadow-xl">
            <Image
              src="/images/aprende-linda.png"
              alt="Linda enseñando a hacer sushi en LiDu Garden"
              fill
              className="object-cover"
              style={{ objectPosition: "50% 22%" }}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div className="text-white">
            <p className="text-xs uppercase tracking-[0.2em] text-[#C8973D] font-semibold mb-4">
              Cada último sábado del mes
            </p>
            <h2 className="font-display text-4xl md:text-5xl mb-5 leading-tight">
              Aprende a hacer sushi con Linda
            </h2>
            <p className="text-white/75 leading-relaxed mb-4">
              Dos horas, kimono tradicional, ingredientes frescos y la foto Polaroid de recuerdo.
              Solo 12 plazas. Para parejas, familias o grupos.
            </p>
            <p className="text-[#C8973D] font-semibold mb-8">45€ por persona · Todo incluido</p>
            <Link
              href="/taller-de-sushi"
              className="inline-flex items-center gap-2 bg-[#C8973D] hover:bg-[#b5872e] text-white font-semibold px-7 py-3.5 rounded-full text-sm transition-colors shadow-sm"
            >
              Ver el taller →
            </Link>
          </div>
        </div>
      </section>

      {/* RESERVA FINAL CTA */}
      <section className="py-20 md:py-24 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-display text-4xl md:text-5xl text-[#1C0F2E] mb-5 leading-tight">
            ¿Tienes hambre?
          </h2>
          <p className="text-[#7A6585] leading-relaxed mb-8">
            Reserva tu mesa online en segundos. Si prefieres llamar, estamos en el{" "}
            <a href="tel:965951170" className="text-[#6B3F8C] font-medium hover:underline">
              965 951 170
            </a>.
          </p>
          <ReservarButton className="bg-[#6B3F8C] hover:bg-[#5a3378] text-white font-semibold px-10 py-4 rounded-full text-sm tracking-wide shadow-md transition-colors">
            Reservar mesa
          </ReservarButton>
        </div>
      </section>
    </>
  );
}
