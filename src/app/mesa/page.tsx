import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";

export const metadata: Metadata = {
  title: "LiDu Garden · Carta y Menú",
  description: "Consulta la carta o el menú de LiDu Garden.",
  robots: { index: false, follow: false },
};

const REVIEW_URL = "https://g.page/r/CXsCjajUv4k0EBE/review";

export default function MesaPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-16 text-center bg-[#FDFAF6]">
      <Image
        src="/images/logo.png"
        alt="LiDu Garden"
        width={160}
        height={64}
        className="h-16 w-auto mb-8"
        priority
      />

      <p className="text-xs uppercase tracking-[0.2em] text-[#7A52A0] font-semibold mb-2">
        Mutxamel · Alicante
      </p>
      <h1 className="font-display text-4xl sm:text-5xl text-[#1C0F2E] mb-10">
        ¿Qué quieres ver?
      </h1>

      <div className="w-full max-w-sm flex flex-col gap-4">
        <Link
          href="/carta"
          className="w-full bg-[#7A52A0] hover:bg-[#5a3378] text-white font-semibold py-5 rounded-2xl text-lg shadow-lg transition-colors"
        >
          Ver la Carta
        </Link>

        <Link
          href="/menus"
          className="w-full bg-white border-2 border-[#7A52A0] text-[#7A52A0] hover:bg-[#F0EBF7] font-semibold py-5 rounded-2xl text-lg transition-colors"
        >
          Ver el Menú
        </Link>

        <a
          href={REVIEW_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-[#C8973D] hover:bg-[#b5872e] text-white font-semibold py-5 rounded-2xl text-lg shadow-lg transition-colors flex items-center justify-center gap-2"
        >
          <Star size={18} className="fill-current" />
          Déjanos tu reseña
        </a>
      </div>
    </div>
  );
}
