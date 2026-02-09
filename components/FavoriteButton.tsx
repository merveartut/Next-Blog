"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface FavoriteButtonProps {
  slug: string;
  initialCount: number;
  isCompact?: boolean; // Kartlarda küçük, detayda büyük dursun diye
  isInitiallyFavorited?: boolean;
  className?: string;
}

export default function FavoriteButton({
  slug,
  initialCount,
  isCompact,
  isInitiallyFavorited = false,
  className,
}: FavoriteButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isFavorited, setIsFavorited] = useState(isInitiallyFavorited);
  const [count, setCount] = useState(initialCount);
  const [isLiking, setIsLiking] = useState(false);

  const handleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session) {
      router.push("/login");
      return;
    }

    if (isLiking) return; // Çift tıklamayı engellemek için koruma

    const currentStatus = isFavorited;
    const newStatus = !currentStatus;

    // Optimistic Update: Kullanıcıya anında yansıt
    setIsFavorited(newStatus);
    setCount((prev) => (newStatus ? prev + 1 : prev - 1));
    setIsLiking(true);

    try {
      const res = await fetch(`/api/posts/${slug}/favorite`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // Backend'e mevcut durumu gönderiyoruz, backend buna göre connect/disconnect yapacak
        body: JSON.stringify({ isFavorited: currentStatus }),
      });

      if (!res.ok) throw new Error();
    } catch (error) {
      // Hata durumunda daktiloyu eski haline getir
      setIsFavorited(currentStatus);
      setCount((prev) => (currentStatus ? prev + 1 : prev - 1));
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <button
      onClick={handleFavorite}
      className={`transition-all duration-300 cursor-pointer hover:scale-110 ${isCompact ? "p-1" : "flex items-center gap-2"} ${className || ""}`}
    >
      <Star
        size={isCompact ? 20 : 16}
        className={`${
          isFavorited
            ? "fill-yellow-400 text-yellow-400 scale-110"
            : "text-slate-400 hover:text-yellow-400"
        } transition-all duration-300`}
      />
      {!isCompact && <span className="font-normal text-sm">{count}</span>}
    </button>
  );
}
