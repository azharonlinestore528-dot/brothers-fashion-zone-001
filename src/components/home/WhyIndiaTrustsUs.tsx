'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ShieldCheck, Wallet, CreditCard, Truck } from 'lucide-react';

const TRUST_CARDS = [
  { icon: ShieldCheck, iconBg: '#FFD600', title: '100% VETTED', sub: 'VERIFIED CURATORS' },
  { icon: Wallet, iconBg: '#39FF14', title: 'BUYER PROTECTION', sub: 'SECURE PAYMENT' },
  { icon: CreditCard, iconBg: '#6B5CE7', title: 'SECURE CHECKOUT', sub: 'UPI, VISA, MASTERCARD' },
  { icon: Truck, iconBg: '#FF2D6B', title: 'TRACKED DELIVERY', sub: 'END-TO-END' },
];

export function WhyIndiaTrustsUs() {
  return (
    <section className="bg-[#F5F0E8] border-b-2 border-black py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-display font-black text-4xl md:text-5xl text-black leading-[0.95]">
          WHY INDIA
        </h2>
        <h2 className="font-display font-black text-4xl md:text-5xl text-purple-500 leading-[0.95]">
          TRUSTS US
        </h2>
        <Link href="/vetting" className="font-display font-bold text-[11px] uppercase underline mt-3 cursor-pointer text-black block">
          LEARN ABOUT VETTING →
        </Link>
        <div className="border-t-2 border-black mt-6" />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          {TRUST_CARDS.map((card, idx) => (
            <motion.div
              key={card.title}
              initial={{ y: 40, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: idx * 0.08 }}
              viewport={{ once: true }}
              className="bg-white border-2 border-black shadow-[4px_4px_0px_#0A0A0A] p-6 hover:-translate-y-1 hover:shadow-[6px_6px_0px_#0A0A0A] transition-all duration-300 cursor-default"
            >
              <div
                className="w-14 h-14 flex items-center justify-center border-2 border-black mx-auto"
                style={{ backgroundColor: card.iconBg }}
              >
                <card.icon size={28} className="text-black" />
              </div>
              <h3 className="font-display font-black text-[16px] uppercase text-black mt-4 text-center">
                {card.title}
              </h3>
              <p className="font-display font-bold text-[11px] uppercase tracking-wider text-gray-500 mt-1 text-center">
                {card.sub}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
