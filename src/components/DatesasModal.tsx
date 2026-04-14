"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

interface DatesasModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DatesasModal({ isOpen, onClose }: DatesasModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center p-4"
      style={{ background: "rgba(28, 15, 46, 0.75)", backdropFilter: "blur(4px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label="Reservar mesa en LiDu Garden"
    >
      <div className="bg-white rounded-2xl overflow-hidden w-full max-w-sm md:max-w-[92vw] shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E8D9F5]">
          <div>
            <p className="font-semibold text-[#1C0F2E] text-sm">Reservar mesa</p>
            <p className="text-xs text-[#7A6585]">LiDu Garden · Mutxamel</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#7A6585] hover:bg-[#F0EBF7] hover:text-[#1C0F2E] transition-colors"
            aria-label="Cerrar"
          >
            <X size={18} />
          </button>
        </div>

        {/* Datesas iframe */}
        <div className="h-[520px] md:h-[680px] max-h-[80vh]">
          <iframe
            src="https://datesas.com/r/lidu-garden/embed?2"
            className="w-full h-full border-0"
            title="Sistema de reservas LiDu Garden"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
}
