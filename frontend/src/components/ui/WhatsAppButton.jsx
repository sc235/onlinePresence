import { MessageCircle } from 'lucide-react';

export default function WhatsAppButton() {
  const whatsappNumber = '221776303703';
  const message = encodeURIComponent(
    'Bonjour Maître Ndiaye, je souhaite prendre rendez-vous pour une consultation juridique.'
  );

  return (
    <a
      href={`https://wa.me/${whatsappNumber}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      id="whatsapp-float-btn"
      className="fixed bottom-6 right-6 z-40 group"
      aria-label="Contacter via WhatsApp"
    >
      <div className="relative">
        {/* Pulse ring */}
        <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-20"></div>
        
        {/* Button */}
        <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-xl shadow-green-500/30 group-hover:shadow-green-500/50 group-hover:scale-110 transition-all duration-300">
          <MessageCircle className="w-6 h-6 text-white" />
        </div>

        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-3 px-3 py-1.5 bg-navy-800 text-cream text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 -translate-y-1 group-hover:translate-y-0 transition-all duration-300 pointer-events-none shadow-lg">
          Écrivez-nous sur WhatsApp
          <div className="absolute top-full right-5 w-2 h-2 bg-navy-800 rotate-45 -translate-y-1"></div>
        </div>
      </div>
    </a>
  );
}
