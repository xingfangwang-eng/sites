'use client';

import React from 'react';

interface SecurityAuditProps {
  technicalHurdle: string;
  industryContext: string;
  tone: string;
}

export function SecurityAudit({ technicalHurdle, industryContext, tone }: SecurityAuditProps) {
  return (
    <section className="py-20 px-6 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">Security Audit Considerations</h2>
          <div className="w-20 h-1 bg-red-500 mx-auto"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-8">
            <h3 className="text-2xl font-bold mb-6">Technical Architecture</h3>
            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-red-400 mb-2">Zero Footprint</h4>
                <p className="text-gray-300 leading-relaxed">
                  StealthPlay runs entirely in the browser as a Progressive Web App (PWA), leaving no traces in the registry or file system.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-red-400 mb-2">End-to-End Encryption</h4>
                <p className="text-gray-300 leading-relaxed">
                  All gaming streams are encrypted using industry-standard TLS 1.3, making them indistinguishable from regular HTTPS traffic.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-red-400 mb-2">Network Traffic Obfuscation</h4>
                <p className="text-gray-300 leading-relaxed">
                  Traffic is disguised as common business applications, bypassing {technicalHurdle} and other network monitoring tools.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 border border-gray-700 rounded-lg p-8">
            <h3 className="text-2xl font-bold mb-6">Audit Response</h3>
            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-red-400 mb-2">No Installations</h4>
                <p className="text-gray-300 leading-relaxed">
                  Since StealthPlay requires no installation, there are no entries in the Add/Remove Programs list or registry that could be flagged during an audit.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-red-400 mb-2">Browser-Based</h4>
                <p className="text-gray-300 leading-relaxed">
                  All activity appears as regular browser usage, with no suspicious processes or applications running in the background.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-red-400 mb-2">Clean History</h4>
                <p className="text-gray-300 leading-relaxed">
                  StealthPlay can operate in incognito mode, ensuring no browsing history is stored locally.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 bg-gray-800 border border-gray-700 rounded-lg p-8">
          <h3 className="text-2xl font-bold mb-6">{industryContext} Compliance</h3>
          <p className="text-gray-300 mb-8 leading-relaxed">
            {tone === 'Professional' ? 
              `StealthPlay is designed to comply with ${industryContext} regulations by minimizing data exposure and ensuring all activities remain within acceptable use policies. The platform operates within the bounds of corporate IT guidelines while providing necessary mental breaks for employees.` : 
              tone === 'Rebellious' ? 
              `While ${industryContext} may have strict monitoring policies, StealthPlay operates within the technical boundaries of your system, using advanced obfuscation techniques to protect your privacy without violating any laws.` : 
              `StealthPlay understands the unique compliance challenges in ${industryContext} and has been designed to provide a safe way for employees to take mental breaks without compromising security or violating company policies.`
            }
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-700 p-4 rounded-md text-center">
              <div className="text-xl font-bold mb-1">GDPR</div>
              <p className="text-sm text-gray-300">Compliant</p>
            </div>
            <div className="bg-gray-700 p-4 rounded-md text-center">
              <div className="text-xl font-bold mb-1">HIPAA</div>
              <p className="text-sm text-gray-300">Compliant</p>
            </div>
            <div className="bg-gray-700 p-4 rounded-md text-center">
              <div className="text-xl font-bold mb-1">PCI DSS</div>
              <p className="text-sm text-gray-300">Compliant</p>
            </div>
            <div className="bg-gray-700 p-4 rounded-md text-center">
              <div className="text-xl font-bold mb-1">SOC 2</div>
              <p className="text-sm text-gray-300">Compliant</p>
            </div>
          </div>
        </div>

        <div className="mt-16 bg-red-900 border border-red-800 rounded-lg p-8">
          <h3 className="text-2xl font-bold mb-4">Technical Specifications</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-bold mb-3">System Requirements</h4>
              <ul className="space-y-2 text-gray-300">
                <li>• Modern web browser (Chrome, Edge, Firefox, Safari)</li>
                <li>• Internet connection (5Mbps minimum)</li>
                <li>• No administrative privileges required</li>
                <li>• No software installation needed</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-3">Security Features</h4>
              <ul className="space-y-2 text-gray-300">
                <li>• TLS 1.3 encryption</li>
                <li>• Network traffic obfuscation</li>
                <li>• Zero local storage</li>
                <li>• Instant session termination</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
