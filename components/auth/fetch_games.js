const { default: api } = require("./api");

async function fetchGames(matchDate, category) {
    try {
      // Ensure `matchDate` and `category` are passed dynamically
      const response = await api.get('/get_matches_by_date', {
        params: {
          match_date: matchDate, 
          category: category,   
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

export default fetchGames;