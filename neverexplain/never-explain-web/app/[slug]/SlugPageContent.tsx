"use client";

import { useState } from "react";
import { Check, ChevronRight, Code, Copy, ExternalLink, Terminal } from "lucide-react";

// 读取关键词数据
import keywords from "@/data/keywords.json";

// 内容增强器
import { enhanceContent, categorizeKeyword } from "@/lib/content-enhancer";

// 组件
import RelatedSolutions from "@/components/RelatedSolutions";
import JsonLd from "@/components/JsonLd";
import PowerToolsSuite from "@/components/PowerToolsSuite";

// 代码示例
const codeExamples = {
  "convert-curl-to-axios": `import axios from 'axios';

// Converted from cURL
axios({
  method: 'GET',
  url: 'https://api.example.com/data',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer token123'
  },
  params: {
    page: 1,
    limit: 10
  }
})
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.error(error);
  });`,
  "convert-json-to-csv": `const fs = require('fs');
const json2csv = require('json2csv').parse;

const data = [
  { name: 'John', age: 30, city: 'New York' },
  { name: 'Jane', age: 25, city: 'London' }
];

const csv = json2csv(data);
fs.writeFileSync('output.csv', csv);
console.log('JSON converted to CSV successfully!');`,
  "convert-csv-to-json": `const fs = require('fs');
const csv = require('csv-parser');

const results = [];

fs.createReadStream('input.csv')
  .pipe(csv())
  .on('data', (data) => results.push(data))
  .on('end', () => {
    console.log(results);
    fs.writeFileSync('output.json', JSON.stringify(results, null, 2));
  });`,
  "generate-random-password": `function generatePassword(length = 12) {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~-=';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
}

console.log(generatePassword());`,
  "minify-css": `const cleanCSS = require('clean-css');

const css = 'body { font-size: 16px; color: #333; }';
const minified = new cleanCSS().minify(css).styles;
console.log(minified);`,
  "minify-javascript": `const UglifyJS = require('uglify-js');

const code = 'function add(a, b) { return a + b; }';
const result = UglifyJS.minify(code);
console.log(result.code);`,
  "validate-email-address": `function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

console.log(validateEmail('user@example.com'));`,
  "calculate-md5-hash": `const crypto = require('crypto');

function md5Hash(text) {
  return crypto.createHash('md5').update(text).digest('hex');
}

console.log(md5Hash('Hello World'));`,
  "convert-html-to-markdown": `const TurndownService = require('turndown');

const turndownService = new TurndownService();
const html = '<h1>Hello World</h1><p>This is a paragraph.</p>';
const markdown = turndownService.turndown(html);
console.log(markdown);`,
  "convert-markdown-to-html": `const marked = require('marked');

const markdown = '# Hello World\n\nThis is a paragraph.';
const html = marked(markdown);
console.log(html);`,
  "compress-image-online": `const sharp = require('sharp');

sharp('input.jpg')
  .resize(800)
  .jpeg({ quality: 80 })
  .toFile('output.jpg', (err) => {
    if (err) throw err;
    console.log('Image compressed successfully!');
  });`,
  "resize-image-online": `const sharp = require('sharp');

sharp('input.jpg')
  .resize(1024, 768)
  .toFile('output.jpg', (err) => {
    if (err) throw err;
    console.log('Image resized successfully!');
  });`,
  "generate-qr-code": `const qr = require('qrcode');

qr.toFile('qrcode.png', 'https://example.com', (err) => {
  if (err) throw err;
  console.log('QR code generated successfully!');
});`,
  "decode-qr-code": `const Jimp = require('jimp');
const qrcode = require('qrcode-reader');

Jimp.read('qrcode.png', (err, image) => {
  if (err) throw err;
  const qr = new qrcode();
  qr.callback = (err, value) => {
    if (err) throw err;
    console.log(value.result);
  };
  qr.decode(image.bitmap);
});`,
  "convert-base64-to-image": `const fs = require('fs');

function base64ToImage(base64, outputPath) {
  const buffer = Buffer.from(base64, 'base64');
  fs.writeFileSync(outputPath, buffer);
}

// Example usage
const base64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==';
base64ToImage(base64.replace('data:image/png;base64,', ''), 'output.png');`,
  "convert-image-to-base64": `const fs = require('fs');

function imageToBase64(imagePath) {
  const buffer = fs.readFileSync(imagePath);
  return buffer.toString('base64');
}

// Example usage
const base64 = imageToBase64('input.png');
console.log('data:image/png;base64,' + base64);`,
  "format-json-online": `const fs = require('fs');

function formatJSON(jsonString) {
  try {
    const obj = JSON.parse(jsonString);
    return JSON.stringify(obj, null, 2);
  } catch (e) {
    return 'Invalid JSON';
  }
}

// Example usage
const json = '{"name":"John","age":30}';
console.log(formatJSON(json));`,
  "validate-json-online": `function validateJSON(jsonString) {
  try {
    JSON.parse(jsonString);
    return true;
  } catch (e) {
    return false;
  }
}

// Example usage
const json = '{"name":"John","age":30}';
console.log(validateJSON(json));`,
  "generate-uuid": `const { v4: uuidv4 } = require('uuid');

console.log(uuidv4());`
};

