import google.genai

# Check what's available in the module
print("Available attributes in google.genai:")
for attr in dir(google.genai):
    if not attr.startswith('_'):
        print(f"- {attr}")

# Check version
print(f"\ngoogle.genai version: {getattr(google.genai, '__version__', 'Unknown')}")
