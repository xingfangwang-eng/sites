export interface TenantConfig {
  id: string;
  name: string;
  domain: string;
  theme: {
    primaryColor: string;
    secondaryColor: string;
  };
  features: {
    payment: boolean;
    analytics: boolean;
  };
}

const TENANTS: TenantConfig[] = [
  {
    id: 'artemisreentry',
    name: 'Artemis Reentry',
    domain: 'artemisreentry.wangdadi.xyz',
    theme: {
      primaryColor: '#3b82f6',
      secondaryColor: '#10b981'
    },
    features: {
      payment: false,
      analytics: true
    }
  },
  {
    id: 'billripper',
    name: 'Bill Ripper',
    domain: 'billripper.wangdadi.xyz',
    theme: {
      primaryColor: '#ef4444',
      secondaryColor: '#f97316'
    },
    features: {
      payment: true,
      analytics: true
    }
  },
  {
    id: 'boothell',
    name: 'Boot Hell',
    domain: 'boothell.wangdadi.xyz',
    theme: {
      primaryColor: '#1e40af',
      secondaryColor: '#3b82f6'
    },
    features: {
      payment: false,
      analytics: true
    }
  },
  {
    id: 'brainbridge',
    name: 'Brain Bridge',
    domain: 'brainbridge.wangdadi.xyz',
    theme: {
      primaryColor: '#8b5cf6',
      secondaryColor: '#d946ef'
    },
    features: {
      payment: false,
      analytics: true
    }
  },
  {
    id: 'capsule-factory-saas',
    name: 'Capsule Factory',
    domain: 'capsule-factory-saas.wangdadi.xyz',
    theme: {
      primaryColor: '#10b981',
      secondaryColor: '#34d399'
    },
    features: {
      payment: true,
      analytics: true
    }
  },
  {
    id: 'chapterpredictor',
    name: 'Chapter Predictor',
    domain: 'chapterpredictor.wangdadi.xyz',
    theme: {
      primaryColor: '#f59e0b',
      secondaryColor: '#fbbf24'
    },
    features: {
      payment: false,
      analytics: true
    }
  },
  {
    id: 'cineskin',
    name: 'Cine Skin',
    domain: 'cineskin.wangdadi.xyz',
    theme: {
      primaryColor: '#ec4899',
      secondaryColor: '#f472b6'
    },
    features: {
      payment: true,
      analytics: true
    }
  },
  {
    id: 'cleancsvai',
    name: 'Clean CSV AI',
    domain: 'cleancsvai.wangdadi.xyz',
    theme: {
      primaryColor: '#6366f1',
      secondaryColor: '#818cf8'
    },
    features: {
      payment: false,
      analytics: true
    }
  },
  {
    id: 'coachellaviral',
    name: 'Coachella Viral',
    domain: 'coachellaviral.wangdadi.xyz',
    theme: {
      primaryColor: '#8b5cf6',
      secondaryColor: '#ec4899'
    },
    features: {
      payment: true,
      analytics: true
    }
  },
  {
    id: 'crosspostfast',
    name: 'Cross Post Fast',
    domain: 'crosspostfast.wangdadi.xyz',
    theme: {
      primaryColor: '#14b8a6',
      secondaryColor: '#2dd4bf'
    },
    features: {
      payment: false,
      analytics: true
    }
  },
  {
    id: 'deadliner',
    name: 'Deadliner',
    domain: 'deadliner.wangdadi.xyz',
    theme: {
      primaryColor: '#ef4444',
      secondaryColor: '#f87171'
    },
    features: {
      payment: false,
      analytics: true
    }
  },
  {
    id: 'dentaiagent',
    name: 'Dent AI Agent',
    domain: 'dentaiagent.wangdadi.xyz',
    theme: {
      primaryColor: '#06b6d4',
      secondaryColor: '#22d3ee'
    },
    features: {
      payment: true,
      analytics: true
    }
  },
  {
    id: 'fanguard',
    name: 'FanGuard',
    domain: 'fanguard.wangdadi.xyz',
    theme: {
      primaryColor: '#10b981',
      secondaryColor: '#f59e0b'
    },
    features: {
      payment: false,
      analytics: true
    }
  },
  {
    id: 'focusinbox',
    name: 'Focus Inbox',
    domain: 'focusinbox.wangdadi.xyz',
    theme: {
      primaryColor: '#6366f1',
      secondaryColor: '#818cf8'
    },
    features: {
      payment: false,
      analytics: true
    }
  },
  {
    id: 'giveawaytracker',
    name: 'Giveaway Tracker',
    domain: 'giveawaytracker.wangdadi.xyz',
    theme: {
      primaryColor: '#f97316',
      secondaryColor: '#fb923c'
    },
    features: {
      payment: false,
      analytics: true
    }
  },
  {
    id: 'killbillcard',
    name: 'Kill Bill Card',
    domain: 'killbillcard.wangdadi.xyz',
    theme: {
      primaryColor: '#ef4444',
      secondaryColor: '#f87171'
    },
    features: {
      payment: true,
      analytics: true
    }
  },
  {
    id: 'killsaas',
    name: 'Kill SaaS',
    domain: 'killsaas.wangdadi.xyz',
    theme: {
      primaryColor: '#dc2626',
      secondaryColor: '#ef4444'
    },
    features: {
      payment: true,
      analytics: true
    }
  },
  {
    id: 'killsubscription',
    name: 'Kill Subscription',
    domain: 'killsubscription.wangdadi.xyz',
    theme: {
      primaryColor: '#b91c1c',
      secondaryColor: '#dc2626'
    },
    features: {
      payment: true,
      analytics: true
    }
  },
  {
    id: 'killswitchapi',
    name: 'Kill Switch API',
    domain: 'killswitchapi.wangdadi.xyz',
    theme: {
      primaryColor: '#7f1d1d',
      secondaryColor: '#b91c1c'
    },
    features: {
      payment: false,
      analytics: true
    }
  },
  {
    id: 'manualslib',
    name: 'Manuals Lib',
    domain: 'manualslib.wangdadi.xyz',
    theme: {
      primaryColor: '#6b7280',
      secondaryColor: '#9ca3af'
    },
    features: {
      payment: false,
      analytics: true
    }
  },
  {
    id: 'mememooncalculator',
    name: 'Meme Moon Calculator',
    domain: 'mememooncalculator.wangdadi.xyz',
    theme: {
      primaryColor: '#8b5cf6',
      secondaryColor: '#a78bfa'
    },
    features: {
      payment: false,
      analytics: true
    }
  },
  {
    id: 'mockupnuke',
    name: 'Mockup Nuke',
    domain: 'mockupnuke.wangdadi.xyz',
    theme: {
      primaryColor: '#14b8a6',
      secondaryColor: '#2dd4bf'
    },
    features: {
      payment: false,
      analytics: true
    }
  },
  {
    id: 'navslayer',
    name: 'Nav Slayer',
    domain: 'navslayer.wangdadi.xyz',
    theme: {
      primaryColor: '#06b6d4',
      secondaryColor: '#22d3ee'
    },
    features: {
      payment: false,
      analytics: true
    }
  },
  {
    id: 'neveruploadio',
    name: 'Never Upload IO',
    domain: 'neveruploadio.wangdadi.xyz',
    theme: {
      primaryColor: '#1e40af',
      secondaryColor: '#3b82f6'
    },
    features: {
      payment: false,
      analytics: true
    }
  },
  {
    id: 'noaimd',
    name: 'No AIMD',
    domain: 'noaimd.wangdadi.xyz',
    theme: {
      primaryColor: '#166534',
      secondaryColor: '#15803d'
    },
    features: {
      payment: false,
      analytics: true
    }
  },
  {
    id: 'noseotop',
    name: 'No SEO Top',
    domain: 'noseotop.wangdadi.xyz',
    theme: {
      primaryColor: '#7e22ce',
      secondaryColor: '#9333ea'
    },
    features: {
      payment: false,
      analytics: true
    }
  },
  {
    id: 'nukeprivacy',
    name: 'Nuke Privacy',
    domain: 'nukeprivacy.wangdadi.xyz',
    theme: {
      primaryColor: '#0f172a',
      secondaryColor: '#1e293b'
    },
    features: {
      payment: false,
      analytics: true
    }
  },
  {
    id: 'office-sync',
    name: 'Office Sync',
    domain: 'office-sync.wangdadi.xyz',
    theme: {
      primaryColor: '#0284c7',
      secondaryColor: '#0ea5e9'
    },
    features: {
      payment: true,
      analytics: true
    }
  },
  {
    id: 'oneclickapi',
    name: 'One Click API',
    domain: 'oneclickapi.wangdadi.xyz',
    theme: {
      primaryColor: '#059669',
      secondaryColor: '#10b981'
    },
    features: {
      payment: false,
      analytics: true
    }
  },
  {
    id: 'onecommand',
    name: 'One Command',
    domain: 'onecommand.wangdadi.xyz',
    theme: {
      primaryColor: '#d97706',
      secondaryColor: '#f59e0b'
    },
    features: {
      payment: false,
      analytics: true
    }
  },
  {
    id: 'onepagesaas',
    name: 'One Page SaaS',
    domain: 'onepagesaas.wangdadi.xyz',
    theme: {
      primaryColor: '#9333ea',
      secondaryColor: '#a855f7'
    },
    features: {
      payment: true,
      analytics: true
    }
  },
  {
    id: 'personalock',
    name: 'Persona Lock',
    domain: 'personalock.wangdadi.xyz',
    theme: {
      primaryColor: '#1e3a8a',
      secondaryColor: '#3730a3'
    },
    features: {
      payment: true,
      analytics: true
    }
  },
  {
    id: 'pingthemio',
    name: 'Ping Them IO',
    domain: 'pingthemio.wangdadi.xyz',
    theme: {
      primaryColor: '#0369a1',
      secondaryColor: '#0ea5e9'
    },
    features: {
      payment: false,
      analytics: true
    }
  },
  {
    id: 'rugradar',
    name: 'Rug Radar',
    domain: 'rugradar.wangdadi.xyz',
    theme: {
      primaryColor: '#4f46e5',
      secondaryColor: '#6366f1'
    },
    features: {
      payment: false,
      analytics: true
    }
  },
  {
    id: 'saaskiller',
    name: 'SaaS Killer',
    domain: 'saaskiller.wangdadi.xyz',
    theme: {
      primaryColor: '#b91c1c',
      secondaryColor: '#dc2626'
    },
    features: {
      payment: true,
      analytics: true
    }
  },
  {
    id: 'saasstripper',
    name: 'SaaS Stripper',
    domain: 'saasstripper.wangdadi.xyz',
    theme: {
      primaryColor: '#7f1d1d',
      secondaryColor: '#b91c1c'
    },
    features: {
      payment: true,
      analytics: true
    }
  },
  {
    id: 'samirapulse',
    name: 'Samira Pulse',
    domain: 'samirapulse.wangdadi.xyz',
    theme: {
      primaryColor: '#ec4899',
      secondaryColor: '#f472b6'
    },
    features: {
      payment: false,
      analytics: true
    }
  },
  {
    id: 'scriptkill',
    name: 'Script Kill',
    domain: 'scriptkill.wangdadi.xyz',
    theme: {
      primaryColor: '#1e293b',
      secondaryColor: '#334155'
    },
    features: {
      payment: false,
      analytics: true
    }
  },
  {
    id: 'slimsnd',
    name: 'Slim SND',
    domain: 'slimsnd.wangdadi.xyz',
    theme: {
      primaryColor: '#065f46',
      secondaryColor: '#059669'
    },
    features: {
      payment: false,
      analytics: true
    }
  },
  {
    id: 'smesurvivalai',
    name: 'SME Survival AI',
    domain: 'smesurvivalai.wangdadi.xyz',
    theme: {
      primaryColor: '#0891b2',
      secondaryColor: '#06b6d4'
    },
    features: {
      payment: true,
      analytics: true
    }
  },
  {
    id: 'songkrangenerator',
    name: 'Song Krangenerator',
    domain: 'songkrangenerator.wangdadi.xyz',
    theme: {
      primaryColor: '#6366f1',
      secondaryColor: '#8b5cf6'
    },
    features: {
      payment: false,
      analytics: true
    }
  },
  {
    id: 'stopaicost',
    name: 'Stop AI Cost',
    domain: 'stopaicost.wangdadi.xyz',
    theme: {
      primaryColor: '#0f766e',
      secondaryColor: '#14b8a6'
    },
    features: {
      payment: true,
      analytics: true
    }
  },
  {
    id: 'stopsaas',
    name: 'Stop SaaS',
    domain: 'stopsaas.wangdadi.xyz',
    theme: {
      primaryColor: '#7f1d1d',
      secondaryColor: '#b91c1c'
    },
    features: {
      payment: true,
      analytics: true
    }
  },
  {
    id: 'stoptheswitch',
    name: 'Stop the Switch',
    domain: 'stoptheswitch.wangdadi.xyz',
    theme: {
      primaryColor: '#455a64',
      secondaryColor: '#64748b'
    },
    features: {
      payment: false,
      analytics: true
    }
  },
  {
    id: 'viralhook',
    name: 'Viral Hook',
    domain: 'viralhook.wangdadi.xyz',
    theme: {
      primaryColor: '#f59e0b',
      secondaryColor: '#fbbf24'
    },
    features: {
      payment: false,
      analytics: true
    }
  },
  {
    id: 'zerocloud',
    name: 'Zero Cloud',
    domain: 'zerocloud.wangdadi.xyz',
    theme: {
      primaryColor: '#0ea5e9',
      secondaryColor: '#38bdf8'
    },
    features: {
      payment: true,
      analytics: true
    }
  },
  {
    id: 'zerosub',
    name: 'Zero Sub',
    domain: 'zerosub.wangdadi.xyz',
    theme: {
      primaryColor: '#10b981',
      secondaryColor: '#34d399'
    },
    features: {
      payment: true,
      analytics: true
    }
  },
  {
    id: 'free_ebook_maker',
    name: 'Free Ebook Maker',
    domain: 'free-ebook-maker.wangdadi.xyz',
    theme: {
      primaryColor: '#8b5cf6',
      secondaryColor: '#a78bfa'
    },
    features: {
      payment: false,
      analytics: true
    }
  },
  {
    id: 'tweetvirality',
    name: 'Tweet Virality',
    domain: 'tweetvirality.wangdadi.xyz',
    theme: {
      primaryColor: '#1da1f2',
      secondaryColor: '#4299e1'
    },
    features: {
      payment: false,
      analytics: true
    }
  },
  {
    id: 'bbb26dramapredictor',
    name: 'BBB26 Drama Predictor',
    domain: 'bbb26dramapredictor.wangdadi.xyz',
    theme: {
      primaryColor: '#f59e0b',
      secondaryColor: '#fbbf24'
    },
    features: {
      payment: false,
      analytics: true
    }
  },
  {
    id: 'deshaefrost',
    name: 'Deshae Frost',
    domain: 'deshaefrost.wangdadi.xyz',
    theme: {
      primaryColor: '#ec4899',
      secondaryColor: '#f472b6'
    },
    features: {
      payment: false,
      analytics: true
    }
  },
  {
    id: 'autotask',
    name: 'AutoTask',
    domain: 'autotask.wangdadi.xyz',
    theme: {
      primaryColor: '#10b981',
      secondaryColor: '#34d399'
    },
    features: {
      payment: false,
      analytics: true
    }
  },
  {
    id: 'noadobe',
    name: 'No Adobe',
    domain: 'noadobe.wangdadi.xyz',
    theme: {
      primaryColor: '#7e22ce',
      secondaryColor: '#9333ea'
    },
    features: {
      payment: false,
      analytics: true
    }
  },
  {
    id: 'linguisticdnaextractor',
    name: 'Linguistic DNA Extractor',
    domain: 'linguisticdnaextractor.wangdadi.xyz',
    theme: {
      primaryColor: '#6366f1',
      secondaryColor: '#818cf8'
    },
    features: {
      payment: false,
      analytics: true
    }
  },
  {
    id: 'humbled',
    name: 'Humbled',
    domain: 'humbled.wangdadi.xyz',
    theme: {
      primaryColor: '#475569',
      secondaryColor: '#64748b'
    },
    features: {
      payment: false,
      analytics: true
    }
  },
  {
    id: 'agents',
    name: 'Agents Directory',
    domain: 'agents.wangdadi.xyz',
    theme: {
      primaryColor: '#6366f1',
      secondaryColor: '#8b5cf6'
    },
    features: {
      payment: false,
      analytics: true
    }
  },
  {
    id: 'receptionkiller',
    name: 'Reception Killer',
    domain: 'receptionkiller.wangdadi.xyz',
    theme: {
      primaryColor: '#ef4444',
      secondaryColor: '#f87171'
    },
    features: {
      payment: false,
      analytics: true
    }
  }
];

export function getTenantFromHost(host: string = ''): TenantConfig | null {
  return TENANTS.find(tenant => host.includes(tenant.domain)) || null;
}

export function getDefaultTenant(): TenantConfig {
  return {
    id: 'default',
    name: 'Wang Dadi',
    domain: 'wangdadi.xyz',
    theme: {
      primaryColor: '#6366f1',
      secondaryColor: '#8b5cf6'
    },
    features: {
      payment: false,
      analytics: true
    }
  };
}

export function getAllTenants(): TenantConfig[] {
  return TENANTS;
}
