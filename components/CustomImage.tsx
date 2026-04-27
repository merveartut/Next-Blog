import { Image } from "@tiptap/extension-image";

export const CustomImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),

      float: {
        default: "center",
        parseHTML: (el) => el.getAttribute("data-float"),
        renderHTML: (attrs) => ({
          "data-float": attrs.float,
        }),
      },

      width: {
        default: "100%",
        parseHTML: (el) => el.getAttribute("data-width"),
        renderHTML: (attrs) => ({
          "data-width": attrs.width,
        }),
      },
    };
  },
});
