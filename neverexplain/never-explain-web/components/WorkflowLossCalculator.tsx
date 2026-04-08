"use client";

import { useState, useEffect } from "react";

interface WorkflowLossCalculatorProps {
  category?: "coding" | "marketing" | "general";
}

export default function WorkflowLossCalculator({ category = "general" }: WorkflowLossCalculatorProps) {
  // 根据分类设置默认值
  const getDefaultValues = () => {
    switch (category) {
      case "coding":
        return {
          chatsPerMonth: 50,
          minsPerChat: 10,
          hourlyRate: 80
        };
      case "marketing":
        return {
          chatsPerMonth: 30,
          minsPerChat: 8,
          hourlyRate: 50
        };
      default:
        return {
          chatsPerMonth: 40,
          minsPerChat: 5,
          hourlyRate: 60
        };
    }
  };

  const defaultValues = getDefaultValues();
  
  // 状态管理
  const [chatsPerMonth, setChatsPerMonth] = useState(defaultValues.chatsPerMonth);
  const [minsPerChat, setMinsPerChat] = useState(defaultValues.minsPerChat);
  const [hourlyRate, setHourlyRate] = useState(defaultValues.hourlyRate);
  
  // 计算结果
  const calculateLoss = () => {
    const monthlyTimeWasted = chatsPerMonth * minsPerChat;
    const annualLoss = monthlyTimeWasted * 12 * (hourlyRate / 60);
    
    return {
      monthlyTimeWasted,
      annualLoss
    };
  };
  
  const { monthlyTimeWasted, annualLoss } = calculateLoss();
  
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <div className="p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
            <div className="w-1 bg-red-600 h-8 mr-4"></div>
            Workflow Loss Calculator
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 左侧：输入滑块 */}
            <div className="space-y-6">
              {/* 每月对话数量 */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Monthly Chats
                </label>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={chatsPerMonth}
                    onChange={(e) => setChatsPerMonth(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-500">1</span>
                    <span className="text-lg font-semibold text-slate-900">{chatsPerMonth}</span>
                    <span className="text-sm text-slate-500">100</span>
                  </div>
                </div>
              </div>
              
              {/* 每次对话所需时间 */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Minutes per Chat
                </label>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="1"
                    max="30"
                    value={minsPerChat}
                    onChange={(e) => setMinsPerChat(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-500">1 min</span>
                    <span className="text-lg font-semibold text-slate-900">{minsPerChat} mins</span>
                    <span className="text-sm text-slate-500">30 mins</span>
                  </div>
                </div>
              </div>
              
              {/* 时薪 */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Hourly Rate
                </label>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="20"
                    max="200"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-500">$20</span>
                    <span className="text-lg font-semibold text-slate-900">${hourlyRate}</span>
                    <span className="text-sm text-slate-500">$200</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 右侧：计算结果 */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 flex flex-col justify-center">
              <h3 className="text-lg font-semibold text-slate-700 mb-4">Calculation Results</h3>
              
              <div className="space-y-6">
                {/* 每年损失 */}
                <div>
                  <p className="text-sm text-slate-500 mb-1">Annual Loss</p>
                  <p className="text-4xl font-bold text-red-600">
                    ${annualLoss.toFixed(2)}
                  </p>
                </div>
                
                {/* 每月浪费时间 */}
                <div>
                  <p className="text-sm text-slate-500 mb-1">Monthly Time Wasted</p>
                  <p className="text-3xl font-bold text-slate-900">
                    {monthlyTimeWasted} minutes
                  </p>
                </div>
                
                {/* 每年浪费时间 */}
                <div>
                  <p className="text-sm text-slate-500 mb-1">Annual Time Wasted</p>
                  <p className="text-2xl font-semibold text-slate-700">
                    {(monthlyTimeWasted * 12).toLocaleString()} minutes
                  </p>
                </div>
              </div>
              
              {/* 分类信息 */}
              <div className="mt-8 pt-4 border-t border-slate-200">
                <p className="text-sm text-slate-500">
                  Category: <span className="font-medium text-slate-700 capitalize">{category}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
