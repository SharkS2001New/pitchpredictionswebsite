import MatchTabLink from "./match-tab-link";

const MATCH_ROUTES = {
  summary: "match/[match-details]/overall-statistics",
  odds: "match/[match-details]/odds",
  matches: "match/[match-details]/matches",
  standings: "match/[match-details]/standings",
  upcoming: "match/[match-details]/upcoming-matches",
};

function FiltersMatchDetails({
  matchSlug,
  fixtureId,
  urlFilter,
  showStandings = true,
}) {
  const basePath = `/match/${matchSlug}`;

  return (
    <div className="tabs">
      <div className="tabs__group">
        <MatchTabLink
          href={`${basePath}/overall-statistics`}
          active={urlFilter === MATCH_ROUTES.summary}
          fixtureId={fixtureId}
        >
          Summary
        </MatchTabLink>
        <MatchTabLink
          href={`${basePath}/odds`}
          active={urlFilter === MATCH_ROUTES.odds}
          fixtureId={fixtureId}
        >
          Odds
        </MatchTabLink>
        <MatchTabLink
          href={`${basePath}/matches`}
          active={urlFilter === MATCH_ROUTES.matches}
          fixtureId={fixtureId}
        >
          Matches
        </MatchTabLink>
        {showStandings ? (
          <MatchTabLink
            href={`${basePath}/standings`}
            active={urlFilter === MATCH_ROUTES.standings}
            fixtureId={fixtureId}
          >
            Standings
          </MatchTabLink>
        ) : null}
        <MatchTabLink
          href={`${basePath}/upcoming-matches`}
          active={urlFilter === MATCH_ROUTES.upcoming}
          fixtureId={fixtureId}
        >
          Next Matches
        </MatchTabLink>
      </div>
    </div>
  );
}

export default FiltersMatchDetails;
