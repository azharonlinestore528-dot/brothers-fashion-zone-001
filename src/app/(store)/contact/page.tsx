'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { addContactMessage } from '@/lib/db';
import { FloatingInput } from '@/components/ui/FloatingInput';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addContactMessage({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        message: formData.message,
      });
      setSubmitted(true);
    } catch (err) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F0E8] py-16 md:py-24 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="font-serif text-[44px] text-[#1A1A1A] mb-2">Get in Touch</h1>
          <p className="font-inter text-[14px] text-gray-500 mb-8">We typically reply within 2 hours</p>

          <div className="space-y-4">
            <a href="mailto:brotherfashion@gmail.com" className="flex items-center gap-4 py-4 border-b border-[#E8E8E8] group">
              <div className="w-10 h-10 rounded-full bg-[#C9B99A]/20 flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C9B99A" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
              <span className="font-inter text-[14px] group-hover:text-[#C9B99A] transition-colors">brotherfashion@gmail.com</span>
            </a>

            <a href="tel:+918141001555" className="flex items-center gap-4 py-4 border-b border-[#E8E8E8] group">
              <div className="w-10 h-10 rounded-full bg-[#C9B99A]/20 flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C9B99A" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </div>
              <span className="font-inter text-[14px] group-hover:text-[#C9B99A] transition-colors">+91 81410 01555</span>
            </a>

            <a href="https://wa.me/918141001555" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 py-4 border-b border-[#E8E8E8] group">
              <div className="w-10 h-10 rounded-full bg-[#25D366]/20 flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#25D366" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <span className="font-inter text-[14px] group-hover:text-[#25D366] transition-colors">WhatsApp Chat</span>
            </a>
          </div>

          <div className="mt-8 bg-white border border-[#E8E8E8] rounded-xl p-5">
            <h3 className="font-inter text-[14px] font-semibold text-[#1A1A1A] mb-3">Business Hours</h3>
            <p className="font-inter text-[13px] text-gray-500">Mon–Sat: 10:00 AM – 7:00 PM</p>
            <p className="font-inter text-[13px] text-[#DC2626] mt-1">Sunday: Closed</p>
          </div>

          <a
            href="https://wa.me/918141001555"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 w-full h-[52px] bg-[#25D366] text-white font-inter text-[14px] font-semibold rounded-[10px] flex items-center justify-center gap-2 hover:bg-[#20BD5A] transition-colors"
          >
            💬 Chat on WhatsApp →
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white border border-[#E8E8E8] rounded-2xl p-8 md:p-10"
        >
          {submitted ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <motion.div
                initial={{ scale: 0, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 200 }}
              >
                <CheckCircle2 size={64} className="text-[#16A34A] mb-4" />
              </motion.div>
              <h3 className="font-serif text-[24px] mb-2">Message Sent! ✅</h3>
              <p className="font-inter text-[14px] text-gray-500">We'll reply within 2 hours.</p>
            </div>
          ) : (
            <>
              <h2 className="font-serif text-[28px] text-[#1A1A1A] mb-6">Send us a message</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <FloatingInput label="Full Name" autoComplete="name" {...({} as any)} onChange={(e: any) => setFormData({ ...formData, name: e.target.value })} />
                <FloatingInput label="Email" type="email" autoComplete="email" {...({} as any)} onChange={(e: any) => setFormData({ ...formData, email: e.target.value })} />
                <FloatingInput label="Phone (Optional)" type="tel" autoComplete="tel" {...({} as any)} onChange={(e: any) => setFormData({ ...formData, phone: e.target.value })} />
                <div>
                  <label className="block font-inter text-[11px] text-gray-400 mb-2">Message</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder=" "
                    rows={5}
                    className="w-full border-2 border-gray-200 focus:border-[#C9B99A] focus:shadow-[0_0_0_3px_rgba(201,185,154,0.15)] rounded-lg p-4 font-inter text-[15px] focus:outline-none resize-none"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-[52px] bg-[#1A1A1A] text-white font-inter text-[15px] font-semibold rounded-[10px] hover:bg-[#2A2A2A] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }} className="w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                      Sending...
                    </>
                  ) : (
                    'Send Message'
                  )}
                </button>
              </form>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}