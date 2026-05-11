'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { X, UploadCloud, Plus, Trash2, Camera } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { uploadImage } from '@/lib/uploadImage';
import { addProduct, updateProduct } from '@/lib/db';
import toast from 'react-hot-toast';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editProduct?: any;
}

const categories = [
  { value: 'clothing_men', label: 'Men\'s Clothing' },
  { value: 'clothing_women', label: 'Women\'s Clothing' },
  { value: 'footwear_men', label: 'Men\'s Footwear' },
  { value: 'footwear_women', label: 'Women\'s Footwear' },
  { value: 'footwear_kids', label: 'Kids\' Footwear' },
  { value: 'watches', label: 'Watches' },
  { value: 'bags', label: 'Bags' },
  { value: 'accessories', label: 'Accessories' },
];

const CLOTHING_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', '28', '30', '32', '34', '36', '38', '40', '42', 'Free Size'];
const FOOTWEAR_SIZES = ['IND 4', 'IND 5', 'IND 6', 'IND 7', 'IND 8', 'IND 9', 'IND 10', 'IND 11', 'IND 12'];
const ACCESSORIES_SIZES = ['Free Size', 'XS', 'S', 'M', 'L', 'XL'];

const SIZE_OPTIONS: Record<string, string[]> = {
  clothing_men: CLOTHING_SIZES,
  clothing_women: CLOTHING_SIZES,
  footwear_men: FOOTWEAR_SIZES,
  footwear_women: FOOTWEAR_SIZES,
  footwear_kids: FOOTWEAR_SIZES,
  watches: ['Free Size', '36mm', '38mm', '40mm', '42mm', '44mm'],
  bags: ['Free Size', 'Mini', 'Small', 'Medium', 'Large'],
  accessories: ACCESSORIES_SIZES,
};

