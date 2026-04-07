import React from 'react';

export default function FinancialReport() {
  return (
    <div className="p-4">
      <div className="bg-white border border-gray-200 rounded shadow-sm">
        <div className="px-4 py-3 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Q3 季度财务报告分析</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700 mb-2">季度收入</h3>
              <p className="text-2xl font-bold text-blue-600">$1,250,000</p>
              <p className="text-sm text-green-600 mt-1">↑ 12.5% 环比增长</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700 mb-2">季度利润</h3>
              <p className="text-2xl font-bold text-green-600">$320,000</p>
              <p className="text-sm text-green-600 mt-1">↑ 8.3% 环比增长</p>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">收入趋势</h3>
            <div className="h-64 bg-gray-100 rounded-lg flex items-end justify-around p-4">
              {[650000, 820000, 950000, 1250000].map((value, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div 
                    className="w-16 bg-blue-600 rounded-t-md transition-all duration-500" 
                    style={{ height: `${(value / 1500000) * 100}%` }}
                  ></div>
                  <span className="text-xs text-gray-600 mt-2">Q{index + 1}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="border border-gray-200 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700 mb-2">运营成本</h3>
              <p className="text-lg font-semibold">$780,000</p>
              <p className="text-xs text-gray-500 mt-1">占收入 62.4%</p>
            </div>
            <div className="border border-gray-200 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700 mb-2">市场费用</h3>
              <p className="text-lg font-semibold">$150,000</p>
              <p className="text-xs text-gray-500 mt-1">占收入 12.0%</p>
            </div>
            <div className="border border-gray-200 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700 mb-2">研发投入</h3>
              <p className="text-lg font-semibold">$210,000</p>
              <p className="text-xs text-gray-500 mt-1">占收入 16.8%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
