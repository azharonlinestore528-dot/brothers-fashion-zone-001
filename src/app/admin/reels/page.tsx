'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Clapperboard, Upload, Trash2, Plus, X, Eye, EyeOff } from 'lucide-react';
import { getReels, addReel, deleteReel, updateReel } from '@/lib/db';
import { uploadImage } from '@/lib/uploadImage';
import toast from 'react-hot-toast';

interface Reel {
  id: string;
  title: string;
  instagramUrl: string;
  thumbnailUrl: string | null;
  showOnHomepage: boolean;
}

export default function AdminReelsPage() {
  const [reels, setReels] = useState<Reel[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [instagramUrl, setInstagramUrl] = useState('');
  const [title, setTitle] = useState('');
  const [showOnHomepage, setShowOnHomepage] = useState(true);
  const [thumbnailUrl, setThumbnailUrl] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchReels = async () => {
    try {
      const data = await getReels();
      setReels(data as Reel[]);
    } catch (err) {
      console.warn('Could not load reels');
      setReels([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReels();
  }, []);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadImage(file, 'reels');
      setThumbnailUrl(url);
      toast.success('Thumbnail uploaded!');
    } catch (err: any) {
      toast.error(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleAddReel = async () => {
    if (!instagramUrl.trim()) {
      toast.error('Please enter an Instagram URL');
      return;
    }

    try {
      await addReel({
        title: title.trim() || null,
        instagramUrl: instagramUrl,
        thumbnailUrl: thumbnailUrl || null,
        showOnHomepage: showOnHomepage,
      });

      toast.success('Reel added!');
      setShowModal(false);
      resetForm();
      fetchReels();
    } catch (err: any) {
      toast.error(err.message || 'Failed to add reel');
    }
  };

  const resetForm = () => {
    setInstagramUrl('');
    setTitle('');
    setThumbnailUrl('');
    setShowOnHomepage(true);
  };

  const toggleHomepage = async (reel: any) => {
    try {
      const newValue = !reel.showOnHomepage;
      await updateReel(reel.id, { showOnHomepage: newValue });
      setReels(reels.map(r => r.id === reel.id ? { ...r, showOnHomepage: newValue } : r));
      toast.success(newValue ? 'Now showing on homepage' : 'Removed from homepage');
    } catch (err) {
      toast.error('Failed to update');
    }
  };

  const handleDeleteReel = async (id: string) => {
    if (!confirm('Delete this reel?')) return;
    
    try {
      await deleteReel(id);
      setReels(reels.filter(r => r.id !== id));
      toast.success('Reel deleted');
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="font-display font-semibold text-[28px] text-white">Reels / Instagram</h1>
          <p className="text-white/40 font-inter text-[13px] mt-1">{reels.length} reels</p>
        </div>

        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 h-10 px-4 bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] text-white rounded-lg font-inter text-[14px] font-semibold hover:opacity-90 transition-opacity"
        >
          <Plus size={16} />
          Add Reel
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-[#C9C9C9] border-t-transparent rounded-full animate-spin" style={{ borderRadius: '0 !important' }} />
        </div>
      ) : reels.length === 0 ? (
        <div className="bg-[#111111] border border-[#1A1A1A] rounded-xl py-20 text-center">
          <Clapperboard size={48} className="mx-auto text-white/10" />
          <h3 className="text-white/60 font-display text-[24px] mt-4">No reels yet</h3>
          <p className="text-white/30 font-inter text-[14px] mt-2">Add your Instagram reels to display on the homepage</p>
          <button 
            onClick={() => setShowModal(true)}
            className="mt-6 flex items-center gap-2 mx-auto h-10 px-4 bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] text-white rounded-lg font-inter text-[14px] font-semibold"
          >
            <Plus size={16} />
            Add Your First Reel
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {reels.map((reel) => (
            <motion.div
              key={reel.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#111111] border border-[#1A1A1A] rounded-xl overflow-hidden group"
            >
              <div className="aspect-[9/16] bg-[#0A0A0A] relative">
                {(reel as any).thumbnail_url || reel.thumbnailUrl ? (
                  <Image
                    src={(reel as any).thumbnail_url || reel.thumbnailUrl}
                    alt={reel.title || 'Reel'}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#833AB4]/20 via-[#FD1D1D]/20 to-[#F77737]/20">
                    <Clapperboard size={32} className="text-white/40" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <a 
                    href={(reel as any).instagram_url || reel.instagramUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-[#E1306C] rounded-full flex items-center justify-center"
                  >
                    <Clapperboard size={18} className="text-white" />
                  </a>
                </div>
              </div>
              <div className="p-4 space-y-3">
                <p className="text-white font-inter text-[13px] truncate">
                  {reel.title || 'Untitled Reel'}
                </p>
                <div className="flex items-center justify-between">
                  <button 
                    onClick={() => toggleHomepage(reel)}
                    className={`flex items-center gap-1.5 text-[12px] ${(reel as any).show_on_homepage || reel.showOnHomepage ? 'text-green-400' : 'text-white/40'}`}
                  >
                    {(reel as any).show_on_homepage || reel.showOnHomepage ? <Eye size={14} /> : <EyeOff size={14} />}
                    {(reel as any).show_on_homepage || reel.showOnHomepage ? 'On Homepage' : 'Hidden'}
                  </button>
                  <button 
                    onClick={() => handleDeleteReel(reel.id)}
                    className="w-8 h-8 flex items-center justify-center rounded border border-[#222] text-white/40 hover:text-[#DC2626] hover:border-[#DC2626] transition-colors"
                  >
                    <Trash2 size={14} />
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
              <h2 className="text-white font-display text-xl">Add New Reel</h2>
              <button onClick={() => setShowModal(false)} className="w-9 h-9 bg-[#1A1A1A] rounded-lg flex items-center justify-center">
                <X size={16} className="text-white" />
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-[12px] text-white/50 uppercase tracking-wider mb-2">Instagram URL *</label>
                <input
                  type="url"
                  value={instagramUrl}
                  onChange={(e) => setInstagramUrl(e.target.value)}
                  placeholder="https://www.instagram.com/reel/..."
                  className="w-full h-12 bg-[#0A0A0A] border border-[#222] rounded-lg px-4 text-white text-sm focus:border-[#C9B99A] focus:outline-none"
                />
                <p className="text-white/40 text-xs mt-1">Paste your Instagram reel URL</p>
              </div>

              <div>
                <label className="block text-[12px] text-white/50 uppercase tracking-wider mb-2">Title (Optional)</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Summer Collection 2024"
                  className="w-full h-12 bg-[#0A0A0A] border border-[#222] rounded-lg px-4 text-white text-sm focus:border-[#C9B99A] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[12px] text-white/50 uppercase tracking-wider mb-2">Thumbnail (Optional)</label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-[#222] rounded-lg bg-[#0A0A0A] p-4 text-center cursor-pointer hover:border-[#C9B99A] transition-colors"
                >
                  {thumbnailUrl ? (
                    <div className="relative aspect-video">
                      <Image src={thumbnailUrl} alt="Thumbnail" fill className="object-cover rounded" />
                    </div>
                  ) : (
                    <>
                      <Upload size={20} className="mx-auto text-white/30" />
                      <p className="text-white/40 text-xs mt-1">Click to upload thumbnail</p>
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

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showOnHomepage}
                  onChange={(e) => setShowOnHomepage(e.target.checked)}
                  className="w-5 h-5 rounded border-[#222] bg-[#0A0A0A] text-green-500 focus:ring-green-500"
                />
                <span className="text-white text-sm">Show on homepage</span>
              </label>

              <button
                onClick={handleAddReel}
                className="w-full h-12 bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
              >
                Add Reel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}