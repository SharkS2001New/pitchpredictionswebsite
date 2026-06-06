const GUIDE_LINKS = [
  {
    href: "/tips/must-win-teams-today",
    anchor: "Must Win Teams Today",
    description:
      "High-confidence picks for teams fighting relegation, chasing titles, or facing must-win cup fixtures.",
  },
  {
    href: "/tips/sokafans",
    anchor: "Sokafans Predictions Today",
    description:
      "Free daily tips and jackpot analysis for Kenyan leagues — Sokafans-style 1X2, BTTS, and coupon picks.",
  },
  {
    href: "/tips/solo-prediction",
    anchor: "Solo Prediction Today",
    description:
      "One focused match pick each day — single-game betting without accumulator chain risk.",
  },
  {
    href: "/tips/one-million-prediction",
    anchor: "One Million Prediction Tips",
    description:
      "Today and tomorrow straight-win and correct score selections with confidence ratings.",
  },
  {
    href: "/tips/free-vip-tips-today",
    anchor: "Free VIP Tips Today",
    description:
      "Premium-quality daily football tips across African and American leagues.",
  },
  {
    href: "/jackpot-predictions/sportpesa-mega-jackpot-predictions",
    anchor: "Sportpesa Mega Jackpot Predictions",
    description:
      "17-game weekend coupon — grand prize up to KSh 360 million, bonuses from 12 correct.",
  },
  {
    href: "/jackpot-predictions/sportpesa-midweek-jackpot-predictions",
    anchor: "Sportpesa Midweek Jackpot Predictions",
    description:
      "13 midweek games — ~KSh 11 million grand prize, bonuses from 10 correct.",
  },
  {
    href: "/jackpot-predictions",
    anchor: "All Jackpot Predictions",
    description:
      "Sportpesa, Betika, Mozzart, Betpawa and more — weekly coupon analysis for every game.",
  },
];

export default function PredictionGuidesLinks({
  excludeHref,
  title = "Popular Prediction Guides",
}) {
  const links = excludeHref
    ? GUIDE_LINKS.filter((link) => link.href !== excludeHref)
    : GUIDE_LINKS;

  if (!links.length) return null;

  return (
    <section className="seo-content">
      <h3>{title}</h3>
      <ul>
        {links.map(({ href, anchor, description }) => (
          <li key={href}>
            <a href={href}>{anchor}</a> — {description}
          </li>
        ))}
      </ul>
    </section>
  );
}