const PRESET_COLORS = [
  { name: 'Black', hex: '#1A1A1A' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Red', hex: '#DC2626' },
  { name: 'Blue', hex: '#2563EB' },
  { name: 'Green', hex: '#16A34A' },
  { name: 'Yellow', hex: '#FFD600' },
  { name: 'Pink', hex: '#FF2D6B' },
  { name: 'Orange', hex: '#EA580C' },
  { name: 'Purple', hex: '#6B5CE7' },
  { name: 'Brown', hex: '#92400E' },
  { name: 'Cream', hex: '#F5F0E8' },
  { name: 'Navy', hex: '#1B2A4A' },
];

export function ProductFormModal({ isOpen, onClose, onSuccess, editProduct }: ProductFormModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: editProduct?.name || '',
    slug: editProduct?.slug || '',
    category: editProduct?.category || 'clothing_men',
    price: editProduct?.price || '',
    original_price: editProduct?.original_price || '',
    description: editProduct?.description || '',
    images: editProduct?.images || [] as string[],
    variants: editProduct?.variants || [{ size: 'M', stock: 10 }],
    colors: editProduct?.colors || [] as string[],
    is_featured: editProduct?.is_featured || false,
    is_active: editProduct?.is_active !== false,
  });
  
  const [colorInput, setColorInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [selectedColors, setSelectedColors] = useState<string[]>(editProduct?.colors || []);
  const [customColor, setCustomColor] = useState('');
  const [sizeStock, setSizeStock] = useState<{size: string, stock: number}[]>(
    editProduct?.variants?.map((v: any) => ({ size: v.size, stock: v.stock })) || []
  );
  const [customSize, setCustomSize] = useState('');

  useEffect(() => {
    if (formData.category && SIZE_OPTIONS[formData.category] && !editProduct) {
      setSizeStock(SIZE_OPTIONS[formData.category].map(s => ({ size: s, stock: 0 })));
    }
  }, [formData.category]);

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  };

  const handleNameChange = (name: string) => {
    setFormData({ ...formData, name, slug: formData.slug || generateSlug(name) });
  };

  const handleFileSelect = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    const newImages: string[] = [];
    setUploading(true);

    for (let i = 0; i < files.length; i++) {
      if (formData.images.length + newImages.length >= 6) break;
      
      const file = files[i];
      if (!file.type.startsWith('image/')) continue;

      try {
        const url = await uploadImage(file);
        newImages.push(url);
      } catch (err) {
        console.error('Error uploading file:', err);
        toast.error('Failed to upload image');
      }
    }

    setFormData({ ...formData, images: [...formData.images, ...newImages] });
    setUploading(false);
  }, [formData.images]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    handleFileSelect(e.dataTransfer.files);
  }, [handleFileSelect]);

  const removeImage = (index: number) => {
    setFormData({ ...formData, images: formData.images.filter((_img: string, i: number) => i !== index) });
  };

  const toggleColor = (colorName: string) => {
    if (selectedColors.includes(colorName)) {
      setSelectedColors(selectedColors.filter(c => c !== colorName));
    } else {
      setSelectedColors([...selectedColors, colorName]);
    }
  };

  const addCustomColor = () => {
    if (customColor.trim() && !selectedColors.includes(customColor.trim())) {
      setSelectedColors([...selectedColors, customColor.trim()]);
      setCustomColor('');
    }
  };

  const removeColor = (color: string) => {
    setSelectedColors(selectedColors.filter(c => c !== color));
  };

  const updateSizeStock = (index: number, stock: number) => {
    const updated = [...sizeStock];
    updated[index].stock = stock;
    setSizeStock(updated);
  };

  const addCustomSize = () => {
    if (customSize.trim() && !sizeStock.find(s => s.size === customSize.trim())) {
      setSizeStock([...sizeStock, { size: customSize.trim(), stock: 0 }]);
      setCustomSize('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.category || !formData.price) {
      toast.error('Please fill required fields');
      return;
    }

    setLoading(true);

    try {
      const discount_pct = formData.original_price 
        ? Math.round(((parseFloat(formData.original_price) - parseFloat(formData.price)) / parseFloat(formData.original_price)) * 100)
        : 0;

      const total_stock = sizeStock.reduce((sum, v) => sum + (v.stock || 0), 0);

      const productData = {
        name: formData.name,
        slug: formData.slug || generateSlug(formData.name),
        category: formData.category,
        subcategory: null,
        price: parseFloat(formData.price),
        original_price: formData.original_price ? parseFloat(formData.original_price) : null,
        discount_pct,
        description: formData.description || null,
        images: formData.images,
        variants: sizeStock.map(s => ({ size: s.size, stock: s.stock })),
        colors: selectedColors,
        tags: [],
        total_stock,
        is_active: formData.is_active,
        is_featured: formData.is_featured,
      };

      if (editProduct?.id) {
        await updateProduct(editProduct.id, productData);
        toast.success('Product updated!');
      } else {
        await addProduct(productData);
        toast.success('Product added successfully!');
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Error saving product:', err);
      toast.error(err.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed right-0 top-0 h-full w-full md:w-[600px] bg-[#111111] border-l border-[#1A1A1A] overflow-y-auto"
      >
        <div className="flex items-center justify-between p-6 border-b border-[#1A1A1A] sticky top-0 bg-[#111111] z-10">
          <h2 className="font-display font-semibold text-2xl text-white">
            {editProduct ? 'Edit Product' : 'Add Product'}
          </h2>
          <button 
            onClick={onClose}
            className="w-9 h-9 bg-[#1A1A1A] rounded-lg flex items-center justify-center hover:bg-[#2A2A2A] transition-colors"
          >
            <X size={16} className="text-white" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 pb-32">
          <div>
            <label className="block text-[12px] text-white/50 uppercase tracking-wider mb-2 font-inter">Product Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. Classic Cotton Kurta"
              className="w-full h-12 bg-[#0A0A0A] border border-[#222] rounded-lg px-4 text-white font-inter text-sm focus:border-[#C9B99A] focus:outline-none focus:ring-2 focus:ring-[rgba(201,185,154,0.1)]"
              required
            />
          </div>

          <div>
            <label className="block text-[12px] text-white/50 uppercase tracking-wider mb-2 font-inter">Slug</label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              placeholder="e.g. classic-cotton-kurta"
              className="w-full h-10 bg-[#0A0A0A] border border-[#222] rounded-lg px-3 text-[13px] text-white/80 font-mono focus:border-[#C9B99A] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[12px] text-white/50 uppercase tracking-wider mb-2 font-inter">Category *</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full h-12 bg-[#0A0A0A] border border-[#222] rounded-lg px-4 text-white font-inter text-sm focus:border-[#C9B99A] focus:outline-none"
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value} className="bg-[#0A0A0A]">{cat.label}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] text-white/50 uppercase tracking-wider mb-2 font-inter">Price (₹) *</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 font-inter text-sm">₹</span>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="0"
                  className="w-full h-12 bg-[#0A0A0A] border border-[#222] rounded-lg pl-8 pr-4 text-white font-inter text-sm focus:border-[#C9B99A] focus:outline-none"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-[12px] text-white/50 uppercase tracking-wider mb-2 font-inter">Original Price (₹)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 font-inter text-sm">₹</span>
                <input
                  type="number"
                  value={formData.original_price}
                  onChange={(e) => setFormData({ ...formData, original_price: e.target.value })}
                  placeholder="0"
                  className="w-full h-12 bg-[#0A0A0A] border border-[#222] rounded-lg pl-8 pr-4 text-white font-inter text-sm focus:border-[#C9B99A] focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[12px] text-white/50 uppercase tracking-wider mb-2 font-inter">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Product description..."
              rows={3}
              className="w-full bg-[#0A0A0A] border border-[#222] rounded-lg p-4 text-white font-inter text-sm focus:border-[#C9B99A] focus:outline-none resize-none"
            />
          </div>

          <div>
            <label className="block text-[12px] text-white/50 uppercase tracking-wider mb-2 font-inter">Product Images (max 6)</label>
            
            <div
              onDragOver={(e) => { e.preventDefault(); e.currentTarget.style.borderColor = '#C9B99A'; }}
              onDragLeave={(e) => { e.currentTarget.style.borderColor = '#222'; }}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-[#222] rounded-xl bg-[#0A0A0A] p-8 text-center cursor-pointer hover:border-[#C9B99A] transition-colors"
            >
              <UploadCloud size={32} className="mx-auto text-white/20" />
              <p className="text-white/40 font-inter text-sm mt-2">Drop images here</p>
              <p className="text-white/25 font-inter text-xs mt-1">or tap to browse from gallery</p>
              <p className="text-white/20 font-inter text-[11px] mt-2">JPG, PNG, WEBP • Max 5MB each</p>
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={(e) => handleFileSelect(e.target.files)}
              className="hidden"
            />

            {formData.images.length > 0 && (
              <div className="grid grid-cols-4 gap-2 mt-3">
                {formData.images.map((img: string, i: number) => (
                  <div key={i} className="relative aspect-[3/4] rounded-lg overflow-hidden border border-[#222]">
                    <img src={img} alt={`Preview ${i + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 w-5 h-5 bg-black/70 rounded-full flex items-center justify-center"
                    >
                      <X size={12} className="text-white" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-[12px] text-white/50 uppercase tracking-wider mb-2 font-inter">Size & Stock</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {sizeStock.map((item, i) => (
                <div key={i} className="inline-flex items-center gap-2 bg-[#1A1A1A] border border-[#2A2A2A] px-3 py-2 rounded-lg">
                  <span className="text-white text-[13px] font-inter">{item.size}</span>
                  <input
                    type="number"
                    value={item.stock}
                    onChange={(e) => updateSizeStock(i, parseInt(e.target.value) || 0)}
                    min={0}
                    className="w-12 border-b border-[#C9B99A] bg-transparent text-white text-[13px] font-inter text-center focus:outline-none"
                  />
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <input
                type="text"
                value={customSize}
                onChange={(e) => setCustomSize(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomSize())}
                placeholder="e.g. UK 6.5 or Free Size"
                className="flex-1 h-10 bg-[#0A0A0A] border border-[#222] rounded-lg px-3 text-white font-inter text-sm focus:border-[#C9B99A] focus:outline-none"
              />
              <button
                type="button"
                onClick={addCustomSize}
                className="h-10 px-4 border border-[#C9B99A] text-[#C9B99A] bg-transparent rounded-lg font-inter text-sm hover:bg-[#C9B99A] hover:text-black transition-colors"
              >
                + Add
              </button>
            </div>
          </div>

          <div>
            <label className="block text-[12px] text-white/50 uppercase tracking-wider mb-2 font-inter">Colors</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color.name}
                  type="button"
                  onClick={() => toggleColor(color.name)}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    selectedColors.includes(color.name)
                      ? 'border-[#C9B99A] shadow-[0_0_0_2px_#C9B99A]'
                      : 'border-[#2A2A2A]'
                  }`}
                  style={{ background: color.hex }}
                  title={color.name}
                />
              ))}
            </div>
            <div className="flex items-center gap-2 mb-3">
              <input
                type="text"
                value={customColor}
                onChange={(e) => setCustomColor(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomColor())}
                placeholder="Custom color name..."
                className="flex-1 h-10 bg-[#0A0A0A] border border-[#222] rounded-lg px-3 text-white font-inter text-sm focus:border-[#C9B99A] focus:outline-none"
              />
              <button
                type="button"
                onClick={addCustomColor}
                className="h-10 px-4 border border-[#C9B99A] text-[#C9B99A] bg-transparent rounded-lg font-inter text-sm hover:bg-[#C9B99A] hover:text-black transition-colors"
              >
                Add
              </button>
            </div>
            {selectedColors.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {selectedColors.map((color) => {
                  const preset = PRESET_COLORS.find(c => c.name === color);
                  return (
                    <span key={color} className="flex items-center gap-1.5 bg-[#2A2A2A] px-2.5 py-1 rounded text-white text-[13px] font-inter">
                      {preset ? (
                        <span className="w-4 h-4 rounded-full border border-white/20" style={{ background: preset.hex }} />
                      ) : (
                        <span className="w-4 h-4 rounded-full border border-white/20 bg-gradient-to-br from-pink-500 to-purple-500" />
                      )}
                      {color}
                      <button type="button" onClick={() => removeColor(color)} className="text-white/40 hover:text-white ml-1">
                        <X size={12} />
                      </button>
                    </span>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex gap-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_featured}
                onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                className="w-5 h-5 rounded border-[#222] bg-[#0A0A0A] text-[#C9B99A] focus:ring-[#C9B99A]"
              />
              <span className="text-white font-inter text-sm">Featured</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="w-5 h-5 rounded border-[#222] bg-[#0A0A0A] text-green-500 focus:ring-green-500"
              />
              <span className="text-white font-inter text-sm">Active</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading || uploading}
            className="w-full h-[52px] bg-[#C9B99A] text-[#0A0A0A] font-inter font-semibold text-[15px] rounded-xl hover:bg-[#B8A88A] disabled:opacity-60 transition-all"
          >
            {loading ? 'Saving...' : uploading ? 'Uploading images...' : 'Save Product'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}