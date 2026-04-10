"use client";

import { useEffect, useState } from 'react';

interface Site {
  name: string;
  url: string;
}

export default function Footer() {
  const [sites, setSites] = useState<Site[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSites = async () => {
      try {
        const response = await fetch('/sites.json');
        if (!response.ok) {
          throw new Error('Failed to fetch sites');
        }
        const data = await response.json();
        // 随机挑选 5 个站点
        const shuffled = [...data].sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 5);
        setSites(selected);
      } catch (error) {
        console.error('Error fetching sites:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSites();
  }, []);

  if (isLoading) {
    return null;
  }

  return (
    <footer className="py-6 border-t border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-center items-center gap-4 text-sm text-gray-500 mb-4">
          {sites.map((site, index) => (
            <a
              key={index}
              href={site.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-700 transition-colors"
            >
              {site.name}
            </a>
          ))}
        </div>
        <div className="flex justify-center text-sm text-gray-500">
          Support: 457239850@qq.com
        </div>
      </div>
    </footer>
  );
}
