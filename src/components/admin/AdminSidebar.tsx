'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, ShoppingBag, Package, Tag, Video, 
  Users, MessageCircle, Percent, Settings, LogOut, Grid3X3, Image, Clapperboard 
} from 'lucide-react';

const navItems = [
  { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/orders', icon: ShoppingBag, label: 'Orders' },
  { href: '/admin/products', icon: Package, label: 'Products' },
  { href: '/admin/categories', icon: Grid3X3, label: 'Categories' },
  { href: '/admin/banners', icon: Image, label: 'Banners' },
  { href: '/admin/brands', icon: Tag, label: 'Brands' },
  { href: '/admin/videos', icon: Video, label: 'Videos' },
  { href: '/admin/reels', icon: Clapperboard, label: 'Reels/Instagram' },
  { href: '/admin/customers', icon: Users, label: 'Customers' },
  { href: '/admin/messages', icon: MessageCircle, label: 'Messages' },
  { href: '/admin/coupons', icon: Percent, label: 'Coupons' },
  { href: '/admin/settings', icon: Settings, label: 'Settings' },
];

export function AdminSidebar({ pendingOrders = 0, unreadMessages = 0 }: { pendingOrders?: number; unreadMessages?: number }) {
  const pathname = usePathname();

  const getBadge = (href: string) => {
    if (href === '/admin/orders') return pendingOrders;
    if (href === '/admin/messages') return unreadMessages;
    return 0;
  };

  const handleSignOut = () => {
    if (typeof window !== 'undefined') {
      document.cookie = 'bfz_admin_auth=; max-age=0; path=/';
      localStorage.removeItem('bfz_admin_auth');
      window.location.href = '/admin/login';
    }
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 w-[240px] h-screen bg-[#0A0A0A] border-r border-[#1A1A1A] flex-col z-40">
        {/* Logo Section */}
        <div className="py-5 px-5 border-b border-[#1A1A1A]">
          <Link href="/admin" className="flex items-center gap-2">
            <span className="text-[#C9B99A] text-lg">◆</span>
            <span className="font-display font-black text-lg text-white">BFZ</span>
          </Link>
          <p className="text-[#C9B99A] text-[10px] uppercase tracking-widest mt-1 font-inter">ADMIN PANEL</p>
        </div>

        {/* Navigation */}
        <nav className="mt-2 px-2 flex-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
            const badge = getBadge(item.href);
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 h-11 px-4 mx-1 rounded-lg transition-all duration-150 mb-1 ${
                  isActive 
                    ? 'bg-[rgba(201,185,154,0.12)] border-l-[3px] border-[#C9B99A] text-[#C9B99A]' 
                    : 'text-white/40 hover:bg-[#1A1A1A] hover:text-white/80'
                }`}
              >
                <item.icon size={18} />
                <span className="font-inter text-[13px]">{item.label}</span>
                {badge > 0 && (
                  <span className="ml-auto bg-[#DC2626] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="border-t border-[#1A1A1A] p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#C9B99A] to-[#8B7355] flex items-center justify-center">
              <span className="text-white font-inter text-[13px] font-semibold">AP</span>
            </div>
            <div>
              <p className="text-white font-inter text-[13px]">Ashok Patel</p>
              <p className="text-[#C9B99A] font-inter text-[11px]">Administrator</p>
            </div>
          </div>
          
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-2 h-9 bg-[rgba(220,38,38,0.08)] border border-[rgba(220,38,38,0.2)] rounded-lg text-[#DC2626] hover:bg-[rgba(220,38,38,0.15)] transition-colors"
          >
            <LogOut size={14} />
            <span className="font-inter text-[13px]">Sign Out</span>
          </button>
        </div>
      </aside>

      <style jsx>{`
        aside :global(.font-display) { font-family: 'Space Grotesk', sans-serif; }
        aside :global(.font-inter) { font-family: 'Inter', sans-serif; }
      `}</style>
    </>
  );
}