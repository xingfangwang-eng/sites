import google.genai

# Check models module
print("Available in google.genai.models:")
for attr in dir(google.genai.models):
    if not attr.startswith('_'):
        print(f"- {attr}")

# Try to create a model using the client
print("\nTrying client approach:")
try:
    client = google.genai.Client()
    print("Client created successfully")
    models = client.list_models()
    print(f"Available models: {[m.name for m in models]}")
except Exception as e:
    print(f"Error with client: {e}")
