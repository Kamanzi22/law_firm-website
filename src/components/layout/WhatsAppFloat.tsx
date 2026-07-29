import { MessageCircle } from "lucide-react";
import { strings } from "../../data/strings";
import { useAppData } from "../../lib/DataProvider";

export function WhatsAppFloat() {
  const { firm } = useAppData();
  const href = `https://wa.me/${firm.whatsappNumber}?text=${encodeURIComponent(strings.whatsapp.defaultMessage)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={strings.whatsapp.label}
      className="fixed bottom-24 right-5 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 lg:bottom-6 lg:right-6"
    >
      <MessageCircle className="h-7 w-7" aria-hidden="true" fill="white" />
    </a>
  );
}
