'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FloatingInput } from '@/components/ui/FloatingInput';
import toast from 'react-hot-toast';
import gsap from 'gsap';

const signupSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().optional(),
  email: z.string().email('Enter a valid email'),
  password: z.string()
    .min(8, 'At least 8 characters')
    .regex(/[A-Z]/, 'Include 1 uppercase letter')
    .regex(/[0-9]/, 'Include 1 number'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type SignupFormData = z.infer<typeof signupSchema>;

function PasswordStrengthIndicator({ password }: { password: string }) {
  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    password.length >= 12,
  ];
  const strength = checks.filter(Boolean).length;

  const colors = ['#DC2626', '#F59E0B', '#3B82F6', '#16A34A'];

  return (
    <div className="flex gap-1 mt-2">
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={i}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: i * 0.05 }}
          className="h-1 flex-1 rounded-full transition-all duration-300"
          style={{ backgroundColor: i < strength ? colors[strength - 1] : '#E5E7EB' }}
        />
      ))}
    </div>
  );
}

export default function SignupPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const password = watch('password', '');

  const triggerShake = () => {
    if (cardRef.current) {
      gsap.to(cardRef.current, {
        x: 0,
        duration: 0.08,
        repeat: 5,
        yoyo: true,
        ease: 'none',
      });
    }
  };

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success('Account created! Please verify your email.');
      router.push('/auth/login');
    } catch {
      triggerShake();
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F3] flex items-center justify-center p-4">
      <motion.div
        ref={cardRef}
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="bg-white border border-[#E8E8E8] rounded-[20px] p-12 w-full max-w-[440px]"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-8"
        >
          <p className="font-serif text-[22px] text-[#1A1A1A] mb-1">Brother's Fashion Zone</p>
          <h1 className="font-serif text-[30px] text-[#1A1A1A]">Create Account</h1>
          <p className="font-inter text-[14px] text-gray-500 mt-2">Join us and start shopping</p>
        </motion.div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <FloatingInput
              label="Full Name"
              autoComplete="name"
              {...register('fullName')}
            />
            {errors.fullName && (
              <p className="font-inter text-[12px] text-red-500 mt-1">{errors.fullName.message}</p>
            )}
          </div>

          <FloatingInput
            label="Phone (Optional)"
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            {...register('phone')}
          />

          <div>
            <FloatingInput
              label="Email"
              type="email"
              autoComplete="email"
              {...register('email')}
            />
            {errors.email && (
              <p className="font-inter text-[12px] text-red-500 mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <FloatingInput
              label="Password"
              type="password"
              autoComplete="new-password"
              {...register('password')}
            />
            {errors.password && (
              <p className="font-inter text-[12px] text-red-500 mt-1">{errors.password.message}</p>
            )}
            <PasswordStrengthIndicator password={password} />
            <p className="font-inter text-[11px] text-[#999] mt-2">
              Min 8 chars, 1 uppercase, 1 number
            </p>
          </div>

          <div>
            <FloatingInput
              label="Confirm Password"
              type="password"
              autoComplete="new-password"
              {...register('confirmPassword')}
            />
            {errors.confirmPassword && (
              <p className="font-inter text-[12px] text-red-500 mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>

          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            className="w-full h-13 bg-[#1A1A1A] text-white font-inter text-[15px] font-semibold rounded-[10px] disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)] transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
                Creating account...
              </>
            ) : (
              'Create Account'
            )}
          </motion.button>
        </form>

        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 border-t border-gray-200" />
          <span className="font-inter text-[12px] text-gray-400">OR</span>
          <div className="flex-1 border-t border-gray-200" />
        </div>

        <motion.button
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.98 }}
          className="w-full h-12 border border-[#E8E8E8] bg-white font-inter text-[14px] flex items-center justify-center gap-3 hover:bg-[#F9F9F9] hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)] transition-all rounded-[10px]"
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </motion.button>

        <div className="border-t border-[#F0F0F0] my-6" />

        <Link
          href="/auth/login"
          className="block w-full h-12 border border-[#1A1A1A] font-inter text-[14px] font-semibold flex items-center justify-center gap-2 hover:bg-[#F5F5F3] transition-all rounded-[10px]"
        >
          Already have an account? Sign In
        </Link>

        <div className="border-t border-[#F0F0F0] my-6" />

        <button
          onClick={() => router.push('/')}
          className="w-full font-inter text-[13px] text-[#999] hover:text-[#1A1A1A] transition-colors"
        >
          ← Back to Homepage
        </button>
      </motion.div>
    </div>
  );
}