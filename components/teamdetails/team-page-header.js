import { useRouter } from "next/router";
import TeamDetailsTop from "./team_details_top";
import FiltersTeamDetails from "./filters-on-teams-page";
import { usePrefetchTeamTabs } from "../functions/details_prefetch";

export default function TeamPageHeader({
  teamsTopData,
  teamIdInteger,
  last6Matches,
  teamSlug,
  urlFilter,
  showStandings,
  bundleSnapshot,
}) {
  const router = useRouter();

  usePrefetchTeamTabs({
    router,
    teamIdInteger,
    teamSlug,
    showStandings,
    bundleSnapshot,
  });

  return (
    <div className="sites-card mb-2">
      <TeamDetailsTop
        props={teamsTopData}
        last_6_matches={last6Matches}
        team_id={teamIdInteger}
      />
      <div className="border-top"></div>
      <FiltersTeamDetails
        teamSlug={teamSlug}
        teamId={teamIdInteger}
        urlFilter={urlFilter}
        showStandings={showStandings}
      />
    </div>
  );
}
