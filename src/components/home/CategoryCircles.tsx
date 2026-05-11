'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const CATEGORIES = [
  { emoji: '👔', label: 'MEN', slug: 'men', color: '#6B5CE7' },
  { emoji: '👗', label: 'WOMEN', slug: 'women', color: '#FF2D6B' },
  { emoji: '👶', label: 'KIDS', slug: 'kids', color: '#39FF14' },
  { emoji: '👟', label: 'FOOTWEAR', slug: 'footwear', color: '#FFD600' },
  { emoji: '⌚', label: 'WATCHES', slug: 'watches', color: '#0A0A0A' },
  { emoji: '👜', label: 'BAGS', slug: 'bags', color: '#C9B99A' },
  { emoji: '💍', label: 'ACCESSORIES', slug: 'accessories', color: '#6B5CE7' },
  { emoji: '🏷️', label: 'SALE', slug: 'sale', color: '#FF2D6B' },
  { emoji: '✨', label: 'NEW IN', slug: 'new', color: '#39FF14' },
];

export function CategoryCircles() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const router = useRouter();

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes spin-slow {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      .category-spin {
        animation: spin-slow 3s linear infinite;
      }
      .scrollbar-hide::-webkit-scrollbar {
        display: none;
      }
    `;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

  return (
    <section className="bg-white border-b-2 border-black py-8 px-6">
      <div className="max-w-7xl mx-auto">
        <p className="font-display font-bold text-[11px] uppercase tracking-widest text-gray-500 mb-5">
          SHOP BY CATEGORY
        </p>
        <div
          ref={ref}
          className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {CATEGORIES.map((cat, idx) => (
            <motion.div
              key={cat.slug}
              initial={{ scale: 0, opacity: 0 }}
              animate={inView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
              transition={{
                delay: idx * 0.08,
                type: 'spring',
                stiffness: 400,
                damping: 20,
              }}
              className="flex-shrink-0 snap-start"
            >
              <button
                onClick={() => router.push(`/category/${cat.slug}`)}
                className="group flex flex-col items-center cursor-pointer"
              >
                <div className="relative w-20 h-20 md:w-20 md:h-20 border-2 border-black bg-white shadow-[3px_3px_0px_#0A0A0A] flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:shadow-[5px_5px_0px_#0A0A0A] group-hover:-translate-y-1">
                  <span className="text-[32px] md:text-[32px] transition-transform duration-300 group-hover:scale-120">
                    {cat.emoji}
                  </span>
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ backgroundColor: cat.color }}
                  />
                  <div
                    className="absolute inset-[-4px] border-2 border-dashed rounded-full opacity-0 group-hover:opacity-100 category-spin"
                    style={{ borderColor: cat.color }}
                  />
                </div>
                <span className="font-display font-black text-[11px] uppercase text-black mt-2">
                  {cat.label}
                </span>
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}