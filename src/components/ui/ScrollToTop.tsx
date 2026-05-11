'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

interface ScrollToTopProps {}

export function ScrollToTop({}: ScrollToTopProps) {
  const [visible, setVisible] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <motion.div
      ref={scrollRef}
      initial={{ scale: 0 }}
      animate={{ scale: visible ? 1 : 0 }}
      transition={{ type: 'spring', stiffness: 500, damping: 25 }}
      className="fixed bottom-6 right-6 z-50"
    >
      <button
        onClick={scrollToTop}
        className="w-10 h-10 bg-[#FFD600] border-2 border-black shadow-[3px_3px_0px_#0A0A0A] hover:bg-[#0A0A0A] hover:text-white hover:shadow-[4px_4px_0px_#FFD600] transition-all flex items-center justify-center"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
          <path d="M18 15l-6-6-6 6" />
        </svg>
      </button>
    </motion.div>
  );
}