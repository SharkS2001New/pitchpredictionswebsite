import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import MatchDetailsTop from "./match_details_top";
import FiltersMatchDetails from "./filters-match-details";
import { usePrefetchMatchTabs } from "../functions/details_prefetch";
import {
  fetchMatchHeaderForm,
  getFixtureDate,
} from "../functions/match_details_helpers";

export default function MatchPageHeader({
  gameDetails,
  homeTeamId,
  awayTeamId,
  homeTeamData = [],
  awayTeamData = [],
  matchSlug,
  fixtureIdInteger,
  urlFilter,
  showStandings,
  bundleSnapshot,
}) {
  const router = useRouter();
  const [homeForm, setHomeForm] = useState(homeTeamData || []);
  const [awayForm, setAwayForm] = useState(awayTeamData || []);

  usePrefetchMatchTabs({
    router,
    fixtureIdInteger,
    matchSlug,
    showStandings,
    bundleSnapshot,
  });

  // Lazy-load last-6 form badges when SSR skipped that section.
  useEffect(() => {
    setHomeForm(homeTeamData || []);
    setAwayForm(awayTeamData || []);
  }, [homeTeamData, awayTeamData]);

  useEffect(() => {
    const needsHome = !homeForm?.length;
    const needsAway = !awayForm?.length;
    if (!needsHome && !needsAway) return;
    if (!homeTeamId || !awayTeamId) return;

    const fixture = Array.isArray(gameDetails) ? gameDetails[0] : null;
    const fixtureDate = getFixtureDate(fixture);
    if (!fixtureDate) return;

    let cancelled = false;
    fetchMatchHeaderForm(homeTeamId, awayTeamId, fixtureDate).then((data) => {
      if (cancelled) return;
      if (needsHome) setHomeForm(data.homeLast6 || []);
      if (needsAway) setAwayForm(data.awayLast6 || []);
    });

    return () => {
      cancelled = true;
    };
  }, [homeTeamId, awayTeamId, gameDetails, homeForm?.length, awayForm?.length]);

  return (
    <div className="sites-card mb-2">
      <MatchDetailsTop
        props={gameDetails}
        home_team_id={homeTeamId}
        away_team_id={awayTeamId}
        home_team_data={homeForm || []}
        away_team_data={awayForm || []}
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
