'use client';

import React, { useState } from 'react';

interface SolutionShowcaseProps {
  howToSolve: string;
  variant: 'A' | 'B' | 'C';
  persona: string;
  technicalHurdle: string;
}

export function SolutionShowcase({ howToSolve, variant, persona, technicalHurdle }: SolutionShowcaseProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: 'UI Disguise',
      description: 'Transforms gaming interface into familiar work applications',
      image: 'https://randomuser.me/api/portraits/lego/2.jpg'
    },
    {
      title: 'Activity Simulation',
      description: 'Mimics natural mouse movements and keyboard activity',
      image: 'https://randomuser.me/api/portraits/lego/3.jpg'
    },
    {
      title: 'Network Cloaking',
      description: 'Disguises gaming traffic as regular work activity',
      image: 'https://randomuser.me/api/portraits/lego/4.jpg'
    }
  ];

  if (variant === 'A') {
    return (
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">The Solution</h2>
            <div className="w-20 h-1 bg-red-600 mx-auto"></div>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-lg">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {slides.map((slide, index) => (
                  <div key={index} className="w-full flex-shrink-0">
                    <div className="grid md:grid-cols-2 gap-8 p-8 bg-white border border-gray-200 rounded-lg">
                      <div className="flex items-center">
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-4">{slide.title}</h3>
                          <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                            {slide.description}
                          </p>
                          <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                            {howToSolve}
                          </p>
                          <div className="inline-block bg-red-600 px-6 py-3 rounded-md text-sm font-semibold text-white">
                            Learn More
                          </div>
                        </div>
                      </div>
                      <div className="bg-gray-100 h-80 rounded-lg flex items-center justify-center">
                        <img src={slide.image} alt={slide.title} className="max-h-full max-w-full object-contain" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-center mt-8 space-x-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full ${currentSlide === index ? 'bg-red-600' : 'bg-gray-300'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (variant === 'B') {
    return (
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <div className="w-20 h-1 bg-red-600 mx-auto"></div>
          </div>

          <div className="space-y-12">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="md:w-1/3">
                <div className="bg-red-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold">
                  01
                </div>
              </div>
              <div className="md:w-2/3">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Setup & Configuration</h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Install StealthPlay and configure your preferred UI skin (Excel, VS Code, Outlook, etc.) based on your work environment.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="md:w-1/3">
                <div className="bg-red-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold">
                  02
                </div>
              </div>
              <div className="md:w-2/3">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Activity Simulation</h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  StealthPlay automatically simulates natural mouse movements and keyboard activity to keep your status active and avoid suspicion.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="md:w-1/3">
                <div className="bg-red-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold">
                  03
                </div>
              </div>
              <div className="md:w-2/3">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Gaming Session</h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  {howToSolve}
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="md:w-1/3">
                <div className="bg-red-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold">
                  04
                </div>
              </div>
              <div className="md:w-2/3">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Boss Key</h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Instantly switch from gaming to a work-appropriate screen with a simple keyboard shortcut.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (variant === 'C') {
    return (
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">StealthPlay vs. Traditional Methods</h2>
            <div className="w-20 h-1 bg-red-600 mx-auto"></div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-200 p-4 text-left font-bold text-gray-900">Feature</th>
                  <th className="border border-gray-200 p-4 text-left font-bold text-gray-900">StealthPlay</th>
                  <th className="border border-gray-200 p-4 text-left font-bold text-gray-900">Traditional Methods</th>
                </tr>
              </thead>
              <tbody>
                <tr className="hover:bg-gray-50">
                  <td className="border border-gray-200 p-4 font-medium text-gray-900">UI Disguise</td>
                  <td className="border border-gray-200 p-4 text-green-600 font-medium">Realistic work application skins</td>
                  <td className="border border-gray-200 p-4 text-red-600 font-medium">Obvious window hiding</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="border border-gray-200 p-4 font-medium text-gray-900">Activity Simulation</td>
                  <td className="border border-gray-200 p-4 text-green-600 font-medium">AI-powered natural movements</td>
                  <td className="border border-gray-200 p-4 text-red-600 font-medium">Repetitive mouse jiggling</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="border border-gray-200 p-4 font-medium text-gray-900">Network Traffic</td>
                  <td className="border border-gray-200 p-4 text-green-600 font-medium">Cloaked as work traffic</td>
                  <td className="border border-gray-200 p-4 text-red-600 font-medium">Obvious gaming protocols</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="border border-gray-200 p-4 font-medium text-gray-900">Detection Risk</td>
                  <td className="border border-gray-200 p-4 text-green-600 font-medium">Very Low</td>
                  <td className="border border-gray-200 p-4 text-red-600 font-medium">High</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="border border-gray-200 p-4 font-medium text-gray-900">{technicalHurdle}</td>
                  <td className="border border-gray-200 p-4 text-green-600 font-medium">Bypassed</td>
                  <td className="border border-gray-200 p-4 text-red-600 font-medium">Blocked</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-12 bg-white border border-gray-200 rounded-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Why StealthPlay?</h3>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              {howToSolve}
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              Designed specifically for {persona}s, StealthPlay provides the perfect balance of entertainment and productivity, allowing you to enjoy gaming breaks without compromising your professional image.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return null;
}
