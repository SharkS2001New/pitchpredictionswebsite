// pages/country/[football-prediction-for-country]/fixtures.js
import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import { Adsense } from "@/components/shared/client-adsense";
import PreLoader from "../../../components/includes/loader";
import RenderData from "../../../components/shared/render_fixtures_data";
import PagesMatchPredictionDetails from "../../../components/shared/pages_match_predictions_details";
import DataNotFoundPage from "../../../components/includes/datanotfound";
import CountriesDetailsTop from "../../../components/countrydetails/country_top_details";
import FiltersCountriesDetails from "../../../components/countrydetails/filters-countries-details";
import getFormattedCurrentDate from "../../../components/functions/GetTodaysDate";
import TodaysFixturesByCountry from "../../../components/countrydetails/todays-fixtures";
import {
  COUNTRY_API_BASE,
  COUNTRY_API_HEADERS,
  fetchCountriesTopData,
  fetchResultsFixturesByCountry,
  fetchTodaysFixturesByCountry,
  fetchUpcomingFixturesByCountry,
  parseCountryRouteParam,
  resolveCountryApiName,
} from "../../../components/functions/country_fixtures_helpers";

function FootballPredictionsByCountry({
  initialData,
  endpointStatus,
  error,
  countryName,
  countrySlug,
  displayCountryName,
  todaysDate,
  initialCountriesTopData,
  initialTodaysMatches,
  initialResultsFallback,
  hasUpcomingFixtures,
  hasTodaysFixtures,
  hasResultsFallback,
  hasMoreUpcoming,
  hasMoreResultsFallback,
}) {
  const router = useRouter();
  const [countriesTopdata] = useState(initialCountriesTopData || []);
  const [todaysMatchesByCountry, setTodaysMatchesByCountry] = useState(
    initialTodaysMatches || []
  );
  const [upcomingFixtures, setUpcomingFixtures] = useState(initialData || []);
  const [resultsFallback, setResultsFallback] = useState(
    initialResultsFallback || []
  );
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentStartIndex, setCurrentStartIndex] = useState(initialData.length);
  const [resultsStartIndex, setResultsStartIndex] = useState(
    initialResultsFallback.length
  );
  const [hasMore, setHasMore] = useState(hasMoreUpcoming);
  const [hasMoreResults, setHasMoreResults] = useState(hasMoreResultsFallback);

  async function fetchTodaysFixturesByCountry() {
    try {
      const response = await fetch(
        `${COUNTRY_API_BASE}/fetch_todays_fixtures_by_country_name?country_name=${encodeURIComponent(countryName)}&fixture_date=${todaysDate}&start_index=0&end_index=50`,
        { method: "GET", headers: COUNTRY_API_HEADERS }
      );
      const data = await response.json();
      return data;
    } catch (fetchError) {
      console.error("Error fetching today's fixtures by country:", fetchError);
      return { status: false, data: [] };
    }
  }

  const loadMoreUpcomingFixtures = useCallback(async () => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);
    const chunkSize = 50;
    const startIndex = currentStartIndex;
    const endIndex = currentStartIndex + chunkSize - 1;

    try {
      const url = `${COUNTRY_API_BASE}/fetch_upcoming_fixtures_by_country?country_name=${encodeURIComponent(countryName)}&start_index=${startIndex}&end_index=${endIndex}`;
      const response = await fetch(url, { headers: COUNTRY_API_HEADERS });
      const data = await response.json();

      if (data.status === true && data.data?.length > 0) {
        setUpcomingFixtures((prev) => [...prev, ...data.data]);
        setCurrentStartIndex((prev) => prev + data.data.length);
        if (data.data.length < chunkSize) setHasMore(false);
      } else {
        setHasMore(false);
      }
    } catch (fetchError) {
      console.error("Error loading more upcoming fixtures:", fetchError);
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, hasMore, currentStartIndex, countryName]);

  const loadMoreResultsFallback = useCallback(async () => {
    if (loadingMore || !hasMoreResults) return;

    setLoadingMore(true);
    const chunkSize = 50;
    const startIndex = resultsStartIndex;
    const endIndex = resultsStartIndex + chunkSize - 1;

    try {
      const url = `${COUNTRY_API_BASE}/fetch_results_fixtures_by_country?country_name=${encodeURIComponent(countryName)}&start_index=${startIndex}&end_index=${endIndex}`;
      const response = await fetch(url, { headers: COUNTRY_API_HEADERS });
      const data = await response.json();

      if (data.status === true && data.data?.length > 0) {
        setResultsFallback((prev) => [...prev, ...data.data]);
        setResultsStartIndex((prev) => prev + data.data.length);
        if (data.data.length < chunkSize) setHasMoreResults(false);
      } else {
        setHasMoreResults(false);
      }
    } catch (fetchError) {
      console.error("Error loading more results:", fetchError);
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, hasMoreResults, resultsStartIndex, countryName]);

  useEffect(() => {
    if (!hasTodaysFixtures) return undefined;

    const intervalId = setInterval(() => {
      fetchTodaysFixturesByCountry().then((data) => {
        if (data.status === true && data.data) {
          setTodaysMatchesByCountry(data.data);
        }
      });
    }, 30000);

    return () => clearInterval(intervalId);
  }, [hasTodaysFixtures, countryName, todaysDate]);

  const renderPredictions =
    hasUpcomingFixtures && upcomingFixtures.length > 0
      ? PagesMatchPredictionDetails({ gamesData: upcomingFixtures })
      : [];

  const renderResultsFallback =
    hasResultsFallback && resultsFallback.length > 0
      ? PagesMatchPredictionDetails({ gamesData: resultsFallback })
      : [];

  const hasAnyFixtures =
    hasUpcomingFixtures || hasTodaysFixtures || hasResultsFallback;

  if (!initialData && !error && !initialResultsFallback?.length) {
    return <PreLoader />;
  }

  if (endpointStatus === "error" && !hasAnyFixtures) {
    return (
      <>
        <div className="sites-card mb-2">
          <CountriesDetailsTop props={countriesTopdata[0]} />
          <FiltersCountriesDetails
            countrySlug={countrySlug}
            urlFilter={router.pathname.substring(1)}
          />
        </div>
        <div className="sites-card">
          <DataNotFoundPage props="We don't have any matches for this country to show you right now, please try again later." />
          <br />
          <div className="desktop-container-resize mb-1">
            <div className="col-sm-12 text-center bg-light pt-1">
              <Adsense
                client="ca-pub-5665711413000284"
                slot="7624930534"
                style={{ display: "block" }}
                layout="display"
                format="auto"
              />
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="sites-card mb-2">
        <CountriesDetailsTop props={countriesTopdata[0]} />
        <FiltersCountriesDetails
          countrySlug={countrySlug}
          urlFilter={router.pathname.substring(1)}
        />
      </div>

      {hasTodaysFixtures && todaysMatchesByCountry.length > 0 && (
        <>
          {hasUpcomingFixtures ? (
            <TodaysFixturesByCountry
              todays_matches={todaysMatchesByCountry}
              country_name={displayCountryName}
            />
          ) : (
            <div className="sites-card">
              <div className="desktop-container-resize mb-1">
                <div className="col-sm-12 text-center bg-light pt-1">
                  <h2 className="sectionTitle">
                    Today&apos;s Fixtures - {displayCountryName}
                  </h2>
                </div>
              </div>

              <RenderData
                renderPredictions={PagesMatchPredictionDetails({
                  gamesData: todaysMatchesByCountry,
                })}
              />

              <br />

              <div className="desktop-container-resize mb-1">
                <div className="col-sm-12 text-center bg-light pt-1">
                  <Adsense
                    client="ca-pub-5665711413000284"
                    slot="7624930534"
                    style={{ display: "block" }}
                    layout="display"
                    format="auto"
                  />
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {hasUpcomingFixtures && renderPredictions.length > 0 && (
        <div className="sites-card">
          <div className="desktop-container-resize mb-1">
            <div className="col-sm-12 text-center bg-light pt-1">
              <h2 className="sectionTitle">
                Upcoming Fixtures - {displayCountryName}
              </h2>
            </div>
          </div>

          <RenderData renderPredictions={renderPredictions} />

          {hasMore && (
            <div className="text-center my-2">
              <button
                className="btn btn-link btn-sm fixturesTextSize"
                style={{ minWidth: "150px", color: "#B11111", fontWeight: "bold" }}
                onClick={loadMoreUpcomingFixtures}
                disabled={loadingMore}
              >
                {loadingMore ? <PreLoader /> : "Show More Upcoming Matches"}
              </button>
            </div>
          )}

          <br />

          <div className="desktop-container-resize mb-1">
            <div className="col-sm-12 text-center bg-light pt-1">
              <Adsense
                client="ca-pub-5665711413000284"
                slot="7624930534"
                style={{ display: "block" }}
                layout="display"
                format="auto"
              />
            </div>
          </div>
        </div>
      )}

      {hasResultsFallback && renderResultsFallback.length > 0 && (
        <div className="sites-card">
          <div className="desktop-container-resize mb-1">
            <div className="col-sm-12 text-center bg-light pt-1">
              <h2 className="sectionTitle">
                Recent Results - {displayCountryName}
              </h2>
            </div>
          </div>

          <RenderData renderPredictions={renderResultsFallback} />

          {hasMoreResults && (
            <div className="text-center my-2">
              <button
                className="btn btn-link btn-sm fixturesTextSize"
                style={{ minWidth: "150px", color: "#B11111", fontWeight: "bold" }}
                onClick={loadMoreResultsFallback}
                disabled={loadingMore}
              >
                {loadingMore ? <PreLoader /> : "Show More Results"}
              </button>
            </div>
          )}

          <br />

          <div className="desktop-container-resize mb-1">
            <div className="col-sm-12 text-center bg-light pt-1">
              <Adsense
                client="ca-pub-5665711413000284"
                slot="7624930534"
                style={{ display: "block" }}
                layout="display"
                format="auto"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export async function getServerSideProps(context) {
  const fullParam = context.params?.["football-prediction-for-country"] || "";
  const { countrySlug, countryNameForApi, displayCountryName } =
    parseCountryRouteParam(fullParam);

  if (!countryNameForApi) {
    return {
      props: {
        initialData: [],
        endpointStatus: "error",
        error: "No country specified",
        countryName: "",
        countrySlug: "",
        displayCountryName: "",
        todaysDate: getFormattedCurrentDate(),
        initialCountriesTopData: [],
        initialTodaysMatches: [],
        initialResultsFallback: [],
        hasUpcomingFixtures: false,
        hasTodaysFixtures: false,
        hasResultsFallback: false,
        hasMoreUpcoming: false,
        hasMoreResultsFallback: false,
      },
    };
  }

  const todaysDate = getFormattedCurrentDate();

  try {
    const countriesTopData = await fetchCountriesTopData(countryNameForApi);
    const apiCountryName = resolveCountryApiName(
      countryNameForApi,
      countriesTopData
    );

    const [todaysMatchesData, upcomingFixturesData] = await Promise.all([
      fetchTodaysFixturesByCountry(apiCountryName, todaysDate),
      fetchUpcomingFixturesByCountry(apiCountryName),
    ]);

    let resultsFallbackData = [];
    if (!todaysMatchesData.length && !upcomingFixturesData.length) {
      resultsFallbackData = await fetchResultsFixturesByCountry(apiCountryName);
    }

    const hasTodaysFixtures = todaysMatchesData.length > 0;
    const hasUpcomingFixtures = upcomingFixturesData.length > 0;
    const hasResultsFallback = resultsFallbackData.length > 0;
    const hasAnyFixtures =
      hasTodaysFixtures || hasUpcomingFixtures || hasResultsFallback;

    return {
      props: {
        initialData: upcomingFixturesData,
        endpointStatus: hasAnyFixtures ? "success" : "error",
        error: hasAnyFixtures ? null : "No fixtures found for this country",
        countryName: apiCountryName,
        countrySlug,
        displayCountryName:
          countriesTopData[0]?.country_name || displayCountryName,
        todaysDate,
        initialCountriesTopData: countriesTopData,
        initialTodaysMatches: todaysMatchesData,
        initialResultsFallback: resultsFallbackData,
        hasUpcomingFixtures,
        hasTodaysFixtures,
        hasResultsFallback,
        hasMoreUpcoming: upcomingFixturesData.length === 50,
        hasMoreResultsFallback: resultsFallbackData.length === 50,
      },
    };
  } catch (fetchError) {
    console.error("Error fetching country fixtures:", fetchError);

    return {
      props: {
        initialData: [],
        endpointStatus: "error",
        error: fetchError.message || "Failed to load country fixtures",
        countryName: countryNameForApi,
        countrySlug,
        displayCountryName,
        todaysDate,
        initialCountriesTopData: [],
        initialTodaysMatches: [],
        initialResultsFallback: [],
        hasUpcomingFixtures: false,
        hasTodaysFixtures: false,
        hasResultsFallback: false,
        hasMoreUpcoming: false,
        hasMoreResultsFallback: false,
      },
    };
  }
}

export default FootballPredictionsByCountry;
