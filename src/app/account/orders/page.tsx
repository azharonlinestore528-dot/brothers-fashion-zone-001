'use client';

import Link from 'next/link';

export default function AccountOrdersPage() {
  return (
    <main className="min-h-screen bg-bg">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="font-display text-4xl font-bold mb-8">MY ORDERS</h1>
        <div className="border-2 border-black p-6 bg-white text-center">
          <p className="font-mono text-gray-600">No orders yet</p>
          <Link href="/products" className="inline-block mt-4 underline">Start Shopping</Link>
        </div>
      </div>
    </main>
  );
}