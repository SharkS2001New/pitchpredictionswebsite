import { getServerSideSitemap } from "next-sitemap";

export const getServerSideProps = async (ctx) => {
    const headers = {
        Origin: "https://www.pitchpredictions.com", Authorization: `Bearer ${process.env.ACCESS_TOKEN || "UJlhuDILIR1Lc2IEwZDIKOln9d"}`,
        "Origin": "https://www.pitchpredictions.com"
    };

    let response = await fetch("https://api.pitchpredictions.com/api/fetch_all_countries_and_leagues",{
        headers: headers
    });

    var data = await response.json();

    const uniqueUrls = new Set();
    const newsSitemaps = [];

    data.data.forEach((league) => {
        const url = `${'https://www.pitchpredictions.com/league/football-predictions-for-'}${league.country_name.replace(/[&\s]+/g, "-").toLowerCase()+"/"+league.league_name.replace(/[&\s]+/g, "-").toLowerCase()+"-"+league.league_id+"/fixtures"}`;
        if (!uniqueUrls.has(url)) {
            newsSitemaps.push({
            loc: url,
            lastmod: new Date().toISOString(),
            });
            uniqueUrls.add(url);
        }
    });
    
    // leagues/kenya/super-league
  const fields = [...newsSitemaps];

  return getServerSideSitemap(ctx, fields);
};

  
export default function Site() {}