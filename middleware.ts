import createMiddleware from "next-intl/middleware";

export default createMiddleware({
  locales: ["tr", "en"],
  defaultLocale: "en",
  localeDetection: false,
  localePrefix: "always",
});

export const config = {
  // Sadece sayfaları yakala; statik dosyaları, api'yi ve devtools dosyalarını kesinlikle hariç tut
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
