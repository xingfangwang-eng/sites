import os
import json
import re
from collections import Counter
import openai

# 定义默认的英文停用词列表
default_english_stopwords = set([
    'i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', "you're", "you've", "you'll", "you'd", 
    'your', 'yours', 'yourself', 'yourselves', 'he', 'him', 'his', 'himself', 'she', "she's", 'her', 'hers', 
    'herself', 'it', "it's", 'its', 'itself', 'they', 'them', 'their', 'theirs', 'themselves', 'what', 'which', 
    'who', 'whom', 'this', 'that', "that'll", 'these', 'those', 'am', 'is', 'are', 'was', 'were', 'be', 'been', 
    'being', 'have', 'has', 'had', 'having', 'do', 'does', 'did', 'doing', 'a', 'an', 'the', 'and', 'but', 'if', 
    'or', 'because', 'as', 'until', 'while', 'of', 'at', 'by', 'for', 'with', 'about', 'against', 'between', 
    'into', 'through', 'during', 'before', 'after', 'above', 'below', 'to', 'from', 'up', 'down', 'in', 'out', 
    'on', 'off', 'over', 'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why', 
    'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 
    'only', 'own', 'same', 'so', 'than', 'too', 'very', 's', 't', 'can', 'will', 'don', "don't", 'should', 
    "should've", 'now', 'd', 'll', 'm', 'o', 're', 've', 'y', 'ain', 'aren', "aren't", 'couldn', "couldn't", 
    'didn', "didn't", 'doesn', "doesn't", 'hadn', "hadn't", 'hasn', "hasn't", 'haven', "haven't", 'isn', "isn't", 
    'ma', 'mightn', "mightn't", 'mustn', "mustn't", 'needn', "needn't", 'shan', "shan't", 'shouldn', "shouldn't", 
    'wasn', "wasn't", 'weren', "weren't", 'won', "won't", 'wouldn', "wouldn't"
])

