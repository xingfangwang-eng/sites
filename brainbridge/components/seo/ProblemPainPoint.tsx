'use client';

import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle, XCircle } from 'lucide-react';

interface ProblemPainPointProps {
  title: string;
  description: string;
  variant: 'comparison' | 'card';
  painPoints: string[];
  solutions?: string[];
}

export function ProblemPainPoint({ title, description, variant, painPoints, solutions = [] }: ProblemPainPointProps) {
  return (
    <section className="py-16 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">{title}</h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">{description}</p>
          </div>

          {variant === 'comparison' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-slate-50 border border-slate-200 p-8 rounded-md">
                <h3 className="text-xl font-bold text-red-600 mb-6 flex items-center gap-2">
                  <XCircle className="w-5 h-5" />
                  The Problem
                </h3>
                <ul className="space-y-4">
                  {painPoints.map((point, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-1" />
                      <span className="text-slate-600">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-slate-50 border border-slate-200 p-8 rounded-md">
                <h3 className="text-xl font-bold text-green-600 mb-6 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  The Solution
                </h3>
                <ul className="space-y-4">
                  {solutions.length > 0 ? solutions.map((solution, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
                      <span className="text-slate-600">{solution}</span>
                    </li>
                  )) : (
                    <li className="text-slate-600">BrainBridge solves all these pain points with a simple, unified solution.</li>
                  )}
                </ul>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {painPoints.map((point, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="bg-slate-50 border border-slate-200 p-6 rounded-md hover:shadow-md transition-shadow"
                >
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mb-4">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  </div>
                  <p className="text-slate-600">{point}</p>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
