'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, ShoppingBag, Heart, Trash2 } from 'lucide-react';
import { STORE } from '@/lib/constants';
import { useWishlistStore } from '@/store/wishlistStore';
import { getProducts } from '@/lib/db';

export default function WishlistPage() {
  const { productIds, removeFromWishlist } = useWishlistStore();
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts().then((data) => {
      setAllProducts(data as any[]);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const wishlistProducts = allProducts.filter((p) => productIds.includes(p.id));

  return (
    <main className="min-h-screen bg-bg">
      <header className="bg-white border-b-2 border-black sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="font-display text-xl font-bold">BFZ</Link>
            <div className="flex items-center gap-4">
              <Link href="/search" className="p-2"><Search className="w-5 h-5" /></Link>
              <Link href="/cart" className="p-2"><ShoppingBag className="w-5 h-5" /></Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="font-display text-4xl font-bold mb-8">WISHLIST ({wishlistProducts.length})</h1>

        {wishlistProducts.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h2 className="font-display text-2xl font-bold mb-4">Your wishlist is empty</h2>
            <Link href="/products" className="inline-block bg-accent4 text-black px-8 py-4 font-display font-bold border-2 border-black shadow-block hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
              EXPLORE PRODUCTS
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {wishlistProducts.map((product) => (
              <div key={product.id} className="border-2 border-black bg-white overflow-hidden shadow-block">
                <Link href={`/products/${product.slug}`}>
                  <div className="aspect-[3/4]">
                    <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                </Link>
                <div className="p-4 flex justify-between items-start">
                  <div>
                    <h3 className="font-display font-bold text-lg">{product.name}</h3>
                    <span className="font-mono font-bold text-accent3">₹{product.price.toLocaleString()}</span>
                  </div>
                  <button onClick={() => removeFromWishlist(product.id)} className="text-red-600">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <footer className="bg-white py-8 border-t-2 border-black mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="font-mono text-sm">© {STORE.year} {STORE.name}</p>
        </div>
      </footer>
    </main>
  );
}
