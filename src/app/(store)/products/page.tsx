'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Accordion from '@radix-ui/react-accordion';
import * as Checkbox from '@radix-ui/react-checkbox';
import { X, Filter, ChevronDown, Check } from 'lucide-react';
import { ProductCard } from '@/components/ui/ProductCard';
import { RangeSlider } from '@/components/ui/RangeSlider';
import { FilterChip } from '@/components/ui/FilterChip';
import { EmptyState } from '@/components/ui/EmptyState';
import { useProducts, ProductFilters } from '@/hooks/useProducts';

const CATEGORIES = ['Men', 'Women', 'Kids', 'Footwear', 'Watches', 'Bags', 'Accessories', 'Sale'];
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10'];

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'popular', label: 'Most Popular' },
];

export default function ProductsPage() {
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<ProductFilters['sortBy']>('newest');
  const [displayCount, setDisplayCount] = useState(12);

  const { products, loading } = useProducts({
    filters: {
      category: selectedCategories,
      priceRange,
      sizes: selectedSizes,
      sortBy,
    },
  });

  const displayedProducts = products.slice(0, displayCount);
  const hasMore = displayCount < products.length;

  const activeFilterCount = selectedCategories.length + (priceRange[0] > 0 || priceRange[1] < 5000 ? 1 : 0) + selectedSizes.length;

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setPriceRange([0, 5000]);
    setSelectedSizes([]);
    setSortBy('newest');
  };

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  return (
    <main className="min-h-screen bg-[#F5F0E8] pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="hidden lg:block w-[280px] flex-shrink-0">
            <FilterSidebar
              categories={CATEGORIES}
              sizes={SIZES}
              selectedCategories={selectedCategories}
              selectedSizes={selectedSizes}
              priceRange={priceRange}
              sortBy={sortBy}
              activeFilterCount={activeFilterCount}
              onToggleCategory={toggleCategory}
              onToggleSize={toggleSize}
              onPriceRangeChange={setPriceRange}
              onSortChange={setSortBy}
              onClearAll={clearAllFilters}
            />
          </aside>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <h1 className="font-display font-bold text-[13px] uppercase text-black">
                {products.length} PRODUCTS FOUND
              </h1>
              <div className="flex items-center gap-3">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as ProductFilters['sortBy'])}
                  className="hidden md:block border-2 border-black bg-white px-3 py-2 font-display font-bold text-[12px] uppercase focus:outline-none focus:ring-2 focus:ring-yellow-400"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => setShowFilters(true)}
                  className="lg:hidden flex items-center gap-2 border-2 border-black bg-white px-4 py-2 font-display font-bold text-[12px] uppercase"
                >
                  <Filter size={16} />
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="w-5 h-5 bg-yellow-400 border border-black text-[10px] flex items-center justify-center">
                      {activeFilterCount}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {activeFilterCount > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedCategories.map((cat) => (
                  <FilterChip
                    key={cat}
                    label={cat}
                    active
                    removable
                    onRemove={() => toggleCategory(cat)}
                  />
                ))}
                {selectedSizes.map((size) => (
                  <FilterChip
                    key={size}
                    label={size}
                    active
                    removable
                    onRemove={() => toggleSize(size)}
                  />
                ))}
                {activeFilterCount > 0 && (
                  <button
                    onClick={clearAllFilters}
                    className="px-3 py-1.5 border-2 border-red-500 text-red-500 font-display font-bold text-[11px] uppercase hover:bg-red-500 hover:text-white transition-colors"
                  >
                    Clear All
                  </button>
                )}
              </div>
            )}

            {loading ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-0.5">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="aspect-[4/5] bg-gray-200 animate-pulse border-2 border-black" />
                ))}
              </div>
            ) : displayedProducts.length === 0 ? (
              <EmptyState
                title="NO RESULTS FOUND"
                description="Try different filters or clear all filters"
                actionLabel="Clear Filters"
                onAction={clearAllFilters}
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
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showFilters && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFilters(false)}
              className="fixed inset-0 bg-black/40 z-50 md:hidden"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[20px] border-t-2 border-black z-50 md:hidden max-h-[85vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-white border-b-2 border-black p-4 flex items-center justify-between">
                <h2 className="font-display font-black text-lg uppercase">Filters</h2>
                <button onClick={() => setShowFilters(false)} className="w-10 h-10 border-2 border-black flex items-center justify-center">
                  <X size={18} />
                </button>
              </div>
              <div className="p-4">
                <FilterSidebar
                  categories={CATEGORIES}
                  sizes={SIZES}
                  selectedCategories={selectedCategories}
                  selectedSizes={selectedSizes}
                  priceRange={priceRange}
                  sortBy={sortBy}
                  activeFilterCount={activeFilterCount}
                  onToggleCategory={toggleCategory}
                  onToggleSize={toggleSize}
                  onPriceRangeChange={setPriceRange}
                  onSortChange={setSortBy}
                  onClearAll={clearAllFilters}
                />
              </div>
              <div className="sticky bottom-0 bg-white border-t-2 border-black p-4">
                <button
                  onClick={() => setShowFilters(false)}
                  className="w-full bg-black text-white h-12 font-display font-black text-[14px] uppercase"
                >
                  SHOW {products.length} RESULTS
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  );
}

