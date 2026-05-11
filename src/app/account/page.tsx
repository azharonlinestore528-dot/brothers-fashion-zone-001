'use client';

import Link from 'next/link';
import { Package, Heart, User, Settings } from 'lucide-react';

export default function AccountPage() {
  return (
    <main className="min-h-screen bg-bg">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="font-display text-4xl font-bold mb-8">MY ACCOUNT</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/account/orders" className="border-2 border-black p-6 bg-white hover:bg-gray-50 transition-colors">
            <Package className="w-12 h-12 mb-4" />
            <h2 className="font-display text-xl font-bold">MY ORDERS</h2>
            <p className="font-mono text-sm text-gray-600">Track your orders</p>
          </Link>
          
          <Link href="/wishlist" className="border-2 border-black p-6 bg-white hover:bg-gray-50 transition-colors">
            <Heart className="w-12 h-12 mb-4" />
            <h2 className="font-display text-xl font-bold">WISHLIST</h2>
            <p className="font-mono text-sm text-gray-600">Your saved items</p>
          </Link>
          
          <div className="border-2 border-black p-6 bg-white">
            <User className="w-12 h-12 mb-4" />
            <h2 className="font-display text-xl font-bold">PROFILE</h2>
            <p className="font-mono text-sm text-gray-600">Manage your account</p>
          </div>
        </div>
      </div>
    </main>
  );
}