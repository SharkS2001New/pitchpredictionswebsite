import { useEffect, useRef } from "react";

const CLIENT_CACHE_MS = 60_000;
const teamBundles = new Map();
const matchBundles = new Map();
const pendingTeamFetches = new Map();
const pendingMatchFetches = new Map();

function isFresh(entry) {
  return entry && Date.now() - entry.fetchedAt < CLIENT_CACHE_MS;
}

export function serializeTeamBundleForClient(bundle) {
  if (!bundle) return null;
  return {
    teamsTopData: bundle.teamsTopData,
    last6Matches: bundle.last6Matches || [],
    homeMatches: bundle.homeMatches || [],
    awayMatches: bundle.awayMatches || [],
    last6Leagues: bundle.last6Leagues || [],
    homeLeagues: bundle.homeLeagues || [],
    awayLeagues: bundle.awayLeagues || [],
    standings: bundle.standings || [],
    upcomingFixtures: bundle.upcomingFixtures || [],
  };
}

export function serializeMatchBundleForClient(bundle) {
  if (!bundle) return null;
  return {
    matchData: bundle.matchData,
    h2hMatches: bundle.h2hMatches || [],
    h2hLeagues: bundle.h2hLeagues || [],
    homeLast6: bundle.homeLast6 || [],
    awayLast6: bundle.awayLast6 || [],
    homeLast6Leagues: bundle.homeLast6Leagues || [],
    awayLast6Leagues: bundle.awayLast6Leagues || [],
    upcomingHome: bundle.upcomingHome || [],
    upcomingAway: bundle.upcomingAway || [],
    standings: bundle.standings || [],
    trends: bundle.trends || [],
  };
}

export function seedTeamBundleCache(teamId, bundle) {
  if (!teamId || !bundle) return;
  teamBundles.set(String(teamId), {
    bundle,
    fetchedAt: Date.now(),
  });
}

export function seedMatchBundleCache(fixtureId, bundle) {
  if (!fixtureId || !bundle) return;
  matchBundles.set(String(fixtureId), {
    bundle,
    fetchedAt: Date.now(),
  });
}

export function getCachedTeamBundle(teamId) {
  const entry = teamBundles.get(String(teamId));
  return isFresh(entry) ? entry.bundle : null;
}

export function getCachedMatchBundle(fixtureId) {
  const entry = matchBundles.get(String(fixtureId));
  return isFresh(entry) ? entry.bundle : null;
}

export async function prefetchTeamBundle(teamId) {
  if (!teamId) return null;

  const cached = getCachedTeamBundle(teamId);
  if (cached) return cached;

  const key = String(teamId);
  if (pendingTeamFetches.has(key)) {
    return pendingTeamFetches.get(key);
  }

  const promise = fetch(`/api/prefetch/team-details?teamId=${teamId}`)
    .then((response) => (response.ok ? response.json() : null))
    .then((data) => {
      if (data?.bundle) {
        seedTeamBundleCache(teamId, data.bundle);
        return data.bundle;
      }
      return null;
    })
    .catch(() => null)
    .finally(() => {
      pendingTeamFetches.delete(key);
    });

  pendingTeamFetches.set(key, promise);
  return promise;
}

export async function prefetchMatchBundle(fixtureId) {
  if (!fixtureId) return null;

  const cached = getCachedMatchBundle(fixtureId);
  if (cached) return cached;

  const key = String(fixtureId);
  if (pendingMatchFetches.has(key)) {
    return pendingMatchFetches.get(key);
  }

  const promise = fetch(
    `/api/prefetch/match-details?fixtureId=${fixtureId}`
  )
    .then((response) => (response.ok ? response.json() : null))
    .then((data) => {
      if (data?.bundle) {
        seedMatchBundleCache(fixtureId, data.bundle);
        return data.bundle;
      }
      return null;
    })
    .catch(() => null)
    .finally(() => {
      pendingMatchFetches.delete(key);
    });

  pendingMatchFetches.set(key, promise);
  return promise;
}

export function prefetchTeamTabRoutes(router, teamSlug, showStandings = true) {
  if (!router || !teamSlug) return;

  const basePath = `/team/${teamSlug}`;
  router.prefetch(`${basePath}/results`);
  if (showStandings) router.prefetch(`${basePath}/standings`);
  router.prefetch(`${basePath}/upcoming-matches`);
  router.prefetch(`${basePath}/players`);
}

export function prefetchMatchTabRoutes(
  router,
  matchSlug,
  showStandings = true
) {
  if (!router || !matchSlug) return;

  const basePath = `/match/${matchSlug}`;
  router.prefetch(`${basePath}/overall-statistics`);
  router.prefetch(`${basePath}/odds`);
  router.prefetch(`${basePath}/matches`);
  if (showStandings) router.prefetch(`${basePath}/standings`);
  router.prefetch(`${basePath}/upcoming-matches`);
}

export function usePrefetchTeamTabs({
  router,
  teamIdInteger,
  teamSlug,
  showStandings,
  bundleSnapshot,
}) {
  const seededRef = useRef(false);

  useEffect(() => {
    if (!router?.isReady || !teamSlug || !teamIdInteger) return;

    if (bundleSnapshot && !seededRef.current) {
      seedTeamBundleCache(teamIdInteger, bundleSnapshot);
      seededRef.current = true;
    }

    prefetchTeamTabRoutes(router, teamSlug, showStandings);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- prefetch once per entity/route set
  }, [router?.isReady, teamIdInteger, teamSlug, showStandings]);
}

export function usePrefetchMatchTabs({
  router,
  fixtureIdInteger,
  matchSlug,
  showStandings,
  bundleSnapshot,
}) {
  const seededRef = useRef(false);

  useEffect(() => {
    if (!router?.isReady || !matchSlug || !fixtureIdInteger) return;

    if (bundleSnapshot && !seededRef.current) {
      seedMatchBundleCache(fixtureIdInteger, bundleSnapshot);
      seededRef.current = true;
    }

    // Route-only prefetch — do not pull full H2H/standings/upcoming bundle on every tab.
    prefetchMatchTabRoutes(router, matchSlug, showStandings);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- prefetch once per entity/route set
  }, [router?.isReady, fixtureIdInteger, matchSlug, showStandings]);
}
