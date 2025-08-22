import { getServerSideSitemap } from "next-sitemap";

export const getServerSideProps = async (ctx) => {
    const today = new Date(); // Get today's date
    const dates = []; // Create an empty array to hold the dates

    for (let i = 0; i < 11; i++) {
        const date = new Date(today); // Use the input date instead of today's date
        date.setDate(today.getDate() + i); // Add i days to the input date
        dates.push(date.toISOString().slice(0, 10)); // Add the date to the array in ISO format
      }
      
      const newsSitemaps = dates.map((date) => ({
        loc: `https://pitchpredictions.com/football-predictions-for-${date}?filter_date=${date}`, // Use the date directly instead of fixtures[0]
        lastmod: new Date().toISOString(),
      }));
      
      const fields = [...newsSitemaps];
      
      return getServerSideSitemap(ctx, fields);
}

export default function Site() {}