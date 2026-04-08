'use client';

import React, { useState, useEffect } from 'react';
import { ExternalLink, Zap } from 'lucide-react';

interface PowerTool {
  name: string;
  description: string;
  url: string;
  icon: string;
}

const powerTools: PowerTool[] = [
  {
    name: 'NoSEO.top',
    description: 'Search for authentic results, not optimized ones',
    url: 'https://noseotop.wangdadi.xyz/',
    icon: '🔍'
  },
  {
    name: 'NukePrivacy',
    description: '100% Local video processing. No data uploaded to servers',
    url: 'https://nukeprivacy.wangdadi.xyz',
    icon: '🎬'
  },
  {
    name: 'Kill Bill Card',
    description: 'Manage and track your payment cards',
    url: 'https://killbillcard.wangdadi.xyz/',
    icon: '💳'
  },
  {
    name: 'ZeroCloud',
    description: '100% Offline Document Intelligence. Zero data leaves your machine',
    url: 'https://zerocloud.wangdadi.xyz',
    icon: '☁️'
  },
  {
    name: 'FocusInbox',
    description: 'Focus on work, focus on conversion',
    url: 'https://focusinbox.wangdadi.xyz',
    icon: '📧'
  },
  {
    name: 'SaaSKiller',
    description: 'Find and kill your zombie subscriptions',
    url: 'https://saaskiller.wangdadi.xyz',
    icon: '🔪'
  },
  {
    name: 'NoAI.md',
    description: 'A distraction-free Markdown editor. No AI, no cloud, no tracking',
    url: 'https://noaimd.wangdadi.xyz',
    icon: '📝'
  },
  {
    name: 'CrossPost Fast',
    description: 'Write once, optimize for all platforms, cross-post with one click',
    url: 'https://crosspostfast.wangdadi.xyz',
    icon: '🚀'
  },
  {
    name: 'KillSwitch API',
    description: 'Protect your OpenAI usage by automatically blocking requests when budget limits are exceeded',
    url: 'https://killswitchapi.wangdadi.xyz',
    icon: '🛡️'
  },
  {
    name: 'PingThem.io',
    description: 'The simplest Gmail follow-up tool for sales',
    url: 'https://pingthemio.wangdadi.xyz',
    icon: '📧'
  },
  {
    name: 'NeverUpload.io',
    description: 'Process files locally without uploading to servers',
    url: 'https://neveruploadio.wangdadi.xyz/',
    icon: '🔒'
  },
  {
    name: 'CleanCSV.ai',
    description: 'Clean and transform CSV files instantly',
    url: 'https://cleancsvai.wangdadi.xyz',
    icon: '📊'
  },
  {
    name: 'SaaSStripper',
    description: 'Strip away unnecessary SaaS complexity',
    url: 'https://saasstripper.wangdadi.xyz',
    icon: '✂️'
  },
  {
    name: 'NoAdobe',
    description: 'Adobe alternatives for the modern workflow',
    url: 'https://noadobe.wangdadi.xyz',
    icon: '🎨'
  },
  {
    name: 'NavsLayer',
    description: 'Navigate and manage your layers efficiently',
    url: 'https://navslayer.wangdadi.xyz',
    icon: '📚'
  },
  {
    name: 'KillSaaS',
    description: 'Eliminate redundant SaaS subscriptions',
    url: 'https://killsaas.wangdadi.xyz',
    icon: '💀'
  },
  {
    name: 'SlimSND',
    description: 'Slim down your sound files',
    url: 'https://slimsnd.wangdadi.xyz',
    icon: '🎵'
  },
  {
    name: 'BootHell',
    description: 'Escape from boot loops and system issues',
    url: 'https://boothell.wangdadi.xyz',
    icon: '👢'
  },
  {
    name: 'Linguistic DNA Extractor',
    description: 'Extract linguistic patterns and DNA from text',
    url: 'https://linguisticdnaextractor.wangdadi.xyz/',
    icon: '🧬'
  },
  {
    name: 'Humbled',
    description: 'Stay humble, stay focused',
    url: 'https://humbled.wangdadi.xyz/',
    icon: '🙏'
  },
  {
    name: 'StopSaaS',
    description: 'Stop paying for unnecessary SaaS tools',
    url: 'https://stopsaas.wangdadi.xyz/',
    icon: '🛑'
  },
  {
    name: 'OneClickAPI',
    description: 'One-click API integration for developers',
    url: 'https://oneclickapi.wangdadi.xyz/',
    icon: '⚡'
  },
  {
    name: 'StopAICost',
    description: 'Monitor and control your AI API costs',
    url: 'https://stopaicost.wangdadi.xyz/',
    icon: '💰'
  },
  {
    name: 'SME Survival AI',
    description: 'AI tools for small and medium enterprises',
    url: 'https://smesurvivalai.wangdadi.xyz/',
    icon: '🏢'
  },
  {
    name: 'OneCommand',
    description: 'Execute complex tasks with a single command',
    url: 'https://onecommand.wangdadi.xyz/',
    icon: '⌨️'
  },
  {
    name: 'KillSubscription',
    description: 'Find and cancel unwanted subscriptions',
    url: 'https://killsubscription.wangdadi.xyz/',
    icon: '✂️'
  },
  {
    name: 'ManualsLib',
    description: 'Access manuals and documentation easily',
    url: 'https://manualslib.wangdadi.xyz/',
    icon: '📖'
  },
  {
    name: 'BillRipper',
    description: 'Analyze and optimize your bills',
    url: 'https://billripper.wangdadi.xyz/',
    icon: '💸'
  },
  {
    name: 'Deadliner',
    description: 'Track and manage your deadlines efficiently',
    url: 'https://deadliner.wangdadi.xyz/',
    icon: '⏰'
  },
  {
    name: 'ZeroSub',
    description: 'Zero subscription fatigue',
    url: 'https://zerosub.wangdadi.xyz/',
    icon: '🎯'
  },
  {
    name: 'MockupNuke',
    description: 'Create and destroy mockups instantly',
    url: 'https://mockupnuke.wangdadi.xyz/',
    icon: '💥'
  },
  {
    name: 'ScriptKill',
    description: 'Terminate unwanted scripts and processes',
    url: 'https://scriptkill.wangdadi.xyz/',
    icon: '📜'
  },
  {
    name: 'ViralHook',
    description: 'Create viral hooks for your content',
    url: 'https://viralhook.wangdadi.xyz/',
    icon: '🎣'
  },
  {
    name: 'OnePageSaaS',
    description: 'Single-page SaaS solutions',
    url: 'https://onepagesaas.wangdadi.xyz/',
    icon: '📄'
  },
  {
    name: 'CineSkin',
    description: 'Skin and theme your video player',
    url: 'https://cineskin.wangdadi.xyz/',
    icon: '🎬'
  }
];

