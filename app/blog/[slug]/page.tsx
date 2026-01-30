// src/app/blog/[slug]/page.tsx
import { posts } from "@/lib/blog-data";
import { notFound } from "next/navigation";
import Link from "next/link";

interface PageProps {
  params: Promise<{ slug: string }>; // Modern Next.js'de params bir Promise'dir
}

export default async function BlogDetailPage({ params }: PageProps) {
  // 1. Params'ı bekleyerek (await) içindeki slug'ı alıyoruz
  const { slug } = await params;

  // 2. Veri setimizden ilgili yazıyı buluyoruz
  const post = posts.find((p) => p.slug === slug);

  // 3. Yazı yoksa Next.js'in default 404 sayfasına yönlendiriyoruz
  if (!post) {
    notFound();
  }

  return (
    <article className="max-w-2xl mx-auto py-16 px-4">
      {/* Geri Dön Navigasyonu */}
      <Link
        href="/"
        className="text-sm text-blue-600 hover:text-blue-800 mb-8 inline-block transition"
      >
        ← Tüm Yazılara Dön
      </Link>

      <header className="mb-10 border-b pb-8">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
          {post.title}
        </h1>
        <div className="flex items-center text-slate-500 text-sm">
          <time>{post.date}</time>
          <span className="mx-2">•</span>
          <span>5 dk okuma</span>
        </div>
      </header>

      {/* İçerik Alanı */}
      <div className="prose prose-blue lg:prose-xl max-w-none">
        <p className="text-lg leading-8 text-slate-700 whitespace-pre-line">
          {post.content}
        </p>
      </div>

      {/* Alt Bilgi - Paylaş butonu vb. eklenebilir */}
      <footer className="mt-16 p-6 bg-slate-50 rounded-2xl border border-slate-100">
        <p className="text-slate-600 italic">
          Bu yazı Merve Artut tarafından Next.js öğrenme sürecinde
          hazırlanmıştır.
        </p>
      </footer>
    </article>
  );
}
