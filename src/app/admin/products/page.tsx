'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search, Plus, Sparkles, Package, Pencil, Trash2, Star, MoreVertical, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import { getProducts, deleteProduct, updateProduct } from '@/lib/db';
import { ProductFormModal } from '@/components/admin/ProductFormModal';

interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  originalPrice: number;
  original_price?: number;
  images: string[];
  totalStock: number;
  total_stock?: number;
  isFeatured: boolean;
  is_featured?: boolean;
  isActive: boolean;
  is_active?: boolean;
  createdAt?: any;
  created_at?: string;
}

const tabs = [
  { id: 'all', label: 'All' },
  { id: 'active', label: 'Active' },
  { id: 'low_stock', label: 'Low Stock' },
  { id: 'out_of_stock', label: 'Out of Stock' },
  { id: 'featured', label: 'Featured' },
];

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts();
      setProducts(data as Product[]);
    } catch (err) {
      console.warn('Could not load products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((p: any) => {
    const matchesSearch = p.name?.toLowerCase().includes(searchQuery.toLowerCase());
    
    switch (activeTab) {
      case 'active':
        return matchesSearch && (p.is_active || p.isActive);
      case 'low_stock':
        return matchesSearch && (p.total_stock || p.totalStock) > 0 && (p.total_stock || p.totalStock) <= 5;
      case 'out_of_stock':
        return matchesSearch && (p.total_stock || p.totalStock) === 0;
      case 'featured':
        return matchesSearch && (p.is_featured || p.isFeatured);
      default:
        return matchesSearch;
    }
  });

  const toggleFeatured = async (id: string, current: boolean) => {
    await updateProduct(id, { isFeatured: !current });
    setProducts(products.map((p) => p.id === id ? { ...p, isFeatured: !current } : p));
    toast.success(!current ? 'Added to featured' : 'Removed from featured');
  };

  const toggleActive = async (id: string, current: boolean) => {
    await updateProduct(id, { isActive: !current });
    setProducts(products.map((p) => p.id === id ? { ...p, isActive: !current } : p));
    toast.success(!current ? 'Product activated' : 'Product deactivated');
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Delete this product? This cannot be undone.')) return;
    await deleteProduct(id);
    setProducts(products.filter((p) => p.id !== id));
    toast.success('Product deleted');
  };

  const openEdit = (product: Product) => {
    setEditingProduct(product);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProduct(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="font-display font-semibold text-[28px] text-white">Products</h1>
          <p className="text-white/40 font-inter text-[13px] mt-1">{products.length} total products</p>
        </div>

        <div className="flex gap-3">
          <button className="flex items-center gap-2 h-10 px-4 border border-[#C9B99A] text-[#C9B99A] bg-[rgba(201,185,154,0.08)] rounded-lg font-inter text-[13px] hover:bg-[rgba(201,185,154,0.15)] transition-colors">
            <Sparkles size={14} />
            AI Create
          </button>
          <button 
            onClick={() => { setEditingProduct(null); setShowModal(true); }}
            className="flex items-center gap-2 h-10 px-4 bg-[#C9B99A] text-[#0A0A0A] rounded-lg font-inter text-[14px] font-semibold hover:bg-[#B8A88A] transition-colors"
          >
            <Plus size={14} />
            Add Product
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`h-9 px-4 rounded-lg font-inter text-[13px] whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'bg-[#C9B99A] text-[#0A0A0A] font-semibold'
                : 'bg-[#1A1A1A] text-white/50 border border-[#222] hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search products..."
          className="w-full h-11 bg-[#1A1A1A] border border-[#222] rounded-lg pl-11 pr-4 text-white font-inter text-[14px] placeholder:text-white/30 focus:border-[#C9B99A] focus:outline-none"
        />
      </div>

      {/* Products Table or Empty State */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-[#C9B99A] border-t-transparent rounded-full animate-spin" style={{ borderRadius: '0 !important' }} />
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-[#111111] border border-[#1A1A1A] rounded-xl py-20 text-center">
          <Package size={48} className="mx-auto text-white/10" />
          <h3 className="text-white/60 font-display text-[24px] mt-4">No products yet</h3>
          <p className="text-white/30 font-inter text-[14px] mt-2">Add your first product to get started</p>
          <button 
            onClick={() => { setEditingProduct(null); setShowModal(true); }}
            className="mt-6 flex items-center gap-2 mx-auto h-10 px-4 bg-[#C9B99A] text-[#0A0A0A] rounded-lg font-inter text-[14px] font-semibold"
          >
            <Plus size={14} />
            Add Product
          </button>
        </div>
      ) : (
        <div className="bg-[#111111] border border-[#1A1A1A] rounded-xl overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 bg-[#0A0A0A] border-b border-[#1A1A1A] py-3 px-4">
            <div className="col-span-2 font-inter text-[11px] text-white/30 uppercase tracking-widest">IMAGE</div>
            <div className="col-span-3 font-inter text-[11px] text-white/30 uppercase tracking-widest">NAME & CATEGORY</div>
            <div className="col-span-2 font-inter text-[11px] text-white/30 uppercase tracking-widest">PRICE</div>
            <div className="col-span-2 font-inter text-[11px] text-white/30 uppercase tracking-widest">STOCK</div>
            <div className="col-span-3 font-inter text-[11px] text-white/30 uppercase tracking-widest text-right">ACTIONS</div>
          </div>

          {/* Product Rows */}
          {filteredProducts.map((product) => (
            <div 
              key={product.id}
              className="grid grid-cols-12 gap-4 py-4 px-4 border-b border-[#1A1A1A] hover:bg-[#1A1A1A] transition-colors items-center"
            >
              {/* Image */}
              <div className="col-span-2">
                <div className="w-12 h-16 rounded bg-[#0A0A0A] border border-[#222] overflow-hidden">
                  {product.images?.[0] ? (
                    <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/20">📦</div>
                  )}
                </div>
              </div>

              {/* Name & Category */}
              <div className="col-span-3">
                <p className="text-white font-inter text-[14px] font-medium truncate">{product.name}</p>
                <p className="text-white/40 font-inter text-[11px] uppercase mt-1">{product.category}</p>
              </div>

              {/* Price */}
              <div className="col-span-2">
                <p className="text-white font-inter text-[14px] font-semibold">₹{product.price?.toLocaleString()}</p>
                {(product.original_price || product.originalPrice) > product.price && (
                  <p className="text-white/40 font-inter text-xs line-through">₹{(product.original_price || product.originalPrice)?.toLocaleString()}</p>
                )}
              </div>

              {/* Stock */}
              <div className="col-span-2">
                {(product.total_stock || product.totalStock) === 0 ? (
                  <span className="inline-flex px-2 py-1 rounded-full text-[11px] font-semibold bg-[rgba(220,38,38,0.15)] text-[#DC2626] border border-[rgba(220,38,38,0.3)]">Out of Stock</span>
                ) : (product.total_stock || product.totalStock) <= 5 ? (
                  <span className="inline-flex px-2 py-1 rounded-full text-[11px] font-semibold bg-[rgba(217,119,6,0.15)] text-[#D97706] border border-[rgba(217,119,6,0.3)]">Low: {product.total_stock || product.totalStock}</span>
                ) : (
                  <span className="inline-flex px-2 py-1 rounded-full text-[11px] font-semibold bg-[rgba(22,163,74,0.15)] text-[#16A34A] border border-[rgba(22,163,74,0.3)]">{product.total_stock || product.totalStock} in stock</span>
                )}
              </div>

              {/* Actions */}
              <div className="col-span-3 flex items-center justify-end gap-2">
                <button 
                  onClick={() => window.open(`/products/${product.slug}`, '_blank')}
                  className="w-8 h-8 flex items-center justify-center rounded border border-[#222] text-white/40 hover:text-white hover:border-[#C9B99A] transition-colors"
                  title="View"
                >
                  <Eye size={14} />
                </button>
                <button 
                  onClick={() => toggleFeatured(product.id, !!(product.is_featured || product.isFeatured))}
                  className="w-8 h-8 flex items-center justify-center rounded border border-[#222] transition-colors"
                  title="Toggle Featured"
                >
                  <Star 
                    size={14} 
                    className={(product.is_featured || product.isFeatured) ? 'text-yellow-400 fill-yellow-400' : 'text-white/30'} 
                  />
                </button>
                <button 
                  onClick={() => openEdit(product)}
                  className="w-8 h-8 flex items-center justify-center rounded border border-[#222] text-white/40 hover:text-white hover:border-[#C9B99A] transition-colors"
                  title="Edit"
                >
                  <Pencil size={14} />
                </button>
                <button 
                  onClick={() => handleDeleteProduct(product.id)}
                  className="w-8 h-8 flex items-center justify-center rounded border border-[#222] text-white/40 hover:text-[#DC2626] hover:border-[#DC2626] transition-colors"
                  title="Delete"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Product Form Modal */}
      <ProductFormModal
        isOpen={showModal}
        onClose={closeModal}
        onSuccess={fetchProducts}
        editProduct={editingProduct}
      />
    </div>
  );
}