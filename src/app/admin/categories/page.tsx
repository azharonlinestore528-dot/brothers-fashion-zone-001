'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Camera, RefreshCw, Plus, X, Upload } from 'lucide-react';
import { uploadImage } from '@/lib/uploadImage';
import { getCategories, addCategory, updateCategory, deleteCategory } from '@/lib/db';
import toast from 'react-hot-toast';

interface Category {
  id: string;
  name: string;
  slug: string;
  imageUrl: string | null;
  isActive: boolean;
  sortOrder: number;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [categoryImage, setCategoryImage] = useState('');
  const [adding, setAdding] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await getCategories();
      setCategories(data as Category[]);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
    setLoading(false);
  };

  const uploadCategoryImage = async (file: File, categoryId: string) => {
    if (!file) return;
    
    setUploading(categoryId);
    
    try {
      const url = await uploadImage(file, 'categories');
      await updateCategory(categoryId, { imageUrl: url });
      toast.success('Image uploaded!');
      fetchCategories();
    } catch (err: any) {
      console.error('Upload error:', err);
      toast.error(err.message || 'Upload failed');
    } finally {
      setUploading(null);
    }
  };

  const toggleActive = async (category: Category) => {
    try {
      await updateCategory(category.id, { isActive: !category.isActive });
      fetchCategories();
    } catch (err) {
      console.error('Error updating category:', err);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAdding(true);
    try {
      const url = await uploadImage(file);
      setCategoryImage(url);
      toast.success('Image uploaded!');
    } catch (err: any) {
      toast.error(err.message || 'Upload failed');
    } finally {
      setAdding(false);
    }
  };

  const handleAddCategory = async () => {
    if (!categoryName.trim()) {
      toast.error('Enter category name');
      return;
    }
    const slug = categoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    try {
      await addCategory({
        name: categoryName,
        slug,
        imageUrl: categoryImage || null,
        isActive: true,
        sortOrder: 0,
      });
      toast.success('Category added!');
      setCategoryName('');
      setCategoryImage('');
      setShowModal(false);
      fetchCategories();
    } catch (err: any) {
      toast.error('Failed to add category');
      console.error(err);
    }
  };

  const getCategoryEmoji = (name: string): string => {
    const emojis: Record<string, string> = {
      'Men': '👨',
      'Women': '👩',
      'Kids': '👶',
      'Footwear': '👟',
      'Watches': '⌚',
      'Bags': '👜',
      'Accessories': '💍',
      'Sale': '🏷️',
    };
    return emojis[name] || '📁';
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
        <h2 className="font-serif text-[24px] text-white">Categories</h2>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-[#C9B99A] text-black font-inter text-[14px] font-semibold px-4 py-2 rounded-lg hover:bg-[#B8A88A] transition-colors">
          <Plus size={16} /> Add Category
        </button>
      </div>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map((category) => (
          <div
            key={category.id}
            className="bg-[#111111] border border-[#1A1A1A] rounded-xl overflow-hidden"
          >
            <div className="relative h-[120px] bg-[#0A0A0A]">
              {category.imageUrl ? (
                <Image
                  src={category.imageUrl}
                  alt={category.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A]">
                  <span className="text-4xl">{getCategoryEmoji(category.name)}</span>
                </div>
              )}
              
              <label className="absolute bottom-2 right-2 w-8 h-8 bg-[#C9B99A] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#B8A88A] transition-colors">
                <Camera size={14} className="text-[#0A0A0A]" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) uploadCategoryImage(file, category.id);
                  }}
                  disabled={uploading === category.id}
                />
              </label>
              
              {uploading === category.id && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <RefreshCw size={20} className="text-white animate-spin" />
                </div>
              )}
            </div>
            
            <div className="p-4">
              <h3 className="font-inter text-[14px] text-white font-semibold">{category.name}</h3>
              <p className="font-mono text-[11px] text-white/40 mt-1">/{category.slug}</p>
              
              <label className="flex items-center gap-2 mt-3 cursor-pointer">
                <div
                  className={`relative w-10 h-5 rounded-full transition-colors ${category.isActive ? 'bg-[#39FF14]' : 'bg-gray-600'}`}
                  onClick={() => toggleActive(category)}
                >
                  <div
                    className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${category.isActive ? 'translate-x-5' : 'translate-x-0.5'}`}
                  />
                </div>
                <span className="text-[12px] text-white/60">{category.isActive ? 'Active' : 'Inactive'}</span>
              </label>
            </div>
          </div>
        ))}
      </div>
      
      {categories.length === 0 && (
        <div className="text-center py-12 text-white/40">
          <p>No categories found. Run the SQL to create categories.</p>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="fixed right-0 top-0 h-full w-full max-w-md bg-[#111111] border-l border-[#1A1A1A] p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white font-display text-xl">Add Category</h2>
              <button onClick={() => setShowModal(false)} className="w-9 h-9 bg-[#1A1A1A] rounded-lg flex items-center justify-center">
                <X size={16} className="text-white" />
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-[12px] text-white/50 uppercase tracking-wider mb-2">Category Name *</label>
                <input
                  type="text"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  placeholder="e.g. Men"
                  className="w-full h-12 bg-[#0A0A0A] border border-[#222] rounded-lg px-4 text-white text-sm focus:border-[#C9B99A] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[12px] text-white/50 uppercase tracking-wider mb-2">Image (Optional)</label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-[#222] rounded-lg bg-[#0A0A0A] p-4 text-center cursor-pointer hover:border-[#C9B99A] transition-colors"
                >
                  {categoryImage ? (
                    <Image src={categoryImage} alt="Category" width={80} height={80} className="mx-auto object-cover" />
                  ) : (
                    <>
                      <Upload size={20} className="mx-auto text-white/30" />
                      <p className="text-white/40 text-xs mt-1">Click to upload image</p>
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
                onClick={handleAddCategory}
                disabled={adding}
                className="w-full h-12 bg-[#C9B99A] text-[#0A0A0A] font-semibold rounded-lg hover:bg-[#B8A88A] transition-colors disabled:opacity-60"
              >
                {adding ? 'Adding...' : 'Add Category'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}