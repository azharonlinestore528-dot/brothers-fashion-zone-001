'use client';

import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

const showcaseImages = [
  {
    src: '/images/premium-basics.jpeg',
    alt: 'Premium Basics',
    height: 'tall',
    col: 'left',
  },
  {
    src: '/images/archive-sale.jpeg',
    alt: 'Archive Sale',
    height: 'normal',
    col: 'center',
  },
  {
    src: '/images/denim-details.jpeg',
    alt: 'Denim Collection',
    height: 'tall',
    col: 'right',
  },
  {
    src: '/images/fabric-collection.jpeg',
    alt: 'Denim Details',
    height: 'normal',
    col: 'left',
  },
  {
    src: '/images/linen-collection.jpeg',
    alt: 'Linen Shirts',
    height: 'normal',
    col: 'center',
  },
  {
    src: '/images/classics-collection.jpeg',
    alt: 'Classics Collection',
    height: 'tall',
    col: 'right',
  },
  {
    src: '/images/summer-linen-pants.jpeg',
    alt: 'Linen Collection',
    height: 'normal',
    col: 'left',
  },
  {
    src: '/images/men-linen-shirts.jpeg',
    alt: 'Summer Colors',
    height: 'normal',
    col: 'right',
  },
];

interface CardProps {
  src: string;
  alt: string;
}

function TiltCard({ src, alt }: CardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    
    const rotateX = (mouseY / (rect.height / 2)) * -8;
    const rotateY = (mouseX / (rect.width / 2)) * 8;
    
    setRotate({ x: rotateX, y: rotateY });
  }, []);

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
    setIsHovered(false);
  };

  return (
    <motion.div
      ref={cardRef}
      className="showcase-card relative overflow-hidden cursor-pointer"
      style={{
        transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
        transition: isHovered ? 'none' : 'transform 0.3s ease-out',
        transformStyle: 'preserve-3d',
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative aspect-[3/4]">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover transition-transform duration-600"
          style={{ transform: isHovered ? 'scale(1.06)' : 'scale(1)' }}
        />
        
        {/* Hover Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          className="absolute inset-0 bg-black/40 flex items-center justify-center"
        >
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: isHovered ? 1 : 0 }}
              className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center mx-auto mb-2"
            >
              <Plus size={24} className="text-white" />
            </motion.div>
            <span className="font-display font-black text-[16px] uppercase text-white">
              SHOP NOW →
            </span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export function AestheticShowcase() {
  return (
    <section className="bg-[#F5F0E8] py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Masonry Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-1">
          {showcaseImages.map((img, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              className={img.height === 'tall' ? 'row-span-2' : ''}
            >
              <TiltCard src={img.src} alt={img.alt} />
            </motion.div>
          ))}
        </div>
      </div>

      <style jsx>{`
        :global(.showcase-card) {
          transform-style: preserve-3d;
          will-change: transform;
        }
      `}</style>
    </section>
  );
}