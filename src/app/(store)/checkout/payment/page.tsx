'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronDown, ChevronUp, Copy, CheckCircle } from 'lucide-react';
import { useCartStore, CartItem } from '@/store/cartStore';
import { UTRInput } from '@/components/checkout/UTRInput';
import { addOrder } from '@/lib/db';
import gsap from 'gsap';
import confetti from 'canvas-confetti';
import { QRCodeSVG } from 'qrcode.react';

const UPI_ID = 'ashokpatela119-1@oksbi';
const UPI_NAME = 'Ashok Ashokpatel';

function StepIndicator({ current }: { current: number }) {
  const steps = [
    { num: 1, label: 'CART' },
    { num: 2, label: 'DETAILS' },
    { num: 3, label: 'PAYMENT' },
  ];

  return (
    <div className="flex items-center justify-center gap-4 mb-8">
      {steps.map((step, i) => (
        <div key={step.num} className="flex items-center gap-2">
          <div className="relative">
            {step.num < current ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-10 h-10 rounded-full bg-[#39FF14] border-2 border-black flex items-center justify-center"
              >
                <Check size={18} className="text-black" />
              </motion.div>
            ) : step.num === current ? (
              <div className="w-10 h-10 rounded-full bg-black border-2 border-black flex items-center justify-center">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="w-6 h-6 rounded-full bg-white"
                />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center">
                <span className="font-display font-bold text-[14px] text-gray-400">{step.num}</span>
              </div>
            )}
          </div>
          <span className={`font-display font-bold text-[12px] uppercase ${step.num <= current ? 'text-black' : 'text-gray-400'}`}>
            {step.label}
          </span>
          {i < steps.length - 1 && (
            <div className="w-16 h-0.5 bg-gray-200 ml-2">
              <motion.div
                className="h-full bg-[#39FF14]"
                initial={{ width: '0%' }}
                animate={{ width: step.num < current ? '100%' : '0%' }}
                transition={{ duration: 0.6 }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function QRCodeBlock({ amount }: { amount: number }) {
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600);
  const bracketRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 600));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    bracketRefs.current.forEach((el, i) => {
      if (el) {
        gsap.fromTo(el,
          { opacity: 0, scale: 0.5 },
          { opacity: 1, scale: 1, duration: 0.3, delay: i * 0.08, ease: 'back.out(1.7)' }
        );
      }
    });
  }, []);

  const copyUPI = async () => {
    await navigator.clipboard.writeText(UPI_ID);
    setCopied(true);
    confetti({
      particleCount: 40,
      spread: 50,
      origin: { x: 0.5, y: 0.5 },
      colors: ['#C9B99A', '#FFD700'],
      gravity: 1,
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const upiUrl = `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(UPI_NAME)}&am=${amount}&cu=INR`;

  return (
    <div className="bg-white border-2 border-[#0A0A0A] p-6 text-center relative overflow-hidden shadow-[4px_4px_0px_#0A0A0A]">
      <div
        className="absolute top-0 left-0 right-0 h-1 opacity-50"
        style={{
          background: 'linear-gradient(90deg, transparent, #C9B99A, transparent)',
          animation: 'scan 2s linear infinite',
        }}
      />
      <style>{`
        @keyframes scan {
          0% { top: 0; }
          100% { top: 100%; }
        }
      `}</style>

      <div className="relative inline-block mb-4">
        <div className="border-2 border-[#0A0A0A] p-2 bg-white inline-block shadow-[4px_4px_0px_#0A0A0A]">
          <QRCodeSVG
            value={upiUrl}
            size={200}
            level="H"
            includeMargin={true}
          />
        </div>
        <div
          ref={(el) => { bracketRefs.current[0] = el; }}
          className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-[#C9B99A]"
        />
        <div
          ref={(el) => { bracketRefs.current[1] = el; }}
          className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-[#C9B99A]"
        />
        <div
          ref={(el) => { bracketRefs.current[2] = el; }}
          className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-[#C9B99A]"
        />
        <div
          ref={(el) => { bracketRefs.current[3] = el; }}
          className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-[#C9B99A]"
        />
        <div
          className="absolute inset-0 border-2 border-transparent animate-pulse"
          style={{
            animation: 'pulse-border 2.5s ease-out infinite',
            boxShadow: '0 0 0 0 rgba(201, 185, 154, 0.4)',
          }}
        />
      </div>

      <p className="font-mono text-sm text-center mt-2 text-gray-600">Pay to: {UPI_NAME}</p>
      <p className="font-mono text-xs text-center text-gray-400">UPI ID: {UPI_ID}</p>

      <div className={`font-inter text-[12px] ${timeLeft < 60 ? 'text-red-500' : 'text-gray-500'}`}>
        QR expires in {formatTime(timeLeft)}
        <button
          onClick={() => setTimeLeft(600)}
          className="ml-2 text-[#6B5CE7] underline"
        >
          Reset
        </button>
      </div>

      <div className="flex items-center justify-center gap-6 mt-4">
        {['GPay', 'PhonePe', 'Paytm', 'BHIM'].map((app) => (
          <span key={app} className="font-inter text-[12px] text-gray-400 hover:grayscale-0 grayscale transition-all cursor-pointer">
            {app}
          </span>
        ))}
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-center gap-3 bg-white border border-gray-200 rounded-full px-5 py-3 inline-flex">
          <span className="text-lg">📱</span>
          <span className="font-inter text-[14px] text-gray-700">{UPI_ID}</span>
          <button
            onClick={copyUPI}
            className={`font-inter text-[13px] ${copied ? 'text-green-500' : 'text-[#6B5CE7]'} hover:text-purple-700 transition-colors`}
          >
            {copied ? '✓ Copied!' : 'Copy'}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes pulse-border {
          0% { box-shadow: 0 0 0 0 rgba(201, 185, 154, 0.4); }
          70% { box-shadow: 0 0 0 8px rgba(201, 185, 154, 0); }
          100% { box-shadow: 0 0 0 0 rgba(201, 185, 154, 0); }
        }
      `}</style>
    </div>
  );
}

function OrderSummaryPanel({ items, total, shipping }: { items: CartItem[]; total: number; shipping: number }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-[#0A0A0A] min-h-screen lg:min-h-0 lg:w-96 p-6 lg:sticky lg:top-0">
      <div className="lg:hidden">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between text-white font-display font-black text-[20px] mb-4"
        >
          Your Order
          {isExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
        </button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
            >
              <SummaryContent items={items} total={total} shipping={shipping} />
            </motion.div>
          )}
        </AnimatePresence>

        {!isExpanded && (
          <p className="font-serif text-[28px] text-white mb-2">₹{total.toLocaleString('en-IN')}</p>
        )}
      </div>

      <div className="hidden lg:block">
        <h2 className="font-serif text-[28px] text-white mb-6">Your Order</h2>
        <SummaryContent items={items} total={total} shipping={shipping} />
      </div>
    </div>
  );
}

function SummaryContent({ items, total, shipping }: { items: CartItem[]; total: number; shipping: number }) {
  const animAmountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (animAmountRef.current) {
      gsap.fromTo(animAmountRef.current,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.4, ease: 'power2.out' }
      );
    }
  }, []);

  return (
    <div>
      <div className="space-y-3 mb-6">
        {items.map((item) => (
          <div key={`${item.id}-${item.variant.size}`} className="flex items-center gap-3">
            <div className="relative w-12 h-15 border border-[#C9B99A] flex-shrink-0">
              <Image
                src={item.image || '/placeholder.jpg'}
                alt={item.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1">
              <p className="font-inter text-[13px] text-white uppercase truncate">{item.name}</p>
              <p className="font-inter text-[11px] text-white/60">{item.variant.size}</p>
            </div>
            <span className="font-inter text-[13px] text-white">₹{item.price.toLocaleString('en-IN')}</span>
          </div>
        ))}
      </div>

      <div className="border-t border-white/10 pt-4 space-y-2 font-inter text-[13px] text-white/60">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>₹{total.toLocaleString('en-IN')}</span>
        </div>
        <div className="flex justify-between">
          <span>Delivery</span>
          {shipping === 0 ? (
            <span className="text-[#39FF14]">FREE</span>
          ) : (
            <span>₹{shipping}</span>
          )}
        </div>
      </div>

      <div className="border-t border-white/10 mt-4 pt-4">
        <div ref={animAmountRef} className="flex justify-between items-center">
          <span className="font-serif text-[20px] text-white font-bold">TOTAL</span>
          <span className="font-serif text-[28px] text-white font-bold">₹{total.toLocaleString('en-IN')}</span>
        </div>
        <p className="font-inter text-[11px] text-white/40 mt-1">inclusive of all taxes</p>
      </div>

      <div className="flex items-center gap-4 mt-6 pt-4 border-t border-white/10">
        <span className="text-white/60 text-[12px]">🔒 256-bit SSL</span>
        <span className="text-white/60 text-[12px]">✅ Verified in 2h</span>
        <span className="text-white/60 text-[12px]">📦 Dispatch in 24h</span>
      </div>
    </div>
  );
}

function PaymentGuide() {
  const steps = [
    'Open GPay / PhonePe / Paytm',
    'Scan QR or enter UPI ID',
    'Enter exact amount: ₹XXXX',
    'Complete payment in your app',
    'Enter UTR number below',
  ];

  return (
    <div className="space-y-3">
      {steps.map((step, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
          className="flex items-center gap-3"
        >
          <div className="w-6 h-6 rounded-full bg-[#C9B99A] flex items-center justify-center flex-shrink-0">
            <span className="font-inter text-[12px] font-bold text-black">{i + 1}</span>
          </div>
          <span className="font-inter text-[13px] text-gray-700">{step}</span>
        </motion.div>
      ))}
    </div>
  );
}

export default function PaymentPage() {
  const { items, getTotal, clearCart } = useCartStore();
  const [UTR, setUTR] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'cod'>('upi');
  const [showSuccess, setShowSuccess] = useState(false);
  const [mobileDeepLink] = useState(
    `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(UPI_NAME)}&cu=INR`
  );
  const buttonRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const subtotal = getTotal();
  const shipping = subtotal >= 599 ? 0 : 49;
  const total = subtotal + shipping + 10;

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!buttonRef.current || !containerRef.current) return;
      const rect = buttonRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = (e.clientX - centerX) * 0.03;
      const deltaY = (e.clientY - centerY) * 0.03;
      const maxOffset = 6;
      const clampedX = Math.max(-maxOffset, Math.min(maxOffset, deltaX));
      const clampedY = Math.max(-maxOffset, Math.min(maxOffset, deltaY));
      requestAnimationFrame(() => {
        if (buttonRef.current) {
          buttonRef.current.style.transform = `translate(${clampedX}px, ${clampedY}px)`;
        }
      });
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
    }
    return () => {
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, []);

  const handleConfirm = async () => {
    if (UTR.length < 12) {
      const btn = buttonRef.current;
      if (btn) {
        gsap.to(btn, {
          x: 0,
          duration: 0.1,
          repeat: 4,
          yoyo: true,
          ease: 'none',
          onComplete: () => gsap.set(btn, { x: 0 }),
        });
      }
      return;
    }

    setIsVerifying(true);

    const orderNumber = `BFZ-${Date.now().toString().slice(-6)}`;
    const checkout = JSON.parse(localStorage.getItem('bfz_checkout') || '{}');

    try {
      await addOrder({
        orderNumber,
        customerName: checkout.fullName || 'Customer',
        phone: checkout.phone || '',
        email: checkout.email || '',
        address: checkout.address || '',
        city: checkout.city || '',
        state: checkout.state || '',
        pincode: checkout.pincode || '',
        landmark: checkout.landmark || '',
        items: items.map((item: CartItem) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          size: item.variant?.size || 'M',
          color: item.variant?.color || 'Default',
          image: item.image,
        })),
        subtotal,
        shipping,
        platformFee: 10,
        total,
        paymentMethod: 'UPI',
        utr: UTR,
        paymentStatus: 'pending',
        orderStatus: 'confirmed',
      });
    } catch (err) {
      console.error('Error saving order to Firebase:', err);
    }

    await new Promise((resolve) => setTimeout(resolve, 2000));

    if (typeof window !== 'undefined') {
      sessionStorage.setItem('order-number', orderNumber);
      localStorage.setItem('bfz_last_order', JSON.stringify({
        orderNumber,
        amount: total,
        items: items.length,
        date: new Date().toISOString(),
        customerName: checkout.fullName,
        address: checkout.address,
      }));
    }

    clearCart();
    setShowSuccess(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));
    window.location.href = `/order-confirmation?order=${orderNumber}`;
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display font-black text-3xl mb-4">YOUR CART IS EMPTY</h1>
          <Link href="/products" className="underline font-inter">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row" ref={containerRef}>
      <OrderSummaryPanel items={items} total={total} shipping={shipping} />

      <div className="flex-1 bg-[#F5F5F3] p-6 lg:p-12 pb-32 lg:pb-12">
        <div className="max-w-xl mx-auto">
          <StepIndicator current={3} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
            <div
              onClick={() => setPaymentMethod('upi')}
              style={{
                border: `2px solid ${paymentMethod === 'upi' ? '#0A0A0A' : '#E8E8E8'}`,
                background: paymentMethod === 'upi' ? '#FFD600' : '#FFFFFF',
                boxShadow: paymentMethod === 'upi' ? '3px 3px 0px #0A0A0A' : 'none',
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer',
              }}
            >
              <div style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                border: '2px solid #0A0A0A',
                background: paymentMethod === 'upi' ? '#FFD600' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                {paymentMethod === 'upi' && <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#0A0A0A' }} />}
              </div>
              <div>
                <p style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '15px', color: '#0A0A0A' }}>UPI / Online Payment</p>
                <p style={{ fontFamily: 'JetBrains Mono', fontSize: '11px', color: '#666' }}>GPay • PhonePe • Paytm • BHIM</p>
              </div>
            </div>

            <div
              onClick={() => setPaymentMethod('cod')}
              style={{
                border: `2px solid ${paymentMethod === 'cod' ? '#0A0A0A' : '#E8E8E8'}`,
                background: paymentMethod === 'cod' ? '#39FF14' : '#FFFFFF',
                boxShadow: paymentMethod === 'cod' ? '3px 3px 0px #0A0A0A' : 'none',
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer',
              }}
            >
              <div style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                border: '2px solid #0A0A0A',
                background: paymentMethod === 'cod' ? '#39FF14' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                {paymentMethod === 'cod' && <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#0A0A0A' }} />}
              </div>
              <div>
                <p style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '15px', color: '#0A0A0A' }}>Cash on Delivery (COD)</p>
                <p style={{ fontFamily: 'JetBrains Mono', fontSize: '11px', color: '#666' }}>Pay when your order arrives</p>
              </div>
            </div>
          </div>

          {paymentMethod === 'upi' && (
          <>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="mb-8 text-center"
          >
            <p className="font-serif text-[52px] text-[#1A1A1A] font-bold">
              ₹{total.toLocaleString('en-IN')}
            </p>
            <p className="font-inter text-[12px] text-gray-500">inclusive of all taxes</p>
          </motion.div>

          <QRCodeBlock amount={total} />

          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 border-t-2 border-dashed border-gray-300" />
            <span className="font-inter text-[11px] text-gray-500 uppercase tracking-widest">OR</span>
            <div className="flex-1 border-t-2 border-dashed border-gray-300" />
          </div>

          <div className="space-y-6">
            <UTRInput
              value={UTR}
              onChange={setUTR}
              onSubmit={handleConfirm}
              loading={isVerifying}
            />

            <PaymentGuide />

            <div className="lg:hidden">
              <a
                href={mobileDeepLink}
                className="w-full h-14 bg-[#1A1A1A] text-white font-inter text-[15px] font-medium flex items-center justify-center gap-2"
              >
                📱 Open GPay / PhonePe directly
              </a>
            </div>

            <div ref={containerRef}>
              <button
                ref={buttonRef}
                onClick={handleConfirm}
                disabled={isVerifying}
                className="w-full h-14 bg-[#1A1A1A] text-white font-inter text-[15px] font-medium flex items-center justify-center gap-2 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isVerifying ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                    Verifying...
                  </>
                ) : showSuccess ? (
                  <>
                    <CheckCircle size={20} />
                    Order Placed!
                  </>
                ) : (
                  'CONFIRM PAYMENT'
                )}
              </button>
            </div>
          </div>
          </>
          )}

          {paymentMethod === 'cod' && (
            <div style={{ background: '#F0FDF4', border: '2px solid #16A34A', boxShadow: '4px 4px 0px #16A34A', padding: '24px', textAlign: 'center', marginTop: '24px' }}>
              <div style={{ fontSize: '48px' }}>✅</div>
              <p style={{ fontFamily: 'Space Grotesk', fontWeight: 900, fontSize: '20px', color: '#16A34A', marginTop: '8px' }}>Cash on Delivery Selected</p>
              <p style={{ fontFamily: 'JetBrains Mono', fontSize: '14px', color: '#666', marginTop: '8px' }}>Pay ₹{total.toLocaleString('en-IN')} to the delivery partner</p>
              <p style={{ fontFamily: 'JetBrains Mono', fontSize: '12px', color: '#999', marginTop: '4px' }}>Estimated delivery: 3-5 business days</p>
              
              <button
                onClick={async () => {
                  const checkout = JSON.parse(localStorage.getItem('bfz_checkout') || '{}');
                  const orderNumber = `BFZ-${Date.now().toString().slice(-6)}`;
                  
                  try {
                    await addOrder({
                      orderNumber,
                      customerName: checkout.fullName || 'Customer',
                      phone: checkout.phone || '',
                      email: checkout.email || '',
                      address: checkout.address || '',
                      city: checkout.city || '',
                      state: checkout.state || '',
                      pincode: checkout.pincode || '',
                      landmark: checkout.landmark || '',
                      items: items.map((item: CartItem) => ({
                        id: item.id,
                        name: item.name,
                        price: item.price,
                        quantity: item.quantity,
                        size: item.variant?.size || 'M',
                        color: item.variant?.color || 'Default',
                        image: item.image,
                      })),
                      subtotal,
                      shipping,
                      platformFee: 10,
                      total,
                      paymentMethod: 'COD',
                      utr: '',
                      paymentStatus: 'pending',
                      orderStatus: 'confirmed',
                    });
                  } catch (err) {
                    console.error('Error saving COD order to Firebase:', err);
                  }
                  
                  if (typeof window !== 'undefined') {
                    sessionStorage.setItem('order-number', orderNumber);
                    localStorage.setItem('bfz_last_order', JSON.stringify({
                      orderNumber,
                      amount: total,
                      items: items.length,
                      date: new Date().toISOString(),
                      customerName: checkout.fullName,
                      address: checkout.address,
                    }));
                  }
                  
                  clearCart();
                  window.location.href = `/order-confirmation?order=${orderNumber}`;
                }}
                style={{ width: '100%', height: '56px', background: '#16A34A', color: 'white', border: '2px solid #0A0A0A', boxShadow: '4px 4px 0px #0A0A0A', fontFamily: 'Space Grotesk', fontWeight: 900, fontSize: '16px', textTransform: 'uppercase', marginTop: '20px', cursor: 'pointer' }}
              >
                CONFIRM ORDER
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}