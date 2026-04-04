export default function SoloPredictionsContent() {
  const styles = {
    // Colors
    green: "#1a7a3c",
    greenLight: "#eaf6ee",
    greenMid: "#2ea057",
    amber: "#b36b00",
    amberLight: "#fff8ec",
    text: "#1c1c1c",
    textMuted: "#555",
    border: "#dde4d8",
    bg: "#f7f9f5",
    white: "#ffffff",
    red: "#b32020",
    redLight: "#fdf0f0",
  };

  const analysisFactors = [
    { factor: "Recent Form", check: "Last 5 match results (W/D/L) for both teams" },
    { factor: "Head-to-Head", check: "Historical results between the two sides" },
    { factor: "Home vs Away", check: "How teams perform at home compared to away" },
    { factor: "Expected Goals (xG)", check: "Statistical measure of shot quality and likelihood to score" },
    { factor: "Injuries & Suspensions", check: "Key players unavailable on match day" },
    { factor: "Motivation", check: "Is a team fighting relegation, a title, or in a dead rubber?" },
    { factor: "Odds Value", check: "Whether the bookmaker's odds reflect the real probability" },
  ];

  const correctScoreMarkets = [
    { score: "1–0", use: "Strong defensive team vs weaker side", odds: "5.00 – 9.00" },
    { score: "2–1", use: "Open, competitive matches", odds: "8.00 – 12.00" },
    { score: "2–0", use: "Dominant home favourite", odds: "6.50 – 10.00" },
    { score: "0–0", use: "Defensive fixtures, low scoring leagues", odds: "8.00 – 14.00" },
    { score: "1–1", use: "Evenly matched teams", odds: "5.50 – 8.00" },
  ];

  const kingSoloTable = [
    { good: "Very high win probability (70%+)", caution: "High probability does not mean certainty" },
    { good: "Strong recent form from the tipped team", caution: "Check if key players are fit" },
    { good: "Favourable head-to-head history", caution: "Some matches break historical patterns" },
    { good: "Low odds (reflects shorter risk)", caution: "Low odds means small returns on large stakes" },
    { good: "Backed by statistical models", caution: "No model is 100% accurate" },
  ];

  const africaLeagues = [
    { league: "Premier Soccer League (PSL)", country: "South Africa", why: "Most data-rich African domestic league" },
    { league: "NPFL", country: "Nigeria", why: "Largest football market in Africa" },
    { league: "Kenya Premier League", country: "Kenya", why: "Fast-growing betting market" },
    { league: "Egyptian Premier League", country: "Egypt", why: "Historically strong, well-analysed" },
    { league: "CAF Champions League", country: "Continental", why: "High-profile, widely covered" },
  ];

  const americasLeagues = [
    { league: "MLS", country: "USA / Canada", why: "Growing data availability, large audience" },
    { league: "Liga MX", country: "Mexico", why: "Competitive, well-covered by tipsters" },
    { league: "Copa America", country: "South America", why: "International tournament, high interest" },
    { league: "Brasileirão", country: "Brazil", why: "One of the world's most analysed leagues" },
  ];

  const bettingTips = [
    { label: "Set a budget before you bet.", body: "Decide in advance how much you are willing to spend each week. Never chase losses by betting more than planned." },
    { label: "Do your own research.", body: "Even when using a tipster's solo prediction, spend 10 minutes checking the team's recent form and any injury news. It is your money." },
    { label: "Choose appropriate odds.", body: "Very low odds (below 1.50) give small returns and rarely justify the risk when an upset is possible. Very high odds (above 5.00) should be treated as entertainment, not investment." },
    { label: "One bet at a time.", body: "The entire point of solo prediction is focus. If you find yourself adding games to the slip, you have moved away from the solo approach." },
    { label: "Accept losses as part of the process.", body: "Even the best research produces losing bets. Keeping records of your bets — wins and losses — helps you assess whether your approach is working over time." },
  ];

  const responsibleList = [
    "Only bet money you can afford to lose completely.",
    "Betting should never be used to solve financial problems or pay bills.",
    "If betting is causing stress, arguments, or financial difficulty, seek help immediately.",
    "Minors (under 18, or under 21 in some jurisdictions) must not bet.",
    "Set deposit and time limits with your bookmaker if available.",
  ];

  const hotlines = [
    { flag: "🇳🇬", country: "Nigeria", number: "Lagos: 0800-GAMBLE (contact NLRC)" },
    { flag: "🇰🇪", country: "Kenya", number: "Bet Responsibly — BCLB Kenya" },
    { flag: "🇿🇦", country: "South Africa", number: "0800 006 008 (National Gambling Board)" },
    { flag: "🇬🇭", country: "Ghana", number: "Gaming Commission of Ghana" },
    { flag: "🇺🇸", country: "USA", number: "1-800-522-4700 (National Problem Gambling Helpline)" },
    { flag: "🇨🇦", country: "Canada", number: "1-866-531-2600 (ConnexOntario)" },
  ];

  const faqs = [
    {
      q: "Is solo prediction better than accumulator betting?",
      a: "For consistent, lower-risk betting, yes. Accumulators offer higher payouts but require every selection to win. If you add so many games into one slip, it only takes one unexpected event to ruin everything. Solo prediction reduces that chain risk significantly.",
    },
    {
      q: 'What does "solo prediction correct score" mean?',
      a: "It means predicting the exact final score of one single match — for example, 2–0. This is a high-risk, high-reward bet because getting the exact scoreline right is difficult even with good data analysis.",
    },
    {
      q: "What is king solo prediction?",
      a: "King solo prediction is a community term in African football betting for the single highest-confidence solo tip of the day — the one pick where analysts are most confident. It is a useful label, but remember it still does not guarantee a win.",
    },
    {
      q: "Are free solo prediction sites reliable?",
      a: "Some are, some are not. Reliable sites display their historical accuracy, provide reasoning behind tips, and cover well-known leagues. Any site claiming 100% accuracy is not being truthful — no tipster in the world achieves that.",
    },
    {
      q: "Can I make money from solo prediction long-term?",
      a: "Most bettors lose money over time because bookmakers build their margins into the odds. Solo prediction can reduce losses compared to accumulators, but it is not a reliable income source. Treat it as entertainment with a defined budget.",
    },
    {
      q: "Which African leagues are easiest to predict?",
      a: "Leagues with more data available — South Africa PSL, Egyptian Premier League, and CAF competitions — tend to be more predictable than smaller domestic leagues where team and player information is harder to find.",
    },
  ];

  return (
    <div style={{ fontFamily: "Georgia, serif", fontSize: 17, lineHeight: 1.8, color: styles.text, background: styles.bg }}>
      {/* Main */}
      <main style={{ maxWidth: 780, margin: "0 auto", padding: "1.5rem 1.25rem 2rem" }}>
        {/* Section 1 */}
        <SectionHeading id="what-is" color={styles.green} borderColor={styles.greenMid}>
          What Is Solo Prediction?
        </SectionHeading>

        <p>
          A <strong>solo prediction</strong> is a single-match football bet — one game, one tip, one outcome. Instead of combining five or ten matches into an accumulator (known as a "multibet" or "combo" in many African markets), you focus all your research on one fixture and place a stand-alone bet on it.
        </p>
        <p>
          The appeal is straightforward. When you add more games to a slip, every game must win for you to collect. One upset anywhere and the whole bet is lost. Adding so many games into one slip means that if one game turns out to be incorrect, everything goes wrong. One unexpected event ruins the entire slip. A solo prediction removes that chain risk.
        </p>

        {/* Expert box */}
        {/* <div style={{
          display: "flex", gap: "1rem", alignItems: "flex-start",
          background: styles.white, border: `1px solid ${styles.border}`,
          borderRadius: 10, padding: "1.25rem", margin: "1.5rem 0",
        }}>
          <div style={{
            width: 52, height: 52, borderRadius: "50%", background: styles.green,
            color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18, fontWeight: "bold", flexShrink: 0, fontFamily: "Arial, sans-serif",
          }}>AO</div>
          <div>
            <div style={{ fontWeight: "bold", fontSize: 15, marginBottom: 2 }}>Ade Okonkwo</div>
            <div style={{ fontSize: 12, color: styles.textMuted, fontFamily: "Arial, sans-serif", marginBottom: 8 }}>
              Senior Football Analyst & Data Modeller — 8+ years across European and African leagues
            </div>
            <p style={{ fontSize: 15, fontStyle: "italic", color: "#333", lineHeight: 1.7, margin: 0 }}>
              "Solo prediction is the foundation of disciplined betting. Most people overestimate how often a ten-game accumulator can win. Focusing on one well-researched match is almost always the smarter long-term move."
            </p>
          </div>
        </div> */}

        {/* Section 2 */}
        <SectionHeading id="how-it-works" color={styles.green} borderColor={styles.greenMid}>
          How Solo Prediction Works
        </SectionHeading>

        <p>
          Reliable solo prediction is built on data, not gut feeling. Analysts and platforms that produce football tips evaluate several factors before recommending a single-game tip:
        </p>

        <StyledTable
          headers={["Factor", "What Analysts Check"]}
          rows={analysisFactors.map(r => [r.factor, r.check])}
          green={styles.green}
          greenLight={styles.greenLight}
          border={styles.border}
          white={styles.white}
        />

        <p>
          Data-driven prediction models process key factors including current team form, head-to-head records, home and away goal averages, expected goals (xG), attacking strength, and defensive strength — calculating probability scores across each betting market before any tip is published.
        </p>
        <p>
          The result of this analysis is a probability estimate. For example, if data suggests a home team wins 75% of the time in similar conditions, a solo prediction backing that home win has a stronger foundation than a guess.
        </p>

        {/* Section 3 */}
        <SectionHeading id="today" color={styles.green} borderColor={styles.greenMid}>
          Solo Prediction for Today — What to Look For
        </SectionHeading>

        <p>
          Searching for <strong>solo prediction for today</strong> or <strong>solo prediction today</strong> returns results from many tipster sites. Before trusting any of them, check these things:
        </p>

        {[
          { label: "Track record shown publicly.", body: "Good tip sites display their historical results — wins, losses, and accuracy percentage — openly. If no history is shown, be cautious." },
          { label: "Reasoning is provided.", body: 'A quality solo prediction for today comes with brief analysis — not just "Home Win at 1.85 odds." Understand why the tip was made.' },
          { label: "Leagues you recognise.", body: "Tips on obscure leagues in countries you know nothing about are harder to verify. Stick to leagues your research can support." },
          { label: 'No guarantee of winning.', body: 'Any site claiming "100% sure" solo predictions is misleading you. Football is unpredictable by nature.' },
          { label: "Free access.", body: 'Reputable tip sites offer free daily predictions. Paying for "VIP" guaranteed tips is rarely worth it and is sometimes a scam.' },
        ].map((tip, i) => (
          <TipCard key={i} num={i + 1} label={tip.label} body={tip.body} green={styles.green} white={styles.white} border={styles.border} text={styles.text} />
        ))}

        <p>
          For African markets, predictions covering the Nigerian Professional Football League (NPFL), Kenyan Premier League, South Africa PSL, Tanzania Ligi Kuu Bara, and CAF Champions League fixtures are widely available. For American users, MLS and Copa America fixtures are commonly included in major prediction platforms.
        </p>

        {/* Section 4 */}
        <SectionHeading id="correct-score" color={styles.green} borderColor={styles.greenMid}>
          Solo Prediction Correct Score
        </SectionHeading>

        <p>
          <strong>Solo prediction correct score</strong> is a specific type of solo bet where you predict the exact final scoreline of a match — for example, 2–1 to the home team. This is one of the hardest markets to get right, but the odds are significantly higher because of it.
        </p>

        <h3 style={{ fontSize: "1.1rem", color: styles.text, margin: "1.8rem 0 0.6rem", fontWeight: "bold" }}>
          Why Correct Score Is Hard
        </h3>
        <p>
          Even when a team is heavily favoured to win, the exact score is difficult to predict. A 1–0 win, a 2–0 win, and a 3–1 win are all different correct score outcomes. Analysts use xG data and team scoring patterns to narrow down the most likely scorelines, but variance in football means even well-researched correct score tips lose often.
        </p>

        <h3 style={{ fontSize: "1.1rem", color: styles.text, margin: "1.8rem 0 0.6rem", fontWeight: "bold" }}>
          Common Correct Score Markets
        </h3>

        <StyledTable
          headers={["Scoreline", "Typical Use Case", "Approximate Odds Range"]}
          rows={correctScoreMarkets.map(r => [r.score, r.use, r.odds])}
          green={styles.green}
          greenLight={styles.greenLight}
          border={styles.border}
          white={styles.white}
        />

        <Callout type="warn">
          Correct score bets are high-risk. Even expert analysts rarely exceed 25–30% accuracy on correct score tips. Only bet amounts you are comfortable losing completely.
        </Callout>

        {/* Section 5 */}
        <SectionHeading id="king-solo" color={styles.green} borderColor={styles.greenMid}>
          King Solo Prediction — What Does It Mean?
        </SectionHeading>

        <p>
          <strong>King solo prediction</strong> is a term used across African betting communities — particularly in Nigeria, Kenya, Ghana, and South Africa — to describe the single best-confidence solo tip of the day. Think of it as the "banker" pick: one match where the data, form, and context all align strongly.
        </p>
        <p>
          Different platforms use "king solo" differently. Some use it to label their highest-probability tip. Others treat it as a premium pick separated from everyday solo predictions. Here is what to evaluate regardless of how a site labels it:
        </p>

        <StyledTable
          headers={['What Makes a "King" Solo Tip?', "What to Watch Out For"]}
          rows={kingSoloTable.map(r => [r.good, r.caution])}
          green={styles.green}
          greenLight={styles.greenLight}
          border={styles.border}
          white={styles.white}
        />

        <p>
          The "king" label is a marketing term as much as a quality indicator. Use it as a starting point for your own research, not as a reason to bet your budget on one game.
        </p>

        {/* Section 6 */}
        <SectionHeading id="africa-america" color={styles.green} borderColor={styles.greenMid}>
          Africa & America: Local Leagues That Matter
        </SectionHeading>

        <p>
          Solo prediction is most effective when you understand the league you are betting on. Here are the most relevant leagues for African and American football fans using solo prediction:
        </p>

        <h3 style={{ fontSize: "1.1rem", color: styles.text, margin: "1.8rem 0 0.6rem", fontWeight: "bold" }}>Africa</h3>
        <StyledTable
          headers={["League", "Country", "Why It Matters"]}
          rows={africaLeagues.map(r => [r.league, r.country, r.why])}
          green={styles.green}
          greenLight={styles.greenLight}
          border={styles.border}
          white={styles.white}
        />

        <h3 style={{ fontSize: "1.1rem", color: styles.text, margin: "1.8rem 0 0.6rem", fontWeight: "bold" }}>Americas</h3>
        <StyledTable
          headers={["League", "Country/Region", "Why It Matters"]}
          rows={americasLeagues.map(r => [r.league, r.country, r.why])}
          green={styles.green}
          greenLight={styles.greenLight}
          border={styles.border}
          white={styles.white}
        />

        <p>
          Analysing 100+ leagues allows tipsters to deliver predictions that single-league specialists miss — and bettors focused only on a major league compete against highly efficient markets where bookmaker margins are tight. Less-followed competitions can offer more opportunities where research provides a genuine edge.
        </p>

        {/* Section 7 */}
        <SectionHeading id="tips" color={styles.green} borderColor={styles.greenMid}>
          5 Practical Tips Before You Place a Solo Bet
        </SectionHeading>

        <p>
          Understanding what solo prediction is and finding good tips is only part of the picture. How you approach betting matters just as much.
        </p>

        {bettingTips.map((tip, i) => (
          <TipCard key={i} num={i + 1} label={tip.label} body={tip.body} green={styles.green} white={styles.white} border={styles.border} text={styles.text} />
        ))}

        {/* Responsible Gambling */}
        <div id="responsible" style={{
          background: styles.redLight,
          border: "1.5px solid #e8aaaa",
          borderRadius: 10,
          padding: "1.5rem",
          margin: "2.5rem 0 1.5rem",
        }}>
          <h3 style={{ color: styles.red, marginTop: 0, fontWeight: "bold", fontSize: "1.1rem", marginBottom: "0.75rem" }}>
            ⚠️ Important: Responsible Gambling
          </h3>
          <p style={{ fontSize: 15, color: "#4a1515", marginBottom: "0.5rem" }}>
            Football betting — including solo prediction — carries financial risk. This section is required reading if you are placing real money bets.
          </p>
          <ul style={{ paddingLeft: "1.25rem", marginTop: "0.5rem" }}>
            {responsibleList.map((item, i) => (
              <li key={i} style={{ fontSize: 15, color: "#4a1515", marginBottom: 5 }}>{item}</li>
            ))}
          </ul>
          <p style={{ marginTop: "1rem", fontSize: 15, color: "#4a1515", fontWeight: "bold" }}>
            Gambling helplines in your region:
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 10, marginTop: "1rem" }}>
            {hotlines.map((h, i) => (
              <div key={i} style={{ background: styles.white, border: "1px solid #e8aaaa", borderRadius: 8, padding: "10px 14px", fontFamily: "Arial, sans-serif", fontSize: 13 }}>
                <div style={{ fontWeight: "bold", color: styles.red, fontSize: 13 }}>{h.flag} {h.country}</div>
                <div style={{ color: "#333", fontSize: 13 }}>{h.number}</div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <SectionHeading id="faq" color={styles.green} borderColor={styles.greenMid}>
          Frequently Asked Questions
        </SectionHeading>

        {faqs.map((faq, i) => (
          <div key={i} style={{ margin: "1rem 0" }}>
            <div style={{ fontWeight: "bold", fontSize: 16, color: styles.green, marginBottom: "0.4rem" }}>{faq.q}</div>
            <div style={{ fontSize: 15, color: styles.text, lineHeight: 1.75 }}>{faq.a}</div>
          </div>
        ))}

        {/* Summary callout */}
        <Callout type="green" green={styles.green} greenLight={styles.greenLight} greenMid={styles.greenMid}>
          <strong>Summary:</strong> Solo prediction means betting on one carefully researched match instead of stacking many games together. King solo prediction is the top-confidence pick of the day. Correct score tips are the hardest market but offer the highest odds. Always bet within your means and use helplines if betting becomes a problem.
        </Callout>

      </main>

    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionHeading({ id, color, borderColor, children }) {
  return (
    <h2 id={id} style={{
      fontSize: "1.45rem",
      color,
      margin: "2.5rem 0 0.9rem",
      borderLeft: `4px solid ${borderColor}`,
      paddingLeft: "0.75rem",
      fontWeight: "bold",
    }}>
      {children}
    </h2>
  );
}

function Callout({ type = "green", children, green, greenLight, greenMid }) {
  const configs = {
    warn: { border: "#b36b00", bg: "#fff8ec", color: "#5a3800" },
    green: { border: greenMid || "#2ea057", bg: greenLight || "#eaf6ee", color: "inherit" },
  };
  const cfg = configs[type] || configs.green;
  return (
    <div style={{
      borderLeft: `4px solid ${cfg.border}`,
      background: cfg.bg,
      color: cfg.color,
      padding: "1rem 1.25rem",
      borderRadius: "0 6px 6px 0",
      margin: "1.5rem 0",
      fontSize: 16,
    }}>
      {children}
    </div>
  );
}

function TipCard({ num, label, body, green, white, border, text }) {
  return (
    <div style={{
      background: white,
      border: `1px solid ${border}`,
      borderRadius: 10,
      padding: "1.1rem 1.25rem",
      margin: "0.7rem 0",
      display: "flex",
      gap: 12,
      alignItems: "flex-start",
    }}>
      <div style={{
        width: 32, height: 32, borderRadius: "50%", background: green,
        color: "#fff", fontWeight: "bold", display: "flex",
        alignItems: "center", justifyContent: "center",
        fontFamily: "Arial, sans-serif", fontSize: 14, flexShrink: 0,
      }}>
        {num}
      </div>
      <div style={{ fontSize: 15, color: text, paddingTop: 4 }}>
        <strong style={{ color: green }}>{label}</strong> {body}
      </div>
    </div>
  );
}

function StyledTable({ headers, rows, green, greenLight, border, white }) {
  return (
    <table style={{
      width: "100%", borderCollapse: "collapse",
      fontFamily: "Arial, sans-serif", fontSize: 14,
      margin: "1.2rem 0", background: white,
      borderRadius: 8, overflow: "hidden", border: `1px solid ${border}`,
    }}>
      <thead style={{ background: green, color: "#fff" }}>
        <tr>
          {headers.map((h, i) => (
            <th key={i} style={{ padding: "10px 14px", textAlign: "left", borderBottom: `1px solid ${border}` }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, ri) => (
          <tr key={ri} style={{ background: ri % 2 === 1 ? greenLight : white }}>
            {row.map((cell, ci) => (
              <td key={ci} style={{ padding: "10px 14px", textAlign: "left", borderBottom: `1px solid ${border}` }}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}