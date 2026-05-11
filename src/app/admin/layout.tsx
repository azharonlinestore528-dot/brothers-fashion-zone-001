'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminTopbar } from '@/components/admin/AdminTopbar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);
  const [pendingOrders] = useState(0);
  const [unreadMessages] = useState(0);

  useEffect(() => {
    if (pathname === '/admin/login') {
      setChecking(false);
      return;
    }

    const cookieAuth = typeof window !== 'undefined' && document.cookie.includes('bfz_admin_auth=true');
    const localAuth = typeof window !== 'undefined' && localStorage.getItem('bfz_admin_auth') === 'true';

    if (!cookieAuth && !localAuth) {
      router.replace('/admin/login');
    } else {
      setChecking(false);
    }
  }, [pathname, router]);

  if (checking && pathname !== '/admin/login') {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-[#C9B99A] border-t-transparent rounded-full animate-spin" style={{ borderRadius: '0 !important' }} />
          <p className="text-white/60 font-inter text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] overflow-hidden">
      <AdminSidebar pendingOrders={pendingOrders} unreadMessages={unreadMessages} />
      <AdminTopbar pendingOrders={pendingOrders} />
      <main className="ml-0 lg:ml-[240px] min-h-screen p-4 lg:p-8 pb-24 lg:pb-8">
        {children}
      </main>
      
      {/* Mobile Bottom Tab Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#0A0A0A] border-t border-[#1A1A1A] px-2 py-2 z-40 pb-safe">
        <div className="flex justify-around items-center">
          <MobileTab href="/admin" icon="📊" label="Dashboard" active={pathname === '/admin'} />
          <MobileTab href="/admin/orders" icon="📦" label="Orders" active={pathname === '/admin/orders'} badge={pendingOrders} />
          <MobileTab href="/admin/products" icon="🏷️" label="Products" active={pathname === '/admin/products'} />
          <MobileTab href="/admin/settings" icon="⚙️" label="Settings" active={pathname === '/admin/settings'} />
        </div>
      </div>

      <style jsx global>{`
        .pb-safe { padding-bottom: env(safe-area-inset-bottom, 12px); }
      `}</style>
    </div>
  );
}

function MobileTab({ href, icon, label, active, badge }: { href: string; icon: string; label: string; active?: boolean; badge?: number }) {
  return (
    <a href={href} className={`flex flex-col items-center gap-1 px-3 py-2 min-w-[64px] ${active ? 'text-[#C9B99A]' : 'text-white/40'}`}>
      <span className="relative">
        <span className="text-lg">{icon}</span>
        {badge && badge > 0 && (
          <span className="absolute -top-1 -right-2 bg-[#DC2626] text-white text-[10px] px-1 rounded-full">{badge}</span>
        )}
      </span>
      <span className="text-[10px] font-inter">{label}</span>
    </a>
  );
}