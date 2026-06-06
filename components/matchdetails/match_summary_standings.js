import React from "react";
import StandingsFormWinLose from "../functions/standings_win_lose_form";
import assignColorToDescription from "../functions/standing_description_color";

function MatchSummaryStandings({ standingsData, homeTeamId, awayTeamId, leagueName }) {
  if (
    !standingsData ||
    (typeof standingsData === "string" && standingsData.length === 0) ||
    (Array.isArray(standingsData) && standingsData.length === 0)
  ) {
    return null;
  }

  let allStandings = [];

  try {
    const parsed =
      typeof standingsData === "string" ? JSON.parse(standingsData) : standingsData;
    allStandings = Array.isArray(parsed?.[0]) ? parsed[0] : Array.isArray(parsed) ? parsed : [];
  } catch {
    return null;
  }

  const matchStandings = allStandings.filter(
    (standing) =>
      standing.team?.id === homeTeamId || standing.team?.id === awayTeamId
  );

  if (matchStandings.length === 0) {
    return null;
  }

  const rankByTeamId = allStandings.reduce((acc, standing, index) => {
    if (standing.team?.id) {
      acc[standing.team.id] = index + 1;
    }
    return acc;
  }, {});

  return (
    <div className="fixturesTextSize mt-3">
      <div className="text-center fw-bold sectionTitle">
        {leagueName ? `${leagueName} Standings` : "Standings"}
      </div>
      <div className="responsive-wrapper">
        <div className="responsive-row header standingsheader" style={{ cursor: "auto" }}>
          <div className="responsive-cell team-link-standings" title="Position">
            POS
          </div>
          <div className="responsive-cell team-link" title="Team Name">
            TEAM
          </div>
          <div className="responsive-cell" title="Matches Played">
            MP
          </div>
          <div className="responsive-cell" title="Wins">
            W
          </div>
          <div className="responsive-cell" title="Draw">
            D
          </div>
          <div className="responsive-cell" title="Losses">
            L
          </div>
          <div className="responsive-cell" title="Goals For">
            GF
          </div>
          <div className="responsive-cell" title="Goals Against">
            GA
          </div>
          <div className="responsive-cell" title="Goal Difference">
            +/-
          </div>
          <div className="responsive-cell" title="Points">
            PTS
          </div>
          {matchStandings[0]?.form != null ? (
            <div className="responsive-cell team-link-y hide-on-mobile" title="Form"></div>
          ) : (
            <div className="responsive-cell team-link-y hide-on-mobile"></div>
          )}
        </div>

        {matchStandings.map((standing) => {
          const rank = rankByTeamId[standing.team.id] || "-";
          const descriptionColor = standing.description
            ? assignColorToDescription(standing.description).color
            : "";

          return (
            <React.Fragment key={standing.team.id}>
              <div className="responsive-row" style={{ backgroundColor: "#FAEBD7", cursor: "auto" }}>
                <div className="responsive-cell team-link-standings">
                  <span
                    style={{
                      backgroundColor: descriptionColor || "transparent",
                      color: standing.description ? "white" : "black",
                      border: descriptionColor ? `1px solid ${descriptionColor}` : "none",
                      borderRadius: "5px",
                    }}
                    title={standing.description}
                  >
                    &nbsp;{rank}.&nbsp;
                  </span>
                </div>
                <div className="responsive-cell team-link" style={{ textAlign: "left" }}>
                  <a
                    href={encodeURI(
                      "/team/" +
                        standing.team.name.toLowerCase().replace(/\s+/g, "-") +
                        "-" +
                        standing.team.id +
                        "/results"
                    )}
                  >
                    {standing.team.name}
                  </a>
                </div>
                <div className="responsive-cell">{standing.all.played}</div>
                <div className="responsive-cell">{standing.all.win}</div>
                <div className="responsive-cell">{standing.all.draw}</div>
                <div className="responsive-cell">{standing.all.lose}</div>
                <div className="responsive-cell">{standing.all.goals.for}</div>
                <div className="responsive-cell">{standing.all.goals.against}</div>
                <div className="responsive-cell">{standing.goalsDiff}</div>
                <div className="responsive-cell" style={{ fontWeight: "bold" }}>
                  {standing.points}
                </div>
                {standing.form != null ? (
                  <div
                    className="responsive-cell team-link-y hide-on-mobile"
                    style={{ display: "flex" }}
                  >
                    {StandingsFormWinLose(standing.form, rank)}
                  </div>
                ) : (
                  <div className="responsive-cell team-link-y hide-on-mobile"></div>
                )}
              </div>
              <br />
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

export default MatchSummaryStandings;
