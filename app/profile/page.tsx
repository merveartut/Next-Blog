import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import DeleteButton from "@/components/DeleteButton";
import { PenSquare } from "lucide-react";

export default async function ProfilePage() {
  const session = await getServerSession();

  if (!session) redirect("/login");

  // Veritabanından sadece bu kullanıcıya ait postları getir
  const userPosts = await prisma.post.findMany({
    where: {
      author: {
        equals: session.user?.name || "",
        mode: "insensitive",
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const getFirstImage = (html: string) => {
    // Hem tek hem çift tırnağı destekleyen, daha esnek bir regex
    const match = html.match(/<img[^>]+src=["']([^"']+)["']/);
    return match ? match[1] : null;
  };

  return (
    <main className="min-h-screen bg-amber-50 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <header className="flex items-center gap-6 mb-12 bg-transparent border border-amber-950/40 p-8 rounded-3xl shadow-sm">
          <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-3xl text-white font-black">
            {session.user?.name?.charAt(0)}
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900">
              {session.user?.name}
            </h1>
            <p className="text-slate-500">{session.user?.email}</p>
            <p className="text-xs font-bold text-blue-600 mt-2 uppercase">
              {userPosts.length} Yazı Yayınlandı
            </p>
          </div>
        </header>

        <h2 className="text-xl font-bold mb-6">Yazılarım</h2>
        <div className="grid gap-4">
          {userPosts.map((post) => {
            const displayImage =
              post.imageUrl ||
              getFirstImage(post.content) ||
              "/images/placeholder.png";
            console.log(displayImage);
            return (
              <div
                key={post.id}
                className="relative group flex items-center gap-4 bg-transparent border border-amber-950/40 p-4 rounded-2xl  hover:shadow-md transition-all"
              >
                {/* Link'i sadece içeriğe sarıyoruz, silme butonu dışarıda kalmalı */}
                <Link
                  href={`/blog/${post.slug}`}
                  className="flex-1 flex items-center gap-4"
                >
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                    <Image
                      src={displayImage}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="overflow-hidden">
                    <h3 className="font-bold text-slate-900 group-hover:text-blue-600 truncate">
                      {post.title}
                    </h3>
                    {/* Etiket hatası düzeltildi: p ile başlayıp p ile bitiyor */}
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <time dateTime={post.createdAt.toISOString()}>
                        {new Intl.DateTimeFormat("tr-TR").format(
                          new Date(post.createdAt),
                        )}
                      </time>
                      {/* Küçük bir daktilo ayıracı ekleyelim */}
                      <span className="text-slate-200">•</span>
                      <span>{post.author}</span>
                    </p>
                  </div>
                </Link>
                <Link
                  href={`/blog/${post.slug}/editor`} // Yazının ID'si ile editöre gidiyoruz
                  className="p-2 text-slate-300 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                  title="Yazıyı Düzenle"
                >
                  <PenSquare size={18} />
                </Link>
                {/* SİLME BUTONU */}
                <DeleteButton postId={post.id} />

                <span className="text-slate-500 group-hover:text-blue-600 mr-2">
                  →
                </span>
              </div>
            );
          })}
          {userPosts.length === 0 && (
            <p className="text-slate-400 text-center py-10">
              You haven't written anything yet.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
