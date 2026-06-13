'use client';
import Script from "next/script";

const sponsors = [
  /* Renewed every three months, first added 16-05-2026, expires 16-08-2026 */
  { label: 'Socolive TV',                      url: 'https://www.ericbauman.com/'          },

  /* Renewed every three months, first added 24-05-2026, expires 24-08-2026 */
  { label: 'Jalalive Tv',                      url: 'https://bsidefilm.com/'               },

  /* Renewed every month on 06, first added 06-04-2026, expires 06-07-2026 */
  { label: 'trực tiếp bóng đá hôm nay',        url: 'https://colatvttbd.net/'              },
  { label: 'xoilac',                           url: 'https://xoilactvttbd.com/'            },
  { label: 'trực tiếp bóng đá hôm nay',        url: 'https://xoilac-tv.icu'                },
  { label: 'cakhia tv',                        url: 'https://cakhiatvttbd.com/'            },
  { label: '1Agame',                           url: 'https://1agame.io/'                   },
  /* expires 06-07-2026 end */

  /* Renewed every month on 05, first added 05-06-2026, expires 05-07-2026 — Vietnamese partner */
  { label: 'vsbet',                            url: 'https://vsbet.co/'                    },
  { label: 'nhà cái vsbet',                   url: 'https://vsbet.cc/'                    },
  { label: 'vsbet',                            url: 'https://vsbet.br.com/'                },
  { label: 'vsbet',                            url: 'https://vsbets.co.com/'               },
  { label: 'vs bet',                           url: 'https://vaboose.cn.com/'              },
  /* expires 05-07-2026 end */

  /* Renewed every month on 06, first added 06-04-2026, expires 06-07-2026 */
  { label: 'socolive',                         url: 'https://socolivettbd.net/'            },
  { label: '90phut',                           url: 'https://90phutttbd.org/'              },
  { label: 'xoilac',                           url: 'https://lytuong.net/'                 },
  { label: 'xoilac',                           url: 'https://xoilactvv.com/'               },
  { label: 'xem bong da xoilac',               url: 'https://xoilactvv.org/'               },
  { label: 'xem bong da xoilac',               url: 'https://xoilactvv.online/'            },
  { label: 'xoilac tv',                        url: 'https://xoilactvv.co/'                },
  { label: 'xem bóng đá xoilac',              url: 'https://xoilactvv.football/'          },
  { label: 'cà khịa tv',                      url: 'https://cakhiatvv.live/'              },
  { label: 'trực tiếp bóng đá hôm nay',        url: 'https://cakhiatvv.online/'            },
  { label: 'cakhiatv trực tiếp bóng đá',       url: 'https://cakhiatvv.ink/'               },
  { label: '90phut tv',                        url: 'https://90phuttv.in.net/'             },
  { label: 'bóng đá trực tiếp',               url: 'https://90phuttv.futbol/'             },
  { label: '90phut tv',                        url: 'https://90phuttv.bid/'                },
  { label: 'xem bóng đá trực tiếp',           url: 'https://xembongda.ai/'               },
  { label: 'xem trực tiếp bóng đá',           url: 'https://xembongda.co.com/'           },
  { label: 'xem bóng đá trực tuyến',          url: 'https://xembongda.com.co/'           },
  { label: 'xem bóng đá trực tiếp',           url: 'https://tructiepbongda.fans/'         },
  { label: 'trực tiếp bóng đá',               url: 'https://tructiepbongda.fyi/'          },
  { label: 'xem trực tiếp bóng đá',           url: 'https://tructiepbongda.mobile/'       },
  { label: 'cakhiatv',                         url: 'https://xemcakhia.net/'               },
  { label: 'xoilac bóng đá',                  url: 'https://xoilac7.cc/'                  },
  { label: 'xoilac tv',                        url: 'https://xoilactvv-live.com/'          },
  /* expires 06-07-2026 end */

  /* New text link, expires 09-06-2026 */
  { label: 'Loto188',                         url: 'https://aloto188.com/'                },
];

const LINK_COLOR = "#0d6efd"; // standard clickable link blue

function SponsorLinks() {
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
            key={`${sponsor.url}-${index}`}
            href={sponsor.url}
            target="_blank"
            rel="sponsored nofollow noopener noreferrer"
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

        <hr className="my-4"/>

        {/* Sponsor Links — all partners in SSR HTML */}
        <SponsorLinks />

        <hr className="my-4"/>

        {/* Copyright */}
        <section className="py-2 fixturesTextSize" style={{ fontSize: "14px" }}>
          <div className="row">
            <div className="text-center">
              Copyright ©<span id="year"></span> pitchpredictions.com All rights reserved.
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