import { Node } from "@tiptap/core";
import { normalizeArticleImage } from "@/lib/articleImage";

export const ArticleImageNode = Node.create({
  name: "articleImage",
  group: "block",
  atom: true,
  selectable: true,
  draggable: true,
  addAttributes() {
    return Object.fromEntries(Object.entries(normalizeArticleImage({})).map(([name, value]) => [name, { default: value, rendered: false }]));
  },
  parseHTML() {
    return [{
      tag: "figure[data-article-image]",
      getAttrs(element) {
        const img = element.querySelector("img");
        const attrs = normalizeArticleImage({
          src: img?.getAttribute("src"), alt: img?.getAttribute("alt"),
          width: img?.getAttribute("width"), height: img?.getAttribute("height"),
          caption: element.querySelector("figcaption")?.textContent || "",
          decorative: element.getAttribute("data-decorative"),
          displayWidth: element.getAttribute("data-width"), alignment: element.getAttribute("data-align")
        });
        return attrs.src ? attrs : false;
      }
    }, {
      tag: "img[src]",
      getAttrs(element) {
        const attrs = normalizeArticleImage({src: element.getAttribute("src"), alt: element.getAttribute("alt"), width: element.getAttribute("width"), height: element.getAttribute("height")});
        return attrs.src ? attrs : false;
      }
    }];
  },
  renderHTML({ node }) {
    const attrs = normalizeArticleImage(node.attrs);
    const img = ["img", {
      src: attrs.src, alt: attrs.alt, "data-decorative": String(attrs.decorative), loading: "lazy", decoding: "async",
      ...(attrs.width && attrs.height ? { width: attrs.width, height: attrs.height } : {})
    }];
    const figureAttrs = {"data-article-image": "true", "data-width": attrs.displayWidth, "data-align": attrs.alignment, "data-decorative": String(attrs.decorative)};
    return attrs.caption ? ["figure", figureAttrs, img, ["figcaption", {}, attrs.caption]] : ["figure", figureAttrs, img];
  }
});
