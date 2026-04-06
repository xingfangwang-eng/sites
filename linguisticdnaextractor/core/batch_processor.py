import os
import shutil
import subprocess
import zipfile
import time

class BatchProcessor:
    def __init__(self, input_dir='data/vips', output_dir='output/capsules'):
        self.input_dir = input_dir
        self.output_dir = output_dir
        
        # 创建输出目录
        os.makedirs(self.output_dir, exist_ok=True)
    
    def process_all_vips(self):
        """批量处理所有大V文件夹"""
        # 遍历输入目录下的所有子文件夹
        vip_folders = [f for f in os.listdir(self.input_dir) if os.path.isdir(os.path.join(self.input_dir, f))]
        
        print(f"Found {len(vip_folders)} VIP folders to process")
        
        for i, vip_folder in enumerate(vip_folders, 1):
            print(f"\nProcessing VIP {i}/{len(vip_folders)}: {vip_folder}")
            
            try:
                # 处理单个大V
                self.process_single_vip(vip_folder)
                print(f"✓ Successfully processed {vip_folder}")
            except Exception as e:
                print(f"✗ Failed to process {vip_folder}: {str(e)}")
                continue
    
    def process_single_vip(self, vip_folder):
        """处理单个大V文件夹"""
        # 构建路径
        vip_dir = os.path.join(self.input_dir, vip_folder)
        vip_output_dir = os.path.join(self.output_dir, vip_folder)
        
        # 创建大V专属输出目录
        os.makedirs(vip_output_dir, exist_ok=True)
        
        # 1. 复制原始样本到临时目录
        temp_samples_dir = os.path.join('data', 'raw_samples')
        if os.path.exists(temp_samples_dir):
            shutil.rmtree(temp_samples_dir)
        os.makedirs(temp_samples_dir, exist_ok=True)
        
        # 复制大V的样本文件
        for file in os.listdir(vip_dir):
            if file.endswith('.txt') or file.endswith('.md'):
                shutil.copy(os.path.join(vip_dir, file), temp_samples_dir)
        
        # 2. 运行analyzer.py生成style_dna.json
        print("  Running analyzer.py...")
        subprocess.run(['python', 'core/analyzer.py'], check=True, capture_output=True)
        
        # 3. 运行generator.py生成风格胶囊
        print("  Running generator.py...")
        # 修改generator.py的输出目录为当前大V的输出目录
        subprocess.run(['python', 'core/generator.py', '--output_dir', vip_output_dir], check=True, capture_output=True)
        
        # 4. 将生成的胶囊打包成压缩包
        print("  Creating capsule zip...")
        zip_path = os.path.join(self.output_dir, f"{vip_folder}_capsule.zip")
        self.create_zip(vip_output_dir, zip_path)
        
        # 5. 清理临时文件
        if os.path.exists('style_dna.json'):
            os.remove('style_dna.json')
        if os.path.exists(temp_samples_dir):
            shutil.rmtree(temp_samples_dir)
    
    def create_zip(self, source_dir, output_zip):
        """创建压缩包"""
        with zipfile.ZipFile(output_zip, 'w', zipfile.ZIP_DEFLATED) as zipf:
            for root, _, files in os.walk(source_dir):
                for file in files:
                    file_path = os.path.join(root, file)
                    arcname = os.path.relpath(file_path, source_dir)
                    zipf.write(file_path, arcname)
    
    def setup_vip_dirs(self, num_vips=50):
        """设置示例大V目录结构（用于测试）"""
        os.makedirs(self.input_dir, exist_ok=True)
        
        for i in range(1, num_vips + 1):
            vip_dir = os.path.join(self.input_dir, f'vip_{i}')
            os.makedirs(vip_dir, exist_ok=True)
            
            # 创建示例样本文件
            sample_content = f"""Hello everyone! I'm VIP {i}, and I want to talk about AI.

AI is changing the world in amazing ways. It's revolutionizing healthcare, transportation, and many other industries.

Did you know that AI can help doctors diagnose diseases faster? That's just one of the many benefits.

However, there are challenges to overcome. We need to address privacy concerns and ethical issues.

Despite these challenges, I believe AI has a bright future. Let's embrace it!"""
            
            with open(os.path.join(vip_dir, 'sample.txt'), 'w', encoding='utf-8') as f:
                f.write(sample_content)
        
        print(f"Created {num_vips} VIP directories with sample content")

if __name__ == '__main__':
    processor = BatchProcessor()
    
    # 为测试创建示例大V目录结构
    processor.setup_vip_dirs(5)  # 测试时只创建5个
    
    # 开始批量处理
    processor.process_all_vips()
