import { getServerSideSitemap } from "next-sitemap";

export const getServerSideProps = async (ctx) => {
  const headers = {
    "Authorization": "R9TxV3PbOEu7qZnJKgydC5LmX2",
    "Origin": "https://www.pitchpredictions.com"
  };
  
  let response = await fetch("https://api.pitchpredictions.com/api/fetch_sitemaps_fixture_details",{
      headers: headers
  });

  var data = await response.json();

  const uniqueUrls = new Set();
  const newsSitemaps = [];
  
  data.data.forEach((fixture) => {
    const url = `${'https://www.pitchpredictions.com/match/football-predictions-'}${encodeURIComponent(fixture.home_team_name.replace(/\s+/g, '-').toLowerCase() +'-vs-'+ fixture.away_team_name.replace(/\s+/g, '-').toLowerCase()+'-'+ fixture.fixture_id.toString())+"/matches"}`;
    if (!uniqueUrls.has(url)) {
      newsSitemaps.push({
        loc: url,
        lastmod: new Date().toISOString(),
      });
      uniqueUrls.add(url);
    }
  });
  
  const fields = [...newsSitemaps];

  return getServerSideSitemap(ctx, fields);
};

export default function Site() {}