import csv
import os
import random
import time
from datetime import datetime, timedelta
from dotenv import load_dotenv
from openai import OpenAI

# Load environment variables from .env file
load_dotenv()

# Configure OpenAI client
api_key = os.getenv('GROQ_API_KEY')
base_url = 'https://api.groq.com/openai/v1'
if not api_key:
    raise ValueError("GROQ_API_KEY not found in environment variables. Please check your .env file.")

client = OpenAI(
    api_key=api_key,
    base_url=base_url
)

# Function to generate random date within the last 30 days
def get_random_date():
    end_date = datetime.now()
    start_date = end_date - timedelta(days=30)
    random_date = start_date + (end_date - start_date) * random.random()
    return random_date.strftime('%Y-%m-%dT%H:%M:%S%z')

# Function to generate content using OpenAI API
def generate_content(keyword, scenario):
    # Add retry logic for network issues
    max_retries = 3
    for attempt in range(max_retries):
        try:
            # System role setting
            system_prompt = "You are a Senior Trial Attorney with 20 years of experience in US truck accident compensation cases. Professional, calm, compassionate. MUST include Markdown table with | delimiters."
            
            # Step 1: Generate first 4 modules (about 1500 words)
            user_prompt_part1 = f"""Write a comprehensive legal guide for keyword: '{keyword}'. Include the following 4 modules with specified word counts:

1. Executive Summary (200 words): High-level overview of the scenario.
2. Detailed Accident Narrative (400 words): Deep simulation of a real accident moment with sensory details and emotional impact.
3. Legal Framework & Statutes (500 words): Not just listing laws, but analyzing how each law applies to the accident.
4. Punitive Damages Analysis (400 words): Special discussion on the legal threshold for 'punitive damages'.

Professional tone, avoid AI words, include specific legal citations. Scenario: {scenario}

**Anti-Generalization Constraints:**
- **No Summaries:**严禁使用 'In summary', 'In conclusion', 'To wrap up' 等词汇。
- **Forced Details:** 每一段话必须引用具体的数字、具体的法律条文（如 49 CFR § 396.17）或具体的物理伤害描述。
- **Language Style:** 模拟法律教科书与实战手册的混合风格，确保信息密度极高。
- **Token Strategy:** 尽可能用满模型支持的最大 token 空间，提供最详细的信息。"""
            
            response_part1 = client.chat.completions.create(
                model="llama-3.1-8b-instant",
                messages=[
                    {
                        "role": "system",
                        "content": system_prompt
                    },
                    {
                        "role": "user",
                        "content": user_prompt_part1
                    }
                ],
                max_tokens=4096,
                temperature=0.7
            )
            
            text_part1 = response_part1.choices[0].message.content
            
            # Step 2: Generate remaining 5 modules (about 1500 words) based on part 1
            user_prompt_part2 = f"""Based on the content below, continue writing the comprehensive legal guide for keyword: '{keyword}'. Include the following 5 modules with specified word counts:

5. The Mandatory Comparison Table: Keep the existing table comparing 'Self-Representation' vs 'Attorney Representation' for Medical Expenses, Pain & Suffering, Lost Wages, Property Damage, Punitive Damages. Add 200 words of detailed data interpretation before and after the table.
6. Insurance Tactics Deep Dive (500 words): Detailed exposure of 5 common insurance company tactics to deny or reduce claims, with countermeasures.
7. Evidence Collection Checklist (400 words): Survival guide for victims: what to photograph, who to get records from, how to keep logs.
8. State-Specific Nuances (300 words): Special judicial interpretations for the state where the accident occurred (e.g., Texas).
9. Expanded FAQ (500 words): Increase FAQs to 8-10, each answer must include legal basis.

**Anti-Generalization Constraints:**
- **No Summaries:**严禁使用 'In summary', 'In conclusion', 'To wrap up' 等词汇。
- **Forced Details:** 每一段话必须引用具体的数字、具体的法律条文（如 49 CFR § 396.17）或具体的物理伤害描述。
- **Language Style:** 模拟法律教科书与实战手册的混合风格，确保信息密度极高。
- **Token Strategy:** 尽可能用满模型支持的最大 token 空间，提供最详细的信息。

Existing content:
{text_part1}"""
            
            response_part2 = client.chat.completions.create(
                model="llama-3.1-8b-instant",
                messages=[
                    {
                        "role": "system",
                        "content": system_prompt
                    },
                    {
                        "role": "user",
                        "content": user_prompt_part2
                    }
                ],
                max_tokens=4096,
                temperature=0.7
            )
            
            text_part2 = response_part2.choices[0].message.content
            
            # Step 3: Combine both parts
            text = text_part1 + "\n\n" + text_part2
            
            # Quality check: Ensure table is present
            if '|' not in text:
                print(f"WARNING: Table not found in article for {keyword}")
                # Trigger append request to generate table
                try:
                    print("Attempting to generate the missing table...")
                    append_prompt = f"""
                    Your previous response was missing the mandatory comparison table. 
                    Please generate the table now based on the content above.
                    The table should compare 'Self-Representation' vs 'Attorney Representation' for various damages including:
                    - Medical Expenses
                    - Pain and Suffering
                    - Lost Wages
                    - Property Damage
                    - Punitive Damages
                    Ensure the table is properly formatted with | symbols.
                    """
                    
                    append_response = client.chat.completions.create(
                        model="llama-3.1-8b-instant",
                        messages=[
                            {
                                "role": "system",
                                "content": system_prompt
                            },
                            {
                                "role": "user",
                                "content": append_prompt
                            }
                        ],
                        max_tokens=2048,
                        temperature=0.7
                    )
                    
                    append_text = append_response.choices[0].message.content
                    
                    # Insert the table after the Legal Statutes section
                    if "Legal Statutes" in text:
                        # Split the text at the Legal Statutes section
                        parts = text.split("Legal Statutes")
                        if len(parts) > 1:
                            # Insert the table after the Legal Statutes section with H2 title
                            text = parts[0] + "Legal Statutes" + parts[1].split("Insurance Company Tactics")[0] + "\n### Estimated Compensation Comparison: 2024 Industry Data\n\n" + append_text + "\n\nInsurance Company Tactics" + parts[1].split("Insurance Company Tactics")[1]
                        else:
                            # If sections not found, append at the end with H2 title
                            text += "\n### Estimated Compensation Comparison: 2024 Industry Data\n\n" + append_text
                    else:
                        # If Legal Statutes section not found, append at the end with H2 title
                        text += "\n### Estimated Compensation Comparison: 2024 Industry Data\n\n" + append_text
                    
                    print("Successfully appended the missing table")
                except Exception as e:
                    print(f"Error generating table: {e}")
                    print(f"Marking article as Pending: {keyword}")
            
            return text
            
        except Exception as e:
            print(f"Attempt {attempt + 1} failed: {e}")
            if attempt < max_retries - 1:
                print("Retrying...")
                time.sleep(5)
            else:
                raise

