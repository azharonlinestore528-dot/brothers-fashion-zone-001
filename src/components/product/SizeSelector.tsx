'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

interface SizeSelectorProps {
  sizes: Array<{ size: string; stock: number }>;
  selectedSize: string | null;
  onChange: (size: string) => void;
  onError?: () => void;
  error?: boolean;
}

export function SizeSelector({ sizes, selectedSize, onChange, onError, error }: SizeSelectorProps) {
  const handleSizeClick = (size: string, stock: number) => {
    if (stock <= 0) return;
    onChange(size);
  };

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-3">
        <span className="font-display font-bold text-[13px] uppercase text-black">
          SELECT SIZE
        </span>
        <span className="font-display font-bold text-[11px] uppercase text-[#C9B99A] hover:underline cursor-pointer">
          Size Guide →
        </span>
      </div>

      <motion.div
        animate={error ? { borderColor: ['#FFD600', 'transparent', '#FFD600', 'transparent', '#FFD600'] } : {}}
        transition={{ duration: 0.3 }}
        className="border-2 border-transparent p-3 -m-3"
      >
        <div className="flex flex-wrap gap-2">
          <AnimatePresence mode="popLayout">
            {sizes.map((item, idx) => {
              const isOutOfStock = item.stock <= 0;
              const isLowStock = item.stock > 0 && item.stock <= 3;
              const isSelected = selectedSize === item.size;

              return (
                <motion.button
                  key={item.size}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: idx * 0.04, type: 'spring', stiffness: 500, damping: 25 }}
                  whileTap={isSelected ? { scale: 0.9 } : { scale: 1 }}
                  onClick={() => handleSizeClick(item.size, item.stock)}
                  className={`relative min-w-[52px] h-10 px-3 border-[1.5px] rounded-lg font-inter text-[13px] font-semibold transition-all duration-200 ${
                    isOutOfStock
                      ? 'bg-[#F5F5F3] text-[#CCC] line-through cursor-not-allowed'
                      : isSelected
                      ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                      : 'bg-white text-[#1A1A1A] border-[#E8E8E8] hover:border-[#1A1A1A]'
                  }`}
                >
                  {item.size}
                  {isLowStock && (
                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[#F97316] rounded-full" />
                  )}
                </motion.button>
              );
            })}
          </AnimatePresence>
        </div>
      </motion.div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex items-center gap-2 mt-3 text-red-500"
          >
            <AlertCircle size={14} />
            <span className="font-inter text-[12px]">Please select a size</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
