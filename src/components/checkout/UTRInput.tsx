'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, AlertCircle } from 'lucide-react';
import gsap from 'gsap';

interface UTRInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  loading?: boolean;
}

export function UTRInput({ value, onChange, loading }: UTRInputProps) {
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const isValid = value.length === 12;
  const isComplete = value.length >= 12;

  useEffect(() => {
    if (value.length > 0 && value.length <= 12) {
      const input = inputRef.current;
      if (input) {
        const lastChar = input.value.slice(-1);
        if (lastChar.match(/\d/)) {
          gsap.fromTo(input,
            { scale: 1.05 },
            { scale: 1, duration: 0.2, ease: 'power2.out' }
          );
        }
      }
    }
  }, [value]);

  useEffect(() => {
    if (isValid && !showSuccess) {
      setShowSuccess(true);
    }
  }, [isValid, showSuccess]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 12);
    onChange(val);
    setError(null);
  };

  return (
    <div className="space-y-4" ref={containerRef}>
      <div>
        <div className="relative">
          <label
            className={`absolute left-4 transition-all duration-200 pointer-events-none font-inter ${
              isFocused || value ? 'top-2 text-[11px]' : 'top-4 text-[14px]'
            } ${error ? 'text-red-500' : isFocused || value ? 'text-[#C9B99A]' : 'text-gray-400'
            }`}
          >
            Enter UTR / Transaction ID
          </label>
          <input
            ref={inputRef}
            type="text"
            inputMode="numeric"
            value={value}
            onChange={handleChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder=" "
            className={`w-full h-14 px-4 border-2 bg-white font-mono text-[16px] tracking-wider transition-all focus:outline-none ${
              error
                ? 'border-red-500 shadow-[4px_4px_0px_#DC2626]'
                : isValid
                ? 'border-green-500 shadow-[4px_4px_0px_#16A34A]'
                : isFocused
                ? 'border-[#6B5CE7] shadow-[4px_4px_0px_#6B5CE7]'
                : 'border-gray-200 shadow-[2px_2px_0px_#0A0A0A]'
            }`}
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <span className="font-mono text-[12px] text-gray-400">
              {value.length}/12
            </span>
            <AnimatePresence>
              {isValid && (
                <motion.div
                  initial={{ scale: 0, rotate: -90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                  className="text-green-500"
                >
                  <Check size={18} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="flex items-center gap-2 mt-2 text-red-500"
            >
              <AlertCircle size={14} />
              <span className="font-inter text-[12px]">{error}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {isValid && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-green-500 font-inter text-[13px]"
        >
          <Check size={16} />
          <span>UTR verified - ready to confirm</span>
        </motion.div>
      )}
    </div>
  );
}