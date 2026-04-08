'use client';

import { useState, useEffect } from 'react';
import { ExternalLink, Wrench, Search, Shield, CreditCard, Cloud, Inbox, DollarSign, FileText, Share2, Key, Mail, Upload, Table, Scissors, File, Navigation, Zap, Volume2, Terminal, Globe, Clock, Receipt, Calendar, BookOpen, Video, Pen, MessageSquare, FileSpreadsheet } from 'lucide-react';

interface ToolSite {
  name: string;
  url: string;
  description: string;
  icon: React.ReactNode;
}

const allToolSites: ToolSite[] = [
  {
    name: 'NoSEO.top',
    url: 'https://noseotop.wangdadi.xyz/',
    description: 'Search for authentic results, not optimized ones',
    icon: <Search className="w-5 h-5" />
  },
  {
    name: 'NukePrivacy',
    url: 'https://nukeprivacy.wangdadi.xyz',
    description: '100% Local video processing. No data uploaded',
    icon: <Shield className="w-5 h-5" />
  },
  {
    name: 'KillBillCard',
    url: 'https://killbillcard.wangdadi.xyz/',
    description: 'Eliminate unwanted subscription charges',
    icon: <CreditCard className="w-5 h-5" />
  },
  {
    name: 'ZeroCloud',
    url: 'https://zerocloud.wangdadi.xyz',
    description: '100% Offline Document Intelligence',
    icon: <Cloud className="w-5 h-5" />
  },
  {
    name: 'FocusInbox',
    url: 'https://focusinbox.wangdadi.xyz',
    description: 'Focus on work, focus on conversion',
    icon: <Inbox className="w-5 h-5" />
  },
  {
    name: 'SaaSKiller',
    url: 'https://saaskiller.wangdadi.xyz',
    description: 'Find and kill your zombie subscriptions',
    icon: <DollarSign className="w-5 h-5" />
  },
  {
    name: 'NoAI.md',
    url: 'https://noaimd.wangdadi.xyz',
    description: 'Distraction-free Markdown editor. No AI, no cloud',
    icon: <FileText className="w-5 h-5" />
  },
  {
    name: 'CrossPost Fast',
    url: 'https://crosspostfast.wangdadi.xyz',
    description: 'Multi-platform social media posting tool',
    icon: <Share2 className="w-5 h-5" />
  },
  {
    name: 'KillSwitch API',
    url: 'https://killswitchapi.wangdadi.xyz',
    description: 'OpenAI usage protection and budget monitoring',
    icon: <Key className="w-5 h-5" />
  },
  {
    name: 'PingThem.io',
    url: 'https://pingthemio.wangdadi.xyz',
    description: 'Simplest Gmail follow-up tool for sales',
    icon: <Mail className="w-5 h-5" />
  },
  {
    name: 'NeverUpload.io',
    url: 'https://neveruploadio.wangdadi.xyz/',
    description: 'Process files without uploading to servers',
    icon: <Upload className="w-5 h-5" />
  },
  {
    name: 'CleanCSV.ai',
    url: 'https://cleancsvai.wangdadi.xyz',
    description: 'AI-powered CSV cleaning and formatting',
    icon: <Table className="w-5 h-5" />
  },
  {
    name: 'SaaSStripper',
    url: 'https://saasstripper.wangdadi.xyz',
    description: 'Strip down SaaS to essentials',
    icon: <Scissors className="w-5 h-5" />
  },
  {
    name: 'NoAdobe',
    url: 'https://noadobe.wangdadi.xyz',
    description: 'Adobe-free document and media tools',
    icon: <File className="w-5 h-5" />
  },
  {
    name: 'NavsLayer',
    url: 'https://navslayer.wangdadi.xyz',
    description: 'Advanced navigation and routing tools',
    icon: <Navigation className="w-5 h-5" />
  },
  {
    name: 'KillSaaS',
    url: 'https://killsaas.wangdadi.xyz',
    description: 'Eliminate unnecessary SaaS subscriptions',
    icon: <Zap className="w-5 h-5" />
  },
  {
    name: 'SlimSND',
    url: 'https://slimsnd.wangdadi.xyz',
    description: 'Lightweight sound processing tools',
    icon: <Volume2 className="w-5 h-5" />
  },
  {
    name: 'BootHell',
    url: 'https://boothell.wangdadi.xyz',
    description: 'Boot optimization and cleanup tools',
    icon: <Terminal className="w-5 h-5" />
  },
  {
    name: 'Linguistic DNA',
    url: 'https://linguisticdnaextractor.wangdadi.xyz/',
    description: 'Extract linguistic patterns and DNA',
    icon: <Globe className="w-5 h-5" />
  },
  {
    name: 'Humbled',
    url: 'https://humbled.wangdadi.xyz/',
    description: 'Stay grounded with usage analytics',
    icon: <Clock className="w-5 h-5" />
  },
  {
    name: 'StopSaaS',
    url: 'https://stopsaas.wangdadi.xyz/',
    description: 'Stop wasting money on unused SaaS',
    icon: <DollarSign className="w-5 h-5" />
  },
  {
    name: 'OneClickAPI',
    url: 'https://oneclickapi.wangdadi.xyz/',
    description: 'Single-click API integration tools',
    icon: <Key className="w-5 h-5" />
  },
  {
    name: 'StopAICost',
    url: 'https://stopaicost.wangdadi.xyz/',
    description: 'Monitor and reduce AI API costs',
    icon: <DollarSign className="w-5 h-5" />
  },
  {
    name: 'SME Survival AI',
    url: 'https://smesurvivalai.wangdadi.xyz/',
    description: 'AI tools for small business survival',
    icon: <Shield className="w-5 h-5" />
  },
  {
    name: 'OneCommand',
    url: 'https://onecommand.wangdadi.xyz/',
    description: 'Single command deployment tools',
    icon: <Terminal className="w-5 h-5" />
  },
  {
    name: 'KillSubscription',
    url: 'https://killsubscription.wangdadi.xyz/',
    description: 'Track and cancel unwanted subscriptions',
    icon: <Receipt className="w-5 h-5" />
  },
  {
    name: 'ManualsLib',
    url: 'https://manualslib.wangdadi.xyz/',
    description: 'Free manual library and documentation',
    icon: <BookOpen className="w-5 h-5" />
  },
  {
    name: 'BillRipper',
    url: 'https://billripper.wangdadi.xyz/',
    description: 'Analyze and optimize your bills',
    icon: <Receipt className="w-5 h-5" />
  },
  {
    name: 'Deadliner',
    url: 'https://deadliner.wangdadi.xyz/',
    description: 'Deadline tracking and management',
    icon: <Calendar className="w-5 h-5" />
  },
  {
    name: 'ZeroSub',
    url: 'https://zerosub.wangdadi.xyz/',
    description: 'Zero subscription lifestyle tools',
    icon: <DollarSign className="w-5 h-5" />
  },
  {
    name: 'MockupNuke',
    url: 'https://mockupnuke.wangdadi.xyz/',
    description: 'Destroy bad mockups, create better ones',
    icon: <Video className="w-5 h-5" />
  },
  {
    name: 'ScriptKill',
    url: 'https://scriptkill.wangdadi.xyz/',
    description: 'Kill unwanted scripts and trackers',
    icon: <Terminal className="w-5 h-5" />
  },
  {
    name: 'ViralHook',
    url: 'https://viralhook.wangdadi.xyz/',
    description: 'Create viral hooks for your content',
    icon: <MessageSquare className="w-5 h-5" />
  },
  {
    name: 'OnePageSaaS',
    url: 'https://onepagesaas.wangdadi.xyz/',
    description: 'Single page SaaS landing pages',
    icon: <FileSpreadsheet className="w-5 h-5" />
  },
  {
    name: 'CineSkin',
    url: 'https://cineskin.wangdadi.xyz/',
    description: 'Cinematic skin retouching tools',
    icon: <Video className="w-5 h-5" />
  }
];

export default function PowerToolsSuite() {
  const [displayedTools, setDisplayedTools] = useState<ToolSite[]>([]);

  useEffect(() => {
    const shuffled = [...allToolSites].sort(() => Math.random() - 0.5);
    const count = Math.floor(Math.random() * 3) + 4;
    setDisplayedTools(shuffled.slice(0, count));
  }, []);

  return (
    <section className="bg-gradient-to-r from-slate-900 to-slate-800 py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <Wrench className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">
              Power Tools Suite
            </h2>
            <p className="text-slate-400 text-sm">
              Explore more productivity tools from WangDaDi
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedTools.map((tool, index) => (
            <a
              key={index}
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-slate-800 border border-slate-700 p-6 hover:border-blue-500 transition-all hover:bg-slate-750"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  {tool.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-bold text-white group-hover:text-blue-400 transition-colors">
                      {tool.name}
                    </h3>
                    <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-blue-400 transition-colors" />
                  </div>
                  <p className="text-sm text-slate-400">
                    {tool.description}
                  </p>
                </div>
              </div>
            </a>
          ))}
        </div>

      </div>
    </section>
  );
}
