'use client';

import { useEffect, useState, Suspense, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { DeliveryTimeline } from '@/components/order/DeliveryTimeline';

function OrderConfirmationContent() {
  const [orderData, setOrderData] = useState<{
    orderNumber: string;
    amount: number;
    items: number;
    customerName?: string;
    address?: string;
  } | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  const circleRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const stored = localStorage.getItem('bfz_last_order');
    if (stored) {
      try {
        setOrderData(JSON.parse(stored));
      } catch {
        // ignore parse errors
      }
    }

    const params = new URLSearchParams(window.location.search);
    const order = params.get('order');
    if (order) {
      setOrderData((prev) => ({
        ...prev!,
        orderNumber: order,
      }));
    }

    const timer = setTimeout(() => {
      setAnimationComplete(true);
      setShowConfetti(true);
    }, 1400);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (showConfetti) {
      confetti({
        particleCount: 180,
        spread: 100,
        origin: { y: 0.35 },
        colors: ['#FFD600', '#FF2D6B', '#6B5CE7', '#39FF14', '#FFFFFF', '#C9B99A'],
        gravity: 1.2,
        scalar: 0.9,
      });
    }
  }, [showConfetti]);

  const customerName = orderData?.customerName || 'there';
  const orderNumber = orderData?.orderNumber || `BFZ-${String(Date.now()).slice(-6)}`;
  const amount = orderData?.amount || 0;
  const items = orderData?.items || 0;

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-6">
      <div className="max-w-lg w-full">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="relative w-20 h-20 mx-auto mb-8">
            <svg
              className="w-full h-full"
              viewBox="0 0 80 80"
              fill="none"
            >
              <circle
                ref={circleRef}
                cx="40"
                cy="40"
                r="36"
                stroke="#39FF14"
                strokeWidth="4"
                strokeLinecap="round"
                fill="none"
                style={{
                  strokeDasharray: 226,
                  strokeDashoffset: 226,
                  animation: 'circleDraw 0.8s ease-out forwards',
                }}
              />
              <path
                d="M25 42L35 52L55 32"
                stroke="#39FF14"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                style={{
                  strokeDasharray: 50,
                  strokeDashoffset: 50,
                  animation: animationComplete ? 'checkmarkDraw 0.4s 0.7s ease-out forwards' : 'none',
                }}
              />
            </svg>
            <style>{`
              @keyframes circleDraw {
                to { stroke-dashoffset: 0; }
              }
              @keyframes checkmarkDraw {
                to { stroke-dashoffset: 0; }
              }
            `}</style>
          </div>

          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1, duration: 0.5, ease: [0.33, 1, 0.68, 1] }}
            className="font-serif text-[36px] text-white mb-2"
          >
            Order Placed Successfully! 🎉
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="font-inter text-[16px] text-[#C9B99A]"
          >
            Thank you, {customerName}!
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.4, type: 'spring', stiffness: 300, damping: 25 }}
          className="bg-white rounded-xl p-6 mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="font-mono text-[13px] text-[#C9B99A]">
              Order #{orderNumber}
            </span>
            {amount > 0 && (
              <span className="font-serif text-[24px] text-[#1A1A1A] font-bold">
                ₹{amount.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          <div className="space-y-3 mb-4">
            {[...Array(Math.min(items, 3))].map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-xs">
                  IMG
                </div>
                <div className="flex-1">
                  <p className="font-inter text-[13px]">Product Item {i + 1}</p>
                  <p className="font-inter text-[11px] text-gray-500">Qty: 1</p>
                </div>
                <span className="font-mono text-[13px]">₹XXX</span>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-100 pt-4 mt-4">
            <p className="font-inter text-[13px] text-gray-500">
              📍 Estimated delivery: 3–5 business days
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100">
            <p className="font-inter text-[13px] text-gray-500">
              Delivering to: {orderData?.address || 'Address saved during checkout'}
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6 }}
          className="bg-[#FEF3C7] border-l-4 border-amber-500 p-4 rounded-r-lg"
        >
          <div className="flex items-start gap-3">
            <span className="text-xl">⏱</span>
            <div>
              <p className="font-inter text-[14px] font-semibold text-amber-800">
                Payment Verification Pending
              </p>
              <p className="font-inter text-[13px] text-amber-700 mt-1">
                We will verify your UPI payment within 2 hours. WhatsApp confirmation sent once verified.
              </p>
            </div>
          </div>
          <motion.div
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1 h-full bg-amber-500 absolute left-0 top-0 bottom-0"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8 }}
          className="mt-8"
        >
          <p className="font-inter text-[13px] text-gray-400 mb-4 text-center">Delivery Timeline</p>
          <DeliveryTimeline currentStep={0} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2 }}
          className="mt-8 space-y-3"
        >
          <a
            href={`https://wa.me/918141001555?text=Hi!%20My%20order%20%23${orderNumber}%20is%20placed.%20Please%20confirm%20payment.`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full h-13 bg-[#16A34A] text-white font-inter text-[14px] font-semibold flex items-center justify-center gap-2 rounded-lg hover:bg-[#15803D] transition-colors"
          >
            💬 Chat with Support on WhatsApp
          </a>

          <Link
            href="/"
            className="w-full h-13 bg-transparent border border-white text-white font-inter text-[14px] font-semibold flex items-center justify-center gap-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            Continue Shopping →
          </Link>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2 }}
          className="text-center mt-8 font-inter text-[12px] text-gray-500"
        >
          Need help?{' '}
          <Link href="/contact" className="text-[#C9B99A] hover:underline">
            Contact Support
          </Link>
        </motion.p>
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="font-serif text-white text-2xl">Loading...</div>
      </div>
    }>
      <OrderConfirmationContent />
    </Suspense>
  );
}