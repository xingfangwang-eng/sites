'use client';

import { motion } from 'framer-motion';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  keyword: string;
  title?: string;
  faqItems?: FAQItem[];
}

export function FAQSection({ keyword, title = 'Frequently Asked Questions', faqItems: propFaqItems }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  
  // Generate default FAQ if none provided
  const generateDefaultFAQ = (): FAQItem[] => {
    const faqTemplates = [
      {
        question: `How does BrainBridge help with ${keyword}?`,
        answer: `BrainBridge helps with ${keyword} by providing a seamless way to capture, organize, and transfer context between different AI tools. It eliminates the need for manual copy-pasting and ensures your work remains consistent across platforms.`
      },
      {
        question: `Is BrainBridge compatible with all AI tools?`,
        answer: `BrainBridge is designed to work with most major AI tools including Claude, ChatGPT, Cursor, and more. Its universal API allows for easy integration with any tool that supports clipboard operations or API access.`
      },
      {
        question: `What makes BrainBridge different from other similar tools?`,
        answer: `BrainBridge stands out with its one-click memory capture, real-time syncing, and clean code extraction capabilities. It's specifically designed for developers and AI power users who need to move seamlessly between different AI platforms.`
      }
    ];
    
    return faqTemplates;
  };
  
  const faqItems = propFaqItems || generateDefaultFAQ();
  
  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  
  return (
    <section className="py-16 px-6 bg-white">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <HelpCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">{title}</h2>
          </div>
          
          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="border border-slate-200 rounded-md overflow-hidden"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex justify-between items-center p-6 text-left bg-slate-50 hover:bg-slate-100 transition-colors"
                >
                  <h3 className="font-bold text-slate-900">{item.question}</h3>
                  {openIndex === index ? (
                    <ChevronUp className="w-5 h-5 text-red-600" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  )}
                </button>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="p-6 bg-white"
                  >
                    <p className="text-slate-600">{item.answer}</p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
