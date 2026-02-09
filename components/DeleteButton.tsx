"use client";

import { Trash2 } from "lucide-react";
import { deletePost } from "../app/[locale]/blog/actions";
import { useState } from "react";

export default function DeleteButton({ postId }: { postId: string }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault(); // Link'e gitmesini engelle
    if (confirm("Bu yazıyı kalıcı olarak silmek istediğine emin misin?")) {
      setIsDeleting(true);
      await deletePost(postId);
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="p-2 text-slate-500 cursor-pointer hover:text-red-500 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50"
      title="Yazıyı Sil"
    >
      <Trash2 size={18} />
    </button>
  );
}
