'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  IndianRupee, ShoppingBag, Package, MessageCircle, 
  Plus, Eye, Video, ExternalLink 
} from 'lucide-react';
import { getOrders, getProducts, getContactMessages } from '@/lib/db';

interface Stats {
  totalRevenue: number;
  totalOrders: number;
  todayOrders: number;
  totalProducts: number;
  outOfStock: number;
  unreadMessages: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalRevenue: 0,
    totalOrders: 0,
    todayOrders: 0,
    totalProducts: 0,
    outOfStock: 0,
    unreadMessages: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];

        const [orders, products, messages] = await Promise.all([
          getOrders(),
          getProducts(),
          getContactMessages(),
        ]);

        const verifiedOrders = orders.filter((o: any) => o.paymentStatus === 'verified' || o.payment_status === 'verified');
        const totalRevenue = verifiedOrders.reduce((sum: number, o: any) => sum + (o.totalAmount || o.total_amount || 0), 0);
        
        const todayCount = orders.filter((o: any) => {
          const createdAt = o.createdAt?.toDate ? o.createdAt.toDate() : o.created_at;
          return createdAt && createdAt.toString().startsWith(today);
        }).length;
        
        const outOfStockCount = products.filter((p: any) => (p.totalStock || p.total_stock) === 0).length;

        setStats({
          totalRevenue,
          totalOrders: orders.length,
          todayOrders: todayCount,
          totalProducts: products.length,
          outOfStock: outOfStockCount,
          unreadMessages: messages.filter((m: any) => !m.isRead && !m.is_read).length,
        });
      } catch (err) {
        console.warn('Could not fetch stats');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    { 
      label: 'Total Revenue', 
      value: stats.totalRevenue, 
      icon: '₹', 
      iconBg: 'rgba(201,185,154,0.15)', 
      isCurrency: true,
      change: '+12%',
      changeType: 'positive'
    },
    { 
      label: 'Total Orders', 
      value: stats.totalOrders, 
      icon: '📦', 
      iconBg: 'rgba(37,99,235,0.15)', 
      sub: `${stats.todayOrders} today`,
      change: '+5%',
      changeType: 'positive'
    },
    { 
      label: 'Products', 
      value: stats.totalProducts, 
      icon: '🏷️', 
      iconBg: 'rgba(34,197,94,0.15)', 
      sub: `${stats.outOfStock} out of stock`,
      change: '-2%',
      changeType: 'negative'
    },
    { 
      label: 'Messages', 
      value: stats.unreadMessages, 
      icon: '💬', 
      iconBg: 'rgba(124,58,237,0.15)', 
      sub: 'Reply via WhatsApp',
      change: '+8%',
      changeType: 'positive'
    },
  ];

  const quickActions = [
    { 
      label: 'Add Product', 
      icon: '📦', 
      href: '/admin/products',
      bg: 'rgba(201,185,154,0.08)',
      border: 'rgba(201,185,154,0.2)',
      text: 'Add a new product'
    },
    { 
      label: 'View Orders', 
      icon: '🛍️', 
      href: '/admin/orders',
      bg: 'rgba(37,99,235,0.08)',
      border: 'rgba(37,99,235,0.2)',
      text: 'Manage orders'
    },
    { 
      label: 'Upload Video', 
      icon: '🎬', 
      href: '/admin/videos',
      bg: 'rgba(124,58,237,0.08)',
      border: 'rgba(124,58,237,0.2)',
      text: 'Add promotional video'
    },
    { 
      label: 'WhatsApp', 
      icon: '💚', 
      href: 'https://wa.me/918141001555',
      bg: 'rgba(37,211,102,0.08)',
      border: 'rgba(37,211,102,0.2)',
      text: 'Contact customers'
    },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-[#111111] border border-[#1A1A1A] rounded-xl p-5 hover:border-[#C9B99A]/30 transition-all duration-300 group"
          >
            <div className="flex items-start justify-between mb-4">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ background: stat.iconBg }}
              >
                <span className="text-lg">{stat.icon}</span>
              </div>
              {stat.change && (
                <span className={`text-[12px] font-inter ${stat.changeType === 'positive' ? 'text-green-400' : 'text-red-400'}`}>
                  {stat.change}
                </span>
              )}
            </div>
            
            <p className="text-white font-display text-[36px] font-bold leading-none">
              {loading ? '...' : stat.isCurrency ? `₹${(stat.value / 1000).toFixed(1)}k` : stat.value}
            </p>
            <p className="text-white/40 font-inter text-[12px] uppercase tracking-wider mt-2">{stat.label}</p>
            {stat.sub && (
              <p className="text-white/30 font-inter text-[11px] mt-1">{stat.sub}</p>
            )}
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-white font-display text-[20px] font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, i) => (
            <motion.div
              key={action.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + i * 0.1 }}
            >
              {action.href.startsWith('http') ? (
                <a
                  href={action.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-4 rounded-xl border transition-all hover:scale-[1.02]"
                  style={{ background: action.bg, borderColor: action.border }}
                >
                  <div className="text-2xl mb-2">{action.icon}</div>
                  <p className="text-white font-inter text-[14px] font-medium">{action.label}</p>
                  <p className="text-white/40 font-inter text-[12px] mt-1">{action.text}</p>
                </a>
              ) : (
                <Link
                  href={action.href}
                  className="block p-4 rounded-xl border transition-all hover:scale-[1.02]"
                  style={{ background: action.bg, borderColor: action.border }}
                >
                  <div className="text-2xl mb-2">{action.icon}</div>
                  <p className="text-white font-inter text-[14px] font-medium">{action.label}</p>
                  <p className="text-white/40 font-inter text-[12px] mt-1">{action.text}</p>
                </Link>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Store Link */}
      <div className="bg-[#111111] border border-[#1A1A1A] rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white font-display text-[18px] font-semibold">View Live Store</h3>
            <p className="text-white/40 font-inter text-[13px] mt-1">See how your store looks to customers</p>
          </div>
          <button
            onClick={() => window.open('/', '_blank')}
            className="flex items-center gap-2 h-10 px-4 border border-[#C9B99A] text-[#C9B99A] rounded-lg font-inter text-[13px] hover:bg-[rgba(201,185,154,0.1)] transition-colors"
          >
            <ExternalLink size={14} />
            OPEN STORE
          </button>
        </div>
      </div>
    </div>
  );
}