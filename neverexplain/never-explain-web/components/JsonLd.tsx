"use client";

import { useEffect } from 'react';

interface JsonLdProps {
  type?: 'SoftwareApplication' | 'HowTo' | 'BreadcrumbList';
  data: any;
}

export default function JsonLd({ type, data }: JsonLdProps) {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    
    let jsonLdData = {};
    
    if (type === 'SoftwareApplication') {
      jsonLdData = {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: data.name,
        applicationCategory: data.applicationCategory,
        operatingSystem: data.operatingSystem || 'All',
        url: data.url,
        description: data.description,
        offers: {
          '@type': 'Offer',
          price: data.price || '0',
          priceCurrency: data.priceCurrency || 'USD',
          availability: data.availability || 'https://schema.org/InStock'
        }
      };
    } else if (type === 'HowTo') {
      jsonLdData = {
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        name: data.name,
        description: data.description,
        step: data.steps.map((step: any, index: number) => ({
          '@type': 'HowToStep',
          position: index + 1,
          name: `Step ${index + 1}`,
          text: step
        }))
      };
    } else if (type === 'BreadcrumbList') {
      jsonLdData = data;
    } else {
      jsonLdData = data;
    }
    
    script.textContent = JSON.stringify(jsonLdData);
    document.head.appendChild(script);
    
    return () => {
      document.head.removeChild(script);
    };
  }, [type, data]);
  
  return null;
}
