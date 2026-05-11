'use client';

import { motion } from 'framer-motion';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  className?: string;
  variant?: 'light' | 'dark';
  style?: React.CSSProperties;
}

export function Skeleton({ width, height, className = '', variant = 'dark', style }: SkeletonProps) {
  const baseColor = variant === 'light' ? '#E8E8E8' : '#2A2A2A';
  const highlightColor = variant === 'light' ? '#F0F0F0' : '#3A3A3A';

  return (
    <motion.div
      className={`rounded ${className}`}
      style={{ ...style, width, height, backgroundSize: '200% 100%' }}
      animate={{
        backgroundPosition: ['200% 0', '-200% 0'],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      <div 
        className="w-full h-full"
        style={{
          background: `linear-gradient(90deg, ${baseColor} 0%, ${highlightColor} 50%, ${baseColor} 100%)`,
          backgroundSize: '200% 100%',
        }}
      />
    </motion.div>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="space-y-3">
      <div className="aspect-[4/5] bg-[#E8E8E8] rounded dark:bg-[#2A2A2A]" />
      <Skeleton height={14} className="w-3/4" variant="light" />
      <Skeleton height={12} className="w-1/2" variant="light" />
      <Skeleton height={16} className="w-1/3" variant="light" />
    </div>
  );
}

export function TableSkeleton({ rows = 8, cols = 6 }: { rows?: number; cols?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.04 }}
          className="flex gap-4 p-3"
        >
          {Array.from({ length: cols }).map((_, j) => (
            <Skeleton
              key={j}
              height={14}
              className="flex-1"
              style={{ maxWidth: `${50 + Math.random() * 50}%` }}
            />
          ))}
        </motion.div>
      ))}
    </div>
  );
}

export function ReviewCardSkeleton() {
  return (
    <div className="bg-white border border-[#E8E8E8] rounded-xl p-6 space-y-4">
      <div className="flex items-center gap-3">
        <Skeleton width={48} height={48} className="rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton height={14} className="w-1/3" />
          <Skeleton height={12} className="w-1/4" />
        </div>
      </div>
      <Skeleton height={14} className="w-2/3" />
      <Skeleton height={12} className="w-full" />
      <Skeleton height={12} className="w-5/6" />
    </div>
  );
}