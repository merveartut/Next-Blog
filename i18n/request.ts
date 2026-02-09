import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";

const locales = ["tr", "en"];

export default getRequestConfig(async ({ locale }) => {
  // 1. Locale değerini garantile. Eğer undefined ise defaultLocale (tr) kullan.
  const resolvedLocale = locale || "tr";

  // 2. Desteklenmeyen bir dil girişi gelirse 404 döndür.
  if (!locales.includes(resolvedLocale as any)) notFound();

  return {
    locale: resolvedLocale,
    // 3. Import ederken 'locale' yerine garanti altına aldığımız 'resolvedLocale' kullan.
    messages: (await import(`../messages/${resolvedLocale}.json`)).default,
  };
});
