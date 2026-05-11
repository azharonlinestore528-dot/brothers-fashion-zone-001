'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function ReturnsPage() {
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
            RETURNS & REFUNDS
          </h1>
          <p className="font-mono text-base text-gray-600">
            Easy returns • Money-back guarantee • WhatsApp support
          </p>
        </div>

        <div className="space-y-6">
          <div className="border-2 border-black p-6 bg-white">
            <h2 className="font-display font-black text-lg text-black mb-3">RETURN POLICY</h2>
            <p className="font-mono text-[14px] text-gray-700 leading-relaxed">
              We offer a 7-day return window from the date of delivery. If you&apos;re not satisfied 
              with your purchase — wrong size, damaged product, or not as described — contact us 
              on WhatsApp and we&apos;ll make it right. No questions asked.
            </p>
          </div>

          <div className="border-2 border-black p-6 bg-[#FFF9E6]">
            <h2 className="font-display font-black text-lg text-black mb-3">HOW TO RETURN</h2>
            <p className="font-mono text-[14px] text-gray-700 leading-relaxed">
              Simply WhatsApp us at +91 81410 01555 with your order ID and reason for return. 
              We&apos;ll share return instructions within hours. Once we receive the product, refund 
              is processed within 5-7 business days to your original payment method.
            </p>
          </div>

          <div className="border-2 border-black p-6 bg-white">
            <h2 className="font-display font-black text-lg text-black mb-3">ELIGIBLE FOR RETURN</h2>
            <ul className="font-mono text-[13px] text-gray-700 space-y-2">
              <li>✓ Wrong size received (size exchange available)</li>
              <li>✓ Damaged or defective products</li>
              <li>✓ Product not as shown in photos</li>
              <li>✓ Color mismatch from listing</li>
            </ul>
          </div>

          <div className="border-2 border-black p-6 bg-[#FFF9E6]">
            <h2 className="font-display font-black text-lg text-black mb-3">NOT ELIGIBLE FOR RETURN</h2>
            <ul className="font-mono text-[13px] text-gray-700 space-y-2">
              <li>✗ Worn, washed, or altered products</li>
              <li>✗ Returns requested after 7 days of delivery</li>
              <li>✗ Products marked as &quot;Non-Returnable&quot; in listing</li>
            </ul>
          </div>

          <div className="border-2 border-black p-6 bg-white">
            <h2 className="font-display font-black text-lg text-black mb-3">REFUND TIMELINE</h2>
            <p className="font-mono text-[14px] text-gray-700 leading-relaxed">
              Once we receive your return, inspection takes 1-2 business days. Refund is processed 
              within 5-7 business days to your original payment method. WhatsApp us anytime for 
              status updates — we respond within hours.
            </p>
          </div>
        </div>

        <div className="text-center mt-10">
          <a
            href="https://wa.me/918141001555?text=Hi, I need help with a return"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-[#25D366] text-white px-8 py-4 font-display font-black text-[14px] uppercase border-2 border-black shadow-[4px_4px_0px_#0A0A0A] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_#0A0A0A] transition-all duration-200"
          >
            NEED HELP? WHATSAPP US →
          </a>
        </div>
      </div>
    </main>
  );
}