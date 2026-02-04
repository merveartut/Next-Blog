"use client";

import * as TableExtension from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { Bold, Italic, List, ImageIcon, Columns, Trash2 } from "lucide-react";
import { useEffect, useRef } from "react";

export default function TiptapEditor({
  content,
  onChange,
}: {
  content: string;
  onChange: (val: string) => void;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        HTMLAttributes: {
          class: "max-w-full w-full h-auto mx-auto rounded-lg",
        },
      }),
      TableExtension.Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    immediatelyRender: false,
    content: content,

    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-slate max-w-none focus:outline-none min-h-[600px] p-20 bg-white shadow-inner font-mono leading-relaxed text-slate-800",
      },
    },
  });

  const addGridLayout = () => {
    if (editor) {
      editor
        .chain()
        .focus()
        .insertTable({ rows: 1, cols: 2, withHeaderRow: false })
        .run();
    }
  };

  const addImage = () => {
    const url = window.prompt("Görsel URL'sini girin:");
    if (url) editor?.chain().focus().setImage({ src: url }).run();
  };

  const clearAllContent = () => {
    if (
      editor &&
      window.confirm("Tüm kağıdı yırtıp atmak istediğine emin misin?")
    ) {
      editor.commands.clearContent(true);
    }
  };

  useEffect(() => {
    if (editor && content && editor.getHTML() !== content) {
      // Sadece içerik gerçekten farklıysa ve editor hazırsa güncelle
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) return null;

  return (
    <div className="w-full bg-[#f4f1ea] p-10 rounded-sm border-t-[20px] border-slate-800 shadow-2xl relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-slate-400 to-transparent opacity-20" />

      {/* Toolbar - Daktilo Tuşları Konsepti */}
      <div className="flex flex-wrap gap-6 mb-8 pb-4 border-b-2 border-slate-300 font-mono italic text-[11px] uppercase tracking-wider items-center">
        <div className="flex gap-4 items-center">
          <button
            type="button"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            className={`hover:text-blue-600 transition-colors ${editor.isActive("heading", { level: 1 }) ? "font-black underline" : ""}`}
          >
            [H1]
          </button>
          <button
            type="button"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            className={`hover:text-blue-600 transition-colors ${editor.isActive("heading", { level: 2 }) ? "font-black underline" : ""}`}
          >
            [H2]
          </button>

          <div className="w-px h-4 bg-slate-300 mx-2" />
          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleBold().run()}
            className={`hover:text-blue-600 transition-colors ${editor.isActive("bold") ? "font-black underline" : ""}`}
          >
            [Bold]
          </button>
          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleItalic().run()}
            className={`hover:text-blue-600 transition-colors ${editor.isActive("italic") ? "font-black underline" : ""}`}
          >
            [Italic]
          </button>
          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
            className={`hover:text-blue-600 transition-colors flex items-center gap-1 ${editor.isActive("bulletList") ? "font-black underline" : ""}`}
          >
            <List size={14} /> [List]
          </button>
        </div>

        <div className="w-px h-4 bg-slate-300" />

        <div className="flex gap-4 items-center">
          {/* Yan Yana Alan Ekleme */}
          <button
            type="button"
            onClick={addGridLayout}
            className="flex items-center gap-2 hover:text-orange-600 transition-colors bg-slate-100 px-2 py-1 rounded border border-slate-200"
          >
            <Columns size={14} /> + Alan Ekle
          </button>

          {/* Görsel Ekleme */}
          <button
            type="button"
            onClick={addImage}
            className="flex items-center gap-2 hover:text-blue-600 transition-colors bg-slate-100 px-2 py-1 rounded border border-slate-200"
          >
            <ImageIcon size={14} /> + Görsel
          </button>
        </div>

        {/* Temizleme (Sağa Yaslı) */}
        <button
          type="button"
          onClick={clearAllContent}
          className="ml-auto flex items-center gap-2 text-red-700 hover:text-red-500 transition-colors border border-transparent hover:border-red-200 px-2 py-1 rounded"
        >
          <Trash2 size={14} /> [Kağıdı Yırt]
        </button>
      </div>

      <div className="bg-white p-[1px] shadow-[0_0_40px_rgba(0,0,0,0.08)] border-x border-slate-200">
        <EditorContent editor={editor} />
      </div>

      <style jsx global>{`
        .ProseMirror {
          background-image: radial-gradient(#e5e7eb 1.5px, transparent 1.5px);
          background-size: 30px 30px;
          outline: none !important;
        }
        .ProseMirror ul {
          list-style-type: disc;
          padding-left: 1.5rem;
          margin: 1rem 0;
        }
        .ProseMirror li {
          margin-bottom: 0.5rem;
        }
        .ProseMirror table {
          border-collapse: collapse;
          table-layout: fixed;
          width: 100%;
          margin: 2rem 0;
          border: 1px dashed #cbd5e1;
        }
        .ProseMirror td {
          border: 1px dashed #cbd5e1;
          padding: 1rem;
          min-height: 100px;
        }
        .ProseMirror h1 {
          font-size: 2rem;
          font-weight: 800;
          margin-bottom: 1rem;
          color: #0f172a;
        }
        .ProseMirror h2 {
          font-size: 1.5rem;
          font-weight: 700;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
          color: #1e293b;
        }
      `}</style>
    </div>
  );
}
