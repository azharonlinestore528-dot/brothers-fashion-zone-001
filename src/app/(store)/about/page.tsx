'use client';

import Link from 'next/link';
import { STORE } from '@/lib/constants';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-bg">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="font-display text-4xl font-bold mb-8">ABOUT US</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <div className="border-2 border-black p-8 bg-white mb-8">
              <h2 className="font-display text-2xl font-bold mb-4">OUR STORY</h2>
              <p className="font-mono text-gray-700 leading-relaxed">
                Welcome to {STORE.name}, your premier destination for premium Indian fashion wear. 
                Established in {STORE.year - 8}+ years ago, we have been dedicated to bringing you the finest 
                traditional and contemporary Indian ethnic wear.
              </p>
              <p className="font-mono text-gray-700 leading-relaxed mt-4">
                Our founder, {STORE.owner}, started this journey with a vision to make authentic Indian craftsmanship 
                accessible to fashion enthusiasts across India. Today, we offer a curated collection of kurtas, sherwanis, 
                blazers, and more.
              </p>
            </div>

            <div className="border-2 border-black p-8 bg-white mb-8">
              <h2 className="font-display text-2xl font-bold mb-4">OUR COMMITMENT</h2>
              <ul className="font-mono text-gray-700 space-y-2">
                <li>✓ 100% Authentic Products</li>
                <li>✓ Quality Craftsmanship</li>
                <li>✓ Fair Pricing</li>
                <li>✓ Excellent Customer Service</li>
                <li>✓ Easy Returns</li>
              </ul>
            </div>
          </div>

          <div>
            <div className="border-2 border-black p-8 bg-accent4">
              <h2 className="font-display text-2xl font-bold mb-4">WHY CHOOSE US?</h2>
              <div className="space-y-4">
                <div className="border-2 border-black p-4 bg-white">
                  <h3 className="font-display font-bold">Premium Quality</h3>
                  <p className="font-mono text-sm text-gray-600">Only the finest materials and craftsmanship</p>
                </div>
                <div className="border-2 border-black p-4 bg-white">
                  <h3 className="font-display font-bold">Authentic Designs</h3>
                  <p className="font-mono text-sm text-gray-600">Traditional techniques, modern silhouettes</p>
                </div>
                <div className="border-2 border-black p-4 bg-white">
                  <h3 className="font-display font-bold">Pan-India Delivery</h3>
                  <p className="font-mono text-sm text-gray-600">Fast shipping across all cities</p>
                </div>
                <div className="border-2 border-black p-4 bg-white">
                  <h3 className="font-display font-bold">COD Available</h3>
                  <p className="font-mono text-sm text-gray-600">Pay when you receive</p>
                </div>
              </div>
            </div>

            <div className="border-2 border-black p-8 bg-white mt-8">
              <h2 className="font-display text-2xl font-bold mb-4">CONTACT INFO</h2>
              <div className="font-mono space-y-2">
                <p><strong>Owner:</strong> {STORE.owner}</p>
                <p><strong>Email:</strong> {STORE.email}</p>
                <p><strong>Phone:</strong> {STORE.phone}</p>
                <p><strong>Hours:</strong> {STORE.hours}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-white py-8 border-t-2 border-black mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="font-mono text-sm">© {STORE.year} {STORE.name}</p>
        </div>
      </footer>
    </main>
  );
}