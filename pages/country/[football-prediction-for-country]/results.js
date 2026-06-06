// pages/country/[football-prediction-for-country]/results.js
import React, { useState, useCallback } from "react";
import { useRouter } from "next/router";
import { Adsense } from "@/components/shared/client-adsense";
import PreLoader from "../../../components/includes/loader";
import RenderData from "../../../components/shared/render_fixtures_data";
import PagesMatchPredictionDetails from "../../../components/shared/pages_match_predictions_details";
import DataNotFoundPage from "../../../components/includes/datanotfound";
import FiltersCountriesDetails from "../../../components/countrydetails/filters-countries-details";
import CountriesDetailsTop from "../../../components/countrydetails/country_top_details";
import {
  COUNTRY_API_BASE,
  COUNTRY_API_HEADERS,
  fetchCountriesTopData,
  fetchResultsFixturesByCountry,
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
  initialCountriesTopData,
  hasResults,
  hasMoreResults,
}) {
  const router = useRouter();
  const [countriesTopdata] = useState(initialCountriesTopData || []);
  const [resultsData, setResultsData] = useState(initialData || []);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentStartIndex, setCurrentStartIndex] = useState(initialData.length);
  const [hasMore, setHasMore] = useState(hasMoreResults);

  const loadMoreResults = useCallback(async () => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);
    const chunkSize = 50;
    const startIndex = currentStartIndex;
    const endIndex = currentStartIndex + chunkSize - 1;

    try {
      const url = `${COUNTRY_API_BASE}/fetch_results_fixtures_by_country?country_name=${encodeURIComponent(countryName)}&start_index=${startIndex}&end_index=${endIndex}`;
      const response = await fetch(url, { headers: COUNTRY_API_HEADERS });
      const data = await response.json();

      if (data.status === true && data.data?.length > 0) {
        setResultsData((prev) => [...prev, ...data.data]);
        setCurrentStartIndex((prev) => prev + data.data.length);
        if (data.data.length < chunkSize) setHasMore(false);
      } else {
        setHasMore(false);
      }
    } catch (fetchError) {
      console.error("Error loading more results:", fetchError);
      setHasMore(false);
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, hasMore, currentStartIndex, countryName]);

  const renderPredictions =
    resultsData.length > 0
      ? PagesMatchPredictionDetails({ gamesData: resultsData })
      : [];

  if (!router.isReady) {
    return <PreLoader />;
  }

  if (!initialData && !error) {
    return <PreLoader />;
  }

  if (endpointStatus === "error" && !hasResults) {
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
          <DataNotFoundPage props="We don't have any results for this country to show you right now, please try again later." />
          <br />
          <div className="desktop-container-resize mb-1">
            <div className="col-sm-12 text-center bg-light pt-1">
              <Adsense
                client="ca-pub-5665711413000284"
                slot="7856848919"
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

  if (renderPredictions.length === 0 && !loadingMore) {
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
          <DataNotFoundPage
            props={`No results available for ${displayCountryName}`}
          />
          <br />
          <div className="desktop-container-resize mb-1">
            <div className="col-sm-12 text-center bg-light pt-1">
              <Adsense
                client="ca-pub-5665711413000284"
                slot="7856848919"
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

      <div className="sites-card">
        <div className="desktop-container-resize mb-1">
          <div className="col-sm-12 text-center bg-light pt-1">
            <h2 className="sectionTitle">Results - {displayCountryName}</h2>
          </div>
        </div>

        <RenderData renderPredictions={renderPredictions} />

        {hasMore && (
          <div className="text-center my-2">
            <button
              className="btn btn-link btn-sm fixturesTextSize"
              style={{ minWidth: "150px", color: "#B11111", fontWeight: "bold" }}
              onClick={loadMoreResults}
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
        initialCountriesTopData: [],
        hasResults: false,
        hasMoreResults: false,
      },
    };
  }

  try {
    const countriesTopData = await fetchCountriesTopData(countryNameForApi);
    const apiCountryName = resolveCountryApiName(
      countryNameForApi,
      countriesTopData
    );
    const resultsData = await fetchResultsFixturesByCountry(apiCountryName);
    const hasResults = resultsData.length > 0;

    return {
      props: {
        initialData: resultsData,
        endpointStatus: hasResults ? "success" : "error",
        error: hasResults ? null : "No results found for this country",
        countryName: apiCountryName,
        countrySlug,
        displayCountryName:
          countriesTopData[0]?.country_name || displayCountryName,
        initialCountriesTopData: countriesTopData,
        hasResults,
        hasMoreResults: resultsData.length === 50,
      },
    };
  } catch (fetchError) {
    console.error("Error fetching country results:", fetchError);

    return {
      props: {
        initialData: [],
        endpointStatus: "error",
        error: fetchError.message || "Failed to load country results",
        countryName: countryNameForApi,
        countrySlug,
        displayCountryName,
        initialCountriesTopData: [],
        hasResults: false,
        hasMoreResults: false,
      },
    };
  }
}

export default FootballPredictionsByCountry;