export default function PowerToolsSuite() {
  const [randomTools, setRandomTools] = useState<PowerTool[]>([]);

  useEffect(() => {
    // 随机选择 3-4 个工具
    const shuffled = [...powerTools].sort(() => Math.random() - 0.5);
    const count = Math.floor(Math.random() * 2) + 3; // 3 或 4 个
    setRandomTools(shuffled.slice(0, count));
  }, []);

  return (
    <div className="bg-white border border-slate-200 p-8 rounded-md">
      <div className="flex items-center mb-6">
        <Zap className="w-5 h-5 text-yellow-500 mr-2" />
        <h3 className="text-xl font-bold text-slate-900">Power Tools Suite</h3>
      </div>
      <p className="text-slate-600 mb-6">
        Boost your productivity with our curated collection of developer tools
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {randomTools.map((tool, index) => (
          <a
            key={index}
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-start p-4 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-md transition-all"
          >
            <span className="text-2xl mr-3">{tool.icon}</span>
            <div className="flex-1">
              <div className="flex items-center">
                <h4 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {tool.name}
                </h4>
                <ExternalLink className="w-4 h-4 ml-2 text-slate-400 group-hover:text-blue-500" />
              </div>
              <p className="text-sm text-slate-600 mt-1">
                {tool.description}
              </p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
