'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { X, Plus, Minus, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore, CartItem } from '@/store/cartStore';
import { STORE } from '@/lib/constants';

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, removeItem, updateQuantity, clearCart, getTotal } = useCartStore();
  const total = getTotal();

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-[420px] bg-white border-l-2 border-black z-[101] hidden md:flex flex-col"
          >
            <CartDrawerContent
              items={items}
              total={total}
              itemCount={itemCount}
              onClose={onClose}
              onRemove={removeItem}
              onUpdateQty={updateQuantity}
              onClear={clearCart}
            />
          </motion.div>

          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 h-[90vh] bg-white rounded-t-[20px] border-t-2 border-black z-[101] md:hidden flex flex-col"
          >
            <CartDrawerContent
              items={items}
              total={total}
              itemCount={itemCount}
              onClose={onClose}
              onRemove={removeItem}
              onUpdateQty={updateQuantity}
              onClear={clearCart}
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

interface CartDrawerContentProps {
  items: CartItem[];
  total: number;
  itemCount: number;
  onClose: () => void;
  onRemove: (id: string, size: string) => Promise<void>;
  onUpdateQty: (id: string, size: string, qty: number) => Promise<void>;
  onClear: () => Promise<void>;
}

function CartDrawerContent({
  items,
  total,
  itemCount,
  onClose,
  onRemove,
  onUpdateQty,
  onClear,
}: CartDrawerContentProps) {
  const deliveryText = total >= STORE.freeDelivery
    ? '✓ Free delivery applied'
    : `Add ₹${(STORE.freeDelivery - total).toLocaleString()} more for free delivery`;

  return (
    <>
      <div className="flex items-center justify-between p-4 border-b-2 border-black">
        <h2 className="font-display font-black text-[20px]">
          Your Cart ({itemCount} {itemCount === 1 ? 'item' : 'items'})
        </h2>
        <button
          onClick={onClose}
          className="w-10 h-10 flex items-center justify-center border-2 border-black hover:bg-gray-100 transition-colors"
          aria-label="Close cart"
        >
          <X size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {items.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <span className="text-3xl">🛒</span>
            </div>
            <p className="font-display font-bold text-lg mb-4">Your cart is empty</p>
            <Link
              href="/products"
              onClick={onClose}
              className="inline-block bg-yellow-400 text-black px-6 py-3 font-display font-bold border-2 border-black shadow-[3px_3px_0px_#0A0A0A] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
            >
              BROWSE PRODUCTS
            </Link>
          </div>
        ) : (
          items.map((item) => (
            <div
              key={`${item.id}-${item.variant.size}`}
              className="flex gap-3 border-2 border-black p-3 bg-white"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-[60px] h-[80px] object-cover border border-black"
              />
              <div className="flex-1">
                <Link
                  href={`/products/${item.id}`}
                  onClick={onClose}
                  className="font-display font-bold text-sm hover:underline"
                >
                  {item.name}
                </Link>
                <p className="font-mono text-xs text-gray-600 mt-1">
                  Size: {item.variant.size}
                  {item.variant.color && ` • ${item.variant.color}`}
                </p>
                <p className="font-mono font-bold text-sm mt-1">
                  ₹{item.price.toLocaleString()}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center border-2 border-black">
                    <button
                      onClick={() => onUpdateQty(item.id, item.variant.size, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="w-8 text-center font-mono text-sm">{item.quantity}</span>
                    <button
                      onClick={() => onUpdateQty(item.id, item.variant.size, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                  <button
                    onClick={() => onRemove(item.id, item.variant.size)}
                    className="text-red-600 hover:text-red-700 transition-colors"
                    aria-label="Remove item"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {items.length > 0 && (
        <div className="p-4 border-t-2 border-black bg-gray-50">
          <div className="space-y-2 mb-4">
            <div className="flex justify-between font-mono text-sm">
              <span>Subtotal</span>
              <span>₹{total.toLocaleString()}</span>
            </div>
            <p className={`font-mono text-xs ${total >= STORE.freeDelivery ? 'text-green-600' : 'text-gray-600'}`}>
              {deliveryText}
            </p>
          </div>
          <Link
            href="/checkout/details"
            onClick={onClose}
            className="block w-full bg-yellow-400 text-black h-[52px] flex items-center justify-center font-display font-bold text-lg border-2 border-black shadow-[3px_3px_0px_#0A0A0A] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
          >
            CHECKOUT →
          </Link>
        </div>
      )}
    </>
  );
}
