import { MetadataRoute } from 'next';
import seoDatabase from '@/src/data/pSEO-database.json';

export const GET = (): Response => {
  const baseUrl = 'https://noseotop.vercel.app';
  
  // 生成 SEO 页面的站点地图条目
  const seoPages = seoDatabase.map((item: any) => ({
    url: `${baseUrl}/solution/${item.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));
  
  // 根页面
  const rootPage = {
    url: baseUrl,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 1.0,
  };
  
  const sitemap = [rootPage, ...seoPages];
  
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${sitemap.map((item) => `
    <url>
      <loc>${item.url}</loc>
      <lastmod>${item.lastModified.toISOString()}</lastmod>
      <changefreq>${item.changeFrequency}</changefreq>
      <priority>${item.priority}</priority>
    </url>
  `).join('')}
</urlset>`;
  
  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
};
