#!/usr/bin/env python3
"""
向 Google 报备新站点
功能：
1. 读取 sites_list.json
2. 获取今天新增的站点
3. 向 Google Search Console API 提交站点地图
4. 标记已推送的站点
"""

import json
import os
import requests
from datetime import datetime
from typing import List, Dict
import xml.etree.ElementTree as ET

class GoogleSubmitter:
    def __init__(self):
        self.sites_file = "sites_list.json"
        self.log_file = "google_submit.log"
        
        # Google Search Console API 配置
        # 注意：需要配置 API Key 或 OAuth2 凭证
        self.api_key = os.getenv('GOOGLE_SEARCH_CONSOLE_API_KEY', '')
        self.site_url = os.getenv('MAIN_SITE_URL', 'https://wangdadi.xyz')
        
    def log(self, message: str):
        """记录日志"""
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        log_message = f"[{timestamp}] {message}"
        print(log_message)
        
        with open(self.log_file, 'a', encoding='utf-8') as f:
            f.write(log_message + '\n')
    
    def load_sites(self) -> Dict:
        """加载站点数据"""
        try:
            with open(self.sites_file, 'r', encoding='utf-8') as f:
                return json.load(f)
        except FileNotFoundError:
            self.log(f"错误: 找不到 {self.sites_file}")
            return {"sites": []}
        except json.JSONDecodeError as e:
            self.log(f"错误: JSON 解析失败 - {e}")
            return {"sites": []}
    
    def save_sites(self, data: Dict):
        """保存站点数据"""
        with open(self.sites_file, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
    
    def get_today_sites(self, sites: List[Dict]) -> List[Dict]:
        """获取今天新增的站点"""
        today = datetime.now().date()
        today_sites = []
        
        for site in sites:
            try:
                created_date = datetime.fromisoformat(site['created_at'].replace('Z', '+00:00')).date()
                if created_date == today and not site.get('is_pushed', False):
                    today_sites.append(site)
            except Exception as e:
                self.log(f"警告: 解析日期失败 - {site.get('subdomain', 'unknown')} - {e}")
        
        return today_sites
    
    def generate_sitemap(self, sites: List[Dict]) -> str:
        """生成站点地图 XML"""
        # 创建 XML 根元素
        urlset = ET.Element('urlset')
        urlset.set('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9')
        
        # 添加主站点
        url = ET.SubElement(urlset, 'url')
        loc = ET.SubElement(url, 'loc')
        loc.text = self.site_url
        lastmod = ET.SubElement(url, 'lastmod')
        lastmod.text = datetime.now().strftime('%Y-%m-%d')
        changefreq = ET.SubElement(url, 'changefreq')
        changefreq.text = 'daily'
        priority = ET.SubElement(url, 'priority')
        priority.text = '1.0'
        
        # 添加所有子站点
        for site in sites:
            url = ET.SubElement(urlset, 'url')
            loc = ET.SubElement(url, 'loc')
            loc.text = site['subdomain']
            lastmod = ET.SubElement(url, 'lastmod')
            lastmod.text = datetime.fromisoformat(site['created_at'].replace('Z', '+00:00')).strftime('%Y-%m-%d')
            changefreq = ET.SubElement(url, 'changefreq')
            changefreq.text = 'weekly'
            priority = ET.SubElement(url, 'priority')
            priority.text = '0.8'
        
        # 生成 XML 字符串
        xml_str = ET.tostring(urlset, encoding='unicode')
        return '<?xml version="1.0" encoding="UTF-8"?>\n' + xml_str
    
    def save_sitemap(self, sitemap_xml: str):
        """保存站点地图文件"""
        sitemap_file = 'sitemap.xml'
        with open(sitemap_file, 'w', encoding='utf-8') as f:
            f.write(sitemap_xml)
        self.log(f"[OK] 站点地图已生成: {sitemap_file}")
    
    def submit_to_google(self, sites: List[Dict]) -> bool:
        """向 Google 提交站点地图"""
        if not sites:
            self.log("没有需要提交的站点")
            return True
        
        try:
            # 生成站点地图
            sitemap_xml = self.generate_sitemap(sites)
            self.save_sitemap(sitemap_xml)
            
            # 方法 1: 使用 Google Search Console API（需要 API Key）
            if self.api_key:
                self.log("使用 Google Search Console API 提交...")
                
                # 提交站点地图
                sitemap_url = f"{self.site_url}/sitemap.xml"
                api_url = f"https://www.googleapis.com/webmasters/v3/sites/{self.site_url}/sitemap/{sitemap_url}"
                
                headers = {
                    'Authorization': f'Bearer {self.api_key}',
                    'Content-Type': 'application/json'
                }
                
                response = requests.put(api_url, headers=headers)
                
                if response.status_code == 200:
                    self.log("[OK] 通过 API 提交成功")
                    return True
                else:
                    self.log(f"[ERROR] API 提交失败: {response.status_code} - {response.text}")
            
            # 方法 2: 使用 Ping 服务（无需 API Key）
            self.log("使用 Google Ping 服务提交...")
            
            sitemap_url = f"{self.site_url}/sitemap.xml"
            ping_url = f"http://www.google.com/ping?sitemap={sitemap_url}"
            
            response = requests.get(ping_url)
            
            if response.status_code == 200:
                self.log("[OK] 通过 Ping 服务提交成功")
                return True
            else:
                self.log(f"[ERROR] Ping 服务提交失败: {response.status_code}")
                return False
                
        except Exception as e:
            self.log(f"错误: 提交到 Google 失败 - {e}")
            return False
    
    def mark_sites_as_pushed(self, data: Dict, sites: List[Dict]):
        """标记站点为已推送"""
        pushed_urls = {site['subdomain'] for site in sites}
        
        for site in data['sites']:
            if site['subdomain'] in pushed_urls:
                site['is_pushed'] = True
        
        self.save_sites(data)
        self.log(f"[OK] 已标记 {len(sites)} 个站点为已推送")
    
    def run(self):
        """执行 Google 提交流程"""
        self.log("=" * 80)
        self.log("开始向 Google 报备新站点")
        self.log("=" * 80)
        
        # 1. 加载站点数据
        data = self.load_sites()
        sites = data.get('sites', [])
        self.log(f"总站点数: {len(sites)}")
        
        # 2. 获取今天新增的站点
        today_sites = self.get_today_sites(sites)
        self.log(f"今天新增站点: {len(today_sites)}")
        
        if today_sites:
            for site in today_sites:
                self.log(f"  - {site['title']}: {site['subdomain']}")
            
            # 3. 向 Google 提交
            success = self.submit_to_google(today_sites)
            
            # 4. 标记为已推送
            if success:
                self.mark_sites_as_pushed(data, today_sites)
        else:
            self.log("今天没有新增站点，跳过提交")
        
        self.log("=" * 80)
        self.log("Google 报备流程完成")
        self.log("=" * 80)


def main():
    submitter = GoogleSubmitter()
    submitter.run()


if __name__ == "__main__":
    main()
