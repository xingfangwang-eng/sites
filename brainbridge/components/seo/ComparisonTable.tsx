'use client';

import { motion } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, DollarSign, Layers, RefreshCw, ShieldCheck } from 'lucide-react';

interface ComparisonTableProps {
  keyword: string;
  relatedTools: string[];
}

export function ComparisonTable({ keyword, relatedTools }: ComparisonTableProps) {
  // Get the first related tool for context
  const primaryTool = relatedTools[0] || 'AI tools';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white border border-slate-200 p-8 rounded-md"
    >
      <h2 className="text-2xl font-bold mb-6 text-slate-900">
        Workflow Comparison: {keyword}
      </h2>
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-800 text-white">
              <th className="p-4 text-left">Feature</th>
              <th className="p-4 text-center">Manual Copy-Paste</th>
              <th className="p-4 text-center">BrainBridge (SO)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {/* Context Retention */}
            <tr className="hover:bg-slate-50 transition-colors">
              <td className="p-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-slate-600" />
                  <span className="font-medium">Context Retention</span>
                </div>
                <p className="text-sm text-slate-500 mt-1">
                  Preserves full context when switching between {primaryTool}
                </p>
              </td>
              <td className="p-4 text-center">
                <div className="flex flex-col items-center">
                  <AlertCircle className="w-8 h-8 text-amber-500 mb-2" />
                  <span className="text-sm text-slate-600">Partial</span>
                </div>
              </td>
              <td className="p-4 text-center">
                <div className="flex flex-col items-center">
                  <CheckCircle className="w-8 h-8 text-green-500 mb-2" />
                  <span className="text-sm text-slate-600">Full</span>
                </div>
              </td>
            </tr>
            
            {/* Formatting Cleanup */}
            <tr className="hover:bg-slate-50 transition-colors">
              <td className="p-4">
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-5 h-5 text-slate-600" />
                  <span className="font-medium">Formatting Cleanup</span>
                </div>
                <p className="text-sm text-slate-500 mt-1">
                  Removes garbage Markdown and invisible characters
                </p>
              </td>
              <td className="p-4 text-center">
                <div className="flex flex-col items-center">
                  <XCircle className="w-8 h-8 text-red-500 mb-2" />
                  <span className="text-sm text-slate-600">Manual</span>
                </div>
              </td>
              <td className="p-4 text-center">
                <div className="flex flex-col items-center">
                  <CheckCircle className="w-8 h-8 text-green-500 mb-2" />
                  <span className="text-sm text-slate-600">Automatic</span>
                </div>
              </td>
            </tr>
            
            {/* Cross-Platform Sync */}
            <tr className="hover:bg-slate-50 transition-colors">
              <td className="p-4">
                <div className="flex items-center gap-2">
                  <Layers className="w-5 h-5 text-slate-600" />
                  <span className="font-medium">Cross-Platform Sync</span>
                </div>
                <p className="text-sm text-slate-500 mt-1">
                  Syncs between {relatedTools.join(' and ')}
                </p>
              </td>
              <td className="p-4 text-center">
                <div className="flex flex-col items-center">
                  <XCircle className="w-8 h-8 text-red-500 mb-2" />
                  <span className="text-sm text-slate-600">No</span>
                </div>
              </td>
              <td className="p-4 text-center">
                <div className="flex flex-col items-center">
                  <CheckCircle className="w-8 h-8 text-green-500 mb-2" />
                  <span className="text-sm text-slate-600">Yes</span>
                </div>
              </td>
            </tr>
            
            {/* Cost */}
            <tr className="hover:bg-slate-50 transition-colors">
              <td className="p-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-slate-600" />
                  <span className="font-medium">Cost</span>
                </div>
                <p className="text-sm text-slate-500 mt-1">
                  Annual cost in time and money
                </p>
              </td>
              <td className="p-4 text-center">
                <div className="flex flex-col items-center">
                  <AlertCircle className="w-8 h-8 text-amber-500 mb-2" />
                  <span className="text-sm font-bold text-slate-800">$1,250+</span>
                  <span className="text-xs text-slate-500">in lost productivity</span>
                </div>
              </td>
              <td className="p-4 text-center">
                <div className="flex flex-col items-center">
                  <CheckCircle className="w-8 h-8 text-green-500 mb-2" />
                  <span className="text-sm font-bold text-slate-800">$6.90</span>
                  <span className="text-xs text-slate-500">one-time payment</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      {/* Rich Snippets Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            'name': 'BrainBridge',
            'description': `A tool to bridge the gap between ${relatedTools.join(' and ')} for ${keyword}`,
            'offers': {
              '@type': 'Offer',
              'price': '6.90',
              'priceCurrency': 'USD',
              'availability': 'https://schema.org/InStock'
            },
            'aggregateRating': {
              '@type': 'AggregateRating',
              'ratingValue': '4.9',
              'reviewCount': '1000'
            }
          })
        }}
      />
    </motion.div>
  );
}
