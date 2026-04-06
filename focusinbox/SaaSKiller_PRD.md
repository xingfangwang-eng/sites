# SaaSKiller.ai 产品需求文档 (PRD)

## 1. 产品定义

### 1.1 产品定位
极简 SaaS 账单审计与一键退订指南

### 1.2 目标用户
订阅了无数 AI 工具、API、流媒体却忘记关掉的"数字囤积者"

### 1.3 核心价值主张
"僵尸扫描" - 上传账单，我告诉你哪些是重复扣费，并直接给你退订链接

### 1.4 产品愿景
帮助用户识别并清理不再使用的订阅服务，节省不必要的开支

## 2. 核心功能切片 (The "Kill" Features)

### 2.1 Zero-Knowledge Parser
**功能描述**：
- 拖拽上传银行或信用卡导出的 CSV 账单
- 支持 CSV、PDF 格式
- 100% 客户端处理，数据不上传服务器

**用户故事**：
作为一个注重隐私的用户，我希望能够安全地上传我的账单文件，而不必担心数据泄露。

**技术实现**：
- 使用 Papaparse 解析 CSV 文件
- 使用 pdf-lib 或 pdf.js 解析 PDF 文件
- 所有处理在浏览器内存中完成，处理完即销毁

### 2.2 SaaS Detective
**功能描述**：
- 自动匹配预设的 500+ 全球主流 SaaS 的扣费关键词
- 支持模糊匹配和正则表达式匹配
- 识别订阅模式（月付、年付、按使用量付费）

**支持的 SaaS 类别**：
- AI 工具：OpenAI, Cursor, Midjourney, Claude, Perplexity, etc.
- 开发工具：GitHub, GitLab, JetBrains, etc.
- 云服务：AWS, GCP, Azure, Vercel, etc.
- 流媒体：Netflix, Spotify, Disney+, etc.
- 生产力工具：Adobe, Figma, Notion, etc.
- 其他：Zoom, Slack, Dropbox, etc.

**用户故事**：
作为一个订阅了多个服务的用户，我希望系统能够自动识别我的所有订阅，而不需要我手动查找。

### 2.3 The "Waste" Report
**功能描述**：
- 自动计算每年在"僵尸项目"上浪费的金额
- 按类别分组展示订阅费用
- 提供月度、季度、年度费用统计
- 可视化图表展示费用分布

**报告内容**：
- 总订阅数量
- 月度总费用
- 年度总费用
- 可能的节省金额
- 按类别分类的费用明细

**用户故事**：
作为一个想要节省开支的用户，我希望看到我在订阅服务上花费的详细报告，以便做出明智的取消决定。

### 2.4 One-Click Escape
**功能描述**：
- 每一个扣费项旁边放置醒目的红按钮："Kill This"
- 点击直达该 SaaS 的取消订阅页面
- 提供取消订阅的详细步骤指南
- 支持一键复制取消订阅邮件模板

**用户故事**：
作为一个想要取消订阅的用户，我希望能够快速找到取消订阅的入口，而不需要在复杂的设置页面中寻找。

## 3. 技术架构

### 3.1 技术栈
- **框架**: Next.js 14 + Tailwind CSS
- **解析库**: Papaparse (CSV), pdf-lib (PDF)
- **图表库**: Recharts 或 Chart.js
- **状态管理**: React Context API
- **数据存储**: 硬编码的 SaaS_Database.json

