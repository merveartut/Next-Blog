"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

function ResetPasswordForm() {
  const t = useTranslations("Auth"); // i18n dosyandaki "Auth" bölümünü kullanırız
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage({ type: "error", text: "Şifreler eşleşmiyor." }); // İstersen burayı da t("passwordMismatch") yapabilirsin
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      if (res.ok) {
        setMessage({
          type: "success",
          text: "Başarılı! Girişe yönlendiriliyorsunuz...",
        });
        setTimeout(() => router.push("/login"), 3000);
      } else {
        const data = await res.json();
        setMessage({ type: "error", text: data.error || "Hata oluştu." });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Bağlantı hatası." });
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="p-10 text-center text-red-600 bg-red-50 rounded-xl">
        Geçersiz bağlantı.
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-8 bg-white rounded-[2.5rem] shadow-2xl border border-slate-100">
      <h1 className="text-3xl font-black italic text-slate-900 mb-6">
        New Password<span className="text-[#f92743]">.</span>
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">
            Yeni Şifre
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-[#f92743]"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">
            Onayla
          </label>
          <input
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-[#f92743]"
          />
        </div>

        {message.text && (
          <div
            className={`p-4 rounded-xl text-xs font-bold ${message.type === "success" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}
          >
            {message.text}
          </div>
        )}

        <button
          disabled={loading}
          className="w-full bg-slate-900 text-white p-4 rounded-2xl font-black hover:bg-slate-800 transition-colors"
        >
          {loading ? "..." : "Güncelle"}
        </button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-[#f5f3ea] flex items-center justify-center p-6">
      <Suspense fallback={<div>Yükleniyor...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
