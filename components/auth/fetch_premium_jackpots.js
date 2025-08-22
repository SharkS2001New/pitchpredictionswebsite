const { default: api } = require("./api");

async function fetchPremiumJackpots(jackpotName) {
    try {
      // Ensure `matchDate` and `category` are passed dynamically
      const response = await api.get('/get_jackpot_predictions_by_name', {
        params: {
            jackpot_name: jackpotName, 
        },
      });
  
      return response.data;
    } catch (error) {
      // Capture errors and handle them
      const serverErrors = error.response?.data || error.message;
      console.error('Error fetching games:', serverErrors);
  
      // Optionally, throw an error to handle upstream
      throw new Error(`Failed to fetch games: ${serverErrors}`);
    }
}

export default fetchPremiumJackpots;