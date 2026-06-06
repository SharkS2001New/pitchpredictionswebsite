import PredictionGuidesLinks from "../shared/prediction-guides-links";

export default function LandingPageContent() {
  return (
    <main 
      id="seo-content" 
      style={{ 
        maxWidth: '1200px', 
        margin: '48px auto 0', 
        padding: '0 10px 10px' 
      }}
    >
      {/* ── ABOUT PITCH PREDICTIONS ── */}
      <section aria-labelledby="about-heading" style={{ marginBottom: '48px' }}>
        <h2 
          id="about-heading" 
          style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}
        >
          About Pitch Predictions
        </h2>
        <p style={{ fontSize: '1rem', lineHeight: 1.8, marginBottom: '16px' }}>
          <strong>Pitch Predictions</strong> is a free, statistics-based football prediction platform trusted by punters and football fans across the globe. We analyse every match using a multi-factor model that weighs recent form, head-to-head history, squad fitness, home/away records, and betting market movements — delivering predictions that go far deeper than gut feelings.
        </p>
        <p style={{ fontSize: '1rem', lineHeight: 1.8, marginBottom: '16px' }}>
          Whether you're looking for <a href="/football-predictions-today" style={{ color: 'inherit', textDecoration: 'underline' }}>today's free football tips</a>, <a href="/football-predictions-weekend" style={{ color: 'inherit', textDecoration: 'underline' }}>weekend accumulators</a>, <a href="/jackpot-predictions" style={{ color: 'inherit', textDecoration: 'underline' }}>jackpot selections</a>, or real-time live score tracking, Pitch Predictions puts every tool in one place — covering leagues from the English Premier League to the Sportpesa Kenya Mega Jackpot.
        </p>
      </section>

      {/* ── HOW OUR PREDICTIONS WORK ── */}
      <section aria-labelledby="methodology-heading" style={{ marginBottom: '48px' }}>
        <h2 
          id="methodology-heading" 
          style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}
        >
          How We Generate Our Football Predictions
        </h2>
        <p style={{ fontSize: '1rem', lineHeight: 1.8, marginBottom: '16px' }}>
          Every prediction on Pitch Predictions is the output of a structured, data-first analysis process. Here's what we evaluate for every match:
        </p>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '16px', 
          marginBottom: '20px' 
        }}>
          <article style={{ 
            padding: '20px', 
            borderRadius: '10px', 
            border: '1px solid rgba(255,255,255,0.08)', 
            background: 'rgba(255,255,255,0.03)' 
          }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '8px' }}>📈 Current Form</h3>
            <p style={{ fontSize: '0.92rem', lineHeight: 1.7, opacity: 0.85 }}>We track the last 5–10 matches for every team, analysing wins, draws, losses, goals scored and conceded to identify momentum shifts before kickoff.</p>
          </article>

          <article style={{ 
            padding: '20px', 
            borderRadius: '10px', 
            border: '1px solid rgba(255,255,255,0.08)', 
            background: 'rgba(255,255,255,0.03)' 
          }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '8px' }}>⚔️ Head-to-Head Records</h3>
            <p style={{ fontSize: '0.92rem', lineHeight: 1.7, opacity: 0.85 }}>Historical H2H matchups reveal psychological and tactical patterns between teams — patterns that consistently influence match outcomes over time.</p>
          </article>

          <article style={{ 
            padding: '20px', 
            borderRadius: '10px', 
            border: '1px solid rgba(255,255,255,0.08)', 
            background: 'rgba(255,255,255,0.03)' 
          }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '8px' }}>🏥 Team News & Injuries</h3>
            <p style={{ fontSize: '0.92rem', lineHeight: 1.7, opacity: 0.85 }}>Missing a striker or key defender? We factor in confirmed absences, suspensions and rotation patterns that can reshape a team's performance.</p>
          </article>

          <article style={{ 
            padding: '20px', 
            borderRadius: '10px', 
            border: '1px solid rgba(255,255,255,0.08)', 
            background: 'rgba(255,255,255,0.03)' 
          }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '8px' }}>🏟️ Home & Away Form</h3>
            <p style={{ fontSize: '0.92rem', lineHeight: 1.7, opacity: 0.85 }}>Teams perform differently at home versus away. Our model separates these records to give a more accurate picture of likely match performance.</p>
          </article>

          <article style={{ 
            padding: '20px', 
            borderRadius: '10px', 
            border: '1px solid rgba(255,255,255,0.08)', 
            background: 'rgba(255,255,255,0.03)' 
          }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '8px' }}>💹 Odds Market Movement</h3>
            <p style={{ fontSize: '0.92rem', lineHeight: 1.7, opacity: 0.85 }}>Significant betting line movements often reflect sharp money and insider knowledge. We track market shifts to flag value bets and inflated odds.</p>
          </article>

          <article style={{ 
            padding: '20px', 
            borderRadius: '10px', 
            border: '1px solid rgba(255,255,255,0.08)', 
            background: 'rgba(255,255,255,0.03)' 
          }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '8px' }}>🧠 Tactical Analysis</h3>
            <p style={{ fontSize: '0.92rem', lineHeight: 1.7, opacity: 0.85 }}>Playing styles, formations and managerial tendencies are assessed for match-up advantages, pressing traps and set-piece threats that stats alone miss.</p>
          </article>
        </div>

        <p style={{ fontSize: '1rem', lineHeight: 1.8 }}>
          The result is a confidence-rated prediction (displayed as a percentage) alongside our recommended tip — whether that's <strong>1X2, BTTS, Over/Under goals, or Correct Score</strong>.
        </p>
      </section>

      {/* ── TYPES OF PREDICTIONS ── */}
      <section aria-labelledby="types-heading" style={{ marginBottom: '48px' }}>
        <h2 
          id="types-heading" 
          style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}
        >
          Types of Football Predictions We Offer
        </h2>
        <p style={{ fontSize: '1rem', lineHeight: 1.8, marginBottom: '20px' }}>
          Pitch Predictions covers every major betting market so you can always find a tip that fits your strategy:
        </p>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
          gap: '12px', 
          marginBottom: '20px' 
        }}>
          <div style={{ 
            padding: '16px 18px', 
            borderRadius: '8px', 
            borderLeft: '4px solid #06d6a0', 
            background: 'rgba(6,214,160,0.06)' 
          }}>
            <strong style={{ display: 'block', marginBottom: '4px', fontSize: '0.95rem' }}>1X2 — Match Winner</strong>
            <span style={{ fontSize: '0.88rem', opacity: 0.8 }}>Predict the winning team or a draw for any match worldwide.</span>
          </div>
          <div style={{ 
            padding: '16px 18px', 
            borderRadius: '8px', 
            borderLeft: '4px solid #74b9ff', 
            background: 'rgba(116,185,255,0.06)' 
          }}>
            <strong style={{ display: 'block', marginBottom: '4px', fontSize: '0.95rem' }}>Over / Under Goals</strong>
            <span style={{ fontSize: '0.88rem', opacity: 0.8 }}>Bet on whether total goals exceed or fall below a set threshold (e.g. Over 2.5).</span>
          </div>
          <div style={{ 
            padding: '16px 18px', 
            borderRadius: '8px', 
            borderLeft: '4px solid #ffd166', 
            background: 'rgba(255,209,102,0.06)' 
          }}>
            <strong style={{ display: 'block', marginBottom: '4px', fontSize: '0.95rem' }}>BTTS — Both Teams to Score</strong>
            <span style={{ fontSize: '0.88rem', opacity: 0.8 }}>Will both sides find the net? GG/NG tips with confidence ratings for every match.</span>
          </div>
          <div style={{ 
            padding: '16px 18px', 
            borderRadius: '8px', 
            borderLeft: '4px solid #ff6b6b', 
            background: 'rgba(255,107,107,0.06)' 
          }}>
            <strong style={{ display: 'block', marginBottom: '4px', fontSize: '0.95rem' }}>Correct Score</strong>
            <span style={{ fontSize: '0.88rem', opacity: 0.8 }}>High-reward tips predicting the exact final scoreline of a match.</span>
          </div>
          <div style={{ 
            padding: '16px 18px', 
            borderRadius: '8px', 
            borderLeft: '4px solid #a29bfe', 
            background: 'rgba(162,155,254,0.06)' 
          }}>
            <strong style={{ display: 'block', marginBottom: '4px', fontSize: '0.95rem' }}>Asian Handicap</strong>
            <span style={{ fontSize: '0.88rem', opacity: 0.8 }}>Eliminate the draw and get a head start on your bet with handicap lines.</span>
          </div>
          <div style={{ 
            padding: '16px 18px', 
            borderRadius: '8px', 
            borderLeft: '4px solid #fd79a8', 
            background: 'rgba(253,121,168,0.06)' 
          }}>
            <strong style={{ display: 'block', marginBottom: '4px', fontSize: '0.95rem' }}>Jackpot Predictions</strong>
            <span style={{ fontSize: '0.88rem', opacity: 0.8 }}>Weekly Sportpesa, Betika, Betpawa & Mozzart jackpot coupon analysis.</span>
          </div>
        </div>
      </section>

      {/* ── LEAGUES WE COVER ── */}
      <section aria-labelledby="leagues-heading" style={{ marginBottom: '48px' }}>
        <h2 
          id="leagues-heading" 
          style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}
        >
          Football Predictions for Every Major League
        </h2>
        <p style={{ fontSize: '1rem', lineHeight: 1.8, marginBottom: '20px' }}>
          Pitch Predictions covers <strong>700+ football leagues</strong> and competitions from every corner of the world. Navigate to any league for fixtures, predictions, standings and team news:
        </p>

        <ul style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', 
          gap: '10px', 
          listStyle: 'none', 
          padding: 0, 
          marginBottom: '20px' 
        }}>
          <li>
            <a
              href="/league/football-predictions-for-england/premier-league-39/fixtures"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px 16px',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.1)',
                textDecoration: 'none',
                color: 'inherit',
                fontSize: '0.92rem',
                fontWeight: 500,
                transition: 'background 0.2s'
              }}
              title="Premier League Predictions"
            >
              <span>🏴󠁧󠁢󠁥󠁮󠁧󠁿</span> <span>Premier League Predictions</span>
            </a>
          </li>
          <li>
            <a
              href="/league/football-predictions-for-spain/la-liga-140/fixtures"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px 16px',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.1)',
                textDecoration: 'none',
                color: 'inherit',
                fontSize: '0.92rem',
                fontWeight: 500
              }}
              title="La Liga Predictions"
            >
              <span>🇪🇸</span> <span>La Liga Predictions</span>
            </a>
          </li>
          <li>
            <a
              href="/league/football-predictions-for-germany/bundesliga-78/fixtures"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px 16px',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.1)',
                textDecoration: 'none',
                color: 'inherit',
                fontSize: '0.92rem',
                fontWeight: 500
              }}
              title="Bundesliga Predictions"
            >
              <span>🇩🇪</span> <span>Bundesliga Predictions</span>
            </a>
          </li>
          <li>
            <a
              href="/league/football-predictions-for-italy/serie-a-135/fixtures"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px 16px',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.1)',
                textDecoration: 'none',
                color: 'inherit',
                fontSize: '0.92rem',
                fontWeight: 500
              }}
              title="Serie A Predictions"
            >
              <span>🇮🇹</span> <span>Serie A Predictions</span>
            </a>
          </li>
          <li>
            <a
              href="/league/football-predictions-for-france/ligue-1-61/fixtures"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px 16px',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.1)',
                textDecoration: 'none',
                color: 'inherit',
                fontSize: '0.92rem',
                fontWeight: 500
              }}
              title="Ligue 1 Predictions"
            >
              <span>🇫🇷</span> <span>Ligue 1 Predictions</span>
            </a>
          </li>
          <li>
            <a
              href="/jackpot-predictions"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px 16px',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.1)',
                textDecoration: 'none',
                color: 'inherit',
                fontSize: '0.92rem',
                fontWeight: 500
              }}
              title="Jackpot Predictions"
            >
              <span>🎰</span> <span>Sportpesa / Betika Jackpot Tips</span>
            </a>
          </li>
          <li>
            <a
              href="/top-football-tips-and-predictions/today"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px 16px',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.1)',
                textDecoration: 'none',
                color: 'inherit',
                fontSize: '0.92rem',
                fontWeight: 500
              }}
              title="Top Football Tips Today"
            >
              <span>🔝</span> <span>Top Football Tips Today</span>
            </a>
          </li>
          <li>
            <a
              href="/team-comparison"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px 16px',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.1)',
                textDecoration: 'none',
                color: 'inherit',
                fontSize: '0.92rem',
                fontWeight: 500
              }}
              title="Team Comparison Tool"
            >
              <span>⚔️</span> <span>Team Head-to-Head Comparison</span>
            </a>
          </li>
        </ul>
      </section>

      <PredictionGuidesLinks title="Expert Tip &amp; Jackpot Guides" />

      {/* ── FAQ SECTION ── */}
      <section aria-labelledby="faq-heading" style={{ marginBottom: '10px' }}>
        <h2 
          id="faq-heading" 
          style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '14px' }}
        >
          Frequently Asked Questions
        </h2>

        {/* FAQ items — keep these in sync with the FAQPage schema above */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          <details style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '10px 0' }} open>
            <summary style={{ 
              fontSize: '1rem', 
              fontWeight: 600, 
              cursor: 'pointer', 
              listStyle: 'none', 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center' 
            }}>
              Are Pitch Predictions football tips free?
              <span aria-hidden="true" style={{ fontSize: '1.2rem', opacity: 0.5 }}>+</span>
            </summary>
            <p style={{ fontSize: '0.95rem', lineHeight: 1.8, marginTop: '12px', opacity: 0.85 }}>
              Yes. All daily predictions, live scores, league standings, team comparisons and jackpot tips on Pitch Predictions are completely free. A premium subscription unlocks our highest-confidence exclusive tips and early-access picks.
            </p>
          </details>

          <details style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '10px 0' }}>
            <summary style={{ 
              fontSize: '1rem', 
              fontWeight: 600, 
              cursor: 'pointer', 
              listStyle: 'none', 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center' 
            }}>
              How accurate are your predictions?
              <span aria-hidden="true" style={{ fontSize: '1.2rem', opacity: 0.5 }}>+</span>
            </summary>
            <p style={{ fontSize: '0.95rem', lineHeight: 1.8, marginTop: '12px', opacity: 0.85 }}>
              Our top-confidence predictions carry a 65%+ historical accuracy rate, calculated using current form, head-to-head records, team news, home/away statistics, and betting market movement. No prediction is guaranteed — we provide expert analysis to inform your decisions, not to promise results.
            </p>
          </details>

          <details style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '10px 0' }}>
            <summary style={{ 
              fontSize: '1rem', 
              fontWeight: 600, 
              cursor: 'pointer', 
              listStyle: 'none', 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center' 
            }}>
              Which leagues does Pitch Predictions cover?
              <span aria-hidden="true" style={{ fontSize: '1.2rem', opacity: 0.5 }}>+</span>
            </summary>
            <p style={{ fontSize: '0.95rem', lineHeight: 1.8, marginTop: '12px', opacity: 0.85 }}>
              We cover over 700 football leagues worldwide including the English Premier League, La Liga, Bundesliga, Serie A, Ligue 1, UEFA Champions League, Europa League, Africa Cup of Nations, and dozens of regional competitions across Africa, Asia, and the Americas.
            </p>
          </details>

          <details style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '10px 0' }}>
            <summary style={{ 
              fontSize: '1rem', 
              fontWeight: 600, 
              cursor: 'pointer', 
              listStyle: 'none', 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center' 
            }}>
              How often are predictions updated?
              <span aria-hidden="true" style={{ fontSize: '1.2rem', opacity: 0.5 }}>+</span>
            </summary>
            <p style={{ fontSize: '0.95rem', lineHeight: 1.8, marginTop: '12px', opacity: 0.85 }}>
              Predictions are refreshed daily, with live match data updating in real-time throughout the day. Jackpot predictions are updated weekly before each jackpot deadline.
            </p>
          </details>

          <details style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '10px 0' }}>
            <summary style={{ 
              fontSize: '1rem', 
              fontWeight: 600, 
              cursor: 'pointer', 
              listStyle: 'none', 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center' 
            }}>
              Does Pitch Predictions cover jackpot predictions?
              <span aria-hidden="true" style={{ fontSize: '1.2rem', opacity: 0.5 }}>+</span>
            </summary>
            <p style={{ fontSize: '0.95rem', lineHeight: 1.8, marginTop: '12px', opacity: 0.85 }}>
              Yes. We provide dedicated jackpot prediction pages for <strong>Sportpesa Mega Jackpot</strong>, <strong>Betika Jackpot</strong>, <strong>Betpawa</strong>, and <strong>Mozzart</strong> — updated weekly with expert analysis and statistical rationale for every selection on the coupon.
            </p>
          </details>

          <details style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '10px 0' }}>
            <summary style={{ 
              fontSize: '1rem', 
              fontWeight: 600, 
              cursor: 'pointer', 
              listStyle: 'none', 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center' 
            }}>
              What prediction types does Pitch Predictions offer?
              <span aria-hidden="true" style={{ fontSize: '1.2rem', opacity: 0.5 }}>+</span>
            </summary>
            <p style={{ fontSize: '0.95rem', lineHeight: 1.8, marginTop: '12px', opacity: 0.85 }}>
              We offer 1X2 match winner, Over/Under goals (e.g. Over 2.5), Both Teams to Score (BTTS/GG/NG), Correct Score, Asian Handicap, and jackpot predictions. Every tip comes with a confidence percentage and supporting statistical analysis.
            </p>
          </details>
        </div>
      </section>
    </main>
  );
}