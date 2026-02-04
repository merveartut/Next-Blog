"use client";

export default function BlogContent({ htmlContent }: { htmlContent: string }) {
  return (
    <article className="max-w-5xl mx-auto px-6 mt-4 overflow-visible">
      <div
        className="prose prose-slate lg:prose-xl max-w-none 
          /* 1. LİSTELERİ ZORLA GÖRÜNÜR YAP */
          [&_ul]:list-disc [&_ul]:ml-8 [&_ul]:mt-4 [&_ul]:mb-4
          [&_ol]:list-decimal [&_ol]:ml-8 [&_ol]:mt-4 [&_ol]:mb-4
          [&_li]:pl-2 [&_li]:mb-2
          
          /* 2. BOŞ PARAGRAFLARI VE BOŞLUKLARI KORU */
          [&_p]:whitespace-pre-wrap prose-p:min-h-[1.5rem] 
          
          /* 3. GÖRSEL BOŞLUĞU - KESİN ÇÖZÜM */
          /* Her img etiketine zorla margin ekliyoruz */
          [&_img]:!my-8
          /* Eğer görsel bir paragrafın içindeyse o paragrafın da marjını açıyoruz */
          [&_p_img]:!my-8
          
          prose-img:rounded-lg prose-img:max-w-full prose-img:h-auto prose-img:block prose-img:mx-auto
          
          /* Tablo ve Alan Ayarları */
          [&_table]:my-16
          [&_table]:!border-collapse [&_table]:w-full [&_table]:table-fixed
          prose-td:p-0 prose-td:align-top
          
          /* Diğer Ayarlar */
          [&_img]:[image-rendering:auto]
          [&_img]:[content-visibility:auto]
          break-words
          [&_tr]:flex [&_tr]:flex-col md:[&_tr]:table-row
          md:[&_td]:w-1/2 
          md:[&_td:first-child]:pr-6 
          md:[&_td:last-child]:pl-6"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    </article>
  );
}
