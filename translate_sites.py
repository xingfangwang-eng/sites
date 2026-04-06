#!/usr/bin/env python3
"""
将 sites_list.json 中的中文内容翻译为英文
"""

import json

# 翻译映射
TRANSLATIONS = {
    # 标题翻译
    "NoSEO.top - 搜索真实结果": "NoSEO.top - Search for Authentic Results",
    "NukePrivacy - 本地视频处理": "NukePrivacy - Local Video Processing",
    "Kill Bill Card - 虚拟信用卡": "Kill Bill Card - Virtual Credit Card",
    "ZeroCloud.so - 离线文档智能": "ZeroCloud.so - Offline Document Intelligence",
    "FocusInbox - 专注邮箱管理": "FocusInbox - Focused Email Management",
    "SaaSKiller.ai - 订阅管理": "SaaSKiller.ai - Subscription Manager",
    "NoAI.md - 无AI Markdown编辑器": "NoAI.md - No-AI Markdown Editor",
    "CrossPost Fast - 多平台发布工具": "CrossPost Fast - Multi-platform Posting Tool",
    "KillSwitch API - OpenAI 预算保护": "KillSwitch API - OpenAI Budget Protection",
    "PingThem.io - Gmail跟进工具": "PingThem.io - Gmail Follow-up Tool",
    "NeverUpload.io - 本地文件处理": "NeverUpload.io - Local File Processing",
    "CleanCSV.ai - CSV数据清洗": "CleanCSV.ai - CSV Data Cleaning",
    "SaaSStripper - SaaS订阅分析": "SaaSStripper - SaaS Subscription Analysis",
    "NoAdobe - Adobe替代方案": "NoAdobe - Adobe Alternatives",
    "NavSlayer - 导航栏优化": "NavSlayer - Navigation Bar Optimization",
    "KillSaaS - SaaS成本优化": "KillSaaS - SaaS Cost Optimization",
    "SlimSND - 音频压缩工具": "SlimSND - Audio Compression Tool",
    "BootHell - 启动项管理": "BootHell - Startup Item Manager",
    "LinguisticDNA Extractor - 语言DNA提取": "LinguisticDNA Extractor - Language DNA Extraction",
    "Humbled - 谦逊社交平台": "Humbled - Humble Social Platform",
    "StopSaaS - SaaS订阅终止": "StopSaaS - SaaS Subscription Terminator",
    "OneClickAPI - API测试工具": "OneClickAPI - API Testing Tool",
    "StopAICost - AI成本控制": "StopAICost - AI Cost Control",
    "SMESurvivalAI - 中小企业AI助手": "SMESurvivalAI - SME AI Assistant",
    "OneCommand - 命令行工具集": "OneCommand - Command Line Tools",
    "KillSubscription - 订阅杀手": "KillSubscription - Subscription Killer",
    "ManualsLib - 手册文档库": "ManualsLib - Manual Document Library",
    "BillRipper - 账单分析": "BillRipper - Bill Analysis",
    "Deadliner - 截止日期管理": "Deadliner - Deadline Management",
    "ZeroSub - 零订阅生活": "ZeroSub - Zero Subscription Life",
    "MockupNuke - 设计稿生成": "MockupNuke - Design Mockup Generator",
    "ScriptKill - 脚本清理工具": "ScriptKill - Script Cleaning Tool",
    "ViralHook - 病毒式营销工具": "ViralHook - Viral Marketing Tool",
    "OnePageSaaS - 单页SaaS生成器": "OnePageSaaS - Single Page SaaS Generator",
    
    # 分类翻译
    "搜索工具": "Search Tools",
    "隐私工具": "Privacy Tools",
    "支付工具": "Payment Tools",
    "文档工具": "Document Tools",
    "效率工具": "Productivity Tools",
    "订阅管理": "Subscription Management",
    "编辑器": "Editors",
    "社交媒体": "Social Media",
    "API工具": "API Tools",
    "邮件工具": "Email Tools",
    "数据处理": "Data Processing",
    "设计工具": "Design Tools",
    "网站优化": "Website Optimization",
    "音频工具": "Audio Tools",
    "系统工具": "System Tools",
    "语言工具": "Language Tools",
    "财务工具": "Finance Tools",
    "营销工具": "Marketing Tools",
    "AI工具": "AI Tools",
    "开发工具": "Development Tools"
}

def translate_sites():
    """翻译站点数据"""
    print("开始翻译站点数据...")
    
    # 读取数据
    with open('sites_list.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # 翻译
    translated_count = 0
    for site in data['sites']:
        # 翻译标题
        if site['title'] in TRANSLATIONS:
            site['title'] = TRANSLATIONS[site['title']]
            translated_count += 1
        
        # 翻译分类
        if site['category'] in TRANSLATIONS:
            site['category'] = TRANSLATIONS[site['category']]
    
    # 保存数据
    with open('sites_list.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    
    print(f"[OK] 翻译完成，共翻译 {translated_count} 个字段")
    
    # 统计
    categories = {}
    for site in data['sites']:
        cat = site['category']
        categories[cat] = categories.get(cat, 0) + 1
    
    print("\n分类统计:")
    for cat, count in sorted(categories.items(), key=lambda x: x[1], reverse=True):
        print(f"  {cat}: {count} sites")

if __name__ == "__main__":
    translate_sites()
