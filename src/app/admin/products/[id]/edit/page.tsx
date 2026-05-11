'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { UploadCloud, X, ArrowLeft } from 'lucide-react';
import { uploadImage } from '@/lib/uploadImage';
import { addProduct, updateProduct, getProductById } from '@/lib/db';
import toast from 'react-hot-toast';
import Link from 'next/link';

const categories = [
  { value: 'clothing_men', label: "Men's Clothing" },
  { value: 'clothing_women', label: "Women's Clothing" },
  { value: 'footwear_men', label: "Men's Footwear" },
  { value: 'footwear_women', label: "Women's Footwear" },
  { value: 'footwear_kids', label: "Kids' Footwear" },
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

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params?.id as string;
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState('');
  const [category, setCategory] = useState('clothing_men');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [description, setDescription] = useState('');
  const [brand, setBrand] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [sizeStock, setSizeStock] = useState<{size: string, stock: number}[]>([]);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;
      
      try {
        const product = await getProductById(productId);
        
        if (product) {
          setName(product.name || '');
          setCategory(product.category || 'clothing_men');
          setPrice(product.price?.toString() || '');
          setOriginalPrice(product.original_price?.toString() || '');
          setDescription(product.description || '');
          setBrand(product.brand || '');
          setImages(product.images || []);
          setSelectedColors(product.colors || []);
          setIsFeatured(product.is_featured || false);
          setIsActive(product.is_active !== false);
          
          const variants = typeof product.variants === 'string' 
            ? JSON.parse(product.variants) 
            : product.variants || [];
          setSizeStock(variants);
        } else {
          toast.error('Product not found');
          router.push('/admin/products');
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        toast.error('Failed to load product');
      } finally {
        setFetching(false);
      }
    };

    fetchProduct();
  }, [productId, router]);

  const generateSlug = (productName: string) => {
    return productName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  };

  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
    if (sizeStock.length === 0) {
      setSizeStock(SIZE_OPTIONS[newCategory].map(s => ({ size: s, stock: 0 })));
    }
  };

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    const newImages: string[] = [];
    setUploading(true);

    for (let i = 0; i < files.length; i++) {
      if (images.length + newImages.length >= 6) break;
      
      const file = files[i];
      if (!file.type.startsWith('image/')) continue;

      try {
        const url = await uploadImage(file, 'products');
        newImages.push(url);
      } catch (err) {
        console.error('Error uploading file:', err);
        toast.error('Failed to upload image');
      }
    }

    setImages([...images, ...newImages]);
    setUploading(false);
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_img, i) => i !== index));
  };

  const toggleColor = (colorName: string) => {
    if (selectedColors.includes(colorName)) {
      setSelectedColors(selectedColors.filter(c => c !== colorName));
    } else {
      setSelectedColors([...selectedColors, colorName]);
    }
  };

  const updateSizeStock = (index: number, stock: number) => {
    const updated = [...sizeStock];
    updated[index].stock = stock;
    setSizeStock(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !category || !price) {
      toast.error('Please fill required fields');
      return;
    }

    setLoading(true);

    try {
      const discountPct = originalPrice 
        ? Math.round(((parseFloat(originalPrice) - parseFloat(price)) / parseFloat(originalPrice)) * 100)
        : 0;

      const totalStock = sizeStock.reduce((sum, v) => sum + (v.stock || 0), 0);

      await updateProduct(productId, {
        name,
        slug: generateSlug(name),
        category,
        subcategory: null,
        price: parseFloat(price),
        original_price: originalPrice ? parseFloat(originalPrice) : null,
        discount_pct: discountPct,
        description: description || null,
        brand: brand || null,
        images,
        variants: sizeStock.map(s => ({ size: s.size, stock: s.stock })),
        colors: selectedColors,
        tags: [],
        total_stock: totalStock,
        is_active: isActive,
        is_featured: isFeatured,
      });

      toast.success('Product updated!');
      router.push('/admin/products');
    } catch (err: any) {
      console.error('Error updating product:', err);
      toast.error(err.message || 'Failed to update product');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#C9B99A] border-t-transparent rounded-full animate-spin mx-auto mb-4" style={{ borderRadius: '0 !important' }} />
          <p>Loading product...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/admin/products" className="p-2 bg-[#1A1A1A] rounded-lg hover:bg-[#2A2A2A] transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="font-display font-semibold text-[28px]">Edit Product</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-[#111111] border border-[#1A1A1A] rounded-xl p-6 space-y-6">
            <h2 className="font-semibold text-lg text-[#C9B99A]">Basic Info</h2>
            
            <div>
              <label className="block text-[12px] text-white/50 uppercase tracking-wider mb-2">Product Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Classic Cotton Kurta"
                className="w-full h-12 bg-[#0A0A0A] border border-[#222] rounded-lg px-4 text-white focus:border-[#C9B99A] focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-[12px] text-white/50 uppercase tracking-wider mb-2">Brand Name</label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="e.g. Brother's Fashion"
                className="w-full h-12 bg-[#0A0A0A] border border-[#222] rounded-lg px-4 text-white focus:border-[#C9B99A] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[12px] text-white/50 uppercase tracking-wider mb-2">Category *</label>
              <select
                value={category}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full h-12 bg-[#0A0A0A] border border-[#222] rounded-lg px-4 text-white focus:border-[#C9B99A] focus:outline-none"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value} className="bg-[#0A0A0A]">{cat.label}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[12px] text-white/50 uppercase tracking-wider mb-2">Price (₹) *</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0"
                  className="w-full h-12 bg-[#0A0A0A] border border-[#222] rounded-lg px-4 text-white focus:border-[#C9B99A] focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-[12px] text-white/50 uppercase tracking-wider mb-2">Original Price (₹)</label>
                <input
                  type="number"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(e.target.value)}
                  placeholder="0"
                  className="w-full h-12 bg-[#0A0A0A] border border-[#222] rounded-lg px-4 text-white focus:border-[#C9B99A] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[12px] text-white/50 uppercase tracking-wider mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Product description..."
                rows={3}
                className="w-full bg-[#0A0A0A] border border-[#222] rounded-lg p-4 text-white focus:border-[#C9B99A] focus:outline-none resize-none"
              />
            </div>

            <div className="flex flex-col gap-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <div 
                  className={`w-12 h-6 rounded-full transition-colors ${isFeatured ? 'bg-[#C9B99A]' : 'bg-[#222]'}`}
                  onClick={() => setIsFeatured(!isFeatured)}
                >
                  <div className={`w-5 h-5 bg-white rounded-full mt-0.5 transition-transform ${isFeatured ? 'translate-x-6' : 'translate-x-0.5'}`} />
                </div>
                <div>
                  <span className="text-white font-inter text-[14px]">Featured Product</span>
                  <span className="text-white/40 text-[12px] block">Show on homepage "Just Dropped" section</span>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <div 
                  className={`w-12 h-6 rounded-full transition-colors ${isActive ? 'bg-[#39FF14]' : 'bg-[#DC2626]'}`}
                  onClick={() => setIsActive(!isActive)}
                >
                  <div className={`w-5 h-5 bg-white rounded-full mt-0.5 transition-transform ${isActive ? 'translate-x-6' : 'translate-x-0.5'}`} />
                </div>
                <div>
                  <span className="text-white font-inter text-[14px]">Active</span>
                  <span className="text-white/40 text-[12px] block">Product visible in store</span>
                </div>
              </label>
            </div>
          </div>

          <div className="bg-[#111111] border border-[#1A1A1A] rounded-xl p-6 space-y-6">
            <h2 className="font-semibold text-lg text-[#C9B99A]">Images</h2>
            
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-[#222] rounded-xl bg-[#0A0A0A] p-8 text-center cursor-pointer hover:border-[#C9B99A] transition-colors"
            >
              <UploadCloud size={32} className="mx-auto text-white/20" />
              <p className="text-white/40 text-sm mt-2">Click to upload images</p>
              <p className="text-white/20 text-xs mt-1">JPG, PNG, WEBP • Max 6 images</p>
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => handleFileSelect(e.target.files)}
              className="hidden"
            />

            {images.length > 0 && (
              <div className="grid grid-cols-4 gap-3">
                {images.map((img, i) => (
                  <div key={i} className="relative aspect-[3/4] rounded-lg overflow-hidden border border-[#222]">
                    <img src={img} alt={`Preview ${i + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 w-6 h-6 bg-black/70 rounded-full flex items-center justify-center"
                    >
                      <X size={12} className="text-white" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-[#111111] border border-[#1A1A1A] rounded-xl p-6 space-y-6">
            <h2 className="font-semibold text-lg text-[#C9B99A]">Size & Stock</h2>
            
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
              {sizeStock.map((item, i) => (
                <div 
                  key={i} 
                  className={`bg-[#1A1A1A] border rounded-lg p-2 flex flex-col items-center gap-1 ${
                    item.stock > 0 ? 'border-[#39FF14]' : 'border-[#2A2A2A]'
                  }`}
                >
                  <span className="text-white text-[12px] font-medium">{item.size}</span>
                  <input
                    type="number"
                    value={item.stock}
                    onChange={(e) => updateSizeStock(i, parseInt(e.target.value) || 0)}
                    placeholder="0"
                    min={0}
                    className="w-14 h-8 bg-[#0A0A0A] border border-[#333] rounded text-white text-center text-[13px] focus:border-[#C9B99A] focus:outline-none"
                  />
                </div>
              ))}
            </div>
            <p className="text-white/40 text-xs">Click a size to set stock. Green border = size has stock</p>
          </div>

          <div className="bg-[#111111] border border-[#1A1A1A] rounded-xl p-6 space-y-6">
            <h2 className="font-semibold text-lg text-[#C9B99A]">Colors</h2>
            
            <div className="flex flex-wrap gap-2">
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
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading || uploading}
              className="flex-1 h-14 bg-[#C9B99A] text-[#0A0A0A] font-semibold rounded-xl hover:bg-[#B8A88A] disabled:opacity-60 transition-all"
            >
              {loading ? 'Updating...' : uploading ? 'Uploading images...' : 'Update Product'}
            </button>
            <Link
              href="/admin/products"
              className="h-14 px-6 border border-[#222] text-white rounded-xl hover:bg-[#1A1A1A] transition-colors flex items-center"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}