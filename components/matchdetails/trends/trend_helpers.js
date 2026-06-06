export function getTeamPerformance(overallD) {
  if (!overallD?.teams_perfomance_per_fixture) {
    return null;
  }

  try {
    return typeof overallD.teams_perfomance_per_fixture === "string"
      ? JSON.parse(overallD.teams_perfomance_per_fixture)
      : overallD.teams_perfomance_per_fixture;
  } catch {
    return null;
  }
}

export function hasDetailedTrendData(overallData = []) {
  return overallData.some((item) => getTeamPerformance(item) !== null);
}
