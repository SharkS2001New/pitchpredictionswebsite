import fetchJsonWithRetry from "../functions/fetch_with_retry";
import { normalizeAuthApiResponse } from "./normalize_auth_fixture";

const AUTH_API_BASE = "https://api.pitchpredictions.com/api";
const AUTH_API_HEADERS = {
  "Content-Type": "application/json; charset=UTF-8",
  Authorization: "R9TxV3PbOEu7qZnJKgydC5LmX2",
};

async function fetchWeekendGames(urlLink, startDate, endDate) {
  try {
    const data = await fetchJsonWithRetry(
      `${AUTH_API_BASE}/${urlLink}?start_date=${encodeURIComponent(startDate)}&end_date=${encodeURIComponent(endDate)}`,
      {
        headers: AUTH_API_HEADERS,
        retries: 2,
        timeoutMs: 10000,
      }
    );

    return normalizeAuthApiResponse(data);
  } catch (error) {
    console.error("Error fetching games:", error.message || error);
    return { status: false, data: [] };
  }
}

export default fetchWeekendGames;
