import { getTranslations } from "next-intl/server";
import Link from "next/link";

interface AboutPageProps {
  params: Promise<{ locale: string }>;
}

export default async function AboutPage({ params }: AboutPageProps) {
  // 1. Locale bilgisini alıyoruz
  const { locale } = await params;

  // 2. getTranslations'a ikinci parametre olarak locale'i gönderiyoruz!
  // Bu satır, doğru JSON dosyasını okumasını sağlar.
  const t = await getTranslations({ locale, namespace: "About" });

  return (
    <main className="min-h-[calc(100vh-90px)] bg-[#f5f3ea] py-16 md:py-24 px-6">
      <div className="max-w-2xl mx-auto">
        <article className="text-slate-800">
          <h2 className="text-[16px] font-black uppercase tracking-[0.4em] text-slate-400 mb-12">
            {t("title")}
          </h2>

          <div className="text-lg md:text-xl leading-relaxed space-y-8 font-serif">
            <p>{t("content")}</p>
            <p>{t("p2")}</p>
            <p className="font-bold text-slate-900 pt-4">{t("footer")}</p>
          </div>
        </article>
      </div>
    </main>
  );
}
