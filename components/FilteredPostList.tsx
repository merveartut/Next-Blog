"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import FavoriteButton from "./FavoriteButton";
import { useContext } from "react";
import { LoadingContext } from "./LoadingProvider";

export default function FilteredPostList({
  initialPosts,
  locale,
}: {
  initialPosts: any[];
  locale: string;
}) {
  const searchParams = useSearchParams();
  const search = searchParams.get("search")?.toLowerCase() || "";

  const filteredPosts = initialPosts.filter((post) => {
    const title = post.title.toLowerCase();
    const author = post.author.toLowerCase();
    const content = post.content.replace(/<[^>]*>?/gm, " ").toLowerCase();
    return (
      title.includes(search) ||
      author.includes(search) ||
      content.includes(search)
    );
  });

  const stripHtml = (html: string) => {
    if (!html) return "";
    return html
      .replace(/\\"/g, '"') // Kaçışlı tırnakları (\") temizle
      .replace(/\\n/g, " ") // Satır sonlarını boşluğa çevir
      .replace(/<[^>]*>?/gm, " ") // HTML etiketlerini temizle
      .replace(/&nbsp;/g, " ") // HTML boşluk karakterlerini temizle
      .replace(/\s+/g, " ") // Fazla boşlukları tek boşluğa indir
      .trim();
  };

  const getFirstImage = (html: string) => {
    if (!html) return null;
    const cleanHtml = html.replace(/&quot;/g, '"').replace(/\\"/g, '"');
    const match = cleanHtml.match(/<img[^>]+src=["']([^"']+)["']/i);
    if (!match) return null;
    return match[1].replace(/^[\\"]+|[\\"]+$/g, "").trim();
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {filteredPosts.length > 0 ? (
        filteredPosts.map((post, index) => {
          const isNoSearch = search === "";
          const isFeatured = isNoSearch && index === 0;

          const firstImageInContent = getFirstImage(post.content);

          // DEĞİŞİKLİK: Placeholder'ı sildik, sadece gerçek görsel varsa displayImage dolacak
          let displayImage =
            post.imageUrl && post.imageUrl.trim() !== ""
              ? post.imageUrl
              : firstImageInContent;

          if (displayImage) {
            displayImage = displayImage.replace(/[\\"]/g, "").trim();
            if (
              !displayImage.startsWith("http") &&
              !displayImage.startsWith("/")
            ) {
              displayImage = `/${displayImage}`;
            }
          }

          return (
            <Link
              key={post.slug}
              prefetch={true}
              href={`/${locale}/blog/${post.slug}`}
              className={`group flex bg-white/40 rounded-2xl border border-slate-200/50 hover:shadow-xl transition-all duration-500
      ${isFeatured ? "md:col-span-2 flex-col md:flex-row" : "flex-col w-full"}
    `}
            >
              {/* Image Section */}
              {displayImage && (
                <div
                  className={`relative overflow-hidden bg-slate-50 
                ${isFeatured ? "w-full md:w-1/2 aspect-video md:aspect-auto" : "w-full aspect-video"}`}
                >
                  <Image
                    src={displayImage}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    priority={isFeatured}
                  />
                </div>
              )}

              {/* Content Section */}
              <div
                className={`p-3 flex flex-col grow justify-between 
                  ${isFeatured ? (displayImage ? "md:w-1/2 md:p-5" : "w-full md:p-8") : "w-full"}`}
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    {post.categories.slice(0, 1).map((cat: any) => (
                      <span
                        key={cat}
                        className="text-[10px] font-mono font-bold uppercase tracking-tighter text-[#f92743]"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>

                  <div className="relative group/title">
                    <h2
                      className={`font-sans font-extrabold text-slate-900 group-hover:text-[#f92743] transition-colors leading-[1.1] tracking-tighter
      ${isFeatured ? "text-3xl md:text-4xl line-clamp-2 mb-4 italic" : "text-lg md:text-xl mb-1 line-clamp-2"}
    `}
                    >
                      {post.title}
                    </h2>

                    {/* Tooltip: Artık h2'nin dışında ama aynı grup içinde */}
                    <span className="invisible opacity-0 group-hover/title:visible group-hover/title:opacity-100 pointer-events-none absolute left-0 -top-2 -translate-y-full w-max max-w-[280px] transition-all duration-200 rounded-lg bg-slate-900 px-3 py-2 text-[12px] font-bold text-white shadow-2xl z-[9999] leading-normal whitespace-normal break-words after:content-[''] after:absolute after:top-full after:left-4 after:border-8 after:border-transparent after:border-t-slate-900">
                      {post.title}
                    </span>
                  </div>

                  {(isFeatured || !displayImage) && (
                    <p
                      className={`text-slate-500 text-[13px] leading-relaxed mb-4
        ${
          isFeatured
            ? "line-clamp-6 md:line-clamp-4" // Featured için uzun özet
            : "line-clamp-6" // Görseli olmayan küçük kartlar için orta uzunlukta özet
        }`}
                    >
                      {stripHtml(post.content)}
                    </p>
                  )}
                </div>

                <div className="flex justify-between items-center pt-2 mt-1 border-t border-slate-50">
                  <div className="flex flex-col">
                    <span className="text-[12px] font-bold text-slate-800">
                      {post.author}
                    </span>
                    <time className="text-[11px] text-slate-400 uppercase tracking-tighter">
                      {new Intl.DateTimeFormat(
                        locale === "tr" ? "tr-TR" : "en-US",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        },
                      ).format(new Date(post.createdAt))}
                    </time>
                  </div>
                  <FavoriteButton
                    slug={post.slug}
                    initialCount={post.favoriteCount}
                    isCompact={true}
                    isInitiallyFavorited={
                      post.favoritedBy && post.favoritedBy.length > 0
                    }
                  />
                </div>
              </div>
            </Link>
          );
        })
      ) : (
        <div className="col-span-full py-20 text-center font-mono text-slate-400 italic text-sm">
          No matches found in the typewriter archives...
        </div>
      )}
    </div>
  );
}
