/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: 'https://www.pitchpredictions.com',
    generateRobotsTxt: true, // (optional)
    // ...other options
    exclude: ['/my-favourite-predictions','/404','/fixtures-sitemap.xml','/fixtures-by-date-sitemap.xml'],
    robotsTxtOptions: {
      policies: [
        {
          userAgent: "*",
          disallow: ["/404"],
        },
        { userAgent: "*", allow: "/" },
      ],
      additionalSitemaps: [
        `${'https://www.pitchpredictions.com/'}country-sitemap.xml`,
        `${'https://www.pitchpredictions.com/'}leagues-sitemap.xml`,
        // `${'https://www.pitchpredictions.com/'}team-sitemap.xml`,
      ],
    },
}