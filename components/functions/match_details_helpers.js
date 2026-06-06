const API_HEADERS = {
  "Content-type": "application/json; charset=UTF-8",
  Authorization: "R9TxV3PbOEu7qZnJKgydC5LmX2",
};

export function isApiSuccess(data) {
  return data?.status === true || data?.status === "true";
}

export function getHomeTeamId(matchDetails) {
  return matchDetails?.home_team?.id ?? matchDetails?.home_team_id ?? null;
}

export function getAwayTeamId(matchDetails) {
  return matchDetails?.away_team?.id ?? matchDetails?.away_team_id ?? null;
}

export function getHomeTeamName(matchDetails) {
  return matchDetails?.home_team?.name ?? matchDetails?.home_team_name ?? "";
}

export function getAwayTeamName(matchDetails) {
  return matchDetails?.away_team?.name ?? matchDetails?.away_team_name ?? "";
}

export function getFixtureDate(matchDetails) {
  const fromField =
    matchDetails?.match?.unformatted_date ?? matchDetails?.unformated_date;
  if (fromField) return fromField;

  const datetime = matchDetails?.match?.datetime ?? matchDetails?.datetime;
  if (datetime) return datetime.slice(0, 10);

  return null;
}

export function getLeagueId(matchDetails) {
  return matchDetails?.league?.id ?? matchDetails?.league_id ?? null;
}

export function getLeagueName(matchDetails) {
  return matchDetails?.league?.name ?? matchDetails?.league_name ?? "";
}

export function getLeagueType(matchDetails) {
  return matchDetails?.league?.type ?? matchDetails?.league_type ?? "League";
}

export function buildMatchUrlSlug(homeName, awayName, fixtureId) {
  return encodeURIComponent(
    `${homeName.replace(/\s+/g, "-").toLowerCase()}-vs-${awayName
      .replace(/\s+/g, "-")
      .toLowerCase()}-${fixtureId}`
  );
}

export function parseFixtureIdFromSlug(slug) {
  if (!slug) return 0;
  const mainPart = slug.split("/")[0];
  const matches = mainPart.match(/-(\d+)$/);
  return matches?.[1] ? parseInt(matches[1], 10) : 0;
}

export function parseTeamIdFromSlug(slug) {
  return parseFixtureIdFromSlug(slug);
}

async function postJson(url, body) {
  const response = await fetch(url, {
    method: "POST",
    headers: API_HEADERS,
    body: JSON.stringify(body),
  });

  if (!response.ok) return null;

  const data = await response.json();
  return isApiSuccess(data) ? data.data || [] : null;
}

export function resolveTeamFromFixture(teamData, teamId) {
  const homeTeamId = getHomeTeamId(teamData);
  const awayTeamId = getAwayTeamId(teamData);
  const isHomeTeam = teamId === homeTeamId;

  return {
    isHomeTeam,
    teamName: isHomeTeam ? getHomeTeamName(teamData) : getAwayTeamName(teamData),
    fixtureDate: getFixtureDate(teamData),
    leagueId: getLeagueId(teamData),
    leagueName: getLeagueName(teamData),
    leagueType: getLeagueType(teamData),
  };
}

export async function fetchMatchDetailsBundle(fixtureIdInteger) {
  const matchRes = await fetch(
    `https://api.pitchpredictions.com/api/fetch_match_details_top_data?fixture_id=${fixtureIdInteger}`,
    { headers: API_HEADERS }
  );

  if (!matchRes.ok) {
    throw new Error(`Match API responded with status: ${matchRes.status}`);
  }

  const matchData = await matchRes.json();

  if (!matchData?.data?.[0]) {
    return null;
  }

  const matchDetails = matchData.data[0];
  const homeTeamId = getHomeTeamId(matchDetails);
  const awayTeamId = getAwayTeamId(matchDetails);
  const fixtureDate = getFixtureDate(matchDetails);
  const leagueId = getLeagueId(matchDetails);

  const [
    h2hMatches,
    h2hLeagues,
    homeLast6,
    awayLast6,
    homeLast6Leagues,
    awayLast6Leagues,
    upcomingHome,
    upcomingAway,
    standings,
    trendsRaw,
  ] = await Promise.all([
    postJson("https://api.pitchpredictions.com/api/fetch_h2h_fixtures", {
      home_team_id: homeTeamId,
      away_team_id: awayTeamId,
      fixture_date: fixtureDate,
    }),
    postJson("https://api.pitchpredictions.com/api/fetch_h2h_league", {
      home_team_id: homeTeamId,
      away_team_id: awayTeamId,
      fixture_date: fixtureDate,
    }),
    postJson(
      "https://api.pitchpredictions.com/api/fetch_last_six_matches_by_home_team",
      {
        home_team_id: homeTeamId,
        fixture_date: fixtureDate,
      }
    ),
    postJson(
      "https://api.pitchpredictions.com/api/fetch_last_six_matches_by_away_team",
      {
        away_team_id: awayTeamId,
        fixture_date: fixtureDate,
      }
    ),
    postJson(
      "https://api.pitchpredictions.com/api/fetch_last_6_matches_leagues",
      {
        home_team_id: homeTeamId,
        fixture_date: fixtureDate,
      }
    ),
    postJson(
      "https://api.pitchpredictions.com/api/fetch_last_6_matches_leagues",
      {
        home_team_id: awayTeamId,
        fixture_date: fixtureDate,
      }
    ),
    postJson(
      "https://api.pitchpredictions.com/api/fetch_upcoming_matches_home_team",
      {
        home_team_id: homeTeamId,
        fixture_date: fixtureDate,
      }
    ),
    postJson(
      "https://api.pitchpredictions.com/api/fetch_upcoming_matches_away_team",
      {
        away_team_id: awayTeamId,
        fixture_date: fixtureDate,
      }
    ),
    leagueId
      ? postJson("https://api.pitchpredictions.com/api/fetch_team_standings", {
          league_id: leagueId,
        }).then((data) => data?.[0]?.standings_data || [])
      : Promise.resolve([]),
    fetch(
      `https://api.pitchpredictions.com/api/fetch_trends_data_by_fixture_id?fixture_id=${fixtureIdInteger}`,
      { headers: API_HEADERS }
    )
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => (isApiSuccess(data) ? data.data || [] : []))
      .catch(() => []),
  ]);

  return {
    matchData,
    matchDetails,
    homeTeamId,
    awayTeamId,
    fixtureDate,
    leagueId,
    h2hMatches: h2hMatches || [],
    h2hLeagues: h2hLeagues || [],
    homeLast6: homeLast6 || [],
    awayLast6: awayLast6 || [],
    homeLast6Leagues: homeLast6Leagues || [],
    awayLast6Leagues: awayLast6Leagues || [],
    upcomingHome: upcomingHome || [],
    upcomingAway: upcomingAway || [],
    standings: standings || [],
    trends: trendsRaw || [],
  };
}

