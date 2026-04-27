import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import DeleteButton from "@/components/DeleteButton";
import { PenSquare } from "lucide-react";
import { getTranslations } from "next-intl/server";
import FavoriteButton from "@/components/FavoriteButton";

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

  if (!dbUser) return redirect("/login");

  const { locale } = await params;
  const t = await getTranslations({ locale });

  const userPosts = await prisma.post.findMany({
    where: {
      author: {
        equals: dbUser.name || "",
        mode: "insensitive",
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // YENİ: Tiptap JSON ve HTML destekli metin ayıklama (Server-side)
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
      const doc = JSON.parse(trimmed);
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

  // YENİ: Tiptap JSON ve HTML destekli görsel ayıklama (Server-side)
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
      // src'nin tipini açıkça belirtiyoruz
      let src: string | null = null;

      const find = (node: any) => {
        // Eğer görsel bulunduysa diğer dalları gezmeyi bırak
        if (src) return;

        // Tiptap image veya imageResize tipindeki node'u yakala
        if (
          (node.type === "image" || node.type === "imageResize") &&
          node.attrs?.src
        ) {
          src = node.attrs.src;
          return;
        }

        // Alt içerik varsa (content dizisi) recursive olarak gezmeye devam et
        if (node.content && Array.isArray(node.content)) {
          node.content.forEach(find);
        }
      };

      find(doc);
      return src;
    } catch {
      const match = trimmed.match(/src=["']([^"']+)["']/i);
      return match ? match[1] : null;
    }
  };

  return (
    <main className="min-h-[calc(100vh-90px)] bg-[#f5f3ea] py-6 md:py-12 px-2 md:px-6">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
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
          {t("myPosts")}
        </h2>

        {/* POST GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 px-2 md:px-0">
          {userPosts.map((post) => {
            const firstImageInContent = getFirstImage(post.content);
            let displayImage = post.imageUrl || firstImageInContent;

            if (displayImage) {
              displayImage = displayImage
                .toString()
                .replace(/[\\"]/g, "")
                .trim();
              if (
                !displayImage.startsWith("http") &&
                !displayImage.startsWith("/")
              ) {
                displayImage = `/${displayImage}`;
              }
            }

            const excerpt = getRawText(post.content);

            return (
              <div
                key={post.id}
                className="group flex flex-col bg-white/40 rounded-2xl border border-slate-200/50 hover:shadow-xl transition-all duration-500 overflow-hidden"
              >
                {/* IMAGE SECTION */}
                {displayImage && (
                  <Link
                    href={`/blog/${post.slug}`}
                    className="relative aspect-video overflow-hidden bg-slate-100"
                  >
                    <Image
                      src={displayImage}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </Link>
                )}

                {/* CONTENT SECTION */}
                <div className="p-5 flex flex-col grow justify-between">
                  <div>
                    <Link href={`/blog/${post.slug}`} className="block mb-2">
                      <h3 className="font-sans font-extrabold text-slate-900 group-hover:text-[#f92743] transition-colors leading-[1.1] tracking-tighter text-lg md:text-xl line-clamp-2 italic">
                        {post.title}
                      </h3>
                    </Link>

                    {/* EXCERPT: Görsel yoksa veya Featured (bu gridde hepsi benzer) görünümü için */}
                    {!displayImage && (
                      <p className="text-slate-500 text-[13px] leading-relaxed mb-4 line-clamp-6">
                        {excerpt}
                      </p>
                    )}
                  </div>

                  <div className="flex justify-between items-center pt-4 mt-auto border-t border-slate-100">
                    <div className="flex flex-col">
                      <time className="text-[11px] text-slate-400 font-bold uppercase tracking-tighter">
                        {new Intl.DateTimeFormat(
                          locale === "tr" ? "tr-TR" : "en-US",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          },
                        ).format(new Date(post.createdAt))}
                      </time>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/blog/${post.slug}/editor`}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all"
                      >
                        <PenSquare size={18} />
                      </Link>
                      <DeleteButton postId={post.id} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {userPosts.length === 0 && (
            <div className="col-span-full py-20 text-center font-mono text-slate-400 italic text-sm">
              {t("noMatches")}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
