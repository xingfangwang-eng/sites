'use client';

import { useState, useEffect } from 'react';
import { calculateAvgRate, predictCompletionDate, mockData, ProgressRecord } from '@/lib/PredictionEngine';
import { useXScanner } from '@/lib/hooks';

// List of wangdadi.xyz subdomain sites
const siteLinks = [
  'https://noseotop.vercel.app/',
  'https://nukeprivacy.wangdadi.xyz',
  'https://killbillcard.wangdadi.xyz/',
  'https://zerocloud.wangdadi.xyz',
  'https://focusinbox-eight.wangdadi.xyz',
  'https://saaskiller.wangdadi.xyz',
  'https://noaimd.wangdadi.xyz',
  'https://crosspostfast.wangdadi.xyz',
  'https://killswitchapi.wangdadi.xyz',
  'https://pingthemio.wangdadi.xyz',
  'https://neveruploadio.wangdadi.xyz/',
  'https://cleancsvai.wangdadi.xyz',
  'https://saasstripper.wangdadi.xyz',
  'https://noadobe.wangdadi.xyz',
  'https://navslayer.wangdadi.xyz',
  'https://killsaas.wangdadi.xyz',
  'https://slimsnd.wangdadi.xyz',
  'https://boothell.wangdadi.xyz',
  'https://linguisticdnaextractor.wangdadi.xyz/',
  'https://humbled.wangdadi.xyz/',
  'https://stopsaas.wangdadi.xyz/',
  'https://oneclickapi.wangdadi.xyz/',
  'https://stopaicost.wangdadi.xyz/',
  'https://smesurvivalai.wangdadi.xyz/',
  'https://onecommand.wangdadi.xyz/',
  'https://killsubscription.wangdadi.xyz/',
  'https://manualslib.wangdadi.xyz/',
  'https://billripper.wangdadi.xyz/',
  'https://deadliner.wangdadi.xyz/',
  'https://zerosub.wangdadi.xyz/',
  'https://mockupnuke.wangdadi.xyz/',
  'https://scriptkill.wangdadi.xyz/',
  'https://viralhook.wangdadi.xyz/',
  'https://onepagesaas.wangdadi.xyz/',
  'https://cineskin.wangdadi.xyz/',
  'https://office-sync.wangdadi.xyz/',
  'https://brainbridge.wangdadi.xyz/',
  'https://personalock.wangdadi.xyz/',
  'https://neverexplain.wangdadi.xyz/',
  'https://capsule-factory-saas.wangdadi.xyz'
];

// Helper function to get random 5 sites
function getRandomSites(): string[] {
  const shuffled = [...siteLinks].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 5);
}

// Helper function to parse tweet content
function parseTweetContent(content: string): string {
  if (content.includes('Manuscript Complete')) {
    return 'Analysis: Progress +1 chapter';
  } else if (content.includes('Character Inking')) {
    return 'Analysis: Illustration drawing';
  } else {
    return 'Analysis: Other activity';
  }
}

// Helper function to generate access token
function generateAccessToken(): string {
  return btoa(Date.now().toString() + Math.random().toString(36).substr(2));
}

// Helper function to check if user is premium
type PayPalNamespace = {
  Buttons: (options: any) => {
    render: (selector: string) => void;
  };
};

declare global {
  interface Window {
    paypal?: PayPalNamespace;
  }
}

