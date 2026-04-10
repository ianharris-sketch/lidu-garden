"use client";

import { useState } from "react";
import DatesasModal from "./DatesasModal";

interface ReservarButtonProps {
  className?: string;
  children?: React.ReactNode;
}

export default function ReservarButton({ className, children }: ReservarButtonProps) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button onClick={() => setShowModal(true)} className={className}>
        {children ?? "Reservar mesa"}
      </button>
      <DatesasModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  );
}