interface FilterSidebarProps {
  categories: string[];
  sizes: string[];
  selectedCategories: string[];
  selectedSizes: string[];
  priceRange: [number, number];
  sortBy: ProductFilters['sortBy'];
  activeFilterCount: number;
  onToggleCategory: (cat: string) => void;
  onToggleSize: (size: string) => void;
  onPriceRangeChange: (range: [number, number]) => void;
  onSortChange: (sort: ProductFilters['sortBy']) => void;
  onClearAll: () => void;
}

function FilterSidebar({
  categories,
  sizes,
  selectedCategories,
  selectedSizes,
  priceRange,
  sortBy,
  activeFilterCount,
  onToggleCategory,
  onToggleSize,
  onPriceRangeChange,
  onSortChange,
  onClearAll,
}: FilterSidebarProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display font-black text-xl uppercase">FILTER</h2>
        {activeFilterCount > 0 && (
          <span className="w-6 h-6 bg-yellow-400 border border-black text-[10px] font-display font-bold flex items-center justify-center">
            {activeFilterCount}
          </span>
        )}
      </div>

      <Accordion.Root type="multiple" defaultValue={['category', 'price']}>
        <Accordion.Item value="category">
          <Accordion.Trigger className="flex items-center justify-between w-full py-2 border-b-2 border-black">
            <span className="font-display font-bold text-[13px] uppercase">CATEGORY</span>
            <ChevronDown size={16} className="transition-transform data-[state=open]:rotate-180" />
          </Accordion.Trigger>
          <Accordion.Content className="py-3 space-y-2">
            {categories.map((cat) => (
              <label key={cat} className="flex items-center gap-2 cursor-pointer">
                <Checkbox.Root
                  checked={selectedCategories.includes(cat)}
                  onCheckedChange={() => onToggleCategory(cat)}
                  className="w-5 h-5 border-2 border-black bg-white flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-yellow-400 accent-black"
                >
                  <Checkbox.Indicator>
                    <Check size={14} strokeWidth={3} />
                  </Checkbox.Indicator>
                </Checkbox.Root>
                <span className="font-display font-bold text-[13px]">{cat}</span>
              </label>
            ))}
          </Accordion.Content>
        </Accordion.Item>

        <Accordion.Item value="price">
          <Accordion.Trigger className="flex items-center justify-between w-full py-2 border-b-2 border-black">
            <span className="font-display font-bold text-[13px] uppercase">PRICE RANGE</span>
            <ChevronDown size={16} className="transition-transform data-[state=open]:rotate-180" />
          </Accordion.Trigger>
          <Accordion.Content className="py-4">
            <RangeSlider value={priceRange} onChange={onPriceRangeChange} />
          </Accordion.Content>
        </Accordion.Item>

        <Accordion.Item value="size">
          <Accordion.Trigger className="flex items-center justify-between w-full py-2 border-b-2 border-black">
            <span className="font-display font-bold text-[13px] uppercase">SIZE</span>
            <ChevronDown size={16} className="transition-transform data-[state=open]:rotate-180" />
          </Accordion.Trigger>
          <Accordion.Content className="py-3">
            <div className="flex flex-wrap gap-2">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => onToggleSize(size)}
                  className={`px-3 py-1.5 border-2 border-black font-display font-bold text-[11px] uppercase transition-all ${
                    selectedSizes.includes(size)
                      ? 'bg-yellow-400'
                      : 'bg-white hover:bg-yellow-400'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>

      {activeFilterCount > 0 && (
        <button
          onClick={onClearAll}
          className="w-full border-2 border-black py-2 font-display font-bold text-[12px] uppercase hover:bg-red-500 hover:text-white transition-colors"
        >
          CLEAR ALL FILTERS
        </button>
      )}
    </div>
  );
}
