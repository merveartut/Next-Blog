import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import BlogContent from "./BlogContent";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params;

  const post = await prisma.post.findUnique({
    where: { slug: slug },
  });

  if (!post) notFound();

  return (
    <main className="min-h-screen bg-amber-50/30 pb-20">
      {/* Header: Mobilde daha az padding */}
      <header className="pt-10 md:pt-16 pb-8 md:pb-12 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          {/* Top Navigation: Mobilde alt alta, masaüstünde yan yana */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8 md:mb-12">
            <Link
              href="/"
              className="no-underline text-xs md:text-sm font-bold text-blue-600 hover:text-indigo-600 transition-colors flex items-center gap-2"
            >
              <span className="text-lg md:text-xl">←</span> Tüm Yazılar
            </Link>

            {/* Kategoriler: Mobilde daha küçük çipler */}
            <div className="flex flex-wrap gap-2 justify-center">
              {post.categories.map((cat, i) => (
                <span
                  key={cat}
                  className={`px-2 md:px-3 py-1 rounded-md text-[10px] md:text-xs font-bold text-white shadow-sm
                    ${["bg-indigo-400", "bg-emerald-500", "bg-rose-400", "bg-amber-500", "bg-blue-500"][i % 5]}`}
                >
                  {cat}
                </span>
              ))}
            </div>
          </div>

          {/* Görsel ve Başlık Alanı */}
          <div className="flex flex-col gap-6 md:gap-8 items-center text-center">
            {post.imageUrl && (
              /* Resim: Mobilde aspect-ratio kullanarak yüksekliği koruyoruz */
              <div className="relative w-full aspect-video md:h-96 max-w-5xl rounded-2xl md:rounded-3xl overflow-hidden shadow-xl md:shadow-2xl">
                <Image
                  src={post.imageUrl || "/images/placeholder.png"}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}

            {/* Başlık: Mobilde text-3xl, masaüstünde text-6xl */}
            <h1 className="text-3xl md:text-6xl font-black text-slate-900 leading-[1.2] md:leading-[1.1] tracking-tight max-w-4xl px-2">
              {post.title}
            </h1>

            {/* Yazar ve Tarih: Mobilde dikey, SM ekranlarda yatay */}
            <div className="flex flex-col w-full max-w-5xl justify-center sm:flex-row items-center gap-4 border-t border-slate-200 border-b py-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 md:w-8 md:h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold border-2 border-white shadow-sm">
                  {post.author?.charAt(0) || "M"}
                </div>
                <div className="text-start sm:text-center">
                  <p className="text-sm font-bold text-slate-900">
                    {post.author}
                  </p>
                  {/* Mobilde tarih yazarın altına gelsin (Opsiyonel) */}
                  <span className="sm:hidden text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {new Intl.DateTimeFormat("tr-TR").format(
                      new Date(post.createdAt),
                    )}
                  </span>
                </div>
              </div>

              <div className="hidden sm:block w-1.5 h-1.5 bg-slate-200 rounded-full"></div>

              <div className="hidden sm:block text-[11px] font-bold uppercase tracking-widest text-slate-400">
                <time>
                  {new Intl.DateTimeFormat("tr-TR", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  }).format(new Date(post.createdAt))}
                </time>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Yazı İçeriği */}
      <BlogContent htmlContent={post.content} />
    </main>
  );
}
