'use client';

import { motion, AnimatePresence } from 'framer-motion';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';

interface SizeGuideModalProps {
  open: boolean;
  onClose: () => void;
  category: string;
  table: {
    headers: string[];
    rows: Array<Record<string, string>>;
  };
}

export function SizeGuideModal({ open, onClose, category, table }: SizeGuideModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <AnimatePresence>
        {open && (
          <>
            <Dialog.Portal>
              <Dialog.Overlay asChild>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                />
              </Dialog.Overlay>

              <Dialog.Content asChild>
                <motion.div
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'spring', stiffness: 280, damping: 28 }}
                  className="fixed top-0 right-0 h-full w-[480px] md:w-full bg-white border-l border-[#E8E8E8] p-8 z-50 overflow-y-auto"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <Dialog.Title className="font-display font-black text-2xl text-black">
                        Size Guide
                      </Dialog.Title>
                      <p className="font-inter text-[12px] text-[#C9B99A] uppercase tracking-wider mt-1">
                        {category}
                      </p>
                    </div>
                    <Dialog.Close asChild>
                      <button
                        onClick={onClose}
                        className="w-10 h-10 border-2 border-black flex items-center justify-center hover:bg-gray-100 transition-colors"
                        aria-label="Close"
                      >
                        <X size={18} />
                      </button>
                    </Dialog.Close>
                  </div>

                  <div className="mb-6">
                    <p className="font-inter text-[13px] text-gray-600">
                      Measure yourself and compare with the chart below for the perfect fit.
                    </p>
                  </div>

                  <div className="border border-[#E8E8E8] overflow-hidden mb-6">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-[#F5F5F3]">
                          {table.headers.map((header, idx) => (
                            <th
                              key={idx}
                              className="font-inter text-[11px] uppercase text-gray-500 py-3 px-4 text-left"
                            >
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {table.rows.map((row, rowIdx) => (
                          <motion.tr
                            key={rowIdx}
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: rowIdx * 0.03 }}
                            className="border-b border-[#E8E8E8] hover:bg-[#F5F5F3] transition-colors"
                          >
                            {Object.values(row).map((val, valIdx) => (
                              <td
                                key={valIdx}
                                className="font-inter text-[13px] text-black py-3 px-4"
                              >
                                {val}
                              </td>
                            ))}
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="bg-amber-50 border-l-4 border-amber-500 p-4">
                    <p className="font-inter text-[13px] text-amber-700">
                      💡 <strong>Tip:</strong> When in doubt, size up for a relaxed fit.
                    </p>
                  </div>
                </motion.div>
              </Dialog.Content>
            </Dialog.Portal>
          </>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
