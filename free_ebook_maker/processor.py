import google.generativeai as genai
import time
from config import GEMINI_API_KEY

def initialize_gemini():
    """Initialize Google Gemini API"""
    genai.configure(api_key=GEMINI_API_KEY)
    return genai.GenerativeModel('gemini-3.1-flash-lite-preview')

def clean_content(content, topic):
    """Clean and process content using Gemini 1.5 Flash"""
    # Truncate content if it's too long
    if len(content) > 5000:
        print("Content too long, truncating to 5000 characters")
        content = content[:5000] + "..."
    
    model = initialize_gemini()
    prompt = f"""你是一个数据清洗专家，请从以下 Markdown 中剔除广告、导航栏、重复内容，只保留与 {topic} 相关的核心知识点，并按逻辑分段。

{content}

Return the cleaned content in a well-structured format."""
    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        print(f"Error cleaning content: {e}")
        return content

def generate_outline(cleaned_contents, topic):
    """Generate a detailed outline for the ebook"""
    # Generate summaries for each cleaned content
    model = initialize_gemini()
    summaries = []
    for i, content in enumerate(cleaned_contents):
        print(f"Generating summary for content {i+1}/{len(cleaned_contents)}")
        prompt = f"""Please provide a concise summary of the following content about '{topic}'. Focus on the key points and main ideas:

{content}

Keep the summary to a few paragraphs."""
        try:
            response = model.generate_content(prompt)
            summaries.append(response.text)
        except Exception as e:
            print(f"Error generating summary: {e}")
            summaries.append(content[:500] + "...")  # Fallback to first 500 chars
    
    # Force wait for 60 seconds before generating outline
    print("Waiting 60 seconds before generating outline...")
    time.sleep(60)
    
    # Generate outline from summaries
    combined_summaries = "\n\n".join(summaries)
    prompt = f"""Based on the following summaries about '{topic}', please generate a detailed outline for an ebook. Include a title, introduction, multiple chapters with subsections, and a conclusion. The outline should be comprehensive and well-structured:

{combined_summaries}

Format the outline with clear hierarchy using markdown headings."""
    max_retries = 3
    for attempt in range(max_retries):
        try:
            response = model.generate_content(prompt)
            return response.text
        except Exception as e:
            print(f"Error generating outline (attempt {attempt+1}/{max_retries}): {e}")
            if attempt < max_retries - 1:
                print("Waiting 60 seconds before retrying...")
                time.sleep(60)
            else:
                return ""

def generate_chapter_content(cleaned_contents, topic, chapter_title):
    """Generate 1500 words for a specific chapter"""
    model = initialize_gemini()
    # Use summaries instead of full content to reduce token usage
    summaries = []
    for content in cleaned_contents:
        # Simple summary by taking first 1000 chars
        summaries.append(content[:1000] + "...")
    combined_content = "\n\n".join(summaries)
    
    prompt = f"""Based on the following content about '{topic}', please write a 1500-word chapter titled '{chapter_title}'. The chapter should be detailed, informative, and well-structured. Use the provided content as reference material:

{combined_content}

Ensure the chapter is approximately 1500 words and covers the topic thoroughly."""
    max_retries = 3
    for attempt in range(max_retries):
        try:
            response = model.generate_content(prompt)
            return response.text
        except Exception as e:
            print(f"Error generating chapter content (attempt {attempt+1}/{max_retries}): {e}")
            if attempt < max_retries - 1:
                print("Waiting 60 seconds before retrying...")
                time.sleep(60)
            else:
                return ""

def generate_ebook_content(cleaned_contents, topic):
    """Generate ebook content from cleaned contents"""
    # Generate outline first
    outline = generate_outline(cleaned_contents, topic)
    if not outline:
        return ""
    
    # Extract chapter titles from outline
    import re
    chapter_titles = re.findall(r'#{1,3}\s+(.*)', outline)
    
    # Generate content for each chapter
    chapters = []
    for i, chapter_title in enumerate(chapter_titles):
        print(f"Generating content for chapter: {chapter_title}")
        chapter_content = generate_chapter_content(cleaned_contents, topic, chapter_title)
        if chapter_content:
            chapters.append(f"# {chapter_title}\n\n{chapter_content}")
        # Wait 10 seconds after each chapter
        time.sleep(10)
    
    # Combine all chapters
    return "\n\n".join(chapters)
