'use client';

import { motion } from 'framer-motion';
import { Zap, CheckCircle, Code, Database, Cloud, Globe } from 'lucide-react';

interface SolutionBlockProps {
  title: string;
  description: string;
  variant: 'steps' | 'features';
  steps?: {
    number: number;
    title: string;
    description: string;
  }[];
  features?: {
    icon: 'code' | 'database' | 'cloud' | 'globe';
    title: string;
    description: string;
  }[];
}

const iconMap = {
  code: Code,
  database: Database,
  cloud: Cloud,
  globe: Globe
};

export function SolutionBlock({ title, description, variant, steps = [], features = [] }: SolutionBlockProps) {
  return (
    <section className="py-16 px-6 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <Zap className="w-6 h-6 text-red-600" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">{title}</h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">{description}</p>
          </div>

          {variant === 'steps' ? (
            <div className="space-y-8">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex flex-col md:flex-row gap-6 items-start"
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-red-600 text-white flex items-center justify-center font-bold text-xl rounded-md">
                    {step.number}
                  </div>
                  <div className="flex-1 bg-white border border-slate-200 p-6 rounded-md">
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{step.title}</h3>
                    <p className="text-slate-600">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => {
                const IconComponent = iconMap[feature.icon];
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="bg-white border border-slate-200 p-6 rounded-md hover:shadow-md transition-shadow"
                  >
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mb-4">
                      <IconComponent className="w-5 h-5 text-red-600" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">{feature.title}</h3>
                    <p className="text-slate-600">{feature.description}</p>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