export default function Home() {
  const [isPremium, setIsPremium] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [combinedData, setCombinedData] = useState<ProgressRecord[]>(mockData);
  const [randomSites, setRandomSites] = useState<string[]>([]);
  
  // Use X Scanner hook for real-time updates
  const { latestTweets, isScanning, lastScanTime, scanX } = useXScanner();
  
  // Get random sites on component mount
  useEffect(() => {
    setRandomSites(getRandomSites());
  }, []);
  
  // Combine mock data with latest tweets
  useEffect(() => {
    if (latestTweets.length > 0) {
      // Merge and deduplicate records based on tweetId
      const mergedData = [...mockData, ...latestTweets];
      const uniqueData = Array.from(
        new Map(mergedData.map(record => [record.tweetId, record])).values()
      );
      // Sort by date descending
      uniqueData.sort((a, b) => b.date.getTime() - a.date.getTime());
      setCombinedData(uniqueData);
    }
  }, [latestTweets]);
  
  const avgRate = calculateAvgRate(combinedData);
  const predictedDateActive = predictCompletionDate(combinedData, true);
  const predictedDateInactive = predictCompletionDate(combinedData, false);
  const latestRecord = combinedData.sort((a, b) => b.date.getTime() - a.date.getTime())[0];
  
  // Calculate progress percentage for current chapter
  const progressPercentage = 75; // Example value for Character Inking Stage
  
  // Check localStorage for access token on component mount
  useEffect(() => {
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
      setIsPremium(true);
    }
  }, []);
  
  // Initialize PayPal SDK
  useEffect(() => {
    if (!isPremium) {
      // Add PayPal SDK script
      const script = document.createElement('script');
      script.src = 'https://www.paypal.com/sdk/js?client-id=AY-XjoUPHJWDAN9AbqcmHZpe2utMwuoys6f2_S4LBxG3genZkRD-9b2AliBmpjAE_TtukODQHP2OBlg6&currency=USD';
      script.async = true;
      script.onload = () => {
        if (window.paypal) {
          window.paypal.Buttons({
            createOrder: (data: any, actions: any) => {
              return actions.order.create({
                purchase_units: [{
                  amount: {
                    value: '1.99'
                  }
                }]
              });
            },
            onApprove: (data: any, actions: any) => {
              return actions.order.capture().then((details: any) => {
                handlePaymentSuccess();
              });
            }
          }).render('#paypal-button-container');
        }
      };
      document.body.appendChild(script);
      
      return () => {
        document.body.removeChild(script);
      };
    }
  }, [isPremium]);
  
  // Handle PayPal payment success
  const handlePaymentSuccess = () => {
    const accessToken = generateAccessToken();
    localStorage.setItem('access_token', accessToken);
    setIsPremium(true);
    setShowThankYou(true);
    
    // Hide thank you message after 3 seconds
    setTimeout(() => {
      setShowThankYou(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-mono">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-4 py-3">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-lg sm:text-xl font-bold text-green-400">Nen Ability Monitoring Station</h1>
          <div className="text-xs sm:text-sm text-gray-400">
            {new Date().toLocaleString()}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 sm:py-8">
        {/* Top Status Bar */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2">
            <h2 className="text-base sm:text-lg font-semibold mb-2 sm:mb-0">Current Progress: Chapter {latestRecord?.chapter || 0} (Character Inking Stage)</h2>
            <div className="flex items-center space-x-2">
              <span className={`text-sm ${isScanning ? 'text-yellow-400' : 'text-green-400'}`}>
                {isScanning ? 'SCANNING...' : 'SYSTEM ONLINE'}
              </span>
              {lastScanTime && (
                <span className="text-xs text-gray-500">
                  Last scan: {lastScanTime.toLocaleTimeString()}
                </span>
              )}
            </div>
          </div>
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-green-500 via-yellow-400 to-yellow-300 shadow-lg shadow-yellow-500/50 animate-pulse"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Core Prediction Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-10 relative">
          {/* Left: Expected Return Window */}
          <div className={`bg-gray-800 border border-gray-700 rounded-lg p-4 sm:p-6 shadow-lg ${!isPremium ? 'blur-md' : ''}`}>
            <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-cyan-400">Expected Return Window</h2>
            <div className="text-xl sm:text-2xl font-bold text-white mb-2">
              {predictedDateInactive.toLocaleDateString()} - {predictedDateActive.toLocaleDateString()}
            </div>
            <div className="text-xs sm:text-sm text-gray-400">
              Based on recent average rate of {avgRate.toFixed(2)} days/chapter
            </div>
          </div>

          {/* Right: Current Activity Coefficient */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 sm:p-6 shadow-lg">
            <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-cyan-400">Current Activity Coefficient</h2>
            <div className="flex flex-col items-center">
              <div className="relative w-24 sm:w-32 h-24 sm:h-32 mb-3 sm:mb-4">
                <div className="absolute inset-0 rounded-full border-6 sm:border-8 border-gray-700"></div>
                <div 
                  className="absolute inset-0 rounded-full border-6 sm:border-8 border-t-green-500 border-r-green-500 border-b-gray-700 border-l-gray-700 transform rotate-45"
                ></div>
                <div className="absolute inset-0 flex items-center justify-center text-2xl sm:text-3xl font-bold text-green-400">
                  1.0
                </div>
              </div>
              <span className="text-green-400 font-semibold">Active</span>
            </div>
          </div>

          {/* Payment Card for non-premium users */}
          {!isPremium && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-gray-800 border border-gray-600 rounded-lg p-6 shadow-xl max-w-md w-full z-10">
                <h3 className="text-xl font-bold text-white mb-4">Unlock the Most Accurate Return Prediction</h3>
                <p className="text-gray-400 mb-6">One-time payment of $1.99 to permanently unlock all prediction features</p>
                <div className="mb-6">
                  <div id="paypal-button-container"></div>
                </div>
                <p className="text-xs text-gray-500 text-center">
                  After payment, all features will be automatically unlocked and access will be stored locally
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Future 10 Chapters Progress Table */}
        <div className={`bg-gray-800 border border-gray-700 rounded-lg p-4 sm:p-6 shadow-lg mb-8 sm:mb-10 ${!isPremium ? 'blur-md' : ''}`}>
          <h2 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6 text-cyan-400">Detailed Progress for Next 10 Chapters</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-2 px-3">Chapter</th>
                  <th className="text-left py-2 px-3">Estimated Completion Date</th>
                  <th className="text-left py-2 px-3">Estimated Stage</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 10 }, (_, index) => {
                  const chapter = (latestRecord?.chapter || 0) + index + 1;
                  const estimatedDate = new Date();
                  estimatedDate.setDate(estimatedDate.getDate() + Math.ceil((index + 1) * avgRate));
                  const stages = ['Manuscript Complete', 'Character Inking Complete', 'Background Drawing', 'Inking Complete', 'Coloring Complete'];
                  const stage = stages[index % stages.length];
                  return (
                    <tr key={index} className="border-b border-gray-700">
                      <td className="py-2 px-3">Chapter {chapter}</td>
                      <td className="py-2 px-3">{estimatedDate.toLocaleDateString()}</td>
                      <td className="py-2 px-3">{stage}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* History Timeline */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 sm:p-6 shadow-lg">
          <h2 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6 text-cyan-400">History Timeline</h2>
          <div className="space-y-4 sm:space-y-6">
            {combinedData
              .sort((a, b) => b.date.getTime() - a.date.getTime())
              .map((record, index) => (
                <div key={index} className="flex">
                  <div className="flex flex-col items-center mr-3 sm:mr-4">
                    <div className="w-2 sm:w-3 h-2 sm:h-3 rounded-full bg-cyan-500"></div>
                    {index < combinedData.length - 1 && (
                      <div className="w-0.5 h-full bg-gray-600"></div>
                    )}
                  </div>
                  <div className="flex-1 bg-gray-700/50 rounded-lg p-3 sm:p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-white">Chapter {record.chapter}</h3>
                      <a 
                        href={`https://x.com/status/${record.tweetId}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-400 text-xs sm:text-sm hover:underline"
                      >
                        View Original Post
                      </a>
                    </div>
                    <p className="text-gray-400 text-xs sm:text-sm mb-2">
                      {record.date.toLocaleDateString()} - {record.stage}
                    </p>
                    <p className="text-yellow-400 text-xs sm:text-sm font-semibold">
                      {parseTweetContent(record.stage)}
                    </p>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      </main>

      {/* Thank You Message */}
      {showThankYou && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
          <div className="bg-gray-800 border border-green-500 rounded-lg p-6 shadow-xl max-w-md w-full text-center">
            <div className="text-4xl mb-4">🎉</div>
            <h3 className="text-xl font-bold text-green-400 mb-2">Payment Successful!</h3>
            <p className="text-gray-400 mb-6">Thank you for your support, all prediction features have been unlocked!</p>
            <p className="text-sm text-gray-500">
              Your access has been stored locally and will remain unlocked on your next visit
            </p>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700 px-4 py-3 mt-8 sm:mt-10">
        <div className="container mx-auto text-center text-xs sm:text-sm text-gray-500">
          Nen Ability Monitoring System v1.0 | Data updated at {new Date().toLocaleString()}
        </div>
        
        {/* Support Email */}
        <div className="container mx-auto mt-2 text-center">
          <span className="text-xs text-gray-600">Support: </span>
          <a 
            href="mailto:457239850@qq.com" 
            className="text-xs text-cyan-600 hover:text-cyan-400 transition-colors duration-200"
          >
            457239850@qq.com
          </a>
        </div>
        
        {/* Random Site Links */}
        <div className="container mx-auto mt-4 pt-4 border-t border-gray-700">
          <h4 className="text-xs text-gray-600 text-center mb-3">Discover More Tools</h4>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            {randomSites.map((site, index) => {
              const domain = new URL(site).hostname.replace('www.', '');
              return (
                <a
                  key={index}
                  href={site}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-cyan-600 hover:text-cyan-400 transition-colors duration-200 px-2 py-1 bg-gray-800/50 rounded border border-gray-700 hover:border-cyan-600/50"
                >
                  {domain}
                </a>
              );
            })}
          </div>
        </div>
      </footer>
    </div>
  );
}
