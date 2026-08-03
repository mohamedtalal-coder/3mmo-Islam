"use client";

import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { fetchApi } from "@/src/lib/api";

export function FloatingWhatsApp() {
  const [whatsappNumber, setWhatsappNumber] = useState<string | null>(null);

  useEffect(() => {
    fetchApi("/public/home")
      .then((data) => {
        if (data?.settings?.whatsapp_enabled && data?.settings?.whatsapp) {
          setWhatsappNumber(data.settings.whatsapp);
        }
      })
      .catch((err) => console.error("Failed to fetch settings for WhatsApp:", err));
  }, []);

  if (!whatsappNumber) return null;

  // Format number for WhatsApp link
  // Remove any spaces or plus signs, e.g. +2010... -> 2010...
  const formattedNumber = whatsappNumber.replace(/[^0-9]/g, "");
  const whatsappUrl = `https://wa.me/${formattedNumber}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-lg hover:bg-[#128C7E] hover:scale-110 transition-all duration-300 group"
      aria-label="تواصل معنا عبر واتساب"
    >
      <MessageCircle size={28} />
      <span className="absolute -top-10 right-0 bg-surface border border-surfaceBorder text-primary px-3 py-1.5 rounded-lg text-sm shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap font-body font-semibold">
        تواصل معنا
      </span>
      {/* Ripple effect */}
      <span className="absolute inset-0 rounded-full border-2 border-[#25D366] animate-ping opacity-75"></span>
    </a>
  );
}
