'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

const floatingItems = [
  { top: '10%', left: '5%', anim: 'animate-float1' },
  { top: '60%', left: '2%', anim: 'animate-float2' },
  { top: '20%', left: '80%', anim: 'animate-float3' },
  { top: '70%', left: '75%', anim: 'animate-float4' },
  { top: '5%', left: '40%', anim: 'animate-float5' },
  { top: '80%', left: '45%', anim: 'animate-float6' },
  { top: '40%', left: '90%', anim: 'animate-float7' },
  { top: '45%', left: '12%', anim: 'animate-float8' },
];

const sampleImages = [
  '/images/fabric-collection.jpeg',
  '/images/archive-sale.jpeg',
  '/images/premium-basics.jpeg',
  '/images/classics-collection.jpeg',
  '/images/denim-details.jpeg',
  '/images/fabric-collection.jpeg',
  '/images/linen-collection.jpeg',
  '/images/summer-linen-pants.jpeg',
];

export function FloatingClothesSection() {
  return (
    <section className="relative bg-[#0A0A0A] border-b-2 border-[#C9B99A] py-16 px-6 overflow-hidden min-h-[500px]">
      {/* Floating clothing items in background */}
      {floatingItems.map((item, idx) => (
        <motion.div
          key={idx}
          className={`absolute w-[120px] h-[150px] border-2 border-[rgba(201,185,154,0.3)] shadow-[4px_4px_0px_rgba(201,185,154,0.2)] bg-[#1A1A1A] overflow-hidden opacity-60 ${item.anim}`}
          style={{
            top: item.top,
            left: item.left,
          }}
        >
          <Image
            src={sampleImages[idx]}
            alt={`Fashion item ${idx + 1}`}
            fill
            className="object-cover"
          />
        </motion.div>
      ))}

      {/* Center Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          viewport={{ once: true }}
          className="inline-block border-2 border-[#C9B99A] bg-[#C9B99A] px-4 py-1.5"
        >
          <span className="font-display font-bold text-[11px] uppercase tracking-widest text-[#0A0A0A]">
            CRAFTED FOR THE MODERN INDIAN
          </span>
        </motion.div>

        <motion.h2
          initial={{ y: 60, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          viewport={{ once: true }}
          className="font-display font-black text-[44px] md:text-[72px] text-white leading-[0.88] tracking-[-3px] mt-6"
        >
          PREMIUM FASHION
        </motion.h2>

        <motion.h2
          initial={{ y: 60, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          viewport={{ once: true }}
          className="font-display font-black text-[44px] md:text-[72px] text-[#C9B99A] leading-[0.88] tracking-[-3px]"
        >
          DELIVERED TO YOUR DOOR
        </motion.h2>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          viewport={{ once: true }}
          className="font-mono text-[14px] text-white/60 mt-6"
        >
          500+ styles • 12 categories • All India delivery • UPI accepted
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-8"
        >
          <Link
            href="/products"
            className="inline-flex items-center justify-center bg-[#C9B99A] border-2 border-[#C9B99A] shadow-[4px_4px_0px_#C9B99A] hover:bg-transparent hover:text-[#C9B99A] hover:shadow-[6px_6px_0px_#C9B99A] transition-all duration-200 h-14 px-10 font-display font-black text-[16px] uppercase text-[#0A0A0A]"
          >
            EXPLORE COLLECTION →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}