"use client";

import { useState, useContext } from "react";
import { Trash2, AlertCircle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { LoadingContext } from "./LoadingProvider";
import { useTranslations } from "next-intl";

export default function DeleteButton({ postId }: { postId: string }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const { setIsLoading } = useContext(LoadingContext);
  const router = useRouter();
  const t = useTranslations();

  const handleDelete = async () => {
    // 1. Modalı kapat ve global loading'i aç
    setShowConfirm(false);
    setIsLoading(true);

    try {
      const res = await fetch(`/api/posts/${postId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        // 2. Başarılıysa sayfayı yenile
        router.refresh();
      } else {
        alert("Silme işlemi başarısız oldu.");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Hata:", error);
      alert("Bir hata oluştu.");
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Çöp Kutusu Butonu */}
      <button
        onClick={() => setShowConfirm(true)}
        className="p-1.5 text-slate-400 hover:text-[#f92743] hover:bg-red-50 rounded-full cursor-pointer transition-all"
        title="Sil"
      >
        <Trash2 size={18} />
      </button>

      {/* Özel Onay Modalı (Portal kullanmadan basitçe overlay ile) */}
      {showConfirm && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Overlay - Karartma */}
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setShowConfirm(false)}
          />

          {/* Modal Kartı */}
          <div className="relative bg-white w-full max-w-sm p-6 rounded-[2rem] shadow-2xl border border-slate-200">
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-red-50 text-[#f92743] rounded-full flex items-center justify-center mb-4">
                <AlertCircle size={32} />
              </div>

              <h3 className="text-xl font-black text-slate-900 italic mb-2">
                Emin misiniz?
              </h3>

              <p className="text-slate-500 text-sm font-medium mb-6">
                Bu yazı kalıcı olarak imha edilecek. Bu işlem geri alınamaz.
              </p>

              <div className="flex w-full gap-3">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 px-4 py-3 bg-slate-100 cursor-pointer hover:bg-slate-200 text-slate-600 rounded-2xl font-bold transition-all"
                >
                  Vazgeç
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 px-4 py-3 bg-[#f92743] cursor-pointer hover:bg-red-600 text-white rounded-2xl font-bold transition-all shadow-lg shadow-red-200"
                >
                  Sil gitsin
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
