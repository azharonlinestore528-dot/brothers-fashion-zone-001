'use client';

import { motion, AnimatePresence } from 'framer-motion';
import * as Accordion from '@radix-ui/react-accordion';
import { ChevronDown } from 'lucide-react';

const FAQS = [
  {
    q: "WHAT IS BROTHER'S FASHION ZONE?",
    a: "Brother's Fashion Zone is India's curated fashion platform offering premium clothing, ethnic wear, footwear, and accessories — all quality-checked and delivered across India.",
  },
  {
    q: 'IS IT SAFE TO SHOP ONLINE?',
    a: 'Yes. Every payment is secured via UPI, all orders come with tracking, and we offer a 7-day easy return policy. Your data is never shared.',
  },
  {
    q: 'WHAT SIZES ARE AVAILABLE?',
    a: 'We carry XS to XXXL in clothing, UK 3 to UK 12 in footwear, and Free Size options across accessories. Check our Size Guide on each product page.',
  },
  {
    q: 'WHAT TYPES OF CLOTHES ARE AVAILABLE?',
    a: "Men's wear, women's wear, ethnic (kurtas, sarees, sherwanis), western, footwear, watches, bags, and accessories.",
  },
];

export function FAQSection() {
  return (
    <section id="faq" className="bg-black border-b-2 border-yellow-400 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-display font-black text-3xl md:text-4xl uppercase text-white leading-[0.95]">
          FREQUENTLY ASKED QUESTIONS
        </h2>
        <p className="font-mono text-[13px] text-white/60 mt-3">
          Everything you need to know about shopping at Brother&apos;s Fashion Zone
        </p>

        <Accordion.Root type="single" collapsible className="mt-8">
          {FAQS.map((faq, idx) => (
            <Accordion.Item key={idx} value={`item-${idx}`} className="border-2 border-white border-b-0 last:border-b-2 last:border-t-0 border-t-0">
              <Accordion.Trigger className="AccordionTrigger w-full bg-white border-b-2 border-black flex items-center justify-between px-6 py-5 group">
                <span className="font-display font-black text-[15px] uppercase text-black text-left">
                  {faq.q}
                </span>
                <ChevronDown
                  size={20}
                  className="text-black transition-transform duration-300 group-data-[state=open]:rotate-180 flex-shrink-0 ml-4"
                />
              </Accordion.Trigger>
              <AnimatePresence>
                <Accordion.Content className="AccordionContent bg-white border-b-2 border-black overflow-hidden">
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="px-6 py-4 pb-6"
                  >
                    <p className="font-mono text-[13px] text-black leading-relaxed">
                      {faq.a}
                    </p>
                  </motion.div>
                </Accordion.Content>
              </AnimatePresence>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      </div>
    </section>
  );
}
