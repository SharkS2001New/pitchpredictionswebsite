import React from "react";

function formatOdd(value) {
  if (value === null || value === undefined || value === "") {
    return "-";
  }

  return value;
}

function OddsRow({ label, value }) {
  return (
    <div className="responsive-row fixturesTextSize matchDetailsLink" style={{ cursor: "auto" }}>
      <div className="responsive-cell team-link" style={{ textAlign: "left" }}>
        {label}
      </div>
      <div className="responsive-cell team-link-probability" style={{ textAlign: "right", fontWeight: "bold" }}>
        {formatOdd(value)}
      </div>
    </div>
  );
}

function OddsSection({ title, rows }) {
  const visibleRows = rows.filter((row) => row.value !== null && row.value !== undefined && row.value !== "");

  if (visibleRows.length === 0) {
    return null;
  }

  return (
    <div className="mb-4">
      <div className="text-center fw-bold sectionTitle">{title}</div>
      <div className="responsive-row header matchdetailsheader" style={{ cursor: "auto" }}>
        <div className="responsive-cell team-link" style={{ textAlign: "left" }}>
          Market
        </div>
        <div className="responsive-cell team-link-probability" style={{ textAlign: "right" }}>
          Odds
        </div>
      </div>
      {visibleRows.map((row) => (
        <OddsRow key={row.label} label={row.label} value={row.value} />
      ))}
    </div>
  );
}

function MatchOddsDisplay({ match, homeTeamName, awayTeamName }) {
  const odds = match?.odds || {};
  const doubleChance = odds.double_chance || {};
  const overUnder = odds.over_under || {};
  const btts = odds.btts || {};
  const htFt = odds.ht_ft || {};

  const sections = [
    {
      title: "1x2 Odds",
      rows: [
        { label: `${homeTeamName} Wins (1)`, value: odds.home },
        { label: "Teams Draw (X)", value: odds.draw },
        { label: `${awayTeamName} Wins (2)`, value: odds.away },
      ],
    },
    {
      title: "Double Chance Odds",
      rows: [
        { label: "Home/Draw", value: doubleChance.home_draw },
        { label: "Home/Away", value: doubleChance.home_away },
        { label: "Draw/Away", value: doubleChance.draw_away },
      ],
    },
    {
      title: "Over/Under 2.5 Odds",
      rows: [
        { label: "Over 2.5", value: overUnder.over_2_5 },
        { label: "Under 2.5", value: overUnder.under_2_5 },
      ],
    },
    {
      title: "Both Teams To Score Odds",
      rows: [
        { label: "Yes", value: btts.yes },
        { label: "No", value: btts.no },
      ],
    },
    {
      title: "Half-Time Result Odds",
      rows: [
        { label: `${homeTeamName} HT (1)`, value: htFt.ht_home },
        { label: "Draw HT (X)", value: htFt.ht_draw },
        { label: `${awayTeamName} HT (2)`, value: htFt.ht_away },
      ],
    },
  ];

  const hasAnyOdds = sections.some((section) =>
    section.rows.some(
      (row) => row.value !== null && row.value !== undefined && row.value !== ""
    )
  );

  if (!hasAnyOdds) {
    return (
      <div className="text-center fixturesTextSize p-3">
        Odds are not available for this match yet.
      </div>
    );
  }

  return (
    <div className="p-2">
      {sections.map((section) => (
        <OddsSection key={section.title} title={section.title} rows={section.rows} />
      ))}
    </div>
  );
}

export default MatchOddsDisplay;
