'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { OrdersTable } from '@/components/admin/OrdersTable';
import { getOrders, updateOrder } from '@/lib/db';
import toast from 'react-hot-toast';

const STATUS_TABS = ['all', 'pending', 'verified', 'dispatched', 'delivered', 'cancelled'];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchOrders();
  }, [activeTab]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await getOrders();
      setOrders(data);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (id: string, field: string, value: string) => {
    const updated = orders.map((o) => o.id === id ? { ...o, [field]: value } : o);
    setOrders(updated);
    try {
      await updateOrder(id, { [field]: value });
      toast.success('Order updated!');
    } catch (err) {
      toast.error('Update failed');
      fetchOrders();
    }
  };

  const filteredOrders = orders.filter((o) =>
    o.order_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.customer_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg font-inter text-[13px] transition-all capitalize ${
              activeTab === tab
                ? 'bg-[#C9B99A] text-black font-semibold'
                : 'bg-[#1A1A1A] text-white/50 border border-[#2A2A2A] hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by order ID or customer name..."
          className="w-full max-w-md h-10 pl-10 pr-4 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg font-inter text-[13px] text-white placeholder:text-white/30 focus:outline-none focus:border-[#C9B99A]"
        />
      </div>

      <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-2 border-[#C9B99A] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <OrdersTable orders={filteredOrders} onUpdate={fetchOrders} />
        )}
      </div>
    </div>
  );
}

function Search(props: any) {
  return (
    <svg width={props.size || 16} height={props.size || 16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}