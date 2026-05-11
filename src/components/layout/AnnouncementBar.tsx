'use client';

import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import gsap from 'gsap';

const ROW1 = '🚚 Free Delivery above ₹599  •  ✨ New Arrivals Just Dropped  •  🏷️ Flat 25% OFF First Order  •  Use Code: FIRST25  •  👟 UK Sizes Available  •  🇮🇳 Made in India  •  💳 UPI Accepted  •  ↩️ Easy 7-Day Returns  •';
const ROW2 = '🔥 Summer Sale — Up to 50% OFF  •  👗 New Women\'s Collection Live  •  👞 Premium Footwear  •  ⌚ Watches Starting ₹999  •  👜 Bags & Accessories Sale  •  📦 Same Day Dispatch  •';

export function AnnouncementBar() {
  const [visible, setVisible] = useState(true);
  const [mounted, setMounted] = useState(false);
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !visible) {
      document.documentElement.style.setProperty('--announcement-height', '0px');
      return;
    }
    document.documentElement.style.setProperty('--announcement-height', '44px');

    const setupMarquee = (el: HTMLDivElement, direction: number, duration: number) => {
      const width = el.scrollWidth / 2;
      gsap.set(el, { x: 0 });
      gsap.to(el, {
        x: direction * -width,
        duration,
        ease: 'none',
        repeat: -1,
      });
    };

    setupMarquee(row1Ref.current!, 1, 25);
    setupMarquee(row2Ref.current!, -1, 20);

    const pauseRow1 = () => gsap.globalTimeline.pause();
    const pauseRow2 = () => gsap.globalTimeline.pause();
    const resume = () => gsap.globalTimeline.resume();

    row1Ref.current?.parentElement?.addEventListener('mouseenter', pauseRow1);
    row1Ref.current?.parentElement?.addEventListener('mouseleave', resume);
    row2Ref.current?.parentElement?.addEventListener('mouseenter', pauseRow2);
    row2Ref.current?.parentElement?.addEventListener('mouseleave', resume);

    return () => {
      gsap.killTweensOf(row1Ref.current);
      gsap.killTweensOf(row2Ref.current);
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[60] h-[44px] bg-black border-b-2 border-yellow-400 flex items-center overflow-hidden"
      style={{ height: 44 }}
    >
      <div className="absolute top-0 bottom-0 left-0 right-0 flex flex-col justify-center">
        <div
          className="relative w-[200%] overflow-hidden cursor-pointer"
          onMouseEnter={() => gsap.globalTimeline.pause()}
          onMouseLeave={() => gsap.globalTimeline.resume()}
        >
          <div ref={row1Ref} className="flex whitespace-nowrap py-1">
            {[...Array(2)].map((_, i) => (
              <span key={i} className="text-[11px] font-inter text-white uppercase tracking-widest">
                {ROW1}
              </span>
            ))}
          </div>
        </div>
        <div
          className="relative w-[200%] overflow-hidden cursor-pointer"
          onMouseEnter={() => gsap.globalTimeline.pause()}
          onMouseLeave={() => gsap.globalTimeline.resume()}
        >
          <div ref={row2Ref} className="flex whitespace-nowrap py-1">
            {[...Array(2)].map((_, i) => (
              <span key={i} className="text-[11px] font-inter text-white uppercase tracking-widest">
                {ROW2}
              </span>
            ))}
          </div>
        </div>
      </div>
      <button
        onClick={() => setVisible(false)}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
        aria-label="Close announcement"
      >
        <X size={14} />
      </button>
    </div>
  );
}
