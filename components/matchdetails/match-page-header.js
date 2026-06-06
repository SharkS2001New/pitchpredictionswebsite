import { useRouter } from "next/router";
import MatchDetailsTop from "./match_details_top";
import FiltersMatchDetails from "./filters-match-details";
import { usePrefetchMatchTabs } from "../functions/details_prefetch";

export default function MatchPageHeader({
  gameDetails,
  homeTeamId,
  awayTeamId,
  homeTeamData,
  awayTeamData,
  matchSlug,
  fixtureIdInteger,
  urlFilter,
  showStandings,
  bundleSnapshot,
}) {
  const router = useRouter();

  usePrefetchMatchTabs({
    router,
    fixtureIdInteger,
    matchSlug,
    showStandings,
    bundleSnapshot,
  });

  return (
    <div className="sites-card mb-2">
      <MatchDetailsTop
        props={gameDetails}
        home_team_id={homeTeamId}
        away_team_id={awayTeamId}
        home_team_data={homeTeamData}
        away_team_data={awayTeamData}
      />
      <div className="border-top"></div>
      <FiltersMatchDetails
        matchSlug={matchSlug}
        fixtureId={fixtureIdInteger}
        urlFilter={urlFilter}
        showStandings={showStandings}
      />
    </div>
  );
}
