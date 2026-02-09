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
import { useTranslations } from "next-intl";

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
      Image.extend({
        addAttributes() {
          return {
            ...this.parent?.(),
            width: { default: "100%" },
            align: {
              default: "center",
              renderHTML: (attributes) => {
                if (attributes.align === "left") {
                  return {
                    style: `float: left; margin-right: 2rem; margin-bottom: 1rem; width: ${attributes.width}; max-width: 50%;`,
                  };
                }
                if (attributes.align === "right") {
                  return {
                    style: `float: right; margin-left: 2rem; margin-bottom: 1rem; width: ${attributes.width}; max-width: 50%;`,
                  };
                }
                return {
                  style: `display: block; margin: 2rem auto; width: ${attributes.width}; clear: both;`,
                };
              },
            },
          };
        },
      }).configure({
        HTMLAttributes: {
          // Seçildiğinde mavi bir çerçeve ve gölge ekleyen sınıf
          class:
            "rounded-lg transition-all duration-300 cursor-pointer outline-none",
        },
      }),
      TableExtension.Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    immediatelyRender: false,
    content: content,

    onSelectionUpdate: ({ editor }) => {
      isImageSelected();
    },

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

  const t = useTranslations();

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
    if (url) {
      const width = window.prompt(
        "Görsel genişliği? (Örn: 50%, 100%, 300px)",
        "100%",
      );
      editor
        ?.chain()
        .focus()
        .setImage({ src: url, width: width || "100%" } as any)
        .run();
    }
  };

  const resizeImage = (size: string) => {
    if (!editor) return;

    // 'selection'ı editor.state içinden alıyoruz
    const { selection } = editor.state;

    const isImageSelected =
      editor.isActive("image") ||
      (selection &&
        "node" in selection &&
        (selection as any).node.type.name === "image");

    if (isImageSelected) {
      editor.chain().focus().updateAttributes("image", { width: size }).run();
    }
  };

  const alignImage = (alignment: string) => {
    if (editor?.isActive("image")) {
      editor
        .chain()
        .focus()
        .updateAttributes("image", { align: alignment })
        .run();
    }
  };

  const isImageSelected = () => {
    if (!editor) return false;

    // 1. Durum: Tiptap görselin aktif olduğunu söylüyor mu?
    const isActive = editor.isActive("image");

    // 2. Durum: Seçili olan şey bir "image" node'u mu?
    const { selection } = editor.state;
    const isImageNode =
      selection &&
      "node" in selection &&
      (selection as any).node.type.name === "image";

    return isActive || isImageNode;
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
            <Columns size={14} /> + {t("addTable")}
          </button>

          {/* Görsel Ekleme */}
          <button
            type="button"
            onClick={addImage}
            className="flex items-center gap-2 hover:text-blue-600 transition-colors bg-slate-100 px-2 py-1 rounded border border-slate-200"
          >
            <ImageIcon size={14} /> + {t("addImage")}
          </button>

          {/* Eğer bir görsel seçiliyse boyutlandırma seçeneklerini göster */}
          {isImageSelected() && (
            <div className="flex gap-2 ml-2 border-l pl-2 border-slate-300 animate-in fade-in zoom-in-95 duration-200">
              <button
                type="button"
                onClick={() => resizeImage("25%")}
                className="px-2 py-1 bg-white hover:bg-blue-600 hover:text-white border border-slate-200 rounded text-[10px] font-black transition-all"
              >
                S
              </button>
              <button
                type="button"
                onClick={() => resizeImage("50%")}
                className="px-2 py-1 bg-white hover:bg-blue-600 hover:text-white border border-slate-200 rounded text-[10px] font-black transition-all"
              >
                M
              </button>
              <button
                type="button"
                onClick={() => resizeImage("100%")}
                className="px-2 py-1 bg-white hover:bg-blue-600 hover:text-white border border-slate-200 rounded text-[10px] font-black transition-all"
              >
                L
              </button>

              <div className="flex gap-1 ml-2 border-l pl-2 border-slate-300">
                <button
                  type="button"
                  onClick={() => alignImage("left")}
                  className="p-1 hover:bg-blue-100 rounded text-[10px] font-bold"
                >
                  [Sol]
                </button>
                <button
                  type="button"
                  onClick={() => alignImage("center")}
                  className="p-1 hover:bg-blue-100 rounded text-[10px] font-bold"
                >
                  [Orta]
                </button>
                <button
                  type="button"
                  onClick={() => alignImage("right")}
                  className="p-1 hover:bg-blue-100 rounded text-[10px] font-bold"
                >
                  [Sağ]
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Temizleme (Sağa Yaslı) */}
        <button
          type="button"
          onClick={clearAllContent}
          className="ml-auto flex items-center gap-2 text-red-700 hover:text-red-500 transition-colors border border-transparent hover:border-red-200 px-2 py-1 rounded"
        >
          <Trash2 size={14} /> [{t("throwPaper")}]
        </button>
      </div>

      <div className="bg-white p-[1px] shadow-[0_0_40px_rgba(0,0,0,0.08)] border-x border-slate-200">
        <EditorContent editor={editor} />
      </div>

      <style jsx global>{`
        .ProseMirror p {
          white-space: pre-wrap;
          margin-bottom: 1rem;
          line-height: 1.8;
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
        .ProseMirror img {
          border-radius: 0.75rem;
          height: auto;
          display: block;
          margin: 2rem auto; /* Standart orta hizalama */
          max-width: 100%;
          transition: all 0.3s ease;
        }
        .ProseMirror img[style*="float: left"] {
          float: left !important;
          margin: 0.5rem 2rem 1rem 0 !important;
          max-width: 50% !important;
          display: inline-block !important; /* Float'ın çalışması için */
        }

        .ProseMirror img[style*="float: right"] {
          float: right !important;
          margin: 0.5rem 0 1rem 2rem !important;
          max-width: 50% !important;
          display: inline-block !important; /* Float'ın çalışması için */
        }

        /* Seçili görsele çerçeve eklemiştik, float varken de düzgün görünsün */
        .ProseMirror img.ProseMirror-selectednode {
          outline: 3px solid #f92743;
          outline-offset: 4px;
        }
        .ProseMirror img.ProseMirror-selectednode {
          outline: 3px solid #f92743; /* Marka rengin olan kırmızı/pembe tonu */
          outline-offset: 4px;
          box-shadow: 0 0 15px rgba(249, 39, 67, 0.2);
          transform: scale(1.01);
        }

        /* Tablo içindeki görsellerin boyut krizini çözüyoruz */
        .ProseMirror table img {
          display: block !important;
          margin-left: auto !important;
          margin-right: auto !important;
          vertical-align: top;
        }

        /* Editörün içindeki tabloların hücrelerine min-width vererek 
     görsel küçüldüğünde tablonun çökmesini önleyelim */
        .ProseMirror td {
          border: 1px dashed #cbd5e1;
          padding: 1rem;
          min-height: 100px;
          vertical-align: top; /* middle yerine top yaptık */
          text-align: left; /* Baştan başlamasını garanti ettik */
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
        .ProseMirror::after {
          content: "";
          display: table;
          clear: both;
        }
      `}</style>
    </div>
  );
}
