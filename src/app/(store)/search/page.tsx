'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { ProductCard } from '@/components/ui/ProductCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { useDebounce } from '@/hooks/useDebounce';
import { useProducts } from '@/hooks/useProducts';

const POPULAR_SEARCHES = ['kurta', 'sneakers', 'watches', 'saree', 'handbag'];

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [inputValue, setInputValue] = useState(initialQuery);
  const debouncedQuery = useDebounce(query, 300);
  const [displayCount, setDisplayCount] = useState(12);

  useEffect(() => {
    setQuery(searchParams.get('q') || '');
    setInputValue(searchParams.get('q') || '');
  }, [searchParams]);

  const { products, loading } = useProducts({
    filters: {
      search: debouncedQuery,
      sortBy: 'newest',
    },
  });

  const displayedProducts = products.slice(0, displayCount);
  const hasMore = displayCount < products.length;

  const handleSearch = (value: string) => {
    setInputValue(value);
    const newUrl = value ? `/search?q=${encodeURIComponent(value)}` : '/search';
    window.history.pushState({}, '', newUrl);
    setQuery(value);
  };

  const handleClear = () => {
    setInputValue('');
    setQuery('');
    window.history.pushState({}, '', '/search');
  };

  return (
    <>
      <div className="py-8">
        <div className="relative max-w-2xl mx-auto">
          <div className="relative flex items-center">
            <Search size={24} className="absolute left-4 text-gray-400" />
            <input
              type="text"
              value={inputValue}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search for kurta, sneakers, watches..."
              className="w-full h-16 pl-14 pr-12 border-2 border-black bg-white font-display font-bold text-[18px] focus:outline-none focus:border-purple-500 focus:shadow-[4px_4px_0px_#6B5CE7] transition-all"
              autoFocus
            />
            {inputValue && (
              <button
                onClick={handleClear}
                className="absolute right-4 w-8 h-8 flex items-center justify-center border border-black hover:bg-gray-100"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

      {debouncedQuery ? (
        <>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <h1 className="font-display font-black text-2xl md:text-3xl text-black">
              RESULTS FOR &quot;{debouncedQuery.toUpperCase()}&quot;
            </h1>
            <p className="font-mono text-[13px] text-gray-500 mt-2">
              {products.length} products found
            </p>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-0.5">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="aspect-[4/5] bg-gray-200 animate-pulse border-2 border-black" />
              ))}
            </div>
          ) : displayedProducts.length === 0 ? (
            <EmptyState
              title="NO RESULTS FOUND"
              description={`No products matching &quot;${debouncedQuery}&quot;`}
              actionLabel="Clear Search"
              onAction={handleClear}
            />
          ) : (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-0.5">
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
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="py-12"
        >
          <h2 className="font-display font-bold text-[13px] uppercase text-gray-500 tracking-widest mb-6 text-center">
            POPULAR SEARCHES
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {POPULAR_SEARCHES.map((term) => (
              <button
                key={term}
                onClick={() => handleSearch(term)}
                className="px-5 py-3 border-2 border-black bg-[#F5F0E8] font-display font-bold text-[12px] uppercase shadow-[2px_2px_0px_#0A0A0A] hover:bg-yellow-400 hover:shadow-[3px_3px_0px_#0A0A0A] transition-all"
              >
                {term}
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </>
  );
}

export default function SearchPage() {
  return (
    <main className="min-h-screen bg-[#F5F0E8] pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4">
        <Suspense fallback={<div className="animate-pulse h-16 bg-gray-200" />}>
          <SearchContent />
        </Suspense>
      </div>
    </main>
  );
}
