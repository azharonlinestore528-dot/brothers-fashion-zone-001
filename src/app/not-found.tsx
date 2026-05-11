'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F5F0E8] flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="mb-8">
          <svg width="120" height="120" viewBox="0 0 120 120" className="mx-auto">
            <circle cx="60" cy="60" r="50" fill="none" stroke="#C9B99A" strokeWidth="2" />
            <path d="M40 60 Q50 40, 60 50 Q70 60, 80 50" fill="none" stroke="#C9B99A" strokeWidth="2" />
            <circle cx="45" cy="45" r="5" fill="#C9B99A" />
            <circle cx="75" cy="45" r="5" fill="#C9B99A" />
            <path d="M30 85 L90 85" stroke="#C9B99A" strokeWidth="2" strokeDasharray="4 4" />
          </svg>
        </div>
        <h1 className="font-display font-black text-[100px] text-black tracking-[-5px] leading-none mb-4">404</h1>
        <p className="font-display font-black text-[24px] text-black mb-2">PAGE NOT FOUND</p>
        <p className="font-inter text-[16px] text-gray-600 mt-4">Looks like this page stepped out.</p>
        <Link
          href="/"
          className="inline-block mt-12 bg-[#FFD600] border-2 border-black shadow-[4px_4px_0px_#0A0A0A] hover:shadow-[2px_2px_0px_#0A0A0A] hover:-translate-y-0.5 transition-all font-display font-bold text-[14px] uppercase px-8 py-4"
        >
          ← BACK TO HOME
        </Link>
      </motion.div>
    </div>
  );
}