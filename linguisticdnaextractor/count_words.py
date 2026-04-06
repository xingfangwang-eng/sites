#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
脚本功能：计算文章的字数
"""

import os

def count_words(file_path):
    """计算文件的字数"""
    if os.path.exists(file_path):
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
            # 计算单词数
            words = content.split()
            word_count = len(words)
            # 计算字符数
            char_count = len(content)
            print(f"File: {file_path}")
            print(f"Word count: {word_count}")
            print(f"Character count: {char_count}")
            return word_count, char_count
    else:
        print(f"File not found: {file_path}")
        return 0, 0

def main():
    """主函数"""
    article_path = 'output/elon_musk_article.txt'
    count_words(article_path)

if __name__ == "__main__":
    main()
