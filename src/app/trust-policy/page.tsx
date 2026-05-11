'use client';

import Link from 'next/link';
import { Ruler, Camera, CheckCircle, ArrowLeft } from 'lucide-react';

export default function TrustPolicyPage() {
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
            OUR QUALITY PROMISE
          </h1>
          <p className="font-mono text-base text-gray-600">
            Every product on Brother&apos;s Fashion Zone is personally reviewed.
          </p>
        </div>

        <div className="space-y-6">
          <div className="border-2 border-black p-6 bg-white">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-black border-2 border-black flex items-center justify-center flex-shrink-0">
                <Camera size={24} className="text-white" />
              </div>
              <div>
                <h2 className="font-display font-black text-lg text-black mb-2">GENUINE PHOTOS</h2>
                <p className="font-mono text-[14px] text-gray-600 leading-relaxed">
                  All photos are of actual products. We photograph every item ourselves — no stock images, no misleading angles. What you see is exactly what you get.
                </p>
              </div>
            </div>
          </div>

          <div className="border-2 border-black p-6 bg-white">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[#FFD600] border-2 border-black flex items-center justify-center flex-shrink-0">
                <Ruler size={24} className="text-black" />
              </div>
              <div>
                <h2 className="font-display font-black text-lg text-black mb-2">ACCURATE SIZING</h2>
                <p className="font-mono text-[14px] text-gray-600 leading-relaxed">
                  Size charts are tested and verified. Every listing includes detailed measurements. Still unsure? WhatsApp us your measurements and we&apos;ll recommend the right size.
                </p>
              </div>
            </div>
          </div>

          <div className="border-2 border-black p-6 bg-white">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[#FF2D6B] border-2 border-black flex items-center justify-center flex-shrink-0">
                <CheckCircle size={24} className="text-white" />
              </div>
              <div>
                <h2 className="font-display font-black text-lg text-black mb-2">FABRIC QUALITY CHECK</h2>
                <p className="font-mono text-[14px] text-gray-600 leading-relaxed">
                  We verify every fabric before listing. Hand feel, colorfastness, stitching — if it doesn&apos;t meet our standards, it doesn&apos;t make the cut. Premium quality, guaranteed.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-10">
          <Link
            href="/products"
            className="inline-block bg-black text-white px-8 py-4 font-display font-black text-[14px] uppercase border-2 border-black shadow-[4px_4px_0px_#FFD600] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_#FFD600] transition-all duration-200"
          >
            SHOP WITH CONFIDENCE →
          </Link>
        </div>
      </div>
    </main>
  );
}