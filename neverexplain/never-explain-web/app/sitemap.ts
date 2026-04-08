import { MetadataRoute } from 'next';
import keywords from '@/data/keywords.json';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://neverexplain.wangdadi.xyz';
  
  // 生成解决方案页面的 sitemap 条目
  const solutionPages = keywords.map((keyword: any) => ({
    url: `${baseUrl}/solutions/${keyword.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8
  }));
  
  // 生成其他页面的 sitemap 条目
  const otherPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0
    },
    {
      url: `${baseUrl}/solutions`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9
    },
    {
      url: `${baseUrl}/sitemap`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9
    },
    {
      url: `${baseUrl}/calculator`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7
    },
    {
      url: `${baseUrl}/comparison`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7
    },
    {
      url: `${baseUrl}/editor`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7
    }
  ];
  
  return [...otherPages, ...solutionPages];
}