interface Keyword {
  slug: string;
  title: string;
  problem_description: string;
  how_to_solve: string;
}

export default function SlugPageContent({ keyword, slug }: { keyword: Keyword; slug: string }) {
  const [copied, setCopied] = useState(false);
  
  // 增强内容
  const enhancedContent = enhanceContent(keyword);
  
  const codeExample = codeExamples[keyword.slug as keyof typeof codeExamples] || codeExamples["convert-curl-to-axios"];
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  // Generate structured data
  const currentUrl = window.location.href;
  const category = categorizeKeyword(keyword);
  
  const softwareApplicationData = {
    name: keyword.title,
    applicationCategory: category,
    url: currentUrl,
    description: keyword.how_to_solve.substring(0, 160),
    price: '0',
    priceCurrency: 'USD',
    availability: 'https://schema.org/InStock'
  };
  
  // Split how_to_solve into steps for HowTo schema
  const steps = keyword.how_to_solve
    .split('. ')
    .filter(step => step.trim().length > 0)
    .map(step => step.trim() + '.');
  
  const howToData = {
    name: keyword.title,
    description: keyword.problem_description,
    steps: steps
  };
  
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* JSON-LD Structured Data */}
      <JsonLd type="SoftwareApplication" data={softwareApplicationData} />
      <JsonLd type="HowTo" data={howToData} />
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Title */}
            <div>
              <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-slate-900 mb-6">
                {keyword.title}
              </h1>
              <p className="text-lg text-slate-600 leading-relaxed mb-6">
                {keyword.how_to_solve.substring(0, 160)}...
              </p>
              {/* Trend Section (for Coding category) */}
              {enhancedContent.trendSection && (
                <div className="bg-slate-100 border border-slate-200 p-6 rounded-lg mb-8">
                  <h2 className="text-xl font-bold text-slate-900 mb-4">2026 Latest Trends</h2>
                  <p className="text-lg text-slate-600 leading-relaxed">
                    {enhancedContent.trendSection}
                  </p>
                </div>
              )}
            </div>
            
            {/* Problem Section */}
            <div className="bg-white border border-slate-200 p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                <div className="w-1 bg-red-600 h-8 mr-4"></div>
                The Problem
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed mb-4">
                {keyword.problem_description}
              </p>
              <p className="text-lg text-slate-600 leading-relaxed">
                This issue affects developers, data analysts, and content creators alike, leading to wasted time and potential errors. Manual processes are not only inefficient but also prone to human error, especially when dealing with complex data or code.
              </p>
            </div>
            
            {/* The Tool */}
            <div className="bg-white border border-slate-200 p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                <div className="w-1 bg-red-600 h-8 mr-4"></div>
                The Tool
              </h2>
              <div className="space-y-4">
                <p className="text-lg text-slate-600 leading-relaxed">
                  Our tool provides a simple, one-click solution to {keyword.title.toLowerCase()}.
                </p>
                <div className="border border-slate-200 rounded-md overflow-hidden">
                  <div className="bg-slate-100 px-4 py-2 flex items-center justify-between border-b border-slate-200">
                    <div className="flex items-center gap-2">
                      <Terminal size={18} className="text-slate-400" />
                      <span className="text-sm font-medium text-slate-700">OneClickAPI</span>
                    </div>
                    <button 
                      onClick={() => copyToClipboard(codeExample)}
                      className="flex items-center gap-1 text-sm text-slate-600 hover:text-slate-900 transition-colors"
                    >
                      {copied ? <Check size={16} /> : <Copy size={16} />}
                      {copied ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                  <pre className="bg-slate-50 p-4 overflow-x-auto text-sm font-mono text-slate-800">
                    <code>{codeExample}</code>
                  </pre>
                </div>
                <button className="w-full px-6 py-3 bg-red-600 text-white font-medium hover:bg-red-700 transition-colors active:scale-95">
                  Use This Tool
                </button>
              </div>
            </div>
            
            {/* The Guide */}
            <div className="bg-white border border-slate-200 p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                <div className="w-1 bg-red-600 h-8 mr-4"></div>
                The Guide
              </h2>
              <div className="space-y-4">
                <p className="text-lg text-slate-600 leading-relaxed">
                  {keyword.how_to_solve}
                </p>
                <p className="text-lg text-slate-600 leading-relaxed">
                  Our tool is designed to be user-friendly, even for those with limited technical knowledge. Here's how it works:
                </p>
                <ol className="list-decimal list-inside space-y-2 text-lg text-slate-600 leading-relaxed pl-4">
                  <li>Access the tool through our website</li>
                  <li>Input your data or code into the designated field</li>
                  <li>Click the "Process" button</li>
                  <li>Copy the generated result</li>
                  <li>Paste it into your project</li>
                </ol>
              </div>
            </div>
            
            {/* Recall Content Section */}
            <div className="bg-white border border-slate-200 p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                <div className="w-1 bg-red-600 h-8 mr-4"></div>
                Context Example
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed mb-6">
                Use the following context with our /recall feature to quickly access this information in your development workflow:
              </p>
              <div className="border border-slate-200 rounded-md overflow-hidden">
                <div className="bg-slate-100 px-4 py-2 flex items-center justify-between border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <Terminal size={18} className="text-slate-400" />
                    <span className="text-sm font-medium text-slate-700">context.ts</span>
                  </div>
                  <button 
                    onClick={() => copyToClipboard(enhancedContent.recallContent)}
                    className="flex items-center gap-1 text-sm text-slate-600 hover:text-slate-900 transition-colors"
                  >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <pre className="bg-slate-50 p-4 overflow-x-auto text-sm font-mono text-slate-800">
                  <code>{enhancedContent.recallContent}</code>
                </pre>
              </div>
            </div>
            
            {/* Code Section */}
            <div className="bg-white border border-slate-200 p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                <div className="w-1 bg-red-600 h-8 mr-4"></div>
                Example Code
              </h2>
              <div className="border border-slate-200 rounded-md overflow-hidden">
                <div className="bg-slate-100 px-4 py-2 flex items-center justify-between border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <Code size={18} className="text-slate-400" />
                    <span className="text-sm font-medium text-slate-700">{keyword.slug}.js</span>
                  </div>
                  <button 
                    onClick={() => copyToClipboard(codeExample)}
                    className="flex items-center gap-1 text-sm text-slate-600 hover:text-slate-900 transition-colors"
                  >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <pre className="bg-slate-50 p-4 overflow-x-auto text-sm font-mono text-slate-800">
                  <code>{codeExample}</code>
                </pre>
              </div>
            </div>
            
            {/* FAQ Section */}
            <div className="bg-white border border-slate-200 p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                <div className="w-1 bg-red-600 h-8 mr-4"></div>
                Frequently Asked Questions
              </h2>
              <div className="space-y-6">
                {enhancedContent.faqs.map((faq, index) => (
                  <div key={index} className="border-b border-slate-100 pb-6 last:border-0 last:pb-0">
                    <h3 className="text-lg font-semibold text-slate-900 mb-3">
                      {faq.question}
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Related Solutions */}
            <RelatedSolutions currentKeyword={keyword} allKeywords={keywords} />
          </div>
          
          {/* Sticky Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-8">
              {/* Tool Summary */}
              <div className="bg-white border border-slate-200 p-8">
                <h3 className="text-xl font-bold text-slate-900 mb-4">Tool Summary</h3>
                <ul className="space-y-3 text-slate-600">
                  <li className="flex items-center gap-2">
                    <Check size={16} className="text-green-600 flex-shrink-0" />
                    <span>Fast processing</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={16} className="text-green-600 flex-shrink-0" />
                    <span>Accurate results</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={16} className="text-green-600 flex-shrink-0" />
                    <span>Easy to use</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={16} className="text-green-600 flex-shrink-0" />
                    <span>Free to use</span>
                  </li>
                </ul>
              </div>
              
              {/* Related Tools */}
              <div className="bg-white border border-slate-200 p-8">
                <h3 className="text-xl font-bold text-slate-900 mb-4">Related Tools</h3>
                <ul className="space-y-3">
                  {keywords
                    .filter(k => k.slug !== keyword.slug)
                    .slice(0, 5)
                    .map(relatedKeyword => (
                      <li key={relatedKeyword.slug}>
                        <a 
                          href={`/${relatedKeyword.slug}`}
                          className="flex items-center gap-2 text-slate-600 hover:text-red-600 transition-colors"
                        >
                          <ChevronRight size={16} />
                          <span>{relatedKeyword.title}</span>
                        </a>
                      </li>
                    ))
                  }
                </ul>
              </div>
              
              {/* User Comments */}
              <div className="bg-white border border-slate-200 p-8">
                <h3 className="text-xl font-bold text-slate-900 mb-4">User Comments</h3>
                <div className="space-y-4">
                  <div className="border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center text-slate-600 font-medium">
                        JS
                      </div>
                      <span className="font-medium text-slate-900">John Smith</span>
                    </div>
                    <p className="text-slate-600">
                      This tool saved me hours of manual work. The conversion was perfect and error-free!
                    </p>
                  </div>
                  <div className="border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center text-slate-600 font-medium">
                        AL
                      </div>
                      <span className="font-medium text-slate-900">Alice Johnson</span>
                    </div>
                    <p className="text-slate-600">
                      I use this tool every day for my development projects. It's fast, reliable, and easy to use.
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center text-slate-600 font-medium">
                        RM
                      </div>
                      <span className="font-medium text-slate-900">Robert Miller</span>
                    </div>
                    <p className="text-slate-600">
                      The code examples are very helpful. I learned a lot about best practices from using this tool.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Power Tools Suite */}
        <div className="max-w-7xl mx-auto px-6 mt-12 mb-12">
          <PowerToolsSuite currentSlug={slug} />
        </div>
      </div>
    </div>
  );
}
