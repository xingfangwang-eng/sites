'use client';

import { motion } from 'framer-motion';
import { Zap, CreditCard } from 'lucide-react';

interface QuickActionProps {
  category: string;
  buttonLink: string;
  buttonText?: string;
}

const buttonTexts = {
  Developer: [
    'Boost My Code',
    'Optimize My Workflow',
    'Supercharge My Development',
    'Level Up My Coding'
  ],
  Writer: [
    'Enhance My Writing',
    'Streamline My Content',
    'Elevate My Words',
    'Boost My Creativity'
  ],
  Researcher: [
    'Save My Research',
    'Organize My Findings',
    'Accelerate My Analysis',
    'Optimize My Research'
  ],
  Student: [
    'Improve My Studies',
    'Enhance My Learning',
    'Boost My Academic Performance',
    'Simplify My Homework'
  ]
};

export function QuickAction({ category, buttonLink, buttonText: propButtonText }: QuickActionProps) {
  const getRandomButtonText = () => {
    const texts = buttonTexts[category as keyof typeof buttonTexts] || buttonTexts.Developer;
    return texts[Math.floor(Math.random() * texts.length)];
  };
  
  const buttonText = propButtonText || getRandomButtonText();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-red-600 rounded-md overflow-hidden"
    >
      <div className="p-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
            <CreditCard className="w-8 h-8 text-red-600" />
          </div>
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">
          Lifetime Access
        </h3>
        <p className="text-4xl font-black text-white mb-6">
          $6.9
        </p>
        <p className="text-white/90 mb-8 max-w-md mx-auto">
          Get unlimited access to BrainBridge's full suite of features. No monthly fees, no hidden costs.
        </p>
        <a
          href={buttonLink}
          className="inline-flex items-center gap-2 bg-white text-red-600 font-bold py-4 px-8 rounded-md hover:bg-white/90 transition-colors active:scale-95"
        >
          {buttonText}
          <Zap className="w-5 h-5" />
        </a>
      </div>
    </motion.div>
  );
}
