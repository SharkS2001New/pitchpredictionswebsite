export default function dedupeFixturesById(fixtures = []) {
  if (!Array.isArray(fixtures)) return [];

  const seen = new Set();
  const unique = [];

  for (const fixture of fixtures) {
    const fixtureId = fixture?.fixture_id;
    const key =
      fixtureId != null ? String(fixtureId) : JSON.stringify(fixture ?? null);

    if (seen.has(key)) continue;

    seen.add(key);
    unique.push(fixture);
  }

  return unique;
}
