"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const t = useTranslations();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.ok) {
      router.push("/");
      router.refresh();
    } else {
      setIsLoading(false);
      setError("Hatalı e-posta veya şifre. Lütfen tekrar dene.");
    }
  };

  return (
    <main className="min-h-[calc(100vh-6rem)] bg-amber-50 flex items-center justify-center px-6">
      <div className="w-full max-w-125 bg-white p-10 rounded-3xl shadow-xl border border-slate-100">
        <h1 className="text-3xl font-black text-slate-900 mb-2">
          {t("welcomeBack")}
          <span className="text-blue-600">!</span>
        </h1>
        <p className="text-slate-500 mb-8 text-sm">
          {t("pleaseEnterYourDetails")}
        </p>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl flex items-start gap-3 animate-in fade-in slide-in-from-top-1 duration-300">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <p className="text-xs font-bold leading-relaxed">{error}</p>
          </div>
        )}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-400 mb-2">
              {t("email")}
            </label>
            <input
              required
              type="email"
              disabled={isLoading}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 text-slate-800 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-400 outline-none transition-all"
              placeholder="admin@example.com"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-slate-400 mb-2">
              {t("password")}
            </label>
            <div className="relative">
              <input
                required
                type={showPassword ? "text" : "password"} // Dinamik tip
                disabled={isLoading}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 text-slate-800 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-400 outline-none transition-all pr-12" // Sağdan boşluk (pr-12)
                placeholder="••••••••"
              />
              <button
                type="button" // Formu submit etmemesi için önemli
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          <button
            disabled={isLoading}
            className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition-all shadow-lg active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                <span>{t("signingIn")}</span>
              </>
            ) : (
              t("login")
            )}
          </button>
        </form>
        {/* Register Yönlendirmesi */}
        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <p className="text-sm text-slate-500">
            {t("dontHaveAccount")}
            <Link
              href="/register"
              className="text-[#f92743] font-bold hover:underline underline-offset-4"
            >
              {t("joinTheClub")}
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
