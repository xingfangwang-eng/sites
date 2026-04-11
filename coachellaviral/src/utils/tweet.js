// Tweet utilities for Coachella Viral

/**
 * Generate tweet templates based on viral index and simulation result
 * @param {number} viralIndex - Viral index
 * @param {string} formattedIndex - Formatted viral index
 * @param {string} rating - Rating
 * @param {object} simulationResult - Simulation result
 * @returns {array} Tweet templates
 */
export const generateTweetTemplates = (viralIndex, formattedIndex, rating, simulationResult) => {
  if (viralIndex === null) {
    return [];
  }

  return [
    {
      type: 'Data-Driven',
      content: `📊 Math prediction: Coachella performance viral index ${formattedIndex}, based on formula V = F × (E/10) × e^(D/60). Expected engagement ${simulationResult ? `[${simulationResult.min}] - [${simulationResult.max}]` : 'to be calculated'}, growth trend follows exponential model. #Coachella2024 #Maths #ViralPrediction`
    },
    {
      type: 'Fan Frenzy',
      content: `🔥 Oh my god! According to predictions, this performance has a viral index of ${formattedIndex}, rating ${rating}! Get ready to be flooded! 🤩 The idol is going to rock Coachella! #Coachella2024 #ViralPrediction #Fandom`
    },
    {
      type: 'Controversy Stirrer',
      content: `🚨 Prediction: This Coachella performance will dominate all social media trends in the next 48 hours! Viral index ${formattedIndex}, come at me! #Coachella2024 #ViralPrediction #Trending`
    }
  ];
};
