import { posts } from "@/lib/blog-data";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-amber-50/30 pb-20">
      {/* Yazı Üst Bölümü (Hero) */}
      <header className="pt-16 pb-12 px-6">
        <div className="px-32mx-auto text-center">
          {/* Kategori ve Tarih */}
          <div className="flex items-center justify-center gap-3 mb-6 text-xs font-bold uppercase tracking-[0.2em]">
            <span className="text-white bg-indigo-400 px-3 py-1 rounded-md">
              {post.category}
            </span>
            <time className="text-slate-400">{post.date}</time>
          </div>

          {/* Başlık */}
          <div className="flex gap-2 max-w-6xl">
            {/* Büyük Ana Görsel */}
            <div className="relative w-full h-75 rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src={post.imageUrl || "/images/placeholder.png"}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-8 leading-[1.1] tracking-tight">
              {post.title}
            </h1>
          </div>

          {/* Yazar Bilgisi */}
          <div className="flex items-center justify-center gap-3 mb-12">
            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-sm font-bold text-slate-500 border-2 border-white shadow-sm">
              {post.author.charAt(0)}
            </div>
            <div className="text-left">
              <p className="text-sm font-bold text-slate-900">{post.author}</p>
              <p className="text-xs text-slate-500">
                Software Developer & Creator
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Yazı İçeriği */}
      <article className="max-w-3xl mx-auto px-6 mt-12">
        <div className="prose prose-slate lg:prose-xl max-w-none prose-headings:font-black prose-headings:text-slate-900 prose-p:text-slate-600 prose-p:leading-relaxed">
          {/* Geri Dön Linki */}
          <Link
            href="/"
            className="no-underline text-sm font-bold text-blue-600 hover:text-indigo-600 transition-colors flex items-center gap-2 mb-12"
          >
            <span className="text-xl">←</span> Back to all stories
          </Link>

          {/* İçerik */}
          <div className="whitespace-pre-line">
            {post.content}
            {/* Sayfa yapısını test etmek için ekstra dummy content */}
            {"\n\n"}
            Lokalinde geliştirdiğin bu modern blog yapısı, hem performans hem de
            estetik açıdan Next.js'in gücünü yansıtıyor. Burada paylaştığın her
            düşünce, kurduğun bu sağlam mimari üzerinde yükselecek.
          </div>
        </div>

        {/* Yazı Sonu Kartı */}
        <footer className="mt-20 p-10 bg-white rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row items-center gap-8">
          <div className="w-24 h-24 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center text-3xl">
            👋
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              Thanks for reading!
            </h3>
            <p className="text-slate-600 italic">
              I'm {post.author}, a developer passionate about building digital
              products. If you enjoyed this article, feel free to share it with
              your network.
            </p>
          </div>
        </footer>
      </article>
    </main>
  );
}
