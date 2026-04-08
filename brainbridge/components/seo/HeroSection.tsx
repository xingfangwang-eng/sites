'use client';

import { motion } from 'framer-motion';
import { Brain, Zap } from 'lucide-react';

interface HeroSectionProps {
  title: string;
  subtitle: string;
  variant: 'solid' | 'gradient';
  buttonText: string;
  buttonLink: string;
}

export function HeroSection({ title, subtitle, variant, buttonText, buttonLink }: HeroSectionProps) {
  return (
    <section 
      className={`py-20 px-6 ${variant === 'solid' ? 'bg-red-600' : 'bg-gradient-to-br from-red-600 to-orange-500'}`}
      style={variant === 'gradient' ? {
        backgroundImage: variant === 'gradient' ? 
          'linear-gradient(135deg, #dc2626 0%, #ea580c 100%), repeating-linear-gradient(45deg, rgba(255,255,255,0.1) 0px, rgba(255,255,255,0.1) 1px, transparent 1px, transparent 10px)' : 
          'none'
      } : {}}
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
              <Brain className="w-8 h-8 text-red-600" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tighter">
            {title}
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
            {subtitle}
          </p>
          <a
            href={buttonLink}
            className="inline-flex items-center gap-2 bg-white text-red-600 font-bold py-4 px-8 rounded-md hover:bg-white/90 transition-colors active:scale-95"
          >
            {buttonText}
            <Zap className="w-5 h-5" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
