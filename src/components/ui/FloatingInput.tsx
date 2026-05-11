'use client';

import { useState, useId, forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, CheckCircle2, XCircle } from 'lucide-react';

interface FloatingInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  type?: 'text' | 'email' | 'password' | 'tel';
  error?: string;
  isValid?: boolean;
  prefix?: string;
}

export const FloatingInput = forwardRef<HTMLInputElement, FloatingInputProps>(({
  label,
  type = 'text',
  value,
  error,
  isValid,
  autoComplete,
  prefix,
  maxLength,
  inputMode,
  onChange,
  ...rest
}, ref) => {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const id = useId();
  const internalValue = typeof value === 'string' ? value : '';
  const filled = internalValue.length > 0;
  const isPassword = type === 'password';

  return (
    <div className="relative">
      <div className="relative">
        {prefix && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-[14px] text-gray-400 bg-transparent">
            {prefix}
          </span>
        )}
        <input
          ref={ref}
          id={id}
          type={isPassword ? (showPassword ? 'text' : 'password') : type}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          autoComplete={autoComplete}
          maxLength={maxLength}
          inputMode={inputMode}
          placeholder=" "
          className={`peer w-full h-14 px-4 ${prefix ? 'pl-14' : ''} ${isPassword ? 'pr-12' : ''} border-2 bg-white font-inter text-[15px] transition-all focus:outline-none ${
            error
              ? 'border-red-500 focus:border-red-500'
              : isValid
              ? 'border-green-500 focus:border-green-500'
              : focused
              ? 'border-[#C9B99A] shadow-[0_0_0_3px_rgba(201,185,154,0.15)]'
              : 'border-gray-200 hover:border-gray-300'
          }`}
          {...rest}
        />
        <label
          htmlFor={id}
          className={`absolute transition-all duration-200 pointer-events-none ${
            prefix ? 'left-14' : 'left-4'
          } ${
            focused || filled ? 'top-2 text-[11px]' : 'top-4 text-[14px]'
          } ${
            error
              ? 'text-red-500'
              : focused || filled
              ? 'text-[#C9B99A]'
              : 'text-gray-400'
          }`}
        >
          {label}
        </label>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
          <AnimatePresence>
            {isValid && !error && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="text-green-500"
              >
                <CheckCircle2 size={18} />
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="text-red-500"
              >
                <XCircle size={18} />
              </motion.div>
            )}
          </AnimatePresence>
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}
        </div>
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="mt-1 font-inter text-[12px] text-red-500 flex items-center gap-1"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
});

FloatingInput.displayName = 'FloatingInput';