// app/blog/actions.ts
"use server"; // Bu satır kritik! Fonksiyonun sunucuda çalışmasını sağlar.

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function savePost(formData: {
  title: string;
  categories: string[];
  content: string;
  imageUrl?: string;
  author: string;
  slug?: string;
}) {
  // Başlıktan otomatik slug üret (Örn: "Merhaba Dünya" -> "merhaba-dunya")
  const generatedSlug =
    formData.slug ||
    formData.title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");

  // Prisma ile Supabase'e kaydet
  await prisma.post.upsert({
    where: { slug: generatedSlug },
    update: {
      title: formData.title,
      categories: formData.categories,
      content: formData.content,
      imageUrl: formData.imageUrl,
    },
    create: {
      title: formData.title,
      slug: generatedSlug,
      categories: formData.categories,
      content: formData.content,
      imageUrl: formData.imageUrl,
      author: formData.author,
    },
  });

  // Blog listesini güncelle (Cache temizle)
  revalidatePath("/");
  revalidatePath(`/blog/${generatedSlug}`);
}

export async function deletePost(id: string) {
  await prisma.post.delete({
    where: { id: id },
  });
  revalidatePath("/profile"); // Profil sayfasını güncelle
  revalidatePath("/"); // Ana sayfayı güncelle
}
