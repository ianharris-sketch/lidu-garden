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
            ? "bg-white/95 backdrop-blur-sm shadow-sm border-b border-[#E8D9F5]"
            : "bg-white/90 backdrop-blur-sm"
        }`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Navegación principal">
          <div className="flex items-center justify-between h-16 md:h-20">

            {/* Logo */}
            <Link href="/" className="flex-shrink-0 hover:opacity-80 transition-opacity">
              <Image
                src="/images/logo.png"
                alt="LiDu Garden"
                width={120}
                height={48}
                className="h-10 md:h-12 w-auto"
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
                      ? "text-[#6B3F8C]"
                      : "text-[#1C0F2E] hover:text-[#6B3F8C]"
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
                className="hidden sm:inline-flex items-center gap-2 bg-[#6B3F8C] text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-[#5a3378] transition-colors duration-200 shadow-sm"
              >
                Reservar mesa
              </button>

              <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden p-2 rounded-lg text-[#1C0F2E] hover:bg-[#F0EBF7] transition-colors"
                aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
                aria-expanded={isOpen}
              >
                {isOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {isOpen && (
            <div className="md:hidden border-t border-[#E8D9F5] py-4 space-y-1 bg-white">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    pathname === link.href
                      ? "text-[#6B3F8C] bg-[#F0EBF7]"
                      : "text-[#1C0F2E] hover:bg-[#F0EBF7] hover:text-[#6B3F8C]"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-3 px-4 flex flex-col gap-3">
                <button
                  onClick={() => { setShowModal(true); setIsOpen(false); }}
                  className="w-full bg-[#6B3F8C] text-white text-sm font-semibold py-3 rounded-full hover:bg-[#5a3378] transition-colors"
                >
                  Reservar mesa
                </button>
                <a
                  href="tel:965951170"
                  className="w-full flex items-center justify-center gap-2 border border-[#E8D9F5] text-[#1C0F2E] text-sm font-medium py-3 rounded-full hover:bg-[#F0EBF7] transition-colors"
                >
                  <Phone size={16} />
                  965 951 170
                </a>
              </div>
            </div>
          )}
        </nav>
      </header>

      <DatesasModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  );
}
