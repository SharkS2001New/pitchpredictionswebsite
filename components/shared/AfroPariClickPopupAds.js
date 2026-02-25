"use client";

import { useEffect } from "react";

function AfroPariClickPopupAds() {
  useEffect(() => {
    // Dynamically load the script only once
    const existing = document.getElementById("ads-zone-1334364742-script");
    if (existing) return;

    const script = document.createElement("script");
    script.id = "ads-zone-1334364742-script";
    script.async = true;
    script.innerHTML = `
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
    `;
    document.body.appendChild(script);
  }, []);

  return <div id="zone_1334364742"></div>;
}

export default AfroPariClickPopupAds;