### 3.2 架构设计
```
┌─────────────────────────────────────────┐
│         Client-Side Processing          │
├─────────────────────────────────────────┤
│  ┌──────────────┐  ┌─────────────────┐ │
│  │  File Upload │  │  CSV/Parser     │ │
│  │  Component   │──▶  (Papaparse)    │ │
│  └──────────────┘  └─────────────────┘ │
│         │                    │          │
│         ▼                    ▼          │
│  ┌──────────────────────────────────┐  │
│  │   SaaS Pattern Matcher           │  │
│  │   (500+ SaaS Keywords)           │  │
│  └──────────────────────────────────┘  │
│         │                              │
│         ▼                              │
│  ┌──────────────────────────────────┐  │
│  │   Waste Report Generator         │  │
│  │   (Cost Calculation)             │  │
│  └──────────────────────────────────┘  │
│         │                              │
│         ▼                              │
│  ┌──────────────────────────────────┐  │
│  │   Kill List Display              │  │
│  │   (One-Click Unsubscribe)        │  │
│  └──────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

### 3.3 数据结构

#### SaaS_Database.json
```json
{
  "saas_list": [
    {
      "id": "openai",
      "name": "OpenAI",
      "keywords": ["openai", "chatgpt", "gpt-4", "api.openai"],
      "category": "AI Tools",
      "pricing_model": "usage",
      "cancel_url": "https://platform.openai.com/account/billing",
      "support_email": "support@openai.com",
      "cancel_difficulty": "easy",
      "logo": "/logos/openai.svg"
    },
    {
      "id": "netflix",
      "name": "Netflix",
      "keywords": ["netflix", "nflx"],
      "category": "Streaming",
      "pricing_model": "subscription",
      "cancel_url": "https://www.netflix.com/cancel",
      "support_email": "support@netflix.com",
      "cancel_difficulty": "easy",
      "logo": "/logos/netflix.svg"
    }
  ]
}
```

#### 账单数据结构
```typescript
interface Transaction {
  date: string;
  description: string;
  amount: number;
  currency: string;
  category?: string;
}

interface Subscription {
  saas: SaaSEntry;
  transactions: Transaction[];
  totalAmount: number;
  frequency: 'monthly' | 'yearly' | 'usage';
  lastCharge: string;
}

interface WasteReport {
  totalSubscriptions: number;
  monthlyCost: number;
  yearlyCost: number;
  potentialSavings: number;
  subscriptions: Subscription[];
  categories: Record<string, number>;
}
```

## 4. UI/UX 设计

### 4.1 设计原则
- **极简主义**: 黑白配色，简洁界面
- **隐私优先**: 明确标注"100% 客户端处理"
- **行动导向**: 突出"Kill This"按钮
- **数据可视化**: 清晰的图表和统计数据

### 4.2 页面结构

#### 主页面布局
```
┌─────────────────────────────────────────┐
│  Logo        "100% Client-Side" Badge   │
├─────────────────────────────────────────┤
│                                         │
│      Drag & Drop Your Bill Here         │
│      [Upload CSV/PDF]                   │
│                                         │
│      Your data never leaves your device │
│                                         │
├─────────────────────────────────────────┤
│  How It Works:                          │
│  1. Upload → 2. Analyze → 3. Kill       │
└─────────────────────────────────────────┘
```

#### 报告页面布局
```
┌─────────────────────────────────────────┐
│  Your Waste Report                      │
├─────────────────────────────────────────┤
│  ┌─────────┐ ┌─────────┐ ┌─────────┐  │
│  │ Total   │ │ Monthly │ │ Yearly  │  │
│  │ $1,200  │ │  $100   │ │ $1,200  │  │
│  └─────────┘ └─────────┘ └─────────┘  │
├─────────────────────────────────────────┤
│  [Chart: Cost by Category]              │
├─────────────────────────────────────────┤
│  Subscription List:                     │
│  ┌───────────────────────────────────┐ │
│  │ OpenAI        $50/mo   [Kill This]│ │
│  │ Netflix       $15/mo   [Kill This]│ │
│  │ Spotify       $10/mo   [Kill This]│ │
│  └───────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

