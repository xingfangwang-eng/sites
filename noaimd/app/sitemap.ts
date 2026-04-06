import { MetadataRoute } from 'next'
import keywordsData from '@data/keywords.json'

interface KeywordData {
  slug: string
  title: string
  lastModified?: string
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://noaimd.vercel.app'
  
  const keywordPages = keywordsData.map((keyword) => ({
    url: `${baseUrl}/${keyword.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...keywordPages,
  ]
}