'use client';

import Link from 'next/link';
import Image from 'next/image';
import { MessageCircle } from 'lucide-react';

const InstagramIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.141c-3.718 0-6.726 3.008-6.726 6.726 0 3.719 3.008 6.726 6.726 6.726s6.726-3.007 6.726-6.726c0-3.718-3.008-6.726-6.726-6.726zm0 10.468c-2.456 0-4.445-1.989-4.445-4.445s1.989-4.445 4.445-4.445 4.445 1.989 4.445 4.445-1.989 4.445-4.445 4.445zm6.726-11.616c0 2.456-1.989 4.445-4.445 4.445s-4.445-1.989-4.445-4.445 1.989-4.445 4.445-4.445 4.445 1.989 4.445 4.445z"/>
  </svg>
);

const COMPANY_LINKS = [
  { label: 'About Us', href: '/about' },
  { label: 'Products', href: '/products' },
  { label: 'New Arrivals', href: '/products?filter=new' },
  { label: 'Blog', href: '/blog' },
];
const SUPPORT_LINKS = [
  { label: 'Contact Us', href: '/contact' },
  { label: 'Returns & Refunds', href: '/returns' },
  { label: 'Shipping Policy', href: '/shipping' },
  { label: 'FAQ', href: '/#faq' },
];
const QUICK_LINKS = ['Men', 'Women', 'Ethnic', 'Western', 'Accessories', 'Sale'];

export function Footer() {
  return (
    <footer className="bg-white border-t-4 border-black">
      <div className="h-1.5 w-full" style={{
        background: 'linear-gradient(90deg, #FF2D6B 0%, #FFD600 25%, #39FF14 50%, #6B5CE7 75%, #FF2D6B 100%)',
      }} />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <Image
              src="/images/brothers-logo.jpeg"
              alt="Brother's Fashion Zone"
              width={60}
              height={60}
              className="rounded-full object-cover"
            />
            <h2 className="font-display font-black italic text-3xl text-black">
              BROTHER&apos;S FASHION ZONE.
            </h2>
          </div>
          <div className="border-l-4 border-yellow-400 pl-4 mt-4">
            <p className="font-mono text-[13px] text-black leading-relaxed">
              Elevating Your Everyday Style — From Nani Daman to All India
            </p>
          </div>
          <div className="flex gap-3 mt-6">
            <a href="https://www.instagram.com/brothers_fashion_zone_" target="_blank" rel="noopener noreferrer" className="w-12 h-12 border-2 border-black shadow-[3px_3px_0px_#0A0A0A] flex items-center justify-center hover:bg-yellow-400 transition-colors">
              <InstagramIcon />
            </a>
            <a href="https://wa.me/918141001555" target="_blank" rel="noopener noreferrer" className="w-12 h-12 border-2 border-black shadow-[3px_3px_0px_#0A0A0A] flex items-center justify-center hover:bg-yellow-400 transition-colors">
              <MessageCircle size={20} className="text-black" />
            </a>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <span className="inline-block bg-black text-white font-display font-bold text-[11px] uppercase border-2 border-black px-3 py-1 mb-4">
              COMPANY
            </span>
            {COMPANY_LINKS.map((link) => (
              <Link key={link.label} href={link.href} className="block font-mono text-[13px] text-black py-1.5 hover:text-[#C9B99A] transition-colors">
                {link.label}
              </Link>
            ))}
          </div>
          <div>
            <span className="inline-block bg-black text-white font-display font-bold text-[11px] uppercase border-2 border-black px-3 py-1 mb-4">
              SUPPORT & LEGAL
            </span>
            {SUPPORT_LINKS.map((link) => (
              <Link key={link.label} href={link.href} className="block font-mono text-[13px] text-black py-1.5 hover:text-[#C9B99A] transition-colors">
                {link.label}
              </Link>
            ))}
          </div>
          <div>
            <span className="inline-block bg-black text-white font-display font-bold text-[11px] uppercase border-2 border-black px-3 py-1 mb-4">
              QUICK LINKS
            </span>
            {QUICK_LINKS.map((link) => (
              <Link key={link} href={`/category/${link.toLowerCase()}`} className="block font-mono text-[13px] text-black py-1.5 hover:text-[#C9B99A] transition-colors">
                {link}
              </Link>
            ))}
          </div>
          <div>
            <span className="inline-block bg-black text-white font-display font-bold text-[11px] uppercase border-2 border-black px-3 py-1 mb-4">
              CONTACT
            </span>
            <a href="mailto:support@brothersfashionzone.com" className="block font-mono text-[13px] text-black py-1.5 hover:text-[#C9B99A] transition-colors">
              support@brothersfashionzone.com
            </a>
            <a href="tel:+918141001555" className="block font-mono text-[13px] text-black py-1.5 hover:text-[#C9B99A] transition-colors">
              +91 81410 01555
            </a>
            <p className="font-mono text-[13px] text-black py-1.5">
              Mon–Sat: 10AM – 7PM IST
            </p>
            <p className="font-mono text-[12px] text-gray-500 py-1.5">
              Jetty Road, Nani Daman<br />
              Gujarat — 396210, India
            </p>
            <a
              href="https://wa.me/918141001555"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] text-white px-4 py-2 border-2 border-black mt-2 font-mono text-[13px]"
            >
              <MessageCircle size={16} />
              WhatsApp
            </a>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6 mt-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <span className="font-mono text-[11px] text-gray-400">Buy Ethnic Wear India</span>
            <span className="font-mono text-[11px] text-gray-400">Premium Kurtas Online</span>
            <span className="font-mono text-[11px] text-gray-400">Indian Fashion Store</span>
            <span className="font-mono text-[11px] text-gray-400">Ethnic Wear Delivery</span>
            <span className="font-mono text-[11px] text-gray-400">Best Sarees India</span>
            <span className="font-mono text-[11px] text-gray-400">UK Size Footwear</span>
            <span className="font-mono text-[11px] text-gray-400">Ethnic Fashion Online</span>
            <span className="font-mono text-[11px] text-gray-400">Shop Indian Clothes</span>
          </div>
        </div>

        <div className="border-t-2 border-black pt-4 mt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-display font-bold text-[11px] uppercase text-black text-center md:text-left">
            © 2026 BROTHER&apos;S FASHION ZONE. ALL RIGHTS RESERVED.
          </p>
          <div className="flex gap-4 font-display font-bold text-[11px] uppercase text-black">
            <Link href="/privacy" className="hover:text-[#C9B99A] transition-colors">PRIVACY</Link>
            <span className="text-gray-300">|</span>
            <Link href="/terms" className="hover:text-[#C9B99A] transition-colors">TERMS</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}