'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Search, Bell, ExternalLink } from 'lucide-react';

const pageTitles: Record<string, string> = {
  '/admin': 'Dashboard',
  '/admin/orders': 'Orders',
  '/admin/products': 'Products',
  '/admin/brands': 'Brands',
  '/admin/videos': 'Videos',
  '/admin/customers': 'Customers',
  '/admin/messages': 'Messages',
  '/admin/coupons': 'Coupons',
  '/admin/settings': 'Settings',
};

export function AdminTopbar({ pendingOrders = 0 }: { pendingOrders?: number }) {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState('');

  const getTitle = () => {
    if (pathname === '/admin') return 'Dashboard';
    for (const [path, title] of Object.entries(pageTitles)) {
      if (pathname.startsWith(path) && path !== '/admin') return title;
    }
    return 'Admin';
  };

  return (
    <>
      {/* Desktop Topbar */}
      <header className="hidden lg:flex fixed top-0 left-[240px] right-0 h-[64px] bg-[rgba(10,10,10,0.95)] backdrop-blur-md border-b border-[#1A1A1A] items-center justify-between px-6 z-30">
        {/* Left - Page Title */}
        <h1 className="font-display font-semibold text-[22px] text-white">
          {getTitle()}
        </h1>

        {/* Right - Actions */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative w-[200px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="w-full h-9 bg-[#1A1A1A] border border-[#222] rounded-lg pl-9 pr-3 text-white text-[13px] font-inter placeholder:text-white/30 focus:outline-none focus:border-[#C9B99A]"
            />
          </div>

          {/* Notifications */}
          <button className="w-9 h-9 bg-[#1A1A1A] border border-[#222] rounded-lg flex items-center justify-center relative hover:border-[#C9B99A] transition-colors">
            <Bell size={16} className="text-white/60" />
            {pendingOrders > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#DC2626] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {pendingOrders > 9 ? '9+' : pendingOrders}
              </span>
            )}
          </button>

          {/* View Store */}
          <button
            onClick={() => window.open('/', '_blank')}
            className="flex items-center gap-2 h-9 px-3 border border-[#C9B99A] text-[#C9B99A] bg-transparent rounded-lg hover:bg-[rgba(201,185,154,0.1)] transition-colors font-inter text-[12px]"
          >
            <ExternalLink size={12} />
            VIEW STORE
          </button>
        </div>
      </header>

      {/* Mobile Topbar */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-[64px] bg-[rgba(10,10,10,0.95)] backdrop-blur-md border-b border-[#1A1A1A] items-center justify-between px-4 z-30 flex">
        <h1 className="font-display font-semibold text-[20px] text-white">
          {getTitle()}
        </h1>
        
        <button
          onClick={() => window.open('/', '_blank')}
          className="flex items-center gap-1 h-8 px-2 border border-[#222] text-white/60 rounded-lg text-[11px]"
        >
          <ExternalLink size={10} />
          Store
        </button>
      </header>
    </>
  );
}