# Function to create Hugo front matter
def create_front_matter(title, keyword, date):
    # Extract a clean filename from the keyword
    filename = keyword.lower().replace(' ', '-')
    # Remove any non-alphanumeric characters except hyphens
    filename = ''.join(c for c in filename if c.isalnum() or c == '-')
    
    # Create tags array
    tags = [keyword, "truck-accident", "legal-guide"]
    # Create categories array
    categories = ["Legal Resources"]
    
    # Create summary by extracting the first 200 characters of the description
    description = f"Comprehensive legal guide for {keyword} accidents"
    summary = description[:200]
    
    # Format tags and categories as YAML arrays
    tags_str = '[' + ', '.join([f'"{tag}"' for tag in tags]) + ']'
    categories_str = '[' + ', '.join([f'"{category}"' for category in categories]) + ']'
    
    front_matter = f"""---
title: "{title}"
date: {date}
draft: false
tags: {tags_str}
categories: {categories_str}
author: "Truck Legal Factory"
description: "{description}"
summary: "{summary}"
---
"""
    return front_matter, filename

# Main function
def main():
    # Create posts directory if it doesn't exist
    posts_dir = "content/posts"
    os.makedirs(posts_dir, exist_ok=True)
    
    # Read keywords from CSV file and count total rows
    with open('keywords.csv', 'r', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        rows = list(reader)
        total_rows = len(rows)
        print(f"Total rows: {total_rows}")
        if rows:
            print(f"First row: {rows[0]}")
    
    # Process each row
    for i, row in enumerate(rows, 1):
        keyword = row['Keyword']
        scenario = row['Scenario']
        
        print(f"Processing {i}/{total_rows}... {keyword}")
        
        # Generate filename to check if file already exists
        filename = keyword.lower().replace(' ', '-')
        file_path = os.path.join(posts_dir, f"{filename}.md")
        
        # Check if file already exists (breakpoint continuation)
        if os.path.exists(file_path):
            print(f"Skipping {keyword} - file already exists")
            continue
        
        # Generate content
        try:
            content = generate_content(keyword, scenario)
            
            # Extract title from content (assuming title is in the first line)
            lines = content.split('\n')
            title = lines[0].strip()
            
            # Create front matter
            date = get_random_date()
            front_matter, filename = create_front_matter(title, keyword, date)
            
            # Combine front matter and content (front_matter already ends with --- and newline)
            full_content = front_matter + '\n' + '\n'.join(lines[1:])
            
            # Save to file
            file_path = os.path.join(posts_dir, f"{filename}.md")
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(full_content)
            
            # Check if table is present
            table_present = '|' in content
            table_status = "表格检测通过" if table_present else "表格检测未通过"
            
            print(f"[{i}/{total_rows}] 文章《{title}》已生成并{table_status}")
            
            # Add random delay to avoid API rate limits
            delay = random.randint(120, 180)
            print(f"Sleeping for {delay} seconds to avoid rate limits...")
            time.sleep(delay)
            
        except Exception as e:
            print(f"[{i}/{total_rows}] Error processing {keyword}: {e}")
            # Still add delay after error to avoid rate limits
            delay = random.randint(120, 180)
            print(f"Sleeping for {delay} seconds after error...")
            time.sleep(delay)

if __name__ == "__main__":
    main()
