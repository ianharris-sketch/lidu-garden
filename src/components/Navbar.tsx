"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, Phone } from "lucide-react";
import DatesasModal from "./DatesasModal";

const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/carta", label: "Carta" },
  { href: "/menus", label: "Menús" },
  { href: "/taller-de-sushi", label: "Taller de Sushi" },
  { href: "/contacto", label: "Contacto" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-[#FDFAF6]/95 backdrop-blur-sm shadow-sm border-b border-[#E8D9F5]"
            : "bg-transparent"
        }`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Navegación principal">
          <div className="flex items-center justify-between h-16 md:h-20">

            {/* Logo — white when transparent, dark when scrolled */}
            <Link href="/" className="flex-shrink-0 hover:opacity-75 transition-opacity">
              <Image
                src="/images/logo.png"
                alt="LiDu Garden"
                width={120}
                height={48}
                className={`h-10 md:h-12 w-auto transition-all duration-300 ${isScrolled ? "" : "brightness-0 invert"}`}
                priority
              />
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-6 lg:gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium tracking-wide transition-colors duration-200 ${
                    pathname === link.href
                      ? isScrolled ? "text-[#6B3F8C]" : "text-[#C8973D]"
                      : isScrolled ? "text-[#1C0F2E] hover:text-[#6B3F8C]" : "text-white/85 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* CTA + mobile toggle */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowModal(true)}
                className={`hidden sm:inline-flex items-center gap-2 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-colors duration-200 shadow-sm ${
                  isScrolled ? "bg-[#6B3F8C] hover:bg-[#5a3378]" : "bg-[#C8973D] hover:bg-[#b5872e]"
                }`}
              >
                Reservar mesa
              </button>

              <button
                onClick={() => setIsOpen(!isOpen)}
                className={`md:hidden p-2 transition-colors ${
                  isScrolled ? "text-[#1C0F2E] hover:text-[#6B3F8C]" : "text-white/85 hover:text-white"
                }`}
                aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
                aria-expanded={isOpen}
              >
                {isOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>

        </nav>
      </header>

      {/* Mobile overlay menu */}
      {isOpen && (
        <div className="nav-overlay fixed inset-0 z-[60] bg-[#1C0F2E] flex flex-col md:hidden">

          {/* Top bar */}
          <div className="flex items-center justify-between px-6 h-16">
            <Image
              src="/images/logo.png"
              alt="LiDu Garden"
              width={100} height={40}
              className="h-9 w-auto brightness-0 invert opacity-90"
            />
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 text-white/60 hover:text-white transition-colors"
              aria-label="Cerrar menú"
            >
              <X size={22} />
            </button>
          </div>

          {/* Gold divider */}
          <div className="mx-6 h-px bg-[#C8973D]/30" />

          {/* Nav links — staggered animation */}
          <nav className="flex-1 flex flex-col justify-center px-8">
            {navLinks.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`nav-link-animate font-display text-[2.6rem] leading-none py-4 border-b border-white/8 transition-colors ${
                  pathname === link.href
                    ? "text-[#C8973D]"
                    : "text-white/85 hover:text-white"
                }`}
                style={{ animationDelay: `${0.05 + i * 0.06}s` }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Bottom actions */}
          <div className="nav-bottom-animate px-8 pb-10 flex flex-col gap-3" style={{ animationDelay: "0.38s" }}>
            <button
              onClick={() => { setShowModal(true); setIsOpen(false); }}
              className="w-full bg-[#C8973D] hover:bg-[#b5872e] text-white text-sm font-semibold py-3.5 rounded-full transition-colors"
            >
              Reservar mesa
            </button>
            <a
              href="tel:965951170"
              className="w-full flex items-center justify-center gap-2 text-white/40 hover:text-white/70 text-sm py-2 transition-colors"
            >
              <Phone size={14} />
              965 951 170
            </a>
          </div>

        </div>
      )}

      <DatesasModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  );
}
