'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const REVIEWS = [
  { id: 1, name: 'Priya S.', city: 'Mumbai', rating: 5, title: 'Fabric quality is unreal', body: 'Ordered the cream kurta set for a family function. The fabric is so soft and the embroidery is clean. Delivery was faster than expected.', product: 'Cream Embroidered Kurta', avatar: '#C9B99A', date: '18 Apr 2026' },
  { id: 2, name: 'Rahul M.', city: 'Delhi', rating: 5, title: 'Finally a brand that fits well', body: 'Bought the slim-fit kurta for Diwali. The sizing chart is accurate. Stitching is solid and color has not faded after 3 washes.', product: 'Slim Fit Cotton Kurta', avatar: '#1A1A1A', date: '09 Apr 2026' },
  { id: 3, name: 'Ananya K.', city: 'Bengaluru', rating: 4, title: 'Love the packaging', body: 'The saree arrived in a beautiful cloth bag. Quality matches what they show in photos. Delivery took 6 days but the product is perfect.', product: 'Banarasi Silk Saree', avatar: '#6B7280', date: '02 Apr 2026' },
  { id: 4, name: 'Vikram P.', city: 'Hyderabad', rating: 5, title: 'Best ethnic wear online', body: 'Sherwani fabric is premium. Wore it to my cousin wedding and got so many compliments. The gold zari work is clean.', product: 'Wedding Sherwani', avatar: '#92400E', date: '8 Dec 2025' },
  { id: 5, name: 'Sneha R.', city: 'Pune', rating: 5, title: 'Size exchange was smooth', body: 'Had to exchange for a larger size. The WhatsApp support was quick to respond. Replacement reached in 3 days.', product: 'Printed Maxi Dress', avatar: '#1E3A5F', date: '5 Dec 2025' },
  { id: 6, name: 'Arjun T.', city: 'Chennai', rating: 5, title: 'Exactly as shown in photos', body: 'No color difference, no quality surprise. The indo-western jacket fits perfectly and the inner lining is comfortable.', product: 'Indo-Western Jacket', avatar: '#4A1D4A', date: '3 Dec 2025' },
  { id: 7, name: 'Meera L.', city: 'Kolkata', rating: 4, title: 'Good quality', body: 'Quality is definitely there — the cotton breathes well and stitching is neat. Pricing is slightly high but you get what you pay for.', product: 'Cotton Palazzo Set', avatar: '#C9B99A', date: '1 Dec 2025' },
  { id: 8, name: 'Rohan D.', city: 'Ahmedabad', rating: 5, title: 'Gift order arrived perfectly', body: 'Ordered as a birthday gift. They packed it really well — tissue paper, ribbon, everything. She loved it.', product: 'Chikankari Kurta', avatar: '#1A1A1A', date: '28 Nov 2025' },
];

function StarIcon({ filled = true }: { filled?: boolean }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill={filled ? '#F5A623' : '#E8E8E8'} stroke={filled ? '#F5A623' : '#E8E8E8'} strokeWidth="2">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function ReviewCard({ review }: { review: typeof REVIEWS[0] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -4 }}
      className="bg-white border-2 border-black shadow-[4px_4px_0px_#0A0A0A] p-6 transition-all duration-300 hover:shadow-[6px_6px_0px_#0A0A0A]"
    >
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center"
          style={{ backgroundColor: review.avatar }}
        >
          <span className="font-body font-semibold text-[16px] text-white">
            {review.name.slice(0, 2).toUpperCase()}
          </span>
        </div>
        <div className="flex-1">
          <p className="font-body font-semibold text-[14px] text-black">{review.name}</p>
          <p className="font-body text-[12px] text-gray-500">{review.city}</p>
        </div>
        <span className="font-body text-[11px] text-gray-400">{review.date}</span>
      </div>

      <div className="flex items-center gap-1 mb-3">
        {[1, 2, 3, 4, 5].map((star) => (
          <StarIcon key={star} filled={star <= review.rating} />
        ))}
      </div>

      <p className="font-body font-semibold text-[14px] text-black mb-2">{review.title}</p>
      <p className="font-mono text-[13px] text-gray-600 leading-[1.7] line-clamp-4">{review.body}</p>

      <div className="mt-4 flex items-center justify-between">
        <span className="font-body text-[11px] px-3 py-1.5 bg-[#F0FDF4] text-[#16A34A] border border-[#BBF7D0]">
          Verified Purchase
        </span>
        <span className="font-body text-[11px] text-gray-400 italic">{review.product}</span>
      </div>
    </motion.div>
  );
}

export function ReviewsSection() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % REVIEWS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const handleDragEnd = (offset: { x: number }) => {
    if (offset.x < -60) {
      setCurrent((prev) => (prev + 1) % REVIEWS.length);
    } else if (offset.x > 60) {
      setCurrent((prev) => (prev - 1 + REVIEWS.length) % REVIEWS.length);
    }
  };

  return (
    <section className="bg-[#F5F0E8] border-b-2 border-black py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-4">
          <div>
            <p className="font-display font-bold text-[11px] uppercase tracking-widest text-gray-500 mb-2">
              CUSTOMER REVIEWS
            </p>
            <h2 className="font-display font-black text-[36px] md:text-[48px] uppercase text-black leading-[0.9]">
              WHAT CUSTOMERS SAY
            </h2>
          </div>
          <div className="text-right">
            <p className="font-display font-black text-[28px] text-black">4.8 <span className="text-[#F5A623]">★★★★★</span></p>
            <p className="font-mono text-[12px] text-gray-500 mt-1">2,400+ reviews</p>
          </div>
        </div>

        <div
          ref={containerRef}
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[0, 1, 2].map((offset) => {
              const review = REVIEWS[(current + offset) % REVIEWS.length];
              return <ReviewCard key={review.id} review={review} />;
            })}
          </div>

          <motion.div
            drag="x"
            dragConstraints={{ left: -100, right: 100 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => handleDragEnd({ x: info.offset.x })}
            className="block md:hidden mt-6 text-center text-gray-400 text-sm cursor-grab active:cursor-grabbing"
          >
            ← Swipe to see more reviews →
          </motion.div>

          <div className="flex justify-center gap-2 mt-8">
            {REVIEWS.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className="relative"
              >
                <motion.div
                  animate={{
                    width: i === current ? 24 : 8,
                  }}
                  className={`h-2 rounded-full ${i === current ? 'bg-[#C9B99A]' : 'bg-gray-200'}`}
                  transition={{ duration: 0.3 }}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}