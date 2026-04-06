# SaaSKiller.ai 开发需求文档 (PRD)

## 1. 产品定义

**定位：** 极简 SaaS 账单审计与一键退订指南。

**目标用户：** 订阅了无数 AI 工具、API、流媒体却忘记关掉的"数字囤积者"。

**杀手锏：** "僵尸扫描"。上传账单，我告诉你哪些是重复扣费，并直接给你退订链接。

## 2. 核心功能切片 (The "Kill" Features)

### Zero-Knowledge Parser
拖拽上传银行或信用卡导出的 CSV 账单。

### SaaS Detective
自动匹配预设的 500+ 全球主流 SaaS（如 OpenAI, Cursor, Midjourney, Netflix, Adobe 等）的扣费关键词。

### The "Waste" Report
自动算出你每年在这些"僵尸项目"上浪费了多少钱。

### One-Click Escape
每一个扣费项旁边，直接放一个醒目的红按钮："Kill This"，点击直达该 SaaS 的取消订阅页面。

## 3. 技术栈建议

| 组件 | 技术选型 |
|------|----------|
| 框架 | Next.js 14 + Tailwind CSS (极致速度) |
| 解析逻辑 | Papaparse (处理 CSV) + 纯前端关键词匹配逻辑 |
| 隐私保证 | 100% Client-Side。数据不上传服务器，直接在浏览器内存处理，处理完即销毁。 |
| 数据库 | 无。使用一个硬编码在代码里的 SaaS_Database.json（包含名称、关键词、退订链接）。 |

## 4. 项目结构规划

```
saaskiller/
├── app/
│   ├── page.tsx              # 主页面
│   ├── layout.tsx            # 布局
│   └── globals.css           # 全局样式
├── components/
│   ├── FileUploader.tsx      # CSV 上传组件
│   ├── BillAnalyzer.tsx      # 账单分析组件
│   ├── WasteReport.tsx       # 浪费报告组件
│   └── KillButton.tsx        # 退订按钮组件
├── lib/
│   ├── parser.ts             # CSV 解析逻辑
│   ├── matcher.ts            # SaaS 关键词匹配
│   └── calculator.ts         # 费用计算
├── data/
│   └── SaaS_Database.json    # SaaS 数据库 (500+ 服务)
└── package.json
```

## 5. SaaS_Database.json 数据结构

```json
{
  "services": [
    {
      "id": "openai",
      "name": "OpenAI",
      "keywords": ["openai", "chatgpt", "gpt-4"],
      "cancelUrl": "https://platform.openai.com/account/billing",
      "category": "AI Tools",
      "icon": "🤖"
    },
    {
      "id": "cursor",
      "name": "Cursor",
      "keywords": ["cursor", "cursor.sh"],
      "cancelUrl": "https://cursor.sh/settings",
      "category": "AI Tools",
      "icon": "✨"
    }
  ]
}
```

## 6. 核心流程

1. **上传** → 用户拖拽/选择 CSV 账单文件
2. **解析** → Papaparse 在浏览器端解析 CSV
3. **匹配** → 遍历账单记录，匹配 SaaS 关键词
4. **聚合** → 按服务商聚合扣费记录
5. **报告** → 生成浪费报告，展示年度总花费
6. **退订** → 提供 One-Click 退订链接

## 7. 隐私承诺

- ✅ 100% 客户端处理
- ✅ 数据不离开浏览器
- ✅ 无服务器存储
- ✅ 无用户追踪
- ✅ 处理完即销毁
