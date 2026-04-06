#!/usr/bin/env python3
"""
批量导入站点到 sites_list.json
"""

import json
from datetime import datetime, timedelta
import random

# 站点数据（基于实际抓取的信息）
SITES_DATA = [
    {
        "url": "https://noseotop.vercel.app/",
        "title": "NoSEO.top - 搜索真实结果",
        "category": "搜索工具"
    },
    {
        "url": "https://nukeprivacy.vercel.app",
        "title": "NukePrivacy - 本地视频处理",
        "category": "隐私工具"
    },
    {
        "url": "https://killbillcard.vercel.app/",
        "title": "Kill Bill Card - 虚拟信用卡",
        "category": "支付工具"
    },
    {
        "url": "https://zerocloud.vercel.app",
        "title": "ZeroCloud.so - 离线文档智能",
        "category": "文档工具"
    },
    {
        "url": "https://focusinbox-eight.vercel.app",
        "title": "FocusInbox - 专注邮箱管理",
        "category": "效率工具"
    },
    {
        "url": "https://saaskiller.vercel.app",
        "title": "SaaSKiller.ai - 订阅管理",
        "category": "订阅管理"
    },
    {
        "url": "https://noaimd.vercel.app",
        "title": "NoAI.md - 无AI Markdown编辑器",
        "category": "编辑器"
    },
    {
        "url": "https://crosspostfast.vercel.app",
        "title": "CrossPost Fast - 多平台发布工具",
        "category": "社交媒体"
    },
    {
        "url": "https://killswitchapi.vercel.app",
        "title": "KillSwitch API - OpenAI 预算保护",
        "category": "API工具"
    },
    {
        "url": "https://pingthemio.vercel.app",
        "title": "PingThem.io - Gmail跟进工具",
        "category": "邮件工具"
    },
    {
        "url": "https://neveruploadio.vercel.app/",
        "title": "NeverUpload.io - 本地文件处理",
        "category": "隐私工具"
    },
    {
        "url": "https://cleancsvai.vercel.app",
        "title": "CleanCSV.ai - CSV数据清洗",
        "category": "数据处理"
    },
    {
        "url": "https://saasstripper.vercel.app",
        "title": "SaaSStripper - SaaS订阅分析",
        "category": "订阅管理"
    },
    {
        "url": "https://noadobe.vercel.app",
        "title": "NoAdobe - Adobe替代方案",
        "category": "设计工具"
    },
    {
        "url": "https://navslayer.vercel.app",
        "title": "NavSlayer - 导航栏优化",
        "category": "网站优化"
    },
    {
        "url": "https://killsaas.vercel.app",
        "title": "KillSaaS - SaaS成本优化",
        "category": "订阅管理"
    },
    {
        "url": "https://slimsnd.vercel.app",
        "title": "SlimSND - 音频压缩工具",
        "category": "音频工具"
    },
    {
        "url": "https://boothell.vercel.app",
        "title": "BootHell - 启动项管理",
        "category": "系统工具"
    },
    {
        "url": "https://linguisticdnaextractor.wangdadi.xyz/",
        "title": "LinguisticDNA Extractor - 语言DNA提取",
        "category": "语言工具"
    },
    {
        "url": "https://humbled.wangdadi.xyz/",
        "title": "Humbled - 谦逊社交平台",
        "category": "社交媒体"
    },
    {
        "url": "https://stopsaas.wangdadi.xyz/",
        "title": "StopSaaS - SaaS订阅终止",
        "category": "订阅管理"
    },
    {
        "url": "https://oneclickapi.wangdadi.xyz/",
        "title": "OneClickAPI - API测试工具",
        "category": "开发工具"
    },
    {
        "url": "https://stopaicost.wangdadi.xyz/",
        "title": "StopAICost - AI成本控制",
        "category": "AI工具"
    },
    {
        "url": "https://smesurvivalai.wangdadi.xyz/",
        "title": "SMESurvivalAI - 中小企业AI助手",
        "category": "AI工具"
    },
    {
        "url": "https://onecommand.wangdadi.xyz/",
        "title": "OneCommand - 命令行工具集",
        "category": "开发工具"
    },
    {
        "url": "https://killsubscription.wangdadi.xyz/",
        "title": "KillSubscription - 订阅杀手",
        "category": "订阅管理"
    },
    {
        "url": "https://manualslib.wangdadi.xyz/",
        "title": "ManualsLib - 手册文档库",
        "category": "文档工具"
    },
    {
        "url": "https://billripper.wangdadi.xyz/",
        "title": "BillRipper - 账单分析",
        "category": "财务工具"
    },
    {
        "url": "https://deadliner.wangdadi.xyz/",
        "title": "Deadliner - 截止日期管理",
        "category": "效率工具"
    },
    {
        "url": "https://zerosub.wangdadi.xyz/",
        "title": "ZeroSub - 零订阅生活",
        "category": "订阅管理"
    },
    {
        "url": "https://mockupnuke.wangdadi.xyz/",
        "title": "MockupNuke - 设计稿生成",
        "category": "设计工具"
    },
    {
        "url": "https://scriptkill.wangdadi.xyz/",
        "title": "ScriptKill - 脚本清理工具",
        "category": "系统工具"
    },
    {
        "url": "https://viralhook.wangdadi.xyz/",
        "title": "ViralHook - 病毒式营销工具",
        "category": "营销工具"
    },
    {
        "url": "https://onepagesaas.wangdadi.xyz/",
        "title": "OnePageSaaS - 单页SaaS生成器",
        "category": "开发工具"
    }
]

def generate_created_dates(count: int) -> list:
    """生成随机的创建时间（最近30天内）"""
    dates = []
    base_date = datetime.now()
    
    for i in range(count):
        # 随机生成最近30天内的日期
        days_ago = random.randint(0, 30)
        random_date = base_date - timedelta(days=days_ago)
        dates.append(random_date.strftime("%Y-%m-%dT%H:%M:%SZ"))
    
    # 按时间排序（最新的在前）
    dates.sort(reverse=True)
    return dates

def import_sites():
    """批量导入站点"""
    print("开始批量导入站点...")
    print(f"总共 {len(SITES_DATA)} 个站点")
    print("=" * 80)
    
    # 生成创建时间
    created_dates = generate_created_dates(len(SITES_DATA))
    
    # 构建站点列表
    sites = []
    for i, site_data in enumerate(SITES_DATA):
        site = {
            "subdomain": site_data["url"],
            "title": site_data["title"],
            "category": site_data["category"],
            "created_at": created_dates[i],
            "is_pushed": False
        }
        sites.append(site)
        print(f"{i+1}. {site['title']}")
        print(f"   URL: {site['subdomain']}")
        print(f"   分类: {site['category']}")
        print(f"   创建时间: {site['created_at']}")
        print()
    
    # 保存到 JSON 文件
    data = {"sites": sites}
    
    with open("sites_list.json", 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    
    print("=" * 80)
    print(f"[OK] 成功导入 {len(sites)} 个站点到 sites_list.json")
    
    # 统计分类
    categories = {}
    for site in sites:
        cat = site['category']
        categories[cat] = categories.get(cat, 0) + 1
    
    print("\n分类统计:")
    for cat, count in sorted(categories.items(), key=lambda x: x[1], reverse=True):
        print(f"  {cat}: {count} 个站点")

if __name__ == "__main__":
    import_sites()
