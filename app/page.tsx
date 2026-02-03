import Link from "next/link";
import { posts } from "@/lib/blog-data";
import Image from "next/image";

export default function BlogListPage() {
  return (
    <main className="min-h-screen bg-amber-50 py-10 px-6">
      <div className="px-32 mx-auto">
        <section className="relative py-16 px-6 overflow-hidden ">
          {/* Arka planda hafif bir dekoratif efekt */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-10 left-10 w-72 h-72 bg-blue-400 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-10 right-10 w-72 h-72 bg-amber-200 rounded-full blur-[120px]"></div>
          </div>

          <div className="relative mx-auto text-start">
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-8 leading-[1.1] tracking-tight">
              Curated Thoughts on <span className="text-blue-600">Code</span>,
              Life, and Everything in Between.
            </h1>
          </div>
        </section>

        {/* Grid Yapısı - items-start kaldırıldı, row-span kullanımı için default stretch daha iyi */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {posts.map((post, index) => {
            const isFeatured = index === 0;

            return (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className={`group flex flex-col bg-transparent overflow-hidden  hover:shadow-lg hover:rounded-2xl transition-all duration-300 border border-none
                  ${isFeatured ? "lg:col-span-2 lg:row-span-2" : "w-full"}`}
              >
                {/* Görsel Alanı */}
                <div
                  className={`relative w-full bg-slate-100 overflow-hidden ${isFeatured ? "h-96" : "h-60"}`}
                >
                  <Image
                    src={post.imageUrl || "/images/placeholder.png"}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500 rounded-2xl"
                    priority={isFeatured}
                  />
                </div>

                {/* İçerik Alanı */}
                <div
                  className={`p-5 flex flex-col ${isFeatured ? "grow" : ""}`}
                >
                  {/* 1. Tarih ve Kategori */}
                  <div className="flex items-center gap-2 mb-3 text-[10px] font-bold uppercase tracking-wider">
                    <time className="text-slate-400">{post.date}</time>
                    <span className="text-white bg-indigo-400 px-2 py-0.5 rounded-md">
                      {post.category}
                    </span>
                  </div>

                  {/* 2. Başlık */}
                  <h2
                    className={`text-slate-900 font-bold leading-tight group-hover:text-blue-600 transition-colors 
                    ${isFeatured ? "text-3xl" : "text-base"}`}
                  >
                    {post.title}
                  </h2>

                  {/* Featured için daha uzun içerik gösterimi */}
                  {isFeatured && (
                    <p className="mt-4 text-slate-500 text-sm line-clamp-8 leading-relaxed">
                      {post.content}
                      {/* Daha uzun bir text ekleyerek dikey doluluğu test edebilirsin */}
                      {
                        " Daha fazla detay ve derinlemesine inceleme için yazının devamına göz atabilirsiniz. Next.js dünyasındaki yenilikleri kaçırmamak adına bu rehber size yol gösterecektir."
                      }
                    </p>
                  )}

                  {/* 3. Author - Featured ise en alta itiyoruz */}
                  <div
                    className={`pt-4 border-t border-slate-50 flex items-center gap-2 mt-auto`}
                  >
                    <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-500">
                      {post.author.charAt(0)}
                    </div>
                    <span className="text-[11px] font-semibold text-slate-600">
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
