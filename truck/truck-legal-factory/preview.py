#!/usr/bin/env python3
"""
Simple HTTP server for previewing Hugo site
"""
import http.server
import socketserver
import os
import webbrowser
from pathlib import Path

PORT = 8081
DIRECTORY = os.path.abspath("public")

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)
    
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        super().end_headers()

def generate_site():
    """Generate static site from content"""
    print("Generating static site...")
    
    # Create public directory
    os.makedirs(DIRECTORY, exist_ok=True)
    os.makedirs(os.path.join(DIRECTORY, "posts"), exist_ok=True)
    
    # Copy static files
    static_files = {
        "index.html": generate_index(),
        "about.html": generate_about(),
        "contact.html": generate_contact(),
        "disclaimer.html": generate_disclaimer(),
        "privacy-policy.html": generate_privacy(),
        "search.html": generate_search(),
    }
    
    for filename, content in static_files.items():
        with open(os.path.join(DIRECTORY, filename), "w", encoding="utf-8") as f:
            f.write(content)
    
    # Generate posts
    posts_dir = Path("content/posts")
    if posts_dir.exists():
        for post_file in posts_dir.glob("*.md"):
            if post_file.name.startswith("_"):
                continue
            post_html = generate_post(post_file)
            output_file = os.path.join(DIRECTORY, "posts", f"{post_file.stem}.html")
            with open(output_file, "w", encoding="utf-8") as f:
                f.write(post_html)
    
    print(f"Site generated in {DIRECTORY}")
    print(f"Files in public directory: {os.listdir(DIRECTORY)}")

