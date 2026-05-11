'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingCart, ShoppingBag, Eye, Heart, CheckCircle2, Shield, Lock, 
  AlertTriangle, Info, Sparkles, Fingerprint, Grid3X3,
  Sparkle, ShieldCheck
} from 'lucide-react';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';
import { useCartStore, CartItem } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { getProductBySlug } from '@/lib/db';

interface ProductData {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  original_price: number;
  category: string;
  subcategory: string;
  images: string[];
  colors: string[];
  tags: string[];
  is_active: boolean;
  is_featured: boolean;
  total_stock: number;
  discount_pct: number;
}

export default function ProductPage() {
  const params = useParams();
  const slug = params?.slug as string;
  
  const [product, setProduct] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [sizeError, setSizeError] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [viewCount, setViewCount] = useState(488);

  const { addItem } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!slug) return;
      
      try {
        const data = await getProductBySlug(slug);

        if (!data) {
          setProduct(null);
        } else {
          const productData = data as any;
          setProduct({
            id: productData.id,
            name: productData.name || '',
            slug: productData.slug || '',
            description: productData.description || '',
            price: productData.price || 0,
            original_price: productData.originalPrice || 0,
            category: productData.category || '',
            subcategory: productData.subcategory || '',
            images: productData.images || [],
            colors: productData.colors || [],
            tags: productData.tags || [],
            is_active: productData.isActive || true,
            is_featured: productData.isFeatured || false,
            total_stock: productData.totalStock || 0,
            discount_pct: productData.discountPct || 0,
          } as ProductData);
        }
      } catch (err) {
        console.warn('Error fetching from Firebase:', err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  useEffect(() => {
    if (product) {
      setIsWishlisted(isInWishlist(product.id));
      const randomViews = Math.floor(Math.random() * 200) + 400;
      setViewCount(randomViews);

      const interval = setInterval(() => {
        setViewCount((prev) => prev + Math.floor(Math.random() * 3));
      }, Math.floor(Math.random() * 10000) + 5000);

      return () => clearInterval(interval);
    }
  }, [product, isInWishlist]);

  const discount = product?.discount_pct || 0;
  const cartCount = useCartStore.getState().getItemCount();

  const handleAddToCart = useCallback(() => {
    if (!product) return;

    if (!selectedSize) {
      setSizeError(true);
      const sizeSection = document.getElementById('size-section');
      if (sizeSection) {
        sizeSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      setTimeout(() => setSizeError(false), 1500);
      return;
    }

    const cartItem: CartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.original_price,
      image: product.images?.[0] || '',
      variant: { size: selectedSize },
      quantity: 1,
    };

    addItem(cartItem);
    toast.success(`Added ${product.name} to cart! 🛒`);
    
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { x: 0.5, y: 0.8 },
      colors: ['#FF2D6B', '#FFD600', '#6B5CE7', '#39FF14'],
      gravity: 0.8,
      scalar: 0.9,
    });
  }, [product, selectedSize, addItem]);

  const handleWishlist = () => {
    if (!product) return;
    
    toggleWishlist(product.id);
    setIsWishlisted(!isWishlisted);

    if (!isWishlisted) {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { x: 0.5, y: 0.8 },
        colors: ['#FF2D6B', '#FFD600', '#6B5CE7', '#39FF14'],
        gravity: 0.8,
        scalar: 0.9,
      });
      toast.success('Added to wishlist! ❤️');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F0E8] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#0A0A0A] border-t-[#6B5CE7] rounded-full animate-spin mx-auto mb-4" style={{ borderRadius: '0 !important' }} />
          <p className="font-mono text-sm text-[#0A0A0A]">Loading...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-[#F5F0E8] pt-32 pb-24 px-4 flex items-center justify-center">
        <div className="bg-white border-2 border-[#0A0A0A] p-8 shadow-[4px_4px_0px_#0A0A0A] text-center max-w-md">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="font-display font-black text-3xl uppercase text-[#0A0A0A] mb-4">Product Not Found</h1>
          <p className="font-mono text-sm text-gray-500 mb-6">The product you're looking for doesn't exist or has been removed.</p>
          <Link href="/products" className="inline-block bg-[#0A0A0A] text-white px-6 py-3 font-display font-bold text-sm uppercase border-2 border-[#0A0A0A] shadow-[4px_4px_0px_#FFD600] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_#FFD600] transition-all">
            Browse Products
          </Link>
        </div>
      </main>
    );
  }

  return (
    <>
    <style jsx global>{`
      * { border-radius: 0 !important; }
      .scrollbar-hide::-webkit-scrollbar { display: none; }
      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
      }
      .animate-shake {
        animation: shake 0.3s ease-in-out;
      }
      .pb-safe {
        padding-bottom: env(safe-area-inset-bottom, 12px);
      }
    `}</style>
    
    <main className="min-h-screen bg-[#F5F0E8] pt-32 pb-32 lg:pb-24">
      
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-0">
          {/* LEFT COLUMN - Images (55%) */}
          <div className="lg:col-span-3">
            {/* Main Image */}
            <div className="relative aspect-square lg:aspect-[4/5] border-3 border-[#0A0A0A] overflow-hidden bg-white shadow-[4px_4px_0px_#0A0A0A]">
              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedImage}
                  src={product.images?.[selectedImage] || '/placeholder.jpg'}
                  alt={product.name}
                  initial={{ opacity: 0, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full object-cover object-top"
                />
              </AnimatePresence>

              {/* Top Left Badge */}
              <div className="absolute top-3 left-3 bg-[#0A0A0A] text-white border-2 border-[#0A0A0A] px-3 py-2 flex items-center gap-2 shadow-[2px_2px_0px_#0A0A0A]">
                <ShoppingBag size={12} />
                <span className="font-mono text-[11px] uppercase">🛒 {cartCount} ADDED</span>
              </div>

              {/* Top Right Badge */}
              <div className="absolute top-3 right-3 bg-[#0A0A0A] text-white border-2 border-[#0A0A0A] px-3 py-2 flex items-center gap-2 shadow-[2px_2px_0px_#0A0A0A]">
                <Eye size={12} />
                <span className="font-mono text-[11px] uppercase">👁 {viewCount} VIEWS</span>
              </div>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-2 mt-4 overflow-x-auto pb-2 scrollbar-hide">
              {product.images?.map((img: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`flex-shrink-0 w-20 h-20 border-2 overflow-hidden transition-all ${
                    selectedImage === idx
                      ? 'border-[3px] border-[#6B5CE7] shadow-[2px_2px_0px_#6B5CE7]'
                      : 'border-[#0A0A0A] hover:border-[#6B5CE7]'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN - Info (45%) */}
          <div className="lg:col-span-2 lg:pl-8 lg:sticky lg:top-24 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto">
            
            {/* SECTION 2 - PRODUCT INFO BOX */}
            <div className="bg-white border-2 border-[#0A0A0A] p-5 shadow-[4px_4px_0px_#0A0A0A] mt-4 lg:mt-0">
              <h1 className="font-display font-black text-2xl lg:text-[28px] uppercase text-[#0A0A0A] leading-[0.95]">
                {product.name}
              </h1>

              <div className="border-t-2 border-[#0A0A0A] my-4" />

              <p className="font-mono text-[11px] text-gray-500 uppercase tracking-widest mb-3">PRICE</p>
              
              <div className="flex items-center gap-3 flex-wrap">
                <span className="font-display font-black text-[40px] text-[#6B5CE7]">
                  ₹{product.price?.toLocaleString()}
                </span>
                {product.original_price > product.price && (
                  <span className="font-mono text-lg text-gray-400 line-through">
                    ₹{product.original_price?.toLocaleString()}
                  </span>
                )}
                {discount > 0 && (
                  <span className="bg-[#FF2D6B] text-white font-display font-black text-[14px] uppercase px-[14px] py-[6px] border-2 border-[#0A0A0A] shadow-[2px_2px_0px_#0A0A0A]">
                    -{discount}% OFF
                  </span>
                )}
              </div>

              {product.category && (
                <div className="mt-4">
                  <span className="bg-gradient-to-r from-[#6B5CE7] to-[#FF2D6B] text-white font-display font-black text-[13px] uppercase border-2 border-[#0A0A0A] inline-block px-4 py-2 shadow-[2px_2px_0px_#0A0A0A]">
                    {product.category}
                  </span>
                </div>
              )}
            </div>

            {/* SECTION 3 - SIZE + CONDITION */}
            <div className="grid grid-cols-2 gap-2 mt-4">
              <div className="bg-white border-2 border-[#0A0A0A] p-4 shadow-[3px_3px_0px_#0A0A0A]">
                <p className="font-mono text-[11px] text-gray-500 uppercase mb-1">SIZE</p>
                <p className="font-display font-black text-[32px] text-[#0A0A0A] leading-none">
                  {product.subcategory || 'M'}
                </p>
              </div>
              <div className="bg-white border-2 border-[#0A0A0A] p-4 shadow-[3px_3px_0px_#0A0A0A]" id="size-section">
                <p className="font-mono text-[11px] text-gray-500 uppercase mb-1">STOCK</p>
                <p className="font-display font-black text-[32px] text-[#0A0A0A] leading-none">
                  {product.total_stock || 5}
                </p>
              </div>
            </div>

            {/* Size Selection */}
            <div className="bg-white border-2 border-[#0A0A0A] p-4 mt-4 shadow-[4px_4px_0px_#0A0A0A]">
              <p className="font-mono text-[11px] text-gray-500 uppercase mb-3">SELECT SIZE</p>
              <div className="flex flex-wrap gap-2">
                {['S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                  <button
                    key={size}
                    onClick={() => { setSelectedSize(size); setSizeError(false); }}
                    className={`w-12 h-12 border-2 border-[#0A0A0A] font-display font-black text-sm transition-all ${
                      selectedSize === size
                        ? 'bg-[#6B5CE7] text-white shadow-[2px_2px_0px_#0A0A0A]'
                        : 'bg-white text-[#0A0A0A] hover:bg-[#F5F0E8] shadow-[2px_2px_0px_#0A0A0A]'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* SECTION 4 - ADD TO CART */}
            <motion.button
              onClick={handleAddToCart}
              whileTap={{ y: 2, boxShadow: '2px 2px 0px #0A0A0A' }}
              className={`w-full h-16 mt-4 bg-[#6B5CE7] text-white border-2 border-[#0A0A0A] shadow-[4px_4px_0px_#0A0A0A] font-display font-black text-[18px] uppercase flex items-center justify-center gap-3 transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0px_#0A0A0A] ${sizeError ? 'animate-shake border-[#FFD600]' : ''}`}
            >
              ADD TO CART 🛒
              <ShoppingCart size={22} />
            </motion.button>

            <motion.button
              onClick={handleWishlist}
              whileTap={{ scale: 0.95 }}
              className={`w-full h-12 mt-3 bg-white text-[#0A0A0A] border-2 border-[#0A0A0A] shadow-[4px_4px_0px_#0A0A0A] font-display font-black text-[14px] uppercase flex items-center justify-center gap-2 transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0px_#0A0A0A] ${isWishlisted ? 'bg-[#FF2D6B] text-white' : ''}`}
            >
              <Heart size={18} fill={isWishlisted ? 'currentColor' : 'none'} />
              {isWishlisted ? 'WISHLISTED' : 'ADD TO WISHLIST'}
            </motion.button>

            {/* Trust Badges */}
            <div className="flex justify-between mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-1">
                <CheckCircle2 size={14} className="text-green-500" />
                <span className="font-mono text-[11px] uppercase text-gray-600">VETTED ITEM</span>
              </div>
              <div className="flex items-center gap-1">
                <Shield size={14} className="text-[#6B5CE7]" />
                <span className="font-mono text-[11px] uppercase text-gray-600">BUYER PROTECTED</span>
              </div>
              <div className="flex items-center gap-1">
                <Lock size={14} className="text-orange-500" />
                <span className="font-mono text-[11px] uppercase text-gray-600">SECURE PAYOUT</span>
              </div>
            </div>

            {/* SECTION 5 - THE DETAILS */}
            <div className="bg-[#F5F0E8] border-2 border-[#0A0A0A] p-5 mt-4 shadow-[4px_4px_0px_#0A0A0A]">
              <h2 className="font-display font-black text-[20px] uppercase text-[#0A0A0A]">
                THE DETAILS
              </h2>
              <div className="w-[120px] h-[3px] bg-[#FF2D6B] mt-1 mb-4" />
              <p className="font-mono text-[13px] text-[#0A0A0A] leading-[1.8]">
                {product.description || 'Premium quality product from Brother\'s Fashion Zone. Carefully vetted and quality checked before shipping.'}
              </p>
            </div>

            {/* SECTION 6 - SHOP WITH CONFIDENCE */}
            <div className="bg-white border-2 border-[#0A0A0A] p-5 mt-4 shadow-[4px_4px_0px_#0A0A0A]">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#6B5CE7] border-2 border-[#0A0A0A] flex items-center justify-center">
                  <Shield size={24} className="text-white" />
                </div>
                <div>
                  <p className="font-display font-black text-[18px] uppercase text-[#0A0A0A]">SHOP WITH CONFIDENCE</p>
                  <p className="font-mono text-[11px] text-[#6B5CE7] uppercase underline"><Link href="/vetting">LEARN ABOUT OUR 4-STEP VETTING →</Link></p>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <p className="font-mono text-[13px] text-[#0A0A0A]">
                  ✅ <span className="font-bold">BFZ Protection:</span> Money back if not as described or never delivered.
                </p>
                <p className="font-mono text-[13px] text-[#0A0A0A]">
                  ✅ <span className="font-bold">Quality Vetted:</span> Every item is checked against strict listing guidelines.
                </p>
              </div>

              <div className="border-t border-dashed border-gray-300 my-4 pt-4 flex justify-between items-center">
                <span className="font-mono text-[11px] text-gray-400 uppercase">SECURE CHECKOUT</span>
                <span className="font-mono text-[11px] text-gray-400 uppercase">UPI VISA MC</span>
              </div>
            </div>

            {/* SECTION 7 - VERIFICATION JOURNEY */}
            <div className="bg-white border-2 border-[#0A0A0A] p-5 mt-4 shadow-[4px_4px_0px_#0A0A0A]">
              <div className="flex items-center gap-2 mb-1">
                <ShieldCheck size={20} className="text-[#6B5CE7]" />
                <p className="font-display font-black text-[18px] uppercase text-[#0A0A0A]">VERIFICATION JOURNEY</p>
              </div>
              <p className="font-mono text-[10px] text-gray-400 uppercase tracking-widest mb-4">INTERNAL VETTING PROTOCOL V2.6.0</p>

              <div className="space-y-0">
                {/* Step 1 */}
                <div className="flex items-start gap-4 pb-4 relative">
                  <div className="w-10 h-10 bg-green-500 border-2 border-[#0A0A0A] flex items-center justify-center z-10">
                    <CheckCircle2 size={16} className="text-white" />
                  </div>
                  <div className="flex-1 pt-2">
                    <p className="font-display font-black text-[12px] uppercase text-[#0A0A0A] flex items-center gap-2">
                      <Fingerprint size={14} className="text-green-500" /> IDENTITY SCAN
                    </p>
                    <p className="font-mono text-[11px] text-gray-500 mt-1 leading-[1.6]">Vendor background and business credentials verified.</p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex items-start gap-4 pb-4 relative">
                  <div className="w-10 h-10 bg-green-500 border-2 border-[#0A0A0A] flex items-center justify-center z-10">
                    <CheckCircle2 size={16} className="text-white" />
                  </div>
                  <div className="flex-1 pt-2">
                    <p className="font-display font-black text-[12px] uppercase text-[#0A0A0A] flex items-center gap-2">
                      <Sparkles size={14} className="text-green-500" /> CURATion
                    </p>
                    <p className="font-mono text-[11px] text-gray-500 mt-1 leading-[1.6]">Expert evaluation of product quality and style.</p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex items-start gap-4 pb-4 relative">
                  <div className="w-10 h-10 bg-green-500 border-2 border-[#0A0A0A] flex items-center justify-center z-10">
                    <CheckCircle2 size={16} className="text-white" />
                  </div>
                  <div className="flex-1 pt-2">
                    <p className="font-display font-black text-[12px] uppercase text-[#0A0A0A] flex items-center gap-2">
                      <Grid3X3 size={14} className="text-green-500" /> GRADING
                    </p>
                    <p className="font-mono text-[11px] text-gray-500 mt-1 leading-[1.6]">Rigorous inspection for quality and condition.</p>
                  </div>
                </div>

                {/* Step 4 - Pending */}
                <div className="flex items-start gap-4 pb-2">
                  <div className="w-10 h-10 bg-[#FFD600] border-2 border-[#0A0A0A] flex items-center justify-center z-10">
                    <span className="font-display font-black text-[14px] text-[#0A0A0A]">4</span>
                  </div>
                  <div className="flex-1 pt-2">
                    <p className="font-display font-black text-[12px] uppercase text-[#0A0A0A] flex items-center gap-2">
                      <Shield size={14} className="text-gray-400" /> SECURITY
                    </p>
                    <p className="font-mono text-[11px] text-gray-500 mt-1 leading-[1.6]">Platform purchase protection active for this item.</p>
                  </div>
                </div>
              </div>

              <div className="border-t-2 border-dashed border-[#0A0A0A] mt-4 pt-4 flex justify-between items-center">
                <div className="flex gap-1">
                  <div className="w-6 h-1 bg-green-500 border border-[#0A0A0A]" />
                  <div className="w-6 h-1 bg-green-500 border border-[#0A0A0A]" />
                  <div className="w-6 h-1 bg-green-500 border border-[#0A0A0A]" />
                </div>
                <span className="font-mono text-[11px] text-green-600 uppercase tracking-wider">IDENTITY & QUALITY VERIFIED</span>
              </div>
            </div>

            {/* SECTION 8 - IMPORTANT NOTICE */}
            <div className="bg-[#FFF5F5] border-2 border-[#DC2626] p-5 mt-4 shadow-[4px_4px_0px_#DC2626]">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle size={18} className="text-[#DC2626]" />
                <p className="font-display font-black text-[18px] text-[#DC2626]">IMPORTANT</p>
              </div>
              <div className="space-y-2">
                <p className="font-mono text-[13px] text-[#DC2626] leading-[1.7]">1. Easy 7-day returns — contact us on WhatsApp within 7 days.</p>
                <p className="font-mono text-[13px] text-[#DC2626] leading-[1.7]">2. Kindly make an unboxing video to document the condition of the product in case of any defects or discrepancies.</p>
              </div>
            </div>

            {/* SECTION 9 - SOLD BY */}
            <div className="bg-[#FFFBEB] border-2 border-[#D97706] p-5 mt-4 shadow-[4px_4px_0px_#D97706]">
              <div className="flex items-center gap-2">
                <Info size={18} className="text-[#D97706]" />
                <p className="font-display font-black text-[16px] text-[#D97706]">SOLD BY BROTHER&apos;S FASHION ZONE:</p>
              </div>
              <p className="font-mono text-[13px] text-[#92400E] leading-[1.7] mt-3">
                This item is sold and shipped by Brother&apos;s Fashion Zone. Every product is quality-checked before dispatch. By purchasing, you agree to our Terms & Conditions.
              </p>
            </div>

          </div>
        </div>

        {/* SECTION 10 - MORE HEAT */}
        <div className="mt-12">
          <h2 className="font-display font-black text-[36px] text-[#0A0A0A]">
            MORE HEAT<span className="text-[#FF2D6B]">.</span>
          </h2>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-1 mt-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white border-2 border-[#0A0A0A] shadow-[4px_4px_0px_#0A0A0A] overflow-hidden hover:-translate-y-1 hover:shadow-[6px_6px_0px_#0A0A0A] transition-all">
                <div className="aspect-[4/5] bg-gray-200 relative">
                  <img 
                    src={`https://images.unsplash.com/photo-1594938298603-c8148c4b4357?w=400&q=80`} 
                    alt="Related product"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-3">
                  <h3 className="font-display font-bold text-xs uppercase text-[#0A0A0A] truncate">Related Product {i}</h3>
                  <p className="font-display font-black text-sm text-[#6B5CE7] mt-1">₹1,499</p>
                </div>
              </div>
            ))}

            {/* Find More Card */}
            <button 
              onClick={() => window.location.href = '/products'}
              className="bg-[#FF2D6B] border-2 border-[#0A0A0A] shadow-[4px_4px_0px_#0A0A0A] flex flex-col items-center justify-center aspect-[4/5] hover:-translate-y-1 hover:shadow-[6px_6px_0px_#0A0A0A] transition-all"
            >
              <div className="flex gap-1 mb-2">
                <Sparkles size={24} className="text-white" />
                <Sparkles size={24} className="text-white" />
              </div>
              <p className="font-display font-black text-[14px] uppercase text-white">FIND MORE LIKE THIS</p>
            </button>
          </div>
        </div>

      </div>
    </main>

    {/* STICKY BOTTOM BAR - Mobile Only */}
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-[#0A0A0A] px-4 py-3 z-30 lg:hidden pb-safe">
      <div className="flex items-center gap-3">
        <div>
          <p className="font-mono text-[10px] text-gray-500 uppercase">PRICE</p>
          <p className="font-display font-black text-[24px] text-[#0A0A0A]">₹{product.price?.toLocaleString()}</p>
        </div>
        <button
          onClick={handleAddToCart}
          className="flex-1 h-[52px] bg-[#6B5CE7] text-white border-2 border-[#0A0A0A] shadow-[3px_3px_0px_#0A0A0A] font-display font-black text-[16px] uppercase hover:-translate-y-1 hover:shadow-[4px_4px_0px_#0A0A0A] transition-all"
        >
          ADD
        </button>
      </div>
    </div>
    </>
  );
}