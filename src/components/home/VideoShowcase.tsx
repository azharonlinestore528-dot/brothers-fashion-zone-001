'use client';

import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function VideoShowcase() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const isInSection = useInView(sectionRef, { amount: 0.3 });

  useEffect(() => {
    if (videoRef.current) {
      if (isInSection && isPlaying) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
      }
    }
  }, [isInSection, isPlaying]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(() => {});
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <section ref={sectionRef} className="bg-black border-b-2 border-yellow-400 py-12 px-4 md:px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="inline-block border-2 border-black bg-yellow-400 px-3 py-1">
            <span className="font-display font-bold text-[11px] uppercase tracking-widest text-black">
              BROTHER&apos;S FASHION ZONE
            </span>
          </div>
          <motion.h2
            initial={{ y: 60, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            viewport={{ once: true }}
            className="font-display font-black text-4xl md:text-6xl text-white mt-4 leading-[0.88] tracking-[-0.02em]"
          >
            STYLE IN<br />MOTION.
          </motion.h2>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-[55%]">
            <div className="relative border-[3px] border-yellow-400 shadow-[6px_6px_0px_#FFD600] overflow-hidden bg-[#1A1A1A]">
              <video
                ref={videoRef}
                className="w-full aspect-video lg:aspect-[16/9] xl:aspect-[16/10] object-cover"
                autoPlay
                muted
                loop
                playsInline
                poster="/images/video-poster.jpg"
              >
                <source src="/videos/brand-video.mp4" type="video/mp4" />
              </video>
              <div className="absolute top-4 left-4 bg-pink-500 border-2 border-black shadow-[2px_2px_0px_#0A0A0A] px-3 py-1">
                <span className="font-display font-black text-[11px] uppercase text-white">
                  WATCH NOW
                </span>
              </div>
              <button
                onClick={togglePlay}
                className="absolute bottom-4 right-4 w-12 h-12 bg-yellow-400/90 border-2 border-black shadow-[3px_3px_0px_#0A0A0A] flex items-center justify-center hover:bg-yellow-400 hover:scale-105 transition-all"
                aria-label={isPlaying ? 'Pause video' : 'Play video'}
              >
                {isPlaying ? <Pause size={20} className="text-black" /> : <Play size={20} className="text-black" />}
              </button>
              <button
                onClick={toggleMute}
                className="absolute bottom-4 left-4 w-12 h-12 bg-yellow-400/90 border-2 border-black shadow-[3px_3px_0px_#0A0A0A] flex items-center justify-center hover:bg-yellow-400 hover:scale-105 transition-all"
                aria-label={isMuted ? 'Unmute video' : 'Mute video'}
              >
                {isMuted ? <VolumeX size={20} className="text-black" /> : <Volume2 size={20} className="text-black" />}
              </button>
            </div>

            <div className="flex gap-3 mt-6 overflow-x-auto pb-2 scrollbar-hide">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-[140px] lg:w-[160px] flex-shrink-0 aspect-[9/16] border-2 border-yellow-400 shadow-[3px_3px_0px_#FFD600] relative overflow-hidden bg-[#1A1A1A] cursor-pointer group"
                >
                  <video
                    className="w-full h-full object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                  >
                    <source src="/videos/brand-video.mp4" type="video/mp4" />
                  </video>
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="font-display font-black text-[16px] uppercase text-white">PLAY</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:w-[45%] flex flex-col gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
              className="bg-yellow-400 border-2 border-black shadow-[4px_4px_0px_#0A0A0A] p-6"
            >
              <span className="font-display font-black text-[11px] uppercase tracking-widest text-black block mb-2">
                FEATURED COLLECTION
              </span>
              <h3 className="font-display font-black text-2xl md:text-3xl text-black leading-[0.95]">
                New Season Drops
              </h3>
              <p className="font-mono text-[13px] text-black mt-2 leading-relaxed">
                Premium ethnic & western wear — crafted for the modern Indian.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              viewport={{ once: true }}
              className="bg-purple-500 border-2 border-black shadow-[4px_4px_0px_#0A0A0A] p-6"
            >
              <div className="flex justify-between border-b border-white/20 pb-2.5">
                <div>
                  <span className="font-display font-black text-2xl text-white">500+</span>
                  <p className="font-mono text-[11px] text-white/70 uppercase">STYLES IN STORE</p>
                </div>
                <div>
                  <span className="font-display font-black text-2xl text-yellow-400">4.8★</span>
                  <p className="font-mono text-[11px] text-white/70 uppercase">CUSTOMER RATING</p>
                </div>
                <div>
                  <span className="font-display font-black text-2xl text-green-400">24H</span>
                  <p className="font-mono text-[11px] text-white/70 uppercase">DISPATCH TIME</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              viewport={{ once: true }}
              className="bg-white border-2 border-black shadow-[4px_4px_0px_#0A0A0A] p-6"
            >
              <button
                onClick={() => router.push('/products')}
                className="w-full h-12 bg-black border-2 border-black font-display font-black text-[14px] uppercase text-white hover:bg-yellow-400 hover:text-black transition-all duration-200"
              >
                SHOP THE LOOK →
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
