"use client";

import { generateHTML } from "@tiptap/html";
import StarterKit from "@tiptap/starter-kit";
import { CustomImage } from "@/components/CustomImage";

import { Link } from "@tiptap/extension-link";
import { Underline } from "@tiptap/extension-underline";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { Highlight } from "@tiptap/extension-highlight";
import { TextAlign } from "@tiptap/extension-text-align";
import { Typography } from "@tiptap/extension-typography";

import { TaskList } from "@tiptap/extension-task-list";
import { TaskItem } from "@tiptap/extension-task-item";

import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableHeader } from "@tiptap/extension-table-header";
import { TableCell } from "@tiptap/extension-table-cell";

import { CodeBlockLowlight } from "@tiptap/extension-code-block-lowlight";

import { common, createLowlight } from "lowlight";

const lowlight = createLowlight(common);

export default function BlogContent({ htmlContent }: { htmlContent: string }) {
  const normalizeLegacyHtml = (html: string) =>
    html.replace(/\\"/g, '"').replace(/^"|"$/g, "").replace(/\\n/g, "\n");

  const content: string = (() => {
    if (!htmlContent) return "";

    // old CKEditor html
    if (htmlContent.trim().startsWith("<")) {
      return normalizeLegacyHtml(htmlContent);
    }

    try {
      const json = JSON.parse(htmlContent);

      return generateHTML(json, [
        StarterKit.configure({
          codeBlock: false,
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

        Typography,

        TaskList,
        TaskItem.configure({
          nested: true,
        }),

        CustomImage.configure({
          inline: false,
        }),
        Link,

        Table.configure({
          resizable: true,
        }),

        TableRow,
        TableHeader,
        TableCell,

        CodeBlockLowlight.configure({
          lowlight,
        }),
      ]);
    } catch (e) {
      console.error(e);
      return normalizeLegacyHtml(htmlContent);
    }
  })();

  return (
    <article className="article-shell max-w-5xl">
      <div
        className="newspaper-content"
        dangerouslySetInnerHTML={{
          __html: content,
        }}
      />

      <style jsx global>{`
        /* ===============================
   Layout
================================ */

        .article-shell {
          margin: auto;
          padding: 0.25rem 1.5rem 6rem;
        }

        .newspaper-content {
          font-family: Georgia, serif;
          font-size: 1.25rem;
          line-height: 2;
          color: #0f172a;
        }

        .newspaper-content > *:first-child {
          margin-top: 0 !important;
        }

        .newspaper-content::after {
          content: "";
          display: block;
          clear: both;
        }

        /* ===============================
   Typography
================================ */

        .newspaper-content p {
          margin: 1.35rem 0;
          text-align: justify;
          hyphens: auto;
        }

        .newspaper-content p:first-of-type {
          margin-top: 0;
        }

        .newspaper-content h1 {
          font-size: 3rem;
          line-height: 1.1;
          font-weight: 800;
          margin: 2rem 0 1.25rem;
          letter-spacing: -0.03em;
        }

        .newspaper-content h2 {
          font-size: 2.2rem;
          margin: 1.8rem 0 1rem;
          font-weight: 700;
        }

        .newspaper-content h3 {
          font-size: 1.7rem;
          margin: 1.5rem 0 1rem;
          font-weight: 700;
        }

        /* ===============================
   Images Base
================================ */

        .newspaper-content figure.image {
          display: block;
          margin: 2rem auto;
          max-width: 100%;
        }

        .newspaper-content img,
        .newspaper-content figure.image img {
          display: block;
          max-width: 100%;
          height: auto;
          border-radius: 14px;
        }

        /* ===============================
   DEFAULT BLOCK IMAGES
   (editor inserted standard images)
================================ */

        .newspaper-content
          figure.image:not(.image-style-align-left):not(
            .image-style-align-right
          ):not(.image-style-side) {
          float: none;
          clear: both;
          width: auto;
          margin: 2rem auto;
        }

        /* preserve imageResize centered images */
        .newspaper-content figure.image[style*="margin: 0px auto"] {
          float: none !important;
          clear: both !important;
        }

        /* ===============================
   ONLY EXPLICIT FLOAT IMAGES WRAP
================================ */

        /* LEFT */
        .newspaper-content figure.image.image-style-align-left,
        .newspaper-content img[data-float="left"] {
          float: left;
          clear: none;
          width: min(380px, 42%);
          margin: 0.4rem 2rem 1.5rem 0;
          shape-outside: margin-box;
        }

        /* RIGHT */
        .newspaper-content figure.image.image-style-align-right,
        .newspaper-content .image-style-side,
        .newspaper-content img[data-float="right"] {
          float: right;
          clear: none;
          width: min(380px, 42%);
          margin: 0.4rem 0 1.5rem 2rem !important;
          shape-outside: margin-box;
        }

        /* ===============================
   CENTER / FULL WIDTH
================================ */

        .newspaper-content img[data-float="center"],
        .newspaper-content figure.image.image-style-block {
          float: none;
          clear: both;
          width: min(780px, 100%);
          margin: 2rem auto;
        }

        /* optional custom sizes */
        .newspaper-content img[data-width="38%"] {
          width: min(360px, 38%);
        }

        .newspaper-content img[data-width="70%"] {
          width: 70%;
        }

        .newspaper-content img[data-width="100%"] {
          width: 100%;
        }

        /* ===============================
   Lists
================================ */

        .newspaper-content ul {
          list-style: disc;
          padding-left: 2rem;
          margin: 1.5rem 0;
        }

        .newspaper-content ol {
          list-style: decimal;
          padding-left: 2rem;
          margin: 1.5rem 0;
        }

        .newspaper-content li {
          margin: 0.6rem 0;
        }

        /* ===============================
   Blockquote
================================ */

        .newspaper-content blockquote {
          border-left: 4px solid #f92743;
          margin: 2rem 0;
          padding: 1rem 1.5rem;
          background: #fafafa;
          font-style: italic;
        }

        /* ===============================
   Code Blocks
================================ */

        .newspaper-content pre {
          background: #0f172a;
          color: #e2e8f0;
          padding: 1.5rem;
          border-radius: 16px;
          overflow: auto;
          margin: 2rem 0;
          font-size: 0.95rem;
          line-height: 1.7;
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.03),
            0 8px 30px rgba(0, 0, 0, 0.12);
        }

        .newspaper-content pre code {
          background: none;
          padding: 0;
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

        .hljs-title {
          color: #d2a8ff;
        }

        /* ===============================
   Tables
================================ */

        .newspaper-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 2rem 0;
        }

        .newspaper-content th,
        .newspaper-content td {
          border: 1px solid #ddd;
          padding: 0.8rem;
        }

        /* ===============================
   Mobile
================================ */

        @media (max-width: 768px) {
          .newspaper-content {
            font-size: 1.1rem;
          }

          .newspaper-content h1 {
            font-size: 2.3rem;
          }

          .newspaper-content figure.image.image-style-align-left,
          .newspaper-content figure.image.image-style-align-right,
          .newspaper-content img[data-float="left"],
          .newspaper-content img[data-float="right"] {
            float: none !important;
            width: 100% !important;
            margin: 1.25rem 0 !important;
          }
        }
      `}</style>
    </article>
  );
}
