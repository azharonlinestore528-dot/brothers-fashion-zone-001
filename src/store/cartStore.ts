import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  variant: {
    size: string;
    color?: string;
  };
  quantity: number;
}

interface CartState {
  items: CartItem[];
  hydrated: boolean;
  hydrate: () => void;
  addItem: (item: CartItem) => void;
  removeItem: (id: string, size: string) => Promise<void>;
  updateQuantity: (id: string, size: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getTotal: () => number;
  getItemCount: () => number;
}

const storage = typeof window !== 'undefined' ? createJSONStorage(() => localStorage) : createJSONStorage(() => ({ getItem: () => null, setItem: () => {}, removeItem: () => {} }));

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      hydrated: true,

      hydrate: () => {
        set({ hydrated: true });
      },

      addItem: (item) => {
        const items = get().items;
        const existingIndex = items.findIndex(
          (i) => i.id === item.id && i.variant.size === item.variant.size
        );

        let newItems: CartItem[];
        if (existingIndex >= 0) {
          newItems = items.map((i, idx) =>
            idx === existingIndex
              ? { ...i, quantity: i.quantity + item.quantity }
              : i
          );
        } else {
          newItems = [...items, item];
        }

        set({ items: newItems });
      },

      removeItem: async (id, size) => {
        const newItems = get().items.filter(
          (item) => !(item.id === id && item.variant.size === size)
        );
        set({ items: newItems });
      },

      updateQuantity: async (id, size, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id, size);
          return;
        }

        const newItems = get().items.map((item) =>
          item.id === id && item.variant.size === size
            ? { ...item, quantity }
            : item
        );
        set({ items: newItems });
      },

      clearCart: async () => {
        set({ items: [] });
      },

      getTotal: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },

      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: 'bfz-cart-storage',
      storage,
      partialize: (state) => ({ items: state.items }),
    }
  )
);