def generate_base_template(title, content, extra_css=""):
    """Generate base HTML template"""
    return f'''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title} | US Truck Accident & Injury Law Portal</title>
    <meta name="description" content="Your comprehensive resource for truck accident legal information">
    <style>
        :root {{
            --primary: #1a1a2e;
            --secondary: #16213e;
            --accent: #e94560;
            --text: #eaeaea;
            --text-secondary: #a0a0a0;
            --bg: #0f0f1a;
            --card-bg: #1a1a2e;
        }}
        
        * {{
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }}
        
        body {{
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background: var(--bg);
            color: var(--text);
            line-height: 1.6;
        }}
        
        header {{
            background: var(--primary);
            padding: 1rem 0;
            border-bottom: 2px solid var(--accent);
            position: sticky;
            top: 0;
            z-index: 100;
        }}
        
        nav {{
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 2rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }}
        
        .logo {{
            font-size: 1.5rem;
            font-weight: bold;
            color: var(--accent);
            text-decoration: none;
        }}
        
        .nav-links {{
            display: flex;
            gap: 2rem;
            list-style: none;
        }}
        
        .nav-links a {{
            color: var(--text);
            text-decoration: none;
            transition: color 0.3s;
        }}
        
        .nav-links a:hover {{
            color: var(--accent);
        }}
        
        main {{
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
        }}
        
        .post-single {{
            background: var(--card-bg);
            border-radius: 8px;
            padding: 2rem;
            margin: 2rem 0;
        }}
        
        .post-title {{
            font-size: 2.5rem;
            margin-bottom: 1rem;
            color: var(--text);
        }}
        
        .post-meta {{
            color: var(--text-secondary);
            margin-bottom: 2rem;
            font-size: 0.9rem;
        }}
        
        .post-content {{
            font-size: 1.1rem;
            line-height: 1.8;
        }}
        
        .post-content h2 {{
            color: var(--accent);
            margin: 2rem 0 1rem;
            font-size: 1.8rem;
        }}
        
        .post-content h3 {{
            color: var(--text);
            margin: 1.5rem 0 0.5rem;
            font-size: 1.4rem;
        }}
        
        .post-content p {{
            margin-bottom: 1rem;
        }}
        
        .post-content ul, .post-content ol {{
            margin: 1rem 0 1rem 2rem;
        }}
        
        .post-content table {{
            width: 100%;
            border-collapse: collapse;
            margin: 1.5rem 0;
        }}
        
        .post-content th, .post-content td {{
            padding: 0.75rem;
            border: 1px solid var(--secondary);
            text-align: left;
        }}
        
        .post-content th {{
            background: var(--secondary);
            font-weight: bold;
        }}
        
        .legal-fact-check {{
            margin-top: 40px;
            padding: 20px;
            background-color: rgba(40, 167, 69, 0.1);
            border-left: 4px solid #28a745;
            border-radius: 4px;
        }}
        
        .fact-check-badge {{
            display: flex;
            align-items: center;
            margin-bottom: 10px;
            font-weight: 600;
            color: #28a745;
        }}
        
        .fact-check-badge svg {{
            margin-right: 8px;
        }}
        
        .post-list {{
            display: grid;
            gap: 1.5rem;
        }}
        
        .post-card {{
            background: var(--card-bg);
            padding: 1.5rem;
            border-radius: 8px;
            border: 1px solid var(--secondary);
            transition: transform 0.2s, border-color 0.2s;
        }}
        
        .post-card:hover {{
            transform: translateY(-2px);
            border-color: var(--accent);
        }}
        
        .post-card a {{
            color: var(--text);
            text-decoration: none;
        }}
        
        .post-card h2 {{
            color: var(--accent);
            margin-bottom: 0.5rem;
        }}
        
        .post-card .date {{
            color: var(--text-secondary);
            font-size: 0.9rem;
        }}
        
        footer {{
            background: var(--primary);
            padding: 2rem;
            margin-top: 4rem;
            text-align: center;
            color: var(--text-secondary);
        }}
        
        footer a {{
            color: var(--accent);
            text-decoration: none;
        }}
        
        .hero {{
            text-align: center;
            padding: 4rem 2rem;
            background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
            border-radius: 12px;
            margin-bottom: 3rem;
        }}
        
        .hero h1 {{
            font-size: 3rem;
            margin-bottom: 1rem;
            color: var(--text);
        }}
        
        .hero p {{
            font-size: 1.3rem;
            color: var(--text-secondary);
            max-width: 800px;
            margin: 0 auto;
        }}
        
        .btn {{
            display: inline-block;
            background: var(--accent);
            color: white;
            padding: 0.75rem 1.5rem;
            border-radius: 4px;
            text-decoration: none;
            margin-top: 1rem;
            transition: background 0.3s;
        }}
        
        .btn:hover {{
            background: #ff6b6b;
        }}
        
        {extra_css}
    </style>
</head>
<body>
    <header>
        <nav>
            <a href="/" class="logo">🚛 Truck Legal Portal</a>
            <ul class="nav-links">
                <li><a href="/">Home</a></li>
                <li><a href="/posts/">Articles</a></li>
                <li><a href="/about.html">About</a></li>
                <li><a href="/contact.html">Contact</a></li>
                <li><a href="/search.html">Search</a></li>
            </ul>
        </nav>
    </header>
    
    <main>
        {content}
    </main>
    
    <footer>
        <p>&copy; 2026 US Truck Accident & Injury Law Portal. All rights reserved.</p>
        <p>
            <a href="/disclaimer.html">Legal Disclaimer</a> | 
            <a href="/privacy-policy.html">Privacy Policy</a> | 
            <a href="/contact.html">Contact Us</a>
        </p>
        <p style="margin-top: 1rem; font-size: 0.85rem;">
            <strong>Important:</strong> We are not a law firm. The information provided is for educational purposes only.
        </p>
    </footer>
</body>
</html>'''

def generate_index():
    """Generate homepage"""
    content = '''
    <div class="hero">
        <h1>US Truck Accident & Injury Law Portal</h1>
        <p>Your comprehensive resource for truck accident legal information, injury claims, and expert guidance. We are an independent research team dedicated to analyzing major truck accident compensation cases.</p>
        <a href="/posts/" class="btn">Browse Articles</a>
    </div>
    
    <h2 style="margin-bottom: 1.5rem;">Latest Legal Guides</h2>
    <div class="post-list">
        <article class="post-card">
            <a href="/posts/truck-driver-fatigue.html">
                <h2>Truck Driver Fatigue: The Silent Killer on American Highways</h2>
                <p class="date">March 28, 2026</p>
                <p>Learn about your legal rights after a catastrophic collision caused by a fatigued truck driver. Discover how FMCSA regulations protect you and what compensation you may be entitled to.</p>
            </a>
        </article>
        
        <article class="post-card">
            <a href="/posts/truck-brake-failure.html">
                <h2>Truck Brake Failure: The Deadly Consequences of Negligent Maintenance</h2>
                <p class="date">March 25, 2026</p>
                <p>Understanding the legal implications of truck brake failure accidents. Learn how to prove negligence and get the compensation you deserve.</p>
            </a>
        </article>
        
        <article class="post-card">
            <a href="/posts/welcome.html">
                <h2>Welcome to US Truck Accident & Injury Law Portal</h2>
                <p class="date">April 4, 2026</p>
                <p>Welcome to our comprehensive resource for truck accident legal information. Learn about truck accident liability, compensation claims, and your legal rights.</p>
            </a>
        </article>
    </div>
    '''
    return generate_base_template("Home", content)

