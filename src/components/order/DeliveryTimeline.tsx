'use client';

import { motion } from 'framer-motion';

interface DeliveryTimelineProps {
  currentStep?: number;
}

const steps = [
  { label: 'Order Placed', icon: '📦' },
  { label: 'Payment Verified', icon: '✅' },
  { label: 'Dispatched', icon: '🚚' },
  { label: 'Out for Delivery', icon: '📍' },
  { label: 'Delivered', icon: '🏠' },
];

export function DeliveryTimeline({ currentStep = 0 }: DeliveryTimelineProps) {
  return (
    <div className="w-full">
      <div className="hidden md:block">
        <div className="flex items-center justify-between relative">
          <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200" />
          <motion.div
            className="absolute top-5 left-0 h-0.5 bg-[#39FF14]"
            initial={{ width: '0%' }}
            animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
            transition={{ duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] }}
          />
          {steps.map((step, i) => {
            const isCompleted = i < currentStep;
            const isCurrent = i === currentStep;
            return (
              <div key={step.label} className="relative z-10 flex flex-col items-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.1, type: 'spring', stiffness: 300 }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                    isCompleted
                      ? 'bg-[#C9B99A] border-[#C9B99A]'
                      : isCurrent
                      ? 'bg-white border-[#C9B99A]'
                      : 'bg-white/20 border-gray-300'
                  }`}
                >
                  {isCompleted ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0A0A0A" strokeWidth="3">
                      <motion.path
                        d="M20 6L9 17l-5-5"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    </svg>
                  ) : isCurrent ? (
                    <motion.div
                      animate={{ scale: [1, 1.3, 1], opacity: [1, 0, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="w-4 h-4 rounded-full bg-[#C9B99A]"
                    />
                  ) : (
                    <span className="text-sm">{step.icon}</span>
                  )}
                </motion.div>
                <motion.span
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 + 0.2 }}
                  className={`mt-2 font-inter text-[11px] text-center ${
                    isCompleted || isCurrent ? 'text-[#0A0A0A]' : 'text-gray-400'
                  }`}
                >
                  {step.label}
                </motion.span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="md:hidden">
        <div className="space-y-0">
          {steps.map((step, i) => {
            const isCompleted = i < currentStep;
            const isCurrent = i === currentStep;
            const isLast = i === steps.length - 1;
            return (
              <div key={step.label} className="flex items-start gap-4">
                <div className="relative flex flex-col items-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.1, type: 'spring', stiffness: 300 }}
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                      isCompleted
                        ? 'bg-[#C9B99A] border-[#C9B99A]'
                        : isCurrent
                        ? 'bg-white border-[#C9B99A]'
                        : 'bg-white/20 border-gray-300'
                    }`}
                  >
                    {isCompleted ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0A0A0A" strokeWidth="3">
                        <motion.path
                          d="M20 6L9 17l-5-5"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 0.3 }}
                        />
                      </svg>
                    ) : isCurrent ? (
                      <motion.div
                        animate={{ scale: [1, 1.3, 1], opacity: [1, 0, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="w-4 h-4 rounded-full bg-[#C9B99A]"
                      />
                    ) : (
                      <span className="text-sm">{step.icon}</span>
                    )}
                  </motion.div>
                  {!isLast && (
                    <div className="w-0.5 h-12 bg-gray-200 mt-2">
                      <motion.div
                        className="w-full bg-[#39FF14]"
                        initial={{ height: '0%' }}
                        animate={{ height: isCompleted ? '100%' : '0%' }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  )}
                </div>
                <div className="pt-2 pb-8">
                  <p className={`font-inter text-[14px] font-semibold ${
                    isCompleted || isCurrent ? 'text-[#0A0A0A]' : 'text-gray-400'
                  }`}>
                    {step.label}
                  </p>
                  {isCurrent && (
                    <p className="font-inter text-[12px] text-gray-500 mt-1">In progress</p>
                  )}
                  {isCompleted && (
                    <p className="font-inter text-[12px] text-green-600 mt-1">Completed</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}