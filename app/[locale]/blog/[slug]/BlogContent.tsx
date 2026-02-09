"use client";

export default function BlogContent({ htmlContent }: { htmlContent: string }) {
  const getCleanHtml = () => {
    if (!htmlContent) return "";
    try {
      return htmlContent
        .replace(/\\"/g, '"')
        .replace(/\\n/g, "")
        .replace(/^"|"$/g, "");
    } catch (error) {
      return htmlContent;
    }
  };

  const cleanHtml = getCleanHtml();

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

        .custom-blog-render p:empty {
          height: 0.8rem !important;
          display: block;
        }
      `}</style>
    </article>
  );
}
