'use client';

import { useEffect, useState } from 'react';
import { CartDrawer } from './CartDrawer'
import { useCartContext } from '@/components/providers/CartProvider'

export function CartDrawerWrapper() {
  const { drawerOpen, closeDrawer } = useCartContext()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return <CartDrawer open={drawerOpen} onClose={closeDrawer} />
}
