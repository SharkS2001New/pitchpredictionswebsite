const { default: api } = require("./api");

async function fetchPitchPredictionsGames(endpoint, matchDate, category) {
  try {
    const response = await api.get(`/${endpoint}`, {
      params: {
        match_date: matchDate,
        category,
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

export default fetchPitchPredictionsGames;
