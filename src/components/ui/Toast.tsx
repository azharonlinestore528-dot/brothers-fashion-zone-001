'use client';

import { useEffect, useState, useCallback, useRef, ReactNode } from 'react';
import { createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Info, X } from 'lucide-react';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
  timeout?: NodeJS.Timeout;
}

interface ToastContextType {
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
}

const ToastContext = createContext<ToastContextType>({
  success: () => {},
  error: () => {},
  info: () => {},
});

export function useToast() {
  return useContext(ToastContext);
}

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
  const [isPaused, setIsPaused] = useState(false);
  const borderColor = toast.type === 'success' ? '#16A34A' : toast.type === 'error' ? '#DC2626' : '#C9B99A';
  const iconColor = toast.type === 'success' ? '#16A34A' : toast.type === 'error' ? '#DC2626' : '#C9B99A';

  return (
    <motion.div
      initial={{ x: 40, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 40, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="min-w-[300px] max-w-[380px] bg-[#1A1A1A] border border-[#2A2A2A] rounded-[10px] p-4 shadow-[0_8px_32px_rgba(0,0,0,0.3)] flex items-center gap-3 border-l-4"
      style={{ borderLeftColor: borderColor }}
    >
      {toast.type === 'success' && <CheckCircle2 size={16} className="text-[#16A34A]" />}
      {toast.type === 'error' && <XCircle size={16} className="text-[#DC2626]" />}
      {toast.type === 'info' && <Info size={16} className="text-[#C9B99A]" />}
      <span className="flex-1 font-inter text-[14px] text-white">{toast.message}</span>
      <button onClick={() => onRemove(toast.id)} className="text-white/40 hover:text-white">
        <X size={14} />
      </button>
    </motion.div>
  );
}

function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((type: Toast['type'], message: string) => {
    const id = Math.random().toString(36).slice(2);
    const timeout = setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
    setToasts((prev) => [...prev, { id, type, message, timeout }]);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => {
      const toast = prev.find((t) => t.id === id);
      if (toast?.timeout) clearTimeout(toast.timeout);
      return prev.filter((t) => t.id !== id);
    });
  };

  return (
    <ToastContext.Provider
      value={{
        success: (msg) => addToast('success', msg),
        error: (msg) => addToast('error', msg),
        info: (msg) => addToast('info', msg),
      }}
    >
      {children}
      <div className="fixed top-5 right-5 z-[100] flex flex-col gap-3">
        <AnimatePresence>
          {toasts.map((toast) => (
            <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export { ToastProvider };

export function toast(message: string, type: Toast['type'] = 'info') {
  const event = new CustomEvent('bfz-toast', { detail: { message, type } });
  if (typeof window !== 'undefined') window.dispatchEvent(event);
}