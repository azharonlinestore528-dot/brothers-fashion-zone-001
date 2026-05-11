'use client';

import { motion } from 'framer-motion';

const HASHTAGS = [
  { text: '#SHOPBFZ', href: 'https://www.instagram.com/explore/tags/shopbfz/', bg: '#6B5CE7', color: 'white' },
  { text: '#ETHNICWEAR', href: 'https://www.instagram.com/explore/tags/ethnicwear/', bg: '#FFD600', color: 'black' },
  { text: '#PREMIUMFASHION', href: 'https://www.instagram.com/explore/tags/premiumfashion/', bg: '#FF2D6B', color: 'white' },
  { text: '#STYLEFORALL', href: 'https://www.instagram.com/explore/tags/styleforall/', bg: '#FFFFFF', color: 'black' },
];

export function MarketplaceSection() {
  return (
    <section className="relative overflow-hidden bg-green-400 border-b-2 border-black py-12 px-6">
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: 'radial-gradient(#0A0A0A 1px, transparent 1px)',
          backgroundSize: '20px 20px',
          backgroundColor: '#39FF14',
          opacity: 0.4,
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="inline-block border-2 border-black bg-black px-3 py-1 mb-5">
          <span className="font-display font-bold text-[11px] uppercase tracking-widest text-white">
            INDIA&apos;S FASHION MARKETPLACE
          </span>
        </div>

        <h2 className="font-display font-black text-4xl md:text-5xl lg:text-6xl text-black leading-[0.9]">
          THE FASHION
        </h2>
        <h2 className="font-display font-black text-4xl md:text-5xl lg:text-6xl text-purple-500 leading-[0.9]">
          MARKETPLACE
        </h2>
        <h2 className="font-display font-black text-4xl md:text-5xl lg:text-6xl text-black leading-[0.9]">
          REVOLUTION
        </h2>

        <div className="border-t-[4px] border-black w-20 mt-6" />

        <div className="bg-white border-2 border-black p-6 mt-8">
          <h3 className="font-display font-black text-lg md:text-xl uppercase text-black mb-4">
            INDIA&apos;S BEST FASHION STORE
          </h3>
          <p className="font-mono text-[13px] text-black leading-relaxed">
            Welcome to Brother&apos;s Fashion Zone — India&apos;s curated fashion marketplace where you can find premium clothing, ethnic wear, footwear, and accessories. Discover verified quality pieces from trusted collections in one place.
          </p>
          <p className="font-mono text-[13px] text-black leading-relaxed mt-3">
            Every item on our platform is quality-checked. Join thousands choosing conscious fashion — save money, look great, and discover the best fashion store in India.
          </p>
        </div>

        <div className="flex flex-col gap-2.5 mt-6">
          {HASHTAGS.map((tag, idx) => (
            <motion.a
              key={tag.text}
              href={tag.href}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ x: -20, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ x: 4, boxShadow: '0px 0px 0px #0A0A0A' }}
              className="inline-block border-2 border-black text-[13px] font-display font-black uppercase px-4 py-2 shadow-[3px_3px_0px_#0A0A0A] transition-all duration-200"
              style={{ backgroundColor: tag.bg, color: tag.color }}
            >
              {tag.text}
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
