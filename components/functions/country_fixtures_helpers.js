import fetchJsonWithRetry from "./fetch_with_retry";
import getFormattedCurrentDate from "./GetTodaysDate";

export const COUNTRY_API_BASE = "https://api.pitchpredictions.com/api";

export const COUNTRY_API_HEADERS = {
  "Content-type": "application/json; charset=UTF-8",
  Authorization: "R9TxV3PbOEu7qZnJKgydC5LmX2",
};

export function parseCountryRouteParam(fullParam = "") {
  const prefix = "football-predictions-for-";
  const countrySlug = (
    fullParam.startsWith(prefix)
      ? fullParam.substring(prefix.length)
      : fullParam
  ).toLowerCase();

  const countryNameForApi = countrySlug.replace(/-/g, " ");
  const displayCountryName = countrySlug
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return { countrySlug, countryNameForApi, displayCountryName };
}

function fetchCountryApi(path) {
  return fetchJsonWithRetry(`${COUNTRY_API_BASE}${path}`, {
    headers: COUNTRY_API_HEADERS,
    retries: 2,
    timeoutMs: 10000,
  });
}

export async function fetchCountriesTopData(countryName) {
  try {
    const data = await fetchCountryApi(
      `/fetch_countries_top_data?country_name=${encodeURIComponent(countryName)}`
    );
    return data?.status === true ? data.data || [] : [];
  } catch (error) {
    console.error("Error fetching countries top data:", error);
    return [];
  }
}

export async function fetchTodaysFixturesByCountry(
  countryName,
  fixtureDate = getFormattedCurrentDate(),
  startIndex = 0,
  endIndex = 50
) {
  try {
    const data = await fetchCountryApi(
      `/fetch_todays_fixtures_by_country_name?country_name=${encodeURIComponent(countryName)}&fixture_date=${fixtureDate}&start_index=${startIndex}&end_index=${endIndex}`
    );
    return data?.status === true && Array.isArray(data.data) ? data.data : [];
  } catch (error) {
    console.error("Error fetching today's fixtures by country:", error);
    return [];
  }
}

export async function fetchUpcomingFixturesByCountry(
  countryName,
  startIndex = 0,
  endIndex = 50
) {
  try {
    const data = await fetchCountryApi(
      `/fetch_upcoming_fixtures_by_country?country_name=${encodeURIComponent(countryName)}&start_index=${startIndex}&end_index=${endIndex}`
    );
    return data?.status === true && Array.isArray(data.data) ? data.data : [];
  } catch (error) {
    console.error("Error fetching upcoming fixtures by country:", error);
    return [];
  }
}

export async function fetchResultsFixturesByCountry(
  countryName,
  startIndex = 0,
  endIndex = 50
) {
  try {
    const data = await fetchCountryApi(
      `/fetch_results_fixtures_by_country?country_name=${encodeURIComponent(countryName)}&start_index=${startIndex}&end_index=${endIndex}`
    );
    return data?.status === true && Array.isArray(data.data) ? data.data : [];
  } catch (error) {
    console.error("Error fetching results fixtures by country:", error);
    return [];
  }
}

export function resolveCountryApiName(countryNameForApi, countriesTopData) {
  return countriesTopData?.[0]?.country_name || countryNameForApi;
}
