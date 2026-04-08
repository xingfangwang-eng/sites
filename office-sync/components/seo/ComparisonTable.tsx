'use client';

import React, { useEffect, useState } from 'react';

interface ComparisonTableProps {
  industryContext: string;
  seed: string; // 用于生成一致的随机排序
}

export function ComparisonTable({ industryContext, seed }: ComparisonTableProps) {
  const [comparisonData, setComparisonData] = useState<any[]>([]);
  const [dimensions, setDimensions] = useState<string[]>([]);

  // 生成对比数据
  useEffect(() => {
    // 基础对比数据
    const baseData = [
      {
        name: 'Traditional Cloud Gaming',
        risk: 'High Risk',
        bandwidth: 95, // 高带宽特征，易检测
        cpu: 85, // 高 CPU 占用
        bossKeyLatency: 70, // 高延迟
        auditTrail: 90, // 明显的审计痕迹
      },
      {
        name: 'VPN/Incognito',
        risk: 'Detectable',
        bandwidth: 75, // 中等带宽特征
        cpu: 60, // 中等 CPU 占用
        bossKeyLatency: 45, // 中等延迟
        auditTrail: 65, // 可检测的审计痕迹
      },
      {
        name: 'StealthPlay',
        risk: '0 Risk',
        bandwidth: 15, // 低带宽特征，不易检测
        cpu: 20, // 低 CPU 占用
        bossKeyLatency: 10, // 低延迟
        auditTrail: 5, // 几乎无审计痕迹
      },
    ];

    // 基础维度
    const baseDimensions = [
      'Bandwidth Signature',
      'CPU Footprint',
      'Boss-Key Latency',
      'IT Audit Trail',
    ];

    // 生成基于 seed 的随机数
    const getRandom = (min: number, max: number) => {
      const hash = seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const random = (hash % (max - min + 1)) + min;
      return random;
    };

    // 随机交换数据行
    const shuffledData = [...baseData].sort(() => getRandom(0, 1) - 0.5);

    // 随机交换维度列
    const shuffledDimensions = [...baseDimensions].sort(() => getRandom(0, 1) - 0.5);

    // 微调对比数值（±5%）
    const adjustedData = shuffledData.map(item => ({
      ...item,
      bandwidth: Math.max(0, Math.min(100, Math.round(item.bandwidth * (0.95 + getRandom(0, 10) / 100)))),
      cpu: Math.max(0, Math.min(100, Math.round(item.cpu * (0.95 + getRandom(0, 10) / 100)))),
      bossKeyLatency: Math.max(0, Math.min(100, Math.round(item.bossKeyLatency * (0.95 + getRandom(0, 10) / 100)))),
      auditTrail: Math.max(0, Math.min(100, Math.round(item.auditTrail * (0.95 + getRandom(0, 10) / 100)))),
    }));

    setComparisonData(adjustedData);
    setDimensions(shuffledDimensions);
  }, [industryContext, seed]);

  // 根据行业获取颜色
  const getIndustryColor = () => {
    switch (industryContext.toLowerCase()) {
      case 'fintech':
      case 'finance':
        return 'border-emerald-200';
      case 'legal tech':
      case 'legal':
        return 'border-purple-200';
      case 'healthcare':
        return 'border-red-200';
      case 'public sector':
        return 'border-blue-200';
      default:
        return 'border-slate-200';
    }
  };

  // 生成评分条
  const renderScoreBar = (score: number, isGood: boolean) => {
    return (
      <div className="w-full bg-slate-200 rounded-full h-2.5">
        <div 
          className={`h-2.5 rounded-full ${isGood ? 'bg-green-500' : 'bg-red-500'}`}
          style={{ width: `${score}%` }}
        />
      </div>
    );
  };

  return (
    <div className="overflow-x-auto">
      <table className={`w-full border-collapse ${getIndustryColor()}`}>
        <thead>
          <tr className="bg-slate-100">
            <th className="border p-4 text-left">Solution</th>
            <th className="border p-4 text-left">Risk Level</th>
            {dimensions.map((dimension, index) => (
              <th key={index} className="border p-4 text-left">{dimension}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {comparisonData.map((item, index) => (
            <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
              <td className="border p-4 font-medium">{item.name}</td>
              <td className="border p-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  item.risk === '0 Risk' ? 'bg-green-100 text-green-800' :
                  item.risk === 'Detectable' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {item.risk}
                </span>
              </td>
              <td className="border p-4">
                {renderScoreBar(item.bandwidth, item.name === 'StealthPlay')}
                <div className="text-xs text-slate-500 mt-1">{item.bandwidth}/100</div>
              </td>
              <td className="border p-4">
                {renderScoreBar(item.cpu, item.name === 'StealthPlay')}
                <div className="text-xs text-slate-500 mt-1">{item.cpu}/100</div>
              </td>
              <td className="border p-4">
                {renderScoreBar(item.bossKeyLatency, item.name === 'StealthPlay')}
                <div className="text-xs text-slate-500 mt-1">{item.bossKeyLatency}/100</div>
              </td>
              <td className="border p-4">
                {renderScoreBar(item.auditTrail, item.name === 'StealthPlay')}
                <div className="text-xs text-slate-500 mt-1">{item.auditTrail}/100</div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
