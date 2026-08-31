const API_HEADERS = {
  "Content-type": "application/json; charset=UTF-8",
  Origin: "https://www.pitchpredictions.com",
  Authorization: `Bearer ${process.env.ACCESS_TOKEN || "UJlhuDILIR1Lc2IEwZDIKOln9d"}`,
};

const FETCH_TIMEOUT_MS = 8_000;

/** Tab → which heavy sections to load on SSR (header/top is always loaded). */
export const MATCH_TAB_SECTIONS = {
  "overall-statistics": ["trends"],
  odds: [],
  matches: ["h2h", "last6"],
  standings: ["standings"],
  "upcoming-matches": ["upcoming"],
};

export const TEAM_TAB_SECTIONS = {
  results: ["last6", "leagues"],
  standings: ["last6", "standings"],
  "upcoming-matches": ["last6", "upcoming"],
  players: ["last6"],
};

export function emptyMatchBundleExtras() {
  return {
    h2hMatches: [],
    h2hLeagues: [],
    homeLast6: [],
    awayLast6: [],
    homeLast6Leagues: [],
    awayLast6Leagues: [],
    upcomingHome: [],
    upcomingAway: [],
    standings: [],
    trends: [],
  };
}

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

function fetchSignal(timeoutMs = FETCH_TIMEOUT_MS) {
  return AbortSignal.timeout(timeoutMs);
}

async function postJson(url, body, timeoutMs = FETCH_TIMEOUT_MS) {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: API_HEADERS,
      body: JSON.stringify(body),
      signal: fetchSignal(timeoutMs),
    });

    if (!response.ok) return null;

    const data = await response.json();
    return isApiSuccess(data) ? data.data || [] : null;
  } catch {
    return null;
  }
}

