'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { getCoupons, deleteCoupon } from '@/lib/db';
import toast from 'react-hot-toast';
import { StatusBadge } from '@/components/admin/StatusBadge';

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const data = await getCoupons();
      setCoupons(data);
    } catch (err) {
      console.error('Error fetching coupons:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCoupon = async (id: string) => {
    if (!confirm('Delete this coupon?')) return;
    try {
      await deleteCoupon(id);
      setCoupons(coupons.filter((c) => c.id !== id));
      toast.success('Coupon deleted');
    } catch (err) {
      toast.error('Failed to delete coupon');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-[24px] text-white">Coupons</h2>
        <button className="flex items-center gap-2 bg-[#C9B99A] text-black font-inter text-[14px] font-semibold px-4 py-2 rounded-lg hover:bg-[#B8A88A] transition-colors">
          <Plus size={16} /> Create Coupon
        </button>
      </div>

      <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-2 border-[#C9B99A] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : coupons.length === 0 ? (
          <div className="text-center py-12">
            <p className="font-inter text-[14px] text-white/40">No coupons yet</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-white/[0.02] border-b border-[#2A2A2A]">
                <th className="text-left font-inter text-[11px] text-white/30 uppercase tracking-widest p-3">Code</th>
                <th className="text-left font-inter text-[11px] text-white/30 uppercase tracking-widest p-3">Type</th>
                <th className="text-left font-inter text-[11px] text-white/30 uppercase tracking-widest p-3">Value</th>
                <th className="text-left font-inter text-[11px] text-white/30 uppercase tracking-widest p-3">Used</th>
                <th className="text-left font-inter text-[11px] text-white/30 uppercase tracking-widest p-3">Status</th>
                <th className="text-left font-inter text-[11px] text-white/30 uppercase tracking-widest p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((coupon, i) => (
                <motion.tr
                  key={coupon.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-b border-white/[0.04] hover:bg-white/[0.025] transition-colors"
                >
                  <td className="p-3 font-mono text-[14px] text-[#C9B99A] font-semibold tracking-wider">{coupon.code}</td>
                  <td className="p-3"><StatusBadge status={coupon.discount_type} /></td>
                  <td className="p-3 font-serif text-[16px] text-white">
                    {coupon.discount_type === 'percent' ? `${coupon.discount_value}%` : `₹${coupon.discount_value}`}
                  </td>
                  <td className="p-3 font-inter text-[13px] text-white/60">{coupon.used_count || 0}</td>
                  <td className="p-3">
                    <span className={`font-inter text-[11px] px-2 py-1 rounded-full ${coupon.is_active ? 'bg-[#DCFCE7] text-[#16A34A]' : 'bg-[#FEE2E2] text-[#DC2626]'}`}>
                      {coupon.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-1.5">
                      <button className="w-8 h-8 flex items-center justify-center border border-[#2A2A2A] rounded-md hover:bg-white/[0.08] transition-colors">
                        <Pencil size={14} className="text-white/60" />
                      </button>
                      <button
                        onClick={() => deleteCoupon(coupon.id)}
                        className="w-8 h-8 flex items-center justify-center border border-[#2A2A2A] rounded-md hover:bg-white/[0.08] transition-colors"
                      >
                        <Trash2 size={14} className="text-white/60 hover:text-[#DC2626]" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}