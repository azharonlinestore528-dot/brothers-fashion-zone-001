'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export function TrustBar() {
  return (
    <section className="relative overflow-hidden bg-green-400 border-b-2 border-black py-8 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="font-display font-black text-[36px] text-black">
              VERIFIED CURATORS
            </h2>
            <p className="font-mono text-[14px] text-black mt-2">
              Curated fashion from trusted sources.
            </p>
            <Link href="/trust-policy" className="font-display font-bold text-[11px] uppercase underline mt-3 cursor-pointer text-black block">
              LEARN ABOUT OUR TRUST POLICY →
            </Link>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ x: -40, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        viewport={{ once: true }}
        className="absolute top-4 right-4 md:top-1/2 md:-translate-y-1/2"
      >
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" fill="#0A0A0A" />
          <path d="M9 12L11 14L15 10" stroke="#39FF14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </motion.div>
    </section>
  );
}