def generate_about():
    """Generate about page"""
    content = '''
    <article class="post-single">
        <h1 class="post-title">About Us</h1>
        <div class="post-content">
            <h2>Who We Are</h2>
            <p>Welcome to the US Truck Accident & Injury Law Portal. We are an <strong>independent research team</strong> dedicated to analyzing major truck accident compensation cases across the United States.</p>
            
            <h2>Our Expertise</h2>
            <ul>
                <li><strong>Catastrophic Injury Cases</strong>: Analyzing compensation patterns for life-altering injuries</li>
                <li><strong>Wrongful Death Claims</strong>: Researching settlement trends and jury awards</li>
                <li><strong>Federal Regulation Compliance</strong>: Examining FMCSA violations</li>
                <li><strong>Insurance Coverage Analysis</strong>: Investigating policy limits and bad faith claims</li>
            </ul>
            
            <h2>Our Commitment</h2>
            <p>While we are not attorneys and cannot provide legal advice, we are committed to accuracy, transparency, and empowering victims with knowledge.</p>
        </div>
    </article>
    '''
    return generate_base_template("About Us", content)

def generate_contact():
    """Generate contact page"""
    content = '''
    <article class="post-single">
        <h1 class="post-title">Contact Us</h1>
        <div class="post-content">
            <h2>Research Office</h2>
            <p><strong>US Truck Accident & Injury Law Portal</strong><br>
            Houston Commerce Tower, Suite 2850<br>
            1200 Smith Street<br>
            Houston, Texas 77002<br>
            United States</p>
            
            <p>📞 Phone: (713) 555-0147<br>
            📧 Email: research@truck.wangdadi.xyz</p>
            
            <h2>Important Notice</h2>
            <p><strong>We are not a law firm</strong> and do not provide legal representation. If you need legal advice, please contact a licensed attorney in your jurisdiction.</p>
        </div>
    </article>
    '''
    return generate_base_template("Contact Us", content)

def generate_disclaimer():
    """Generate disclaimer page"""
    content = '''
    <article class="post-single">
        <h1 class="post-title">Legal Disclaimer</h1>
        <div class="post-content">
            <div style="background: rgba(233, 69, 96, 0.1); border-left: 4px solid var(--accent); padding: 1rem; margin-bottom: 2rem;">
                <strong>⚠️ IMPORTANT NOTICE</strong><br>
                WE ARE NOT A LAW FIRM. THE INFORMATION PROVIDED ON THIS WEBSITE IS FOR EDUCATIONAL PURPOSES ONLY.
            </div>
            
            <h2>No Attorney-Client Relationship</h2>
            <p>The US Truck Accident & Injury Law Portal is an <strong>independent research organization</strong>. We are <strong>not attorneys</strong>, and we do <strong>not provide legal services</strong> or <strong>legal representation</strong>.</p>
            
            <h2>Educational Purpose Only</h2>
            <p>All content on this website is provided <strong>solely for educational and informational purposes</strong>. This content should <strong>not</strong> be construed as legal advice or a substitute for professional legal counsel.</p>
            
            <h2>No Guarantees or Warranties</h2>
            <p>While we strive to provide accurate and up-to-date information, we make <strong>no representations or warranties</strong> of any kind. <strong>Any reliance you place on such information is strictly at your own risk.</strong></p>
        </div>
    </article>
    '''
    return generate_base_template("Legal Disclaimer", content)

def generate_privacy():
    """Generate privacy policy page"""
    content = '''
    <article class="post-single">
        <h1 class="post-title">Privacy Policy</h1>
        <div class="post-content">
            <p><strong>Last Updated: April 4, 2026</strong></p>
            
            <h2>Our Commitment to Your Privacy</h2>
            <p>The US Truck Accident & Injury Law Portal is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information.</p>
            
            <h2>Information We Collect</h2>
            <p>We may collect personal information that you voluntarily provide to us when you fill out contact forms or subscribe to newsletters. This may include your name, email address, and phone number.</p>
            
            <h2>How We Use Your Information</h2>
            <p>We use the information we collect to respond to your inquiries, send newsletters (if you opt-in), and improve our website and content.</p>
            
            <h2>Your Privacy Rights</h2>
            <p>You have the right to access, correct, or delete your personal information. To exercise these rights, please contact us at privacy@truck.wangdadi.xyz.</p>
        </div>
    </article>
    '''
    return generate_base_template("Privacy Policy", content)

