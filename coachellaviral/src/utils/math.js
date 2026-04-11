// Math utilities for Coachella Viral

/**
 * Calculate viral index based on fan base size, energy score, and performance duration
 * @param {number} fanBaseSize - Fan base size
 * @param {number} energyScore - Energy score (1-10)
 * @param {number} performanceDuration - Performance duration in minutes
 * @returns {number} Viral index
 */
export const calculateViralIndex = (fanBaseSize, energyScore, performanceDuration) => {
  // Add overflow protection
  const maxFanBaseSize = 100000000; // 100M limit
  const cappedFanBaseSize = Math.min(fanBaseSize, maxFanBaseSize);
  
  const V = cappedFanBaseSize * (energyScore / 10) * Math.exp(performanceDuration / 60);
  
  // Add upper limit to prevent Infinity
  const maxViralIndex = 9999999999; // 10B limit
  return Math.min(V, maxViralIndex);
};

/**
 * Format number for display
 * @param {number} num - Number to format
 * @returns {string} Formatted number
 */
export const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(0) + 'K';
  } else {
    return num.toFixed(0);
  }
};

/**
 * Get rating based on viral index
 * @param {number} viralIndex - Viral index
 * @returns {string} Rating
 */
export const getRating = (viralIndex) => {
  if (viralIndex >= 1000000) {
    return 'Internet Breaking';
  } else if (viralIndex >= 100000) {
    return 'Viral';
  } else {
    return 'Standard';
  }
};

/**
 * Generate normally distributed random numbers using Box-Muller transform
 * @param {number} mean - Mean value
 * @param {number} std - Standard deviation
 * @returns {number} Random number with normal distribution
 */
export const randomNormal = (mean, std) => {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return mean + std * Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
};

/**
 * Run Monte Carlo simulation for engagement prediction
 * @param {number} fanBaseSize - Fan base size
 * @param {number} iterations - Number of iterations (default: 1000)
 * @returns {object} Simulation result with min, max, and data
 */
export const runMonteCarloSimulation = (fanBaseSize, iterations = 1000) => {
  if (fanBaseSize === 0) {
    return { min: 0, max: 0, data: [] };
  }

  const baseEngagementRate = 0.025; // 2.5%
  const stdDev = 0.005; // 0.5%
  const engagements = [];

  // Run simulation
  for (let i = 0; i < iterations; i++) {
    const engagementRate = Math.max(0, baseEngagementRate + randomNormal(0, stdDev));
    const engagement = fanBaseSize * engagementRate;
    engagements.push(engagement);
  }

  // Sort and calculate distribution range
  engagements.sort((a, b) => a - b);
  const min = Math.round(engagements[0]);
  const max = Math.round(engagements[Math.floor(engagements.length * 0.95)]); // 95% confidence interval upper bound

  return { min, max, data: engagements };
};
