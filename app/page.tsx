import { getTenantFromHost, getDefaultTenant, getAllTenants } from '../lib/tenant';
import ArtemisReentryApp from './tenants/artemisreentry/App';
import CoachellaViralApp from './tenants/coachellaviral/App';
import FanGuardApp from './tenants/fanguard/App';
import GenericApp from './tenants/generic/App';

const TENANT_COMPONENTS = {
  artemisreentry: ArtemisReentryApp,
  coachellaviral: CoachellaViralApp,
  fanguard: FanGuardApp,
  // 通用组件用于其他站点
  billripper: GenericApp,
  boothell: GenericApp,
  brainbridge: GenericApp,
  'capsule-factory-saas': GenericApp,
  chapterpredictor: GenericApp,
  cineskin: GenericApp,
  cleancsvai: GenericApp,
  crosspostfast: GenericApp,
  deadliner: GenericApp,
  dentaiagent: GenericApp,
  focusinbox: GenericApp,
  giveawaytracker: GenericApp,
  killbillcard: GenericApp,
  killsaas: GenericApp,
  killsubscription: GenericApp,
  killswitchapi: GenericApp,
  manualslib: GenericApp,
  mememooncalculator: GenericApp,
  mockupnuke: GenericApp,
  navslayer: GenericApp,
  neveruploadio: GenericApp,
  noaimd: GenericApp,
  noseotop: GenericApp,
  nukeprivacy: GenericApp,
  'office-sync': GenericApp,
  oneclickapi: GenericApp,
  onecommand: GenericApp,
  onepagesaas: GenericApp,
  personalock: GenericApp,
  pingthemio: GenericApp,
  rugradar: GenericApp,
  saaskiller: GenericApp,
  saasstripper: GenericApp,
  samirapulse: GenericApp,
  scriptkill: GenericApp,
  slimsnd: GenericApp,
  smesurvivalai: GenericApp,
  songkrangenerator: GenericApp,
  stopaicost: GenericApp,
  stopsaas: GenericApp,
  stoptheswitch: GenericApp,
  viralhook: GenericApp,
  zerocloud: GenericApp,
  zerosub: GenericApp,
  // 新添加的站点
  free_ebook_maker: GenericApp,
  tweetvirality: GenericApp,
  bbb26dramapredictor: GenericApp,
  deshaefrost: GenericApp,
  autotask: GenericApp,
  noadobe: GenericApp,
  linguisticdnaextractor: GenericApp,
  humbled: GenericApp,
};

// 站点分类映射
const SITE_CATEGORIES: Record<string, string> = {
  songkrangenerator: 'Audio Tools',
  artemisreentry: 'Science Tools',
  coachellaviral: 'Social Media',
  tweetvirality: 'Social Media',
  bbb26dramapredictor: 'Entertainment Tools',
  deshaefrost: 'Social Media',
  billripper: 'Productivity Tools',
  boothell: 'Development Tools',
  brainbridge: 'AI Tools',
  'capsule-factory-saas': 'Business Tools',
  chapterpredictor: 'Content Tools',
  cineskin: 'Media Tools',
  cleancsvai: 'Productivity Tools',
  crosspostfast: 'Social Media',
  deadliner: 'Productivity Tools',
  dentaiagent: 'Health Tools',
  focusinbox: 'Productivity Tools',
  giveawaytracker: 'Marketing Tools',
  killbillcard: 'Finance Tools',
  killsaas: 'Business Tools',
  killsubscription: 'Business Tools',
  killswitchapi: 'Development Tools',
  manualslib: 'Reference Tools',
  mememooncalculator: 'Entertainment Tools',
  mockupnuke: 'Design Tools',
  navslayer: 'Navigation Tools',
  neveruploadio: 'Security Tools',
  noaimd: 'Health Tools',
  noseotop: 'SEO Tools',
  nukeprivacy: 'Security Tools',
  'office-sync': 'Business Tools',
  oneclickapi: 'Development Tools',
  onecommand: 'Productivity Tools',
  onepagesaas: 'Business Tools',
  personalock: 'Security Tools',
  pingthemio: 'Network Tools',
  rugradar: 'Crypto Tools',
  saaskiller: 'Business Tools',
  saasstripper: 'Business Tools',
  samirapulse: 'Social Media',
  scriptkill: 'Entertainment Tools',
  slimsnd: 'Audio Tools',
  smesurvivalai: 'Business Tools',
  stopaicost: 'AI Tools',
  stopsaas: 'Business Tools',
  stoptheswitch: 'Business Tools',
  viralhook: 'Social Media',
  zerocloud: 'Cloud Tools',
  zerosub: 'Social Media',
  free_ebook_maker: 'Content Tools',
  autotask: 'Productivity Tools',
  noadobe: 'Design Tools',
  linguisticdnaextractor: 'AI Tools',
  humbled: 'Lifestyle Tools',
};

export default function Home() {
  const host = typeof window !== 'undefined' ? window.location.host : '';
  const tenant = getTenantFromHost(host) || getDefaultTenant();
  
  const TenantComponent = TENANT_COMPONENTS[tenant.id as keyof typeof TENANT_COMPONENTS];
  
  // 检查是否为根域名访问（显示站点目录）
  const isRootDomain = !host || host === 'localhost:3000' || host === 'www.wangdadi.xyz';
  
  if (TenantComponent && !isRootDomain) {
    return <TenantComponent tenant={tenant} />;
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">

      {/* 主内容 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 标题和摘要 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Site Directory Center</h1>
          <p className="text-gray-600 text-lg">Explore our product ecosystem and discover quality services</p>
        </div>

        {/* 站点统计 */}
        <div className="mb-8">
          <div className="flex items-center">
            <h2 className="text-2xl font-bold">All Sites</h2>
            <span className="ml-4 px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">Total {getAllTenants().length} sites</span>
          </div>
        </div>

        {/* 站点卡片网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {getAllTenants().map((site) => {
            const category = SITE_CATEGORIES[site.id] || 'Other';
            return (
              <div key={site.id} className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition">
                {/* 分类标签 */}
                <div className="flex justify-between items-start mb-4">
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">{category}</span>
                  <span className="text-gray-400 text-xs">2026-04-12</span>
                </div>
                
                {/* 站点标题 */}
                <h3 className="text-xl font-bold mb-2">{site.name}</h3>
                
                {/* 站点描述 */}
                <p className="text-gray-600 mb-4">
                  {site.name} - {site.name} - One-stop service platform with comprehensive solutions. Focused on {category} to provide quality services to users.
                </p>
                
                {/* 访问链接 */}
                <a 
                  href={`http://${site.domain}`} 
                  className="inline-flex items-center text-purple-600 hover:text-purple-800 font-medium"
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Visit Site
                  <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            );
          })}
        </div>
      </main>

      {/* 页脚 */}
      <footer className="bg-gray-100 border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-purple-600 mb-2">Wang Dadi</span>
            <p className="text-gray-600 mb-4">Support: 457239850@qq.com</p>
            <p className="text-gray-500 text-sm">© 2026 Wang Dadi. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
