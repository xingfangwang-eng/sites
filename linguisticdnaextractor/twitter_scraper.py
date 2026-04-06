#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
脚本功能：抓取@elonmusk的最新200条推文数据，并进行清洗和存储

使用说明：
1. 安装所需依赖：pip install tweepy
2. 配置Twitter API认证信息（见下方配置部分）
3. 运行脚本：python twitter_scraper.py

如果环境受限无法直接访问Twitter API，可以：
1. 使用代理服务器
2. 或使用第三方Twitter数据服务
3. 或手动收集数据并保存到/data/elon_musk_raw.txt
"""

import os
import re
import tweepy
from datetime import datetime

# Twitter API配置
API_KEY = "nlwa7k1fL9egXQVAtSRNv8Uk3"
API_SECRET_KEY = "BR0yUS5U6RqwZqt16E93aD0kfAMbhbAPCNVep101qeb5UmeJGX"
ACCESS_TOKEN = "1503384004954927115-eqGkX0u3rDA2uwlo3SyYmdo5JNrJWz"
ACCESS_TOKEN_SECRET = "vXTDs4xsLrsojSLxMu5zWKYIZgsJbB45a3T5z1dGqYL27"

# 代理配置（如果需要）
USE_PROXY = False
PROXY_URL = "http://your-proxy-server:port"

# 缩写词映射
ABBREVIATIONS = {
    "lol": "laugh out loud",
    "btw": "by the way",
    "imo": "in my opinion",
    "imho": "in my humble opinion",
    "fyi": "for your information",
    "omg": "oh my god",
    "wtf": "what the fuck",
    "idk": "I don't know",
    "tbh": "to be honest",
    "brb": "be right back",
    "afaik": "as far as I know",
    "b/c": "because",
    "w/": "with",
    "w/o": "without",
    "u": "you",
    "ur": "your",
    "u r": "you are",
    "r": "are",
    "2": "to",
    "4": "for",
    "b4": "before",
    "cuz": "because",
    "n": "and",
    "&": "and",
    "thx": "thanks",
    "ty": "thank you",
    "pls": "please",
    "plz": "please",
    "y": "why",
    "yep": "yes",
    "nope": "no",
    "ok": "okay",
    "okey": "okay",
    "k": "okay",
    "sure": "certainly",
    "def": "definitely",
    "prob": "probably",
    "prolly": "probably",
    "maybe": "perhaps",
    "idc": "I don't care",
    "idgaf": "I don't give a fuck",
    "tbt": "throwback Thursday",
    "fomo": "fear of missing out",
    "fwiw": "for what it's worth",
    "icymi": "in case you missed it",
    "nvm": "never mind",
    "omw": "on my way",
    "rofl": "rolling on the floor laughing",
    "smh": "shaking my head",
    "tldr": "too long didn't read",
    "yolo": "you only live once",
    "zzz": "sleeping or bored",
}

# 马斯克标志性语气词
MUSK_PHRASES = [
    "Exactly", "Interesting", "First principles", "!!", "Wow", "Amazing",
    "Unbelievable", "Incredible", "Genius", "Brilliant", "Stunning",
    "Revolutionary", "Game changer", "Future", "Mars", "SpaceX", "Tesla",
    "Neuralink", "The Boring Company", "Cybertruck", "Starship", "Falcon",
    "Self-driving", "AI", "Artificial intelligence", "Machine learning",
    "Neural networks", "Robots", "Automation", "Sustainable energy",
    "Electric vehicles", "Solar", "Batteries", "Hyperloop", "Tunnel",
    "Rocket", "Launch", "Landing", "Reusable", "Innovation", "Technology",
    "Science", "Engineering", "Physics", "Math", "Code", "Programming",
    "Software", "Hardware", "Computers", "Internet", "Web", "Mobile",
    "Smartphone", "App", "Algorithm", "Data", "Analytics", "Cloud",
    "Server", "Database", "Network", "Security", "Privacy", "Encryption",
    "Blockchain", "Cryptocurrency", "Bitcoin", "Dogecoin", "Ethereum",
    "NFT", "Metaverse", "Virtual reality", "Augmented reality", "Mixed reality",
    "Gaming", "Entertainment", "Media", "Content", "Streaming", "Music",
    "Movies", "TV", "Sports", "News", "Politics", "Business", "Economy",
    "Finance", "Investment", "Stock market", "Real estate", "Healthcare",
    "Medicine", "Biotechnology", "Longevity", "Cryonics", "Transhumanism",
    "Future of work", "Remote work", "Automation", "Universal basic income",
    "Education", "Learning", "University", "School", "Teacher", "Student",
    "Knowledge", "Wisdom", "Philosophy", "Ethics", "Morality", "Religion",
    "Spirituality", "Consciousness", "Mind", "Brain", "Neuroscience",
    "Psychology", "Sociology", "Anthropology", "History", "Future",
    "Science fiction", "Fantasy", "Imagination", "Creativity", "Innovation",
    "Entrepreneurship", "Startups", "Venture capital", "Angel investors",
    "Incubator", "Accelerator", "Mentorship", "Networking", "Collaboration",
    "Teamwork", "Leadership", "Management", "Organization", "Structure",
    "Process", "System", "Efficiency", "Productivity", "Quality", "Excellence",
    "Perfection", "Innovation", "Creativity", "Originality", "Authenticity",
    "Integrity", "Honesty", "Transparency", "Accountability", "Responsibility",
    "Sustainability", "Environmentalism", "Climate change", "Global warming",
    "Carbon footprint", "Renewable energy", "Solar power", "Wind power",
    "Hydroelectric power", "Geothermal power", "Nuclear power", "Fossil fuels",
    "Oil", "Gas", "Coal", "Energy storage", "Batteries", "Electric vehicles",
    "Hybrid vehicles", "Public transportation", "Trains", "Planes", "Ships",
    "Infrastructure", "Roads", "Bridges", "Tunnels", "Airports", "Ports",
    "Cities", "Urban planning", "Architecture", "Design", "Aesthetics",
    "Functionality", "Usability", "User experience", "Interface", "Interaction",
    "Accessibility", "Inclusivity", "Diversity", "Equality", "Justice", "Fairness",
    "Human rights", "Civil rights", "Women's rights", "LGBTQ+ rights", "Disability rights",
    "Racial justice", "Social justice", "Economic justice", "Environmental justice",
    "Global justice", "Peace", "War", "Conflict", "Resolution", "Diplomacy",
    "Negotiation", "Mediation", "Arbitration", "Collaboration", "Cooperation",
    "Competition", "Win-win", "Zero-sum", "Game theory", "Strategy", "Tactics",
    "Planning", "Execution", "Implementation", "Monitoring", "Evaluation",
    "Feedback", "Improvement", "Innovation", "Adaptation", "Evolution", "Revolution",
    "Transformation", "Change", "Progress", "Development", "Growth", "Expansion",
    "Contraction", "Decline", "Rise", "Fall", "Success", "Failure", "Win", "Lose",
    "Victory", "Defeat", "Triumph", "Disaster", "Opportunity", "Threat", "Risk", "Reward",
    "Challenge", "Problem", "Solution", "Question", "Answer", "Mystery", "Discovery",
    "Exploration", "Adventure", "Journey", "Destination", "Path", "Road", "Route",
    "Direction", "Guidance", "Navigation", "Mapping", "Charting", "Planning", "Execution",
    "Achievement", "Accomplishment", "Goal", "Objective", "Target", "Ambition", "Dream",
    "Vision", "Mission", "Purpose", "Meaning", "Significance", "Importance", "Value",
    "Worth", "Price", "Cost", "Benefit", "Profit", "Loss", "Gain", "Expense", "Income",
    "Revenue", "Profitability", "Sustainability", "Viability", "Feasibility", "Possibility",
    "Probability", "Certainty", "Uncertainty", "Risk", "Safety", "Security", "Protection",
    "Defense", "Offense", "Attack", "Defense", "Strategy", "Tactics", "Planning", "Execution",
    "Success", "Failure", "Win", "Lose", "Victory", "Defeat", "Triumph", "Disaster",
    "Opportunity", "Threat", "Risk", "Reward", "Challenge", "Problem", "Solution",
    "Question", "Answer", "Mystery", "Discovery", "Exploration", "Adventure", "Journey",
    "Destination", "Path", "Road", "Route", "Direction", "Guidance", "Navigation", "Mapping",
    "Charting", "Planning", "Execution", "Achievement", "Accomplishment", "Goal", "Objective",
    "Target", "Ambition", "Dream", "Vision", "Mission", "Purpose", "Meaning", "Significance",
    "Importance", "Value", "Worth", "Price", "Cost", "Benefit", "Profit", "Loss", "Gain",
    "Expense", "Income", "Revenue", "Profitability", "Sustainability", "Viability", "Feasibility",
    "Possibility", "Probability", "Certainty", "Uncertainty", "Risk", "Safety", "Security",
    "Protection", "Defense", "Offense", "Attack", "Defense", "Strategy", "Tactics", "Planning",
    "Execution", "Success", "Failure", "Win", "Lose", "Victory", "Defeat", "Triumph", "Disaster"
]

def setup_twitter_api():
    """设置并返回Twitter API客户端"""
    # 配置代理（如果需要）
    if USE_PROXY:
        os.environ["HTTP_PROXY"] = PROXY_URL
        os.environ["HTTPS_PROXY"] = PROXY_URL
    
    # 认证
    auth = tweepy.OAuth1UserHandler(
        API_KEY, API_SECRET_KEY, ACCESS_TOKEN, ACCESS_TOKEN_SECRET
    )
    
    # 创建API客户端
    api = tweepy.API(auth, wait_on_rate_limit=True)
    
    return api

def clean_tweet(tweet_text):
    """清洗推文文本"""
    # 移除URL
    tweet_text = re.sub(r'http\S+', '', tweet_text)
    
    # 移除@提及
    tweet_text = re.sub(r'@\w+', '', tweet_text)
    
    # 移除#标签
    tweet_text = re.sub(r'#\w+', '', tweet_text)
    
    # 移除多余的空格
    tweet_text = re.sub(r'\s+', ' ', tweet_text).strip()
    
    # 补全缩写词
    words = tweet_text.split()
    for i, word in enumerate(words):
        lower_word = word.lower()
        if lower_word in ABBREVIATIONS:
            words[i] = ABBREVIATIONS[lower_word]
    tweet_text = ' '.join(words)
    
    return tweet_text

def is_valid_tweet(tweet_text):
    """检查推文是否有效"""
    # 检查是否为空
    if not tweet_text or len(tweet_text.strip()) == 0:
        return False
    
    # 检查是否只有表情包
    emoji_pattern = re.compile(
        '['
        '\U0001F600-\U0001F64F'  # 表情符号
        '\U0001F300-\U0001F5FF'  # 符号和象形文字
        '\U0001F680-\U0001F6FF'  # 交通和地图符号
        '\U0001F1E0-\U0001F1FF'  # 旗帜（iOS）
        '\U00002702-\U000027B0'  # 杂项符号
        '\U000024C2-\U0001F251'  # 封闭的字母数字
        ']+',
        flags=re.UNICODE
    )
    only_emoji = emoji_pattern.sub('', tweet_text).strip()
    if not only_emoji:
        return False
    
    # 检查是否只有单一链接
    url_pattern = re.compile(r'http\S+')
    urls = url_pattern.findall(tweet_text)
    if len(urls) > 0 and len(url_pattern.sub('', tweet_text).strip()) == 0:
        return False
    
    return True

def get_elon_musk_tweets(api, count=200):
    """获取马斯克的最新推文"""
    tweets = []
    
    try:
        # 获取用户信息
        user = api.get_user(screen_name="elonmusk")
        
        # 获取推文
        for tweet in tweepy.Cursor(api.user_timeline, user_id=user.id, tweet_mode="extended").items(count):
            # 提取推文信息
            tweet_data = {
                "text": tweet.full_text if hasattr(tweet, 'full_text') else tweet.text,
                "created_at": tweet.created_at.strftime("%Y-%m-%d %H:%M:%S"),
                "likes": tweet.favorite_count,
                "retweets": tweet.retweet_count
            }
            
            # 清洗推文
            cleaned_text = clean_tweet(tweet_data["text"])
            
            # 检查推文是否有效
            if is_valid_tweet(cleaned_text):
                tweet_data["cleaned_text"] = cleaned_text
                tweets.append(tweet_data)
                
                # 如果已经收集了200条有效推文，停止
                if len(tweets) >= 200:
                    break
                    
    except Exception as e:
        print(f"Error getting tweets: {e}")
    
    return tweets

def save_tweets_to_file(tweets, file_path):
    """将推文保存到文件"""
    with open(file_path, 'w', encoding='utf-8') as f:
        for i, tweet in enumerate(tweets):
            f.write(f"=== Tweet {i+1} ===\n")
            f.write(f"Text: {tweet['text']}\n")
            f.write(f"Cleaned Text: {tweet['cleaned_text']}\n")
            f.write(f"Created At: {tweet['created_at']}\n")
            f.write(f"Likes: {tweet['likes']}\n")
            f.write(f"Retweets: {tweet['retweets']}\n")
            f.write("\n")

def main():
    """主函数"""
    # 检查数据目录是否存在
    data_dir = os.path.join(os.path.dirname(__file__), "data")
    if not os.path.exists(data_dir):
        os.makedirs(data_dir)
    
    # 文件路径
    output_file = os.path.join(data_dir, "elon_musk_raw.txt")
    
    try:
        # 设置Twitter API
        api = setup_twitter_api()
        
        # 获取推文
        print("Getting Elon Musk's tweets...")
        tweets = get_elon_musk_tweets(api, count=300)  # 获取更多以确保有200条有效推文
        
        # 保存到文件
        print(f"Saving {len(tweets)} tweets to {output_file}...")
        save_tweets_to_file(tweets, output_file)
        
        print(f"Successfully saved {len(tweets)} tweets to {output_file}")
        
    except Exception as e:
        print(f"Error: {e}")
        print("\nIf you can't access Twitter API, please manually collect the data and save it to:")
        print(output_file)
        print("\nFormat for each tweet:")
        print("=== Tweet X ===")
        print("Text: [original tweet text]")
        print("Cleaned Text: [cleaned tweet text]")
        print("Created At: [YYYY-MM-DD HH:MM:SS]")
        print("Likes: [number]")
        print("Retweets: [number]")
        print("")

if __name__ == "__main__":
    main()
