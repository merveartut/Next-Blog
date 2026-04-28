"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";

import StarterKit from "@tiptap/starter-kit";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";

import { CustomImage } from "./CustomImage";
import ImageResize from "tiptap-extension-resize-image";

import { Link } from "@tiptap/extension-link";

import { Underline } from "@tiptap/extension-underline";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { Highlight } from "@tiptap/extension-highlight";
import { TextAlign } from "@tiptap/extension-text-align";
import { Placeholder } from "@tiptap/extension-placeholder";
import { Typography } from "@tiptap/extension-typography";

import { TaskList } from "@tiptap/extension-task-list";
import { TaskItem } from "@tiptap/extension-task-item";

import { CodeBlockLowlight } from "@tiptap/extension-code-block-lowlight";

import { common, createLowlight } from "lowlight";

import {
  Bold,
  Italic,
  UnderlineIcon,
  Quote,
  ImageIcon,
  Code2,
  LinkIcon,
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Highlighter,
  PaintBucket,
  Copy,
} from "lucide-react";

const lowlight = createLowlight(common);

interface EditorProps {
  data: any;
  onChange: (data: any) => void;
}

export default function TiptapEditor({ data, onChange }: EditorProps) {
  const editor = useEditor({
    immediatelyRender: false,

    extensions: [
      StarterKit.configure({
        codeBlock: false,
        bulletList: {
          keepMarks: true,
          keepAttributes: true,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: true,
        },
      }),

      Underline,
      TextStyle,

      Color,

      Highlight.configure({
        multicolor: true,
      }),

      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),

      Placeholder.configure({
        placeholder: "Write something amazing...",
      }),

      Typography,

      TaskList,

      TaskItem.configure({
        nested: true,
      }),

      ImageResize,

      CustomImage.configure({
        inline: false,
        allowBase64: true,
      }),

      Link.configure({
        openOnClick: false,
      }),

      Table.configure({
        resizable: true,
      }),

      TableRow,
      TableHeader,
      TableCell,

      CodeBlockLowlight.configure({
        lowlight,
      }),
    ],

    content: data,

    onUpdate: ({ editor }) => {
      onChange(editor.getJSON());
    },

    editorProps: {
      attributes: {
        class:
          "tiptap prose prose-slate max-w-none min-h-[600px] p-8 bg-white border border-slate-200 rounded-b-xl focus:outline-none",
      },
    },
  });

  if (!editor) return null;

  const addImage = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      const formData = new FormData();
      formData.append("image", file);

      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const result = await res.json();

        if (!result.success || !result.file?.url) {
          throw new Error("Upload failed");
        }

        editor
          ?.chain()
          .focus()
          .setImage({
            src: result.file.url,
            float: "center",
            width: 70,
          } as any)
          .run();
      } catch (e) {
        console.error(e);
        alert("Görsel yüklenemedi");
      }
    };

    input.click();
  };

  const setLink = () => {
    const prev = editor.getAttributes("link").href;
    const url = window.prompt("URL", prev);

    if (url === null) return;

    if (url === "") {
      editor.chain().focus().unsetLink().run();
      return;
    }

    editor
      .chain()
      .focus()
      .setLink({
        href: url,
      })
      .run();
  };

  const copyCodeBlock = async () => {
    const text = editor.state.doc.textContent;
    await navigator.clipboard.writeText(text);
  };

  return (
    <div className="w-full relative">
      {/* MAIN TOOLBAR */}

      <div className="sticky top-[90px] z-50 flex flex-wrap gap-1 p-3 bg-white border rounded-t-xl shadow-sm">
        {/* headings */}

        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          active={editor.isActive("heading", { level: 2 })}
        >
          <Type size={18} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          active={editor.isActive("heading", { level: 1 })}
        >
          H1
        </ToolbarButton>

        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          active={editor.isActive("heading", { level: 2 })}
        >
          H2
        </ToolbarButton>

        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          active={editor.isActive("heading", { level: 3 })}
        >
          H3
        </ToolbarButton>

        {/* typography */}

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
        >
          <Bold size={18} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
        >
          <Italic size={18} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          active={editor.isActive("underline")}
        >
          <UnderlineIcon size={18} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          active={editor.isActive("highlight")}
        >
          <Highlighter size={18} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().setColor("#ef4444").run()}
        >
          <PaintBucket size={18} />
        </ToolbarButton>

        <div className="w-px h-6 bg-slate-200 mx-2" />

        {/* lists */}

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
        >
          <List size={18} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
        >
          <ListOrdered size={18} />
        </ToolbarButton>

        {/* alignment */}

        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
        >
          <AlignLeft size={18} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
        >
          <AlignCenter size={18} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
        >
          <AlignRight size={18} />
        </ToolbarButton>

        <div className="w-px h-6 bg-slate-200 mx-2" />

        {/* block */}

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive("blockquote")}
        >
          <Quote size={18} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          active={editor.isActive("codeBlock")}
        >
          <Code2 size={18} />
        </ToolbarButton>

        <ToolbarButton onClick={copyCodeBlock}>
          <Copy size={18} />
        </ToolbarButton>

        {/* media */}

        <ToolbarButton onClick={addImage}>
          <ImageIcon size={18} />
        </ToolbarButton>

        <ToolbarButton onClick={setLink}>
          <LinkIcon size={18} />
        </ToolbarButton>
      </div>

      {/* TEXT SELECTION BUBBLE MENU */}

      <BubbleMenu
        editor={editor}
        options={{
          placement: "top",
        }}
        shouldShow={({ editor }) => editor.isActive("paragraph")}
      >
        <div className="flex bg-slate-900 text-white rounded-xl p-1 gap-1">
          <MiniButton onClick={() => editor.chain().focus().toggleBold().run()}>
            <Bold size={14} />
          </MiniButton>

          <MiniButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            <Italic size={14} />
          </MiniButton>

          <MiniButton onClick={setLink}>
            <LinkIcon size={14} />
          </MiniButton>
        </div>
      </BubbleMenu>

      {/* IMAGE BUBBLE MENU */}

      <BubbleMenu
        editor={editor}
        shouldShow={({ editor }) => editor.isActive("image")}
        options={{
          placement: "bottom",
        }}
      >
        <div className="flex gap-1 bg-white shadow-xl border rounded-xl p-2">
          <MiniButton
            onClick={() =>
              editor.commands.updateAttributes("image", {
                float: "left",
                width: "38%",
              })
            }
          >
            <AlignLeft size={14} />
          </MiniButton>

          <MiniButton
            onClick={() =>
              editor.commands.updateAttributes("image", {
                float: "center",
                width: "70%",
              })
            }
          >
            <AlignCenter size={14} />
          </MiniButton>

          <MiniButton
            onClick={() =>
              editor.commands.updateAttributes("image", {
                float: "right",
                width: "38%",
              })
            }
          >
            <AlignRight size={14} />
          </MiniButton>
        </div>
      </BubbleMenu>

      <EditorContent editor={editor} />

      <style jsx global>
        {`
          .tiptap pre {
            background: #0d1117;
            color: #c9d1d9;
            padding: 1rem;
            border-radius: 12px;
            font-family:
              Fira Code,
              monospace;
            position: relative;
          }

          .tiptap pre code {
            background: none;
            padding: 0;
          }

          .tiptap p::after {
            content: "";
            display: block;
          }

          .tiptap p:empty::before,
          .tiptap p br::before {
            content: "";
            display: inline-block;
            height: 1.2em; /* Bir satır boyutu kadar boşluk */
            vertical-align: middle;
          }
          .hljs-keyword {
            color: #ff7b72;
          }

          .hljs-string {
            color: #a5d6ff;
          }

          .hljs-comment {
            color: #8b949e;
          }

          /* Listelerin görsel etrafında düzgün akması için */
          .tiptap ul,
          .tiptap ol {
            padding-left: 0;
            list-style-position: inside; /* Noktaların görsel altında kalmasını önler */
          }

          .tiptap li {
            margin: 0.35rem 0;
          }

          /* Seçili resim efekti */
          .tiptap img.ProseMirror-selectednode {
            outline: 3px solid #3b82f6;
          }

          /* Kod bloklarının kaymasını önle */
          .tiptap pre {
            clear: both; /* Kod blokları her zaman yeni satıra geçmeli */
            background: #0d1117;
            color: #c9d1d9;
            padding: 1rem;
            border-radius: 12px;
            margin: 1.5rem 0;
          }

          .tiptap h1 {
            font-size: 2.4rem;
            font-weight: 800;
            margin-top: 2rem;
            margin-bottom: 1rem;
          }

          .tiptap h2 {
            font-size: 1.8rem;
            font-weight: 700;
            margin-top: 1.5rem;
          }

          .tiptap h3 {
            font-size: 1.35rem;
            font-weight: 700;
          }

          .tiptap img {
            border-radius: 12px;
            margin: 1rem auto;
            display: block;
            max-width: 100%;
          }
          .tiptap img {
            border-radius: 14px;
            max-width: 100%;
          }

          .tiptap img[data-float="left"] {
            float: left;
            width: 38%;
            margin: 0.5rem 1.5rem 0.5rem 0;
            shape-outside: margin-box;
          }

          .tiptap img[data-float="right"] {
            float: right;
            width: 38%;
            margin: 0.5rem 0 0.5rem 1.5rem;
            shape-outside: margin-box;
          }

          .tiptap img[data-float="center"] {
            display: block;
            margin: 2rem auto;
            float: none;
            width: 100%;
          }

          .tiptap p {
            line-height: 1.9;
            text-align: justify;
          }

          .tiptap p::after {
            content: "";
            clear: both;
          }

          .tiptap img.ProseMirror-selectednode {
            outline: 3px solid #3b82f6;
          }

          .tiptap {
            column-gap: 3rem;
          }
        `}
      </style>
    </div>
  );
}

function ToolbarButton({ onClick, children, active }: any) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
p-2 rounded-lg transition
hover:bg-slate-100
${active ? "bg-blue-50 text-blue-600" : "text-slate-600"}
`}
    >
      {children}
    </button>
  );
}

function MiniButton({ children, onClick }: any) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="p-2 rounded hover:bg-slate-100 text-slate-700"
    >
      {children}
    </button>
  );
}
