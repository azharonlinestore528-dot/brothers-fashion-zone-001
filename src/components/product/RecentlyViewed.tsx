'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ProductCard } from '@/components/ui/ProductCard';
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed';
import { getProducts } from '@/lib/db';

interface RecentlyViewedProps {
  currentSlug: string;
}

export function RecentlyViewed({ currentSlug }: RecentlyViewedProps) {
  const { recentlyViewed } = useRecentlyViewed();
  const [allProducts, setAllProducts] = useState<any[]>([]);

  useEffect(() => {
    getProducts().then((data) => setAllProducts(data as any[]));
  }, []);

  const viewedProducts = recentlyViewed
    .filter((slug) => slug !== currentSlug)
    .map((slug) => allProducts.find((p) => p.slug === slug))
    .filter(Boolean)
    .slice(0, 6);

  if (viewedProducts.length === 0) return null;

  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section className="py-12 px-4 bg-[#F5F0E8] border-t-2 border-black">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="font-display font-black text-2xl text-black mb-6"
        >
          Recently Viewed
        </motion.h2>

        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
          {viewedProducts.map((product, idx) => (
            <motion.div
              key={product!.id}
              initial={{ x: 40, opacity: 0 }}
              animate={inView ? { x: 0, opacity: 1 } : {}}
              transition={{ delay: idx * 0.06 }}
              className="flex-shrink-0 w-[200px] snap-start"
            >
              <ProductCard product={product!} index={idx} />
            </motion.div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
