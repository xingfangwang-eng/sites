'use client';

import React, { useState } from 'react';

interface FAQAccordionProps {
  slug: string;
  title: string;
  persona: string;
  industryContext: string;
}

interface FAQItem {
  question: string;
  answer: string;
}

export function FAQAccordion({ slug, title, persona, industryContext }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // 生成针对不同关键词的常见问题
  const generateFAQs = (): FAQItem[] => {
    const baseFAQs: FAQItem[] = [
      {
        question: 'Is StealthPlay detectable by IT departments?',
        answer: 'StealthPlay is designed to be undetectable by standard IT monitoring tools. It runs entirely in the browser, leaves no local footprint, and disguises network traffic as regular business activity.'
      },
      {
        question: 'Do I need administrative privileges to use StealthPlay?',
        answer: 'No, StealthPlay is a browser-based solution that requires no installation or administrative privileges. It works on any modern web browser.'
      },
      {
        question: 'How does StealthPlay handle different work environments?',
        answer: 'StealthPlay offers multiple UI skins (Excel, VS Code, Outlook, etc.) to match different work environments. It also adapts to different network configurations to bypass restrictions.'
      },
      {
        question: 'Is StealthPlay legal to use at work?',
        answer: 'StealthPlay is designed to be used responsibly during breaks or downtime. It is the user\'s responsibility to ensure they are complying with their company\'s acceptable use policies.'
      },
      {
        question: 'What games can I play with StealthPlay?',
        answer: 'StealthPlay supports a wide range of cloud gaming platforms, including Xbox Cloud Gaming, GeForce Now, and Steam Cloud Play. You can play most AAA games as long as they are available on these platforms.'
      },
      {
        question: 'How does StealthPlay affect my computer\'s performance?',
        answer: 'StealthPlay has minimal impact on your computer\'s performance since the games are streamed from the cloud. The only resource usage is for the browser and the streaming client.'
      }
    ];

    // 根据关键词和用户画像添加特定问题
    if (slug.includes('teams') || slug.includes('status')) {
      baseFAQs.push({
        question: 'How does StealthPlay keep my Microsoft Teams status active?',
        answer: 'StealthPlay sends periodic activity signals to Microsoft Teams and other collaboration tools to keep your status as "Available" even when you\'re gaming.'
      });
    }

    if (slug.includes('excel')) {
      baseFAQs.push({
        question: 'How realistic is the Excel skin?',
        answer: 'The Excel skin is highly realistic, featuring a complete spreadsheet interface with cells, formulas, and formatting options. It\'s designed to be indistinguishable from a real Excel window.'
      });
    }

    if (slug.includes('code') || slug.includes('vscode')) {
      baseFAQs.push({
        question: 'Can I use the VS Code skin for actual coding?',
        answer: 'While the VS Code skin is primarily designed for gaming, it includes realistic code syntax highlighting and editor features that make it look like you\'re actively coding.'
      });
    }

    if (slug.includes('email') || slug.includes('outlook')) {
      baseFAQs.push({
        question: 'Does the Outlook skin include a functional email interface?',
        answer: 'Yes, the Outlook skin includes a realistic email interface with a inbox, message preview, and folder structure. It looks just like the real Outlook application.'
      });
    }

    if (slug.includes('remote') || slug.includes('wfh')) {
      baseFAQs.push({
        question: 'Is StealthPlay suitable for remote work environments?',
        answer: 'Absolutely! StealthPlay is ideal for remote work environments where you may have more flexibility but still need to appear productive.'
      });
    }

    if (slug.includes('office') || slug.includes('cubicle')) {
      baseFAQs.push({
        question: 'How effective is StealthPlay in an open office environment?',
        answer: 'StealthPlay\'s UI skins are designed to look like regular work applications, making them perfect for open office environments where coworkers may be able to see your screen.'
      });
    }

    // 使用基于 slug 的种子生成一致的随机排序
    const seed = slug.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const shuffledFAQs = [...baseFAQs].sort((a, b) => {
      const hashA = a.question.split('').reduce((acc, char) => acc + char.charCodeAt(0), seed);
      const hashB = b.question.split('').reduce((acc, char) => acc + char.charCodeAt(0), seed);
      return hashA - hashB;
    });
    return shuffledFAQs.slice(0, 3);
  };

  const faqs = generateFAQs();

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          <div className="w-20 h-1 bg-red-600 mx-auto"></div>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                className="w-full flex justify-between items-center p-6 text-left bg-white hover:bg-gray-50 transition-colors"
                onClick={() => toggleFAQ(index)}
              >
                <h3 className="text-lg font-bold text-gray-900">{faq.question}</h3>
                <div className={`transition-transform duration-300 ${openIndex === index ? 'transform rotate-180' : ''}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              {openIndex === index && (
                <div className="p-6 bg-gray-50 border-t border-gray-200">
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 bg-gray-100 border border-gray-200 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Still have questions?</h3>
          <p className="text-gray-600 mb-6">
            Contact our support team for personalized assistance tailored to your {industryContext} environment.
          </p>
          <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-md font-semibold transition-colors">
            Contact Support
          </button>
        </div>
      </div>
    </section>
  );
}
