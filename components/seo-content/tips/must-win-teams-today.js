export default function MustWinTeamsTodayContent() {
  return (
    <div 
      id="seo-content" 
      style={{ 
        maxWidth: '1200px', 
        margin: '48px auto 0', 
        padding: '0 10px 30px' 
      }}
    >
      {/* ── WHAT IS A MUST-WIN TEAM? ── */}
      <section aria-labelledby="explainer-heading" style={{ marginBottom: '44px' }}>
        <h2 
          id="explainer-heading" 
          style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '14px' }}
        >
          What Is a Must Win Team in Football?
        </h2>
        <p style={{ fontSize: '0.97rem', lineHeight: 1.85, marginBottom: '14px' }}>
          In football analysis, a <strong>must-win team</strong> refers to a side where multiple independent data points — form, head-to-head record, squad strength, home advantage — all point in the same direction. It is not a prediction that the match has a guaranteed outcome. Football is unpredictable by nature. What it does mean is that one team enters the fixture with a clear, measurable statistical edge.
        </p>
        <p style={{ fontSize: '0.97rem', lineHeight: 1.85, marginBottom: '14px' }}>
          At Pitch Predictions, we identify must-win teams by cross-referencing at least four key data signals before any team appears on this page. Low-confidence matches are deliberately excluded. Only those with strong multi-factor alignment make the cut.
        </p>
        <p style={{ fontSize: '0.97rem', lineHeight: 1.85 }}>
          This page is updated every morning with that day's selections. You can also use the date navigation above to explore upcoming fixtures in advance.
        </p>
      </section>

      {/* ── HOW WE SELECT MUST-WIN TEAMS ── */}
      <section aria-labelledby="methodology-heading" style={{ marginBottom: '44px' }}>
        <h2 
          id="methodology-heading" 
          style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '14px' }}
        >
          How We Select Today's Must-Win Teams
        </h2>
        <p style={{ fontSize: '0.97rem', lineHeight: 1.85, marginBottom: '20px' }}>
          Every selection on this page passes through a structured evaluation process. Here's what we look at:
        </p>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', 
          gap: '14px', 
          marginBottom: '20px' 
        }}>
          <article style={{ 
            padding: '18px 20px', 
            borderRadius: '10px', 
            border: '1px solid rgba(255,255,255,0.07)', 
            background: 'rgba(255,255,255,0.03)' 
          }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '7px' }}>📈 Recent League Form</h3>
            <p style={{ fontSize: '0.88rem', lineHeight: 1.7, opacity: 0.82 }}>
              We review each team's last 5 and last 10 matches — wins, draws, losses, goals scored and conceded — to assess current momentum and consistency.
            </p>
          </article>

          <article style={{ 
            padding: '18px 20px', 
            borderRadius: '10px', 
            border: '1px solid rgba(255,255,255,0.07)', 
            background: 'rgba(255,255,255,0.03)' 
          }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '7px' }}>⚔️ Head-to-Head History</h3>
            <p style={{ fontSize: '0.88rem', lineHeight: 1.7, opacity: 0.82 }}>
              Historical matchups between the two sides reveal patterns that current form alone can miss — psychological edges, tactical familiarity and historical dominance.
            </p>
          </article>

          <article style={{ 
            padding: '18px 20px', 
            borderRadius: '10px', 
            border: '1px solid rgba(255,255,255,0.07)', 
            background: 'rgba(255,255,255,0.03)' 
          }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '7px' }}>🏟️ Home & Away Record</h3>
            <p style={{ fontSize: '0.88rem', lineHeight: 1.7, opacity: 0.82 }}>
              A team's form at home versus away is tracked separately. Home advantage is a well-documented statistical factor — and we weight it accordingly.
            </p>
          </article>

          <article style={{ 
            padding: '18px 20px', 
            borderRadius: '10px', 
            border: '1px solid rgba(255,255,255,0.07)', 
            background: 'rgba(255,255,255,0.03)' 
          }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '7px' }}>🏥 Squad Availability</h3>
            <p style={{ fontSize: '0.88rem', lineHeight: 1.7, opacity: 0.82 }}>
              Confirmed injuries, suspensions and rotation decisions are factored in. The absence of a key player can shift the balance of a match significantly.
            </p>
          </article>

          <article style={{ 
            padding: '18px 20px', 
            borderRadius: '10px', 
            border: '1px solid rgba(255,255,255,0.07)', 
            background: 'rgba(255,255,255,0.03)' 
          }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '7px' }}>💹 Odds & Market Movement</h3>
            <p style={{ fontSize: '0.88rem', lineHeight: 1.7, opacity: 0.82 }}>
              Sustained movement in the betting market toward one side often reflects information the public hasn't fully processed yet. We monitor line shifts across bookmakers.
            </p>
          </article>

          <article style={{ 
            padding: '18px 20px', 
            borderRadius: '10px', 
            border: '1px solid rgba(255,255,255,0.07)', 
            background: 'rgba(255,255,255,0.03)' 
          }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '7px' }}>🎯 Match Importance</h3>
            <p style={{ fontSize: '0.88rem', lineHeight: 1.7, opacity: 0.82 }}>
              Is one team fighting relegation while the other has nothing to play for? Motivation and context matter — especially late in the season or during cup competitions.
            </p>
          </article>
        </div>
      </section>

      {/* ── TIPS FOR USING THIS PAGE ── */}
      <section aria-labelledby="tips-heading" style={{ marginBottom: '44px' }}>
        <h2 
          id="tips-heading" 
          style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '14px' }}
        >
          How to Use Must-Win Team Picks Responsibly
        </h2>
        <p style={{ fontSize: '0.97rem', lineHeight: 1.85, marginBottom: '14px' }}>
          Must-win selections are a starting point for your own research — not a substitute for it. Here are a few things to keep in mind when using this page:
        </p>
        <ul style={{ paddingLeft: '22px', marginBottom: '14px' }}>
          <li style={{ fontSize: '0.95rem', lineHeight: 1.8, marginBottom: '8px' }}>
            <strong>Cross-reference with the match stats page.</strong> Click through to any match listing to see the full head-to-head table, form guide and goal averages before deciding.
          </li>
          <li style={{ fontSize: '0.95rem', lineHeight: 1.8, marginBottom: '8px' }}>
            <strong>Check the league context.</strong> A team strong on paper may rotate their squad in a domestic cup or play cautiously with a European tie ahead.
          </li>
          <li style={{ fontSize: '0.95rem', lineHeight: 1.8, marginBottom: '8px' }}>
            <strong>Use the <a href="/team-comparison" style={{ color: 'inherit', textDecoration: 'underline' }}>Team Comparison tool</a></strong> to go deeper on any specific fixture — side-by-side stats, recent results and goal patterns.
          </li>
          <li style={{ fontSize: '0.95rem', lineHeight: 1.8, marginBottom: '8px' }}>
            <strong>Manage your stakes sensibly.</strong> Even strong favourites lose. Never stake more than you can afford to lose on any single selection.
          </li>
        </ul>
      </section>

      {/* ── FAQ SECTION ── */}
      <section aria-labelledby="faq-heading" style={{ marginBottom: '44px' }}>
        <h2 
          id="faq-heading" 
          style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '20px' }}
        >
          Frequently Asked Questions
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          <details style={{ borderBottom: '1px solid rgba(255,255,255,0.09)', padding: '16px 0' }} open>
            <summary style={{ 
              fontSize: '0.97rem', 
              fontWeight: 600, 
              cursor: 'pointer', 
              listStyle: 'none', 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center' 
            }}>
              What does "must-win team" mean in football predictions?
              <span aria-hidden="true" style={{ fontSize: '1.1rem', opacity: 0.45, flexShrink: 0, marginLeft: '12px' }}>+</span>
            </summary>
            <p style={{ fontSize: '0.92rem', lineHeight: 1.8, marginTop: '12px', opacity: 0.82 }}>
              A must-win team is a side identified as having a meaningful statistical advantage in a given match. It is based on current form, head-to-head records, home/away performance, squad availability and betting market data. It does not mean the outcome is certain — it means the data consistently supports one team over the other.
            </p>
          </details>

          <details style={{ borderBottom: '1px solid rgba(255,255,255,0.09)', padding: '16px 0' }}>
            <summary style={{ 
              fontSize: '0.97rem', 
              fontWeight: 600, 
              cursor: 'pointer', 
              listStyle: 'none', 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center' 
            }}>
              How does Pitch Predictions select must-win teams?
              <span aria-hidden="true" style={{ fontSize: '1.1rem', opacity: 0.45, flexShrink: 0, marginLeft: '12px' }}>+</span>
            </summary>
            <p style={{ fontSize: '0.92rem', lineHeight: 1.8, marginTop: '12px', opacity: 0.82 }}>
              Each selection passes through a six-factor model: recent league form, H2H records, home/away win rates, squad fitness, betting line movement, and match importance. We only list teams where at least four of these six factors align in the same direction.
            </p>
          </details>

          <details style={{ borderBottom: '1px solid rgba(255,255,255,0.09)', padding: '16px 0' }}>
            <summary style={{ 
              fontSize: '0.97rem', 
              fontWeight: 600, 
              cursor: 'pointer', 
              listStyle: 'none', 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center' 
            }}>
              Are the must-win tips free?
              <span aria-hidden="true" style={{ fontSize: '1.1rem', opacity: 0.45, flexShrink: 0, marginLeft: '12px' }}>+</span>
            </summary>
            <p style={{ fontSize: '0.92rem', lineHeight: 1.8, marginTop: '12px', opacity: 0.82 }}>
              Yes, completely. All must-win selections on this page are free. A premium tier is available for early-access picks and higher-confidence exclusive tips.
            </p>
          </details>

          <details style={{ borderBottom: '1px solid rgba(255,255,255,0.09)', padding: '16px 0' }}>
            <summary style={{ 
              fontSize: '0.97rem', 
              fontWeight: 600, 
              cursor: 'pointer', 
              listStyle: 'none', 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center' 
            }}>
              How often is this page updated?
              <span aria-hidden="true" style={{ fontSize: '1.1rem', opacity: 0.45, flexShrink: 0, marginLeft: '12px' }}>+</span>
            </summary>
            <p style={{ fontSize: '0.92rem', lineHeight: 1.8, marginTop: '12px', opacity: 0.82 }}>
              Must-win team selections are updated each morning, typically by 9:00 AM GMT. Use the date navigation bar above to view upcoming days in advance.
            </p>
          </details>

          <details style={{ borderBottom: '1px solid rgba(255,255,255,0.09)', padding: '16px 0' }}>
            <summary style={{ 
              fontSize: '0.97rem', 
              fontWeight: 600, 
              cursor: 'pointer', 
              listStyle: 'none', 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center' 
            }}>
              Which leagues are covered?
              <span aria-hidden="true" style={{ fontSize: '1.1rem', opacity: 0.45, flexShrink: 0, marginLeft: '12px' }}>+</span>
            </summary>
            <p style={{ fontSize: '0.92rem', lineHeight: 1.8, marginTop: '12px', opacity: 0.82 }}>
              We cover must-win picks across 700+ leagues including the Premier League, La Liga, Bundesliga, Serie A, Ligue 1, Champions League, Europa League, and major African and Asian competitions.
            </p>
          </details>
        </div>
      </section>
    </div>
  );
}