export default function SoloPredictionsContent() {
  const today = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const styles = {
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

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Is solo prediction better than accumulator betting?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "For consistent, lower-risk betting, yes. Accumulators offer higher payouts but require every selection to win. Solo prediction today removes that chain risk — one well-researched match, one focused bet.",
        },
      },
      {
        "@type": "Question",
        name: "What does solo prediction correct score mean?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Solo prediction correct score means predicting the exact final scoreline of one single match — for example, 2–0. This is a high-risk, high-reward market because getting the exact scoreline right is difficult even with strong data analysis.",
        },
      },
      {
        "@type": "Question",
        name: "What is king solo prediction?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "King solo prediction is a term used widely in African football betting communities — particularly Nigeria, Kenya, Ghana and South Africa — for the single highest-confidence solo tip of the day. It is the banker pick where form, motivation and data all align strongly.",
        },
      },
      {
        "@type": "Question",
        name: "Are free solo prediction sites reliable?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Some are, some are not. Reliable sites display their historical accuracy openly, provide reasoning behind every tip, and cover well-known leagues. Any site claiming 100% sure solo predictions is misleading you — no tipster achieves that.",
        },
      },
      {
        "@type": "Question",
        name: "Can I make money from solo prediction long-term?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Most bettors lose money over time because bookmakers build margins into the odds. Solo prediction can reduce losses compared to accumulators, but it is not a reliable income source. Treat it as entertainment with a defined budget.",
        },
      },
      {
        "@type": "Question",
        name: "Which African leagues are easiest to predict?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Leagues with more data available — South Africa PSL, Egyptian Premier League, and CAF competitions — tend to be more predictable than smaller domestic leagues where team and player information is harder to find.",
        },
      },
    ],
  };

  const analysisFactors = [
    { factor: "Recent Form", check: "Last 5 match results (W/D/L) for both teams" },
    { factor: "Head-to-Head", check: "Historical results between the two sides" },
    { factor: "Home vs Away", check: "How teams perform at home compared to away" },
    { factor: "Expected Goals (xG)", check: "Statistical measure of shot quality and likelihood to score" },
    { factor: "Injuries & Suspensions", check: "Key players unavailable on match day" },
    { factor: "Motivation", check: "Is a team fighting relegation, a title, or in a dead rubber?" },
    { factor: "Odds Value", check: "Whether bookmaker odds reflect the real probability" },
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
    { label: "Do your own research.", body: "Even when using a tipster's solo prediction for today, spend 10 minutes checking the team's recent form and any injury news. It is your money." },
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
      a: "For consistent, lower-risk betting, yes. Accumulators offer higher payouts but require every selection to win. One unexpected result ruins the entire slip. Solo prediction today removes that chain risk — one well-researched match, one focused bet.",
    },
    {
      q: 'What does "solo prediction correct score" mean?',
      a: "Solo prediction correct score means predicting the exact final scoreline of one single match — for example, 2–0. This is a high-risk, high-reward market because getting the exact scoreline right is difficult even with strong data analysis.",
    },
    {
      q: "What is king solo prediction?",
      a: "King solo prediction is a term widely used in African football betting — particularly in Nigeria, Kenya, Ghana and South Africa — for the single highest-confidence solo tip of the day. It is the banker pick where form, motivation and data all align strongly in one direction.",
    },
    {
      q: "Are free solo prediction sites reliable?",
      a: "Some are, some are not. Reliable sites display their historical accuracy openly, provide reasoning behind every tip, and cover well-known leagues. Any site claiming 100% sure solo predictions is misleading you — no tipster achieves that.",
    },
    {
      q: "Can I make money from solo prediction long-term?",
      a: "Most bettors lose money over time because bookmakers build margins into the odds. Solo prediction can reduce losses compared to accumulators, but it is not a reliable income source. Treat it as entertainment with a defined budget.",
    },
    {
      q: "Which African leagues are easiest to predict?",
      a: "Leagues with more available data — South Africa PSL, Egyptian Premier League, and CAF competitions — tend to be more predictable than smaller domestic leagues where team and player information is harder to verify.",
    },
  ];

  return (
    <div style={{ fontFamily: "Georgia, serif", fontSize: 17, lineHeight: 1.8, color: styles.text, background: styles.bg }}>

      {/* FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <main style={{ maxWidth: 780, margin: "0 auto", padding: "1.5rem 1.25rem 2rem" }}>

        {/* ── H1 + FRESHNESS ── */}
        <h2 style={{ fontSize: "1.75rem", fontWeight: "bold", color: styles.green, marginBottom: "0.4rem", lineHeight: 1.3 }}>
          Solo Prediction Today – Free King Solo Tips & Correct Score Picks
        </h2>
        <p style={{ fontSize: "0.82rem", color: styles.textMuted, marginTop: 0, marginBottom: "1.5rem" }}>
          Updated daily · Last updated {today} · Verified by Stephen Karuku, Senior Football Analyst
        </p>

        {/* ── INTRO / KEYWORD HOOK ── */}
        <p>
          Looking for a reliable <strong>solo prediction for today</strong>? You are in the right place. A <strong>solo prediction</strong> is a single-match football bet — one game, one tip, one outcome — and it is the most focused, disciplined approach to football betting available. Instead of stacking five or ten matches into an accumulator where one upset ruins everything, our <strong>solo prediction today</strong> picks give you one well-researched selection to act on.
        </p>
        <p>
          At <strong>Pitch Predictions</strong>, we publish free <strong>king solo prediction</strong> tips daily across 700+ leagues — from the Premier League and La Liga to the NPFL, Kenya Premier League, South Africa PSL, and CAF Champions League. We also cover <strong>solo prediction correct score</strong> markets for high-confidence fixtures where the scoreline data is strong. Every tip comes with reasoning, not just a result.
        </p>

        {/* ── EXPERT BLOCK ── */}
        <div style={{
          display: "flex", gap: "1rem", alignItems: "flex-start",
          background: styles.white, border: `1px solid ${styles.border}`,
          borderRadius: 10, padding: "1.25rem", margin: "1.75rem 0",
        }}>
          <div style={{
            width: 52, height: 52, borderRadius: "50%", background: styles.green,
            color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 17, fontWeight: "bold", flexShrink: 0, fontFamily: "Arial, sans-serif",
          }}>
            SK
          </div>
          <div>
            <div style={{ fontWeight: "bold", fontSize: 15, marginBottom: 2, fontFamily: "Arial, sans-serif" }}>
              Stephen Karuku
            </div>
            <div style={{ fontSize: 12, color: styles.textMuted, fontFamily: "Arial, sans-serif", marginBottom: 8 }}>
              Senior Football Analyst — 9+ years covering African and European leagues, specialising in data-driven solo prediction models
            </div>
            <p style={{ fontSize: 15, fontStyle: "italic", color: "#333", lineHeight: 1.7, margin: 0 }}>
              "Solo prediction is the foundation of disciplined betting. Most people overestimate how often a ten-game accumulator wins. One well-researched match, analysed properly, is almost always the smarter long-term approach — especially across African leagues where motivation data is as important as form."
            </p>
          </div>
        </div>

        {/* ── SECTION 1: WHAT IS SOLO PREDICTION ── */}
        <SectionHeading id="what-is" color={styles.green} borderColor={styles.greenMid}>
          What Is Solo Prediction?
        </SectionHeading>

        <p>
          A <strong>solo prediction</strong> is a stand-alone football bet placed on a single match. Unlike accumulators — known as "multibet" or "combo" in many African markets — a solo bet does not depend on a chain of results. You research one fixture, back one outcome, and your result is determined by that match alone.
        </p>
        <p>
          The advantage is straightforward. Accumulators require every selection to win. Add six games to a slip and if one turns out incorrectly, the entire bet is lost. Solo prediction removes that dependency entirely. It is the preferred approach for bettors who want consistency over jackpot-chasing.
        </p>

        {/* ── SECTION 2: HOW IT WORKS ── */}
        <SectionHeading id="how-it-works" color={styles.green} borderColor={styles.greenMid}>
          How Solo Prediction Works
        </SectionHeading>

        <p>
          Every <strong>solo prediction for today</strong> published on Pitch Predictions passes through a structured data analysis process. Here is what analysts evaluate before any tip is recommended:
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
          The output of this process is a probability estimate. If data shows a home team wins 75% of comparable fixtures, a solo prediction backing that home win has a measurable statistical foundation — not a guess. Our{" "}
          <a href="/tips/must-win-teams-today" style={{ color: styles.green }}>must-win team predictions</a>{" "}
          follow the same model, applied to high-stakes fixtures specifically.
        </p>

        {/* ── SECTION 3: TODAY'S PICKS ── */}
        <SectionHeading id="today" color={styles.green} borderColor={styles.greenMid}>
          Solo Prediction for Today — What to Look For
        </SectionHeading>

        <p>
          Searching for <strong>solo prediction today</strong> returns results from dozens of tipster sites. Before trusting any of them — including ours — check these five things:
        </p>

        {[
          { label: "Track record shown publicly.", body: "Quality tip sites display historical results — wins, losses, and accuracy percentage — openly. If no history is published, be cautious." },
          { label: "Reasoning is provided.", body: 'A reliable solo prediction for today comes with brief analysis — not just "Home Win at 1.85." You should understand why the tip was made before placing a bet.' },
          { label: "Leagues you can verify.", body: "Tips on obscure leagues where team and player data is hard to find are difficult to validate. Stick to leagues your own research can support." },
          { label: "No guarantee of winning.", body: 'Any site claiming "100% sure" solo predictions is not being truthful. Football is unpredictable by nature — no analyst achieves 100% accuracy.' },
          { label: "Free access to core tips.", body: 'Reputable prediction platforms offer free daily solo tips. Paying for "VIP guaranteed" picks is rarely worth it and is sometimes a scam.' },
        ].map((tip, i) => (
          <TipCard key={i} num={i + 1} label={tip.label} body={tip.body} green={styles.green} white={styles.white} border={styles.border} text={styles.text} />
        ))}

        <p>
          For African markets, our{" "}
          <a href="/football-predictions-today" style={{ color: styles.green }}>daily football tips</a>{" "}
          cover the NPFL, Kenya Premier League, South Africa PSL, Tanzania Ligi Kuu Bara, and CAF Champions League. For American users, MLS and Copa America fixtures are included across all major prediction pages.
        </p>

        {/* ── SECTION 4: CORRECT SCORE ── */}
        <SectionHeading id="correct-score" color={styles.green} borderColor={styles.greenMid}>
          Solo Prediction Correct Score
        </SectionHeading>

        <p>
          <strong>Solo prediction correct score</strong> is the most demanding single-match market — you predict the exact final scoreline of one fixture, for example 2–1 to the home side. The difficulty is high, but so are the odds. This market suits bettors who combine strong xG data with disciplined stake management.
        </p>

        <h3 style={{ fontSize: "1.1rem", color: styles.text, margin: "1.8rem 0 0.6rem", fontWeight: "bold" }}>
          Why Correct Score Is Hard
        </h3>
        <p>
          Even when a team is heavily favoured to win, the exact scoreline is uncertain. A 1–0, a 2–0, and a 3–1 are all different correct score outcomes. Analysts use xG data and team scoring patterns to identify the most likely scorelines — but variance in football means even well-researched correct score tips lose frequently.
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
          Correct score bets are high-risk. Even expert analysts rarely exceed 25–30% accuracy on correct score tips. Only stake amounts you are comfortable losing completely.
        </Callout>

        {/* ── SECTION 5: KING SOLO ── */}
        <SectionHeading id="king-solo" color={styles.green} borderColor={styles.greenMid}>
          King Solo Prediction — What Does It Mean?
        </SectionHeading>

        <p>
          <strong>King solo prediction</strong> is a term used widely across African football betting communities — particularly in Nigeria, Kenya, Ghana and South Africa — to describe the single highest-confidence solo tip of the day. Think of it as the banker pick: one match where the data, form, motivation and context all align strongly in one direction.
        </p>
        <p>
          Different platforms use "king solo" differently. Some label their highest-probability tip with it. Others treat it as a premium pick separated from everyday solo predictions. Here is what to evaluate regardless of how a site labels its king solo pick:
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
          The "king" label is partly a marketing term. Use it as a starting point for your own research — not as a reason to stake your full budget on a single game. Pair it with our{" "}
          <a href="/team-comparison" style={{ color: styles.green }}>Team Comparison tool</a>{" "}
          to validate the H2H data before placing.
        </p>

        {/* ── SECTION 6: LEAGUES ── */}
        <SectionHeading id="africa-america" color={styles.green} borderColor={styles.greenMid}>
          Africa & Americas: Local Leagues That Matter
        </SectionHeading>

        <p>
          Solo prediction is most effective when you understand the league you are betting on. Here are the most relevant competitions for African and American bettors:
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
          Less-followed competitions often offer more predictable opportunities — bookmaker margins are tighter in the Premier League and La Liga because efficient markets have processed the same data you have. African league specialists often find better value in PSL and NPFL fixtures precisely because fewer analysts cover them.
        </p>

        {/* ── SECTION 7: PRACTICAL TIPS ── */}
        <SectionHeading id="tips" color={styles.green} borderColor={styles.greenMid}>
          5 Practical Tips Before You Place a Solo Bet
        </SectionHeading>

        <p>
          Finding a strong <strong>solo prediction today</strong> is only part of the picture. How you approach betting matters just as much as which tip you follow.
        </p>

        {bettingTips.map((tip, i) => (
          <TipCard key={i} num={i + 1} label={tip.label} body={tip.body} green={styles.green} white={styles.white} border={styles.border} text={styles.text} />
        ))}

        {/* ── JACKPOT INTERNAL LINKS ── */}
        <SectionHeading id="jackpot" color={styles.green} borderColor={styles.greenMid}>
          Looking for Jackpot Predictions Too?
        </SectionHeading>

        <p>
          If you combine solo prediction with{" "}
          <a href="/jackpot-predictions" style={{ color: styles.green, fontWeight: "bold" }}>jackpot prediction</a>{" "}
          pools across SportPesa, Betika, and Mozzart Bet, we cover those too. Explore our dedicated jackpot pages:
        </p>

        <ul style={{ paddingLeft: "1.4rem", marginBottom: "1.5rem" }}>
          <li style={{ marginBottom: 8 }}>
            <a href="/jackpot-predictions/sportpesa-mega-jackpot-predictions" style={{ color: styles.green }}>
              Sportpesa Mega Jackpot Predictions
            </a>
          </li>
          <li style={{ marginBottom: 8 }}>
            <a href="/jackpot-predictions/sportpesa-midweek-jackpot-predictions" style={{ color: styles.green }}>
              Sportpesa Midweek Jackpot Predictions
            </a>
          </li>
          <li style={{ marginBottom: 8 }}>
            <a href="/jackpot-predictions/mozzart-super-daily-jackpot-predictions" style={{ color: styles.green }}>
              Mozzart Super Daily Jackpot Predictions
            </a>
          </li>
          <li style={{ marginBottom: 8 }}>
            <a href="/jackpot-predictions/betika-midweek-jackpot-predictions" style={{ color: styles.green }}>
              Betika Midweek Jackpot Predictions
            </a>
          </li>
        </ul>

        {/* ── RESPONSIBLE GAMBLING ── */}
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
            Football betting — including solo prediction — carries real financial risk. This section is required reading before placing any real-money bet.
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

        {/* ── FAQ ── */}
        <SectionHeading id="faq" color={styles.green} borderColor={styles.greenMid}>
          Frequently Asked Questions
        </SectionHeading>

        {faqs.map((faq, i) => (
          <div key={i} style={{ margin: "1rem 0" }}>
            <div style={{ fontWeight: "bold", fontSize: 16, color: styles.green, marginBottom: "0.4rem" }}>{faq.q}</div>
            <div style={{ fontSize: 15, color: styles.text, lineHeight: 1.75 }}>{faq.a}</div>
          </div>
        ))}

        {/* ── SUMMARY ── */}
        <Callout type="green" green={styles.green} greenLight={styles.greenLight} greenMid={styles.greenMid}>
          <strong>Summary:</strong> Solo prediction today means betting on one carefully researched match instead of stacking games into an accumulator. King solo prediction is the top-confidence pick of the day. Solo prediction correct score tips are the hardest market but carry the highest odds. Always bet within your means — and use the helplines above if betting stops being entertainment.
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