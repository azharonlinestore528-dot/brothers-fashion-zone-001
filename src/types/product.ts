export interface ProductVariant {
  size: string;
  stock: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  subcategory?: string;
  images: string[];
  variants: ProductVariant[];
  colors?: string[];
  material?: string;
  fit?: string;
  care?: string[];
  tags?: string[];
  featured?: boolean;
  newArrival?: boolean;
  onSale?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  subcategories?: string[];
}