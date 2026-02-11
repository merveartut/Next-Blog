//app/[locale]/page.tsx

import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { getTranslations } from "next-intl/server";
import { getServerSession } from "next-auth";
import FilteredPostList from "@/components/FilteredPostList";
import PopularPostList from "@/components/PopularPostList";

interface PageProps {
  params: { locale: string };
}

export default async function BlogListPage({ params }: PageProps) {
  const { locale } = await params;
  const session = await getServerSession();
  const t = await getTranslations({ locale });

  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      favoritedBy: session?.user?.email
        ? {
            where: { email: session.user.email },
            select: { email: true },
          }
        : false,
    },
  });

  const popularPosts = await prisma.post.findMany({
    where: {
      favoriteCount: {
        gt: 0, // "Greater Than 0" -> 0'dan büyük olanları getir
      },
    },
    orderBy: {
      favoriteCount: "desc",
    },
    take: 5,
  });

  return (
    <main className="min-h-screen h-auto bg-[#f5f3ea] pb-24 md:pb-32">
      {/* Container: Mobilde tam genişlik, masaüstünde px-32 yerine daha güvenli max-width ve responsive padding */}
      <div className=" mx-auto bg-[#f5f3ea] px-4 lg:px-12 xl:px-48">
        {/* Header Section */}
        <section className="relative py-10 md:py-16 overflow-hidden">
          <div className="relative text-start border-b border-slate-400 pb-10">
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-medium text-slate-900 mb-6 md:mb-8 leading-[1.1] tracking-tight">
              Curated Thoughts on <span className="text-[#f92743]">Code</span>,
              <br className="hidden md:block" /> Life, and Everything in
              Between.
            </h1>
          </div>
        </section>

        {/* Grid: mobilde 1, tablette 2, masaüstünde 4 sütun */}
        <FilteredPostList initialPosts={posts} locale={locale} />
        {/* Popular Posts Section */}

        {popularPosts.length > 0 && (
          <PopularPostList
            posts={popularPosts}
            locale={locale}
            title={`${t("most")} ${t("loved")}`}
            subtitle="— The thoughts that resonated most with the community."
          />
        )}
      </div>
    </main>
  );
}
