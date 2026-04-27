"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import FavoriteButton from "./FavoriteButton";
import { useTranslations } from "next-intl";
import { sendGAEvent } from "@next/third-parties/google";

export default function FilteredPostList({
  initialPosts,
  locale,
}: {
  initialPosts: any[];
  locale: string;
}) {
  const searchParams = useSearchParams();
  const search = searchParams.get("search")?.toLowerCase() || "";
  const t = useTranslations();

  const getRawText = (content: string) => {
    if (!content) return "";
    let trimmed = content.trim();

    if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
      trimmed = trimmed.substring(1, trimmed.length - 1).replace(/\\"/g, '"');
    }

    if (trimmed.startsWith("<")) {
      return trimmed
        .replace(/\\"/g, '"')
        .replace(/\\n/g, " ")
        .replace(/<[^>]*>?/gm, " ")
        .replace(/&nbsp;/g, " ")
        .replace(/\s+/g, " ")
        .trim();
    }

    try {
      const doc = typeof trimmed === "string" ? JSON.parse(trimmed) : trimmed;
      let segments: string[] = [];
      const walk = (node: any) => {
        if (!node) return;
        if (node.type === "text") segments.push(node.text);
        if (node.content && Array.isArray(node.content)) {
          node.content.forEach(walk);
        }
        if (["paragraph", "heading", "listItem"].includes(node.type))
          segments.push(" ");
      };
      walk(doc);
      return segments.join("").replace(/\s+/g, " ").trim();
    } catch (e) {
      return trimmed
        .replace(/[{}":\[\]]/g, " ")
        .replace(/\\n/g, " ")
        .replace(/type|doc|content|paragraph|text|attrs|src|imageResize/g, "")
        .replace(/\s+/g, " ")
        .trim();
    }
  };

  const filteredPosts = initialPosts.filter((post) => {
    const title = post.title.toLowerCase();
    const author = post.author.toLowerCase();
    const rawContent = getRawText(post.content).toLowerCase();
    return (
      title.includes(search) ||
      author.includes(search) ||
      rawContent.includes(search)
    );
  });

  const getFirstImage = (content: string) => {
    if (!content || typeof content !== "string") return null;
    const trimmed = content.trim();
    if (trimmed.startsWith("<") || trimmed.includes("<img")) {
      const cleanHtml = trimmed.replace(/\\"/g, '"').replace(/\\n/g, "");
      const match = cleanHtml.match(/<img[^>]+src=["']([^"']+)["']/i);
      return match ? match[1] : null;
    }
    try {
      const doc = JSON.parse(trimmed);
      let src = null;
      const find = (node: any) => {
        if (src) return;
        if (
          (node.type === "image" || node.type === "imageResize") &&
          node.attrs?.src
        ) {
          src = node.attrs.src;
          return;
        }
        if (node.content) node.content.forEach(find);
      };
      find(doc);
      return src;
    } catch {
      const match = trimmed.match(/src=["']([^"']+)["']/i);
      return match ? match[1] : null;
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {filteredPosts.length > 0 ? (
        filteredPosts.map((post, index) => {
          const isNoSearch = search === "";
          const isFeatured = isNoSearch && index === 0;
          const firstImageInContent = getFirstImage(post.content);

          let displayImage =
            post.imageUrl && post.imageUrl.trim() !== ""
              ? post.imageUrl
              : firstImageInContent;

          if (displayImage) {
            displayImage = displayImage.toString().replace(/[\\"]/g, "").trim();
            if (
              !displayImage.startsWith("http") &&
              !displayImage.startsWith("/")
            ) {
              displayImage = `/${displayImage}`;
            }
          }

          const excerpt = getRawText(post.content);

          return (
            <Link
              key={post.slug}
              href={`/${locale}/blog/${post.slug}`}
              className={`group flex bg-white/40 rounded-2xl border border-slate-200/50 hover:shadow-xl transition-all duration-500
                ${isFeatured ? "md:col-span-2 flex-col md:flex-row" : "flex-col w-full"}
              `}
            >
              {/* IMAGE SECTION: Sadece görsel varsa render edilir */}
              {displayImage && (
                <div
                  className={`relative overflow-hidden ${isFeatured ? "w-full md:w-1/2 aspect-video md:aspect-auto" : "w-full aspect-video"}`}
                >
                  <Image
                    src={displayImage}
                    alt={post.title}
                    fill
                    className={`object-cover transition-transform ${isFeatured ? "rounded-l-2xl" : "rounded-t-2xl"} duration-500 group-hover:scale-105`}
                    priority={isFeatured}
                  />
                </div>
              )}

              {/* CONTENT SECTION */}
              <div
                className={`p-5 flex flex-col grow justify-between ${isFeatured && displayImage ? "md:w-1/2" : "w-full"}`}
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

                  <h2
                    className={`font-sans font-extrabold text-slate-900 group-hover:text-[#f92743] transition-colors leading-[1.1] tracking-tighter mb-2 ${isFeatured ? "text-3xl md:text-4xl italic" : "text-lg md:text-xl line-clamp-2"}`}
                  >
                    {post.title}
                  </h2>

                  {/* EXCERPT: Görsel olsa da olmasa da başlığın altında görünür (Featured kartta veya görsel yoksa) */}
                  {(isFeatured || !displayImage) && (
                    <p
                      className={`text-slate-500 text-[13px] leading-relaxed mb-4 ${isFeatured ? "line-clamp-4 md:line-clamp-6" : "line-clamp-6"}`}
                    >
                      {excerpt}
                    </p>
                  )}
                </div>

                <div className="flex justify-between items-center pt-2 mt-auto border-t border-slate-100">
                  <div className="flex flex-col">
                    <span className="text-[12px] font-bold text-slate-800">
                      {post.author}
                    </span>
                    <time className="text-[11px] text-slate-400 uppercase tracking-tighter">
                      {new Intl.DateTimeFormat(
                        locale === "tr" ? "tr-TR" : "en-US",
                        { day: "2-digit", month: "short", year: "numeric" },
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
          {t("noMatches")}
        </div>
      )}
    </div>
  );
}
