// Setlist utilities for Coachella Viral

/**
 * Generate setlist suggestions based on setlist length
 * @param {number} setlistLength - Number of songs in setlist
 * @returns {array} Setlist suggestions
 */
export const generateSetlistSuggestions = (setlistLength) => {
  const N = setlistLength;
  if (N < 3) {
    return [];
  }

  // Calculate burst point positions
  const firstBurstEnd = Math.ceil(N * 0.2); // First 20%
  const lastBurstStart = Math.floor(N * 0.9); // Last 10%

  // Generate three different setlist arrangement suggestions
  return [
    {
      name: 'The Bang Start',
      description: 'High energy from the start, capture audience attention',
      structure: `1-2 high energy songs (positions 1-${firstBurstEnd}) → medium energy songs → final hit song (positions ${lastBurstStart}-${N})`
    },
    {
      name: 'The Emotional Middle',
      description: 'Emotional burst in the middle, maintain continuous attention',
      structure: `Warm-up opening → high energy songs (positions ${firstBurstEnd + 1}-${Math.floor(N * 0.6)}) → emotional songs → final hit song (positions ${lastBurstStart}-${N})`
    },
    {
      name: 'The Hit Finale',
      description: 'Gradual build-up, final explosion',
      structure: `Warm-up opening → medium energy songs → high energy songs (positions ${Math.floor(N * 0.7)}-${lastBurstStart - 1}) → final super hit song (positions ${lastBurstStart}-${N})`
    }
  ];
};
