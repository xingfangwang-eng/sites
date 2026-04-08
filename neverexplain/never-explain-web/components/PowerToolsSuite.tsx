import Link from "next/link";
import { Zap } from "lucide-react";

// 二级域名站点列表
const powerToolsSites = [
  { name: "NoSEO.top", description: "Search for authentic results, not optimized ones", url: "https://noseotop.wangdadi.xyz/" },
  { name: "Nuke Privacy", description: "100% LOCAL. All processing happens in your browser", url: "https://nukeprivacy.wangdadi.xyz" },
  { name: "Kill Bill Card", description: "加载中...", url: "https://killbillcard.wangdadi.xyz/" },
  { name: "ZeroCloud", description: "100% Offline Document Intelligence", url: "https://zerocloud.wangdadi.xyz" },
  { name: "FocusInbox", description: "Focus on work, focus on conversion", url: "https://focusinbox-eight.wangdadi.xyz" },
  { name: "SaaSKiller", description: "Kill Your Zombie Subscriptions", url: "https://saaskiller.wangdadi.xyz" },
  { name: "NoAI.md", description: "A distraction-free Markdown editor", url: "https://noaimd.wangdadi.xyz" },
  { name: "CrossPost Fast", description: "Multi-platform Social Media Posting Tool", url: "https://crosspostfast.wangdadi.xyz" },
  { name: "KillSwitch API", description: "OpenAI Usage Protection", url: "https://killswitchapi.wangdadi.xyz" },
  { name: "PingThem.io", description: "The Simplest Gmail Follow-up Tool for Sales", url: "https://pingthemio.wangdadi.xyz" },
  { name: "NeverUpload.io", description: "Upload files securely", url: "https://neveruploadio.wangdadi.xyz/" },
  { name: "CleanCSV AI", description: "Clean and optimize CSV files", url: "https://cleancsvai.wangdadi.xyz" },
  { name: "SaaS Stripper", description: "Strip unnecessary SaaS features", url: "https://saasstripper.wangdadi.xyz" },
  { name: "No Adobe", description: "Alternatives to Adobe products", url: "https://noadobe.wangdadi.xyz" },
  { name: "NavSlayer", description: "Advanced navigation tools", url: "https://navslayer.wangdadi.xyz" },
  { name: "Kill SaaS", description: "Eliminate unnecessary SaaS", url: "https://killsaas.wangdadi.xyz" },
  { name: "SlimSND", description: "Slim down your sound files", url: "https://slimsnd.wangdadi.xyz" },
  { name: "BootHell", description: "Bootstrap alternatives", url: "https://boothell.wangdadi.xyz" },
  { name: "Linguistic DNA Extractor", description: "Extract linguistic patterns", url: "https://linguisticdnaextractor.wangdadi.xyz/" },
  { name: "Humbled", description: "Humble tools for humble needs", url: "https://humbled.wangdadi.xyz/" },
  { name: "Stop SaaS", description: "Reduce SaaS dependencies", url: "https://stopsaas.wangdadi.xyz/" },
  { name: "OneClickAPI", description: "API tools at your fingertips", url: "https://oneclickapi.wangdadi.xyz/" },
  { name: "Stop AI Cost", description: "Control AI usage costs", url: "https://stopaicost.wangdadi.xyz/" },
  { name: "SME Survival AI", description: "AI tools for small businesses", url: "https://smesurvivalai.wangdadi.xyz/" },
  { name: "One Command", description: "Execute complex tasks with one command", url: "https://onecommand.wangdadi.xyz/" },
  { name: "Kill Subscription", description: "End unwanted subscriptions", url: "https://killsubscription.wangdadi.xyz/" },
  { name: "ManualsLib", description: "Comprehensive manual library", url: "https://manualslib.wangdadi.xyz/" },
  { name: "Bill Ripper", description: "Analyze and optimize bills", url: "https://billripper.wangdadi.xyz/" },
  { name: "Deadliner", description: "Meet deadlines effectively", url: "https://deadliner.wangdadi.xyz/" },
  { name: "ZeroSub", description: "Zero subscription costs", url: "https://zerosub.wangdadi.xyz/" },
  { name: "Mockup Nuke", description: "Create mockups quickly", url: "https://mockupnuke.wangdadi.xyz/" },
  { name: "Script Kill", description: "Optimize and clean scripts", url: "https://scriptkill.wangdadi.xyz/" },
  { name: "Viral Hook", description: "Create viral content hooks", url: "https://viralhook.wangdadi.xyz/" },
  { name: "One Page SaaS", description: "SaaS in a single page", url: "https://onepagesaas.wangdadi.xyz/" },
  { name: "CineSkin", description: "Film and video tools", url: "https://cineskin.wangdadi.xyz/" }
];

interface PowerToolsSuiteProps {
  currentSlug: string;
}

export default function PowerToolsSuite({ currentSlug }: PowerToolsSuiteProps) {
  // 使用 slug 的哈希值来确保每次渲染时选择的站点是确定的（对 SEO 友好）
  const hash = currentSlug.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  // 随机选择 3-5 个站点展示
  const shuffled = [...powerToolsSites].sort((a, b) => {
    const hashA = (hash + a.name.charCodeAt(0)) % 100;
    const hashB = (hash + b.name.charCodeAt(0)) % 100;
    return hashA - hashB;
  });
  
  const selectedSites = shuffled.slice(0, 4);
  
  return (
    <section className="bg-white border border-slate-200 p-8">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-1 h-8 bg-red-600"></div>
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Zap size={24} className="text-red-600" />
          Power Tools Suite
        </h2>
      </div>
      <p className="text-slate-600 mb-6">
        Explore other powerful tools in our ecosystem
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {selectedSites.map((site) => (
          <a
            key={site.url}
            href={site.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-4 border border-slate-200 hover:border-red-500 hover:bg-red-50 transition-colors"
          >
            <h3 className="font-bold text-slate-900 mb-1">
              {site.name}
            </h3>
            <p className="text-sm text-slate-500">
              {site.description}
            </p>
            <p className="text-xs text-slate-400 mt-2">
              {site.url}
            </p>
          </a>
        ))}
      </div>
    </section>
  );
}
