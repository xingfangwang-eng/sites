import json
import os
from datetime import datetime
from typing import List, Dict, Optional

class SiteManager:
    def __init__(self, json_file: str = "sites_list.json"):
        self.json_file = json_file
        self.data = self._load_data()
    
    def _load_data(self) -> Dict:
        """加载 JSON 数据"""
        if not os.path.exists(self.json_file):
            return {"sites": []}
        
        with open(self.json_file, 'r', encoding='utf-8') as f:
            return json.load(f)
    
    def _save_data(self):
        """保存数据到 JSON 文件"""
        with open(self.json_file, 'w', encoding='utf-8') as f:
            json.dump(self.data, f, indent=2, ensure_ascii=False)
    
    def add_site(self, url: str, title: str, category: str) -> Dict:
        """
        添加新站点到数据库
        
        Args:
            url: 站点 URL
            title: 站点标题
            category: 站点分类
        
        Returns:
            新添加的站点信息
        """
        # 检查是否已存在
        for site in self.data['sites']:
            if site['subdomain'] == url:
                print(f"站点 {url} 已存在，跳过添加")
                return site
        
        # 创建新站点
        new_site = {
            "subdomain": url,
            "title": title,
            "category": category,
            "created_at": datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ"),
            "is_pushed": False
        }
        
        # 添加到列表
        self.data['sites'].append(new_site)
        self._save_data()
        
        print(f"✓ 成功添加站点: {title}")
        print(f"  URL: {url}")
        print(f"  分类: {category}")
        print(f"  创建时间: {new_site['created_at']}")
        
        return new_site
    
    def get_latest_sites(self, limit: int = 50) -> List[Dict]:
        """
        获取最新加入的站点列表
        
        Args:
            limit: 返回的站点数量限制，默认 50
        
        Returns:
            最新的站点列表
        """
        # 按创建时间排序（最新的在前）
        sorted_sites = sorted(
            self.data['sites'],
            key=lambda x: x['created_at'],
            reverse=True
        )
        
        # 返回指定数量的站点
        latest_sites = sorted_sites[:limit]
        
        print(f"\n最新的 {len(latest_sites)} 个站点:")
        print("=" * 80)
        for i, site in enumerate(latest_sites, 1):
            print(f"{i}. {site['title']}")
            print(f"   URL: {site['subdomain']}")
            print(f"   分类: {site['category']}")
            print(f"   创建时间: {site['created_at']}")
            print(f"   已推送: {'是' if site['is_pushed'] else '否'}")
            print()
        
        return latest_sites
    
    def get_all_sites(self) -> List[Dict]:
        """获取所有站点"""
        return self.data['sites']
    
    def get_sites_by_category(self, category: str) -> List[Dict]:
        """
        按分类获取站点
        
        Args:
            category: 分类名称
        
        Returns:
            该分类下的所有站点
        """
        sites = [site for site in self.data['sites'] if site['category'] == category]
        print(f"\n分类 '{category}' 下的 {len(sites)} 个站点:")
        print("=" * 80)
        for i, site in enumerate(sites, 1):
            print(f"{i}. {site['title']} - {site['subdomain']}")
        
        return sites
    
    def mark_as_pushed(self, url: str) -> bool:
        """
        标记站点为已推送
        
        Args:
            url: 站点 URL
        
        Returns:
            是否成功标记
        """
        for site in self.data['sites']:
            if site['subdomain'] == url:
                site['is_pushed'] = True
                self._save_data()
                print(f"✓ 已标记 {url} 为已推送")
                return True
        
        print(f"✗ 未找到站点 {url}")
        return False
    
    def get_unpushed_sites(self) -> List[Dict]:
        """获取未推送的站点"""
        unpushed = [site for site in self.data['sites'] if not site['is_pushed']]
        print(f"\n未推送的站点: {len(unpushed)} 个")
        print("=" * 80)
        for i, site in enumerate(unpushed, 1):
            print(f"{i}. {site['title']} - {site['subdomain']}")
        
        return unpushed
    
    def get_stats(self) -> Dict:
        """获取统计信息"""
        total = len(self.data['sites'])
        pushed = sum(1 for site in self.data['sites'] if site['is_pushed'])
        unpushed = total - pushed
        
        # 统计分类
        categories = {}
        for site in self.data['sites']:
            cat = site['category']
            categories[cat] = categories.get(cat, 0) + 1
        
        stats = {
            "total": total,
            "pushed": pushed,
            "unpushed": unpushed,
            "categories": categories
        }
        
        print("\n站点统计信息:")
        print("=" * 80)
        print(f"总站点数: {total}")
        print(f"已推送: {pushed}")
        print(f"未推送: {unpushed}")
        print(f"\n分类统计:")
        for cat, count in categories.items():
            print(f"  {cat}: {count} 个站点")
        
        return stats


def main():
    """主函数 - 演示用法"""
    manager = SiteManager()
    
    # 显示统计信息
    manager.get_stats()
    
    # 获取最新站点
    print("\n" + "=" * 80)
    manager.get_latest_sites(5)
    
    # 添加新站点示例
    print("\n" + "=" * 80)
    print("添加新站点示例:")
    manager.add_site(
        url="https://example.wangdadi.xyz",
        title="Example Site",
        category="示例分类"
    )
    
    # 获取未推送站点
    print("\n" + "=" * 80)
    manager.get_unpushed_sites()


if __name__ == "__main__":
    main()
