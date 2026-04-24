"use client";

import hljs from "highlight.js";
import "highlight.js/styles/github.css";
import { useEffect } from "react";

export default function BlogContent({ htmlContent }: { htmlContent: string }) {
  const getCleanHtml = () => {
    if (!htmlContent) return "";
    try {
      return htmlContent
        .replace(/\\"/g, '"') // Kaçış tırnaklarını düzelt
        .replace(/\\n/g, "\n") // \n yazılarını gerçek alt satıra çevir (Regex /g önemli)
        .replace(/^"|"$/g, ""); // Baştaki ve sondaki tırnakları sil
    } catch (error) {
      return htmlContent;
    }
  };

  const cleanHtml = getCleanHtml();

  useEffect(() => {
    // Sayfadaki tüm kod bloklarını tara ve boya
    hljs.highlightAll();
  }, [cleanHtml]);

  return (
    <article className="max-w-5xl mx-auto px-6 mt-4 overflow-visible">
      <div
        className="prose prose-slate lg:prose-xl max-w-none break-words custom-blog-render"
        dangerouslySetInnerHTML={{ __html: cleanHtml }}
      />

      <style jsx global>{`
        /* 1. GENEL RESET */
        .custom-blog-render p {
          margin-top: 0 !important;
          margin-bottom: 0.5rem !important;
          line-height: 1.7;
        }

        /* 2. MOBİL ÖNCELİKLİ GÖRSEL DÜZENİ */
        /* Mobilde her şey tam genişlik ve float yok */
        .custom-blog-render figure,
        .custom-blog-render .image,
        .custom-blog-render img {
          float: none !important;
          max-width: 100% !important;
          width: 100% !important;
          margin: 1rem 0 !important;
          height: auto !important;
          border-radius: 0.75rem;
        }
        /* 6. KOD BLOĞU (CODE BLOCK) DÜZENLEMELERİ - AÇIK TEMA */
        .custom-blog-render pre {
          background-color: #f9fafb !important; /* Çok açık gri (slate-50) */
          color: #1e293b !important; /* Slate-900 yazı */
          padding: 1.25rem !important;
          border-radius: 0.5rem !important;
          margin: 1.5rem 0 !important;
          overflow-x: auto !important;
          font-family: "Fira Code", "Menlo", "Monaco", monospace !important;
          font-size: 0.875rem !important;
          line-height: 1.7 !important;
          border: 1px solid #e2e8f0 !important; /* İnce açık gri çerçeve */
          position: relative;
        }

        /* Boşlukları ve alt satırları koruması için kritik */
        .custom-blog-render pre code {
          background: transparent !important;
          padding: 0 !important;
          color: inherit !important;
          font-family: inherit !important;
          white-space: pre !important;
          display: block !important;
          word-spacing: normal !important;
          word-break: normal !important;
        }

        /* HLJS Renklerini AÇIK TEMA için optimize et */
        .custom-blog-render .hljs-keyword {
          color: #d73a49 !important;
          font-weight: 600;
        } /* Kırmızımsı */
        .custom-blog-render .hljs-string {
          color: #032f62 !important;
        } /* Koyu Mavi */
        .custom-blog-render .hljs-title {
          color: #6f42c1 !important;
        } /* Mor */
        .custom-blog-render .hljs-comment {
          color: #6a737d !important;
          font-style: italic;
        } /* Gri Yorum */
        .custom-blog-render .hljs-number {
          color: #005cc5 !important;
        } /* Mavi Sayı */
        .custom-blog-render .hljs-attr {
          color: #22863a !important;
        } /* Yeşil Özellik */

        /* Dil Etiketini (Sağ Üst) Gizle veya Çok Silik Yap */
        .custom-blog-render pre::before {
          content: attr(data-language);
          position: absolute;
          top: 0;
          right: 1rem;
          font-size: 0.65rem;
          color: #94a3b8;
          text-transform: uppercase;
          background: #f1f5f9;
          padding: 0px 6px;
          border-radius: 0 0 4px 4px;
        }

        /* 7. ALINTI (BLOCKQUOTE) - MEDIUM TARZI */
        .custom-blog-render blockquote {
          border-left: 4px solid #f92743 !important; /* Link renginle uyumlu */
          background-color: #f8fafc !important;
          padding: 1rem 1.5rem !important;
          margin: 1.5rem 0 !important;
          font-style: italic !important;
          color: #475569 !important;
          font-size: 1.1rem !important;
        }

        /* 3. TABLET VE MASAÜSTÜ (Geniş ekranlarda gazete düzeni) */
        @media (min-width: 768px) {
          /* SOLA YASLA */
          .custom-blog-render .image-style-align-left,
          .custom-blog-render figure[style*="float:left"],
          .custom-blog-render figure[style*="float: left"],
          .custom-blog-render img[style*="float:left"] {
            float: left !important;
            margin: 0.2rem 1.5rem 0.5rem 0 !important;
            max-width: 45% !important;
            width: auto !important;
          }

          /* SAĞA YASLA */
          .custom-blog-render .image-style-side,
          .custom-blog-render figure[style*="float:right"],
          .custom-blog-render figure[style*="float: right"],
          .custom-blog-render img[style*="float:right"] {
            float: right !important;
            margin: 0.2rem 0 0.5rem 1.5rem !important;
            max-width: 45% !important;
            width: auto !important;
          }
        }

        /* Temizleyici (Float sonrası metnin bozulmaması için) */
        .custom-blog-render::after {
          content: "";
          display: table;
          clear: both;
        }

        /* 4. LİSTE (BULLET POINTS) DÜZELTMESİ */
        .custom-blog-render ul {
          list-style-type: disc !important;
          margin-left: 1.5rem !important;
          margin-bottom: 1rem !important;
          display: block !important;
        }

        .custom-blog-render ol {
          list-style-type: decimal !important;
          margin-left: 1.5rem !important;
          margin-bottom: 1rem !important;
          display: block !important;
        }

        .custom-blog-render li {
          display: list-item !important;
          margin-bottom: 0.5rem !important;
          padding-left: 0.5rem !important;
          line-height: 1.7;
        }
        .custom-blog-render p:empty {
          height: 0.8rem !important;
          display: block;
        }

        /* 5. BAŞLIK (HEADING) DÜZELTMELERİ */
        .custom-blog-render h1 {
          font-size: 2.25rem !important; /* text-4xl */
          line-height: 2.5rem !important;
          font-weight: 800 !important;
          margin-top: 2rem !important;
          margin-bottom: 1rem !important;
          letter-spacing: -0.025em !important;
          display: block !important;
        }

        .custom-blog-render h2 {
          font-size: 1.875rem !important; /* text-3xl */
          line-height: 2.25rem !important;
          font-weight: 700 !important;
          margin-top: 1.75rem !important;
          margin-bottom: 0.75rem !important;
          display: block !important;
        }

        .custom-blog-render h3 {
          font-size: 1.5rem !important; /* text-2xl */
          line-height: 2rem !important;
          font-weight: 600 !important;
          margin-top: 1.5rem !important;
          margin-bottom: 0.5rem !important;
          display: block !important;
        }

        /* Başlıklardan sonra gelen paragrafların yapışık durmaması için */
        .custom-blog-render h1 + p,
        .custom-blog-render h2 + p,
        .custom-blog-render h3 + p {
          margin-top: 0.5rem !important;
        }

        .custom-blog-render.prose {
          /* Tüm prose elementleri için ana renk tanımı */
          --tw-prose-body: #1e293b;
          --tw-prose-headings: #0f172a;
          --tw-prose-lead: #334155;
          --tw-prose-links: #f92743;
          --tw-prose-bold: #0f172a;
          --tw-prose-counters: #64748b;
          --tw-prose-bullets: #cbd5e1;
          --tw-prose-hr: #e2e8f0;
          --tw-prose-quotes: #0f172a;
          --tw-prose-quote-borders: #e2e8f0;
          --tw-prose-captions: #64748b;
          --tw-prose-code: #0f172a;
          --tw-prose-pre-code: #e2e8f0;
          --tw-prose-pre-bg: #1e293b;
          --tw-prose-th-borders: #cbd5e1;
          --tw-prose-td-borders: #e2e8f0;

          max-width: none;
          color: #1e293b !important;
        }

        .custom-blog-render h1,
        .custom-blog-render h2,
        .custom-blog-render h3,
        .custom-blog-render strong,
        .custom-blog-render b,
        .custom-blog-render blockquote {
          color: #0f172a !important; /* Başlıklar ve kalın yazılar daha koyu */
        }

        .custom-blog-render p,
        .custom-blog-render li,
        .custom-blog-render span {
          color: #1e293b !important; /* Ana metin slate-900 */
        }

        .custom-blog-render {
          /* iPhone Safari metin netleştirme */
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          /* Koyu modda renklerin silikleşmesini engelleme */
          color-scheme: light;
        }
      `}</style>
    </article>
  );
}
