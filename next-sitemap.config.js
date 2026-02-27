// /home/merve/Next-Blog/next-sitemap.config.js
/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://www.thebelog.com",
  generateRobotsTxt: true,
  sitemapSize: 7000,
  generateIndexSitemap: false, // 💡 Eğer az sayfan varsa index sitemap oluşturma, direkt sitemap.xml oluşsun
  exclude: ["/server-sitemap.xml", "/admin/*"], // Admin panelini gizle
  robotsTxtOptions: {
    additionalSitemaps: [
      "https://www.thebelog.com/server-sitemap.xml", // 💡 Dinamik yazılar için birazdan oluşturacağız
    ],
  },
};
