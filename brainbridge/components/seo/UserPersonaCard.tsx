'use client';

import { motion } from 'framer-motion';
import { User, Briefcase, GraduationCap, BookOpen, Code } from 'lucide-react';

interface UserPersonaCardProps {
  category: string;
  name: string;
  role: string;
  painPoints: string[];
  goals: string[];
}

const categoryIcons = {
  Developer: Code,
  Writer: BookOpen,
  Researcher: GraduationCap,
  Student: GraduationCap
};

export function UserPersonaCard({ category, name, role, painPoints, goals }: UserPersonaCardProps) {
  const IconComponent = categoryIcons[category as keyof typeof categoryIcons] || User;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white border border-slate-200 p-8 rounded-md"
    >
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
          <IconComponent className="w-8 h-8 text-red-600" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-900">{name}</h3>
          <p className="text-slate-600">{role}</p>
          <p className="text-sm text-red-600 font-medium mt-1">{category}</p>
        </div>
      </div>
      
      <div className="space-y-6">
        <div>
          <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-red-600" />
            Pain Points
          </h4>
          <ul className="space-y-2">
            {painPoints.map((point, index) => (
              <li key={index} className="flex items-start gap-2 text-slate-600">
                <span className="w-1.5 h-1.5 bg-red-600 rounded-full flex-shrink-0 mt-2"></span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-red-600" />
            Goals
          </h4>
          <ul className="space-y-2">
            {goals.map((goal, index) => (
              <li key={index} className="flex items-start gap-2 text-slate-600">
                <span className="w-1.5 h-1.5 bg-red-600 rounded-full flex-shrink-0 mt-2"></span>
                <span>{goal}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}
