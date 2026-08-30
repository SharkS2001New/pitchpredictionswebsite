import fetchJsonWithRetry from "../functions/fetch_with_retry";
import { normalizeAuthApiResponse } from "./normalize_auth_fixture";

const AUTH_API_BASE = "https://api.pitchpredictions.com/api";
const AUTH_API_HEADERS = {
  "Content-Type": "application/json; charset=UTF-8",
  Origin: "https://www.pitchpredictions.com", Authorization: `Bearer ${process.env.ACCESS_TOKEN || "UJlhuDILIR1Lc2IEwZDIKOln9d"}`,
};

async function fetchFreePlanGames2(urlLink, matchDate) {
  try {
    const data = await fetchJsonWithRetry(
      `${AUTH_API_BASE}/${urlLink}?fixture_date=${encodeURIComponent(matchDate)}`,
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

export default fetchFreePlanGames2;
