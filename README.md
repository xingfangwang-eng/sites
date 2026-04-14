# 多租户 (Multi-tenant) 架构 Demo

## 项目介绍

这是一个多租户架构的演示项目，展示如何使用一套核心代码支持多个二级域名，通过识别 HTTP_HOST 来自动切换数据库和配置。

## 架构特点

- **一套代码**: 所有二级域名共享同一套核心代码
- **动态配置**: 根据 HTTP_HOST 自动切换配置
- **数据隔离**: 不同租户的数据完全隔离
- **主题定制**: 每个租户有独立的主题配置
- **功能开关**: 基于租户的功能权限控制

## 技术栈

- Next.js 16.2.3
- React 19.2.4
- TypeScript
- Tailwind CSS

## 项目结构

```
multi-tenant-demo/
├── app/
│   ├── layout.tsx          # 根布局
│   ├── page.tsx            # 主页面
│   ├── components/         # 共享组件
│   │   └── BaseLayout.tsx  # 基础布局
│   └── tenants/            # 租户特定组件
│       ├── artemisreentry/ # Artemis Reentry 租户
│       └── coachellaviral/ # Coachella Viral 租户
├── lib/
│   ├── tenant.ts           # 租户识别逻辑
│   └── storage.ts          # 租户数据存储
├── package.json
└── next.config.ts
```

## 快速开始

### 1. 安装依赖

```bash
npm install
# 或使用 pnpm
pnpm install
```

### 2. 启动开发服务器

```bash
npm run dev
# 或使用 pnpm
pnpm dev
```

### 3. 测试多租户功能

由于是本地开发环境，我们需要修改 hosts 文件来模拟不同的二级域名：

**Windows**: `C:\Windows\System32\drivers\etc\hosts`
**Mac/Linux**: `/etc/hosts`

在 hosts 文件中添加以下条目：

```
127.0.0.1 localhost
127.0.0.1 artemisreentry.wangdadi.xyz
127.0.0.1 coachellaviral.wangdadi.xyz
```

然后访问以下地址测试：
- 主域名: http://localhost:3000
- Artemis Reentry: http://artemisreentry.wangdadi.xyz:3000
- Coachella Viral: http://coachellaviral.wangdadi.xyz:3000

## 租户配置

租户配置位于 `lib/tenant.ts` 文件中，包含以下信息：

- **id**: 租户唯一标识
- **name**: 租户名称
- **domain**: 租户域名
- **theme**: 主题配置（颜色等）
- **features**: 功能开关

## 数据存储

使用 `TenantStorage` 类实现租户数据隔离，数据存储在 localStorage 中，以租户 ID 作为前缀，确保不同租户的数据互不干扰。

## 迁移步骤

### 从物理多副本迁移到逻辑多租户

1. **分析现有项目**: 识别核心代码和租户特定代码
2. **创建多租户基础架构**: 搭建共享代码结构
3. **迁移租户代码**: 将租户特定代码迁移到 `app/tenants/` 目录
4. **配置租户信息**: 在 `lib/tenant.ts` 中添加租户配置
5. **测试验证**: 确保所有租户功能正常

## 扩展新租户

要添加新租户，只需：

1. 在 `lib/tenant.ts` 中添加新的租户配置
2. 在 `app/tenants/` 目录中创建新的租户组件
3. 在 `app/page.tsx` 中注册新租户组件

## 生产部署

1. **域名配置**: 所有二级域名指向同一服务器
2. **环境变量**: 配置生产环境变量
3. **构建部署**: 运行 `npm run build` 构建项目
4. **启动服务**: 部署到生产服务器

## 性能优化

- **代码分割**: 每个租户的代码单独打包
- **缓存策略**: 合理使用缓存提高性能
- **资源优化**: 按需加载租户特定资源

## 安全考虑

- **数据隔离**: 严格的租户数据隔离
- **权限控制**: 基于租户的功能权限管理
- **输入验证**: 防止恶意输入
- **CORS 配置**: 合理配置跨域资源共享

## 未来扩展

- **租户管理界面**: 可视化管理租户配置
- **API 网关**: 统一 API 管理
- **数据分析**: 跨租户数据分析
- **多环境支持**: 开发、测试、生产环境配置

## 许可证

MIT
