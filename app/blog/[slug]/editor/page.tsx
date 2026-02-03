"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";

export default function BlogEditorPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug; // This will be "new" or an actual slug like "my-first-post"
  const isNew = slug === "new";

  const [formData, setFormData] = useState({
    title: "",
    category: "Code",
    imageUrl: "",
    content: "",
    author: "Admin User",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Saving post data:", {
      ...formData,
      slug: isNew ? "generated-slug" : slug,
    });
    alert(isNew ? "Post Created!" : "Post Updated!");
    router.push("/");
  };

  return (
    <main className="min-h-screen bg-amber-50 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Navigation / Header */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href={isNew ? "/" : `/blog/${slug}`}
            className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors font-bold text-sm"
          >
            <ArrowLeft size={18} />
            Back to {isNew ? "Feed" : "Post"}
          </Link>
          <div className="text-xs font-black uppercase tracking-widest text-slate-400">
            Editor Mode —{" "}
            <span className="text-blue-600">
              {isNew ? "New Story" : "Editing"}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Main Title Input */}
          <input
            required
            className="w-full bg-transparent text-5xl md:text-6xl font-black text-slate-900 placeholder:text-slate-200 outline-none border-none leading-tight tracking-tight"
            placeholder="Title of your story..."
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />

          <div className="flex flex-wrap gap-4 items-center border-y border-slate-200 py-6">
            {/* Category Select */}
            <select
              className="bg-indigo-400 text-white px-4 py-2 rounded-lg font-bold text-xs uppercase outline-none cursor-pointer hover:bg-indigo-500 transition-colors"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
            >
              <option>Code</option>
              <option>Life</option>
              <option>Design</option>
            </select>

            {/* Image URL Input */}
            <input
              className="flex-1 bg-white/50 px-4 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-blue-400 transition-all"
              placeholder="Cover Image URL (e.g. https://...)"
              value={formData.imageUrl}
              onChange={(e) =>
                setFormData({ ...formData, imageUrl: e.target.value })
              }
            />
          </div>

          {/* Content Area */}
          <textarea
            required
            rows={15}
            className="w-full bg-transparent text-lg text-slate-700 leading-relaxed placeholder:text-slate-300 outline-none border-none resize-none"
            placeholder="Tell your story..."
            value={formData.content}
            onChange={(e) =>
              setFormData({ ...formData, content: e.target.value })
            }
          />

          {/* Sticky Bottom Bar */}
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[calc(100%-3rem)] max-w-4xl bg-slate-900 text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between">
            <span className="text-sm font-medium text-slate-400 px-4">
              Draft saved locally
            </span>
            <button
              type="submit"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 px-6 py-2 rounded-xl font-bold transition-all"
            >
              <Save size={18} />
              {isNew ? "Publish Story" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
