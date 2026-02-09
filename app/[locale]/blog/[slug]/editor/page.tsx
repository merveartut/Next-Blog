"use client";

//app/blog/[slug]/editor/page.tsx
import { useContext, useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { savePost } from "../../actions";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { LoadingContext } from "@/components/LoadingProvider";
import Editor from "@/components/Editor";

export default function BlogEditorPage() {
  const chipColors = [
    "bg-red-100 text-red-700 border-red-200",
    "bg-blue-100 text-blue-700 border-blue-200",
    "bg-emerald-100 text-emerald-700 border-emerald-200",
    "bg-amber-100 text-amber-700 border-amber-200",
    "bg-purple-100 text-purple-700 border-purple-200",
  ];

  const [categories, setCategories] = useState<string[]>([]);
  const [catInput, setCatInput] = useState("");
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const { setIsLoading } = useContext(LoadingContext);

  const t = useTranslations();
  const router = useRouter();
  const params = useParams();
  const slug = params.slug; // This will be "new" or an actual slug like "my-first-post"
  const isNew = slug === "new";

  useEffect(() => {
    const fetchPost = async () => {
      // 1. Sayfa yüklenirken loading'i aç
      setIsLoading(true);

      if (!isNew && slug) {
        try {
          const response = await fetch(`/api/posts/${slug}`);
          if (response.ok) {
            const post = await response.json();
            setFormData({
              title: post.title,
              category: post.categories?.[0] || "Code",
              imageUrl: post.imageUrl || "",
              content: post.content,
              author: post.author,
            });
            setCategories(post.categories || []);
          }
        } catch (error) {
          console.error("Hata:", error);
        } finally {
          setIsInitialLoading(false);
          // 2. VERİ GELDİKTEN SONRA LOADING'İ KAPAT (Kritik nokta burası)
          setIsLoading(false);
        }
      } else {
        setIsInitialLoading(false);
        // 3. YENİ POST İSE DE KAPATMAYI UNUTMA
        setIsLoading(false);
      }
    };
    fetchPost();
  }, [slug, isNew, setIsLoading]);

  const addCategory = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && catInput.trim()) {
      e.preventDefault();

      // 1. Başındaki tüm # işaretlerini temizle (kullanıcı kendi koymuş olabilir)
      let cleanInput = catInput.trim().replace(/^#+/, "");

      // 2. Başına tek bir # ekle
      const formattedCat = `#${cleanInput}`;

      // 3. Eğer listede yoksa ekle
      if (!categories.includes(formattedCat)) {
        setCategories([...categories, formattedCat]);
      }
      setCatInput("");
    }
  };

  const removeCategory = (name: string) => {
    setCategories(categories.filter((c) => c !== name));
  };

  const { data: session } = useSession();

  const [loading, setLoading] = useState(false); // Kayıt durumunu takip et
  const [formData, setFormData] = useState({
    title: "",
    category: "Code",
    imageUrl: "",
    content: "",
    author: "Admin User",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session) return alert("You must be logged in!");

    // 1. Hem yerel butonu hem de tüm ekranı loading moduna al
    setLoading(true);
    setIsLoading(true); // Context'ten gelen global loading

    try {
      await savePost({
        ...formData,
        categories: categories,
        author: session.user?.name || "Anonymous",
        slug: isNew ? undefined : Array.isArray(slug) ? slug[0] : slug,
      });

      // 2. Başarılıysa yönlendir (Sayfa değişince loading kendiliğinden kapanacaktır)
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Kayıt hatası:", error);
      alert("Yazı kaydedilirken bir hata oluştu.");
      // 3. Hata varsa kullanıcıyı ekranda tutacağımız için loading'i geri kapat
      setIsLoading(false);
      setLoading(false);
    }
  };
  if (isInitialLoading) return null;

  // 2. ANA EDİTÖR EKRANI
  return (
    <main className="min-h-[calc(100vh-90px)] bg-amber-50 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Link
            href={isNew ? "/" : `/blog/${slug}`}
            className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors font-bold text-sm"
          >
            <ArrowLeft size={18} /> {t("turnBack")}
          </Link>
          <div className="text-xs font-black uppercase tracking-widest text-slate-400">
            Editor Mode —{" "}
            <span className="text-blue-600">
              {isNew ? "New Story" : "Editing"}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <input
            required
            className="w-full bg-transparent text-5xl font-serif italic text-slate-900 border-b-4 border-slate-900 pb-4 mb-10 outline-none"
            placeholder={t("addTitle")}
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />

          <div className="flex flex-wrap gap-2 mb-8 items-center bg-white/30 p-4 rounded-xl border border-dashed border-slate-300">
            <span className="text-xs font-black uppercase text-slate-400 mr-2">
              {t("categories")}:
            </span>
            {categories.map((cat, i) => (
              <div
                key={cat}
                className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border transition-all ${chipColors[i % chipColors.length]}`}
              >
                {cat}{" "}
                <button
                  type="button"
                  onClick={() => removeCategory(cat)}
                  className="hover:text-black"
                >
                  ×
                </button>
              </div>
            ))}
            <input
              type="text"
              placeholder={t("addNewHashtag")}
              className="bg-transparent text-sm outline-none border-b border-slate-300 focus:border-slate-800 transition-colors py-1"
              value={catInput}
              onChange={(e) => setCatInput(e.target.value)}
              onKeyDown={addCategory}
            />
          </div>

          <Editor
            data={formData.content ? JSON.parse(formData.content) : {}}
            onChange={(val) =>
              setFormData({ ...formData, content: JSON.stringify(val) })
            }
          />
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[calc(100%-3rem)] max-w-4xl bg-slate-900 text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between z-50">
            <span className="text-sm font-medium text-slate-400 px-4 italic">
              Ready to type...
            </span>
            <button
              type="submit"
              disabled={loading} // Loading sırasında butonu kilitliyoruz
              className="flex items-center gap-2 bg-[#f92743] hover:bg-rose-500 px-6 py-2 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>{isNew ? "Publishing..." : "Saving..."}</span>
                </>
              ) : (
                <>
                  <Save size={18} />
                  <span>{isNew ? "Publish Story" : "Save Changes"}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
