'use client';
import React, { useMemo } from 'react';
import { Sparkles, Zap, Shield, Code, Server, Database, ChevronRight, Search, Mail, Lock, Upload, BarChart, FileText, Terminal, Play, CheckCircle, AlertCircle } from 'lucide-react';

// 站点列表
const POWER_TOOLS = [
  {
    url: 'https://noseotop.wangdadi.xyz/',
    name: 'NoSEO.top',
    description: 'Search for authentic results, not optimized ones',
    icon: <Search className="w-5 h-5" />,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100'
  },
  {
    url: 'https://nukeprivacy.wangdadi.xyz',
    name: 'Nuke Privacy',
    description: '100% LOCAL. All processing happens in your browser',
    icon: <Lock className="w-5 h-5" />,
    color: 'text-green-600',
    bgColor: 'bg-green-100'
  },
  {
    url: 'https://killbillcard.wangdadi.xyz/',
    name: 'Kill Bill Card',
    description: 'Bill management and optimization tool',
    icon: <Terminal className="w-5 h-5" />,
    color: 'text-red-600',
    bgColor: 'bg-red-100'
  },
  {
    url: 'https://zerocloud.wangdadi.xyz',
    name: 'ZeroCloud.so',
    description: '100% Offline Document Intelligence',
    icon: <Upload className="w-5 h-5" />,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100'
  },
  {
    url: 'https://focusinbox-eight.wangdadi.xyz',
    name: 'FocusInbox',
    description: 'Focus on work, focus on conversion',
    icon: <Mail className="w-5 h-5" />,
    color: 'text-amber-600',
    bgColor: 'bg-amber-100'
  },
  {
    url: 'https://saaskiller.wangdadi.xyz',
    name: 'SaaSKiller.ai',
    description: 'Kill Your Zombie Subscriptions',
    icon: <AlertCircle className="w-5 h-5" />,
    color: 'text-pink-600',
    bgColor: 'bg-pink-100'
  },
  {
    url: 'https://noaimd.wangdadi.xyz',
    name: 'NoAI.md',
    description: 'A distraction-free Markdown editor',
    icon: <FileText className="w-5 h-5" />,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100'
  },
  {
    url: 'https://crosspostfast.wangdadi.xyz',
    name: 'CrossPost Fast',
    description: 'Multi-platform Social Media Posting Tool',
    icon: <FileText className="w-5 h-5" />,
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-100'
  },
  {
    url: 'https://killswitchapi.wangdadi.xyz',
    name: 'KillSwitch API',
    description: 'OpenAI Usage Protection',
    icon: <Shield className="w-5 h-5" />,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100'
  },
  {
    url: 'https://pingthemio.wangdadi.xyz',
    name: 'PingThem.io',
    description: 'The Simplest Gmail Follow-up Tool for Sales',
    icon: <Mail className="w-5 h-5" />,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-100'
  },
  {
    url: 'https://neveruploadio.wangdadi.xyz/',
    name: 'NeverUpload.io',
    description: 'Keep your data private, never upload anywhere',
    icon: <Lock className="w-5 h-5" />,
    color: 'text-violet-600',
    bgColor: 'bg-violet-100'
  },
  {
    url: 'https://cleancsvai.wangdadi.xyz',
    name: 'CleanCSV AI',
    description: 'Clean and optimize your CSV data',
    icon: <FileText className="w-5 h-5" />,
    color: 'text-lime-600',
    bgColor: 'bg-lime-100'
  },
  {
    url: 'https://saasstripper.wangdadi.xyz',
    name: 'SaaSTripper',
    description: 'Strip unnecessary SaaS features',
    icon: <CheckCircle className="w-5 h-5" />,
    color: 'text-fuchsia-600',
    bgColor: 'bg-fuchsia-100'
  },
  {
    url: 'https://noadobe.wangdadi.xyz',
    name: 'NoAdobe',
    description: 'Alternative to Adobe tools',
    icon: <Play className="w-5 h-5" />,
    color: 'text-sky-600',
    bgColor: 'bg-sky-100'
  },
  {
    url: 'https://navslayer.wangdadi.xyz',
    name: 'NavLayer',
    description: 'Advanced navigation solutions',
    icon: <Code className="w-5 h-5" />,
    color: 'text-teal-600',
    bgColor: 'bg-teal-100'
  },
  {
    url: 'https://killsaas.wangdadi.xyz',
    name: 'KillSaaS',
    description: 'Eliminate unnecessary SaaS subscriptions',
    icon: <AlertCircle className="w-5 h-5" />,
    color: 'text-rose-600',
    bgColor: 'bg-rose-100'
  },
  {
    url: 'https://slimsnd.wangdadi.xyz',
    name: 'SlimSND',
    description: 'Streamline your sound production',
    icon: <Play className="w-5 h-5" />,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100'
  },
  {
    url: 'https://boothell.wangdadi.xyz',
    name: 'BootHell',
    description: 'Bootstrap utilities and tools',
    icon: <Code className="w-5 h-5" />,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100'
  },
  {
    url: 'https://linguisticdnaextractor.wangdadi.xyz/',
    name: 'Linguistic DNA Extractor',
    description: 'Extract your unique linguistic fingerprint',
    icon: <Sparkles className="w-5 h-5" />,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100'
  },
  {
    url: 'https://humbled.wangdadi.xyz/',
    name: 'Humbled',
    description: 'Humility-focused content tools',
    icon: <CheckCircle className="w-5 h-5" />,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-100'
  },
  {
    url: 'https://stopsaas.wangdadi.xyz/',
    name: 'StopSaaS',
    description: 'Reduce SaaS dependency',
    icon: <AlertCircle className="w-5 h-5" />,
    color: 'text-red-600',
    bgColor: 'bg-red-100'
  },
  {
    url: 'https://oneclickapi.wangdadi.xyz/',
    name: 'OneClick API',
    description: 'Simplify API integration',
    icon: <Server className="w-5 h-5" />,
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-100'
  },
  {
    url: 'https://stopaicost.wangdadi.xyz/',
    name: 'StopAICost',
    description: 'Control and reduce AI costs',
    icon: <BarChart className="w-5 h-5" />,
    color: 'text-amber-600',
    bgColor: 'bg-amber-100'
  },
  {
    url: 'https://smesurvivalai.wangdadi.xyz/',
    name: 'SMESurvival AI',
    description: 'AI tools for small business survival',
    icon: <Sparkles className="w-5 h-5" />,
    color: 'text-green-600',
    bgColor: 'bg-green-100'
  },
  {
    url: 'https://onecommand.wangdadi.xyz/',
    name: 'OneCommand',
    description: 'Simplify complex tasks with one command',
    icon: <Terminal className="w-5 h-5" />,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100'
  },
  {
    url: 'https://killsubscription.wangdadi.xyz/',
    name: 'KillSubscription',
    description: 'Eliminate unwanted subscriptions',
    icon: <AlertCircle className="w-5 h-5" />,
    color: 'text-pink-600',
    bgColor: 'bg-pink-100'
  },
  {
    url: 'https://manualslib.wangdadi.xyz/',
    name: 'ManualsLib',
    description: 'Comprehensive manual library',
    icon: <FileText className="w-5 h-5" />,
    color: 'text-slate-600',
    bgColor: 'bg-slate-100'
  },
  {
    url: 'https://billripper.wangdadi.xyz/',
    name: 'BillRipper',
    description: 'Analyze and optimize your bills',
    icon: <BarChart className="w-5 h-5" />,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100'
  },
  {
    url: 'https://deadliner.wangdadi.xyz/',
    name: 'Deadliner',
    description: 'Meet deadlines with smart tools',
    icon: <CheckCircle className="w-5 h-5" />,
    color: 'text-violet-600',
    bgColor: 'bg-violet-100'
  },
  {
    url: 'https://zerosub.wangdadi.xyz/',
    name: 'ZeroSub',
    description: 'Zero subscription costs',
    icon: <AlertCircle className="w-5 h-5" />,
    color: 'text-rose-600',
    bgColor: 'bg-rose-100'
  },
  {
    url: 'https://mockupnuke.wangdadi.xyz/',
    name: 'MockupNuke',
    description: 'Create stunning mockups quickly',
    icon: <Play className="w-5 h-5" />,
    color: 'text-teal-600',
    bgColor: 'bg-teal-100'
  },
  {
    url: 'https://scriptkill.wangdadi.xyz/',
    name: 'ScriptKill',
    description: 'Optimize and clean your scripts',
    icon: <Code className="w-5 h-5" />,
    color: 'text-fuchsia-600',
    bgColor: 'bg-fuchsia-100'
  },
  {
    url: 'https://viralhook.wangdadi.xyz/',
    name: 'ViralHook',
    description: 'Create viral content hooks',
    icon: <Sparkles className="w-5 h-5" />,
    color: 'text-lime-600',
    bgColor: 'bg-lime-100'
  },
  {
    url: 'https://onepagesaas.wangdadi.xyz/',
    name: 'OnePage SaaS',
    description: 'Build SaaS products on single pages',
    icon: <Server className="w-5 h-5" />,
    color: 'text-sky-600',
    bgColor: 'bg-sky-100'
  },
  {
    url: 'https://cineskin.wangdadi.xyz/',
    name: 'CineSkin',
    description: 'Cinema-quality skin effects',
    icon: <Play className="w-5 h-5" />,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100'
  }
];

const getRandomTools = (count: number = 4) => {
  const shuffled = [...POWER_TOOLS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

export default function YouMayAlsoLike() {
  const randomTools = useMemo(() => getRandomTools(4), []);

  return (
    <section className="mt-16 pt-8 border-t border-slate-200">
      <div className="flex items-center mb-6">
        <Sparkles className="w-5 h-5 text-purple-600 mr-2" />
        <h2 className="text-2xl font-bold text-slate-900">
          You May Also Like
        </h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {randomTools.map((tool, index) => (
          <a
            key={`${tool.url}-${index}`}
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-white border border-slate-200 p-5 rounded-lg hover:border-purple-500 hover:shadow-md transition-all"
          >
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-lg ${tool.bgColor} ${tool.color}`}>
                {tool.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-slate-900 group-hover:text-purple-600 transition-colors">
                    {tool.name}
                  </h3>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
                </div>
                <p className="text-sm text-slate-600 mt-1">
                  {tool.description}
                </p>
                <p className="text-xs text-slate-400 mt-2">
                  {new URL(tool.url).hostname}
                </p>
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