async function getJson(url, timeoutMs = FETCH_TIMEOUT_MS) {
  try {
    const response = await fetch(url, {
      headers: API_HEADERS,
      signal: fetchSignal(timeoutMs),
    });
    if (!response.ok) {
      const err = new Error(`API responded with status: ${response.status}`);
      err.status = response.status;
      throw err;
    }
    return await response.json();
  } catch (error) {
    if (error?.name === "TimeoutError" || error?.name === "AbortError") {
      const err = new Error("API request timed out");
      err.code = "TIMEOUT";
      throw err;
    }
    throw error;
  }
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

function wants(sections, key) {
  return !sections || sections.includes(key) || sections.includes("all");
}

/**
 * Load match top data + only the requested heavy sections.
 * @param {number} fixtureIdInteger
 * @param {{ sections?: string[] }} [options]
 */
export async function fetchMatchDetailsBundle(
  fixtureIdInteger,
  { sections = ["all"] } = {}
) {
  const matchData = await getJson(
    `https://api.pitchpredictions.com/api/fetch_match_details_top_data?fixture_id=${fixtureIdInteger}`
  );

  if (!matchData?.data?.[0]) {
    return null;
  }

  const matchDetails = matchData.data[0];
  const homeTeamId = getHomeTeamId(matchDetails);
  const awayTeamId = getAwayTeamId(matchDetails);
  const fixtureDate = getFixtureDate(matchDetails);
  const leagueId = getLeagueId(matchDetails);

  const extras = emptyMatchBundleExtras();
  const jobs = [];

  if (wants(sections, "h2h")) {
    jobs.push(
      postJson("https://api.pitchpredictions.com/api/fetch_h2h_fixtures", {
        home_team_id: homeTeamId,
        away_team_id: awayTeamId,
        fixture_date: fixtureDate,
      }).then((data) => {
        extras.h2hMatches = data || [];
      }),
      postJson("https://api.pitchpredictions.com/api/fetch_h2h_league", {
        home_team_id: homeTeamId,
        away_team_id: awayTeamId,
        fixture_date: fixtureDate,
      }).then((data) => {
        extras.h2hLeagues = data || [];
      })
    );
  }

  if (wants(sections, "last6")) {
    jobs.push(
      postJson(
        "https://api.pitchpredictions.com/api/fetch_last_six_matches_by_home_team",
        { home_team_id: homeTeamId, fixture_date: fixtureDate }
      ).then((data) => {
        extras.homeLast6 = data || [];
      }),
      postJson(
        "https://api.pitchpredictions.com/api/fetch_last_six_matches_by_away_team",
        { away_team_id: awayTeamId, fixture_date: fixtureDate }
      ).then((data) => {
        extras.awayLast6 = data || [];
      }),
      postJson(
        "https://api.pitchpredictions.com/api/fetch_last_6_matches_leagues",
        { home_team_id: homeTeamId, fixture_date: fixtureDate }
      ).then((data) => {
        extras.homeLast6Leagues = data || [];
      }),
      postJson(
        "https://api.pitchpredictions.com/api/fetch_last_6_matches_leagues",
        { home_team_id: awayTeamId, fixture_date: fixtureDate }
      ).then((data) => {
        extras.awayLast6Leagues = data || [];
      })
    );
  }

  if (wants(sections, "upcoming")) {
    jobs.push(
      postJson(
        "https://api.pitchpredictions.com/api/fetch_upcoming_matches_home_team",
        { home_team_id: homeTeamId, fixture_date: fixtureDate }
      ).then((data) => {
        extras.upcomingHome = data || [];
      }),
      postJson(
        "https://api.pitchpredictions.com/api/fetch_upcoming_matches_away_team",
        { away_team_id: awayTeamId, fixture_date: fixtureDate }
      ).then((data) => {
        extras.upcomingAway = data || [];
      })
    );
  }

  if (wants(sections, "standings") && leagueId) {
    jobs.push(
      postJson("https://api.pitchpredictions.com/api/fetch_team_standings", {
        league_id: leagueId,
      }).then((data) => {
        extras.standings = data?.[0]?.standings_data || [];
      })
    );
  }

  if (wants(sections, "trends")) {
    jobs.push(
      getJson(
        `https://api.pitchpredictions.com/api/fetch_trends_data_by_fixture_id?fixture_id=${fixtureIdInteger}`
      )
        .then((data) => {
          extras.trends = isApiSuccess(data) ? data.data || [] : [];
        })
        .catch(() => {
          extras.trends = [];
        })
    );
  }

  if (jobs.length) {
    await Promise.all(jobs);
  }

  return {
    matchData,
    matchDetails,
    homeTeamId,
    awayTeamId,
    fixtureDate,
    leagueId,
    ...extras,
  };
}

/** Lightweight last-6 for header form badges (client or SSR). */
export async function fetchMatchHeaderForm(homeTeamId, awayTeamId, fixtureDate) {
  const [homeLast6, awayLast6] = await Promise.all([
    postJson(
      "https://api.pitchpredictions.com/api/fetch_last_six_matches_by_home_team",
      { home_team_id: homeTeamId, fixture_date: fixtureDate }
    ),
    postJson(
      "https://api.pitchpredictions.com/api/fetch_last_six_matches_by_away_team",
      { away_team_id: awayTeamId, fixture_date: fixtureDate }
    ),
  ]);
  return {
    homeLast6: homeLast6 || [],
    awayLast6: awayLast6 || [],
  };
}

/**
 * Upcoming list only — no N× match-detail enrichment.
 * API returns FixtureResource rows; normalize legacy flat rows from stale cache.
 */
export function normalizeUpcomingFixtureRow(row) {
  if (!row || typeof row !== "object") return row;
  if (row.home_team?.name || row.away_team?.name) return row;

  const datetime = row.date || row.match?.datetime || null;
  return {
    fixture_id: row.fixture_id,
    league_id: row.league_id,
    home_team: {
      id: row.home_team_id ?? null,
      name: row.home_team_name ?? "",
      logo: row.home_team_logo ?? null,
    },
    away_team: {
      id: row.away_team_id ?? null,
      name: row.away_team_name ?? "",
      logo: row.away_team_logo ?? null,
    },
    match: {
      datetime,
      unformatted_date: row.unformatedDate ?? row.unformated_date ?? null,
      status: row.status_short ?? "NS",
    },
    score: {
      home: row.goals_home ?? null,
      away: row.goals_away ?? null,
      half_time: {
        home: row.ht_goals_home ?? null,
        away: row.ht_goals_away ?? null,
      },
    },
    league: {
      id: row.league_id ?? null,
      name: row.league_name ?? "",
      short_name: row.league_short_name ?? "",
    },
    predictions: {
      avg_goals: row.avg_goals ?? null,
      "1x2": {
        home: row.percent_pred_home ?? null,
        draw: row.percent_pred_draw ?? null,
        away: row.percent_pred_away ?? null,
      },
      half_time: {
        home: row.hf_percent_pred_home ?? null,
        draw: row.hf_percent_pred_draw ?? null,
        away: row.hf_percent_pred_away ?? null,
      },
    },
    odds: {
      home: row.bets_home ?? null,
      draw: row.bets_draw ?? null,
      away: row.bets_away ?? null,
    },
  };
}

export async function fetchTeamUpcomingMatches(
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
  return [...(homeMatches || []), ...(awayMatches || [])]
    .map(normalizeUpcomingFixtureRow)
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
    .sort(
      (a, b) =>
        new Date(a.match?.datetime || a.date) -
        new Date(b.match?.datetime || b.date)
    );
}

/** @deprecated use fetchTeamUpcomingMatches — kept for callers */
export async function fetchTeamUpcomingWithPredictions(
  teamId,
  fixtureDate,
  excludeFixtureId = null
) {
  return fetchTeamUpcomingMatches(teamId, fixtureDate, excludeFixtureId);
}

export async function fetchTeamDetailsBundle(
  teamIdInteger,
  { sections = ["all"] } = {}
) {
  const teamsTopData = await getJson(
    `https://api.pitchpredictions.com/api/fetch_teams_details_top?team_id=${teamIdInteger}`
  );

  if (!teamsTopData?.data?.[0]) {
    return null;
  }

  const teamData = teamsTopData.data[0];
  const fixtureDate = getFixtureDate(teamData);
  const leagueId = getLeagueId(teamData);

  const extras = {
    last6Matches: [],
    homeMatches: [],
    awayMatches: [],
    last6Leagues: [],
    homeLeagues: [],
    awayLeagues: [],
    standings: [],
    upcomingFixtures: [],
  };

  const jobs = [];

  if (wants(sections, "last6")) {
    jobs.push(
      postJson(
        "https://api.pitchpredictions.com/api/fetch_teams_matches_both_sides",
        { team_id: teamIdInteger, fixture_date: fixtureDate }
      ).then((data) => {
        extras.last6Matches = data || [];
      }),
      postJson(
        "https://api.pitchpredictions.com/api/fetch_teams_matches_when_home",
        { team_id: teamIdInteger, fixture_date: fixtureDate }
      ).then((data) => {
        extras.homeMatches = data || [];
      }),
      postJson(
        "https://api.pitchpredictions.com/api/fetch_teams_matches_when_away",
        { team_id: teamIdInteger, fixture_date: fixtureDate }
      ).then((data) => {
        extras.awayMatches = data || [];
      })
    );
  }

  if (wants(sections, "leagues") || wants(sections, "last6")) {
    // Single leagues call (was triplicated).
    jobs.push(
      postJson(
        "https://api.pitchpredictions.com/api/fetch_last_6_matches_leagues",
        { home_team_id: teamIdInteger, fixture_date: fixtureDate }
      ).then((data) => {
        const leagues = data || [];
        extras.last6Leagues = leagues;
        extras.homeLeagues = leagues;
        extras.awayLeagues = leagues;
      })
    );
  }

  if (wants(sections, "standings") && leagueId) {
    jobs.push(
      postJson("https://api.pitchpredictions.com/api/fetch_team_standings", {
        league_id: leagueId,
      }).then((data) => {
        extras.standings = data?.[0]?.standings_data || [];
      })
    );
  }

  if (wants(sections, "upcoming")) {
    jobs.push(
      fetchTeamUpcomingMatches(teamIdInteger, fixtureDate, teamData.fixture_id).then(
        (data) => {
          extras.upcomingFixtures = data || [];
        }
      )
    );
  }

  if (jobs.length) {
    await Promise.all(jobs);
  }

  return {
    teamsTopData,
    teamData,
    fixtureDate,
    leagueId,
    ...extras,
  };
}

const TEAM_TAB_REDIRECTS = {
  standings: "standings",
  upcoming: "upcoming-matches",
  players: "players",
};

const MATCH_TAB_REDIRECTS = {
  summary: "overall-statistics",
  odds: "odds",
  matches: "matches",
  standings: "standings",
  upcoming: "upcoming-matches",
};

export function getLegacyTeamTabRedirect(slug, tab) {
  if (!tab || tab === "results") return null;
  const segment = TEAM_TAB_REDIRECTS[tab];
  if (!segment) return null;
  return {
    redirect: { destination: `/team/${slug}/${segment}`, permanent: false },
  };
}

export function getLegacyMatchTabRedirect(slug, tab) {
  if (!tab) return null;
  const segment = MATCH_TAB_REDIRECTS[tab];
  if (!segment) return null;
  return {
    redirect: { destination: `/match/${slug}/${segment}`, permanent: false },
  };
}

const bundleServerCache = new Map();
const SERVER_BUNDLE_TTL_MS = 45_000;
const pendingServerBundles = new Map();

function readServerBundleCache(key) {
  const entry = bundleServerCache.get(key);
  if (!entry) return undefined;
  if (Date.now() - entry.at > SERVER_BUNDLE_TTL_MS) {
    bundleServerCache.delete(key);
    return undefined;
  }
  return entry.data;
}

function writeServerBundleCache(key, data) {
  if (data) {
    bundleServerCache.set(key, { at: Date.now(), data });
  }
}

export async function fetchTeamDetailsBundleCached(
  teamIdInteger,
  options = {}
) {
  const sectionsKey = (options.sections || ["all"]).slice().sort().join(",");
  const key = `team:${teamIdInteger}:${sectionsKey}`;
  const cached = readServerBundleCache(key);
  if (cached !== undefined) return cached;

  if (pendingServerBundles.has(key)) {
    return pendingServerBundles.get(key);
  }

  const promise = fetchTeamDetailsBundle(teamIdInteger, options)
    .then((data) => {
      writeServerBundleCache(key, data);
      return data;
    })
    .finally(() => {
      pendingServerBundles.delete(key);
    });

  pendingServerBundles.set(key, promise);
  return promise;
}

export async function fetchMatchDetailsBundleCached(
  fixtureIdInteger,
  options = {}
) {
  const sectionsKey = (options.sections || ["all"]).slice().sort().join(",");
  const key = `match:${fixtureIdInteger}:${sectionsKey}`;
  const cached = readServerBundleCache(key);
  if (cached !== undefined) return cached;

  if (pendingServerBundles.has(key)) {
    return pendingServerBundles.get(key);
  }

  const promise = fetchMatchDetailsBundle(fixtureIdInteger, options)
    .then((data) => {
      writeServerBundleCache(key, data);
      return data;
    })
    .finally(() => {
      pendingServerBundles.delete(key);
    });

  pendingServerBundles.set(key, promise);
  return promise;
}

function matchTabFromContext(context) {
  const path = context.resolvedUrl || context.req?.url || "";
  if (path.includes("/odds")) return "odds";
  if (path.includes("/matches")) return "matches";
  if (path.includes("/standings")) return "standings";
  if (path.includes("/upcoming-matches")) return "upcoming-matches";
  return "overall-statistics";
}

function teamTabFromContext(context) {
  const path = context.resolvedUrl || context.req?.url || "";
  if (path.includes("/standings")) return "standings";
  if (path.includes("/upcoming-matches")) return "upcoming-matches";
  if (path.includes("/players")) return "players";
  return "results";
}

export async function loadTeamPageContext(context, options = {}) {
  const slug = context.params?.["team-details"] || "";
  const tabRedirect = getLegacyTeamTabRedirect(slug, context.query?.tab);
  if (tabRedirect) return tabRedirect;

  const teamIdInteger = parseTeamIdFromSlug(slug);
  if (!teamIdInteger) return { notFound: true };

  const tab = options.tab || teamTabFromContext(context);
  const sections = options.sections || TEAM_TAB_SECTIONS[tab] || ["last6"];

  try {
    const bundle = await fetchTeamDetailsBundleCached(teamIdInteger, {
      sections,
    });
    if (!bundle) return { notFound: true };
    return { slug, teamIdInteger, bundle, tab };
  } catch (error) {
    // API/timeout failure — do not map to 404.
    console.error("SSR team fetch error:", error);
    return {
      slug,
      teamIdInteger,
      softError: true,
      message: error?.message || "Failed to load team details",
    };
  }
}

export async function loadMatchPageContext(context, options = {}) {
  const slug = context.params?.["match-details"] || "";
  const tabRedirect = getLegacyMatchTabRedirect(slug, context.query?.tab);
  if (tabRedirect) return tabRedirect;

  const fixtureIdInteger = parseFixtureIdFromSlug(slug);
  if (!fixtureIdInteger) {
    return { notFound: true };
  }

  const tab = options.tab || matchTabFromContext(context);
  const sections = options.sections || MATCH_TAB_SECTIONS[tab] || [];

  try {
    const bundle = await fetchMatchDetailsBundleCached(fixtureIdInteger, {
      sections,
    });
    if (!bundle) {
      return { notFound: true };
    }
    return { slug, fixtureIdInteger, bundle, tab };
  } catch (error) {
    // API/timeout failure — do not map to 404 / home redirect.
    console.error("Error fetching match data:", error);
    return {
      slug,
      fixtureIdInteger,
      softError: true,
      message: error?.message || "Failed to load match details",
    };
  }
}
