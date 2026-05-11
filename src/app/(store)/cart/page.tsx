'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Trash2 } from 'lucide-react';
import { useCartStore, CartItem } from '@/store/cartStore';
import { EmptyState } from '@/components/ui/EmptyState';
import confetti from 'canvas-confetti';
import gsap from 'gsap';

const FREE_SHIPPING_THRESHOLD = 599;
const SHIPPING_COST = 49;
const PLATFORM_FEE = 10;

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotal, getItemCount } = useCartStore();
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [freeShippingUnlocked, setFreeShippingUnlocked] = useState(false);
  
  const itemRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const prevTotalRef = useRef(getTotal());

  const subtotal = getTotal();
  const itemCount = getItemCount();
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = subtotal + shipping + PLATFORM_FEE - couponDiscount;

  useEffect(() => {
    if (prevTotalRef.current < FREE_SHIPPING_THRESHOLD && subtotal >= FREE_SHIPPING_THRESHOLD) {
      setFreeShippingUnlocked(true);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#39FF14', '#0A0A0A'],
        gravity: 1.2,
      });
      setTimeout(() => setFreeShippingUnlocked(false), 3000);
    }
    prevTotalRef.current = subtotal;
  }, [subtotal]);

  const handleRemove = (item: CartItem) => {
    const el = itemRefs.current.get(`${item.id}-${item.variant.size}`);
    if (el) {
      const tl = gsap.timeline({
        onComplete: () => {
          removeItem(item.id, item.variant.size);
        }
      });
      tl.to(el, {
        height: 0,
        opacity: 0,
        marginBottom: 0,
        duration: 0.4,
        ease: 'power3.in',
      });
    } else {
      removeItem(item.id, item.variant.size);
    }
  };

  const handleQuantityChange = (item: CartItem, delta: number) => {
    const el = itemRefs.current.get(`qty-${item.id}-${item.variant.size}`);
    if (el) {
      gsap.to(el, {
        scale: 0.85,
        duration: 0.1,
        ease: 'power2.out',
        onComplete: () => {
          gsap.to(el, {
            scale: 1,
            duration: 0.4,
            ease: 'elastic.out(1.2, 0.5)',
          });
          updateQuantity(item.id, item.variant.size, item.quantity + delta);
        }
      });
    } else {
      updateQuantity(item.id, item.variant.size, item.quantity + delta);
    }
  };

  const handleApplyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    if (code === 'FIRST10') {
      setCouponApplied(true);
      setCouponDiscount(subtotal * 0.1);
      setCouponError('');
    } else if (code === 'BFZ20') {
      setCouponApplied(true);
      setCouponDiscount(200);
      setCouponError('');
    } else {
      setCouponError('Invalid coupon code');
      setCouponApplied(false);
      setCouponDiscount(0);
    }
  };

  const formatPrice = (price: number) => `₹${price.toLocaleString('en-IN')}`;

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-8 pb-24 px-4">
        <EmptyState
          title="YOUR CART IS EMPTY"
          description="Add some items to get started"
          actionLabel="BROWSE PRODUCTS"
          onAction={() => window.location.href = '/products'}
          icon="cart"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-8 pb-24 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-display font-black text-5xl md:text-6xl text-black mb-4">
            YOUR BAG
          </h1>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-2 bg-[#39FF14] border-2 border-black px-4 py-2 font-display font-bold text-[13px]">
              {itemCount} {itemCount === 1 ? 'ITEM' : 'ITEMS'} • SECURE CHECKOUT
            </span>
            <Link
              href="/products"
              className="font-inter text-[13px] text-gray-600 hover:text-black underline"
            >
              CONTINUE SHOPPING
            </Link>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 space-y-4">
            <AnimatePresence mode="popLayout">
              {items.map((item) => (
                <motion.div
                  key={`${item.id}-${item.variant.size}`}
                  layout
                  ref={(el) => {
                    if (el) itemRefs.current.set(`${item.id}-${item.variant.size}`, el);
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  className="border-2 border-black bg-white relative"
                >
                  <div className="flex flex-col sm:flex-row">
                    <div className="sm:w-48 sm:h-48 flex-shrink-0">
                      <div className="aspect-square sm:aspect-square relative border-b-2 sm:border-b-0 sm:border-r-2 border-black">
                        <Image
                          src={item.image || '/placeholder.jpg'}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                    <div className="flex-1 p-4 sm:p-6 relative">
                      <button
                        onClick={() => handleRemove(item)}
                        className="absolute top-2 right-2 sm:top-4 sm:right-4 w-8 h-8 bg-[#FF2D6B] border-2 border-black flex items-center justify-center text-white hover:scale-110 transition-transform"
                      >
                        <X size={16} />
                      </button>
                      <h3 className="font-display font-black text-[16px] uppercase mb-2 pr-10">
                        {item.name}
                      </h3>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="bg-black text-white font-display font-bold text-[11px] uppercase px-3 py-1 border border-black">
                          {item.variant.size}
                        </span>
                        {item.variant.color && (
                          <span className="bg-[#6B5CE7] text-white font-display font-bold text-[11px] uppercase px-3 py-1 border border-black">
                            {item.variant.color}
                          </span>
                        )}
                      </div>
                      {item.originalPrice && (
                        <p className="font-mono text-[12px] text-gray-500 line-through mb-1">
                          ₹{item.originalPrice.toLocaleString('en-IN')}
                        </p>
                      )}
                      <p className="font-mono text-[14px] text-gray-500 mb-4">
                        ₹{item.price.toLocaleString('en-IN')} × {item.quantity}
                      </p>
                      <div className="flex items-center justify-between mt-4 sm:mt-auto">
                        <div className="flex items-center border-2 border-black"
                          ref={(el) => {
                            if (el) itemRefs.current.set(`qty-${item.id}-${item.variant.size}`, el);
                          }}
                        >
                          <button
                            onClick={() => handleQuantityChange(item, -1)}
                            className="w-10 h-10 flex items-center justify-center font-display font-black text-[16px] hover:bg-[#FFD600] transition-colors"
                          >
                            −
                          </button>
                          <span className="w-10 h-10 flex items-center justify-center font-display font-black text-[16px] border-x-2 border-black">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(item, 1)}
                            className="w-10 h-10 flex items-center justify-center font-display font-black text-[16px] hover:bg-[#FFD600] transition-colors"
                          >
                            +
                          </button>
                        </div>
                        <span className="font-display font-black text-[18px]">
                          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <div className="border-2 border-black bg-white shadow-[4px_4px_0px_#0A0A0A]">
              <div className="p-6">
                <h2 className="font-display font-black text-[24px] mb-6">ORDER SUMMARY</h2>
                <div className="space-y-3 font-mono text-[14px]">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    {shipping === 0 ? (
                      <span className="text-[#39FF14] font-bold">FREE</span>
                    ) : (
                      <span>{formatPrice(shipping)}</span>
                    )}
                  </div>
                  <div className="flex justify-between">
                    <span>Platform Fee</span>
                    <span>{formatPrice(PLATFORM_FEE)}</span>
                  </div>
                  {couponApplied && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="flex justify-between text-[#39FF14]"
                    >
                      <span>Discount</span>
                      <span>-{formatPrice(couponDiscount)}</span>
                    </motion.div>
                  )}
                </div>

                <div className="my-5 border-t-2 border-dashed border-black" />

                <div className="flex justify-between items-center mb-6">
                  <span className="font-display font-black text-[20px]">TOTAL</span>
                  <span className="font-display font-black text-[24px]">{formatPrice(total)}</span>
                </div>

                <div className="space-y-3">
                  <p className="font-display font-bold text-[11px] uppercase tracking-wider">
                    HAVE A COUPON?
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="ENTER CODE"
                      className="flex-1 h-13 px-4 border-2 border-black bg-white font-display font-bold text-[13px] focus:outline-none focus:border-[#6B5CE7]"
                    />
                    <button
                      onClick={handleApplyCoupon}
                      className="h-13 px-6 bg-[#666] border-2 border-black font-display font-black text-[14px] uppercase text-white hover:bg-black transition-colors"
                    >
                      APPLY
                    </button>
                  </div>
                </div>

                <Link
                  href="/checkout/details"
                  className="mt-6 w-full h-14 bg-[#6B5CE7] border-2 border-black shadow-[4px_4px_0px_#0A0A0A] font-display font-black text-[16px] uppercase text-white flex items-center justify-center hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_#0A0A0A] transition-all"
                >
                  CHECKOUT NOW
                </Link>

                <div className="mt-4 flex items-center justify-center gap-4 opacity-50">
                  <span className="text-[10px] font-mono uppercase">UPI</span>
                  <span className="text-[10px] font-mono uppercase">VISA</span>
                  <span className="text-[10px] font-mono uppercase">MC</span>
                </div>
              </div>

              <div className="bg-[#FFD600] border-t-2 border-black p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="font-display font-black text-[20px]">DELIVERY TO</span>
                  <span>🚚</span>
                </div>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Full Name"
                    className="w-full h-13 px-4 border-2 border-black bg-white font-inter text-[14px]"
                  />
                  <div className="flex gap-2">
                    <span className="h-13 px-4 border-2 border-black bg-gray-100 font-mono text-[14px] flex items-center">+91</span>
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      className="flex-1 h-13 px-4 border-2 border-black bg-white font-inter text-[14px]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}