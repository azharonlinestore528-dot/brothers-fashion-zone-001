'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface StatsCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  iconBg: string;
  sub?: string;
  change?: string;
  isCurrency?: boolean;
  delay?: number;
}

function useCountUp(target: number, duration: number = 1800) {
  const [count, setCount] = useState(0);
  const startTime = useRef<number | null>(null);
  const animationRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const animate = (timestamp: number) => {
      if (!startTime.current) startTime.current = timestamp;
      const progress = Math.min((timestamp - startTime.current) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeOut * target));
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [target, duration]);

  return count;
}

export function StatsCard({ label, value, icon, iconBg, sub, change, isCurrency, delay = 0 }: StatsCardProps) {
  const count = useCountUp(value);

  const formatValue = (n: number) => {
    if (isCurrency) return `₹${n.toLocaleString('en-IN')}`;
    return n.toLocaleString('en-IN');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ borderColor: '#C9B99A' }}
      className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-5 transition-colors"
    >
      <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3" style={{ backgroundColor: iconBg }}>
        <span className="text-[20px]">{icon}</span>
      </div>
      <p className="font-serif text-[32px] text-white font-bold">{formatValue(count)}</p>
      <p className="font-inter text-[11px] text-white/40 uppercase tracking-wider mt-1">{label}</p>
      {sub && <p className="font-inter text-[12px] text-white/50 mt-2">{sub}</p>}
      {change && (
        <p className={`font-inter text-[12px] mt-2 ${change.startsWith('+') ? 'text-[#16A34A]' : 'text-[#DC2626]'}`}>
          {change}
        </p>
      )}
    </motion.div>
  );
}