async function fetchFreePlanGames(urlLink, matchDate) {
  try {
      const response = await fetch(
          `https://api.pitchpredictions.com/api/${urlLink}?fixture_date=${matchDate}`, 
          {
              method: "GET",
              headers: {
                  "Content-Type": "application/json; charset=UTF-8",
                  "Authorization": "R9TxV3PbOEu7qZnJKgydC5LmX2",
              },
          }
      ); 

      if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      return data;
  } catch (error) {
      console.error("Error fetching games:", error.message || error);
      throw new Error(`Failed to fetch games: ${error.message || error}`);
  }
}

export default fetchFreePlanGames;
