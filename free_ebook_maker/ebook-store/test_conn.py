import os
from pathlib import Path
from dotenv import load_dotenv
from supabase import create_client

# 1. 自动定位 .env.local 文件路径（假设脚本在 ebook-store 文件夹内）
current_dir = Path(__file__).parent
env_path = current_dir.parent / ".env.local"

# 2. 加载文件
load_dotenv(dotenv_path=env_path)

# 3. 【关键：修改变量名】必须和你 .env.local 文件里的一模一样
url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
key = os.environ.get("NEXT_PUBLIC_SUPABASE_ANON_KEY")

# 4. 检查并测试连接
if not url or not key:
    print(f"❌ 错误：未能读取到变量。")
    print(f"当前尝试读取的文件路径: {env_path.resolve()}")
    print("请确认 .env.local 里的变量名是否确为 NEXT_PUBLIC_SUPABASE_URL")
else:
    try:
        supabase = create_client(url, key)
        print("✅ 成功！Supabase 客户端已成功初始化。")
        print(f"连接地址: {url}")
    except Exception as e:
        print(f"❌ 初始化失败: {e}")