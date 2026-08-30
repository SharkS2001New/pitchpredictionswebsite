"use client";

import { useEffect, useRef, useState } from "react";
import {
  formatFixtureDateTime,
  resolveFixtureDateTime,
} from "../functions/DatetimeToUsersTimezone";

function getTip(match) {
  const { percent_pred_home, percent_pred_draw, percent_pred_away } = match;
  if (percent_pred_home > percent_pred_draw && percent_pred_home > percent_pred_away) {
    return "1" + ",    " + percent_pred_home + " Win Probability";
  }
  if (percent_pred_draw > percent_pred_home && percent_pred_draw > percent_pred_away) {
    return "X" + ",    " + percent_pred_draw + " Win Probability";
  }
  return "2" + ",    " + percent_pred_away + " Win Probability";
}

function PopularTipsContent() {
  const [matches, setMatches] = useState(null);
  const sliderRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    const loadMatches = () => {
      fetch("/api/popular-tips")
        .then((response) => (response.ok ? response.json() : null))
        .then((data) => {
          if (!cancelled) {
            setMatches(data?.data?.length ? data.data : []);
          }
        })
        .catch(() => {
          if (!cancelled) {
            setMatches([]);
          }
        });
    };

    if ("requestIdleCallback" in window) {
      const idleId = window.requestIdleCallback(loadMatches, { timeout: 2000 });
      return () => {
        cancelled = true;
        window.cancelIdleCallback(idleId);
      };
    }

    const timeoutId = window.setTimeout(loadMatches, 0);
    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, []);

  if (!matches?.length) {
    return null;
  }

  const scrollLeft = () => {
    sliderRef.current?.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    sliderRef.current?.scrollBy({ left: 300, behavior: "smooth" });
  };

  return (
    <>
      <div className="desktop-container-resize mb-0">
        <div className="col-sm-12 text-center bg-light pt-1">
          <h2 className="sectionTitle">UPCOMING POPULAR MATCHES</h2>
        </div>
      </div>
      <div className="match-slider-container">
        <button type="button" className="slider-btn left-btn" onClick={scrollLeft}>
          &#8249;
        </button>
        <div className="match-slider" ref={sliderRef}>
          {matches.map((match, index) => (
            <div key={match.fixture_id || match.id || index} className="match-card">
              <div className="date-bar">
                <span style={{ color: "#212830" }}>
                  Date: {formatFixtureDateTime(resolveFixtureDateTime(match))}
                </span>
              </div>
              <div className="match-header">
                <div className="team">
                  <div className="team-logo-container">
                    <img
                      src={match.home_team_logo}
                      alt={match.home_team_name}
                      className="team-logo"
                    />
                  </div>
                  <p className="team-name">{match.home_team_name}</p>
                </div>

                <div className="vs">vs</div>

                <div className="team">
                  <div className="team-logo-container">
                    <img
                      src={match.away_team_logo}
                      alt={match.away_team_name}
                      className="team-logo"
                    />
                  </div>
                  <p className="team-name">{match.away_team_name}</p>
                </div>
              </div>

              <div className="tip-bar">
                <div className="tip-value">
                  Tip: <strong>{getTip(match)}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button type="button" className="slider-btn right-btn" onClick={scrollRight}>
          &#8250;
        </button>
      </div>
    </>
  );
}

/** SSR: empty div only. Popular matches mount client-side via createRoot. */
export default function PopularTips() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let cancelled = false;
    let root;

    const mountPopularTips = async () => {
      const [{ createRoot }] = await Promise.all([import("react-dom/client")]);

      if (cancelled || !containerRef.current) return;

      root = createRoot(containerRef.current);
      root.render(<PopularTipsContent />);
    };

    if ("requestIdleCallback" in window) {
      const idleId = window.requestIdleCallback(mountPopularTips, { timeout: 2000 });
      return () => {
        cancelled = true;
        window.cancelIdleCallback(idleId);
        queueMicrotask(() => root?.unmount());
      };
    }

    const timeoutId = window.setTimeout(mountPopularTips, 0);
    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
      queueMicrotask(() => root?.unmount());
    };
  }, []);

  return <div ref={containerRef} />;
}
