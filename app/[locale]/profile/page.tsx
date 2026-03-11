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
    <main className="min-h-[calc(100vh-90px)] bg-[#f5f3ea] py-6 md:py-12 px-2 md:px-6">
      <div className="max-w-6xl mx-auto">
        {/* HEADER - Mobilde daha az padding */}
        <header className="flex flex-col md:flex-row items-center gap-4 md:gap-6 mb-8 md:mb-12 bg-white/40 border border-slate-200 p-5 md:p-8 rounded-[2rem] md:rounded-[2.5rem] shadow-sm text-center md:text-left mx-2 md:mx-0">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-slate-900 flex items-center justify-center text-2xl md:text-3xl text-white font-black shrink-0">
            {dbUser?.name?.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl md:text-3xl font-black text-slate-900 truncate italic">
              {dbUser?.name}
              <span className="text-[#f92743]">.</span>
            </h1>
            <p className="text-slate-500 truncate font-mono text-xs md:text-sm">
              {session.user?.email}
            </p>
            <p className="text-[10px] md:text-xs font-bold text-[#f92743] mt-1 md:mt-2 uppercase tracking-widest">
              {userPosts.length} {t("posted")}
            </p>
          </div>
        </header>

        <h2 className="text-lg md:text-xl font-black mb-6 md:mb-8 text-slate-900 uppercase tracking-tighter italic px-2 md:px-0">
          {t("myPosts") || "Yazılarım"}
        </h2>

        {/* POST GRID: Mobilde 2 sütun (grid-cols-2), tablette 2, masaüstünde 3 */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 px-2 md:px-0">
          {userPosts.map((post) => {
            const firstImageInContent = getFirstImage(post.content);
            const displayImage = post.imageUrl || firstImageInContent;

            return (
              <div
                key={post.id}
                className="group relative flex flex-col bg-white/40 rounded-xl md:rounded-2xl border border-slate-200/50 hover:shadow-xl transition-all duration-500 overflow-hidden"
              >
                {/* Image Section - Oranlar korundu */}
                <Link
                  href={`/blog/${post.slug}`}
                  className="relative aspect-video overflow-hidden bg-slate-100"
                >
                  {displayImage ? (
                    <Image
                      src={displayImage}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-50 text-slate-300">
                      <PenSquare
                        className="w-6 h-6 md:w-10 md:h-10"
                        strokeWidth={1}
                      />
                    </div>
                  )}
                </Link>

                {/* Content Section - Mobilde daha küçük boşluklar */}
                <div className="p-2.5 md:p-4 flex flex-col grow">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="block mb-2 md:mb-3"
                  >
                    <h3 className="font-sans font-extrabold text-slate-900 group-hover:text-[#f92743] transition-colors leading-[1.2] tracking-tighter text-sm md:text-lg line-clamp-2 italic">
                      {post.title}
                    </h3>
                  </Link>

                  <div className="flex justify-between items-center mt-auto pt-2 md:pt-4 border-t border-slate-100">
                    <div className="flex flex-col">
                      <time className="text-[9px] md:text-[11px] text-slate-400 font-bold uppercase tracking-tighter">
                        {new Intl.DateTimeFormat(
                          locale === "tr" ? "tr-TR" : "en-US",
                          {
                            day: "2-digit",
                            month: "short",
                          },
                        ).format(new Date(post.createdAt))}
                      </time>
                    </div>

                    {/* Aksiyon Butonları: Mobilde ikonlar biraz daha küçük */}
                    <div className="flex items-center gap-1 md:gap-2">
                      <Link
                        href={`/blog/${post.slug}/editor`}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all"
                        title="Düzenle"
                      >
                        <PenSquare
                          size={14}
                          className="md:w-[18px] md:h-[18px]"
                        />
                      </Link>
                      <div className="hover:bg-red-50 rounded-full">
                        {/* DeleteButton içindeki ikon boyutu CSS ile override edilebilir 
                        veya DeleteButton'a size prop'u eklenebilir */}
                        <DeleteButton postId={post.id} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {userPosts.length === 0 && (
            <div className="col-span-full py-20 text-center font-mono text-slate-400 italic text-sm">
              You haven't written anything yet.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
