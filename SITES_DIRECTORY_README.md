# 站点导航组件使用指南

## 📁 文件说明

1. **SitesDirectory.tsx** - 动态渲染组件
2. **sites_list.json** - 站点数据库
3. **manage_sites.py** - 站点管理脚本

## 🚀 快速开始

### 1. 在 Next.js 项目中使用

#### 方法一：创建独立页面

在你的 Next.js 项目中创建页面：

```tsx
// app/sitemap-directory/page.tsx
import SitesDirectory from '../components/SitesDirectory';

export default function SitemapDirectory() {
  return <SitesDirectory />;
}
```

#### 方法二：在首页底部集成

```tsx
// app/page.tsx
import SitesDirectory from '../components/SitesDirectory';

export default function Home() {
  return (
    <div>
      {/* 你的首页内容 */}
      <main>
        <h1>欢迎来到我们的平台</h1>
        {/* 其他内容 */}
      </main>
      
      {/* 在底部添加站点导航 */}
      <SitesDirectory />
    </div>
  );
}
```

### 2. 安装依赖

```bash
npm install date-fns
```

### 3. 复制文件到项目

将以下文件复制到你的 Next.js 项目：

- `SitesDirectory.tsx` → `components/SitesDirectory.tsx`
- `sites_list.json` → 项目根目录或父目录

## 📊 功能特点

### ✨ Recently Launched 板块

- 自动展示最近 3 天内添加的站点
- 对 Google 蜘蛛最友好的新内容区域
- 突出显示，吸引用户注意

### 🎯 SEO 优化

- 每个链接都有独特的标题和描述
- 随机生成的站点简介，避免重复内容
- 响应式设计，移动端友好
- 语义化 HTML 结构

### 📱 响应式布局

- 桌面端：3 列网格
- 平板端：2 列网格
- 移动端：单列布局

### 🎨 视觉设计

- 渐变背景和卡片设计
- 悬停动画效果
- 分类标签和日期显示
- 统计信息展示

## 🔧 自定义配置

### 修改最近站点天数

```tsx
// 在 SitesDirectory.tsx 中修改
const recentSites = getRecentSites(sites, 7); // 改为 7 天
```

### 自定义描述模板

```tsx
// 修改 DESCRIPTIONS 数组
const DESCRIPTIONS = [
  "你的自定义描述模板 1",
  "你的自定义描述模板 2",
  // ...
];
```

### 调整网格布局

```tsx
// 修改 grid 类名
<div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
```

## 📝 添加新站点

### 使用 Python 脚本

```python
from manage_sites import SiteManager

manager = SiteManager()

manager.add_site(
    url="https://newsite.wangdadi.xyz",
    title="新站点标题",
    category="分类名称"
)
```

### 手动编辑 JSON

```json
{
  "sites": [
    {
      "subdomain": "https://newsite.wangdadi.xyz",
      "title": "新站点标题",
      "category": "分类名称",
      "created_at": "2026-03-30T10:00:00Z",
      "is_pushed": false
    }
  ]
}
```

## 🌐 部署注意事项

### Vercel 部署

1. 确保 `sites_list.json` 在项目根目录
2. 组件会自动读取数据
3. 无需额外配置

### 其他平台

1. 确保 Node.js 环境支持文件系统操作
2. 检查文件路径是否正确
3. 验证 JSON 文件格式

## 📈 SEO 建议

1. **定期更新** - 持续添加新站点
2. **丰富描述** - 为每个站点添加独特的内容
3. **分类清晰** - 使用合理的分类体系
4. **内部链接** - 在站点间建立关联

## 🔍 故障排除

### 问题：站点列表为空

**解决方案：**
- 检查 `sites_list.json` 路径是否正确
- 验证 JSON 文件格式
- 确认文件读取权限

### 问题：日期显示错误

**解决方案：**
- 检查日期格式是否为 ISO 8601
- 安装 `date-fns` 依赖
- 验证时区设置

### 问题：样式不显示

**解决方案：**
- 确认 Tailwind CSS 已配置
- 检查类名是否正确
- 清除浏览器缓存

## 📞 技术支持

如有问题，请联系：
- Email: 457239850@qq.com
- GitHub: 提交 Issue

## 📄 许可证

MIT License - 可自由使用和修改
