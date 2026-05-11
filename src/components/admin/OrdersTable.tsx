'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Package, Truck, MessageCircle, Phone, Eye, Copy, Check } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import toast from 'react-hot-toast';

interface Order {
  id: string;
  order_id: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  total_amount: number;
  payment_status: string;
  order_status: string;
  utr?: string;
  created_at: string;
  items?: { name: string; quantity: number; price: number }[];
  address?: string;
}

interface OrdersTableProps {
  orders: Order[];
  compact?: boolean;
  onUpdate?: () => void;
}

export function OrdersTable({ orders, compact = false, onUpdate }: OrdersTableProps) {
  const [copiedUtr, setCopiedUtr] = useState<string | null>(null);

  const copyUtr = async (utr: string) => {
    await navigator.clipboard.writeText(utr);
    setCopiedUtr(utr);
    toast.success('UTR copied!');
    setTimeout(() => setCopiedUtr(null), 1500);
  };

  const formatDate = (date: string) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const buildWhatsAppUrl = (order: Order, status: string) => {
    const msg = `Hi ${order.customer_name}! Your order #${order.order_id} has been ${status}. Thank you for shopping with Brother's Fashion Zone. 🛍️`;
    return `https://wa.me/91${order.customer_phone}?text=${encodeURIComponent(msg)}`;
  };

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="font-inter text-[14px] text-white/40">No orders found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-white/[0.02] border-b border-[#2A2A2A]">
            <th className="text-left font-inter text-[11px] text-white/30 uppercase tracking-widest p-3 px-4">#</th>
            <th className="text-left font-inter text-[11px] text-white/30 uppercase tracking-widest p-3">Order ID</th>
            {!compact && <th className="text-left font-inter text-[11px] text-white/30 uppercase tracking-widest p-3">Customer</th>}
            {!compact && <th className="text-left font-inter text-[11px] text-white/30 uppercase tracking-widest p-3">Phone</th>}
            {!compact && <th className="text-left font-inter text-[11px] text-white/30 uppercase tracking-widest p-3">Items</th>}
            <th className="text-left font-inter text-[11px] text-white/30 uppercase tracking-widest p-3">Amount</th>
            {!compact && <th className="text-left font-inter text-[11px] text-white/30 uppercase tracking-widest p-3">UTR</th>}
            <th className="text-left font-inter text-[11px] text-white/30 uppercase tracking-widest p-3">Payment</th>
            <th className="text-left font-inter text-[11px] text-white/30 uppercase tracking-widest p-3">Status</th>
            <th className="text-left font-inter text-[11px] text-white/30 uppercase tracking-widest p-3">Date</th>
            <th className="text-left font-inter text-[11px] text-white/30 uppercase tracking-widest p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, i) => (
            <motion.tr
              key={order.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="border-b border-white/[0.04] hover:bg-white/[0.025] transition-colors"
            >
              <td className="p-3 px-4 font-inter text-[12px] text-white/40">{i + 1}</td>
              <td className="p-3 font-mono text-[13px] text-[#C9B99A] font-semibold">{order.order_id}</td>
              {!compact && <td className="p-3 font-inter text-[13px] text-white font-semibold">{order.customer_name}</td>}
              {!compact && (
                <td className="p-3">
                  <a href={`tel:+91${order.customer_phone}`} className="font-inter text-[12px] text-white/60 hover:text-[#C9B99A]">
                    +91 {order.customer_phone}
                  </a>
                </td>
              )}
              {!compact && (
                <td className="p-3 font-inter text-[12px] text-white/60">
                  {order.items?.length || 1} item{order.items?.length !== 1 ? 's' : ''}
                </td>
              )}
              <td className="p-3 font-serif text-[14px] text-white">₹{order.total_amount.toLocaleString('en-IN')}</td>
              {!compact && (
                <td className="p-3">
                  {order.utr ? (
                    <div className="flex items-center gap-1">
                      <span className="font-mono text-[12px] text-white/50">{order.utr}</span>
                      <button
                        onClick={() => copyUtr(order.utr!)}
                        className="text-white/40 hover:text-white transition-colors"
                      >
                        {copiedUtr === order.utr ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
                      </button>
                    </div>
                  ) : (
                    <span className="text-white/30">—</span>
                  )}
                </td>
              )}
              <td className="p-3"><StatusBadge status={order.payment_status} /></td>
              <td className="p-3"><StatusBadge status={order.order_status} /></td>
              <td className="p-3 font-inter text-[12px] text-white/40">{formatDate(order.created_at)}</td>
              <td className="p-3">
                <div className="flex gap-1.5">
                  <button className="w-8 h-8 flex items-center justify-center border border-[#2A2A2A] rounded-md hover:bg-white/[0.08] transition-colors" title="View Details">
                    <Eye size={14} className="text-white/60" />
                  </button>
                  <a
                    href={buildWhatsAppUrl(order, order.order_status)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 flex items-center justify-center border border-[#2A2A2A] rounded-md hover:bg-white/[0.08] transition-colors"
                  >
                    <MessageCircle size={14} className="text-[#25D366]" />
                  </a>
                  <a
                    href={`tel:+91${order.customer_phone}`}
                    className="w-8 h-8 flex items-center justify-center border border-[#2A2A2A] rounded-md hover:bg-white/[0.08] transition-colors"
                  >
                    <Phone size={14} className="text-[#C9B99A]" />
                  </a>
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}