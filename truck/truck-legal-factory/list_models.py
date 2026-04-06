import requests
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Configure Gemini API
api_key = os.getenv('GEMINI_API_KEY')
if not api_key:
    raise ValueError("GEMINI_API_KEY not found in environment variables. Please check your .env file.")

API_URL = "https://generativelanguage.googleapis.com/v1/models"

# List available models
def list_models():
    try:
        response = requests.get(
            f"{API_URL}?key={api_key}",
            timeout=30
        )
        
        if response.status_code != 200:
            raise Exception(f"API error: {response.status_code} - {response.text}")
        
        result = response.json()
        models = result.get('models', [])
        
        print("Available models:")
        for model in models:
            print(f"- {model['name']}")
            print(f"  Description: {model.get('description', 'N/A')}")
            print(f"  Supported methods: {model.get('supportedGenerationMethods', [])}")
            print()
            
    except Exception as e:
        print(f"Error listing models: {e}")

if __name__ == "__main__":
    list_models()
