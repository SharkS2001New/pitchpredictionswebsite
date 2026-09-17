'use client';
import Script from "next/script";
import { useEffect, useState } from "react";
import footerSponsorsDocument from "../../public/site-content/footer-sponsors.json";
import { getEmbeddedVisibleSponsors } from "../functions/footer_sponsors_core";

const LINK_COLOR = "#0d6efd"; // standard clickable link blue

function getInitialSponsors() {
  return getEmbeddedVisibleSponsors(footerSponsorsDocument);
}

function SponsorLinks() {
  const [sponsors, setSponsors] = useState(getInitialSponsors);

  useEffect(() => {
    let cancelled = false;

    const refresh = async () => {
      try {
        const res = await fetch("/api/site-content/footer-sponsors", {
          cache: "no-store",
          headers: { Accept: "application/json" },
        });
        if (!res.ok || cancelled) return;
        const json = await res.json();
        if (!cancelled && Array.isArray(json?.links)) {
          setSponsors(json.links);
        }
      } catch {
        // Keep the embedded links — never hide partners while a refresh fails.
      }
    };

    refresh();

    return () => {
      cancelled = true;
    };
  }, []);

  if (!sponsors.length) {
    return null;
  }

  return (
    <div
      className="footer-sponsor-links"
      style={{
        borderTop: "1px solid rgba(255,255,255,0.15)",
        marginTop: "20px",
        paddingTop: "20px",
        paddingBottom: "8px",
        textAlign: "center",
      }}
    >
      <p
        style={{
          fontSize: "14px",
          letterSpacing: "0.08em",
          color: "rgba(255,255,255,0.75)",
          marginBottom: "14px",
          textTransform: "uppercase",
          fontWeight: 700,
        }}
      >
       Our Partners & Sponsors
      </p>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "12px 16px",
        }}
      >
        {sponsors.map((sponsor, index) => (
          <a
            key={`${sponsor.id || sponsor.url}-${index}`}
            href={sponsor.url}
            target="_blank"
            rel={
              Array.isArray(sponsor.rel) && sponsor.rel.length
                ? sponsor.rel.join(" ")
                : "noopener noreferrer"
            }
            style={{
              color: LINK_COLOR,
              fontSize: "14px",
              textDecoration: "underline",
            }}
          >
            {sponsor.label}
          </a>
        ))}
      </div>
    </div>
  );
}

