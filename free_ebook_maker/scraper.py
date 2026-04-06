from ddgs import DDGS
import requests
import re

def extract_keywords(topic):
    """Extract keywords from a topic string"""
    # Remove special characters and split into words
    words = re.findall(r'\b\w+\b', topic)
    # Return the first 3-5 keywords
    return ' '.join(words[:5])

def search_links(topic, max_results=10):
    """Search for links on a specific topic using DuckDuckGo"""
    # Add keywords to improve search quality
    search_query = f"{topic} (filetype:md OR tutorial)"
    with DDGS() as ddgs:
        results = list(ddgs.text(search_query, max_results=max_results))
        
        # If no results, try with extracted keywords
        if not results and len(topic.split()) > 3:
            print(f"No results found for '{topic}'. Trying with extracted keywords...")
            keywords = extract_keywords(topic)
            print(f"Extracted keywords: {keywords}")
            keyword_query = f"{keywords} (filetype:md OR tutorial)"
            results = list(ddgs.text(keyword_query, max_results=max_results))
        
        return [result['href'] for result in results]

def get_markdown_content(url):
    """Get markdown content from a URL using Jina Reader"""
    jina_url = f"https://r.jina.ai/{url}"
    try:
        response = requests.get(jina_url, timeout=30)
        response.raise_for_status()
        return response.text
    except Exception as e:
        print(f"Error fetching content from {url}: {e}")
        return None
