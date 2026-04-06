# BaseSEOLayout 组件文档

## 概述

BaseSEOLayout 是一个标准化的 SEO 页面布局组件，专为 Programmatic SEO (pSEO) 设计。它包含以下核心功能：

- **暴力对比表**: 与竞争对手的功能对比
- **避坑指南**: 专家口吻的陷阱警告
- **红按钮**: 高转化率的 CTA 按钮
- **Schema.org 结构化数据**: 自动生成的 JSON-LD

## 安装

将 `BaseSEOLayout.tsx` 复制到你的 Next.js 项目的 `components` 目录。

## 数据接口

### SEOData 接口

```typescript
interface SEOData {
  keyword: string          // 目标关键词
  slug: string            // URL 路径
  title: string           // 页面标题
  problem_description: string  // 问题描述 (≥500 字符)
  how_to_solve: string    // 解决方案
}
```

### BaseSEOLayoutProps 接口

```typescript
interface BaseSEOLayoutProps {
  data: SEOData           // 当前页面数据
  relatedPages: SEOData[] // 相关页面（用于侧边栏）
  siteName: string        // 站点名称
  siteUrl: string         // 站点 URL
  ctaText?: string        // CTA 按钮文字（默认：START WRITING NOW）
  ctaUrl?: string         // CTA 按钮链接（默认：/）
  children?: React.ReactNode  // 自定义内容
}
```

## 使用示例

### 1. 准备数据文件 (seo-data.json)

```json
{
  "site": {
    "name": "YourSite",
    "url": "https://yoursite.vercel.app"
  },
  "pages": [
    {
      "keyword": "your target keyword",
      "slug": "your-page-slug",
      "title": "Your Page Title",
      "problem_description": "Detailed problem description (min 500 chars)...",
      "how_to_solve": "Your solution description"
    }
  ]
}
```

### 2. 创建动态页面 ([slug]/page.tsx)

```tsx
import BaseSEOLayout, { SEOData, generateSEOMetadata } from '@/components/BaseSEOLayout'
import seoData from '@/data/seo-data.json'

// 生成静态参数
export async function generateStaticParams() {
  return seoData.pages.map((page: SEOData) => ({
    slug: page.slug
  }))
}

// 生成元数据
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const page = seoData.pages.find((p: SEOData) => p.slug === params.slug)
  if (!page) return {}
  
  return generateSEOMetadata(page, seoData.site.name, seoData.site.url)
}

// 页面组件
export default function SEOPage({ params }: { params: { slug: string } }) {
  const page = seoData.pages.find((p: SEOData) => p.slug === params.slug)
  if (!page) return <div>Page not found</div>

  // 获取相关页面（排除当前页面）
  const relatedPages = seoData.pages
    .filter((p: SEOData) => p.slug !== params.slug)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3)

  return (
    <BaseSEOLayout
      data={page}
      relatedPages={relatedPages}
      siteName={seoData.site.name}
      siteUrl={seoData.site.url}
    >
      {/* 可选：添加自定义内容 */}
      <div>Your custom content here</div>
    </BaseSEOLayout>
  )
}
```

## 组件特性

### 1. 暴力对比表 (ComparisonTable)

自动生成的对比表格，包含以下维度：
- Startup Time (启动时间)
- Memory Usage (内存占用)
- AI Features (AI 功能)
- Cloud Sync (云同步)
- Data Tracking (数据追踪)
- Offline Mode (离线模式)
- Subscription (订阅费用)

### 2. 避坑指南 (PitfallGuide)

专家口吻的 4 大陷阱警告：
1. AI 功能无法真正关闭
2. 云同步的隐私风险
3. 插件生态的安全隐患
4. 订阅陷阱

### 3. 红按钮 (RedButton)

高转化率的 CTA 按钮，可自定义文字和链接。

### 4. Schema.org 结构化数据

自动生成的 JSON-LD 包含：
- HowTo 类型
- 5 个步骤的解决方案
- 工具信息
- 预估时间和成本
- 聚合评分

## 样式定制

组件使用内联样式，你可以通过以下方式覆盖：

1. **全局 CSS**: 在 `globals.css` 中添加样式
2. **CSS Modules**: 创建 `.module.css` 文件
3. **Tailwind**: 修改组件使用 Tailwind 类名

## 多站点部署

对于 18 个站点的矩阵部署：

1. 每个站点使用相同的 `BaseSEOLayout.tsx`
2. 每个站点有独立的 `seo-data.json`
3. 通过 CI/CD 自动化部署流程

### 站点间互联

在 `relatedPages` 中混入其他站点的链接：

```typescript
// 从其他站点获取页面
const externalPages = [
  { slug: 'site2-page1', title: 'Site 2 Page', url: 'https://site2.vercel.app' },
  // ...
]

// 合并到 relatedPages
const allRelatedPages = [...relatedPages, ...externalPages]
  .sort(() => Math.random() - 0.5)
  .slice(0, 3)
```

## SEO 优化建议

1. **问题描述**: 确保每个页面的 `problem_description` ≥500 字符
2. **关键词**: 使用长尾关键词，避免过度竞争
3. **更新频率**: 定期更新内容，保持新鲜度
4. **内部链接**: 充分利用 `You May Also Like` 模块
5. **Schema 数据**: 确保 JSON-LD 格式正确

## 故障排除

### 页面未生成
检查 `generateStaticParams` 是否正确返回所有 slug。

### 元数据不显示
确保 `generateMetadata` 返回正确的 Metadata 对象。

### 样式问题
组件使用 flexbox 布局，确保父容器没有冲突的样式。

## 更新日志

- v1.0.0: 初始版本，包含基础 SEO 功能
- v1.1.0: 添加避坑指南模块
- v1.2.0: 添加 Schema.org 结构化数据
