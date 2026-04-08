'use client';

import React, { useState, useEffect } from 'react';

interface StealthROICalculatorProps {
  industry: string;
}

export function StealthROICalculator({ industry }: StealthROICalculatorProps) {
  const [hourlyWage, setHourlyWage] = useState<number>(30);
  const [hoursGamed, setHoursGamed] = useState<number>(5);
  const [riskLevel, setRiskLevel] = useState<number>(5);
  const [valueOfGamedTime, setValueOfGamedTime] = useState<number>(0);
  const [mentalHealthPremium, setMentalHealthPremium] = useState<number>(0);
  const [totalROI, setTotalROI] = useState<number>(0);
  const [personalizedAdvice, setPersonalizedAdvice] = useState<string>('');

  // 计算 ROI
  useEffect(() => {
    // 计算被支付的游戏价值
    const value = hourlyWage * hoursGamed;
    setValueOfGamedTime(value);

    // 计算心理健康溢价（基于风险水平和游戏时间）
    const mentalHealthValue = hoursGamed * 15 * (1 + (riskLevel / 20));
    setMentalHealthPremium(mentalHealthValue);

    // 计算总 ROI
    const total = value + mentalHealthValue;
    setTotalROI(total);

    // 生成个性化职场建议
    generatePersonalizedAdvice(value, mentalHealthValue, total, riskLevel, hoursGamed);
  }, [hourlyWage, hoursGamed, riskLevel]);

  // 生成个性化职场建议
  const generatePersonalizedAdvice = (
    value: number,
    mentalHealthValue: number,
    total: number,
    risk: number,
    hours: number
  ) => {
    let advice = '';

    if (risk >= 8) {
      advice = `With a high risk level of ${risk}, we recommend limiting your gaming sessions to shorter bursts of 15-20 minutes. Your calculated value of $${value.toFixed(2)} in gamed time, plus $${mentalHealthValue.toFixed(2)} in mental health benefits, totals $${total.toFixed(2)} weekly. Consider using StealthPlay's advanced obfuscation features to minimize detection risk.`;
    } else if (risk >= 5) {
      advice = `At a moderate risk level of ${risk}, you can safely enjoy ${hours} hours of gaming per week, generating $${value.toFixed(2)} in value plus $${mentalHealthValue.toFixed(2)} in mental health benefits. This totals $${total.toFixed(2)} weekly. We recommend using dual monitors with one displaying legitimate work applications.`;
    } else {
      advice = `With a low risk level of ${risk}, you're in a prime position to maximize your stealth gaming ROI. Your ${hours} hours of weekly gaming is generating $${value.toFixed(2)} in value plus $${mentalHealthValue.toFixed(2)} in mental health benefits, totaling $${total.toFixed(2)} weekly. Consider using StealthPlay's full feature set to optimize your gaming experience.`;
    }

    setPersonalizedAdvice(advice);
  };

  // 根据行业获取颜色
  const getIndustryColor = () => {
    switch (industry.toLowerCase()) {
      case 'finance':
        return 'bg-emerald-50 border-emerald-200 text-emerald-800';
      case 'tech':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'legal':
        return 'bg-purple-50 border-purple-200 text-purple-800';
      case 'healthcare':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'admin':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      default:
        return 'bg-slate-50 border-slate-200 text-slate-800';
    }
  };

  // 根据行业获取强调色
  const getIndustryAccentColor = () => {
    switch (industry.toLowerCase()) {
      case 'finance':
        return 'bg-emerald-600 hover:bg-emerald-700';
      case 'tech':
        return 'bg-blue-600 hover:bg-blue-700';
      case 'legal':
        return 'bg-purple-600 hover:bg-purple-700';
      case 'healthcare':
        return 'bg-red-600 hover:bg-red-700';
      case 'admin':
        return 'bg-yellow-600 hover:bg-yellow-700';
      default:
        return 'bg-slate-600 hover:bg-slate-700';
    }
  };

  return (
    <div className={`p-8 border rounded-md ${getIndustryColor()}`}>
      <h2 className="text-2xl font-bold mb-6">Stealth Gaming ROI Calculator</h2>
      
      <div className="space-y-4 mb-8">
        <div>
          <label className="block text-sm font-medium mb-2">Hourly Wage ($)</label>
          <input
            type="number"
            min="10"
            max="200"
            step="1"
            value={hourlyWage}
            onChange={(e) => setHourlyWage(Number(e.target.value))}
            className="w-full p-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Hours Gamed per Week</label>
          <input
            type="number"
            min="1"
            max="20"
            step="0.5"
            value={hoursGamed}
            onChange={(e) => setHoursGamed(Number(e.target.value))}
            className="w-full p-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Risk Level (1-10)</label>
          <input
            type="range"
            min="1"
            max="10"
            value={riskLevel}
            onChange={(e) => setRiskLevel(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-slate-500 mt-1">
            <span>Low Risk</span>
            <span>{riskLevel}</span>
            <span>High Risk</span>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 border border-slate-200 rounded-md mb-6">
        <h3 className="text-lg font-semibold mb-4">Calculation Results</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span>Value of Gamed Time:</span>
            <span className="font-bold">${valueOfGamedTime.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Mental Health Premium:</span>
            <span className="font-bold">${mentalHealthPremium.toFixed(2)}</span>
          </div>
          <div className="border-t pt-3 mt-3 flex justify-between">
            <span className="font-semibold">Total Weekly ROI:</span>
            <span className="font-bold text-xl">${totalROI.toFixed(2)}</span>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 border border-slate-200 rounded-md">
        <h3 className="text-lg font-semibold mb-4">Personalized Workplace Advice</h3>
        <p className="text-slate-600 leading-relaxed">{personalizedAdvice}</p>
      </div>
    </div>
  );
}
