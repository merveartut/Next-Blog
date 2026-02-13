"use client";

import React from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

interface EditorProps {
  data: string;
  onChange: (data: string) => void;
}

class MyUploadAdapter {
  loader: any;
  constructor(loader: any) {
    this.loader = loader;
  }
  upload() {
    return this.loader.file.then(
      (file: File) =>
        new Promise((resolve, reject) => {
          const data = new FormData();
          data.append("image", file);
          fetch("/api/upload", { method: "POST", body: data })
            .then((res) => res.json())
            .then((result) => {
              if (result.success && result.file)
                resolve({ default: result.file.url });
              else reject(result.message || "Yükleme başarısız");
            })
            .catch(() => reject("Sunucu hatası."));
        }),
    );
  }
  abort() {}
}

function MyCustomUploadAdapterPlugin(editor: any) {
  editor.plugins.get("FileRepository").createUploadAdapter = (loader: any) => {
    return new MyUploadAdapter(loader);
  };
}

export default function Editor({ data, onChange }: EditorProps) {
  return (
    <div className="bg-white shadow-inner rounded-sm border border-slate-200">
      <CKEditor
        editor={ClassicEditor as any}
        data={data}
        config={{
          extraPlugins: [MyCustomUploadAdapterPlugin],
          toolbar: {
            items: [
              "heading",
              "|",
              "bold",
              "italic",
              "link",
              "bulletedList",
              "numberedList",
              "blockQuote",
              "|",
              "imageUpload",
              "insertTable",
              "undo",
              "redo",
            ],
            shouldNotGroupWhenFull: true,
          },
          image: {
            styles: {
              options: [
                "inline",
                "block",
                "side", // Standart string seçenekler
                {
                  name: "alignLeft",
                  title: "Sola Yasla",
                  icon: "left",
                  className: "image-style-align-left",
                  // HATA BURADAYDI: Hangi elementlere uygulanacağını ekliyoruz
                  modelElements: ["imageBlock", "imageInline"],
                },
              ],
            },
            toolbar: [
              "imageStyle:inline",
              "imageStyle:alignLeft",
              "imageStyle:block",
              "imageStyle:side",
              "|",
              "toggleImageCaption",
              "imageTextAlternative",
            ],
          },
        }}
        onChange={(event, editor) => {
          const content = editor.getData();
          onChange(content);
        }}
      />

      <style jsx global>{`

        /* 1. CKEditor Değişkenlerini Kökten Sabitle */
  :root {
    --ck-color-toolbar-background: #ffffff !important;
    --ck-color-toolbar-border: #e2e8f0 !important;
    --ck-color-text: #0f172a !important;
    --ck-icon-color: #0f172a !important; /* İkon rengini doğrudan değişkene bağla */
  }

  /* 2. Sticky Alanını ve Katmanlaşmayı Düzelt */
  .ck-editor__top {
    position: sticky !important;
    top: 90px !important; /* Navbar yüksekliğin */
    z-index: 100 !important;
    display: block !important;
    /* GPU hızlandırmasını tetikle (İkonların kaybolmasını engeller) */
    transform: translateZ(0);
    -webkit-transform: translateZ(0);
    opacity: 1 !important;
    visibility: visible !important;
  }

  /* 3. Toolbar ve İçindekiler Hep Görünür Olsun */
  .ck.ck-toolbar {
    background-color: #ffffff !important;
    opacity: 1 !important;
    border: none !important;
  }

  /* İkonlar ve Butonlar (Zorla Görünür Kıl) */
  .ck.ck-toolbar .ck-toolbar__items {
    opacity: 1 !important;
    display: flex !important;
    flex-wrap: wrap !important;
  }

  .ck.ck-button {
    opacity: 1 !important;
    visibility: visible !important;
    color: #0f172a !important;
    z-index: 101 !important; /* Butonları toolbar'ın bir tık üstüne çıkar */
  }

  .ck.ck-icon {
    opacity: 1 !important;
    color: #0f172a !important;
    fill: #0f172a !important;
    /* İkonların render edilmesini garanti et */
    backface-visibility: visible !important;
  }

  /* 4. Editör Gövdesi */
  .ck-editor__main {
    overflow: visible !important;
    position: relative !important;
    z-index: 10 !important;
  }

  .ck-editor__editable_inline {
    background-color: #ffffff !important;
    min-height: 500px;
    padding: 2rem !important;
    border: 1px solid #e2e8f0 !important;
    border-top: none !important;
  }
        /* 4. Editör alanı (Sticky çalışması için overflow olmamalı) */
        .ck-editor__main {
          overflow: visible !important;
        }
        /* Editör içindeki görsel hizalamaları için gerekli CSS */
        .ck-content .image-style-align-left {
          color: #0f172a !important;
          line-height: 1.8;s
          float: left !important;
          margin-right: 1.5em;
          max-width: 50%;
        }

        .ck-content h2, 
        .ck-content h3, 
        .ck-content h4, 
        .ck-content strong {
          color: #020617 !important; /* En koyu siyah */
        }

        .ck-content.ck-placeholder::before {
          color: #94a3b8 !important; /* Slate-400 */
        } 

        .ck-content .image-style-side {
          float: right !important;
          margin-left: 1.5em;
          max-width: 50%;
        }

       .ck-editor__editable_inline {
          background-color: white !important;
          min-height: 500px;
          padding: 2rem !important;
          border: 1px solid #e2e8f0 !important;
          border-top: none !important; /* Toolbar ile birleşsin */
        }

        .ck-editor__editable {
          min-height: 500px;
          padding: 2rem !important;
        }
      `}</style>
    </div>
  );
}
