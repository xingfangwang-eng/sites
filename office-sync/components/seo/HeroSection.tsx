'use client';

import React from 'react';

interface HeroSectionProps {
  title: string;
  problemDescription: string;
  variant: 'A' | 'B' | 'C';
  persona: string;
  tone: string;
}

export function HeroSection({ title, problemDescription, variant, persona, tone }: HeroSectionProps) {
  if (variant === 'A') {
    return (
      <section className="relative bg-cover bg-center h-[600px] flex items-center justify-center" style={{ backgroundImage: 'url(https://randomuser.me/api/portraits/lego/1.jpg)' }}>
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        <div className="relative z-10 text-center px-6 max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter mb-6">
            {title}
          </h1>
          <p className="text-xl text-gray-200 mb-8 leading-relaxed">
            {problemDescription}
          </p>
          <div className="inline-block bg-white px-6 py-3 rounded-md text-sm font-semibold text-gray-900">
            For {persona}
          </div>
        </div>
      </section>
    );
  }

  if (variant === 'B') {
    return (
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tighter mb-6">
              {title}
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              {problemDescription}
            </p>
            <div className="inline-block bg-red-600 px-6 py-3 rounded-md text-sm font-semibold text-white">
              {tone === 'Professional' ? 'Professional Solution' : tone === 'Rebellious' ? 'Break the Rules' : 'Supportive Approach'}
            </div>
          </div>
          <div className="bg-gray-100 h-80 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 bg-gray-300 rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600">{persona} at work</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (variant === 'C') {
    return (
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-6">
            {title}
          </h1>
          <p className="text-xl text-gray-300 mb-12 leading-relaxed">
            {problemDescription}
          </p>
          <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto">
            <div className="bg-gray-800 p-6 rounded-md">
              <div className="text-2xl font-bold mb-2">01</div>
              <p className="text-gray-300 text-sm">Detect</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-md">
              <div className="text-2xl font-bold mb-2">02</div>
              <p className="text-gray-300 text-sm">Disguise</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-md">
              <div className="text-2xl font-bold mb-2">03</div>
              <p className="text-gray-300 text-sm">Deliver</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return null;
}
