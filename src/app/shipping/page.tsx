'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function ShippingPage() {
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
            SHIPPING POLICY
          </h1>
          <p className="font-mono text-base text-gray-600">
            Pan India Delivery • Prepaid Only • Tracked Orders
          </p>
        </div>

        <div className="space-y-6">
          <div className="border-2 border-black p-6 bg-white">
            <h2 className="font-display font-black text-lg text-black mb-3">DELIVERY TIMELINE</h2>
            <p className="font-mono text-[14px] text-gray-700 leading-relaxed">
              We ship within 2-3 business days of order confirmation. Delivery typically takes 3-7 days 
              depending on your location. Metro cities: 3-5 days. Tier 2/3 cities: 5-7 days. 
              During sales or festive seasons, expect 2-3 extra days.
            </p>
          </div>

          <div className="border-2 border-black p-6 bg-[#FFF9E6]">
            <h2 className="font-display font-black text-lg text-black mb-3">WHERE WE SHIP</h2>
            <p className="font-mono text-[14px] text-gray-700 leading-relaxed">
              We deliver across all states in India — from Gujarat to Assam, Karnataka to Delhi. 
              No minimum order value. Every order gets a tracking number sent via WhatsApp the moment 
              it ships. Track your order anytime using the tracking link.
            </p>
          </div>

          <div className="border-2 border-black p-6 bg-white">
            <h2 className="font-display font-black text-lg text-black mb-3">PACKAGING</h2>
            <p className="font-mono text-[14px] text-gray-700 leading-relaxed">
              All products are carefully packed in protective polybags with tissue paper for 
              delicate items. Larger orders get extra padding. Every package includes a packing 
              slip and care instructions. Gift orders get premium wrapping with ribbon.
            </p>
          </div>

          <div className="border-2 border-black p-6 bg-[#FFF9E6]">
            <h2 className="font-display font-black text-lg text-black mb-3">IMPORTANT NOTES</h2>
            <ul className="font-mono text-[13px] text-gray-700 space-y-2">
              <li><strong>Prepaid Only:</strong> We accept online payments only — no Cash on Delivery</li>
              <li><strong>Address Accuracy:</strong> Please double-check your delivery address before confirming</li>
              <li><strong>Failed Deliveries:</strong> If courier attempts delivery and you&apos;re unavailable, they&apos;ll leave it at nearest pickup point</li>
              <li><strong>Delays:</strong> During sales or festive seasons, expect 2-3 extra days</li>
            </ul>
          </div>

          <div className="border-2 border-black p-6 bg-white">
            <h2 className="font-display font-black text-lg text-black mb-3">ORDER TRACKING</h2>
            <p className="font-mono text-[14px] text-gray-700 leading-relaxed">
              Once shipped, you&apos;ll receive tracking details on WhatsApp. Track your order anytime 
              using the tracking link. Need help? Message us directly on WhatsApp — we respond 
              within hours. For urgent delivery requests, WhatsApp us.
            </p>
          </div>
        </div>

        <div className="text-center mt-10">
          <a
            href="https://wa.me/918141001555?text=Hi, I have a question about shipping"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-[#25D366] text-white px-8 py-4 font-display font-black text-[14px] uppercase border-2 border-black shadow-[4px_4px_0px_#0A0A0A] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_#0A0A0A] transition-all duration-200"
          >
            HAVE QUESTIONS? WHATSAPP US →
          </a>
        </div>
      </div>
    </main>
  );
}