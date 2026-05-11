'use client';

import { Truck, Clock, Package, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function ShippingPolicyPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="h-2 w-full" style={{
        background: 'linear-gradient(90deg, #FF2D6B 0%, #FFD600 25%, #39FF14 50%, #6B5CE7 75%, #FF2D6B 100%)',
      }} />

      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="font-display font-black text-4xl md:text-5xl text-black mb-4">
            SHIPPING POLICY
          </h1>
          <p className="font-mono text-lg text-gray-600">
            Pan India Delivery • Prepaid Only
          </p>
        </div>

        <div className="border-2 border-black shadow-[6px_6px_0px_#0A0A0A] p-8 md:p-12 bg-white mb-8">
          <div className="flex items-start gap-6 mb-8">
            <div className="w-16 h-16 bg-black border-2 border-black flex items-center justify-center flex-shrink-0">
              <Truck size={32} className="text-white" />
            </div>
            <div>
              <h2 className="font-display font-black text-xl text-black mb-2">DELIVERY TIMELINE</h2>
              <p className="font-mono text-[14px] text-gray-600 leading-relaxed">
                We ship within 2-3 business days of order confirmation. Delivery typically takes 3-7 days depending on your location. Metro cities: 3-5 days. Tier 2/3 cities: 5-7 days.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-6 mb-8">
            <div className="w-16 h-16 bg-[#FF2D6B] border-2 border-black flex items-center justify-center flex-shrink-0">
              <MapPin size={32} className="text-white" />
            </div>
            <div>
              <h2 className="font-display font-black text-xl text-black mb-2">WHERE WE SHIP</h2>
              <p className="font-mono text-[14px] text-gray-600 leading-relaxed">
                We deliver across all states in India — from Gujarat to Assam, Karnataka to Delhi. No minimum order value. Every order gets tracking number via WhatsApp.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-6 mb-8">
            <div className="w-16 h-16 bg-[#FFD600] border-2 border-black flex items-center justify-center flex-shrink-0">
              <Package size={32} className="text-black" />
            </div>
            <div>
              <h2 className="font-display font-black text-xl text-black mb-2">PACKAGING</h2>
              <p className="font-mono text-[14px] text-gray-600 leading-relaxed">
                All products are carefully packed in protective polybags with tissue paper for delicate items. Larger orders get extra padding. Every package includes a packing slip and care instructions.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-6">
            <div className="w-16 h-16 bg-[#39FF14] border-2 border-black flex items-center justify-center flex-shrink-0">
              <Clock size={32} className="text-black" />
            </div>
            <div>
              <h2 className="font-display font-black text-xl text-black mb-2">ORDER TRACKING</h2>
              <p className="font-mono text-[14px] text-gray-600 leading-relaxed">
                Once shipped, you&apos;ll receive tracking details on WhatsApp. Track your order anytime using the tracking link. Need help? Message us directly on WhatsApp — we respond within hours.
              </p>
            </div>
          </div>
        </div>

        <div className="border-2 border-black shadow-[6px_6px_0px_#0A0A0A] p-8 bg-[#FFF9E6]">
          <h3 className="font-display font-black text-lg text-black mb-4">IMPORTANT NOTES</h3>
          <ul className="font-mono text-[14px] text-gray-700 space-y-3">
            <li className="flex items-start gap-3">
              <span className="text-[#FF2D6B] font-bold">1.</span>
              <strong>Prepaid Only:</strong> We accept online payments only — no Cash on Delivery
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#FF2D6B] font-bold">2.</span>
              <strong>Address Accuracy:</strong> Please double-check your delivery address before confirming
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#FF2D6B] font-bold">3.</span>
              <strong>Failed Deliveries:</strong> If courier attempts delivery and you&apos;re unavailable, they&apos;ll leave it at nearest pickup point
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#FF2D6B] font-bold">4.</span>
              <strong>Delays:</strong> During sales or festive seasons, expect 2-3 extra days
            </li>
          </ul>
        </div>

        <div className="text-center mt-12">
          <a
            href="https://wa.me/918141001555"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-[#25D366] text-white px-8 py-4 font-display font-black text-[14px] uppercase border-2 border-black shadow-[4px_4px_0px_#0A0A0A] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_#0A0A0A] transition-all duration-200"
          >
            HAVE QUESTIONS? WHATSAPP US →
          </a>
        </div>

        <div className="mt-16 pt-8 border-t border-gray-200">
          <div className="flex justify-center gap-4 font-mono text-[12px]">
            <Link href="/privacy" className="text-gray-500 hover:text-black transition-colors">Privacy Policy</Link>
            <span className="text-gray-300">•</span>
            <Link href="/terms" className="text-gray-500 hover:text-black transition-colors">Terms of Service</Link>
            <span className="text-gray-300">•</span>
            <Link href="/about" className="text-gray-500 hover:text-black transition-colors">About Us</Link>
          </div>
        </div>
      </div>
    </main>
  );
}