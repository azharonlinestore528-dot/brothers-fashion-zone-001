'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setCustomers([]);
    } catch (err) {
      console.error('Error fetching customers:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-[24px] text-white">Customers</h2>
      </div>

      <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-2 border-[#C9B99A] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : customers.length === 0 ? (
          <div className="text-center py-12">
            <p className="font-inter text-[14px] text-white/40">No customers yet</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-white/[0.02] border-b border-[#2A2A2A]">
                <th className="text-left font-inter text-[11px] text-white/30 uppercase tracking-widest p-3">Avatar</th>
                <th className="text-left font-inter text-[11px] text-white/30 uppercase tracking-widest p-3">Name</th>
                <th className="text-left font-inter text-[11px] text-white/30 uppercase tracking-widest p-3">Email</th>
                <th className="text-left font-inter text-[11px] text-white/30 uppercase tracking-widest p-3">Phone</th>
                <th className="text-left font-inter text-[11px] text-white/30 uppercase tracking-widest p-3">Orders</th>
                <th className="text-left font-inter text-[11px] text-white/30 uppercase tracking-widest p-3">Joined</th>
                <th className="text-left font-inter text-[11px] text-white/30 uppercase tracking-widest p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer, i) => {
                const initials = (customer.full_name || customer.email || 'U').slice(0, 2).toUpperCase();
                return (
                  <motion.tr
                    key={customer.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b border-white/[0.04] hover:bg-white/[0.025] transition-colors"
                  >
                    <td className="p-3">
                      <div className="w-8 h-8 rounded-full bg-[#C9B99A] flex items-center justify-center">
                        <span className="font-inter text-[12px] font-semibold text-black">{initials}</span>
                      </div>
                    </td>
                    <td className="p-3 font-inter text-[13px] text-white font-semibold">{customer.full_name || '—'}</td>
                    <td className="p-3 font-inter text-[12px] text-white/60">{customer.email || '—'}</td>
                    <td className="p-3 font-inter text-[12px] text-white/60">{customer.phone || '—'}</td>
                    <td className="p-3 font-inter text-[13px] text-[#C9B99A]">
                      {customer.orders?.[0]?.count || 0}
                    </td>
                    <td className="p-3 font-mono text-[12px] text-white/40">
                      {customer.created_at ? new Date(customer.created_at).toLocaleDateString('en-IN') : '—'}
                    </td>
                    <td className="p-3">
                      <div className="flex gap-1.5">
                        {customer.phone && (
                          <a
                            href={`https://wa.me/91${customer.phone}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-8 h-8 flex items-center justify-center border border-[#2A2A2A] rounded-md hover:bg-white/[0.08] transition-colors"
                          >
                            <MessageCircle size={14} className="text-[#25D366]" />
                          </a>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}