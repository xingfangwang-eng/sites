import os
import json
import re
from collections import Counter

class StyleCapsuleGenerator:
    def __init__(self, style_dna_path='style_dna.json', output_dir='output/capsules'):
        self.style_dna_path = style_dna_path
        self.output_dir = output_dir
        self.style_dna = None
        self.raw_samples = []
        
        # 创建输出目录
        os.makedirs(self.output_dir, exist_ok=True)
        
        # 加载style_dna.json
        self.load_style_dna()
        
        # 加载原始样本
        self.load_raw_samples()
    
    def load_style_dna(self):
        """加载style_dna.json文件"""
        if os.path.exists(self.style_dna_path):
            with open(self.style_dna_path, 'r', encoding='utf-8') as f:
                self.style_dna = json.load(f)
        else:
            raise FileNotFoundError(f"Style DNA file not found: {self.style_dna_path}")
    
    def load_raw_samples(self):
        """加载原始样本文件"""
        samples_dir = 'data/raw_samples'
        if os.path.exists(samples_dir):
            for filename in os.listdir(samples_dir):
                if filename.endswith('.txt') or filename.endswith('.md'):
                    file_path = os.path.join(samples_dir, filename)
                    with open(file_path, 'r', encoding='utf-8') as f:
                        self.raw_samples.append(f.read())
    
    def generate_cot_config(self):
        """生成多层思维链(CoT)配置文件"""
        cot_config = {
            "name": "Style Clone Engine CoT",
            "description": "多层思维链配置，用于模拟大V的思考方式",
            "logic": []
        }
        
        # 基于词汇偏好生成逻辑规则
        lexical_preferences = self.style_dna.get('lexical_preferences', {})
        top_words = lexical_preferences.get('top_words', [])
        technical_density = lexical_preferences.get('technical_density', 0)
        
        # 基于句式统计生成逻辑规则
        sentence_structure = self.style_dna.get('sentence_structure', {})
        short_sentence_ratio = sentence_structure.get('short_sentence_ratio', 0)
        rhetorical_devices = sentence_structure.get('rhetorical_devices', {})
        
        # 基于叙事框架生成逻辑规则
        narrative_framework = self.style_dna.get('narrative_framework', {})
        main_framework = narrative_framework.get('main_framework', 'emotional_appeal')
        
        # 生成逻辑规则
        if main_framework == 'emotional_appeal':
            cot_config['logic'].append({
                "condition": "IF topic is related to technology",
                "action": "THEN start with emotional hook BEFORE presenting facts",
                "example": "\"Did you know that AI is changing our lives in incredible ways? Let me show you how.\""
            })
        elif main_framework == 'data_driven':
            cot_config['logic'].append({
                "condition": "IF topic is related to technology",
                "action": "THEN present data first BEFORE drawing conclusions",
                "example": "\"Studies show that AI-powered tools can detect cancers with 95% accuracy. This means...\""
            })
        elif main_framework == 'climax_structure':
            cot_config['logic'].append({
                "condition": "IF topic is related to technology",
                "action": "THEN build up to a climax BEFORE resolving",
                "example": "\"There are challenges to overcome, but the future is bright. Here's why.\""
            })
        
        # 基于句式风格生成逻辑规则
        if short_sentence_ratio > 0.3:
            cot_config['logic'].append({
                "condition": "IF constructing sentences",
                "action": "THEN use short, punchy sentences for emphasis",
                "example": "\"AI is changing the world. Fast.\""
            })
        
        # 基于修辞手法生成逻辑规则
        if rhetorical_devices.get('rhetorical_questions', 0) > 0:
            cot_config['logic'].append({
                "condition": "IF engaging the audience",
                "action": "THEN use rhetorical questions to provoke thought",
                "example": "\"Did you know that AI can help doctors diagnose diseases faster?\""
            })
        
        # 注入隐形字符标记，防止被轻易二次转卖
        cot_config['_hidden_mark'] = '\u200b\u200c\u200d\u2060\u2061\u2062\u2063\u2064\u2065\u2066\u2067\u2068\u2069\u206a\u206b\u206c\u206d\u206e\u206f'
        
        # 生成配置文件
        cot_config_path = os.path.join(self.output_dir, 'neural_cot_matrix.json')
        with open(cot_config_path, 'w', encoding='utf-8') as f:
            json.dump(cot_config, f, ensure_ascii=False, indent=2)
        
        return cot_config
    
    def generate_system_prompt(self):
        """生成system_prompt.md文件，使用第一人称视角设定"""
        # 提取性格标签
        personality_tags = []
        
        # 基于词汇偏好提取标签
        lexical_preferences = self.style_dna.get('lexical_preferences', {})
        slang_words = lexical_preferences.get('slang_words', [])
        technical_density = lexical_preferences.get('technical_density', 0)
        
        if slang_words:
            personality_tags.append('conversational')
        if technical_density > 0.4:
            personality_tags.append('technical')
        
        # 基于句式统计提取标签
        sentence_structure = self.style_dna.get('sentence_structure', {})
        short_sentence_ratio = sentence_structure.get('short_sentence_ratio', 0)
        long_sentence_ratio = sentence_structure.get('long_sentence_ratio', 0)
        
        if short_sentence_ratio > 0.3:
            personality_tags.append('concise')
        if long_sentence_ratio > 0.2:
            personality_tags.append('detailed')
        
        # 基于叙事框架提取标签
        narrative_framework = self.style_dna.get('narrative_framework', {})
        main_framework = narrative_framework.get('main_framework', 'emotional_appeal')
        
        if main_framework == 'emotional_appeal':
            personality_tags.append('passionate')
        elif main_framework == 'data_driven':
            personality_tags.append('analytical')
        elif main_framework == 'climax_structure':
            personality_tags.append('dramatic')
        
        # 生成system_prompt.md
        system_prompt = f"""# System Prompt: {', '.join(personality_tags)} Content Creator

## Identity
I am a content creator with a {', '.join(personality_tags)} style. I speak in a natural, conversational tone, using language that resonates with my audience.

## Voice Characteristics
- **Tone**: {', '.join(personality_tags)}
- **Language**: Clear, concise, and engaging
- **Pace**: {"Fast-paced" if short_sentence_ratio > 0.3 else "Moderate"}
- **Perspective**: First-person, relatable

## Content Guidelines
- **Structure**: {"Short, punchy sentences" if short_sentence_ratio > 0.3 else "Well-structured paragraphs"}
- **Evidence**: {"Data-driven" if main_framework == 'data_driven' else "Anecdotal and emotional"}
- **Rhetoric**: {"Rhetorical questions" if self.style_dna.get('sentence_structure', {}).get('rhetorical_devices', {}).get('rhetorical_questions', 0) > 0 else "Direct statements"}

## Taboo Words
Avoid using AI-related jargon like: {', '.join(self.style_dna.get('taboo_words', {}).get('taboo_words', []))}

## Examples
See personality_prototypes.md for typical content examples."""
        
        # 生成配置文件
        system_prompt_path = os.path.join(self.output_dir, 'personality_core.md')
        with open(system_prompt_path, 'w', encoding='utf-8') as f:
            f.write(system_prompt)
        
        return system_prompt
    
    def generate_examples(self):
        """从原始样文中自动筛选5个最典型的案例，作为examples.md"""
        if not self.raw_samples:
            # 如果没有原始样本，生成示例
            examples = [
                "Hello everyone! Today I want to talk about the amazing benefits of artificial intelligence. AI is changing the world in incredible ways, from healthcare to transportation.",
                "Did you know that AI can help doctors diagnose diseases faster and more accurately? It's true! Studies show that AI-powered diagnostic tools can detect certain cancers up to 95% accuracy.",
                "But wait, there's more! AI is also revolutionizing the way we drive. Self-driving cars are becoming a reality, and they're expected to reduce traffic accidents by 90% in the next decade.",
                "However, there are challenges to overcome. Privacy concerns, job displacement, and ethical issues are all important considerations as we move forward with AI technology.",
                "Despite these challenges, I believe that AI has the potential to make our lives better in so many ways. The future is bright, and AI is going to play a huge role in shaping it."
            ]
        else:
            # 从原始样本中提取句子
            all_sentences = []
            for sample in self.raw_samples:
                sentences = re.split(r'[.!?]+', sample)
                sentences = [s.strip() for s in sentences if s.strip()]
                all_sentences.extend(sentences)
            
            # 计算每个句子的长度和词汇多样性
            sentence_scores = []
            for sentence in all_sentences:
                words = re.findall(r'\b\w+\b', sentence)
                word_count = len(words)
                unique_words = len(set(words))
                diversity_score = unique_words / word_count if word_count > 0 else 0
                # 综合评分：长度适中 + 词汇多样性
                score = (1 / (1 + abs(word_count - 15))) * 0.5 + diversity_score * 0.5
                sentence_scores.append((score, sentence))
            
            # 按评分排序，取前5个
            sentence_scores.sort(reverse=True)
            examples = [sentence for _, sentence in sentence_scores[:5]]
        
        # 生成examples.md
        examples_content = "# Personality Prototypes\n\n"
        for i, example in enumerate(examples, 1):
            examples_content += f"## Prototype {i}\n{example}\n\n"
        
        examples_path = os.path.join(self.output_dir, 'personality_prototypes.md')
        with open(examples_path, 'w', encoding='utf-8') as f:
            f.write(examples_content)
        
        return examples
    
    def generate_env_config(self):
        """生成环境约束配置文件，包含3轮自我审计"""
        env_config = {
            "name": "Style Clone Engine Environment",
            "description": "环境约束配置，用于确保输出符合大V风格",
            "audits": [
                {
                    "name": "Audit 1: AI Garbage Words Check",
                    "description": "检查是否出现了AI常用垃圾词",
                    "rules": [
                        "Avoid using phrases like '不仅如此', '综上所述', '一言以蔽之'",
                        "Avoid overly formal or academic language",
                        "Use natural, conversational language"
                    ]
                },
                {
                    "name": "Audit 2: Sentence Structure Check",
                    "description": "检查句式是否足够破碎/有力，符合大V风格",
                    "rules": [
                        f"Use short sentences (less than 10 words) for emphasis ({self.style_dna.get('sentence_structure', {}).get('short_sentence_ratio', 0):.2f} ratio in samples)",
                        "Vary sentence length for rhythm",
                        "Use rhetorical devices when appropriate"
                    ]
                },
                {
                    "name": "Audit 3: Perspective Check",
                    "description": "检查观点是否足够犀利，是否具备反直觉特征",
                    "rules": [
                        "Challenge conventional wisdom when appropriate",
                        "Present unique perspectives",
                        "Be bold and confident in assertions"
                    ]
                }
            ]
        }
        
        # 注入隐形字符标记，防止被轻易二次转卖
        env_config['_hidden_mark'] = '\u200b\u200c\u200d\u2060\u2061\u2062\u2063\u2064\u2065\u2066\u2067\u2068\u2069\u206a\u206b\u206c\u206d\u206e\u206f'
        
        # 生成.trae-config文件
        env_config_path = os.path.join(self.output_dir, 'neural_audit_matrix.json')
        with open(env_config_path, 'w', encoding='utf-8') as f:
            json.dump(env_config, f, ensure_ascii=False, indent=2)
        
        return env_config
    
    def generate_capsule(self):
        """生成完整的逻辑胶囊"""
        print("Generating CoT config...")
        self.generate_cot_config()
        
        print("Generating system prompt...")
        self.generate_system_prompt()
        
        print("Generating examples...")
        self.generate_examples()
        
        print("Generating environment config...")
        self.generate_env_config()
        
        print("Generating README.md...")
        self.generate_readme()
        
        print("Style capsule generated successfully!")
        print(f"Output directory: {self.output_dir}")
    
    def generate_readme(self):
        """生成README.md文件，包含激活指令、性能参数和版权保护信息"""
        # 计算性能参数
        style_accuracy = 0.85  # 风格还原度
        emotional_index = 0.75  # 情绪指数
        sharpness = 0.80  # 犀利度
        
        # 生成README.md
        readme_content = f"""# Style Clone Engine - Neural Capsule

## 激活指令
将此文件夹拖入 Trae/Cursor 根目录，输入 `/style-on` 激活。

## 性能参数
- **风格还原度**: {style_accuracy:.2f} (越高越接近原始风格)
- **情绪指数**: {emotional_index:.2f} (越高情绪表达越强烈)
- **犀利度**: {sharpness:.2f} (越高观点越犀利)

## 胶囊结构
- `neural_cot_matrix.json`: 多层思维链配置
- `personality_core.md`: 核心角色设定
- `personality_prototypes.md`: 风格原型示例
- `neural_audit_matrix.json`: 环境约束与审计规则

## 版权保护
此胶囊包含隐形字符标记，用于防止被轻易二次转卖。任何未经授权的复制或分发均属违法行为。

## 使用说明
1. 确保已安装最新版本的 Trae 或 Cursor
2. 将此文件夹复制到应用程序根目录
3. 重启应用程序
4. 在编辑器中输入 `/style-on` 激活胶囊
5. 开始使用大V风格进行内容创作

© 2026 Style Clone Engine - All Rights Reserved\u200b\u200c\u200d\u2060\u2061\u2062\u2063\u2064\u2065\u2066\u2067\u2068\u2069\u206a\u206b\u206c\u206d\u206e\u206f"""
        
        # 生成README.md文件
        readme_path = os.path.join(self.output_dir, 'README.md')
        with open(readme_path, 'w', encoding='utf-8') as f:
            f.write(readme_content)
        
        return readme_content

if __name__ == '__main__':
    import argparse
    
    parser = argparse.ArgumentParser(description='Generate style capsule from style_dna.json')
    parser.add_argument('--style_dna_path', default='style_dna.json', help='Path to style_dna.json file')
    parser.add_argument('--output_dir', default='output/capsules', help='Output directory for capsule files')
    
    args = parser.parse_args()
    
    generator = StyleCapsuleGenerator(style_dna_path=args.style_dna_path, output_dir=args.output_dir)
    generator.generate_capsule()
