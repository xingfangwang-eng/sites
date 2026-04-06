import os
import json
import re

class TweetGenerator:
    def __init__(self, validation_results_path='output/validation_results.json'):
        self.validation_results_path = validation_results_path
        self.results = None
    
    def load_validation_results(self):
        """加载验证结果"""
        if os.path.exists(self.validation_results_path):
            with open(self.validation_results_path, 'r', encoding='utf-8') as f:
                self.results = json.load(f)
        else:
            raise FileNotFoundError(f"Validation results file not found: {self.validation_results_path}")
    
    def generate_all_tweets(self):
        """为所有胶囊生成推文文案"""
        if not self.results:
            self.load_validation_results()
        
        tweets = {}
        
        for capsule_name, result in self.results.items():
            print(f"Generating tweet for {capsule_name}...")
            tweet = self.generate_tweet(result)
            tweets[capsule_name] = tweet
        
        # 保存推文文案
        tweets_path = os.path.join('output', 'tweets.json')
        with open(tweets_path, 'w', encoding='utf-8') as f:
            json.dump(tweets, f, ensure_ascii=False, indent=2)
        
        print(f"\nTweets saved to {tweets_path}")
        return tweets
    
    def generate_tweet(self, result):
        """为单个验证结果生成推文文案"""
        a_side = result.get('a_side', '')
        b_side = result.get('b_side', '')
        differences = result.get('differences', {})
        
        # 提取震撼点
        shock_points = self.extract_shock_points(a_side, b_side, differences)
        
        # 生成推文文案
        tweet = self.create_tweet(shock_points, result.get('prompt', ''))
        
        return {
            "shock_points": shock_points,
            "tweet": tweet
        }
    
    def extract_shock_points(self, a_side, b_side, differences):
        """提取3个震撼点"""
        shock_points = []
        
        # 震撼点1：风格差异
        b_unique_words = differences.get('b_unique_words', [])
        if b_unique_words:
            style_words = ', '.join(b_unique_words[:3])
            shock_points.append(f"风格胶囊让AI开口就是大V味儿！使用了{style_words}等独特词汇，瞬间提升内容质感")
        
        # 震撼点2：句式差异
        a_sentences = differences.get('a_sentences', 0)
        b_sentences = differences.get('b_sentences', 0)
        if abs(a_sentences - b_sentences) >= 2:
            if b_sentences > a_sentences:
                shock_points.append(f"胶囊版AI更懂表达节奏！比原生GPT多了{b_sentences - a_sentences}个句子，结构更清晰")
            else:
                shock_points.append(f"胶囊版AI更简洁有力！比原生GPT少了{a_sentences - b_sentences}个句子，直击核心")
        
        # 震撼点3：内容深度
        a_length = differences.get('a_length', 0)
        b_length = differences.get('b_length', 0)
        if abs(a_length - b_length) >= 100:
            if b_length > a_length:
                shock_points.append(f"胶囊版AI内容更丰富！比原生GPT多了{b_length - a_length}字，细节更到位")
            else:
                shock_points.append(f"胶囊版AI更精准！比原生GPT少了{a_length - b_length}字，重点更突出")
        
        # 如果不足3个震撼点，补充其他差异
        if len(shock_points) < 3:
            # 检查是否有独特的表达方式
            if "震撼" not in str(shock_points):
                shock_points.append("胶囊版AI表达更有个性，不再是千篇一律的机器人语气")
        
        # 确保只有3个震撼点
        return shock_points[:3]
    
    def create_tweet(self, shock_points, prompt):
        """创建推文文案"""
        # 确保shock_points至少有3个元素
        while len(shock_points) < 3:
            shock_points.append("胶囊版AI表达更有个性，不再是千篇一律的机器人语气")
        
        tweet = f"""🤯 【风格克隆引擎测试结果】

命题：{prompt}

A面：原生GPT-4输出
B面：加载风格胶囊后的输出

🔥 震撼点1：{shock_points[0]}
🔥 震撼点2：{shock_points[1]}
🔥 震撼点3：{shock_points[2]}

💡 结论：风格胶囊让AI瞬间拥有大V气质，内容质量飙升！

#AI #内容创作 #风格克隆 #大V模仿"""
        
        # 确保推文长度不超过Twitter限制（280字符）
        if len(tweet) > 280:
            # 缩短命题
            prompt = prompt[:20] + "..." if len(prompt) > 20 else prompt
            # 缩短震撼点
            shock_points = [p[:60] + "..." if len(p) > 60 else p for p in shock_points]
            # 确保shock_points至少有3个元素
            while len(shock_points) < 3:
                shock_points.append("胶囊版AI表达更有个性！")
            # 重新生成推文
            tweet = f"""🤯 【风格克隆引擎测试结果】

命题：{prompt}

A面：原生GPT-4输出
B面：加载风格胶囊后的输出

🔥 震撼点1：{shock_points[0]}
🔥 震撼点2：{shock_points[1]}
🔥 震撼点3：{shock_points[2]}

💡 结论：风格胶囊让AI瞬间拥有大V气质！

#AI #内容创作"""
        
        return tweet

if __name__ == '__main__':
    generator = TweetGenerator()
    generator.generate_all_tweets()
