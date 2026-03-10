"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, CheckCircle2, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error" | null;
    message: string | null;
  }>({
    type: null,
    message: null,
  });

  const t = useTranslations();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus({ type: null, message: null });

    try {
      const res = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setStatus({
          type: "success",
          message:
            "Sıfırlama bağlantısı e-posta adresine gönderildi. Lütfen kutunu kontrol et.",
        });
      } else {
        const data = await res.json();
        setStatus({
          type: "error",
          message: data.error || "Bir hata oluştu. Lütfen tekrar dene.",
        });
      }
    } catch (error) {
      setStatus({ type: "error", message: "Bağlantı hatası oluştu." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-6rem)] bg-[#f5f3ea] flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-[#f92743] transition-colors mb-6"
        >
          <ArrowLeft size={14} />
          {t("backToLogin")}
        </Link>

        <h1 className="text-3xl font-black text-slate-900 mb-2 italic">
          {t("resetPassword")}
          <span className="text-[#f92743]">.</span>
        </h1>
        <p className="text-slate-500 mb-8 text-sm leading-relaxed">
          {t("forgotPasswordText")}
        </p>

        {status.message && (
          <div
            className={`mb-6 p-4 rounded-2xl flex items-start gap-3 animate-in fade-in slide-in-from-top-1 duration-300 ${
              status.type === "success"
                ? "bg-green-50 border border-green-100 text-green-600"
                : "bg-red-50 border border-red-100 text-red-600"
            }`}
          >
            {status.type === "success" ? (
              <CheckCircle2 size={18} className="shrink-0 mt-0.5" />
            ) : (
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
            )}
            <p className="text-xs font-bold leading-relaxed">
              {status.message}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">
              {t("email")}
            </label>
            <input
              required
              type="email"
              disabled={isLoading || status.type === "success"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-4 text-slate-800 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-[#f92743]/20 focus:border-[#f92743] outline-none transition-all"
              placeholder="example@mail.com"
            />
          </div>

          <button
            disabled={isLoading || status.type === "success"}
            className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl hover:bg-slate-800 transition-all shadow-lg active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              t("send")
            )}
          </button>
        </form>
      </div>
    </main>
  );
}
