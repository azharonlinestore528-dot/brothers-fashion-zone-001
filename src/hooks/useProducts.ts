import { useState, useEffect, useMemo } from 'react';
import { getProducts } from '@/lib/db';
import { Product } from '@/types/product';

export interface ProductFilters {
  category: string[];
  priceRange: [number, number];
  sizes: string[];
  sortBy: 'newest' | 'price_asc' | 'price_desc' | 'popular';
  search?: string;
}

interface UseProductsOptions {
  filters?: Partial<ProductFilters>;
  limit?: number;
  category?: string;
}

export function useProducts(options: UseProductsOptions = {}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingLocalData, setUsingLocalData] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getProducts(options.category);

      if (data && data.length > 0) {
        const mappedProducts = data.map((p: any) => ({
          id: p.id || '',
          name: p.name || '',
          slug: p.slug || '',
          description: p.description || '',
          price: p.price || 0,
          originalPrice: p.originalPrice,
          category: p.category || '',
          subcategory: p.subcategory,
          images: p.images || [],
          variants: p.variants || [],
          colors: p.colors || [],
          material: p.material,
          fit: p.fit,
          tags: p.tags || [],
          featured: p.isFeatured || false,
          onSale: (p.originalPrice || 0) > p.price,
          createdAt: p.createdAt ? new Date(p.createdAt.seconds * 1000).toISOString() : new Date().toISOString(),
          updatedAt: p.updatedAt ? new Date(p.updatedAt.seconds * 1000).toISOString() : new Date().toISOString(),
        }));
        setProducts(mappedProducts);
        setUsingLocalData(false);
      } else {
        setProducts([]);
        setUsingLocalData(true);
      }
    } catch (err) {
      console.warn('Error fetching from Firebase:', err);
      setProducts([]);
      setUsingLocalData(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [options.category]);

  const filteredProducts = useMemo(() => {
    let result = [...products];
    const filters = options.filters || {};

    if (filters.category && filters.category.length > 0) {
      result = result.filter((p) => filters.category!.includes(p.category));
    }

    if (filters.priceRange) {
      const [min, max] = filters.priceRange;
      result = result.filter((p) => p.price >= min && p.price <= max);
    }

    if (filters.sizes && filters.sizes.length > 0) {
      result = result.filter((p) =>
        p.variants?.some((v) => filters.sizes!.includes(v.size))
      );
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          p.description.toLowerCase().includes(searchLower)
      );
    }

    switch (filters.sortBy) {
      case 'price_asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        result.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      default:
        break;
    }

    return result;
  }, [products, options.filters]);

  return {
    products: filteredProducts,
    allProducts: products,
    loading,
    error,
    usingLocalData,
    refetch: fetchProducts,
  };
}