function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer
      className="py-4 text-lg-start text-white footer"
      style={{ backgroundColor: "#202c3c", fontSize: "15px", lineHeight: 1.6 }}
    >
      <div className="container-mob desktop-container-resize p-4 pb-2">
        <div className="row">

          {/* Brand / About */}
          <div className="col-md-4 mb-4">
            <span className="mb-2 font-weight-bold footerLinks">
              What Is Pitch Predictions ?
            </span><br/><br/>
            <p className="fixturesTextSize">
              Pitch Predictions is your ultimate destination for accurate and data-driven football predictions,
              fixtures, standings, live scores, and results from major leagues worldwide. Our expert analysis and
              insights help you make informed betting decisions and stay ahead of the game. Join us now to elevate your football betting experience.
            </p>

            {/* Facebook */}
            <a
              className="btn btn-outline-light btn-floating m-1"
              href="https://www.facebook.com/profile.php?id=100094600476269"
              target="_blank"
              role="button"
              aria-label="Facebook"
            >
              <i className="bi bi-facebook"></i>
            </a>

            {/* Twitter */}
            <a
              className="btn btn-outline-light btn-floating m-1"
              role="button"
              aria-label="Twitter"
              target="_blank"
            >
              <i className="bi bi-twitter"></i>
            </a>

            {/* Instagram */}
            <a
              className="btn btn-outline-light btn-floating m-1"
              role="button"
              aria-label="Instagram"
            >
              <i className="bi bi-instagram"></i>
            </a>

            {/* Telegram */}
            <br/><br/>
            <div className="card">
              <div className="container text-center mb-2">
                <p style={{color: "black"}}>For free tips and Free Jackpot tips, Join our Telegram Channel.</p>
                <a
                  href="https://t.me/s/betsassuredkenya"
                  style={{color: "white", fontWeight: "bold"}}
                  className="btn btn-info"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  &nbsp;&nbsp;<i className="bi bi-telegram"></i>&nbsp;&nbsp;VIEW CHANNEL
                </a>
              </div>
            </div>
          </div>

          {/* Support Links */}
          <div className="col-4 col-md-2">
            <span className="mb-4 font-weight-bold footerLinks">Support Links</span><br/><br/>
            <ul className="nav flex-column fixturesTextSize">
              <li className="nav-item mb-2"><a href="/terms-and-conditions" className="nav-a p-0 text-light">Terms and Conditions</a></li>
              <li className="nav-item mb-2"><a href="/privacy-policy" className="nav-a p-0 text-light">Privacy Policy</a></li>
              <li className="nav-item mb-2"><a href="/contactus" className="nav-a p-0 text-light">Contact us</a></li>
              <li className="nav-item mb-2"><a href="/our-partners" className="nav-a p-0 text-light">Our Partners</a></li>
              <li className="nav-item mb-2"><a href="/blog" className="nav-a p-0 text-light">Blogs</a></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="col-8 col-md-3">
            <span className="mb-4 font-weight-bold footerLinks">Quick links</span><br/><br/>
            <ul className="nav flex-column fixturesTextSize footerPart3">
              <li className="nav-item mb-2"><a href="/football-predictions-today" className="nav-a p-0 text-light">Football Predictions for Today</a></li>
              <li className="nav-item mb-2"><a href="/football-predictions-tomorrow" className="nav-a p-0 text-light">Football Predictions for tomorrow</a></li>
              <li className="nav-item mb-2"><a href="/football-predictions-weekend" className="nav-a p-0 text-light">Football Predictions for the Weekend</a></li>
              <li className="nav-item mb-2"><a href="/jackpot-predictions" className="nav-a p-0 text-light">Jackpot Predictions</a></li>
              <li className="nav-item mb-2"><a href="/sitemaps" className="nav-a p-0 text-light">Sitemaps</a></li>
              <li className="nav-item mb-2"><a href="https://www.alljackpotpredictions.com/jackpots/sportpesa-mega-jackpot-predictions" target="_blank" className="nav-a p-0 text-light">Sportpesa Mega Jackpot Predictions</a></li>
              <li className="nav-item mb-2"><a href="https://www.baopredictions.com/sure-bets-today" target="_blank" className="nav-a p-0 text-light">Sure Bets Today</a></li>
            </ul>
          </div>

          {/* Popular Leagues */}
          <div className="col-md-3">
            <span className="font-weight-bold footerLinks mb-5">Popular Leagues</span><br/><br/>
            <ul className="nav flex-column fixturesTextSize footerPart3">
              <li className="nav-item mb-2"><a href="/league/football-predictions-for-england/premier-league-39/fixtures" className="nav-a p-0 text-light">Football Predictions for England Premier League</a></li>
              <li className="nav-item mb-2"><a href="/league/football-predictions-for-spain/la-liga-140/fixtures" className="nav-a p-0 text-light">Football Predictions for Spain La Liga</a></li>
              <li className="nav-item mb-2"><a href="/league/football-predictions-for-germany/bundesliga-78/fixtures" className="nav-a p-0 text-light">Football Predictions for Germany Bundesliga</a></li>
              <li className="nav-item mb-2"><a href="/league/football-predictions-for-italy/serie-a-135/fixtures" className="nav-a p-0 text-light">Football Predictions for Italy Serie A</a></li>
              <li className="nav-item mb-2"><a href="/league/football-predictions-for-france/ligue-1-61/fixtures" className="nav-a p-0 text-light">Football Predictions for France Ligue 1</a></li>
            </ul>
          </div>

        </div>

        <hr className="my-3"/>

        {/* Responsible Gambling */}
        <div
          className="responsible-gambling text-center fixturesTextSize"
          style={{ fontSize: "14px", lineHeight: "1.7" }}
        >
          <strong>⚠️ Responsible Gambling:</strong> Pitch Predictions provides predictions and analysis
          for informational and entertainment purposes only. Betting involves financial risk —
          never bet more than you can afford to lose. Gambling can be addictive.
          If gambling is affecting you or someone you know, seek help at{" "}
          <a
            href="https://www.begambleaware.org"
            target="_blank"
            rel="nofollow noopener noreferrer"
            className="text-warning"
          >
            BeGambleAware.org
          </a>{" "}
          or contact your national gambling helpline. You must be 18 years or older to use betting services.
          Pitch Predictions does not guarantee any prediction outcomes.
        </div>

        {/* Sponsor links are in the initial HTML (not waited on a client fetch). */}
        <SponsorLinks />

        <hr className="my-4"/>

        {/* Copyright */}
        <section className="py-2 fixturesTextSize" style={{ fontSize: "14px" }}>
          <div className="row">
            <div className="text-center">
              Copyright ©{year} pitchpredictions.com All rights reserved.
            </div>
            <div className="text-center text-md-end">
              <button type="button" className="btn btn-danger btn-floating btn-lg" id="btn-back-to-top">
                <i className="bi bi-arrow-up-circle-fill" role="button" aria-label="Back To Top"></i>
              </button>
            </div>
          </div>
        </section>

      </div>
      <Script src="/js/scripts.js" />
    </footer>
  );
}

export default Footer;
