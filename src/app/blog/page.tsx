'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

const ARTICLES = [
  {
    tag: 'BEGINNER',
    tagBg: '#6B5CE7',
    title: "How to Shop Ethnic Wear Online in India",
    description: "A complete guide to finding the right fabric, fit, and style for every occasion.",
    image: '/images/linen-collection.jpeg',
  },
  {
    tag: 'STYLE GUIDE',
    tagBg: '#FF2D6B',
    title: "Men's Ethnic Wear — What to Wear When",
    description: "From kurtas to sherwanis — know what works for casual and formal occasions.",
    image: '/images/classics-collection.jpeg',
  },
  {
    tag: 'TRENDING',
    tagBg: '#39FF14',
    title: 'Linen vs Cotton — Which Fabric is Better for Indian Summers?',
    description: "We break down the pros and cons of India's two most popular summer fabrics.",
    image: '/images/mens-linen-shirts.jpeg',
  },
  {
    tag: 'STYLE GUIDE',
    tagBg: '#FFD600',
    title: 'How to Style Western Casuals for Indian Weather',
    description: 'Western looks that actually work in Indian heat — lighter, cooler, still stylish.',
    image: '/images/summer-linen-pants.jpeg',
  },
];

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="h-2 w-full" style={{
        background: 'linear-gradient(90deg, #FF2D6B 0%, #FFD600 25%, #39FF14 50%, #6B5CE7 75%, #FF2D6B 100%)',
      }} />

      <div className="max-w-5xl mx-auto px-4 py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-mono text-[13px] text-gray-600 hover:text-black transition-colors mb-8"
        >
          <ArrowLeft size={16} />
          Back to Home
        </Link>

        <div className="text-center mb-12">
          <h1 className="font-display font-black text-4xl md:text-5xl text-black mb-4">
            FASHION BLOGS & GUIDES
          </h1>
          <p className="font-mono text-base text-gray-600">
            Style tips, fabric guides, and shopping advice from Brother&apos;s Fashion Zone.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ARTICLES.map((article, idx) => (
            <motion.div
              key={article.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="border-2 border-black bg-white shadow-[4px_4px_0px_#0A0A0A] hover:shadow-[6px_6px_0px_#0A0A0A] hover:-translate-y-1 transition-all duration-200 overflow-hidden"
            >
              <div className="relative h-[200px] w-full">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="p-6">
                <span
                  className={`inline-block border-2 border-black px-2 py-1 text-[10px] font-display font-bold uppercase mb-3 ${
                    article.tagBg === '#39FF14' || article.tagBg === '#FFD600' ? 'text-black' : 'text-white'
                  }`}
                  style={{ backgroundColor: article.tagBg }}
                >
                  {article.tag}
                </span>
                <h2 className="font-display font-black text-[18px] text-black mb-3 leading-tight">
                  {article.title}
                </h2>
                <p className="font-mono text-[13px] text-gray-600 leading-relaxed">
                  {article.description}
                </p>
                <button className="mt-4 font-display font-bold text-[12px] uppercase text-[#FF2D6B] hover:text-black transition-colors">
                  READ MORE →
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/products"
            className="inline-block bg-black text-white px-8 py-4 font-display font-black text-[14px] uppercase border-2 border-black shadow-[4px_4px_0px_#FFD600] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_#FFD600] transition-all duration-200"
          >
            SHOP NOW →
          </Link>
        </div>
      </div>
    </main>
  );
}