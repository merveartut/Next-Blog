"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== confirmPassword) {
      setError("Şifreler eşleşmiyor! Lütfen kontrol et.");
      return; // Sunucuya hiç gitme
    }
    setIsLoading(true);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => router.push("/login"), 2000); // Kayıt başarılıysa 2 saniye sonra login sayfasına yönlendir
      } else {
        setError(data.error || "Kayıt başarısız oldu.");
        setIsLoading(false);
      }
    } catch (err) {
      setError("Sunucuya bağlanılamadı. Lütfen internetini kontrol et.");
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-6rem)] bg-amber-50 flex items-center justify-center px-6">
      <div className="w-full max-w-125 bg-white p-10 rounded-3xl shadow-xl border border-slate-100">
        <h1 className="text-3xl font-black text-slate-900 mb-2">
          Join Us<span className="text-blue-600">.</span>
        </h1>
        <p className="text-slate-500 mb-8 text-sm">
          Create your account to start writing.
        </p>

        {/* Hata Mesajı Alanı */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl flex items-start gap-3 animate-in fade-in slide-in-from-top-1 duration-300">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <p className="text-xs font-bold leading-relaxed">{error}</p>
          </div>
        )}

        {/* Başarı Mesajı Alanı */}
        {success && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-2xl flex items-start gap-3 animate-in fade-in slide-in-from-top-1 duration-300">
            <CheckCircle2 size={18} className="shrink-0 mt-0.5" />
            <p className="text-xs font-bold leading-relaxed">
              Kayıt işlemin tamamlandı! Giriş sayfasına yönlendiriliyorsun...
            </p>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            required
            type="text"
            placeholder="Full Name"
            disabled={isLoading || success}
            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-blue-400"
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <input
            required
            type="email"
            placeholder="Email Address"
            disabled={isLoading || success}
            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-blue-400"
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
          <div className="space-y-3">
            <input
              required
              type="password"
              placeholder="Password"
              disabled={isLoading || success}
              className={`w-full px-4 py-3 rounded-xl bg-slate-50 border outline-none focus:ring-2 transition-all font-sans ${
                error && formData.password !== confirmPassword
                  ? "border-red-300 ring-red-100"
                  : "border-slate-200 focus:ring-blue-400"
              }`}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />

            {/* Şifre Tekrar Inputu */}
            <input
              required
              type="password"
              placeholder="Retype Password"
              disabled={isLoading || success}
              className={`w-full px-4 py-3 rounded-xl bg-slate-50 border outline-none focus:ring-2 transition-all font-sans ${
                error && formData.password !== confirmPassword
                  ? "border-red-300 ring-red-100"
                  : "border-slate-200 focus:ring-blue-400"
              }`}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          {/* Şifre Kriteri İpucu */}
          <p className="text-[12px] text-slate-400 font-mono px-2 italic">
            * Min. 8 chars, 1 uppercase, 1 lowercase & 1 number
          </p>
          <button
            disabled={isLoading || success} // 4. Loading varken butonu kilitle
            className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-blue-600 transition-all shadow-lg active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                <span>Typing in Archives...</span>
              </>
            ) : success ? (
              "Welcome Aboard..."
            ) : (
              "Sign Up"
            )}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 font-bold">
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}
