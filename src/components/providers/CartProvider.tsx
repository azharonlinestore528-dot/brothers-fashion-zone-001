'use client';

import { createContext, useContext, useState, ReactNode, useCallback } from 'react';

interface CartContextType {
  drawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
}

const CartContext = createContext<CartContextType>({
  drawerOpen: false,
  openDrawer: () => {},
  closeDrawer: () => {},
});

export function useCartContext() {
  return useContext(CartContext);
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const openDrawer = useCallback(() => setDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  return (
    <CartContext.Provider value={{ drawerOpen, openDrawer, closeDrawer }}>
      {children}
    </CartContext.Provider>
  );
}
