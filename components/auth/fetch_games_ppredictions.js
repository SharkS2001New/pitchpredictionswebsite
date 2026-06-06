const { default: api } = require("./api");

async function fetchMultibetsGames(fixtureDate) {
  try {
    const response = await api.get("/fetch_daily_multibet_games", {
      params: {
        fixture_date: fixtureDate,
      },
    });

    return {
      ...response.data,
      data: Array.isArray(response.data?.data) ? response.data.data : [],
    };
  } catch (error) {
    const serverErrors = error.response?.data || error.message;
    console.error("Error fetching games:", serverErrors);
    return { status: false, data: [] };
  }
}

export default fetchMultibetsGames;
