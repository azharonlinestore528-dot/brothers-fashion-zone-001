'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function VettingPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="h-2 w-full" style={{
        background: 'linear-gradient(90deg, #FF2D6B 0%, #FFD600 25%, #39FF14 50%, #6B5CE7 75%, #FF2D6B 100%)',
      }} />

      <div className="max-w-3xl mx-auto px-4 py-16">
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-mono text-[13px] text-gray-600 hover:text-black transition-colors mb-8"
        >
          <ArrowLeft size={16} />
          Back to Home
        </Link>

        <div className="text-center mb-12">
          <h1 className="font-display font-black text-4xl md:text-5xl text-black mb-4">
            HOW WE CURATE PRODUCTS
          </h1>
          <p className="font-mono text-base text-gray-600">
            Every item goes through our strict vetting process before listing.
          </p>
        </div>

        <div className="space-y-4">
          <div className="border-2 border-black p-6 bg-white flex gap-6">
            <div className="w-12 h-12 bg-black text-white font-display font-black text-xl flex items-center justify-center flex-shrink-0">
              1
            </div>
            <div>
              <h2 className="font-display font-black text-lg text-black mb-2">FABRIC INSPECTION</h2>
              <p className="font-mono text-[14px] text-gray-600 leading-relaxed">
                We personally check every fabric for quality. Hand feel, thickness, texture — only fabrics that meet our standards move to the next stage.
              </p>
            </div>
          </div>

          <div className="border-2 border-black p-6 bg-white flex gap-6">
            <div className="w-12 h-12 bg-[#FFD600] text-black font-display font-black text-xl flex items-center justify-center flex-shrink-0">
              2
            </div>
            <div>
              <h2 className="font-display font-black text-lg text-black mb-2">STITCHING REVIEW</h2>
              <p className="font-mono text-[14px] text-gray-600 leading-relaxed">
                Every seam, every hem, every buttonhole is checked. We verify stitching quality and finishing — because the details matter.
              </p>
            </div>
          </div>

          <div className="border-2 border-black p-6 bg-white flex gap-6">
            <div className="w-12 h-12 bg-[#FF2D6B] text-white font-display font-black text-xl flex items-center justify-center flex-shrink-0">
              3
            </div>
            <div>
              <h2 className="font-display font-black text-lg text-black mb-2">SIZING VERIFICATION</h2>
              <p className="font-mono text-[14px] text-gray-600 leading-relaxed">
                We test every size chart by comparing against actual measurements. If a product runs small or large, we note it. You always know what you&apos;re getting.
              </p>
            </div>
          </div>

          <div className="border-2 border-black p-6 bg-[#0A0A0A] text-white flex gap-6">
            <div className="w-12 h-12 bg-white text-black font-display font-black text-xl flex items-center justify-center flex-shrink-0">
              4
            </div>
            <div>
              <h2 className="font-display font-black text-lg text-white mb-2">PHOTO VERIFICATION</h2>
              <p className="font-mono text-[14px] text-white/70 leading-relaxed">
                We photograph every product ourselves. No stock photos, no misleading angles. Multiple shots from different angles so you see the real item.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mt-10">
          <Link
            href="/products"
            className="inline-block bg-black text-white px-8 py-4 font-display font-black text-[14px] uppercase border-2 border-black shadow-[4px_4px_0px_#FFD600] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_#FFD600] transition-all duration-200"
          >
            SEE OUR COLLECTION →
          </Link>
        </div>
      </div>
    </main>
  );
}