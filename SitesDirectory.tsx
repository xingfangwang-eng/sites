import fs from 'fs';
import path from 'path';
import { format, subDays, parseISO } from 'date-fns';

interface Site {
  subdomain: string;
  title: string;
  category: string;
  created_at: string;
  is_pushed: boolean;
}

const DESCRIPTIONS = [
  "专业的在线工具平台，提供高效便捷的服务体验",
  "创新解决方案，助力用户提升工作效率",
  "简洁易用的界面设计，快速上手无门槛",
  "强大的功能支持，满足多样化需求",
  "安全可靠的服务保障，值得信赖的选择",
  "智能化工具，简化复杂流程",
  "一站式服务平台，全方位解决方案",
  "用户友好的交互体验，让工作更轻松",
  "高效实用的在线工具，提升生产力",
  "专业团队打造，品质保证的服务平台"
];

function generateDescription(title: string, category: string): string {
  const randomDesc = DESCRIPTIONS[Math.floor(Math.random() * DESCRIPTIONS.length)];
  return `${title} - ${randomDesc}。专注于${category}领域，为用户提供优质服务。`;
}

function loadSitesData(): Site[] {
  const sitesPath = path.join(process.cwd(), '..', 'sites_list.json');
  
  if (!fs.existsSync(sitesPath)) {
    return [];
  }
  
  const fileContent = fs.readFileSync(sitesPath, 'utf-8');
  const data = JSON.parse(fileContent);
  
  return data.sites || [];
}

function getRecentSites(sites: Site[], days: number = 3): Site[] {
  const cutoffDate = subDays(new Date(), days);
  
  return sites
    .filter(site => {
      const siteDate = parseISO(site.created_at);
      return siteDate >= cutoffDate;
    })
    .sort((a, b) => 
      parseISO(b.created_at).getTime() - parseISO(a.created_at).getTime()
    );
}

function getAllSitesSorted(sites: Site[]): Site[] {
  return [...sites].sort((a, b) => 
    parseISO(b.created_at).getTime() - parseISO(a.created_at).getTime()
  );
}

export default function SitesDirectory() {
  const sites = loadSitesData();
  const recentSites = getRecentSites(sites, 3);
  const allSites = getAllSitesSorted(sites);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-slate-900">
            站点导航中心
          </h1>
          <p className="mt-2 text-slate-600">
            探索我们的产品生态，发现更多优质服务
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Recently Launched Section */}
        {recentSites.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-8 w-1 bg-gradient-to-b from-indigo-600 to-purple-600 rounded-full"></div>
              <h2 className="text-2xl font-bold text-slate-900">
                Recently Launched
              </h2>
              <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-sm font-medium rounded-full">
                最新上线
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentSites.map((site, index) => (
                <a
                  key={index}
                  href={site.subdomain}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-white rounded-xl border-2 border-indigo-100 hover:border-indigo-300 p-6 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-100"
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="px-2 py-1 bg-indigo-50 text-indigo-600 text-xs font-medium rounded">
                      {site.category}
                    </span>
                    <span className="text-xs text-slate-400">
                      {format(parseISO(site.created_at), 'yyyy-MM-dd')}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors mb-2">
                    {site.title}
                  </h3>
                  
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {generateDescription(site.title, site.category)}
                  </p>
                  
                  <div className="mt-4 flex items-center text-indigo-600 text-sm font-medium">
                    <span>访问站点</span>
                    <svg className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* All Sites Section */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-8 w-1 bg-gradient-to-b from-slate-600 to-slate-400 rounded-full"></div>
            <h2 className="text-2xl font-bold text-slate-900">
              全部站点
            </h2>
            <span className="px-3 py-1 bg-slate-100 text-slate-700 text-sm font-medium rounded-full">
              共 {allSites.length} 个
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allSites.map((site, index) => (
              <a
                key={index}
                href={site.subdomain}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white rounded-xl border border-slate-200 hover:border-slate-300 p-6 transition-all duration-300 hover:shadow-md"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded">
                    {site.category}
                  </span>
                  <span className="text-xs text-slate-400">
                    {format(parseISO(site.created_at), 'yyyy-MM-dd')}
                  </span>
                </div>
                
                <h3 className="text-base font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors mb-2">
                  {site.title}
                </h3>
                
                <p className="text-sm text-slate-600 leading-relaxed">
                  {generateDescription(site.title, site.category)}
                </p>
                
                <div className="mt-4 flex items-center text-slate-500 text-sm font-medium group-hover:text-indigo-600">
                  <span>访问站点</span>
                  <svg className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold">{allSites.length}</div>
              <div className="text-sm text-indigo-100 mt-1">总站点数</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{recentSites.length}</div>
              <div className="text-sm text-indigo-100 mt-1">近期上线</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">
                {new Set(allSites.map(s => s.category)).size}
              </div>
              <div className="text-sm text-indigo-100 mt-1">服务分类</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">24/7</div>
              <div className="text-sm text-indigo-100 mt-1">在线服务</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
