import { getServerSideSitemap } from "next-sitemap";

export const getServerSideProps = async (ctx) => {
  const headers = {
      "Authorization": "R9TxV3PbOEu7qZnJKgydC5LmX2",
      "Origin": "https://www.pitchpredictions.com"
  };

  let response = await fetch("https://api.pitchpredictions.com/api/fetch_teams_id",{
      headers: headers
  });

  var data = await response.json();

  const uniqueUrls = new Set();
  const newsSitemaps = [];
  
  data.data.forEach((fixture) => {
    // Check if fixture.teamName is not null or undefined before using replace
    if (fixture.teamName) {
      const url = `https://www.pitchpredictions.com/team/${encodeURIComponent(fixture.teamName.replace(/\s+/g, '-').toLowerCase())}-${fixture.teamId.toString()+"/results"}`;
      if (!uniqueUrls.has(url)) {
        newsSitemaps.push({ 
          loc: url,
          lastmod: new Date().toISOString(),
        });
        uniqueUrls.add(url);
      }
    }
  });
  
  const fields = [...newsSitemaps];

  return getServerSideSitemap(ctx, fields);
};

export default function Site() {}
