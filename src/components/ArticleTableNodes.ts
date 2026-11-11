import { Node } from "@tiptap/core";

// Simple editorial tables: preserve captions, cells and header scope on paste/save.
// No resizing, merged-cell rules or editor dependencies are needed for these tables.
const ArticleTable = Node.create({
  name: "articleTable",
  group: "block",
  content: "articleTableCaption? articleTableRow+",
  isolating: true,
  parseHTML: () => [{ tag: "table" }],
  renderHTML: () => ["table", 0]
});

const ArticleTableCaption = Node.create({
  name: "articleTableCaption",
  content: "inline*",
  parseHTML: () => [{ tag: "caption" }],
  renderHTML: () => ["caption", 0]
});

const ArticleTableRow = Node.create({
  name: "articleTableRow",
  content: "(articleTableHeader | articleTableCell)+",
  parseHTML: () => [{ tag: "tr" }],
  renderHTML: () => ["tr", 0]
});

const ArticleTableHeader = Node.create({
  name: "articleTableHeader",
  content: "block+",
  isolating: true,
  addAttributes() {
    return {
      scope: {
        default: null,
        parseHTML: (element) => {
          const scope = element.getAttribute("scope");
          return scope === "row" || scope === "col" ? scope : null;
        }
      }
    };
  },
  parseHTML: () => [{ tag: "th" }],
  renderHTML: ({ HTMLAttributes }) => ["th", HTMLAttributes, 0]
});

const ArticleTableCell = Node.create({
  name: "articleTableCell",
  content: "block+",
  isolating: true,
  parseHTML: () => [{ tag: "td" }],
  renderHTML: () => ["td", 0]
});

export const articleTableNodes = [
  ArticleTable, ArticleTableCaption, ArticleTableRow, ArticleTableHeader, ArticleTableCell
];
