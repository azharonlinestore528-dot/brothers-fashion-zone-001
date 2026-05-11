'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ShoppingCart, Eye, Heart } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCartStore, CartItem } from '@/store/cartStore';
import { getFeaturedProducts } from '@/lib/db';

const FILTERS = ['ALL', 'NEW', 'TRENDING', 'UNDER ₹999'] as const;
type FilterType = typeof FILTERS[number];

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
}

export function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<FilterType>('ALL');
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getFeaturedProducts();
        setProducts(data as Product[]);
      } catch (err) {
        console.error('Failed to load products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = useCallback((product: Product) => {
    const cartItem: CartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.images?.[0] || '/images/premium-basics.jpeg',
      variant: { size: 'M', color: 'Default' },
      quantity: 1,
    };
    addItem(cartItem);
    toast.success(`${product.name} added to cart!`);
  }, [addItem]);

  const filteredProducts = products.filter((p) => {
    if (activeFilter === 'ALL') return true;
    if (activeFilter === 'UNDER ₹999') return p.price < 999;
    return true;
  });

  if (loading) {
    return (
      <section className="py-16 bg-[#F5F0E8]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center py-20">
            <div className="animate-spin w-8 h-8 border-2 border-[#C9B99A] border-t-transparent rounded-full mx-auto" />
            <p className="mt-4 text-[#666] font-inter">Loading products...</p>
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section className="py-16 bg-[#F5F0E8]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center py-20">
            <p className="text-[#666] font-inter text-lg">No featured products yet.</p>
            <Link href="/admin/products/new" className="mt-4 inline-block text-[#6B5CE7] underline">
              Add products in admin
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-[#F5F0E8]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-display text-[28px] text-[#0A0A0A]">Featured Products</h2>
          <div className="flex gap-2">
            {FILTERS.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 text-[12px] font-inter uppercase transition-all ${
                  activeFilter === filter
                    ? 'bg-[#0A0A0A] text-white'
                    : 'bg-white text-[#0A0A0A] border border-[#0A0A0A]'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="group"
            >
              <Link href={`/products/${product.slug}`}>
                <div className="relative aspect-[3/4] bg-white overflow-hidden">
                  {product.images?.[0] ? (
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#E5E0D6] flex items-center justify-center">
                      <span className="text-[#999]">No Image</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                </div>
                <div className="mt-3">
                  <h3 className="font-inter text-[13px] text-[#0A0A0A] truncate">{product.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-inter text-[14px] font-bold text-[#0A0A0A]">₹{product.price}</span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="font-inter text-[12px] text-[#666] line-through">₹{product.originalPrice}</span>
                    )}
                  </div>
                </div>
              </Link>
              <button
                onClick={() => handleAddToCart(product)}
                className="w-full mt-2 py-2 bg-[#0A0A0A] text-white text-[12px] font-inter uppercase hover:bg-[#333] transition-colors"
              >
                Add to Cart
              </button>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link href="/products" className="font-display font-bold text-[13px] uppercase text-black hover:text-purple-500 underline">
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
}