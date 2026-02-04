import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";

export default async function BlogListPage() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
  });

  const stripHtml = (html: string) => {
    return html
      .replace(/<[^>]*>?/gm, " ")
      .replace(/\s+/g, " ")
      .trim();
  };

  const getFirstImage = (html: string) => {
    const match = html.match(/<img[^>]+src=["']([^"']+)["']/);
    return match ? match[1] : null;
  };

  return (
    <main className="min-h-screen bg-[#f6efde] py-6 md:py-10 px-4 md:px-6">
      {/* Container: Mobilde tam genişlik, masaüstünde px-32 yerine daha güvenli max-width ve responsive padding */}
      <div className="max-w-7xl mx-auto lg:px-12 xl:px-24">
        {/* Header Section */}
        <section className="relative py-10 md:py-16 px-4 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-10 left-10 w-48 md:w-72 h-48 md:h-72 bg-blue-400 rounded-full blur-[80px] md:blur-[120px]"></div>
            <div className="absolute bottom-10 right-10 w-48 md:w-72 h-48 md:h-72 bg-amber-200 rounded-full blur-[80px] md:blur-[120px]"></div>
          </div>

          <div className="relative text-start border-b border-slate-600 pb-10">
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-slate-900 mb-6 md:mb-8 leading-[1.1] tracking-tight">
              Curated Thoughts on <span className="text-blue-600">Code</span>,
              <br className="hidden md:block" /> Life, and Everything in
              Between.
            </h1>
          </div>
        </section>

        {/* Grid: mobilde 1, tablette 2, masaüstünde 4 sütun */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {posts.map((post, index) => {
            const isFeatured = index === 0;
            const displayImage =
              post.imageUrl ||
              getFirstImage(post.content) ||
              "/images/placeholder.png";
            const plainText = stripHtml(post.content);

            return (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className={`group flex flex-col bg-transparent overflow-hidden hover:shadow-lg hover:rounded-xl transition-all duration-300
                  ${isFeatured ? "sm:col-span-2 lg:col-span-2 lg:row-span-2" : "w-full"}`}
              >
                {/* Image Container */}
                <div
                  className={`relative w-full overflow-hidden rounded-xl bg-slate-100 ${isFeatured ? "aspect-[16/9]" : "aspect-[3/2]"}`}
                >
                  <Image
                    src={displayImage}
                    alt={post.title}
                    fill
                    sizes="(max-w-640px) 100vw, (max-w-1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                    priority={isFeatured}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
                </div>

                {/* Content Area */}
                <div
                  className={`py-4 md:p-5 flex flex-col ${isFeatured ? "grow" : ""}`}
                >
                  {/* Meta: Date & Category */}
                  <div className="flex items-center gap-2 mb-3 text-[10px] md:text-[12px] font-bold uppercase tracking-wider">
                    <time className="text-slate-400">
                      {new Intl.DateTimeFormat("tr-TR", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      }).format(new Date(post.createdAt))}
                    </time>
                    <div className="flex flex-wrap gap-1 items-center">
                      {post.categories.slice(0, 2).map((cat, i) => (
                        <span
                          key={cat}
                          className={`text-[9px] md:text-[10px] font-black uppercase px-2 py-px rounded-md text-white ${["bg-indigo-400", "bg-rose-400", "bg-emerald-500"][i % 3]}`}
                        >
                          {cat}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Title */}
                  <h2
                    className={`text-slate-900 font-bold leading-tight group-hover:text-blue-600 transition-colors ${isFeatured ? "text-2xl md:text-3xl" : "text-base"}`}
                  >
                    {post.title}
                  </h2>

                  {/* Excerpt (Featured only) */}
                  {isFeatured && (
                    <p className="mt-3 md:mt-4 text-slate-500 text-sm leading-relaxed line-clamp-3 md:line-clamp-6">
                      {plainText}
                    </p>
                  )}

                  {/* Author Info */}
                  <div className="pt-4 border-t border-slate-100 flex items-center gap-2 mt-4 md:mt-auto">
                    <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-slate-200 flex items-center justify-center text-[10px] md:text-[12px] font-bold text-slate-500">
                      {post.author.charAt(0)}
                    </div>
                    <span className="text-[11px] md:text-[12px] font-semibold text-slate-600">
                      {post.author}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
