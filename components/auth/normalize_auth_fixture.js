function formatPercent(value) {
  if (value == null || value === "") return "0%";
  const stringValue = String(value);
  return stringValue.includes("%") ? stringValue : `${stringValue}%`;
}

function parsePercentNumber(value) {
  if (value == null || value === "") return 0;
  const parsed = parseInt(String(value).replace("%", ""), 10);
  return Number.isNaN(parsed) ? 0 : parsed;
}

export function normalizeAuthDate(dateValue) {
  if (!dateValue) return dateValue;

  const stringValue = String(dateValue);

  if (/^\d{2}\/\d{2}\/\d{4}/.test(stringValue)) {
    const [datePart, timePart = "00:00"] = stringValue.split(" ");
    const [day, month, year] = datePart.split("/");
    return `${year}-${month}-${day}T${timePart.length === 5 ? `${timePart}:00` : timePart}`;
  }

  return dateValue;
}

function normalizeNestedFixture(fixture) {
  const predictions = fixture.predictions || {};
  const oneXTwo = predictions["1x2"] || {};
  const doubleChance = predictions.double_chance || {};
  const overUnder = predictions.over_under_2_5 || {};

  let tip = fixture.tip || doubleChance.type || overUnder.prediction || null;
  if (!tip && oneXTwo.home != null) {
    const home = parsePercentNumber(oneXTwo.home);
    const draw = parsePercentNumber(oneXTwo.draw);
    const away = parsePercentNumber(oneXTwo.away);
    const max = Math.max(home, draw, away);
    if (max === home) tip = "1";
    else if (max === draw) tip = "X";
    else tip = "2";
  }

  return {
    fixture_id: fixture.fixture_id,
    home_team_name: fixture.home_team?.name || "",
    away_team_name: fixture.away_team?.name || "",
    home_team_logo: fixture.home_team?.logo || fixture.home_team_logo,
    away_team_logo: fixture.away_team?.logo || fixture.away_team_logo,
    date: normalizeAuthDate(
      fixture.match?.datetime || fixture.match?.unformatted_date || fixture.date
    ),
    unformatedDate:
      fixture.match?.unformatted_date || fixture.unformatedDate || fixture.unformatted_date,
    goals_home: fixture.score?.home ?? fixture.goals_home ?? null,
    goals_away: fixture.score?.away ?? fixture.goals_away ?? null,
    ht_goals_home: fixture.score?.half_time?.home ?? fixture.ht_goals_home ?? null,
    ht_goals_away: fixture.score?.half_time?.away ?? fixture.ht_goals_away ?? null,
    percent_pred_home: formatPercent(oneXTwo.home ?? fixture.percent_pred_home),
    percent_pred_draw: formatPercent(oneXTwo.draw ?? fixture.percent_pred_draw),
    percent_pred_away: formatPercent(oneXTwo.away ?? fixture.percent_pred_away),
    league_name: fixture.league?.name || fixture.league_name,
    country_name: fixture.league?.country || fixture.country_name,
    average_goals:
      predictions.avg_goals ??
      fixture.average_goals ??
      fixture.avg_goals ??
      "-",
    tip,
    teams_perfomance_home_for: fixture.teams_perfomance_home_for,
    teams_perfomance_home_aganist: fixture.teams_perfomance_home_aganist,
    teams_perfomance_away_for: fixture.teams_perfomance_away_for,
    teams_perfomance_away_aganist: fixture.teams_perfomance_away_aganist,
    teams_games_played_home: fixture.teams_games_played_home,
    teams_games_played_away: fixture.teams_games_played_away,
    predictions,
  };
}

function normalizeLegacyFixture(fixture) {
  return {
    ...fixture,
    date: normalizeAuthDate(fixture.date),
    percent_pred_home: formatPercent(fixture.percent_pred_home),
    percent_pred_draw: formatPercent(fixture.percent_pred_draw),
    percent_pred_away: formatPercent(fixture.percent_pred_away),
    average_goals: fixture.average_goals ?? fixture.avg_goals ?? "-",
  };
}

export function normalizeAuthFixture(fixture) {
  if (!fixture) return null;

  if (fixture.home_team?.name && !fixture.home_team_name) {
    return normalizeNestedFixture(fixture);
  }

  return normalizeLegacyFixture(fixture);
}

export function normalizeAuthFixtureList(fixtures) {
  if (!Array.isArray(fixtures)) return [];
  return fixtures.map(normalizeAuthFixture).filter(Boolean);
}

export function normalizeAuthApiResponse(response) {
  const data = normalizeAuthFixtureList(response?.data);
  return {
    ...response,
    status: response?.status ?? data.length > 0,
    data,
  };
}