class StyleDNAAnalyzer:
    def __init__(self, samples_dir='data/raw_samples'):
        self.samples_dir = samples_dir
        self.stop_words = default_english_stopwords
        # 添加中文停用词
        self.chinese_stop_words = set(['的', '了', '是', '在', '我', '有', '和', '就', '不', '人', '都', '一', '一个', '上', '也', '很', '到', '说', '要', '去', '你', '会', '着', '没有', '看', '好', '自己', '这'])
        self.all_text = ''
        self.sentences = []
        self.words = []

    def _sent_tokenize(self, text):
        """简单的句子分割函数"""
        # 使用正则表达式分割句子
        sentences = re.split(r'[.!?]+', text)
        # 过滤空句子
        sentences = [s.strip() for s in sentences if s.strip()]
        return sentences

    def _word_tokenize(self, text):
        """简单的单词分割函数"""
        # 使用正则表达式分割单词
        words = re.findall(r'\b\w+\b', text)
        return words

    def load_samples(self):
        """加载所有样本文件"""
        for filename in os.listdir(self.samples_dir):
            if filename.endswith('.txt') or filename.endswith('.md'):
                file_path = os.path.join(self.samples_dir, filename)
                with open(file_path, 'r', encoding='utf-8') as f:
                    text = f.read()
                    self.all_text += text
                    self.sentences.extend(self._sent_tokenize(text))
                    self.words.extend(self._word_tokenize(text))

    def analyze_lexical_preferences(self):
        """分析词汇偏好"""
        # 过滤停用词
        filtered_words = [word.lower() for word in self.words if word.isalnum() and word.lower() not in self.stop_words and word not in self.chinese_stop_words]
        
        # 计算高频词
        word_counts = Counter(filtered_words)
        top_words = word_counts.most_common(20)
        
        # 识别口语化俚语（简单实现，实际应用中可能需要更复杂的规则）
        slang_patterns = r'\b(awesome|cool|amazing|crazy|literally|totally|seriously|guys|folks|y\'all)\b'
        slang_words = re.findall(slang_patterns, self.all_text, re.IGNORECASE)
        
        # 计算专业术语密度（简单实现，实际应用中可能需要领域特定的术语库）
        technical_terms = [word for word in filtered_words if len(word) > 6 and word.isalpha()]
        technical_density = len(technical_terms) / len(filtered_words) if filtered_words else 0
        
        return {
            'top_words': top_words,
            'slang_words': list(set(slang_words)),
            'technical_density': technical_density
        }

    def analyze_sentence_structure(self):
        """分析句式统计"""
        # 计算短句比例（少于10个词的句子）
        short_sentences = [s for s in self.sentences if len(self._word_tokenize(s)) < 10]
        short_sentence_ratio = len(short_sentences) / len(self.sentences) if self.sentences else 0
        
        # 计算长难句比例（超过20个词的句子）
        long_sentences = [s for s in self.sentences if len(self._word_tokenize(s)) > 20]
        long_sentence_ratio = len(long_sentences) / len(self.sentences) if self.sentences else 0
        
        # 识别修辞手法
        rhetorical_devices = {
            'rhetorical_questions': len(re.findall(r'\?\s*$', self.all_text)),
            'parallelism': self._detect_parallelism()
        }
        
        return {
            'short_sentence_ratio': short_sentence_ratio,
            'long_sentence_ratio': long_sentence_ratio,
            'rhetorical_devices': rhetorical_devices
        }

    def _detect_parallelism(self):
        """检测排比句式"""
        # 简单实现，实际应用中可能需要更复杂的算法
        parallelism_count = 0
        # 查找重复的句式结构
        sentence_structures = []
        for sentence in self.sentences:
            # 提取句子的基本结构（去除具体词汇）
            structure = re.sub(r'\b\w+\b', 'X', sentence)
            sentence_structures.append(structure)
        
        # 计算重复结构的数量
        structure_counts = Counter(sentence_structures)
        for count in structure_counts.values():
            if count >= 2:
                parallelism_count += count
        
        return parallelism_count

    def analyze_narrative_framework(self):
        """分析叙事框架"""
        framework_indicators = {
            'emotional_appeal': 0,
            'data_driven': 0,
            'climax_structure': 0
        }
        
        # 情感煽动指标（简单实现）
        emotional_words = ['amazing', 'incredible', 'unbelievable', 'fantastic', 'terrible', 'horrible', 'disgusting', 'lovely', 'wonderful', 'awesome']
        for word in emotional_words:
            framework_indicators['emotional_appeal'] += len(re.findall(rf'\b{word}\b', self.all_text, re.IGNORECASE))
        
        # 数据驱动指标（简单实现）
        data_patterns = [r'\d+%', r'\$\d+', r'\d+\s+times', r'\d+\s+people', r'\d+\s+years']
        for pattern in data_patterns:
            framework_indicators['data_driven'] += len(re.findall(pattern, self.all_text))
        
        # 先抑后扬结构指标（简单实现）
        negative_words = ['problem', 'issue', 'challenge', 'difficulty', 'bad', 'negative', 'worse']
        positive_words = ['solution', 'improvement', 'success', 'good', 'positive', 'better']
        
        negative_count = 0
        positive_count = 0
        for i, sentence in enumerate(self.sentences):
            for word in negative_words:
                if word in sentence.lower():
                    negative_count += 1
            for word in positive_words:
                if word in sentence.lower():
                    positive_count += 1
            # 检查是否有先抑后扬的模式
            if negative_count > 0 and positive_count > negative_count:
                framework_indicators['climax_structure'] += 1
        
        # 确定主要叙事框架
        main_framework = max(framework_indicators, key=framework_indicators.get)
        
        return {
            'indicators': framework_indicators,
            'main_framework': main_framework
        }

    def analyze_taboo_words(self):
        """分析禁忌词表"""
        # 常见的AI味词汇
        ai_words = ['artificial intelligence', 'machine learning', 'algorithm', 'neural network', 'data science', 'deep learning', 'predictive analytics', 'natural language processing']
        
        # 检查这些词汇是否在文本中出现
        taboo_words = [word for word in ai_words if word not in self.all_text.lower()]
        
        return {
            'taboo_words': taboo_words
        }

    def analyze_with_llm(self, text):
        """使用LLM API分析文本"""
        # 设置OpenAI API密钥（实际使用时需要从环境变量或配置文件中获取）
        openai.api_key = os.getenv('OPENAI_API_KEY', 'your-api-key-here')
        
        try:
            # 构建分析请求
            response = openai.chat.completions.create(
                model="gpt-4",
                messages=[
                    {
                        "role": "system",
                        "content": "你是一位专业的语言风格分析师，负责分析文本的语言DNA。请从以下几个维度分析文本：1. 词汇偏好（高频词、口语化俚语、专业术语密度）；2. 句式统计（短句爆发力、长难句比例、修辞手法）；3. 叙事框架（先抑后扬、数据驱动、情绪煽动）；4. 禁忌词表（识别大V从来不用的词汇）。请以JSON格式输出分析结果。"
                    },
                    {
                        "role": "user",
                        "content": text
                    }
                ],
                response_format={"type": "json_object"}
            )
            
            # 解析LLM返回的分析结果
            llm_analysis = json.loads(response.choices[0].message.content)
            return llm_analysis
        except Exception as e:
            print(f"LLM analysis failed: {e}")
            # 如果LLM分析失败，返回None，使用本地分析结果
            return None

    def generate_style_dna(self):
        """生成风格DNA报告"""
        self.load_samples()
        
        # 本地分析
        local_analysis = {
            'lexical_preferences': self.analyze_lexical_preferences(),
            'sentence_structure': self.analyze_sentence_structure(),
            'narrative_framework': self.analyze_narrative_framework(),
            'taboo_words': self.analyze_taboo_words()
        }
        
        # 使用LLM进行分析
        llm_analysis = self.analyze_with_llm(self.all_text)
        
        # 结合本地分析和LLM分析结果
        if llm_analysis:
            # 使用LLM分析结果覆盖本地分析结果
            style_dna = llm_analysis
            # 添加本地分析结果作为参考
            style_dna['local_analysis'] = local_analysis
        else:
            # 如果LLM分析失败，使用本地分析结果
            style_dna = local_analysis
        
        # 输出为JSON文件
        with open('style_dna.json', 'w', encoding='utf-8') as f:
            json.dump(style_dna, f, ensure_ascii=False, indent=2)
        
        return style_dna

if __name__ == '__main__':
    analyzer = StyleDNAAnalyzer()
    style_dna = analyzer.generate_style_dna()
    print("Style DNA analysis completed. Results saved to style_dna.json")
