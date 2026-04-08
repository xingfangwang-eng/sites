import json
import random

# 定义可能的取值
personas = [
    "Stressed Analyst", "Bored Junior Dev", "Stealthy Manager", "Overworked Sales Rep", 
    "Remote Worker", "IT Professional", "Legal Associate", "Finance Executive",
    "Marketing Specialist", "Customer Support Rep", "QA Engineer", "Data Scientist",
    "Graphic Designer", "Healthcare Admin", "Government Employee", "University Student"
]

industry_contexts = [
    "FinTech", "Legal Tech", "Public Sector", "Healthcare", "Education",
    "Marketing", "IT Services", "Manufacturing", "Retail", "Financial Services",
    "Consulting", "Media", "Telecommunications", "Energy", "Transportation"
]

technical_hurdles = [
    "ZScaler blocks", "Local Admin rights", "Screen mirroring logs", "Firewall restrictions",
    "Network monitoring", "Endpoint security", "Browser history tracking", "USB restrictions",
    "Proxy servers", "Content filtering", "Application whitelisting", "Data loss prevention",
    "Virtual desktop restrictions", "Thin client limitations", "VPN restrictions"
]

related_tools = {
    "Stressed Analyst": ["Excel", "Power BI", "Tableau"],
    "Bored Junior Dev": ["VS Code", "GitHub", "Slack"],
    "Stealthy Manager": ["Microsoft Teams", "Outlook", "Excel"],
    "Overworked Sales Rep": ["Salesforce", "HubSpot", "LinkedIn"],
    "Remote Worker": ["Zoom", "Slack", "Google Workspace"],
    "IT Professional": ["Active Directory", "PowerShell", "VMware"],
    "Legal Associate": ["Westlaw", "LexisNexis", "Microsoft Word"],
    "Finance Executive": ["Bloomberg Terminal", "SAP", "Excel"],
    "Marketing Specialist": ["Google Analytics", "HubSpot", "Canva"],
    "Customer Support Rep": ["Zendesk", "Freshdesk", "Slack"],
    "QA Engineer": ["Jira", "Selenium", "Postman"],
    "Data Scientist": ["Python", "Jupyter Notebook", "Tableau"],
    "Graphic Designer": ["Photoshop", "Illustrator", "Figma"],
    "Healthcare Admin": ["Epic", "Cerner", "Microsoft Office"],
    "Government Employee": ["SharePoint", "Microsoft 365", "Adobe Acrobat"],
    "University Student": ["Google Docs", "Canvas", "Zoom"]
}

tones = ["Professional", "Rebellious", "Supportive"]

# 读取 keywords.json 文件
with open('data/keywords.json', 'r', encoding='utf-8') as f:
    keywords = json.load(f)

# 为每个关键词对象添加新字段
for keyword in keywords:
    # 随机选择 persona
    persona = random.choice(personas)
    keyword['persona'] = persona
    
    # 随机选择 industry_context
    keyword['industry_context'] = random.choice(industry_contexts)
    
    # 随机选择 technical_hurdle
    keyword['technical_hurdle'] = random.choice(technical_hurdles)
    
    # 根据 persona 选择 related_tools
    keyword['related_tools'] = related_tools.get(persona, ["Microsoft Office", "Email", "Calendar"])
    
    # 随机选择 tone
    keyword['tone'] = random.choice(tones)

# 写入增强后的 keywords.json 文件
with open('data/keywords.json', 'w', encoding='utf-8') as f:
    json.dump(keywords, f, indent=2, ensure_ascii=False)

print(f"Enhanced {len(keywords)} keywords with new fields")