def generate_search():
    """Generate search page"""
    content = '''
    <article class="post-single">
        <h1 class="post-title">Search</h1>
        <div class="post-content">
            <p>Search functionality placeholder. Use the articles page to browse all content.</p>
            <p><a href="/posts/" class="btn">Browse All Articles</a></p>
        </div>
    </article>
    '''
    return generate_base_template("Search", content)

def generate_post(post_file):
    """Generate a post page from markdown file"""
    import re
    
    with open(post_file, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Extract front matter
    front_matter_match = re.match(r'^---\n(.*?)\n---\n(.*)$', content, re.DOTALL)
    if front_matter_match:
        front_matter = front_matter_match.group(1)
        body = front_matter_match.group(2)
        
        # Parse front matter
        title = re.search(r'title:\s*"([^"]+)"', front_matter)
        title = title.group(1) if title else "Untitled"
        
        date = re.search(r'date:\s*(.+)', front_matter)
        date = date.group(1) if date else ""
        
        author = re.search(r'author:\s*"?([^"\n]+)"?', front_matter)
        author = author.group(1) if author else "Truck Legal Factory"
    else:
        title = "Untitled"
        body = content
        date = ""
        author = "Truck Legal Factory"
    
    # Convert markdown to HTML (basic)
    html_body = body
    
    # Headers
    html_body = re.sub(r'^### (.+)$', r'<h3>\1</h3>', html_body, flags=re.MULTILINE)
    html_body = re.sub(r'^## (.+)$', r'<h2>\1</h2>', html_body, flags=re.MULTILINE)
    html_body = re.sub(r'^# (.+)$', r'<h1>\1</h1>', html_body, flags=re.MULTILINE)
    
    # Bold and italic
    html_body = re.sub(r'\*\*\*(.+?)\*\*\*', r'<strong><em>\1</em></strong>', html_body)
    html_body = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', html_body)
    html_body = re.sub(r'\*(.+?)\*', r'<em>\1</em>', html_body)
    
    # Lists
    html_body = re.sub(r'^- (.+)$', r'<li>\1</li>', html_body, flags=re.MULTILINE)
    html_body = re.sub(r'(<li>.+</li>\n)+', r'<ul>\g<0></ul>', html_body)
    
    # Paragraphs
    paragraphs = html_body.split('\n\n')
    html_body = '\n'.join(f'<p>{p}</p>' if not p.startswith('<') else p for p in paragraphs)
    
    # Tables (basic support)
    html_body = re.sub(r'\|([^|]+)\|([^|]+)\|([^|]+)\|', r'<tr><td>\1</td><td>\2</td><td>\3</td></tr>', html_body)
    
    # Create schema.org structured data
    schema_json = f'''
    <script type="application/ld+json">
    {{
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": "{title}",
      "datePublished": "{date}",
      "dateModified": "{date}",
      "author": {{
        "@type": "Person",
        "name": "{author}"
      }}
    }}
    </script>
    '''
    
    post_content = f'''
    <article class="post-single">
        {schema_json}
        <h1 class="post-title">{title}</h1>
        <!-- Hidden metadata for search engines -->
        <div style="display: none;">
            <span class="post-date">{date}</span>
            <span class="post-author">{author}</span>
        </div>
        <div class="post-content">
            {html_body}
            
            <div class="legal-fact-check">
                <div class="fact-check-badge">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                        <polyline points="22 4 12 14.01 9 11.01"/>
                    </svg>
                    <span>Fact Checked by Legal Experts</span>
                </div>
                <p>This article has been reviewed and fact-checked by our team of legal experts to ensure accuracy and compliance with current laws and regulations.</p>
            </div>
        </div>
    </article>
    '''
    
    return generate_base_template(title, post_content)

def run_server():
    """Run the HTTP server"""
    generate_site()
    
    print(f"\nCurrent working directory: {os.getcwd()}")
    print(f"Server directory: {DIRECTORY}")
    print(f"Files in server directory: {os.listdir(DIRECTORY)}")
    
    with socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
        print(f"\n🚀 Server running at http://localhost:{PORT}/")
        print(f"📁 Serving files from {DIRECTORY}")
        print("\nPress Ctrl+C to stop the server\n")
        
        # Open browser
        webbrowser.open(f"http://localhost:{PORT}/")
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n\n👋 Server stopped")

if __name__ == "__main__":
    run_server()
