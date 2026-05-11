'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

export function HeroSection() {
  return (
    <section className="relative w-full min-h-[75vh] md:h-[92vh] md:min-h-[700px] lg:h-[92vh] overflow-hidden">
      {/* Background Image */}
      <Image
        src="/images/premium-basics.jpeg"
        alt="Premium Fashion Collection"
        fill
        className="object-cover object-center"
        priority
        quality={90}
      />

      {/* Dark Gradient Overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to right, rgba(0,0,0,0.75) 40%, rgba(0,0,0,0.2) 100%)',
        }}
      />

      {/* Content - Left Aligned */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-2xl px-6 md:px-12 lg:px-20">
          {/* Small Label */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <span className="inline-block text-white text-xs tracking-[0.3em] uppercase font-medium mb-4 md:mb-6">
              India&apos;s Premium Fashion
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-white font-display font-black leading-[0.9] mb-6"
            style={{
              fontSize: 'clamp(3rem, 8vw, 7rem)',
              letterSpacing: '-0.02em',
            }}
          >
            WEAR THE STYLE.
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="text-white/80 text-base md:text-lg font-body mb-8 md:mb-10"
          >
            Premium Fashion • Delivered Across India
          </motion.p>

          {/* Buttons - Side by Side */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-3 md:gap-4"
          >
            {/* Shop Now Button - White bg, black text */}
            <Link
              href="/products"
              className="inline-flex items-center justify-center h-12 md:h-14 px-6 md:px-10 bg-white text-black font-display font-bold text-sm md:text-base uppercase tracking-wide transition-all duration-200 ease hover:bg-gray-100"
            >
              Shop Now
            </Link>

            {/* View Sale Button - Transparent, white border */}
            <Link
              href="/sale"
              className="inline-flex items-center justify-center h-12 md:h-14 px-6 md:px-10 border-2 border-white text-white font-display font-bold text-sm md:text-base uppercase tracking-wide transition-all duration-200 ease hover:bg-white hover:text-black"
            >
              View Sale →
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}