function FiltersCountriesDetails({ countrySlug, urlFilter }) {
  const basePath = `/country/football-predictions-for-${countrySlug}`;

  return (
    <div className="tabs">
      <div className="tabs__group">
        <a
          href={`${basePath}/fixtures`}
          className="tabs__tab"
          id={
            urlFilter === "country/[football-prediction-for-country]/fixtures"
              ? "activeElement1"
              : undefined
          }
        >
          Fixtures
        </a>
        <a
          href={`${basePath}/results`}
          className="tabs__tab"
          id={
            urlFilter === "country/[football-prediction-for-country]/results"
              ? "activeElement1"
              : undefined
          }
        >
          Results
        </a>
      </div>
    </div>
  );
}

export default FiltersCountriesDetails;
