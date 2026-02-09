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
          toolbar: [
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
        /* Editör içindeki görsel hizalamaları için gerekli CSS */
        .ck-content .image-style-align-left {
          float: left !important;
          margin-right: 1.5em;
          max-width: 50%;
        }

        .ck-content .image-style-side {
          float: right !important;
          margin-left: 1.5em;
          max-width: 50%;
        }

        .ck-editor__editable {
          min-height: 500px;
          padding: 2rem !important;
        }
      `}</style>
    </div>
  );
}
