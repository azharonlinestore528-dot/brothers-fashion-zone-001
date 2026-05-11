'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ProductCard } from '@/components/ui/ProductCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { useProducts } from '@/hooks/useProducts';

const CATEGORY_COLORS: Record<string, string> = {
  men: '#6B5CE7',
  women: '#FF2D6B',
  footwear: '#FFD600',
  watches: '#0A0A0A',
  kids: '#39FF14',
  bags: '#6B5CE7',
  accessories: '#FFD600',
  sale: '#FF2D6B',
  default: '#6B5CE7',
};

const CATEGORY_SUBCATEGORIES: Record<string, string[]> = {
  men: ['Kurtas', 'Sherwani', 'Blazers', 'Nehru Jackets', 'Pajamas', 'Dhotis'],
  women: ['Sarees', 'Lehengas', 'Blouses', 'Kurtis', 'Palazzos', 'Dupatta'],
  kids: ['Boys Kurta', 'Girls Lehenga', 'Kids Sherwani', 'Kids Blazers'],
  footwear: ['Mojaris', 'Sandals', 'Kolhapuri', 'Juttis', 'Sneakers'],
  watches: ['Analog', 'Digital', 'Smart', 'Luxury', 'Casual'],
  bags: ['Messenger', 'Clutch', 'Potli', 'Backpacks', 'Totes'],
  accessories: ['Safaa', 'Mala', 'Cufflinks', 'Pocket Square', 'Tie Pin'],
  sale: ['Upto 50% OFF', 'New Arrivals', 'Best Sellers', 'Clearance'],
};

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null);
  const [displayCount, setDisplayCount] = useState(12);

  const { products: categoryProducts, loading } = useProducts({ category: slug });

  const filteredProducts = useMemo(() => {
    if (!activeSubcategory) return categoryProducts;
    return categoryProducts.filter((p) =>
      p.subcategory?.toLowerCase() === activeSubcategory.toLowerCase()
    );
  }, [categoryProducts, activeSubcategory]);

  const displayedProducts = filteredProducts.slice(0, displayCount);
  const hasMore = displayCount < filteredProducts.length;

  const categoryColor = CATEGORY_COLORS[slug] || CATEGORY_COLORS.default;
  const subcategories = CATEGORY_SUBCATEGORIES[slug] || [];
  const categoryName = slug.charAt(0).toUpperCase() + slug.slice(1);

  const isLightColor = ['#FFD600', '#39FF14'].includes(categoryColor);

  return (
    <main className="min-h-screen pt-20">
      <section
        className="relative overflow-hidden py-12 px-6"
        style={{ backgroundColor: categoryColor }}
      >
        <motion.h1
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="font-display font-black text-5xl md:text-6xl lg:text-7xl uppercase"
          style={{ color: isLightColor ? '#0A0A0A' : '#FFFFFF' }}
        >
          {categoryName}
        </motion.h1>
        <motion.div
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1], delay: 0.1 }}
          className="mt-4"
        >
          <span
            className={`inline-block border-2 ${isLightColor ? 'border-black' : 'border-white'} bg-white px-4 py-2 font-display font-bold text-[13px] uppercase`}
            style={{ color: isLightColor ? '#0A0A0A' : '#0A0A0A' }}
          >
            {filteredProducts.length} ITEMS
          </span>
        </motion.div>

        <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 text-[200px] opacity-[0.06] font-display font-black uppercase whitespace-nowrap pointer-events-none">
          {categoryName}
        </div>
      </section>

      {subcategories.length > 0 && (
        <div className="overflow-x-auto py-6 px-4 bg-white border-b border-gray-200 scrollbar-hide">
          <div className="flex gap-2 min-w-max">
            <button
              onClick={() => setActiveSubcategory(null)}
              className={`px-4 py-2 border-2 border-black font-display font-bold text-[12px] uppercase shadow-[2px_2px_0px_#0A0A0A] transition-all ${
                !activeSubcategory ? 'bg-yellow-400' : 'bg-white hover:bg-yellow-400'
              }`}
            >
              ALL
            </button>
            {subcategories.map((sub) => (
              <button
                key={sub}
                onClick={() => setActiveSubcategory(sub)}
                className={`px-4 py-2 border-2 border-black font-display font-bold text-[12px] uppercase shadow-[2px_2px_0px_#0A0A0A] transition-all ${
                  activeSubcategory === sub ? 'bg-yellow-400' : 'bg-white hover:bg-yellow-400'
                }`}
              >
                {sub.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      )}

      <section className="bg-[#F5F0E8] py-8 px-4">
        {loading ? (
          <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-0.5">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="aspect-[4/5] bg-gray-200 animate-pulse border-2 border-black" />
            ))}
          </div>
        ) : displayedProducts.length === 0 ? (
          <EmptyState
            title="NO PRODUCTS FOUND"
            description={`No products in ${categoryName} category yet`}
            actionLabel="Browse All Products"
            onAction={() => {}}
          />
        ) : (
          <>
            <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-0.5">
              {displayedProducts.map((product, idx) => (
                <ProductCard key={product.id} product={product} index={idx} />
              ))}
            </div>
            {hasMore && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={() => setDisplayCount((p) => p + 8)}
                  className="bg-transparent border-2 border-black shadow-[4px_4px_0px_#0A0A0A] hover:bg-black hover:text-white hover:shadow-[2px_2px_0px_#0A0A0A] transition-all duration-200 h-14 px-12 font-display font-black text-[16px] uppercase text-black"
                >
                  LOAD MORE HEAT ↓
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}
