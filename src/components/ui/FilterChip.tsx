'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface FilterChipProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
  onRemove?: () => void;
  removable?: boolean;
}

export function FilterChip({ label, active = false, onClick, onRemove, removable = false }: FilterChipProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`relative flex items-center gap-2 px-3 py-1.5 border-2 border-black font-display font-bold text-[11px] uppercase transition-all duration-150 ${
        active
          ? 'bg-yellow-400 text-black'
          : 'bg-white text-black hover:bg-yellow-400'
      }`}
    >
      {label}
      <AnimatePresence>
        {removable && onRemove && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="ml-1"
          >
            <X size={12} />
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