async function fetchFixtureWithPredictions(fixtureId) {
  try {
    const response = await fetch(
      `https://api.pitchpredictions.com/api/fetch_match_details_top_data?fixture_id=${fixtureId}`,
      { headers: API_HEADERS, signal: AbortSignal.timeout(5000) }
    );

    if (!response.ok) return null;

    const data = await response.json();
    return isApiSuccess(data) && data.data?.[0] ? data.data[0] : null;
  } catch {
    return null;
  }
}

export async function fetchTeamUpcomingWithPredictions(
  teamId,
  fixtureDate,
  excludeFixtureId = null
) {
  const [homeMatches, awayMatches] = await Promise.all([
    postJson(
      "https://api.pitchpredictions.com/api/fetch_upcoming_matches_home_team",
      { home_team_id: teamId, fixture_date: fixtureDate }
    ),
    postJson(
      "https://api.pitchpredictions.com/api/fetch_upcoming_matches_away_team",
      { away_team_id: teamId, fixture_date: fixtureDate }
    ),
  ]);

  const seen = new Set();
  const basicMatches = [...(homeMatches || []), ...(awayMatches || [])]
    .filter((match) => {
      if (!match?.fixture_id || seen.has(match.fixture_id)) return false;
      if (
        excludeFixtureId != null &&
        String(match.fixture_id) === String(excludeFixtureId)
      ) {
        return false;
      }
      seen.add(match.fixture_id);
      return true;
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  if (!basicMatches.length) return [];

  const enriched = await Promise.all(
    basicMatches.slice(0, 20).map((match) =>
      fetchFixtureWithPredictions(match.fixture_id)
    )
  );

  return enriched
    .filter(Boolean)
    .filter(
      (match) =>
        excludeFixtureId == null ||
        String(match.fixture_id) !== String(excludeFixtureId)
    );
}

export async function fetchTeamDetailsBundle(teamIdInteger) {
  const topRes = await fetch(
    `https://api.pitchpredictions.com/api/fetch_teams_details_top?team_id=${teamIdInteger}`,
    { headers: API_HEADERS, signal: AbortSignal.timeout(5000) }
  );

  if (!topRes.ok) {
    throw new Error(`Team API responded with status: ${topRes.status}`);
  }

  const teamsTopData = await topRes.json();

  if (!teamsTopData?.data?.[0]) {
    return null;
  }

  const teamData = teamsTopData.data[0];
  const fixtureDate = getFixtureDate(teamData);
  const leagueId = getLeagueId(teamData);

  const [
    last6Matches,
    homeMatches,
    awayMatches,
    last6Leagues,
    homeLeagues,
    awayLeagues,
    standingsRaw,
    upcomingFixtures,
  ] = await Promise.all([
    postJson(
      "https://api.pitchpredictions.com/api/fetch_teams_matches_both_sides",
      { team_id: teamIdInteger, fixture_date: fixtureDate }
    ),
    postJson(
      "https://api.pitchpredictions.com/api/fetch_teams_matches_when_home",
      { team_id: teamIdInteger, fixture_date: fixtureDate }
    ),
    postJson(
      "https://api.pitchpredictions.com/api/fetch_teams_matches_when_away",
      { team_id: teamIdInteger, fixture_date: fixtureDate }
    ),
    postJson(
      "https://api.pitchpredictions.com/api/fetch_last_6_matches_leagues",
      { home_team_id: teamIdInteger, fixture_date: fixtureDate }
    ),
    postJson(
      "https://api.pitchpredictions.com/api/fetch_last_6_matches_leagues",
      { home_team_id: teamIdInteger, fixture_date: fixtureDate }
    ),
    postJson(
      "https://api.pitchpredictions.com/api/fetch_last_6_matches_leagues",
      { home_team_id: teamIdInteger, fixture_date: fixtureDate }
    ),
    leagueId
      ? postJson("https://api.pitchpredictions.com/api/fetch_team_standings", {
          league_id: leagueId,
        })
      : Promise.resolve([]),
    fetchTeamUpcomingWithPredictions(
      teamIdInteger,
      fixtureDate,
      teamData.fixture_id
    ),
  ]);

  return {
    teamsTopData,
    teamData,
    fixtureDate,
    leagueId,
    last6Matches: last6Matches || [],
    homeMatches: homeMatches || [],
    awayMatches: awayMatches || [],
    last6Leagues: last6Leagues || [],
    homeLeagues: homeLeagues || [],
    awayLeagues: awayLeagues || [],
    standings: standingsRaw?.[0]?.standings_data || [],
    upcomingFixtures: upcomingFixtures || [],
  };
}
