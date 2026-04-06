#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
脚本功能：生成模拟的Elon Musk推文数据，用于测试和演示

运行脚本：python twitter_scraper_mock.py
"""

import os
import random
from datetime import datetime, timedelta

# 马斯克标志性语气词和话题
MUSK_PHRASES = [
    "Exactly", "Interesting", "First principles", "!!", "Wow", "Amazing",
    "Unbelievable", "Incredible", "Genius", "Brilliant", "Stunning",
    "Revolutionary", "Game changer", "Future", "Mars", "SpaceX", "Tesla",
    "Neuralink", "The Boring Company", "Cybertruck", "Starship", "Falcon",
    "Self-driving", "AI", "Artificial intelligence", "Machine learning",
    "Neural networks", "Robots", "Automation", "Sustainable energy",
    "Electric vehicles", "Solar", "Batteries", "Hyperloop", "Tunnel",
    "Rocket", "Launch", "Landing", "Reusable", "Innovation", "Technology",
    "Science", "Engineering", "Physics", "Math", "Code", "Programming"
]

# 模拟推文内容模板
TWEET_TEMPLATES = [
    "{phrase}! {topic} is going to change the world. {phrase2}!!",
    "Just had a great conversation about {topic}. {phrase} times ahead.",
    "Working on {topic} all night. {phrase} progress!",
    "{phrase}! The future of {topic} is looking bright. {phrase2}",
    "Can't wait to see {topic} in action. {phrase} technology!",
    "{topic} is the key to a sustainable future. {phrase}!",
    "Just landed {topic} successfully. {phrase} moment!",
    "{phrase}! {topic} will revolutionize {field}.",
    "Working on {topic} with the team. {phrase} progress every day.",
    "{topic} is coming soon. {phrase}! Get ready!"
]

# 领域
FIELDS = ["transportation", "energy", "space exploration", "AI", "healthcare", "education"]

def generate_mock_tweet(index):
    """生成模拟的推文数据"""
    # 随机选择模板和内容
    template = random.choice(TWEET_TEMPLATES)
    phrase = random.choice(MUSK_PHRASES)
    phrase2 = random.choice(MUSK_PHRASES)
    topic = random.choice(MUSK_PHRASES)
    field = random.choice(FIELDS)
    
    # 生成推文文本
    text = template.format(phrase=phrase, phrase2=phrase2, topic=topic, field=field)
    
    # 随机生成时间（最近30天内）
    days_ago = random.randint(0, 30)
    created_at = (datetime.now() - timedelta(days=days_ago)).strftime("%Y-%m-%d %H:%M:%S")
    
    # 随机生成互动数据
    likes = random.randint(10000, 1000000)
    retweets = random.randint(1000, 100000)
    
    # 简单的清洗（模拟）
    cleaned_text = text  # 这里可以添加实际的清洗逻辑
    
    return {
        "text": text,
        "cleaned_text": cleaned_text,
        "created_at": created_at,
        "likes": likes,
        "retweets": retweets
    }

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
    
    # 生成200条模拟推文
    print("Generating mock Elon Musk tweets...")
    tweets = [generate_mock_tweet(i) for i in range(200)]
    
    # 保存到文件
    print(f"Saving {len(tweets)} tweets to {output_file}...")
    save_tweets_to_file(tweets, output_file)
    
    print(f"Successfully saved {len(tweets)} mock tweets to {output_file}")

if __name__ == "__main__":
    main()
