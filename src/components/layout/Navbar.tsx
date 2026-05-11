'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Search, Heart, ShoppingBag, User, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';

const NAV_LINKS = [
  { label: 'Men', href: '/category/men', megamenu: ['Kurtas', 'Sherwani', 'Blazers', 'Kurtas', 'Nehru Jackets', 'Pajamas'] },
  { label: 'Women', href: '/category/women', megamenu: ['Sarees', 'Lehengas', 'Blouses', 'Kurtis', 'Palazzos', 'Dupatta'] },
  { label: 'Kids', href: '/category/kids', megamenu: ['Boys Kurta', 'Girls Lehenga', 'Kids Sherwani', 'Kids Blazers'] },
  { label: 'Footwear', href: '/category/footwear', megamenu: ['Mojaris', 'Sandals', 'Kolhapuri', 'Juttis', 'Sneakers'] },
  { label: 'Watches', href: '/category/watches', megamenu: ['Analog', 'Digital', 'Smart', 'Luxury', 'Casual'] },
  { label: 'Bags', href: '/category/bags', megamenu: ['Messenger', 'Clutch', 'Potli', 'Backpacks', 'Totes'] },
  { label: 'Accessories', href: '/category/accessories', megamenu: ['Safaa', 'Mala', 'Cufflinks', 'Pocket Square', 'Tie Pin'] },
  { label: 'Sale', href: '/sale', megamenu: ['Upto 50% OFF', 'New Arrivals', 'Best Sellers', 'Clearance'] },
];

const MEGA_MENU_CATEGORIES = [
  ['Kurtas', 'Sherwani', 'Blazers', 'Nehru Jackets', 'Pajamas', 'Dhotis'],
  ['Sarees', 'Lehengas', 'Blouses', 'Kurtis', 'Palazzos', 'Dupatta'],
  ['Boys Kurta', 'Girls Lehenga', 'Kids Sherwani', 'Kids Blazers'],
  ['Mojaris', 'Sandals', 'Kolhapuri', 'Juttis', 'Sneakers'],
  ['Analog', 'Digital', 'Smart', 'Luxury', 'Casual'],
  ['Messenger', 'Clutch', 'Potli', 'Backpacks', 'Totes'],
  ['Safaa', 'Mala', 'Cufflinks', 'Pocket Square', 'Tie Pin'],
  ['Upto 50% OFF', 'New Arrivals', 'Best Sellers', 'Clearance'],
];

export function Navbar() {
  const pathname = usePathname();
  const { getItemCount } = useCartStore();
  const { productIds } = useWishlistStore();
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [logoUrl] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const navbarRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setActiveMenu(null);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
      setSearchOpen(false);
      setSearchQuery('');
    }
  }, [searchQuery]);

  const cartCount = getItemCount();
  const wishlistCount = productIds.length;

  const topPosition = 'var(--announcement-height, 44px)';

  return (
    <>
      <nav
        ref={navbarRef}
        className={`fixed left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'h-[60px] bg-white/95 backdrop-blur-md border-b-2 border-black shadow-lg'
            : 'h-[72px] bg-white border-b-2 border-transparent'
        }`}
        style={{ top: topPosition }}
      >
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            {logoUrl ? (
              <Image
                src={logoUrl}
                alt="Brother's Fashion Zone"
                width={120}
                height={40}
                style={{ objectFit: 'contain' }}
              />
            ) : (
              <>
                <Image
                  src="/images/brothers-logo.jpeg"
                  alt="Brother's Fashion Zone"
                  width={44}
                  height={44}
                  className="rounded-full object-cover"
                />
                <span className="font-display font-black text-lg uppercase tracking-wide">
                  Brother&apos;s Fashion Zone
                </span>
                <span className="w-[6px] h-[6px] bg-pink-500 inline-block ml-1" />
              </>
            )}
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <div
                key={link.label}
                className="relative"
                onMouseEnter={() => setActiveMenu(link.label)}
                onMouseLeave={() => setActiveMenu(null)}
              >
                <Link
                  href={link.href}
                  className={`px-3 py-2 text-[13px] uppercase tracking-wide font-inter transition-all duration-150 hover:bg-yellow-400 ${
                    pathname === link.href ? 'bg-black text-white font-bold' : ''
                  }`}
                >
                  {link.label}
                </Link>

                <AnimatePresence>
                  {activeMenu === link.label && (
                    <motion.div
                      initial={{ y: -8, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -8, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-1/2 -translate-x-1/2 w-[800px] bg-white border-t-3 border-amber-200 shadow-xl p-10"
                    >
                      <div className="grid grid-cols-3 gap-8">
                        {MEGA_MENU_CATEGORIES[NAV_LINKS.indexOf(link)]?.map((cat) => (
                          <Link
                            key={cat}
                            href={`/category/${cat.toLowerCase().replace(/ /g, '-')}`}
                            className="text-[14px] font-inter text-gray-700 hover:text-amber-600 transition-colors"
                          >
                            {cat}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden md:block relative">
              <AnimatePresence>
                {searchOpen && (
                  <motion.form
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 280, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    onSubmit={handleSearch}
                    className="absolute right-full mr-2"
                  >
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search products..."
                      className="w-full h-10 px-4 border-2 border-black font-inter text-sm focus:outline-none"
                      autoFocus
                    />
                  </motion.form>
                )}
              </AnimatePresence>
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="w-10 h-10 flex items-center justify-center border-2 border-black shadow-[2px_2px_0px_#0A0A0A] hover:bg-yellow-400 transition-colors"
                aria-label="Search"
              >
                <Search size={18} />
              </button>
            </div>

            <Link
              href="/wishlist"
              className="relative w-10 h-10 flex items-center justify-center border-2 border-black shadow-[2px_2px_0px_#0A0A0A] hover:bg-yellow-400 transition-colors"
              aria-label="Wishlist"
            >
              <Heart size={18} />
              {mounted && wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-pink-500 text-white text-[10px] font-inter flex items-center justify-center border border-black">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link
              href="/cart"
              className="relative w-10 h-10 flex items-center justify-center border-2 border-black shadow-[2px_2px_0px_#0A0A0A] hover:bg-yellow-400 transition-colors"
              aria-label="Cart"
            >
              <ShoppingBag size={18} />
              {mounted && cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-pink-500 text-white text-[10px] font-inter flex items-center justify-center border border-black">
                  {cartCount}
                </span>
              )}
            </Link>

            <Link
              href="/auth/login"
              className="w-10 h-10 flex items-center justify-center border-2 border-black shadow-[2px_2px_0px_#0A0A0A] hover:bg-yellow-400 transition-colors"
              aria-label="Account"
            >
              <User size={18} />
            </Link>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden w-10 h-10 flex items-center justify-center border-2 border-black shadow-[2px_2px_0px_#0A0A0A] hover:bg-yellow-400 transition-colors"
              aria-label="Menu"
            >
              <motion.div
                animate={{ rotate: mobileOpen ? 45 : 0 }}
                transition={{ duration: 0.2 }}
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </motion.div>
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-40 bg-black lg:hidden pt-[calc(var(--announcement-height,44px)+72px)]"
          >
            <div className="flex flex-col p-6">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="block py-4 text-[36px] font-display font-black text-white border-b-2 border-white/10 hover:bg-white/5 transition-colors"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
