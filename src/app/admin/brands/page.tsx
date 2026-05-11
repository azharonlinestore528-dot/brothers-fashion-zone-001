'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, X, Upload } from 'lucide-react';
import { uploadImage } from '@/lib/uploadImage';
import { getBrands, addBrand, updateBrand, deleteBrand } from '@/lib/db';
import toast from 'react-hot-toast';

interface Brand {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  bannerUrl: string | null;
  isActive: boolean;
  sortOrder: number;
}

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [brandName, setBrandName] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      const data = await getBrands();
      setBrands(data as Brand[]);
    } catch (err) {
      console.error('Error fetching brands:', err);
      toast.error('Failed to load brands');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file, 'brands');
      setLogoUrl(url);
      toast.success('Logo uploaded!');
    } catch (err: any) {
      toast.error(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleAddBrand = async () => {
    if (!brandName.trim()) {
      toast.error('Enter brand name');
      return;
    }
    const slug = brandName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    try {
      await addBrand({ name: brandName, slug, logoUrl: logoUrl || null });
      toast.success('Brand added!');
      setBrandName('');
      setLogoUrl('');
      setShowModal(false);
      fetchBrands();
    } catch (err: any) {
      toast.error('Failed to save brand');
      console.error(err);
    }
  };

  const handleDeleteBrand = async (id: string) => {
    if (!confirm('Delete this brand?')) return;
    try {
      await deleteBrand(id);
      setBrands(brands.filter((b) => b.id !== id));
      toast.success('Brand deleted');
    } catch (err) {
      toast.error('Failed to delete brand');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-[24px] text-white">Brands</h2>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-[#C9B99A] text-black font-inter text-[14px] font-semibold px-4 py-2 rounded-lg hover:bg-[#B8A88A] transition-colors">
          <Plus size={16} /> Add Brand
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-2 border-[#C9B99A] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : brands.length === 0 ? (
        <div className="text-center py-12 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl">
          <p className="font-inter text-[14px] text-white/40">No brands yet</p>
          <p className="font-inter text-[12px] text-white/30 mt-2">Add your first brand to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {brands.map((brand, i) => (
            <motion.div
              key={brand.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl overflow-hidden"
            >
              <div className="h-20 bg-[#0A0A0A] relative">
                {(brand as any).banner_url && (
                  <img src={(brand as any).banner_url} alt={brand.name} className="w-full h-full object-cover" />
                )}
              </div>
              <div className="p-4 relative -mt-6">
                <div className="w-12 h-12 rounded-full bg-[#0A0A0A] border-2 border-[#2A2A2A] overflow-hidden flex items-center justify-center">
                  {(brand as any).logo_url ? (
                    <img src={(brand as any).logo_url} alt={brand.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="font-inter text-[16px] text-white font-semibold">
                      {brand.name?.slice(0, 2).toUpperCase()}
                    </span>
                  )}
                </div>
                <h3 className="font-inter text-[14px] text-white font-semibold mt-2">{brand.name}</h3>
                <p className="font-mono text-[11px] text-white/30 mt-1">/{brand.slug}</p>
                <div className="flex items-center gap-1.5 mt-2">
                  <span className={`w-2 h-2 rounded-full ${(brand as any).is_active ? 'bg-[#16A34A]' : 'bg-[#DC2626]'}`} />
                  <span className="font-inter text-[11px] text-white/50">{(brand as any).is_active ? 'Active' : 'Inactive'}</span>
                </div>
                <div className="flex gap-2 mt-3">
                  <button className="flex-1 py-1.5 border border-[#2A2A2A] rounded text-[12px] text-white/60 hover:border-[#C9B99A] hover:text-[#C9B99A] transition-colors">
                    <Pencil size={12} className="inline mr-1" /> Edit
                  </button>
                  <button
                    onClick={() => handleDeleteBrand(brand.id)}
                    className="py-1.5 px-3 border border-[#2A2A2A] rounded text-[12px] text-white/60 hover:border-[#DC2626] hover:text-[#DC2626] transition-colors"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="fixed right-0 top-0 h-full w-full max-w-md bg-[#111111] border-l border-[#1A1A1A] p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white font-display text-xl">Add Brand</h2>
              <button onClick={() => setShowModal(false)} className="w-9 h-9 bg-[#1A1A1A] rounded-lg flex items-center justify-center">
                <X size={16} className="text-white" />
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-[12px] text-white/50 uppercase tracking-wider mb-2">Brand Name *</label>
                <input
                  type="text"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  placeholder="e.g. Nike"
                  className="w-full h-12 bg-[#0A0A0A] border border-[#222] rounded-lg px-4 text-white text-sm focus:border-[#C9B99A] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[12px] text-white/50 uppercase tracking-wider mb-2">Logo (Optional)</label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-[#222] rounded-lg bg-[#0A0A0A] p-4 text-center cursor-pointer hover:border-[#C9B99A] transition-colors"
                >
                  {logoUrl ? (
                    <img src={logoUrl} alt="Logo" className="w-16 h-16 mx-auto object-contain" />
                  ) : (
                    <>
                      <Upload size={20} className="mx-auto text-white/30" />
                      <p className="text-white/40 text-xs mt-1">Click to upload logo</p>
                    </>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>

              <button
                onClick={handleAddBrand}
                disabled={uploading}
                className="w-full h-12 bg-[#C9B99A] text-[#0A0A0A] font-semibold rounded-lg hover:bg-[#B8A88A] transition-colors disabled:opacity-60"
              >
                {uploading ? 'Uploading...' : 'Add Brand'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}