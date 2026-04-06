GEMINI_API_KEY = "AIzaSyA5KI5XD0cJ5oGfeUxpFIqvauV4QObUWBg"
import os
from dotenv import load_dotenv

# 加载 .env.local 文件
load_dotenv(dotenv_path=".env.local")

SUPABASE_URL = os.getenv("https://kysiljdsowpnjmworqlo.supabase.co")
SUPABASE_ANON_KEY = os.getenv("sb_publishable_ySY4oJoqEfFjc2HAvo1x1w_K_4TdXyg")
