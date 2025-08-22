const { default: api } = require("./api");

async function fetchMultibetsGames(fixture_date) {
    try {
      // Ensure `matchDate` and `category` are passed dynamically
      const response = await api.get('/fetch_daily_multibet_games', {
        params: {
          fixture_date: fixture_date, 
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

export default fetchMultibetsGames;