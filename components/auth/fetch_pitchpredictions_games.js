async function fetchPitchPredictionsGames(urlLink, matchDate, category) {
  try {
      const response = await fetch(
          `https://api.pitchpredictions.com/api/${urlLink}?match_date=${matchDate}&category=${category}`, 
          {
              method: "GET",
              headers: {
                  "Content-Type": "application/json; charset=UTF-8",
                  "Authorization": "wUlhuXImIV1Pi2IKwGDIKSln9c",
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

export default fetchPitchPredictionsGames;
