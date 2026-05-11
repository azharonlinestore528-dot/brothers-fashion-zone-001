export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  addresses?: Address[];
  wishlist?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  id: string;
  label: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
  isDefault: boolean;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}