### 4.3 配色方案
- **主色**: 纯黑 (#000000)
- **文字**: 纯白 (#FFFFFF)
- **强调色**: 红色 (#FF0000) - 用于"Kill This"按钮
- **辅助色**: 灰色 (#808080)
- **成功色**: 绿色 (#00FF00)

## 5. 功能流程

### 5.1 用户流程图
```
Start
  │
  ▼
Upload Bill (CSV/PDF)
  │
  ▼
Parse Data (Client-Side)
  │
  ▼
Match SaaS Keywords
  │
  ▼
Generate Waste Report
  │
  ▼
Display Subscriptions
  │
  ▼
User Clicks "Kill This"
  │
  ▼
Open Cancel URL
  │
  ▼
User Cancels Subscription
  │
  ▼
End
```

### 5.2 数据处理流程
```
1. 用户上传文件
   ↓
2. 验证文件格式
   ↓
3. 解析文件内容 (Papaparse/pdf-lib)
   ↓
4. 提取交易记录
   ↓
5. 匹配 SaaS 关键词
   ↓
6. 计算费用统计
   ↓
7. 生成报告
   ↓
8. 显示结果
   ↓
9. 清理内存数据
```

## 6. 隐私与安全

### 6.1 隐私保证
- **100% Client-Side**: 所有数据处理在浏览器中完成
- **无服务器上传**: 数据永不上传到服务器
- **内存处理**: 数据仅在内存中处理，处理完即销毁
- **无日志记录**: 不记录任何用户数据

### 6.2 安全措施
- 文件类型验证
- 文件大小限制 (最大 10MB)
- XSS 防护
- CSP (Content Security Policy) 头部

### 6.3 隐私声明
```
Your Privacy is Our Priority:
- Your financial data never leaves your device
- All processing happens in your browser's memory
- No data is stored on our servers
- No cookies, no tracking, no analytics
```

## 7. 开发计划

### 7.1 MVP 功能 (Phase 1)
- [ ] 文件上传组件 (CSV 支持)
- [ ] CSV 解析功能
- [ ] SaaS 关键词匹配 (100+ 常用服务)
- [ ] 基础费用报告
- [ ] "Kill This" 按钮功能

### 7.2 增强功能 (Phase 2)
- [ ] PDF 文件支持
- [ ] 500+ SaaS 数据库
- [ ] 高级费用分析
- [ ] 可视化图表
- [ ] 导出报告功能

### 7.3 高级功能 (Phase 3)
- [ ] 自定义 SaaS 添加
- [ ] 订阅提醒功能
- [ ] 费用趋势分析
- [ ] 多语言支持
- [ ] 移动端适配

## 8. 性能指标

### 8.1 性能目标
- 文件上传响应时间: < 100ms
- CSV 解析时间: < 1s (10MB 文件)
- 关键词匹配时间: < 500ms
- 页面加载时间: < 2s
- 首次内容绘制 (FCP): < 1s

### 8.2 优化策略
- 使用 Web Workers 处理大文件
- 懒加载 SaaS 数据库
- 虚拟滚动长列表
- 代码分割和按需加载

## 9. 测试计划

### 9.1 单元测试
- CSV 解析器测试
- 关键词匹配算法测试
- 费用计算逻辑测试

### 9.2 集成测试
- 文件上传流程测试
- 端到端用户流程测试

### 9.3 用户测试
- 可用性测试
- 隐私信任度测试
- 功能完整性测试

## 10. 成功指标

### 10.1 KPI
- 月活用户数 (MAU)
- 平均节省金额
- 用户留存率
- "Kill" 按钮点击率

### 10.2 用户满意度
- NPS (Net Promoter Score)
- 用户反馈评分
- 功能使用率

## 11. 风险与挑战

### 11.1 技术风险
- PDF 解析复杂性
- 大文件处理性能
- 浏览器兼容性

### 11.2 业务风险
- 用户隐私顾虑
- SaaS 关键词准确性
- 取消链接有效性

### 11.3 应对策略
- 提供详细的隐私说明
- 建立用户反馈机制
- 定期更新 SaaS 数据库

## 12. 未来规划

### 12.1 短期目标 (3 个月)
- 完成 MVP 开发
- 上线测试版本
- 收集用户反馈

### 12.2 中期目标 (6 个月)
- 扩展 SaaS 数据库至 500+
- 添加高级分析功能
- 优化用户体验

### 12.3 长期目标 (1 年)
- 成为订阅管理领域的领先工具
- 建立用户社区
- 探索商业化模式

## 13. 附录

### 13.1 参考资料
- [Papaparse 文档](https://www.papaparse.com/)
- [Next.js 14 文档](https://nextjs.org/docs)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)

### 13.2 竞品分析
- Truebill (Rocket Money)
- Trim
- Bobby
- SubscriptMe

### 13.3 法律声明
- 服务条款
- 隐私政策
- 免责声明

---

**文档版本**: 1.0
**创建日期**: 2024-01-XX
**最后更新**: 2024-01-XX
**负责人**: Product Team
