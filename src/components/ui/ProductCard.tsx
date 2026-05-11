'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingCart, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCartStore, CartItem } from '@/store/cartStore';
import { Product } from '@/types/product';

interface ProductCardProps {
  product: Product;
  index?: number;
}

const VIEW_COUNTS = [488, 234, 156, 389, 271, 445, 198, 322, 410, 275, 390, 520];

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const { addItem } = useCartStore();

  const viewCount = VIEW_COUNTS[index % VIEW_COUNTS.length];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || typeof window === 'undefined') return;

    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;

    const rotateX = (mouseY / (rect.height / 2)) * -4;
    const rotateY = (mouseX / (rect.width / 2)) * 4;

    setRotation({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
    setIsHovering(false);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const cartItem: CartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.images[0],
      variant: { size: product.variants[0]?.size || 'M' },
      quantity: 1,
    };

    addItem(cartItem);
    toast.success(`Added ${product.name} to cart! 🛍️`);
  };

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const badge = discount > 0 ? `-${discount}%` : product.featured ? 'NEW' : null;

  return (
    <motion.div
      ref={cardRef}
      initial={{ y: 40, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      whileHover={{ y: -6 }}
      whileTap={{ scale: 0.99 }}
      viewport={{ once: true }}
      transition={{
        delay: index * 0.06,
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `rotate3d(${rotation.y}, ${rotation.x}, 0, ${Math.abs(rotation.x) + Math.abs(rotation.y)}deg)`,
        perspective: '1000px',
      }}
      className="bg-white border-2 border-black relative group cursor-pointer hover:shadow-[8px_8px_0px_#0A0A0A] transition-all duration-250"
    >
      <Link href={`/products/${product.slug}`} className="block">
        <div className="aspect-[4/5] overflow-hidden relative bg-gray-100">
          <img
            src={product.images[0]}
            alt={product.name}
            className={`w-full h-full object-cover object-top transition-transform duration-600 ${isHovering ? 'scale-105' : 'scale-100'}`}
          />

          {badge && (
            <div
              className={`absolute top-0 left-0 border-2 border-black px-2 py-1 ${
                discount > 0 ? 'bg-pink-500' : 'bg-green-400'
              }`}
            >
              <span className="font-display font-black text-[11px] uppercase text-black">
                {badge}
              </span>
            </div>
          )}

          <button
            onClick={handleAddToCart}
            className="absolute top-2.5 right-2.5 w-10 h-10 bg-white border-2 border-black rounded-full flex items-center justify-center hover:bg-yellow-400 hover:shadow-[2px_2px_0px_#0A0A0A] transition-all duration-200 z-10"
            aria-label="Add to cart"
          >
            <ShoppingCart size={18} className="text-black" />
          </button>

          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/85 to-transparent p-3">
            <h3 className="font-display font-bold text-[13px] uppercase text-white truncate">
              {product.name}
            </h3>
            <div className="flex items-center justify-between mt-1">
              <div className="flex items-center gap-2">
                {product.originalPrice && (
                  <span className="font-mono text-[12px] text-white/60 line-through">
                    ₹{product.originalPrice.toLocaleString()}
                  </span>
                )}
                <span
                  className={`font-display font-black text-[16px] ${
                    discount > 0 ? 'text-green-400' : 'text-white'
                  }`}
                >
                  ₹{product.price.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center gap-1 text-white/70">
                <Eye size={12} />
                <span className="font-mono text-[11px]">{viewCount}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
