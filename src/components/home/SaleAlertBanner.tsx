'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const endDateKey = 'saleEndDate';
    let endDate = localStorage.getItem(endDateKey);

    if (!endDate) {
      endDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
      localStorage.setItem(endDateKey, endDate);
    }

    const calculateTimeLeft = () => {
      const diff = new Date(endDate!).getTime() - Date.now();
      if (diff <= 0) {
        const newEndDate = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString();
        localStorage.setItem(endDateKey, newEndDate);
        endDate = newEndDate;
        return { days: 0, hours: 0, mins: 0, secs: 0 };
      }
      return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        mins: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        secs: Math.floor((diff % (1000 * 60)) / 1000),
      };
    };

    setTimeLeft(calculateTimeLeft());
    setIsReady(true);

    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const pad = (n: number) => n.toString().padStart(2, '0');

  return (
    <div className="flex gap-2 mt-5 justify-center">
      {[
        { value: isReady ? timeLeft.days : '--', label: 'DAYS' },
        { value: isReady ? timeLeft.hours : '--', label: 'HRS' },
        { value: isReady ? timeLeft.mins : '--', label: 'MIN' },
        { value: isReady ? timeLeft.secs : '--', label: 'SEC' },
      ].map((item, idx) => (
        <div key={idx} className="flex flex-col items-center">
          <div className="bg-white/15 border border-white/30 px-3 py-2 min-w-[50px]">
            <span className="font-mono text-[16px] text-white">{item.value}</span>
          </div>
          <span className="font-mono text-[10px] text-white/60 mt-1">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

export function SaleAlertBanner() {
  return (
    <section className="border-2 border-[#0A0A0A] shadow-[6px_6px_0px_#0A0A0A] overflow-hidden">
      <div className="flex flex-col md:flex-row">
        {/* Left - Image */}
        <div className="w-full md:w-1/2 h-[200px] md:h-[400px] relative">
          <Image
            src="/images/archive-sale.jpeg"
            alt="Sale Fashion"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/25" />
        </div>

        {/* Right - Pink Section */}
        <div className="w-full md:w-1/2 bg-[#FF2D6B] p-8 md:p-12 flex flex-col items-center justify-center text-center">
          <motion.h2
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            viewport={{ once: true }}
            className="font-display font-black text-[48px] md:text-[80px] text-white leading-[0.8] tracking-[-0.04em]"
          >
            SALE
          </motion.h2>
          
          <motion.h2
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15, delay: 0.1 }}
            viewport={{ once: true }}
            className="font-display font-black text-[48px] md:text-[80px] text-[#FFD600] leading-[0.8] tracking-[-0.04em]"
          >
            ALERT
          </motion.h2>
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-white border-[3px] border-black shadow-[4px_4px_0px_#0A0A0A] px-6 py-2.5 mt-4"
          >
            <span className="font-display font-black text-lg md:text-xl uppercase text-black">
              UP TO 60% OFF
            </span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            viewport={{ once: true }}
            className="font-mono text-[14px] text-white/80 mt-4"
          >
            Shop before it ends →
          </motion.p>

          <CountdownTimer />

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            viewport={{ once: true }}
            className="w-full mt-6"
          >
            <Link
              href="/products"
              className="inline-block w-full bg-[#FFD600] border-2 border-black shadow-[4px_4px_0px_#0A0A0A] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_#0A0A0A] transition-all duration-200 h-14 px-8 font-display font-black text-[16px] uppercase text-black"
            >
              SHOP SALE
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}