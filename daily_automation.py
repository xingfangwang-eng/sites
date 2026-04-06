#!/usr/bin/env python3
"""
每日自动化任务脚本
功能：
1. 扫描 sites_list.json
2. 更新一级域名的静态 HTML 入口页面
3. 执行 push_to_google.py 向 Google 报备今天新开的所有子站
"""

import json
import os
import subprocess
import sys
from datetime import datetime, timedelta
from typing import List, Dict

class DailyAutomation:
    def __init__(self):
        self.sites_file = "sites_list.json"
        self.log_file = "automation.log"
        
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
    
    def get_today_sites(self, sites: List[Dict]) -> List[Dict]:
        """获取今天新增的站点"""
        today = datetime.now().date()
        today_sites = []
        
        for site in sites:
            try:
                created_date = datetime.fromisoformat(site['created_at'].replace('Z', '+00:00')).date()
                if created_date == today:
                    today_sites.append(site)
            except Exception as e:
                self.log(f"警告: 解析日期失败 - {site.get('subdomain', 'unknown')} - {e}")
        
        return today_sites
    
    def generate_static_html(self, sites: List[Dict]):
        """生成静态 HTML 页面"""
        self.log("开始生成静态 HTML 页面...")
        
        try:
            # 调用静态 HTML 生成器脚本
            result = subprocess.run(
                [sys.executable, "generate_static_html.py"],
                capture_output=True,
                text=True,
                encoding='utf-8',
                errors='ignore'
            )
            
            if result.returncode == 0:
                self.log("✓ 静态 HTML 页面生成成功")
                if result.stdout:
                    self.log(result.stdout)
            else:
                self.log(f"✗ 静态 HTML 页面生成失败: {result.stderr}")
                
        except FileNotFoundError:
            self.log("警告: generate_static_html.py 脚本不存在，跳过生成")
        except Exception as e:
            self.log(f"错误: 执行静态 HTML 生成器失败 - {e}")
    
    def push_to_google(self, today_sites: List[Dict]):
        """向 Google 报备新站点"""
        if not today_sites:
            self.log("今天没有新增站点，跳过 Google 报备")
            return
        
        self.log(f"开始向 Google 报备 {len(today_sites)} 个新站点...")
        
        try:
            # 调用 push_to_google.py 脚本
            result = subprocess.run(
                [sys.executable, "push_to_google.py"],
                capture_output=True,
                text=True,
                encoding='utf-8',
                errors='ignore'
            )
            
            if result.returncode == 0:
                self.log("✓ Google 报备成功")
                if result.stdout:
                    self.log(result.stdout)
            else:
                self.log(f"✗ Google 报备失败: {result.stderr}")
                
        except FileNotFoundError:
            self.log("警告: push_to_google.py 脚本不存在，跳过报备")
        except Exception as e:
            self.log(f"错误: 执行 Google 报备失败 - {e}")
    
    def run(self):
        """执行每日自动化任务"""
        self.log("=" * 80)
        self.log("开始执行每日自动化任务")
        self.log("=" * 80)
        
        # 1. 扫描 sites_list.json
        self.log("步骤 1: 扫描 sites_list.json")
        data = self.load_sites()
        sites = data.get('sites', [])
        self.log(f"找到 {len(sites)} 个站点")
        
        # 2. 获取今天新增的站点
        self.log("\n步骤 2: 获取今天新增的站点")
        today_sites = self.get_today_sites(sites)
        self.log(f"今天新增 {len(today_sites)} 个站点")
        
        for site in today_sites:
            self.log(f"  - {site['title']}: {site['subdomain']}")
        
        # 3. 生成静态 HTML 页面
        self.log("\n步骤 3: 更新静态 HTML 入口页面")
        self.generate_static_html(sites)
        
        # 4. 向 Google 报备新站点
        self.log("\n步骤 4: 向 Google 报备新站点")
        self.push_to_google(today_sites)
        
        self.log("\n" + "=" * 80)
        self.log("每日自动化任务执行完成")
        self.log("=" * 80)


def main():
    automation = DailyAutomation()
    automation.run()


if __name__ == "__main__":
    main()
