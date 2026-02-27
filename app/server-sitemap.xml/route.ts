// app/server-sitemap.xml/route.ts
import { getServerSideSitemap, ISitemapField } from "next-sitemap";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  // 1. Prisma ile tüm blog yazılarını çekiyoruz
  const posts = await prisma.post.findMany({
    select: {
      slug: true,
      createdAt: true,
    },
  });

  // 2. Yazıları sitemap formatına çeviriyoruz
  const fields: ISitemapField[] = posts.map((post) => ({
    loc: `https://www.thebelog.com/blog/${post.slug}`,
    lastmod: post.createdAt.toISOString(),
    changefreq: "daily" as const, // 💡 "as const" ekleyerek tip hatasını çözdük
    priority: 0.7,
  }));

  // 3. Ana sayfayı ekle
  fields.push({
    loc: "https://www.thebelog.com",
    lastmod: new Date().toISOString(),
    changefreq: "daily" as const, // 💡 Buraya da ekledik
    priority: 1.0,
  });

  return getServerSideSitemap(fields);
}
