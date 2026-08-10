// add bootstrap css 
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import '../styles/globals.css';
import '../styles/new-styles.css';
import '../styles/matchdetails.css';
import "../styles/PopularTips.css";
import "../styles/auth-css.css";
import "../styles/customer-pay.css";
import "../styles/blog.css"; 
import Head from 'next/head';
import MetaContent from  '../components/functions/determine_meta_content_and_titles'
import Navbar from '../components/includes/navbar'
import Scrollnav from '../components/includes/scrollnav'
import Footer from '../components/includes/footer';
import React from "react";
import { useRouter } from 'next/router';
import SideNavBar from '../components/includes/sidenav';
import PersistentSidebar from '../components/layout/persistent-sidebar';
import { Adsense } from "@/components/shared/client-adsense";
// import AdsterraAd from '../components/shared/AdsterraAd';

function App({ Component, pageProps, footerSponsors = [] }) {
  var meta_content_data = MetaContent(); //Meta content dynamic data
 
  const router = useRouter(); //fetch page link data  
  const path = router.pathname;

  // Check if the current page includes 'auth' in its route
  const isAuthPage = router.pathname.includes("auth");

  // Excluded routes
  const excludedRoutes = [
    "/",
    "/blog",
    "/tips/betnumbers-predictions",
    "/tips/must-win-teams-today",
    "/jackpot-predictions",
    "/jackpot-predictions/sportpesa-mega-jackpot-predictions",
    "/jackpot-predictions/sportpesa-midweek-jackpot-predictions",
    "/jackpot-predictions/betika-midweek-jackpot-predictions",
    "/top-football-tips-and-predictions/today",
  ];

  // Check if ad should show (not excluded and not auth page)
  const shouldShowAd = !excludedRoutes.includes(path) && !isAuthPage;

  // State to track if we're on the client side
  const [isClient, setIsClient] = React.useState(false);

  // State to track current ad variant - initialize based on sessionStorage if available
  const [adVariant, setAdVariant] = React.useState(() => {
    // During SSR, return null
    if (typeof window === 'undefined') return null;
    
    // On client, check sessionStorage
    const lastShown = sessionStorage.getItem('last_ad_company');
    const hasVisited = sessionStorage.getItem('has_visited');
    
    if (hasVisited && lastShown) {
      // For returning visitors in same session, show the opposite
      return lastShown === '1XBET' ? 'AFROPARI' : '1XBET';
    }
    return null;
  });

  // Effect to handle client-side initialization
  React.useEffect(() => {
    setIsClient(true);
  }, []);

  // Global client fetch retry for unstable internet.
  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const originalFetch = window.fetch.bind(window);
    const shouldRetryStatus = (status) => status === 408 || status === 429 || status >= 500;
    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    window.fetch = async (input, init = {}) => {
      const requestUrl = typeof input === "string" ? input : input?.url || "";
      const method = (init?.method || "GET").toUpperCase();
      const isGet = method === "GET";
      const isApiRequest =
        requestUrl.includes("api.pitchpredictions.com") ||
        requestUrl.startsWith("/api/");

      if (!isGet || !isApiRequest) {
        return originalFetch(input, init);
      }

      const maxRetries = 2;
      const baseDelayMs = 600;
      let lastError;

      for (let attempt = 0; attempt <= maxRetries; attempt += 1) {
        try {
          const response = await originalFetch(input, init);

          if (!shouldRetryStatus(response.status) || attempt === maxRetries) {
            return response;
          }
        } catch (error) {
          lastError = error;
          if (attempt === maxRetries) {
            throw error;
          }
        }

        await sleep(baseDelayMs * Math.pow(2, attempt));
      }

      throw lastError || new Error("Fetch failed after retries");
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  // Effect to handle ad rotation per page view with random start
  React.useEffect(() => {
    if (!shouldShowAd || !isClient) {
      setAdVariant(null);
      return;
    }

    const hasVisited = sessionStorage.getItem('has_visited');
    const lastShown = sessionStorage.getItem('last_ad_company');
    
    if (!hasVisited) {
      // First page of session - random choice
      const firstCompany = Math.random() < 0.5 ? '1XBET' : 'AFROPARI';
      sessionStorage.setItem('last_ad_company', firstCompany);
      sessionStorage.setItem('has_visited', 'true');
      setAdVariant(firstCompany);
    } else if (!adVariant && lastShown) {
      // This handles the case where we need to set the variant for subsequent pages
      const nextCompany = lastShown === '1XBET' ? 'AFROPARI' : '1XBET';
      sessionStorage.setItem('last_ad_company', nextCompany);
      setAdVariant(nextCompany);
    }
  }, [path, shouldShowAd, isClient, adVariant]);

  // Don't render ads until client-side to prevent hydration mismatch
  const showAds = isClient && shouldShowAd;
  
  return (
    <React.Fragment>
      {/* Inject seo content for static pages excluding the dynamic pages such as match details and football predictions by date*/}
      <Head>
        <title>{meta_content_data[0]}</title>
        <link rel="icon" href="/pitch_predictions_icons.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="32x32" href="/pitch-predictions-icon-32.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/pitch-predictions-apple-touch.png" />

        {/* Fix: Use string values for crossOrigin */}
        <link rel="dns-prefetch" href="https://www.pitchpredictions.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.pitchpredictions.com" crossOrigin="anonymous" />

        <link rel="dns-prefetch" href="https://api.pitchpredictions.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://api.pitchpredictions.com" crossOrigin="anonymous" />

        <link href="https://www.googletagmanager.com/gtag/js?id=G-N7X33S1CMF" rel="preload" as="script"/>
        <link rel='dns-prefetch' href="https://www.googletagmanager.com" crossOrigin="anonymous" />
        <link rel='preconnect' href="https://www.googletagmanager.com" crossOrigin="anonymous" />

        <link rel="dns-prefetch" href="https://adservice.google.com/" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://adservice.google.com/" crossOrigin="anonymous" />

        <link rel="dns-prefetch" href="https://googleads.g.doubleclick.net/" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://googleads.g.doubleclick.net/" crossOrigin="anonymous" /> 

        <link rel="dns-prefetch" href="https://www.googletagservices.com/" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.googletagservices.com/" crossOrigin="anonymous" /> 

        <link rel="dns-prefetch" href="https://tpc.googlesyndication.com/" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://tpc.googlesyndication.com/" crossOrigin="anonymous" />

        <link rel="canonical" href={`https://www.pitchpredictions.com${router.asPath}`} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#202c3c" />
        <meta name="description" content={meta_content_data[1]} />
        <meta name="keywords" content={meta_content_data[2]} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@pitchpredictions" />
        <meta name="twitter:title" content={meta_content_data[0]} />
        <meta name="twitter:description" content={meta_content_data[1]} />
        <meta name="twitter:image" content="https://www.pitchpredictions.com/pitch-predictions-ico.png" />

        <meta property="og:title" content={meta_content_data[0]} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://www.pitchpredictions.com${router.asPath}`} />
        <meta property="og:image" content="https://www.pitchpredictions.com/pitch-predictions-ico.png" />
        <meta property="og:description" content={meta_content_data[1]} />
      </Head>
      <Navbar/>
      <main style={{ backgroundColor: router.pathname.includes("auth") ? "white" : "#212830" }}>
        <div className={`container-mob  ${router.pathname.includes("auth") ? "desktop-container-resize-auth" : "desktop-container-resize"}`}>
          <div className="d-flex" id="wrapper">
          {!isAuthPage && <SideNavBar />}
          <div id="page-content-wrapper" >
              <div className="row">
                  <div className={`${router.pathname.includes("auth") ? "col-lg-12 col-12" : "col-lg-9 col-12"}`}>
                    <div style={{marginTop: "6px", marginBottom: "3px"}}>
                      <Scrollnav/>
                    </div>
                    {/**The page title */}
                    {!isAuthPage && 
                    meta_content_data[3] != null ? 
                    <div className="col-sm-12 text-center sites-card mb-1 page-title-card"  style={{backgroundColor:"#eef7ff",fontWeight:"bold" }}>
                        <h1 className="h1headerTitle mb-0">{meta_content_data[3]}</h1>
                    </div> 
                    : ""
                    }

                    <div style={{marginTop: "0px"}}>
                      <Component {...pageProps} />
                    </div>

                    {/* {showAds && (
                      <AdsterraAd/>
                    )} */}
                                    
                  </div>    
                  {!isAuthPage && 
                  <div className="col-lg-3 d-none d-lg-block">
                    <PersistentSidebar>
                      <Adsense
                        client="ca-pub-5665711413000284"
                        slot="4434810353"
                        style={{ display: "block" }}
                        layout="display"
                        format="auto"
                      />
                    </PersistentSidebar>
                  </div>     
                }    
              </div>
          </div>
          </div>
        </div>
      </main>   
      <Footer sponsors={footerSponsors} /> 
    </React.Fragment>
  )  
}

App.getInitialProps = async (appContext) => {
  let pageProps = {};
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(appContext.ctx);
  }

  let footerSponsors = [];
  if (typeof window === "undefined") {
    try {
      const { getVisibleSponsors } = await import("../components/functions/footer_sponsors");
      footerSponsors = getVisibleSponsors();
    } catch (err) {
      console.error("Failed to load footer sponsors for SSR:", err);
    }
  }

  return { pageProps, footerSponsors };
};

export default App;