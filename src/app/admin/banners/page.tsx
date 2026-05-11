'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Plus, Pencil, Trash2, X, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { uploadImage } from '@/lib/uploadImage';
import { getBanners, addBanner, updateBanner, deleteBanner } from '@/lib/db';
import toast from 'react-hot-toast';

interface Banner {
  id: string;
  title: string | null;
  subtitle: string | null;
  imageUrl: string;
  buttonText: string | null;
  buttonLink: string | null;
  bgColor: string;
  isActive: boolean;
  sortOrder: number;
}

const PRESET_COLORS = [
  '#6B5CE7',
  '#FF2D6B',
  '#FFD600',
  '#39FF14',
  '#2563EB',
  '#EA580C',
];

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [uploading, setUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    image_url: '',
    button_text: '',
    button_link: '',
    bg_color: '#6B5CE7',
    is_active: true,
  });

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const data = await getBanners();
      setBanners(data as Banner[]);
    } catch {
      setBanners([]);
    }
    setLoading(false);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      subtitle: '',
      image_url: '',
      button_text: '',
      button_link: '',
      bg_color: '#6B5CE7',
      is_active: true,
    });
    setEditingBanner(null);
  };

  const openModal = (banner?: Banner) => {
    if (banner) {
      setEditingBanner(banner);
      setFormData({
        title: banner.title || '',
        subtitle: banner.subtitle || '',
        image_url: banner.imageUrl || '',
        button_text: banner.buttonText || '',
        button_link: banner.buttonLink || '',
        bg_color: banner.bgColor,
        is_active: banner.isActive,
      });
    } else {
      resetForm();
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  const handleImageUpload = async (file: File) => {
    if (!file) return;
    
    setUploading(true);
    try {
      const url = await uploadImage(file, 'banners');
      setFormData({ ...formData, image_url: url });
      toast.success('Image uploaded!');
    } catch (err: any) {
      console.error('Upload error:', err);
      toast.error(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.image_url) {
      toast.error('Please upload an image');
      return;
    }

    try {
      const bannerData = {
        title: formData.title || null,
        subtitle: formData.subtitle || null,
        imageUrl: formData.image_url,
        buttonText: formData.button_text || null,
        buttonLink: formData.button_link || null,
        bgColor: formData.bg_color,
        isActive: formData.is_active,
      };

      if (editingBanner?.id) {
        await updateBanner(editingBanner.id, bannerData);
        toast.success('Banner updated!');
      } else {
        await addBanner(bannerData);
        toast.success('Banner created!');
      }

      closeModal();
      fetchBanners();
    } catch (err: any) {
      console.error('Error saving banner:', err);
      toast.error(err.message || 'Failed to save banner');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this banner?')) return;
    
    try {
      await deleteBanner(id);
      toast.success('Banner deleted!');
      fetchBanners();
    } catch (err) {
      console.error('Error deleting banner:', err);
      toast.error('Failed to delete banner');
    }
  };

  const toggleActive = async (banner: Banner) => {
    try {
      await updateBanner(banner.id, { isActive: !banner.isActive });
      fetchBanners();
    } catch (err) {
      console.error('Error updating banner:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-2 border-[#C9B99A] border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-[24px] text-white">Banners</h2>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2 bg-[#C9B99A] text-black font-inter text-[14px] font-semibold rounded-lg hover:bg-[#B8A88A] transition-colors"
        >
          <Plus size={16} />
          Add Banner
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {banners.map((banner) => (
          <div
            key={banner.id}
            className="flex items-center bg-[#111111] border border-[#1A1A1A] rounded-xl overflow-hidden"
          >
            <div className="w-[160px] h-[100px] relative flex-shrink-0 bg-[#0A0A0A]">
              {(banner as any).image_url || banner.imageUrl ? (
                <Image
                  src={(banner as any).image_url || banner.imageUrl}
                  alt={banner.title || 'Banner'}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-white/20">
                  No image
                </div>
              )}
            </div>
            
            <div className="flex-1 p-4">
              <h3 className="font-inter text-[15px] text-white font-semibold">{banner.title || 'Untitled'}</h3>
              <div className="flex items-center gap-2 mt-2">
                <div
                  className="w-5 h-5 rounded-full"
                  style={{ background: (banner as any).bg_color || banner.bgColor }}
                />
                <span className="font-mono text-[12px] text-white/60">{(banner as any).bg_color || banner.bgColor}</span>
              </div>
              <div className="flex items-center gap-4 mt-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <div
                    className={`relative w-10 h-5 rounded-full transition-colors ${(banner as any).is_active || banner.isActive ? 'bg-[#39FF14]' : 'bg-gray-600'}`}
                    onClick={() => toggleActive(banner)}
                  >
                    <div
                      className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${(banner as any).is_active || banner.isActive ? 'translate-x-5' : 'translate-x-0.5'}`}
                    />
                  </div>
                  <span className="text-[12px] text-white/60">{(banner as any).is_active || banner.isActive ? 'Active' : 'Inactive'}</span>
                </label>
              </div>
            </div>
            
            <div className="flex items-center gap-2 pr-4">
              <button
                onClick={() => openModal(banner)}
                className="w-9 h-9 flex items-center justify-center bg-[#1A1A1A] rounded-lg hover:bg-[#2A2A2A] transition-colors"
              >
                <Pencil size={14} className="text-white" />
              </button>
              <button
                onClick={() => handleDelete(banner.id)}
                className="w-9 h-9 flex items-center justify-center bg-[rgba(220,38,38,0.1)] rounded-lg hover:bg-[rgba(220,38,38,0.2)] transition-colors"
              >
                <Trash2 size={14} className="text-red-500" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {banners.length === 0 && (
        <div className="text-center py-12 text-white/40">
          <p>No banners found. Click "Add Banner" to create one.</p>
        </div>
      )}

      <AnimatePresence>
        {showModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 z-50"
              onClick={closeModal}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed right-0 top-0 h-full w-full md:w-[520px] bg-[#111111] border-l border-[#1A1A1A] z-50 overflow-y-auto"
            >
              <div className="flex items-center justify-between p-6 border-b border-[#1A1A1A] sticky top-0 bg-[#111111] z-10">
                <h2 className="font-display font-semibold text-2xl text-white">
                  {editingBanner ? 'Edit Banner' : 'Add Banner'}
                </h2>
                <button
                  onClick={closeModal}
                  className="w-9 h-9 bg-[#1A1A1A] rounded-lg flex items-center justify-center hover:bg-[#2A2A2A] transition-colors"
                >
                  <X size={16} className="text-white" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div>
                  <label className="block text-[12px] text-white/50 uppercase tracking-wider mb-2 font-inter">Banner Image *</label>
                  <div
                    className="border-2 border-dashed border-[#222] rounded-xl bg-[#0A0A0A] p-6 text-center cursor-pointer hover:border-[#C9B99A] transition-colors"
                    onClick={() => document.getElementById('banner-image-input')?.click()}
                  >
                    {formData.image_url ? (
                      <div className="relative aspect-[16/9]">
                        <Image
                          src={formData.image_url}
                          alt="Banner preview"
                          fill
                          className="object-contain rounded"
                        />
                      </div>
                    ) : (
                      <>
                        <Upload size={32} className="mx-auto text-white/20" />
                        <p className="text-white/40 font-inter text-sm mt-2">Click to upload banner image</p>
                      </>
                    )}
                    {uploading && (
                      <div className="mt-2 text-[#C9B99A]">Uploading...</div>
                    )}
                  </div>
                  <input
                    id="banner-image-input"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(file);
                    }}
                  />
                </div>

                <div>
                  <label className="block text-[12px] text-white/50 uppercase tracking-wider mb-2 font-inter">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Summer Sale"
                    className="w-full h-12 bg-[#0A0A0A] border border-[#222] rounded-lg px-4 text-white font-inter text-sm focus:border-[#C9B99A] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[12px] text-white/50 uppercase tracking-wider mb-2 font-inter">Subtitle</label>
                  <input
                    type="text"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    placeholder="e.g. Up to 50% off"
                    className="w-full h-12 bg-[#0A0A0A] border border-[#222] rounded-lg px-4 text-white font-inter text-sm focus:border-[#C9B99A] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[12px] text-white/50 uppercase tracking-wider mb-2 font-inter">Button Text</label>
                  <input
                    type="text"
                    value={formData.button_text}
                    onChange={(e) => setFormData({ ...formData, button_text: e.target.value })}
                    placeholder="e.g. Shop Now"
                    className="w-full h-12 bg-[#0A0A0A] border border-[#222] rounded-lg px-4 text-white font-inter text-sm focus:border-[#C9B99A] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[12px] text-white/50 uppercase tracking-wider mb-2 font-inter">Button Link</label>
                  <input
                    type="text"
                    value={formData.button_link}
                    onChange={(e) => setFormData({ ...formData, button_link: e.target.value })}
                    placeholder="e.g. /sale"
                    className="w-full h-12 bg-[#0A0A0A] border border-[#222] rounded-lg px-4 text-white font-inter text-sm focus:border-[#C9B99A] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[12px] text-white/50 uppercase tracking-wider mb-2 font-inter">Background Color</label>
                  <div className="flex gap-2">
                    {PRESET_COLORS.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setFormData({ ...formData, bg_color: color })}
                        className={`w-10 h-10 rounded-lg border-2 transition-all ${
                          formData.bg_color === color ? 'border-white scale-110' : 'border-transparent'
                        }`}
                        style={{ background: color }}
                      />
                    ))}
                  </div>
                </div>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="w-5 h-5 rounded border-[#222] bg-[#0A0A0A] text-[#C9B99A] focus:ring-[#C9B99A]"
                  />
                  <span className="text-white font-inter text-sm">Active</span>
                </label>

                <button
                  type="submit"
                  className="w-full h-[52px] bg-[#C9B99A] text-[#0A0A0A] font-inter font-semibold text-[15px] rounded-xl hover:bg-[#B8A88A] transition-all"
                >
                  {editingBanner ? 'Update Banner' : 'Save Banner'}
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}