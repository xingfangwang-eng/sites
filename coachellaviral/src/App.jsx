import { useState, useEffect, useRef } from 'react';
import { calculateViralIndex as calculateViralIndexUtil, formatNumber, getRating, runMonteCarloSimulation as runMonteCarloSimulationUtil } from './utils/math';
import { generateSetlistSuggestions } from './utils/setlist';
import { generateTweetTemplates as generateTweetTemplatesUtil } from './utils/tweet';

function App() {
  const [performanceDuration, setPerformanceDuration] = useState(0);
  const [energyScore, setEnergyScore] = useState(5);
  const [fanBaseSize, setFanBaseSize] = useState(0);
  const [setlistLength, setSetlistLength] = useState(0);
  const [viralIndex, setViralIndex] = useState(null);
  const [formattedIndex, setFormattedIndex] = useState('');
  const [rating, setRating] = useState('');
  const [simulationResult, setSimulationResult] = useState(null);
  const [setlistSuggestions, setSetlistSuggestions] = useState(null);
  const [tweetTemplates, setTweetTemplates] = useState(null);
  const [paid, setPaid] = useState(false);
  const [showPayPal, setShowPayPal] = useState(false);
  const [currentCallback, setCurrentCallback] = useState(null);
  const [simulationData, setSimulationData] = useState([]);
  const [isCalculating, setIsCalculating] = useState(false);
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [artistName, setArtistName] = useState('');
  const [resultCard, setResultCard] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [darkMode, setDarkMode] = useState(true);
  const [sites, setSites] = useState([]);
  const [randomSites, setRandomSites] = useState([]);
  const cardRef = useRef(null);

  // Check if user has paid
  useEffect(() => {
    const hasPaid = localStorage.getItem('coachellaViralPaid');
    if (hasPaid === 'true') {
      setPaid(true);
    }
    
    // Load leaderboard data
    const savedLeaderboard = localStorage.getItem('coachellaViralLeaderboard');
    if (savedLeaderboard) {
      setLeaderboard(JSON.parse(savedLeaderboard));
    }
    
    // Load theme mode
    const savedDarkMode = localStorage.getItem('coachellaViralDarkMode');
    if (savedDarkMode !== null) {
      setDarkMode(savedDarkMode === 'true');
    }
  }, []);

  // Handle payment success
  const handlePaymentSuccess = () => {
    setPaid(true);
    localStorage.setItem('coachellaViralPaid', 'true');
    setShowPayPal(false);
    // Execute stored callback function after payment success, pass skipPaymentCheck parameter
    if (currentCallback && typeof currentCallback === 'function') {
      currentCallback(true); // Pass skipPaymentCheck = true
      setCurrentCallback(null); // Clear callback function
    }
  };

  // Reset payment status (for testing purposes)
  const resetPaymentStatus = () => {
    setPaid(false);
    localStorage.removeItem('coachellaViralPaid');
    alert('Payment status reset. You will now see the payment modal.');
  };

  // Calculate viral index
  const handleCalculateViralIndex = (skipPaymentCheck = false) => {
    // Analytics event tracking
    if (window.gtag) {
      // Google Analytics
      window.gtag('event', 'generate_prediction', {
        'event_category': 'user_action',
        'event_label': 'calculate_viral_index'
      });
    } else if (window.umami) {
      // Umami
      window.umami('generate_prediction', {
        'action': 'calculate_viral_index'
      });
    }
    
    console.log('Calculating Viral Index');
    console.log('Paid status:', paid);
    console.log('Fan base size:', fanBaseSize);
    console.log('Skip payment check:', skipPaymentCheck);
    
    if (!skipPaymentCheck && !paid) {
      console.log('User not paid, showing PayPal modal');
      setCurrentCallback(handleCalculateViralIndex);
      setShowPayPal(true);
      return;
    }

    if (fanBaseSize === 0) {
      console.log('Fan base size is 0, setting result to 0');
      setViralIndex(0);
      setFormattedIndex('0');
      setRating('Standard');
      return;
    }

    const V = calculateViralIndexUtil(fanBaseSize, energyScore, performanceDuration);
    console.log('Viral index result:', V);
    setViralIndex(V);
    setFormattedIndex(formatNumber(V));
    setRating(getRating(V));
    
    // Update leaderboard
    if (artistName) {
      const newEntry = {
        artist: artistName,
        viralIndex: V,
        formattedIndex: formatNumber(V),
        rating: getRating(V),
        timestamp: new Date().toISOString()
      };
      
      const updatedLeaderboard = [newEntry, ...leaderboard]
        .sort((a, b) => b.viralIndex - a.viralIndex)
        .slice(0, 10); // Keep only top 10
      
      setLeaderboard(updatedLeaderboard);
      localStorage.setItem('coachellaViralLeaderboard', JSON.stringify(updatedLeaderboard));
    }
  };

  // Monte Carlo simulation algorithm
  const handleRunMonteCarloSimulation = (skipPaymentCheck = false) => {
    console.log('Running Monte Carlo Simulation');
    console.log('Paid status:', paid);
    console.log('Fan base size:', fanBaseSize);
    console.log('Skip payment check:', skipPaymentCheck);
    
    if (!skipPaymentCheck && !paid) {
      console.log('User not paid, showing PayPal modal');
      setCurrentCallback(handleRunMonteCarloSimulation);
      setShowPayPal(true);
      return;
    }

    setIsCalculating(true);

    const { min, max, data } = runMonteCarloSimulationUtil(fanBaseSize);

    console.log('Simulation result:', { min, max });
    setSimulationResult({ min, max });
    setSimulationData(data);
    setIsCalculating(false);
  };

  // Simulate different setlist order effects on exposure
  const handleGenerateSetlistSuggestions = (skipPaymentCheck = false) => {
    console.log('Calculating Setlist Suggestions');
    console.log('Paid status:', paid);
    console.log('Setlist length:', setlistLength);
    console.log('Skip payment check:', skipPaymentCheck);
    
    if (!skipPaymentCheck && !paid) {
      console.log('User not paid, showing PayPal modal');
      setCurrentCallback(handleGenerateSetlistSuggestions);
      setShowPayPal(true);
      return;
    }

    const suggestions = generateSetlistSuggestions(setlistLength);

    console.log('Setlist suggestions:', suggestions);
    setSetlistSuggestions(suggestions);
  };

  // Generate tweet templates
  const handleGenerateTweetTemplates = (skipPaymentCheck = false) => {
    console.log('Generating Tweet Templates');
    console.log('Paid status:', paid);
    console.log('Viral index:', viralIndex);
    console.log('Skip payment check:', skipPaymentCheck);
    
    if (!skipPaymentCheck && !paid) {
      console.log('User not paid, showing PayPal modal');
      setCurrentCallback(handleGenerateTweetTemplates);
      setShowPayPal(true);
      return;
    }

    const templates = generateTweetTemplatesUtil(viralIndex, formattedIndex, rating, simulationResult);

    console.log('Tweet templates:', templates);
    setTweetTemplates(templates);
  };

  // Dynamically update Meta Tags
  const updateMetaTags = () => {
    if (viralIndex !== null) {
      const ogTitle = document.getElementById('og-title');
      const ogDescription = document.getElementById('og-description');
      
      if (ogTitle && ogDescription) {
        let predictionText = '';
        if (viralIndex >= 1000000) {
          predictionText = 'This set has a 95% chance of breaking the internet!';
        } else if (viralIndex >= 100000) {
          predictionText = 'This set has a 95% chance of going viral!';
        } else {
          predictionText = 'This set has potential to gain traction!';
        }
        
        ogTitle.content = `Coachella Viral - ${predictionText}`;
        ogDescription.content = `Coachella performance prediction: ${predictionText} Viral Index: ${formattedIndex}, Rating: ${rating}`;
      }
    }
  };

  // Update Meta Tags when viral index changes
  useEffect(() => {
    if (viralIndex !== null) {
      updateMetaTags();
    }
  }, [viralIndex]);

  // Generate result card
  const generateResultCard = async () => {
    if (viralIndex !== null && cardRef.current) {
      try {
        // Dynamically import html2canvas
        const html2canvas = await import('html2canvas');
        const canvas = await html2canvas.default(cardRef.current, {
          backgroundColor: '#1a1a2e',
          scale: 2,
          allowTaint: true,
          useCORS: true
        });
        const dataUrl = canvas.toDataURL('image/png');
        setResultCard(dataUrl);
      } catch (error) {
        console.error('Error generating result card:', error);
      }
    }
  };

  // Download result card
  const downloadResultCard = () => {
    if (resultCard) {
      const link = document.createElement('a');
      link.href = resultCard;
      link.download = `coachella-viral-${artistName || 'unknown'}.png`;
      link.click();
    }
  };

  // Share to X/Twitter
  const shareToTwitter = () => {
    if (viralIndex !== null) {
      const likes = simulationResult ? Math.round((simulationResult.min + simulationResult.max) / 2) : 0;
      const url = window.location.href;
      const tweetText = `My #Coachella prediction: ${artistName || 'Artist'} has a ${formattedIndex} viral score! Predicted ${likes} likes. Try it: ${url}`;
      const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
      window.open(twitterUrl, '_blank');
    }
  };

  // Generate result card when viral index changes
  useEffect(() => {
    if (viralIndex !== null) {
      generateResultCard();
    }
  }, [viralIndex, simulationResult, artistName]);

  // Save theme mode to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('coachellaViralDarkMode', darkMode.toString());
  }, [darkMode]);

  // Fetch sites list asynchronously and randomly select 5
  useEffect(() => {
    const fetchSites = async () => {
      try {
        const response = await fetch('/sites.json');
        const data = await response.json();
        setSites(data);
        
        // Randomly select 5 sites
        const shuffled = data.sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 5);
        setRandomSites(selected);
      } catch (error) {
        console.error('Error fetching sites:', error);
      }
    };

    fetchSites();
  }, []);

  // Update chart when simulation data changes
  useEffect(() => {
    const loadChart = async () => {
      if (simulationData.length > 0 && chartRef.current) {
        try {
          // Dynamically import Chart.js and ChartAnnotation
          const Chart = (await import('chart.js/auto')).default;
          const ChartAnnotation = (await import('chartjs-plugin-annotation')).default;
          
          // Destroy old chart
          if (chartInstance.current) {
            chartInstance.current.destroy();
          }

          // Prepare data
          const data = simulationData;
          const ctx = chartRef.current.getContext('2d');

          // Calculate statistics
          const mean = data.reduce((sum, val) => sum + val, 0) / data.length;
          const stdDev = Math.sqrt(data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / data.length);
          
          // Generate histogram data
          const binCount = 20;
          const minVal = Math.min(...data);
          const maxVal = Math.max(...data);
          const binWidth = (maxVal - minVal) / binCount;
          const bins = Array(binCount).fill(0);
          
          data.forEach(val => {
            const binIndex = Math.min(binCount - 1, Math.floor((val - minVal) / binWidth));
            bins[binIndex]++;
          });

          const binLabels = bins.map((_, i) => {
            const start = minVal + i * binWidth;
            const end = start + binWidth;
            return `${Math.round(start)} - ${Math.round(end)}`;
          });

          // Create chart
          chartInstance.current = new Chart(ctx, {
            type: 'bar',
            data: {
              labels: binLabels,
              datasets: [
                {
                  label: 'Engagement Distribution',
                  data: bins,
                  backgroundColor: 'rgba(139, 92, 246, 0.6)',
                  borderColor: 'rgba(139, 92, 246, 1)',
                  borderWidth: 1
                }
              ]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                title: {
                  display: true,
                  text: 'Monte Carlo Simulation Results',
                  color: 'white',
                  font: {
                    size: 16
                  }
                },
                legend: {
                  display: true,
                  labels: {
                    color: 'white'
                  }
                },
                annotation: {
                  annotations: {
                    line1: {
                      type: 'line',
                      yMin: 0,
                      yMax: Math.max(...bins),
                      xMin: simulationResult ? (simulationResult.min - minVal) / (maxVal - minVal) * binCount : 0,
                      xMax: simulationResult ? (simulationResult.min - minVal) / (maxVal - minVal) * binCount : 0,
                      borderColor: 'rgba(255, 99, 132, 1)',
                      borderWidth: 2,
                      label: {
                        content: '95% Confidence Interval',
                        enabled: true,
                        position: 'start'
                      }
                    },
                    line2: {
                      type: 'line',
                      yMin: 0,
                      yMax: Math.max(...bins),
                      xMin: simulationResult ? (simulationResult.max - minVal) / (maxVal - minVal) * binCount : 0,
                      xMax: simulationResult ? (simulationResult.max - minVal) / (maxVal - minVal) * binCount : 0,
                      borderColor: 'rgba(255, 99, 132, 1)',
                      borderWidth: 2
                    }
                  }
                }
              },
              scales: {
                x: {
                  title: {
                    display: true,
                    text: 'Engagement Count',
                    color: 'white'
                  },
                  ticks: {
                    color: 'white'
                  },
                  grid: {
                    color: 'rgba(255, 255, 255, 0.1)'
                  }
                },
                y: {
                  title: {
                    display: true,
                    text: 'Frequency',
                    color: 'white'
                  },
                  ticks: {
                    color: 'white'
                  },
                  grid: {
                    color: 'rgba(255, 255, 255, 0.1)'
                  }
                }
              }
            }
          });
        } catch (error) {
          console.error('Error loading chart:', error);
        }
      }
    };

    loadChart();
  }, [simulationData, simulationResult]);

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-4 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-pink-800 text-white'
        : 'bg-gradient-to-br from-gray-100 via-purple-100 to-pink-100 text-gray-900'
    }`}>
      <div className={`max-w-2xl w-full backdrop-blur-sm rounded-2xl shadow-xl p-8 ${
        darkMode 
          ? 'bg-gray-900/80 border border-purple-500/30'
          : 'bg-white/80 border border-purple-200/30'
      }`}>
        {/* Theme toggle switch */}
        <div className="flex justify-end mb-4 gap-2">
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-full transition-all duration-300 ${
              darkMode 
                ? 'bg-gray-800 hover:bg-gray-700'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
          <button 
            onClick={resetPaymentStatus}
            className={`text-xs px-2 py-1 rounded transition-all duration-300 ${
              darkMode 
                ? 'bg-red-900/30 text-red-400 hover:bg-red-900/50'
                : 'bg-red-100 text-red-600 hover:bg-red-200'
            }`}
          >
            Reset Payment
          </button>
        </div>
        
        {/* Hidden H1 tag for SEO */}
        <h1 className="sr-only">Coachella 2025, Performance Predictor, Viral Calculator, Lineup Analytics</h1>
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center bg-gradient-to-r from-pink-400 via-purple-400 to-pink-500 bg-clip-text text-transparent">
          Coachella Viral
        </h1>
        
        <div className="space-y-6">
          {/* Artist Name */}
          <div className="space-y-2">
            <label className={`block text-sm font-medium ${
              darkMode ? 'text-purple-200' : 'text-purple-700'
            }`}>
              Artist Name
            </label>
            <input
              type="text"
              value={artistName}
              onChange={(e) => setArtistName(e.target.value)}
              className={`w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 ${
                darkMode 
                  ? 'bg-gray-800 border border-purple-500/30 text-white'
                  : 'bg-gray-100 border border-purple-200/30 text-gray-900'
              }`}
              placeholder="Enter artist name"
            />
          </div>

          {/* Performance Duration */}
          <div className="space-y-2">
            <label className={`block text-sm font-medium ${
              darkMode ? 'text-purple-200' : 'text-purple-700'
            }`}>
              Performance Duration
            </label>
            <input
              type="number"
              inputMode="numeric"
              pattern="[0-9]*"
              min="1"
              value={performanceDuration}
              onChange={(e) => setPerformanceDuration(Number(e.target.value))}
              className={`w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 ${
                darkMode 
                  ? 'bg-gray-800 border border-purple-500/30 text-white'
                  : 'bg-gray-100 border border-purple-200/30 text-gray-900'
              }`}
              placeholder="Enter performance duration"
            />
          </div>

          {/* Energy Score */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className={`block text-sm font-medium ${
                darkMode ? 'text-purple-200' : 'text-purple-700'
              }`}>
                Energy Score
              </label>
              <span className="text-sm text-pink-400 font-medium">{energyScore}/10</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={energyScore}
              onChange={(e) => setEnergyScore(Number(e.target.value))}
              className={`w-full h-2 rounded-lg appearance-none cursor-pointer accent-pink-500 ${
                darkMode ? 'bg-gray-800' : 'bg-gray-200'
              }`}
            />
            <div className={`flex justify-between text-xs ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              <span>1</span>
              <span>5</span>
              <span>10</span>
            </div>
          </div>

          {/* Fan Base Size */}
          <div className="space-y-2">
            <label className={`block text-sm font-medium ${
              darkMode ? 'text-purple-200' : 'text-purple-700'
            }`}>
              Fan Base Size
            </label>
            <input
              type="number"
              inputMode="numeric"
              pattern="[0-9]*"
              min="1"
              value={fanBaseSize}
              onChange={(e) => setFanBaseSize(Number(e.target.value))}
              className={`w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 ${
                darkMode 
                  ? 'bg-gray-800 border border-purple-500/30 text-white'
                  : 'bg-gray-100 border border-purple-200/30 text-gray-900'
              }`}
              placeholder="Enter fan base size"
            />
          </div>

          {/* Setlist Length */}
          <div className="space-y-2">
            <label className={`block text-sm font-medium ${
              darkMode ? 'text-purple-200' : 'text-purple-700'
            }`}>
              Setlist Length
            </label>
            <input
              type="number"
              inputMode="numeric"
              pattern="[0-9]*"
              min="3"
              value={setlistLength}
              onChange={(e) => setSetlistLength(Number(e.target.value))}
              className={`w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 ${
                darkMode 
                  ? 'bg-gray-800 border border-purple-500/30 text-white'
                  : 'bg-gray-100 border border-purple-200/30 text-gray-900'
              }`}
              placeholder="Enter number of songs"
            />
          </div>

          {/* PayPal Payment Modal */}
          {showPayPal && (
            <div className={`fixed inset-0 flex items-center justify-center z-50 p-4 ${
              darkMode ? 'bg-black/70' : 'bg-black/50'
            }`}>
              <div className={`rounded-2xl p-8 max-w-md w-full ${
                darkMode 
                  ? 'bg-gray-900 border border-purple-500/30'
                  : 'bg-white border border-purple-200/30'
              }`}>
                <h2 className="text-2xl font-bold mb-4 text-center bg-gradient-to-r from-pink-400 via-purple-400 to-pink-500 bg-clip-text text-transparent">
                  Unlock Premium Features
                </h2>
                <p className={`mb-6 text-center ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Pay $1.99 to access all calculations and predictions
                </p>
                <div className="flex justify-center mb-6">
                  {/* PayPal Smart Payment Button */}
                  <button 
                    onClick={handlePaymentSuccess}
                    className="py-3 px-8 bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg font-medium text-white hover:from-blue-600 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 active:scale-95 active:opacity-80"
                  >
                    Pay with PayPal
                  </button>
                </div>
                <div className="mt-6 flex justify-center">
                  <button 
                    onClick={() => setShowPayPal(false)}
                    className="text-sm text-gray-400 hover:text-white transition-all duration-200 active:scale-95 active:opacity-80"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button 
              onClick={handleCalculateViralIndex}
              className="py-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg font-medium text-white hover:from-pink-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 active:scale-95 active:opacity-80"
            >
              Calculate Viral Potential
            </button>
            <button 
              onClick={handleRunMonteCarloSimulation}
              className="py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg font-medium text-white hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 active:scale-95 active:opacity-80"
            >
              {isCalculating ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Calculating...</span>
                </div>
              ) : (
                "Run Monte Carlo Simulation"
              )}
            </button>
            <button 
              onClick={handleGenerateSetlistSuggestions}
              className="py-3 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg font-medium text-white hover:from-green-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 active:scale-95 active:opacity-80"
            >
              Setlist Suggestions
            </button>
            <button 
              onClick={handleGenerateTweetTemplates}
              className="py-3 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-lg font-medium text-white hover:from-yellow-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 active:scale-95 active:opacity-80"
            >
              Generate Tweet Templates
            </button>
          </div>

          {/* Viral Index Results */}
          {viralIndex !== null && (
            <div className={`mt-8 p-6 rounded-xl border ${
              darkMode 
                ? 'bg-gray-800/60 border-purple-500/30'
                : 'bg-white/60 border-purple-200/30'
            }`}>
              <h2 className={`text-xl font-semibold mb-4 text-center ${
                darkMode ? 'text-purple-300' : 'text-purple-600'
              }`}>Viral Index Results</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Artist:</span>
                  <span className={darkMode ? 'text-lg font-medium text-white' : 'text-lg font-medium text-gray-900'}>{artistName || 'Unknown'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Viral Index:</span>
                  <span className="text-2xl font-bold text-pink-400">{formattedIndex}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Rating:</span>
                  <span className={darkMode ? 'text-lg font-medium text-purple-300' : 'text-lg font-medium text-purple-600'}>{rating}</span>
                </div>
              </div>
            </div>
          )}

          {/* Result Card and Sharing */}
          {viralIndex !== null && (
            <div className={`mt-8 p-6 rounded-xl border ${
              darkMode 
                ? 'bg-gray-800/60 border-blue-500/30'
                : 'bg-white/60 border-blue-200/30'
            }`}>
              <h2 className={`text-xl font-semibold mb-4 text-center ${
                darkMode ? 'text-blue-300' : 'text-blue-600'
              }`}>Share Results</h2>
              
              {/* Result Card Preview */}
              <div className="mb-6">
                <h3 className={`text-sm font-medium mb-2 ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>Result Card Preview:</h3>
                <div 
                  ref={cardRef}
                  className={`rounded-xl p-6 border ${
                    darkMode 
                      ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-pink-800 border-purple-500/30'
                      : 'bg-gradient-to-br from-gray-100 via-purple-100 to-pink-100 border-purple-200/30'
                  }`}
                >
                  <div className="flex flex-col items-center">
                    <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-pink-400 via-purple-400 to-pink-500 bg-clip-text text-transparent">
                      Coachella Viral
                    </h2>
                    <h3 className={`text-xl font-semibold mb-4 ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>{artistName || 'Artist'}</h3>
                    <div className="text-center mb-6">
                      <p className={darkMode ? 'text-sm text-gray-300' : 'text-sm text-gray-600'}>Viral Index</p>
                      <p className="text-3xl font-bold text-pink-400">{formattedIndex}</p>
                      <p className={darkMode ? 'text-lg text-purple-300' : 'text-lg text-purple-600'}>{rating}</p>
                    </div>
                    {/* Energy Score Visualization */}
                    <div className="w-full mb-6">
                      <p className={darkMode ? 'text-sm text-gray-300' : 'text-sm text-gray-600'}>Energy Score</p>
                      <div className={`w-full rounded-full h-2 ${
                        darkMode ? 'bg-gray-800' : 'bg-gray-200'
                      }`}>
                        <div 
                          className="bg-gradient-to-r from-pink-500 to-purple-600 h-2 rounded-full" 
                          style={{ width: `${(energyScore / 10) * 100}%` }}
                        ></div>
                      </div>
                      <div className={`flex justify-between text-xs mt-1 ${
                        darkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        <span>1</span>
                        <span>{energyScore}</span>
                        <span>10</span>
                      </div>
                    </div>
                    {/* QR Code */}
                    <div className={`w-24 h-24 rounded-lg flex items-center justify-center mb-4 ${
                      darkMode ? 'bg-gray-800' : 'bg-gray-200'
                    }`}>
                      <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=128x128&data=https://www.wangdadi.xyz`} 
                        alt="QR Code" 
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <p className={`text-xs ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>wangdadi.xyz</p>
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button 
                  onClick={downloadResultCard}
                  className="py-3 bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg font-medium text-white hover:from-blue-600 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 active:scale-95 active:opacity-80"
                >
                  Download Result Card
                </button>
                <button 
                  onClick={shareToTwitter}
                  className="py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg font-medium text-white hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 active:scale-95 active:opacity-80"
                >
                  Share to X/Twitter
                </button>
              </div>
            </div>
          )}

          {/* Leaderboard */}
          {leaderboard.length > 0 && (
            <div className="mt-8 p-6 bg-gray-800/60 rounded-xl border border-green-500/30">
              <h2 className="text-xl font-semibold mb-4 text-center text-green-300">Leaderboard</h2>
              <div className="space-y-3">
                {leaderboard.map((entry, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-900/80 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className="text-lg font-bold text-yellow-400">{index + 1}</span>
                      <span className="text-white">{entry.artist}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-pink-400">{entry.formattedIndex}</span>
                      <span className="text-sm text-gray-400 block">{entry.rating}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Monte Carlo Simulation Results */}
          {simulationResult !== null && (
            <div className={`mt-8 p-6 rounded-xl border ${
              darkMode 
                ? 'bg-gray-800/60 border-blue-500/30'
                : 'bg-white/60 border-blue-200/30'
            }`}>
              <h2 className={`text-xl font-semibold mb-4 text-center ${
                darkMode ? 'text-blue-300' : 'text-blue-600'
              }`}>Monte Carlo Simulation Results</h2>
              <div className="flex justify-between items-center mb-6">
                <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Expected Engagement:</span>
                <span className="text-2xl font-bold text-blue-400">[{simulationResult.min}] - [{simulationResult.max}]</span>
              </div>
              <div className="h-80">
                <canvas ref={chartRef}></canvas>
              </div>
            </div>
          )}

          {/* Setlist Suggestions */}
          {setlistSuggestions !== null && (
            <div className="mt-8 space-y-6">
              <h2 className={`text-xl font-semibold mb-4 text-center ${
                darkMode ? 'text-green-300' : 'text-green-600'
              }`}>Setlist Suggestions</h2>
              {setlistSuggestions.length > 0 ? (
                setlistSuggestions.map((suggestion, index) => (
                  <div key={index} className={`p-4 rounded-xl border ${
                    darkMode 
                      ? 'bg-gray-800/60 border-green-500/30'
                      : 'bg-white/60 border-green-200/30'
                  }`}>
                    <h3 className={`text-lg font-medium mb-2 ${
                      darkMode ? 'text-green-400' : 'text-green-600'
                    }`}>{suggestion.name}</h3>
                    <p className={`text-sm mb-3 ${
                      darkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>{suggestion.description}</p>
                    <p className={`text-sm ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>{suggestion.structure}</p>
                  </div>
                ))
              ) : (
                <p className={`text-center ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>Please enter at least 3 songs to get suggestions</p>
              )}
            </div>
          )}

          {/* Tweet Templates */}
          {tweetTemplates !== null && (
            <div className="mt-8 space-y-6">
              <h2 className={`text-xl font-semibold mb-4 text-center ${
                darkMode ? 'text-yellow-300' : 'text-yellow-600'
              }`}>Tweet Templates</h2>
              {tweetTemplates.length > 0 ? (
                tweetTemplates.map((template, index) => (
                  <div key={index} className={`p-4 rounded-xl border ${
                    darkMode 
                      ? 'bg-gray-800/60 border-yellow-500/30'
                      : 'bg-white/60 border-yellow-200/30'
                  }`}>
                    <div className="flex justify-between items-start">
                      <h3 className={`text-lg font-medium mb-2 ${
                        darkMode ? 'text-yellow-400' : 'text-yellow-600'
                      }`}>{template.type}</h3>
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(template.content);
                          alert('Tweet copied to clipboard!');
                        }}
                        className={`text-xs px-3 py-1 rounded-full transition-colors ${
                          darkMode 
                            ? 'bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 hover:text-yellow-300'
                            : 'bg-yellow-100 hover:bg-yellow-200 text-yellow-600 hover:text-yellow-700'
                        }`}
                      >
                        Copy Tweet
                      </button>
                    </div>
                    <p className={`text-sm ${
                      darkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>{template.content}</p>
                  </div>
                ))
              ) : (
                <p className={`text-center ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>Please calculate viral index first to generate tweet templates</p>
              )}
            </div>
          )}

          {/* CTA Section */}
          <div className="mt-10 space-y-6">
            {/* Coachella Schedule */}
            <div className={`p-6 rounded-xl border ${
              darkMode 
                ? 'bg-gray-800/60 border-purple-500/30'
                : 'bg-white/60 border-purple-200/30'
            }`}>
              <h2 className={`text-xl font-semibold mb-4 text-center ${
                darkMode ? 'text-purple-300' : 'text-purple-600'
              }`}>Coachella 2026 Schedule</h2>
              <p className={`text-center mb-4 ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>Check out the latest Coachella performance schedule</p>
              <div className="flex justify-center">
                <a 
                  href="#" 
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 active:opacity-80 ${
                    darkMode 
                      ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white'
                      : 'bg-gradient-to-r from-pink-400 to-purple-500 text-white'
                  }`}
                >
                  View Schedule
                </a>
              </div>
            </div>

            {/* Recommended Artists */}
            <div className={`p-6 rounded-xl border ${
              darkMode 
                ? 'bg-gray-800/60 border-blue-500/30'
                : 'bg-white/60 border-blue-200/30'
            }`}>
              <h2 className={`text-xl font-semibold mb-4 text-center ${
                darkMode ? 'text-blue-300' : 'text-blue-600'
              }`}>Recommended Artists</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['Bad Bunny', 'Billie Eilish', 'Taylor Swift', 'The Weeknd'].map((artist, index) => (
                  <div key={index} className={`p-3 rounded-lg text-center ${
                    darkMode 
                      ? 'bg-gray-700/50 hover:bg-gray-700'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}>
                    <p className={`font-medium ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>{artist}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer with Random Sites */}
          <footer className="mt-12 pt-6 border-t ${
            darkMode ? 'border-gray-700' : 'border-gray-200'
          }">
            <div className="flex flex-wrap justify-center items-center gap-4 text-sm ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }">
              <a 
                href="https://www.wangdadi.xyz/" 
                target="_blank" 
                rel="noopener noreferrer"
                className={`hover:underline ${
                  darkMode ? 'hover:text-gray-300' : 'hover:text-gray-600'
                }`}
              >
                home
              </a>
              {randomSites.map((site, index) => (
                <a 
                  key={index} 
                  href={site.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`hover:underline ${
                    darkMode ? 'hover:text-gray-300' : 'hover:text-gray-600'
                  }`}
                >
                  {site.name}
                </a>
              ))}
            </div>
            <div className="mt-4 text-center text-sm ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }">
              <span>Support: 457239850@qq.com</span>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}

export default App;