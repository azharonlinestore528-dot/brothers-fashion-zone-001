'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useCartStore, CartItem } from '@/store/cartStore';
import { Product } from '@/types/product';
import { ProductCard } from '@/components/ui/ProductCard';

interface StickyAddToCartProps {
  product: Product;
  selectedSize: string | null;
  onAddToCart: () => void;
}

export function StickyAddToCart({ product, selectedSize, onAddToCart }: StickyAddToCartProps) {
  const { ref, inView } = useInView({ threshold: 0.1 });
  const { addItem } = useCartStore();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(!inView);
  }, [inView]);

  const handleAddToCart = () => {
    if (!selectedSize) {
      const sizeSelector = document.getElementById('size-selector');
      if (sizeSelector) {
        sizeSelector.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    const cartItem: CartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.images[0],
      variant: { size: selectedSize },
      quantity: 1,
    };

    addItem(cartItem);
    onAddToCart();
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 72 }}
          animate={{ y: 0 }}
          exit={{ y: 72 }}
          transition={{ type: 'spring', stiffness: 400, damping: 35 }}
          className="fixed bottom-0 left-0 right-0 h-[72px] bg-white/95 backdrop-blur-md border-t-2 border-black z-30 px-4 flex items-center justify-between"
          style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        >
          <div className="flex items-center gap-3">
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-10 h-[50px] object-cover border border-black hidden sm:block"
            />
            <div className="min-w-0">
              <p className="font-inter text-[14px] font-semibold text-black truncate max-w-[150px] sm:max-w-[200px]">
                {product.name}
              </p>
              <AnimatePresence>
                {selectedSize && (
                  <motion.p
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                    className="font-inter text-[12px] text-[#C9B99A]"
                  >
                    Size: {selectedSize}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-display font-black text-lg text-black hidden sm:block">
              ₹{product.price.toLocaleString()}
            </span>
            <button
              onClick={handleAddToCart}
              className="bg-[#0A0A0A] text-white border-2 border-black h-11 px-5 font-display font-black text-[14px] uppercase hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#0A0A0A] transition-all duration-200"
            >
              ADD TO CART
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
