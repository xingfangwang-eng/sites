'use client';

import React from 'react';

interface ProblemDeepDiveProps {
  problemDescription: string;
  industryContext: string;
  technicalHurdle: string;
  persona: string;
  tone: string;
}

export function ProblemDeepDive({ problemDescription, industryContext, technicalHurdle, persona, tone }: ProblemDeepDiveProps) {
  return (
    <section className="py-20 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">The Problem</h2>
          <div className="w-20 h-1 bg-red-600 mx-auto"></div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-8 mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">{persona} in {industryContext}</h3>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            {problemDescription}
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gray-100 p-6 rounded-md">
              <h4 className="font-bold text-gray-900 mb-3">Monitoring Tools</h4>
              <p className="text-gray-600">Advanced surveillance software tracks every mouse click, keystroke, and application used.</p>
            </div>
            <div className="bg-gray-100 p-6 rounded-md">
              <h4 className="font-bold text-gray-900 mb-3">Technical Barriers</h4>
              <p className="text-gray-600">{technicalHurdle} prevent access to gaming platforms and create additional security layers.</p>
            </div>
            <div className="bg-gray-100 p-6 rounded-md">
              <h4 className="font-bold text-gray-900 mb-3">Productivity Pressure</h4>
              <p className="text-gray-600">Constant pressure to maintain high productivity metrics leaves no time for mental breaks.</p>
            </div>
          </div>
        </div>

        <div className="bg-red-600 text-white p-8 rounded-lg">
          <h3 className="text-2xl font-bold mb-4">The Impact</h3>
          <p className="text-lg mb-6 leading-relaxed">
            {tone === 'Professional' ? 
              'These monitoring systems create a stressful work environment that can lead to burnout and decreased job satisfaction.' : 
              tone === 'Rebellious' ? 
              'These invasive monitoring systems are a violation of privacy and create an oppressive work environment.' : 
              'These monitoring systems can make employees feel constantly watched, leading to anxiety and reduced creativity.'
            }
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-red-700 p-4 rounded-md text-center">
              <div className="text-2xl font-bold mb-1">68%</div>
              <p className="text-sm">Experience burnout</p>
            </div>
            <div className="bg-red-700 p-4 rounded-md text-center">
              <div className="text-2xl font-bold mb-1">82%</div>
              <p className="text-sm">Feel constantly monitored</p>
            </div>
            <div className="bg-red-700 p-4 rounded-md text-center">
              <div className="text-2xl font-bold mb-1">54%</div>
              <p className="text-sm">Hide browsing activity</p>
            </div>
            <div className="bg-red-700 p-4 rounded-md text-center">
              <div className="text-2xl font-bold mb-1">76%</div>
              <p className="text-sm">Want more privacy</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
