import TeamTabLink from "./team-tab-link";

const TEAM_ROUTES = {
  results: "team/[team-details]/results",
  standings: "team/[team-details]/standings",
  upcoming: "team/[team-details]/upcoming-matches",
  players: "team/[team-details]/players",
};

function FiltersTeamDetails({
  teamSlug,
  teamId,
  urlFilter,
  showStandings = true,
}) {
  const basePath = `/team/${teamSlug}`;

  return (
    <div className="tabs">
      <div className="tabs__group">
        <TeamTabLink
          href={`${basePath}/results`}
          active={urlFilter === TEAM_ROUTES.results}
          teamId={teamId}
        >
          Results
        </TeamTabLink>
        {showStandings ? (
          <TeamTabLink
            href={`${basePath}/standings`}
            active={urlFilter === TEAM_ROUTES.standings}
            teamId={teamId}
          >
            Standings
          </TeamTabLink>
        ) : null}
        <TeamTabLink
          href={`${basePath}/upcoming-matches`}
          active={urlFilter === TEAM_ROUTES.upcoming}
          teamId={teamId}
        >
          Next Matches
        </TeamTabLink>
        <TeamTabLink
          href={`${basePath}/players`}
          active={urlFilter === TEAM_ROUTES.players}
          teamId={teamId}
        >
          Players
        </TeamTabLink>
      </div>
    </div>
  );
}

export default FiltersTeamDetails;
