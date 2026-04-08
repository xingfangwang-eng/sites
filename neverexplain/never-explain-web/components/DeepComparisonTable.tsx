import { useState } from "react";

interface DeepComparisonTableProps {
  category: "coding" | "copywriting" | "general";
}

export default function DeepComparisonTable({ category }: DeepComparisonTableProps) {
  // 基础对比维度
  const baseDimensions = [
    {
      name: "Feature Name",
      manual: "Manual Copy-Paste",
      chatgpt: "ChatGPT Native Memory",
      neverexplain: "NeverExplain (/recall)"
    },
    {
      name: "Setup Time",
      manual: "Before each conversation",
      chatgpt: "First-time setup",
      neverexplain: "One-time setup, permanent use"
    },
    {
      name: "Context Retention",
      manual: "Lost after session ends",
      chatgpt: "Within limited sessions",
      neverexplain: "Permanent retention"
    },
    {
      name: "Cross-platform Use",
      manual: "Requires manual copy",
      chatgpt: "ChatGPT only",
      neverexplain: "Multi-platform support"
    },
    {
      name: "Update Convenience",
      manual: "Requires re-copying",
      chatgpt: "Requires retraining",
      neverexplain: "Real-time updates"
    }
  ];

  // 代码类额外维度
  const codingDimensions = [
    {
      name: "Version Control",
      manual: "None",
      chatgpt: "Limited",
      neverexplain: "Full support"
    },
    {
      name: "Code Style Enforcement",
      manual: "None",
      chatgpt: "Limited",
      neverexplain: "Strict enforcement"
    },
    {
      name: "Multi-project Switching",
      manual: "Requires re-copying",
      chatgpt: "Easily confused",
      neverexplain: "Seamless switching"
    }
  ];

  // 文案类额外维度
  const copywritingDimensions = [
    {
      name: "Brand Tone Consistency",
      manual: "Memory-dependent",
      chatgpt: "Limited guarantee",
      neverexplain: "Strict adherence"
    },
    {
      name: "Audience Profile Switching",
      manual: "Requires re-explanation",
      chatgpt: "Easily confused",
      neverexplain: "Precise switching"
    },
    {
      name: "Prohibited Word Filtering",
      manual: "None",
      chatgpt: "Limited",
      neverexplain: "Full support"
    }
  ];

  // 根据分类组合维度
  const getDimensions = () => {
    switch (category) {
      case "coding":
        return [...baseDimensions, ...codingDimensions];
      case "copywriting":
        return [...baseDimensions, ...copywritingDimensions];
      default:
        return baseDimensions;
    }
  };

  const dimensions = getDimensions();

  return (
    <div className="w-full overflow-x-auto">
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <div className="p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
            <div className="w-1 bg-red-600 h-8 mr-4"></div>
            Deep Comparison Table
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50">
                  <th className="border border-slate-200 px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Comparison Dimension
                  </th>
                  <th className="border border-slate-200 px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Manual Copy-Paste
                  </th>
                  <th className="border border-slate-200 px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    ChatGPT Native Memory
                  </th>
                  <th className="border border-slate-200 px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    NeverExplain (/recall)
                  </th>
                </tr>
              </thead>
              <tbody>
                {dimensions.map((dimension, index) => (
                  <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                    <td className="border border-slate-200 px-6 py-4 text-sm font-medium text-slate-900">
                      {dimension.name}
                    </td>
                    <td className="border border-slate-200 px-6 py-4 text-sm text-slate-600">
                      {dimension.manual}
                    </td>
                    <td className="border border-slate-200 px-6 py-4 text-sm text-slate-600">
                      {dimension.chatgpt}
                    </td>
                    <td className="border border-slate-200 px-6 py-4 text-sm text-slate-600 font-medium text-red-600">
                      {dimension.neverexplain}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* 分类信息 */}
          <div className="mt-6 pt-4 border-t border-slate-200">
            <p className="text-sm text-slate-500">
              Category: <span className="font-medium text-slate-700 capitalize">{category}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
