import { Html, Head, Main, NextScript } from 'next/document'
import Script from 'next/script';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="/pitch_predictions_icons.ico" />
          {/* <!-- Google tag (gtag.js) --> */}
          <script strategy="afterInteractive" src="https://www.googletagmanager.com/gtag/js?id=G-N7X33S1CMF" async></script>
          <script id='google-analytics' strategy="afterInteractive" async dangerouslySetInnerHTML={{
              __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-N7X33S1CMF', {
              page_path: window.location.pathname,
              });
              `,
          }}></script>
          
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5665711413000284"
          crossOrigin="true"></script>

        {/* <script src="https://d3u598arehftfk.cloudfront.net/prebid_hb_14089_21661.js" async> </script> */}

        <script src="https://analytics.ahrefs.com/analytics.js" data-key="q9R0LNiMBiyznB5Hsrm6CA" async></script>
      </Head>
      <body>
        <div id='zone_1653336562'></div>

        <div className="clever-core-ads"></div>
        
        {/* <div id='zone_1334364742'></div> */}

        <Main />
        <NextScript />
        <script src="https://code.jquery.com/jquery-3.6.4.slim.min.js" integrity="sha256-a2yjHM4jnF9f54xUQakjZGaqYs/V1CYvWpoqZzC2/Bw=" async crossOrigin="true"></script>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.min.js" integrity="sha384-cuYeSxntonz0PPNlHhBs68uyIAVpIIOZZ5JqeqvYYIcEL727kskC66kF92t6Xl2V" async crossOrigin="true"></script>
       {/**Taifa Bet */}
      <Script
        src="https://tafatips.com/tafatips-popup-ads.js"
        strategy="afterInteractive"
      />       
      {/* 1XBet Script  */}
        {/* <Script
            id="ftd-agency-script"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                (function(w,d,o,g,r,a,m){
                    var cid='zone_1653336562';
                    w[r]=w[r]||function(){(w[r+'l']=w[r+'l']||[]).push(arguments)};
                    function e(b,w,r){if((w[r+'h']=b.pop())&&!w.ABN){
                        var a=d.createElement(o),p=d.getElementsByTagName(o)[0];a.async=1;
                        a.src='https://cdn.'+w[r+'h']+'/libs/e.js';a.onerror=function(){e(g,w,r)};
                        p.parentNode.insertBefore(a,p)}}e(g,w,r);
                    w[r](cid,{id:1653336562,domain:w[r+'h']});
                })(window,document,'script',['ftd.agency'],'ABNS');
              `,
            }}
          /> */}
          {/* Clever Core Script  */}
          <Script
            id="clever-core"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                (function (document, window) {
                  var a, c = document.createElement("script"), f = window.frameElement;

                  c.id = "CleverCoreLoader78681";
                  c.src = "https://scripts.cleverwebserver.com/dd81450c8861a32004d657e2b04f386d.js";
                  c.async = true;
                  c.type = "text/javascript";
                  c.setAttribute("data-target", window.name || (f && f.getAttribute("id")));
                  c.setAttribute("data-callback", "put-your-callback-function-here");
                  c.setAttribute("data-callback-url-click", "put-your-click-macro-here");
                  c.setAttribute("data-callback-url-view", "put-your-view-macro-here");

                  try {
                    a = parent.document.getElementsByTagName("script")[0] || document.getElementsByTagName("script")[0];
                  } catch (e) {
                    a = false;
                  }
                  a || (a = document.getElementsByTagName("head")[0] || document.getElementsByTagName("body")[0]);
                  a.parentNode.insertBefore(c, a);
                })(document, window);
              `,
            }}
          />

          {/* <Script
            id="ftd-agency-script-1334364742"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                (function(w,d,o,g,r,a,m){
                    var cid='zone_1334364742';
                    w[r]=w[r]||function(){(w[r+'l']=w[r+'l']||[]).push(arguments)};
                    function e(b,w,r){
                        if((w[r+'h']=b.pop())&&!w.ABN){
                            var a=d.createElement(o),p=d.getElementsByTagName(o)[0];
                            a.async=1;
                            a.src='https://cdn.'+w[r+'h']+'/libs/e.js';
                            a.onerror=function(){e(g,w,r)};
                            p.parentNode.insertBefore(a,p);
                        }
                    }
                    e(g,w,r);
                    w[r](cid,{id:1334364742,domain:w[r+'h']});
                })(window,document,'script',['ftd.agency'],'ABNS');
              `,
            }}
          /> */}
      </body>
    </Html>
  )
}
