import os
import json
import openai
import time

class ValidationAgent:
    def __init__(self, capsules_dir='output/capsules'):
        self.capsules_dir = capsules_dir
        self.openai_api_key = os.getenv('OPENAI_API_KEY', 'your-api-key-here')
        openai.api_key = self.openai_api_key
    
    def validate_all_capsules(self, prompt="如何看 2026 年的 AI 泡沫"):
        """验证所有风格胶囊"""
        # 遍历所有胶囊目录
        capsule_dirs = [d for d in os.listdir(self.capsules_dir) if os.path.isdir(os.path.join(self.capsules_dir, d))]
        
        print(f"Found {len(capsule_dirs)} capsule directories to validate")
        
        results = {}
        
        for i, capsule_dir in enumerate(capsule_dirs, 1):
            print(f"\nValidating capsule {i}/{len(capsule_dirs)}: {capsule_dir}")
            
            try:
                # 验证单个胶囊
                result = self.validate_single_capsule(capsule_dir, prompt)
                results[capsule_dir] = result
                print(f"✓ Successfully validated {capsule_dir}")
            except Exception as e:
                print(f"✗ Failed to validate {capsule_dir}: {str(e)}")
                continue
        
        # 保存验证结果
        results_path = os.path.join('output', 'validation_results.json')
        with open(results_path, 'w', encoding='utf-8') as f:
            json.dump(results, f, ensure_ascii=False, indent=2)
        
        print(f"\nValidation results saved to {results_path}")
        return results
    
    def validate_single_capsule(self, capsule_dir, prompt):
        """验证单个风格胶囊"""
        capsule_path = os.path.join(self.capsules_dir, capsule_dir)
        
        # 1. 生成A面：原生GPT-4输出
        print("  Generating A side (native GPT-4)...")
        a_side = self.generate_native_output(prompt)
        
        # 2. 生成B面：加载风格胶囊后的输出
        print("  Generating B side (with style capsule)...")
        b_side = self.generate_with_capsule(prompt, capsule_path)
        
        # 3. 分析差异
        print("  Analyzing differences...")
        differences = self.analyze_differences(a_side, b_side)
        
        return {
            "prompt": prompt,
            "a_side": a_side,
            "b_side": b_side,
            "differences": differences
        }
    
    def generate_native_output(self, prompt):
        """生成原生GPT-4输出"""
        try:
            response = openai.chat.completions.create(
                model="gpt-4",
                messages=[
                    {
                        "role": "system",
                        "content": "You are a helpful assistant."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=0.7,
                max_tokens=500
            )
            return response.choices[0].message.content
        except Exception as e:
            print(f"Error generating native output: {str(e)}")
            return "Error generating native output"
    
    def generate_with_capsule(self, prompt, capsule_path):
        """加载风格胶囊并生成输出"""
        # 读取system_prompt.md
        system_prompt_path = os.path.join(capsule_path, 'system_prompt.md')
        if os.path.exists(system_prompt_path):
            with open(system_prompt_path, 'r', encoding='utf-8') as f:
                system_prompt = f.read()
        else:
            system_prompt = "You are a content creator with a unique style."
        
        # 读取examples.md
        examples_path = os.path.join(capsule_path, 'examples.md')
        examples = ""
        if os.path.exists(examples_path):
            with open(examples_path, 'r', encoding='utf-8') as f:
                examples = f.read()
        
        # 构建完整的提示
        full_prompt = f"""{system_prompt}

{examples}

Now, please respond to the following prompt in the same style:

{prompt}"""
        
        try:
            response = openai.chat.completions.create(
                model="gpt-4",
                messages=[
                    {
                        "role": "system",
                        "content": system_prompt
                    },
                    {
                        "role": "user",
                        "content": f"{examples}\n\nNow, please respond to the following prompt in the same style:\n\n{prompt}"
                    }
                ],
                temperature=0.7,
                max_tokens=500
            )
            return response.choices[0].message.content
        except Exception as e:
            print(f"Error generating output with capsule: {str(e)}")
            return "Error generating output with capsule"
    
    def analyze_differences(self, a_side, b_side):
        """分析A面和B面的差异"""
        # 简单的差异分析
        a_words = set(a_side.lower().split())
        b_words = set(b_side.lower().split())
        
        # 特有词汇
        a_unique = a_words - b_words
        b_unique = b_words - a_words
        
        # 长度差异
        a_length = len(a_side)
        b_length = len(b_side)
        length_diff = abs(a_length - b_length)
        
        # 句子数量差异
        a_sentences = len(a_side.split('.'))
        b_sentences = len(b_side.split('.'))
        sentence_diff = abs(a_sentences - b_sentences)
        
        return {
            "a_unique_words": list(a_unique)[:10],  # 取前10个
            "b_unique_words": list(b_unique)[:10],  # 取前10个
            "length_difference": length_diff,
            "sentence_count_difference": sentence_diff,
            "a_length": a_length,
            "b_length": b_length,
            "a_sentences": a_sentences,
            "b_sentences": b_sentences
        }

if __name__ == '__main__':
    agent = ValidationAgent()
    agent.validate_all_capsules()
