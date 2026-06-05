'use client';

import { motion } from 'motion/react';
import { Phone, MessageCircle } from 'lucide-react';
import cleanData from '@/lib/data/clean_data.json';

export default function FloatingButtons() {
  const contactInfo = cleanData.settings;
  const whatsappNumber = contactInfo.whatsapp || '966506819387';
  const phoneNumber = contactInfo.phone || '0506819387';

  // Construct URL
  const waUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent('السلام عليكم مؤسسة تلال للمقاولات العامة، أرغب في الاستفسار عن خدمات التشييد والمقاولات.')}`;
  const phoneUrl = `tel:${phoneNumber}`;

  return (
    <div id="floating_actions" className="fixed bottom-6 left-6 z-40 flex flex-col gap-3.5 select-none pointer-events-none">
      
      {/* Call Floating Button */}
      <motion.a
        id="float_call_btn"
        href={phoneUrl}
        initial={{ opacity: 0, y: 30, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 1, type: 'spring', stiffness: 260, damping: 20 }}
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.9 }}
        className="pointer-events-auto flex items-center justify-center w-14 h-14 bg-amber-500 hover:bg-amber-400 text-neutral-950 rounded-full shadow-[0_8px_30px_rgb(245,158,11,0.3)] hover:shadow-[0_12px_35px_rgb(245,158,11,0.5)] transition-all duration-300 relative group cursor-pointer"
        aria-label="اتصل بنا الآن"
      >
        <Phone className="w-6 h-6 animate-pulse shrink-0" />
        
        {/* Tooltip */}
        <span className="absolute left-16 bg-neutral-900 border border-neutral-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl">
          اتصل بنا هاتفياً
        </span>
      </motion.a>

      {/* WhatsApp Floating Button */}
      <motion.a
        id="float_wa_btn"
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, y: 30, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 1.2, type: 'spring', stiffness: 260, damping: 20 }}
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.9 }}
        className="pointer-events-auto flex items-center justify-center w-14 h-14 bg-emerald-500 hover:bg-emerald-400 text-white rounded-full shadow-[0_8px_30px_rgb(16,185,129,0.3)] hover:shadow-[0_12px_35px_rgb(16,185,129,0.5)] transition-all duration-300 relative group cursor-pointer"
        aria-label="تواصل معنا عبر واتساب"
      >
        {/* Real WhatsApp SVG Design Icon */}
        <svg className="w-7 h-7 fill-current shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.248 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.5-5.739-1.446L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.864-9.852.002-2.63-1.023-5.101-2.887-6.967C16.592 1.921 14.12 .897 11.49 1.896c-5.438 0-9.863 4.422-9.867 9.854-.001 1.716.452 3.39 1.31 4.869l-.952 3.478 3.566-.936zM17.51 14.8c-.29-.145-1.72-.85-1.985-.945-.266-.096-.46-.145-.652.145-.19.29-.74.945-.907 1.135-.166.19-.333.213-.622.068-.29-.145-1.22-.45-2.325-1.434-.86-.77-1.44-1.72-1.61-2.01-.166-.29-.017-.445.128-.59.13-.13.29-.34.435-.51.145-.17.19-.29.29-.48.096-.19.047-.355-.024-.5-.071-.145-.652-1.573-.893-2.152-.236-.567-.478-.49-.652-.49-.17 0-.363-.015-.557-.015-.19 0-.503.072-.767.355-.264.29-1.011.99-1.011 2.417s1.036 2.798 1.18 2.99c.145.19 2.038 3.11 4.935 4.363.688.298 1.227.476 1.648.609.692.22 1.32.19 1.82.115.553-.083 1.72-.7 1.96-1.378.24-.677.24-1.257.17-1.378-.07-.12-.26-.194-.55-.339z" />
        </svg>

        {/* Tooltip */}
        <span className="absolute left-16 bg-neutral-900 border border-neutral-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl">
          تواصل معنا عبر واتساب
        </span>
      </motion.a>

    </div>
  );
}
