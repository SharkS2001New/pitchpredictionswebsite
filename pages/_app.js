// add bootstrap css 
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import '../styles/globals.css';
import '../styles/new-styles.css';
import '../styles/matchdetails.css';
import "../styles/PopularTips.css";
import "../styles/auth-css.css";
import "../styles/blog.css"; 
import Head from 'next/head';
import MetaContent from  '../components/functions/determine_meta_content_and_titles'
import Navbar from '../components/includes/navbar'
import Scrollnav from '../components/includes/scrollnav'
import Footer from '../components/includes/footer';
import React from "react";
import { useRouter } from 'next/router';
import SideNavBar from '../components/includes/sidenav';
import MyCalendar from '../components/includes/Calendar';
import FixtureOfTheDay from '../components/shared/Fixtureoftheday';
import { Adsense } from "@ctrl/react-adsense";
// import Starz888PopupBanner from '../components/shared/Starz888PopupBanner';
import O1XBetClickUnderAds from '../components/shared/O1XBetClickUnderAds';

function App({ Component, pageProps }) {
  var meta_content_data = MetaContent(); //Meta content dynamic data
 
  const router = useRouter(); //fetch page link data  
  const path = router.pathname;

  // Check if the current page includes 'auth' in its route
  const isAuthPage = router.pathname.includes("auth");

    // Excluded routes
  const excludedRoutes = [
    "/",
    "/blog",
    "/jackpot-predictions",
    "/jackpot-predictions/sportpesa-mega-jackpot-predictions",
    "/jackpot-predictions/sportpesa-midweek-jackpot-predictions",
    "/top-football-tips-and-predictions/today",
  ];

  // Only render if NOT excluded
  const shouldShowAd = !excludedRoutes.includes(path);

  return (
    <React.Fragment>
      {/* Inject seo content for static pages excluding the dynamic pages such as match details and football predictions by date*/}
      <Head>
        <title>{meta_content_data[0]}</title>
        <link rel="icon" href="/pitch_predictions_icons.ico" />

        <link rel="dns-prefetch" href="https://www.pitchpredictions.com" crossOrigin />
        <link rel="preconnect" href="https://www.pitchpredictions.com" crossOrigin />

        <link rel="dns-prefetch" href="https://api.pitchpredictions.com" crossOrigin />
        <link rel="preconnect" href="https://api.pitchpredictions.com" crossOrigin />

        <link href="https://www.googletagmanager.com/gtag/js?id=G-N7X33S1CMF" rel="preload" as="script"/>
        <link rel='dns-prefetch' href="https://www.googletagmanager.com" crossOrigin />
        <link rel='preconnect' href="https://www.googletagmanager.com" crossOrigin />

        <link rel="dns-prefetch" href="https://adservice.google.com/" crossOrigin />
        <link rel="preconnect" href="https://adservice.google.com/" crossOrigin />

        <link rel="dns-prefetch" href="https://googleads.g.doubleclick.net/" crossOrigin />
        <link rel="preconnect" href="https://googleads.g.doubleclick.net/" crossOrigin /> 

        <link rel="dns-prefetch" href="https://www.googletagservices.com/" crossOrigin />
        <link rel="preconnect" href="https://www.googletagservices.com/" crossOrigin /> 

        <link rel="dns-prefetch" href="https://tpc.googlesyndication.com/" crossOrigin />
        <link rel="preconnect" href="https://tpc.googlesyndication.com/" crossOrigin />

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
      <div style={{ backgroundColor: router.pathname.includes("auth") ? "white" : "#212830" }}>
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
                    <div className="col-sm-12 text-center text-nowrap sites-card mb-1"  style={{backgroundColor:"#eef7ff",fontWeight:"bold" }}>
                        <h1 className="h1headerTitle mb-0">{meta_content_data[3]}</h1>
                    </div> 
                    : ""
                    }

                    <div style={{marginTop: "0px"}}>
                      <Component {...pageProps} />
                    </div>
                    {/* <Starz888PopupBanner/> */}

                    {/**1xbet click under ads */}
                    {shouldShowAd && !isAuthPage && <O1XBetClickUnderAds />}

                  </div>    
                  {!isAuthPage && 
                  <div className="col-lg-3 d-none d-lg-block">
                    {/**Visible only on lg */}
                    <div style={{marginTop: "6px"}}>
                      <MyCalendar/>
                      <br/>
                      <FixtureOfTheDay/>  
                      <br/>
                      <Adsense
                        client="ca-pub-5665711413000284"
                        slot="4434810353"
                        style={{ display: "block" }}
                        layout="display"
                        format="auto"
                      />                 
                    </div>
                  </div>     
                }    
              </div>
          </div>
          </div>
        </div>
        <Footer/> 
      </div>   
    </React.Fragment>
  )  
}

export default  App;