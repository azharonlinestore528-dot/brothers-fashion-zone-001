'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const InstagramIcon = ({ size = 20, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.141c-3.718 0-6.726 3.008-6.726 6.726 0 3.719 3.008 6.726 6.726 6.726s6.726-3.007 6.726-6.726c0-3.718-3.008-6.726-6.726-6.726zm0 10.468c-2.456 0-4.445-1.989-4.445-4.445s1.989-4.445 4.445-4.445 4.445 1.989 4.445 4.445-1.989 4.445-4.445 4.445zm6.726-11.616c0 2.456-1.989 4.445-4.445 4.445s-4.445-1.989-4.445-4.445 1.989-4.445 4.445-4.445 4.445 1.989 4.445 4.445z"/>
  </svg>
);

function CountUp({ end, duration = 2000, suffix = '' }: { end: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isInView) {
          setIsInView(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [isInView]);

  useEffect(() => {
    if (!isInView) return;
    
    let start = 0;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    
    return () => clearInterval(timer);
  }, [isInView, end, duration]);

  return (
    <span ref={ref}>
      {count}{suffix}
    </span>
  );
}

const postImages = [
  '/images/linen-collection.jpeg',
  '/images/archive-sale.jpeg',
  '/images/premium-basics.jpeg',
  '/images/classics-collection.jpeg',
  '/images/denim-details.jpeg',
  '/images/men-linen-shirts.jpeg',
];

export function InstagramSection() {
  return (
    <section className="bg-[#0A0A0A] py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.h2
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="font-display font-black text-2xl md:text-3xl text-white text-center mb-6"
        >
          Follow Us for Daily Style Inspo
        </motion.h2>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true }}
          className="bg-[#0A0A0A] border-2 border-[#0A0A0A] shadow-[6px_6px_0px_#0A0A0A] p-8"
        >
          <div className="flex items-center gap-5 mb-6">
            <Image
              src="/images/brothers-logo.jpeg"
              alt="Brother's Fashion Zone"
              width={80}
              height={80}
              className="rounded-full object-cover flex-shrink-0 border-[3px] border-[#0A0A0A] shadow-[3px_3px_0px_#0A0A0A]"
            />
            <div>
              <p className="font-display font-black text-[18px] text-white">BROTHER&apos;S FASHION ZONE</p>
              <p className="font-mono text-[12px] text-white/40 mt-1">E-commerce website • Elevating Your Everyday Style.</p>
              <p className="font-mono text-[12px] text-white/40 mt-1">📍 Jetty Road, Nani Daman</p>
              <p className="font-mono text-[12px] text-[#C9B99A] mt-2 font-semibold">Pan India Delivery | Prepaid Only</p>
            </div>
          </div>

          <div className="flex border-y-2 border-white/10 py-5 my-5">
            <div className="flex-1 text-center border-r border-white/10">
              <p className="font-display font-black text-[32px] text-white">
                <CountUp end={443} duration={1800} />
              </p>
              <p className="font-mono text-[11px] text-white/40 uppercase tracking-wide mt-1">Posts</p>
            </div>
            <div className="flex-1 text-center border-r border-white/10">
              <p className="font-display font-black text-[32px] text-[#C9B99A]">
                <CountUp end={533} duration={2000} />
              </p>
              <p className="font-mono text-[11px] text-white/40 uppercase tracking-wide mt-1">Followers</p>
            </div>
            <div className="flex-1 text-center">
              <p className="font-display font-black text-[32px] text-white">
                <CountUp end={1} duration={500} />
              </p>
              <p className="font-mono text-[11px] text-white/40 uppercase tracking-wide mt-1">Following</p>
            </div>
          </div>

          <a
            href="https://www.instagram.com/brothers_fashion_zone_"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full h-[52px] bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] border-2 border-[#0A0A0A] shadow-[4px_4px_0px_#0A0A0A] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_#0A0A0A] transition-all duration-200 flex items-center justify-center gap-2.5"
          >
            <InstagramIcon size={20} className="text-white" />
            <span className="font-display font-black text-[14px] uppercase text-white">FOLLOW ON INSTAGRAM</span>
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-3 gap-2 mt-8"
        >
          {postImages.map((img, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.05 }}
              className="aspect-square border-2 border-white/10 overflow-hidden cursor-pointer"
            >
              <Image src={img} alt={`Instagram post ${idx + 1}`} fill className="object-cover" sizes="(max-width: 768px) 33vw, 200px" />
            </motion.div>
          ))}
        </motion.div>

        <div className="flex justify-center gap-2 mt-8 flex-wrap">
          <span className="font-mono text-[12px] text-[#C9B99A]">#BrothersFashionZone</span>
          <span className="text-white/30">•</span>
          <span className="font-mono text-[12px] text-[#C9B99A]">#EthnicWear</span>
          <span className="text-white/30">•</span>
          <span className="font-mono text-[12px] text-[#C9B99A]">#PremiumFashion</span>
          <span className="text-white/30">•</span>
          <span className="font-mono text-[12px] text-[#C9B99A]">#IndianFashion</span>
        </div>
      </div>
    </section>
  );
}