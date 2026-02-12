import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import DeleteButton from "@/components/DeleteButton";
import { PenSquare } from "lucide-react";
import { getTranslations } from "next-intl/server";

interface PageProps {
  params: { locale: string };
}

export default async function ProfilePage({ params }: PageProps) {
  const session = await getServerSession();

  if (!session || !session.user?.email) redirect("/login");

  const dbUser = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { name: true, email: true },
  });

  if (!dbUser) {
    return redirect("/login");
  }
  const { locale } = await params;

  const t = await getTranslations({ locale });
  // Veritabanından sadece bu kullanıcıya ait postları getir
  const userPosts = await prisma.post.findMany({
    where: {
      author: {
        equals: dbUser.name || "",
        mode: "insensitive",
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const getFirstImage = (html: string) => {
    if (!html) return null;

    // 1. Önce ters eğik çizgileri ve tırnakları normalize edelim
    const cleanHtml = html.split('\\"').join('"');

    // 2. Çok daha esnek bir Regex
    const match = cleanHtml.match(/<img[^>]+src=["']([^"']+)["']/i);

    if (!match) return null;

    let src = match[1];

    // 3. Baştaki ve sondaki kaçış kalıntılarını temizle
    return src.replace(/^[\\"]+|[\\"]+$/g, "").trim();
  };

  return (
    <main className="min-h-[calc(100vh-90px)] bg-amber-50 py-8 md:py-12 px-4 md:px-6">
      <div className="max-w-4xl mx-auto">
        {/* HEADER: Mobilde dikey (center), Masaüstünde yatay (start) */}
        <header className="flex flex-col md:flex-row items-center gap-6 mb-12 bg-transparent border border-amber-950/40 p-6 md:p-8 rounded-3xl shadow-sm text-center md:text-left">
          <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-3xl text-white font-black shrink-0">
            {dbUser?.name?.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 truncate">
              {dbUser?.name}
            </h1>
            <p className="text-slate-500 truncate">{session.user?.email}</p>
            <p className="text-xs font-bold text-blue-600 mt-2 uppercase">
              {userPosts.length} {t("posted")}
            </p>
          </div>
        </header>

        <h2 className="text-xl font-bold mb-6 text-slate-800">
          {t("myPosts") || "Yazılarım"}
        </h2>

        <div className="grid gap-4">
          {userPosts.map((post) => {
            const displayImage = post.imageUrl || getFirstImage(post.content);
            return (
              <div
                key={post.id}
                className="relative group flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-white/50 border border-amber-950/20 p-4 rounded-2xl hover:shadow-md transition-all"
              >
                {/* Sol Kısım: Görsel ve Başlık */}
                <Link
                  href={`/blog/${post.slug}`}
                  className="flex-1 flex items-center gap-4 w-full min-w-0"
                >
                  {displayImage && (
                    <div className="relative w-14 h-14 md:w-16 md:h-16 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                      <Image
                        src={displayImage}
                        alt={post.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="overflow-hidden flex-1">
                    <h3 className="font-bold text-slate-900 group-hover:text-blue-600 truncate text-base md:text-lg">
                      {post.title}
                    </h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <time dateTime={post.createdAt.toISOString()}>
                        {new Intl.DateTimeFormat("tr-TR").format(
                          new Date(post.createdAt),
                        )}
                      </time>
                      <span className="text-slate-200">•</span>
                      <span className="truncate">{post.author}</span>
                    </p>
                  </div>
                </Link>

                {/* Sağ Kısım: Aksiyon Butonları */}
                <div className="flex items-center gap-2 w-full sm:w-auto justify-end border-t sm:border-none pt-3 sm:pt-0 mt-1 sm:mt-0">
                  <Link
                    href={`/blog/${post.slug}/editor`}
                    className="flex items-center gap-2 p-2 px-3 sm:px-2 text-slate-500 hover:text-blue-600 rounded-lg transition-all bg-slate-50 sm:bg-transparent"
                    title="Yazıyı Düzenle"
                  >
                    <PenSquare size={18} />
                    <span className="sm:hidden text-xs font-bold">Düzenle</span>
                  </Link>
                  <div className="bg-slate-50 sm:bg-transparent rounded-lg">
                    <DeleteButton postId={post.id} />
                  </div>
                </div>
              </div>
            );
          })}

          {userPosts.length === 0 && (
            <p className="text-slate-400 text-center py-10 italic">
              You haven't written anything yet.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
