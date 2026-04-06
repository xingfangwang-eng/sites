#!/usr/bin/env python3
"""
静态 HTML 页面生成器
功能：读取 sites_list.json 并生成静态 HTML 入口页面
"""

import json
import os
from datetime import datetime, timedelta
from typing import List, Dict

class StaticHTMLGenerator:
    def __init__(self):
        self.sites_file = "sites_list.json"
        self.output_file = "index.html"
        
    def load_sites(self) -> List[Dict]:
        """加载站点数据"""
        try:
            with open(self.sites_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
                return data.get('sites', [])
        except FileNotFoundError:
            print(f"错误: 找不到 {self.sites_file}")
            return []
        except json.JSONDecodeError as e:
            print(f"错误: JSON 解析失败 - {e}")
            return []
    
    def get_recent_sites(self, sites: List[Dict], days: int = 3) -> List[Dict]:
        """获取最近几天的站点"""
        cutoff_date = datetime.now() - timedelta(days=days)
        recent = []
        
        for site in sites:
            try:
                created_date = datetime.fromisoformat(site['created_at'].replace('Z', '+00:00'))
                if created_date >= cutoff_date:
                    recent.append(site)
            except Exception:
                pass
        
        return sorted(recent, key=lambda x: x['created_at'], reverse=True)
    
    def generate_description(self, title: str, category: str) -> str:
        """Generate site description"""
        descriptions = [
            "Professional online tool platform providing efficient and convenient service experience",
            "Innovative solutions to help users improve work efficiency",
            "Clean and easy-to-use interface design, quick to start with no barriers",
            "Powerful feature support to meet diverse needs",
            "Safe and reliable service guarantee, a trustworthy choice",
            "Intelligent tools to simplify complex processes",
            "One-stop service platform with comprehensive solutions",
            "User-friendly interactive experience making work easier",
            "Efficient and practical online tools to boost productivity",
            "Built by professional teams with quality assurance"
        ]
        
        import random
        desc = random.choice(descriptions)
        return f"{title} - {desc}. Focused on {category} to provide quality services to users."
    
    def format_date(self, date_str: str) -> str:
        """格式化日期"""
        try:
            date = datetime.fromisoformat(date_str.replace('Z', '+00:00'))
            return date.strftime('%Y-%m-%d')
        except Exception:
            return date_str
    
    def generate_html(self) -> str:
        """生成 HTML 内容"""
        sites = self.load_sites()
        recent_sites = self.get_recent_sites(sites, 3)
        
        # 统计信息
        total_sites = len(sites)
        total_categories = len(set(site['category'] for site in sites))
        
        html = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="google-site-verification" content="YOUR_VERIFICATION_CODE">
    <title>Site Directory Center - Enterprise Service Platform</title>
    <meta name="description" content="Explore our product ecosystem and discover quality services. Professional enterprise service platform with diverse online tools.">
    <meta name="keywords" content="site directory,enterprise services,online tools,platform navigation">
    
    <style>
        * {{
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }}
        
        body {{
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background: linear-gradient(to bottom, #f8fafc, #ffffff);
            color: #1e293b;
            line-height: 1.6;
        }}
        
        .container {{
            max-width: 1280px;
            margin: 0 auto;
            padding: 0 1.5rem;
        }}
        
        /* Header */
        .header {{
            background: white;
            border-bottom: 1px solid #e2e8f0;
            padding: 2rem 0;
        }}
        
        .header h1 {{
            font-size: 2.25rem;
            font-weight: 700;
            color: #0f172a;
            margin-bottom: 0.5rem;
        }}
        
        .header p {{
            color: #64748b;
            font-size: 1.125rem;
        }}
        
        /* Main Content */
        .main {{
            padding: 3rem 0;
        }}
        
        /* Section */
        .section {{
            margin-bottom: 3rem;
        }}
        
        .section-header {{
            display: flex;
            align-items: center;
            gap: 0.75rem;
            margin-bottom: 1.5rem;
        }}
        
        .section-bar {{
            width: 4px;
            height: 2rem;
            background: linear-gradient(to bottom, #4f46e5, #7c3aed);
            border-radius: 2px;
        }}
        
        .section-title {{
            font-size: 1.5rem;
            font-weight: 700;
            color: #0f172a;
        }}
        
        .section-badge {{
            padding: 0.25rem 0.75rem;
            background: #eef2ff;
            color: #4f46e5;
            font-size: 0.875rem;
            font-weight: 500;
            border-radius: 9999px;
        }}
        
        /* Grid */
        .grid {{
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
            gap: 1.5rem;
        }}
        
        /* Card */
        .card {{
            background: white;
            border-radius: 0.75rem;
            padding: 1.5rem;
            text-decoration: none;
            color: inherit;
            transition: all 0.3s ease;
            border: 2px solid #f1f5f9;
        }}
        
        .card:hover {{
            border-color: #c7d2fe;
            box-shadow: 0 10px 25px -5px rgba(99, 102, 241, 0.1);
            transform: translateY(-2px);
        }}
        
        .card-recent {{
            border-color: #e0e7ff;
        }}
        
        .card-recent:hover {{
            border-color: #a5b4fc;
            box-shadow: 0 10px 25px -5px rgba(99, 102, 241, 0.15);
        }}
        
        .card-header {{
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 0.75rem;
        }}
        
        .card-category {{
            padding: 0.25rem 0.5rem;
            background: #f1f5f9;
            color: #475569;
            font-size: 0.75rem;
            font-weight: 500;
            border-radius: 0.25rem;
        }}
        
        .card-recent .card-category {{
            background: #eef2ff;
            color: #4f46e5;
        }}
        
        .card-date {{
            font-size: 0.75rem;
            color: #94a3b8;
        }}
        
        .card-title {{
            font-size: 1.125rem;
            font-weight: 600;
            color: #0f172a;
            margin-bottom: 0.5rem;
            transition: color 0.3s ease;
        }}
        
        .card:hover .card-title {{
            color: #4f46e5;
        }}
        
        .card-description {{
            font-size: 0.875rem;
            color: #64748b;
            line-height: 1.6;
            margin-bottom: 1rem;
        }}
        
        .card-link {{
            display: flex;
            align-items: center;
            font-size: 0.875rem;
            font-weight: 500;
            color: #64748b;
            transition: color 0.3s ease;
        }}
        
        .card:hover .card-link {{
            color: #4f46e5;
        }}
        
        .card-link svg {{
            width: 1rem;
            height: 1rem;
            margin-left: 0.25rem;
            transition: transform 0.3s ease;
        }}
        
        .card:hover .card-link svg {{
            transform: translateX(4px);
        }}
        
        /* Stats */
        .stats {{
            margin-top: 3rem;
            background: linear-gradient(to right, #4f46e5, #7c3aed);
            border-radius: 1rem;
            padding: 2rem;
            color: white;
        }}
        
        .stats-grid {{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 1.5rem;
        }}
        
        .stat-item {{
            text-align: center;
        }}
        
        .stat-value {{
            font-size: 2rem;
            font-weight: 700;
        }}
        
        .stat-label {{
            font-size: 0.875rem;
            color: #c7d2fe;
            margin-top: 0.25rem;
        }}
        
        /* Responsive */
        @media (max-width: 768px) {{
            .header h1 {{
                font-size: 1.875rem;
            }}
            
            .grid {{
                grid-template-columns: 1fr;
            }}
            
            .stats-grid {{
                grid-template-columns: repeat(2, 1fr);
            }}
        }}
    </style>
</head>
<body>
    <div class="header">
        <div class="container">
            <h1>Site Directory Center</h1>
            <p>Explore our product ecosystem and discover quality services</p>
        </div>
    </div>
    
    <div class="main">
        <div class="container">
"""
        
        # Recently Launched Section
        if recent_sites:
            html += f"""
            <div class="section">
                <div class="section-header">
                    <div class="section-bar"></div>
                    <h2 class="section-title">Recently Launched</h2>
                    <span class="section-badge">Newly Launched</span>
                </div>
                
                <div class="grid">
"""
            
            for site in recent_sites:
                description = self.generate_description(site['title'], site['category'])
                html += f"""
                    <a href="{site['subdomain']}" target="_blank" rel="noopener noreferrer" class="card card-recent">
                        <div class="card-header">
                            <span class="card-category">{site['category']}</span>
                            <span class="card-date">{self.format_date(site['created_at'])}</span>
                        </div>
                        <h3 class="card-title">{site['title']}</h3>
                        <p class="card-description">{description}</p>
                        <div class="card-link">
                            <span>Visit Site</span>
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                            </svg>
                        </div>
                    </a>
"""
            
            html += """
                </div>
            </div>
"""
        
        # All Sites Section
        html += f"""
            <div class="section">
                <div class="section-header">
                    <div class="section-bar" style="background: linear-gradient(to bottom, #475569, #94a3b8);"></div>
                    <h2 class="section-title">All Sites</h2>
                    <span class="section-badge" style="background: #f1f5f9; color: #475569;">Total {total_sites} sites</span>
                </div>
                
                <div class="grid">
"""
        
        for site in sorted(sites, key=lambda x: x['created_at'], reverse=True):
            description = self.generate_description(site['title'], site['category'])
            html += f"""
                    <a href="{site['subdomain']}" target="_blank" rel="noopener noreferrer" class="card">
                        <div class="card-header">
                            <span class="card-category">{site['category']}</span>
                            <span class="card-date">{self.format_date(site['created_at'])}</span>
                        </div>
                        <h3 class="card-title">{site['title']}</h3>
                        <p class="card-description">{description}</p>
                        <div class="card-link">
                            <span>Visit Site</span>
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                            </svg>
                        </div>
                    </a>
"""
        
        html += f"""
                </div>
            </div>
            
            <!-- Stats -->
            <div class="stats">
                <div class="stats-grid">
                    <div class="stat-item">
                        <div class="stat-value">{total_sites}</div>
                        <div class="stat-label">Total Sites</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">{len(recent_sites)}</div>
                        <div class="stat-label">Recently Launched</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">{total_categories}</div>
                        <div class="stat-label">Categories</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">24/7</div>
                        <div class="stat-label">Online Service</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <!-- Footer -->
    <footer style="background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 2rem 0; margin-top: 3rem;">
        <div class="container">
            <div style="text-align: center;">
                <p style="color: #64748b; font-size: 0.875rem; margin-bottom: 0.5rem;">
                    Support: <a href="mailto:457239850@qq.com" style="color: #4f46e5; text-decoration: none;">457239850@qq.com</a>
                </p>
                <p style="color: #94a3b8; font-size: 0.75rem;">
                    © 2026 Site Directory Center. All rights reserved.
                </p>
            </div>
        </div>
    </footer>
    
    <script>
        // Google Analytics
        window.dataLayer = window.dataLayer || [];
        function gtag(){{dataLayer.push(arguments);}}
        gtag('js', new Date());
        gtag('config', 'G-WC4677QJMF', {{'project_name': 'main-site'}});
    </script>
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-WC4677QJMF"></script>
</body>
</html>
"""
        
        return html
    
    def save_html(self):
        """保存 HTML 文件"""
        html = self.generate_html()
        
        with open(self.output_file, 'w', encoding='utf-8') as f:
            f.write(html)
        
        print(f"[OK] 静态 HTML 页面已生成: {self.output_file}")
        return True


def main():
    generator = StaticHTMLGenerator()
    generator.save_html()


if __name__ == "__main__":
    main()
