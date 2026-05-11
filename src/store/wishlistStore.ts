import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface WishlistState {
  productIds: string[];
  addToWishlist: (id: string) => void;
  removeFromWishlist: (id: string) => void;
  isInWishlist: (id: string) => boolean;
  toggleWishlist: (id: string) => void;
  clearWishlist: () => void;
}

const storage = typeof window !== 'undefined' ? createJSONStorage(() => localStorage) : createJSONStorage(() => ({ getItem: () => null, setItem: () => {}, removeItem: () => {} }));

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      productIds: [],

      addToWishlist: (id) => {
        const ids = get().productIds;
        if (!ids.includes(id)) {
          set({ productIds: [...ids, id] });
        }
      },

      removeFromWishlist: (id) => {
        set({
          productIds: get().productIds.filter((productId) => productId !== id),
        });
      },

      isInWishlist: (id) => {
        return get().productIds.includes(id);
      },

      toggleWishlist: (id) => {
        if (get().isInWishlist(id)) {
          get().removeFromWishlist(id);
        } else {
          get().addToWishlist(id);
        }
      },

      clearWishlist: () => set({ productIds: [] }),
    }),
    {
      name: 'bfz_wishlist',
      storage,
    }
  )
);
