const { default: api } = require("./api");

async function fetchPremiumJackpots(jackpotName) {
  try {
    const response = await api.get("/get_jackpot_predictions_by_name", {
      params: {
        jackpot_name: jackpotName,
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

export default fetchPremiumJackpots;
