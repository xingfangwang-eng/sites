from scraper import search_links, get_markdown_content
from processor import clean_content, generate_ebook_content
import time

def main():
    """Main function to generate ebook"""
    # Get user input for topic
    topic = input("Enter the topic for your ebook: ")
    
    # Search for relevant links
    print(f"Searching for links about '{topic}'...")
    links = search_links(topic, max_results=10)
    print(f"Found {len(links)} links")
    
    # Fetch and clean content from each link
    cleaned_contents = []
    for i, link in enumerate(links):
        print(f"Processing link {i+1}/{len(links)}: {link}")
        content = get_markdown_content(link)
        if content:
            cleaned = clean_content(content, topic)
            cleaned_contents.append(cleaned)
        # Wait 10 seconds after each link
        time.sleep(10)
    
    # Generate ebook content
    if cleaned_contents:
        print("Generating ebook content...")
        ebook_content = generate_ebook_content(cleaned_contents, topic)
        
        # Save ebook to file
        if ebook_content.strip():
            filename = "book.md"
            with open(filename, 'w', encoding='utf-8') as f:
                f.write(ebook_content)
            print(f"Ebook saved to {filename}")
        else:
            print("Warning: Ebook content is empty, not saving to file")
        
        # Convert to EPUB using pypandoc
        try:
            import pypandoc
            output = pypandoc.convert_file(
                'book.md',
                'epub',
                outputfile='book.epub',
                extra_args=['--epub-chapter-level=2']
            )
            print("Ebook converted to book.epub")
        except ImportError:
            print("pypandoc not installed. Please install it with 'pip install pypandoc'")
        except Exception as e:
            print(f"Error converting to EPUB: {e}")
    else:
        print("No content found to generate ebook")

if __name__ == "__main__":
    main()
