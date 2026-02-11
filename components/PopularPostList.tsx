"use client";

import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";

export default function PopularPostList({
  posts,
  locale,
  title,
  subtitle,
}: {
  posts: any[];
  locale: string;
  title: string;
  subtitle: string;
}) {
  // 1. Görsel yakalama ve temizleme mantığı
  const getFirstImage = (html: string) => {
    if (!html) return null;
    const cleanHtml = html.replace(/&quot;/g, '"').replace(/\\"/g, '"');
    const match = cleanHtml.match(/<img[^>]+src=["']([^"']+)["']/i);
    if (!match) return null;
    return match[1].replace(/^[\\"]+|[\\"]+$/g, "").trim();
  };

  // 2. HTML etiketlerini temizleme (Özet için)
  const stripHtml = (html: string) => {
    if (!html) return "";
    return html
      .replace(/\\"/g, '"')
      .replace(/\\n/g, " ")
      .replace(/<[^>]*>?/gm, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  };

  const t = useTranslations();

  return (
    <section className="mt-20 md:mt-32 border-t border-slate-400 pt-16 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4 px-4">
        <div>
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter uppercase">
            {t("most")} <span className="text-[#f92743]">{t("loved")}</span>
          </h2>
          <p className="text-slate-500 font-mono text-sm mt-2">{subtitle}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {posts.map((post, index) => {
          const firstImage = getFirstImage(post.content);

          // Görsel varsa yolunu ayarla, yoksa null bırak (placeholder göstermiyoruz)
          let popularImage =
            post.imageUrl && post.imageUrl.trim() !== ""
              ? post.imageUrl
              : firstImage;

          if (popularImage) {
            popularImage = popularImage.replace(/[\\"]/g, "").trim();
            if (
              !popularImage.startsWith("http") &&
              !popularImage.startsWith("/")
            ) {
              popularImage = `/${popularImage}`;
            }
          }

          return (
            <Link
              key={post.id}
              href={`/${locale}/blog/${post.slug}`}
              className="group relative bg-white border border-slate-200 p-4 rounded-2xl hover:border-[#f92743] transition-all duration-300 flex flex-col h-full hover:shadow-lg"
            >
              {/* Küçük Sıra Numarası */}
              <span className="absolute -top-3 -left-3 w-8 h-8 bg-slate-900 text-white flex items-center justify-center font-black text-xs rounded-lg rotate-[-10deg] group-hover:rotate-0 transition-transform z-10">
                0{index + 1}
              </span>

              {/* Image Section - Sadece görsel varsa görünür */}
              {popularImage && (
                <div className="relative aspect-square w-full mb-4 overflow-hidden rounded-xl bg-slate-50">
                  <Image
                    src={popularImage}
                    alt={post.title}
                    fill
                    className="object-cover transition-all duration-500 md:grayscale md:group-hover:grayscale-0 group-hover:scale-105"
                  />
                </div>
              )}

              {/* Text Section */}
              <div className="flex flex-col grow">
                <h3
                  className={`font-bold text-slate-900 leading-tight group-hover:text-[#f92743] mb-2 transition-colors
                  ${popularImage ? "text-sm line-clamp-2" : "text-lg line-clamp-3"}
                `}
                >
                  {post.title}
                </h3>

                {/* Görsel yoksa içerikten özet göster */}
                {!popularImage && (
                  <p className="text-slate-500 text-[12px] line-clamp-5 leading-relaxed mb-4 font-serif italic">
                    {stripHtml(post.content)}
                  </p>
                )}
              </div>

              <div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-50">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                  {post.author}
                </span>
                <div className="flex items-center gap-1 text-[#f92743]">
                  <span className="text-xs font-black">
                    {post.favoriteCount}
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-3 h-3"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c.887-.76.415-2.212-.749-2.305l5.404-.433 2.082-5.006z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
