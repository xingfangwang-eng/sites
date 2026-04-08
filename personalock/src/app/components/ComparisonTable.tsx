import React from 'react';

interface ComparisonTableProps {
  templateType: string;
  className?: string;
}

interface ComparisonData {
  metric: string;
  defaultLLM: string;
  withYourDNA: string;
}

const getComparisonData = (templateType: string): ComparisonData[] => {
  const baseData: ComparisonData[] = [
    {
      metric: 'Vocabulary Variety',
      defaultLLM: 'Limited to common words and phrases, lacks specificity',
      withYourDNA: 'Reflects your unique word choices and specialized terminology'
    },
    {
      metric: 'Sentence Rhythm',
      defaultLLM: 'Uniform sentence structure, predictable flow',
      withYourDNA: 'Matches your natural speaking/writing rhythm and cadence'
    },
    {
      metric: 'Emotional Resonance',
      defaultLLM: 'Generic emotional tone, lacks personal connection',
      withYourDNA: 'Captures your authentic emotional voice and nuances'
    },
    {
      metric: 'Cliche Density',
      defaultLLM: 'High usage of overused phrases and expressions',
      withYourDNA: 'Minimal cliches, more original and fresh language'
    }
  ];

  // 根据 template_type 调整表格内容
  switch (templateType) {
    case 'CLICHE_KILLER':
      return baseData.map(item => ({
        ...item,
        defaultLLM: item.metric === 'Cliche Density' 
          ? 'Extremely high cliche usage, generic and unoriginal' 
          : item.defaultLLM,
        withYourDNA: item.metric === 'Cliche Density' 
          ? 'Virtually no cliches, completely original expression' 
          : item.withYourDNA
      }));
    case 'IDENTITY_LOCK':
      return baseData.map(item => ({
        ...item,
        defaultLLM: item.metric === 'Emotional Resonance' 
          ? 'No emotional consistency, generic tone' 
          : item.defaultLLM,
        withYourDNA: item.metric === 'Emotional Resonance' 
          ? 'Perfectly matches your emotional tone and personality' 
          : item.withYourDNA
      }));
    case 'PLATFORM_ADAPTOR':
      return baseData.map(item => ({
        ...item,
        defaultLLM: item.metric === 'Sentence Rhythm' 
          ? 'Does not adapt to platform-specific rhythm requirements' 
          : item.defaultLLM,
        withYourDNA: item.metric === 'Sentence Rhythm' 
          ? 'Adapts your rhythm to fit platform-specific expectations' 
          : item.withYourDNA
      }));
    case 'GENERAL_FIX':
    default:
      return baseData;
  }
};

export default function ComparisonTable({ templateType, className = '' }: ComparisonTableProps) {
  const comparisonData = getComparisonData(templateType);

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="min-w-full border border-slate-200">
        <thead>
          <tr className="bg-slate-100">
            <th className="border border-slate-200 px-6 py-3 text-left font-semibold text-slate-700">
              Metric
            </th>
            <th className="border border-slate-200 px-6 py-3 text-left font-semibold text-slate-700">
              Default LLM
            </th>
            <th className="border border-slate-200 px-6 py-3 text-left font-semibold text-slate-700">
              With Your DNA
            </th>
          </tr>
        </thead>
        <tbody>
          {comparisonData.map((item, index) => (
            <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
              <td className="border border-slate-200 px-6 py-4 font-medium text-slate-900">
                {item.metric}
              </td>
              <td className="border border-slate-200 px-6 py-4 text-slate-600">
                {item.defaultLLM}
              </td>
              <td className="border border-slate-200 px-6 py-4 text-slate-600">
                {item.withYourDNA}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
