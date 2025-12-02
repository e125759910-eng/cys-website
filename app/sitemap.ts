import { MetadataRoute } from 'next'
import { works } from '@/data/works'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://cys-website-tau.vercel.app'
  
  // 静态页面
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/portfolio`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/warranty`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ]
  
  // 动态页面（作品集详情页）
  const portfolioPages: MetadataRoute.Sitemap = works.map((work) => ({
    url: `${baseUrl}/portfolio/${work.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.6,
  }))
  
  return [...staticPages, ...portfolioPages]
}

