"use client";

import { useEffect, useState } from "react";
import { Extension } from "@tiptap/core";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import { Plugin, TextSelection } from "@tiptap/pm/state";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  Eraser,
  Highlighter,
  IndentDecrease,
  IndentIncrease,
  Italic,
  Link2,
  List,
  ListOrdered,
  Minus,
  Quote,
  Redo2,
  Strikethrough,
  Underline as UnderlineIcon,
  Undo2,
  Unlink
} from "lucide-react";

const highlightOptions = [
  { label: "Light blue", color: "#dbeafe" },
  { label: "Light gray", color: "#e5e7eb" },
  { label: "Light yellow", color: "#fef3c7" }
];

const PlainTextPaste = Extension.create({
  name: "velomacPlainTextPaste",
  addProseMirrorPlugins() {
    const editor = this.editor;

    return [
      new Plugin({
        props: {
          handlePaste(_view, event) {
            const clipboard = event.clipboardData;

            if (!clipboard || clipboard.getData("text/html")) {
              return false;
            }

            const text = clipboard.getData("text/plain");

            if (!text.includes("\n")) {
              return false;
            }

            editor.commands.insertContent(plainTextToRichHtml(text));
            return true;
          }
        }
      })
    ];
  }
});

export function ResourceArticleRichTextEditor({
  value,
  onChange
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const [linkPanelOpen, setLinkPanelOpen] = useState(false);
  const [linkHref, setLinkHref] = useState("");
  const [linkNewTab, setLinkNewTab] = useState(true);
  const [linkError, setLinkError] = useState("");
  const [counts, setCounts] = useState({ words: 0, characters: 0 });
  const [, setSelectionVersion] = useState(0);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3]
        }
      }),
      Underline,
      Highlight.configure({
        multicolor: true
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
        HTMLAttributes: {
          target: null,
          rel: null
        }
      }),
      PlainTextPaste
    ],
    content: value || "<p></p>",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "resource-rich-text-editor__content",
        "aria-label": "Article body"
      },
      handleClick(view, position, event) {
        const target = event.target;

        if (!(target instanceof HTMLElement) || !target.closest("a")) {
          return false;
        }

        view.dispatch(
          view.state.tr.setSelection(
            TextSelection.create(view.state.doc, position)
          )
        );
        return false;
      },
      transformPastedHTML: cleanPastedHtml
    },
    onCreate({ editor: currentEditor }) {
      setCounts(countEditorText(currentEditor.getText()));
    },
    onUpdate({ editor: currentEditor }) {
      onChange(currentEditor.getHTML());
      setCounts(countEditorText(currentEditor.getText()));
    },
    onSelectionUpdate() {
      setSelectionVersion((current) => current + 1);
    }
  });

  useEffect(() => {
    if (!editor || editor.getHTML() === value) {
      return;
    }

    editor.commands.setContent(value || "<p></p>", false);
    setCounts(countEditorText(editor.getText()));
  }, [editor, value]);

  const currentLink = editor?.getAttributes("link") as
    | { href?: string; target?: string }
    | undefined;
  const canIndent = Boolean(editor?.can().sinkListItem("listItem"));
  const canOutdent = Boolean(editor?.can().liftListItem("listItem"));

  const toolbarState = {
    paragraph: editor?.isActive("paragraph"),
    heading2: editor?.isActive("heading", { level: 2 }),
    heading3: editor?.isActive("heading", { level: 3 }),
    bold: editor?.isActive("bold"),
    italic: editor?.isActive("italic"),
    underline: editor?.isActive("underline"),
    strike: editor?.isActive("strike"),
    bulletList: editor?.isActive("bulletList"),
    orderedList: editor?.isActive("orderedList"),
    blockquote: editor?.isActive("blockquote"),
    link: editor?.isActive("link")
  };

  function openLinkPanel() {
    const attributes = editor?.getAttributes("link") as
      | { href?: string; target?: string }
      | undefined;
    const href = attributes?.href || "";

    setLinkHref(href);
    setLinkNewTab(attributes?.target === "_blank" || isExternalHref(href));
    setLinkError("");
    setLinkPanelOpen(true);
  }

  function applyLink() {
    if (!editor) {
      return;
    }

    const href = normalizeLinkHref(linkHref);

    if (!href) {
      setLinkError("Enter a safe web, email, phone, page or anchor link.");
      return;
    }

    const attributes = {
      href,
      target: linkNewTab ? "_blank" : null,
      rel: linkNewTab ? "noopener noreferrer" : null
    };
    const { from, to } = editor.state.selection;

    if (from === to && !editor.isActive("link")) {
      editor
        .chain()
        .focus()
        .insertContent(
          `<a href="${escapeHtmlAttribute(href)}"${
            linkNewTab ? ' target="_blank" rel="noopener noreferrer"' : ""
          }>${escapeHtml(href)}</a>`
        )
        .run();
    } else {
      editor.chain().focus().extendMarkRange("link").setLink(attributes).run();
    }

    setLinkPanelOpen(false);
    setLinkError("");
  }

  function removeLink() {
    editor?.chain().focus().extendMarkRange("link").unsetLink().run();
    setLinkPanelOpen(false);
    setLinkHref("");
    setLinkError("");
  }

  if (!editor) {
    return (
      <div className="flex min-h-[560px] items-center justify-center border border-metal-200 bg-metal-50 text-sm text-slate-500">
        Loading article editor...
      </div>
    );
  }

  return (
    <div className="resource-rich-text-editor">
      <div className="resource-rich-text-editor__toolbar" role="toolbar" aria-label="Article formatting">
        <div className="flex items-center gap-1">
          <ToolbarTextButton
            label="Paragraph"
            active={Boolean(toolbarState.paragraph)}
            onClick={() => editor.chain().focus().setParagraph().run()}
          >
            P
          </ToolbarTextButton>
          <ToolbarTextButton
            label="Heading 2"
            active={Boolean(toolbarState.heading2)}
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          >
            H2
          </ToolbarTextButton>
          <ToolbarTextButton
            label="Heading 3"
            active={Boolean(toolbarState.heading3)}
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          >
            H3
          </ToolbarTextButton>
        </div>

        <ToolbarDivider />

        <div className="flex items-center gap-1">
          <ToolbarIconButton
            label="Bold (Cmd/Ctrl+B)"
            active={Boolean(toolbarState.bold)}
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            <Bold aria-hidden="true" size={17} />
          </ToolbarIconButton>
          <ToolbarIconButton
            label="Italic (Cmd/Ctrl+I)"
            active={Boolean(toolbarState.italic)}
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            <Italic aria-hidden="true" size={17} />
          </ToolbarIconButton>
          <ToolbarIconButton
            label="Underline (Cmd/Ctrl+U)"
            active={Boolean(toolbarState.underline)}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
          >
            <UnderlineIcon aria-hidden="true" size={17} />
          </ToolbarIconButton>
          <ToolbarIconButton
            label="Strikethrough"
            active={Boolean(toolbarState.strike)}
            onClick={() => editor.chain().focus().toggleStrike().run()}
          >
            <Strikethrough aria-hidden="true" size={17} />
          </ToolbarIconButton>
        </div>

        <div className="relative flex items-center gap-1">
          <span className="sr-only">Text highlight</span>
          <Highlighter aria-hidden="true" className="mx-1 text-slate-500" size={17} />
          {highlightOptions.map((option) => (
            <button
              aria-label={`Apply ${option.label} highlight`}
              className={`h-7 w-7 border transition ${
                editor.isActive("highlight", { color: option.color })
                  ? "border-navy-950 ring-1 ring-navy-950"
                  : "border-metal-300 hover:border-industrial-600"
              }`}
              key={option.color}
              onClick={() => editor.chain().focus().toggleHighlight({ color: option.color }).run()}
              style={{ backgroundColor: option.color }}
              title={option.label}
              type="button"
            />
          ))}
          <ToolbarTextButton
            label="Remove highlight"
            onClick={() => editor.chain().focus().unsetHighlight().run()}
          >
            None
          </ToolbarTextButton>
        </div>

        <ToolbarDivider />

        <div className="flex items-center gap-1">
          <ToolbarIconButton
            label="Bullet list"
            active={Boolean(toolbarState.bulletList)}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            <List aria-hidden="true" size={18} />
          </ToolbarIconButton>
          <ToolbarIconButton
            label="Numbered list"
            active={Boolean(toolbarState.orderedList)}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          >
            <ListOrdered aria-hidden="true" size={18} />
          </ToolbarIconButton>
          <ToolbarIconButton
            label="Increase list indentation"
            disabled={!canIndent}
            onClick={() => editor.chain().focus().sinkListItem("listItem").run()}
          >
            <IndentIncrease aria-hidden="true" size={18} />
          </ToolbarIconButton>
          <ToolbarIconButton
            label="Decrease list indentation"
            disabled={!canOutdent}
            onClick={() => editor.chain().focus().liftListItem("listItem").run()}
          >
            <IndentDecrease aria-hidden="true" size={18} />
          </ToolbarIconButton>
          <ToolbarIconButton
            label="Blockquote"
            active={Boolean(toolbarState.blockquote)}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
          >
            <Quote aria-hidden="true" size={18} />
          </ToolbarIconButton>
          <ToolbarIconButton
            label="Horizontal divider"
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
          >
            <Minus aria-hidden="true" size={18} />
          </ToolbarIconButton>
        </div>

        <ToolbarDivider />

        <div className="flex items-center gap-1">
          <ToolbarIconButton
            label="Add or edit link"
            active={Boolean(toolbarState.link)}
            onClick={openLinkPanel}
          >
            <Link2 aria-hidden="true" size={18} />
          </ToolbarIconButton>
          <ToolbarIconButton
            label="Remove link"
            onClick={removeLink}
          >
            <Unlink aria-hidden="true" size={18} />
          </ToolbarIconButton>
          <ToolbarIconButton
            label="Clear formatting"
            onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
          >
            <Eraser aria-hidden="true" size={18} />
          </ToolbarIconButton>
          <ToolbarIconButton
            label="Undo (Cmd/Ctrl+Z)"
            disabled={!editor.can().chain().focus().undo().run()}
            onClick={() => editor.chain().focus().undo().run()}
          >
            <Undo2 aria-hidden="true" size={18} />
          </ToolbarIconButton>
          <ToolbarIconButton
            label="Redo (Cmd/Ctrl+Shift+Z)"
            disabled={!editor.can().chain().focus().redo().run()}
            onClick={() => editor.chain().focus().redo().run()}
          >
            <Redo2 aria-hidden="true" size={18} />
          </ToolbarIconButton>
        </div>
      </div>

      {linkPanelOpen ? (
        <div className="border-b border-metal-200 bg-blue-50 px-4 py-4">
          <div className="grid gap-3 md:grid-cols-[1fr_auto_auto] md:items-end">
            <label className="grid gap-1.5 text-xs font-semibold text-navy-950">
              <span>Link URL</span>
              <input
                autoFocus
                className="min-w-0 rounded-[4px] border border-metal-300 bg-white px-3 py-2.5 text-sm font-normal"
                onChange={(event) => {
                  const href = event.target.value;
                  setLinkHref(href);
                  setLinkNewTab((current) => current || isExternalHref(href));
                  setLinkError("");
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    applyLink();
                  }
                }}
                placeholder="https://example.com or /products"
                value={linkHref}
              />
            </label>
            <label className="flex min-h-10 items-center gap-2 text-sm font-medium text-slate-700">
              <input
                checked={linkNewTab}
                onChange={(event) => setLinkNewTab(event.target.checked)}
                type="checkbox"
              />
              Open in new tab
            </label>
            <div className="flex gap-2">
              <button
                className="bg-industrial-700 px-4 py-2.5 text-sm font-semibold text-white"
                onClick={applyLink}
                type="button"
              >
                {currentLink?.href ? "Update Link" : "Add Link"}
              </button>
              <button
                className="border border-metal-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700"
                onClick={() => setLinkPanelOpen(false)}
                type="button"
              >
                Cancel
              </button>
            </div>
          </div>
          {linkError ? <p className="mt-2 text-sm text-red-700">{linkError}</p> : null}
        </div>
      ) : null}

      <div className="resource-rich-text-editor__scroll">
        <EditorContent editor={editor} />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-metal-200 bg-metal-50 px-4 py-2.5 text-xs text-slate-500">
        <span>Paste a complete article here. Imported fonts, colors and spacing are cleaned automatically.</span>
        <span aria-live="polite">
          {counts.words.toLocaleString()} words · {counts.characters.toLocaleString()} characters
        </span>
      </div>
    </div>
  );
}

function ToolbarIconButton({
  label,
  active = false,
  disabled = false,
  children,
  onClick
}: {
  label: string;
  active?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      aria-label={label}
      aria-pressed={active}
      className={`flex h-9 w-9 items-center justify-center border transition ${
        active
          ? "border-industrial-600 bg-blue-100 text-industrial-800"
          : "border-transparent text-slate-700 hover:border-metal-300 hover:bg-white"
      } disabled:cursor-not-allowed disabled:opacity-35`}
      disabled={disabled}
      onClick={onClick}
      title={label}
      type="button"
    >
      {children}
    </button>
  );
}

function ToolbarTextButton({
  label,
  active = false,
  children,
  onClick
}: {
  label: string;
  active?: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      aria-label={label}
      aria-pressed={active}
      className={`flex h-9 min-w-9 items-center justify-center border px-2 text-xs font-semibold transition ${
        active
          ? "border-industrial-600 bg-blue-100 text-industrial-800"
          : "border-transparent text-slate-700 hover:border-metal-300 hover:bg-white"
      }`}
      onClick={onClick}
      title={label}
      type="button"
    >
      {children}
    </button>
  );
}

function ToolbarDivider() {
  return <span aria-hidden="true" className="mx-1 h-7 w-px bg-metal-300" />;
}

function countEditorText(value: string) {
  const normalized = value.trim();

  return {
    words: normalized ? normalized.split(/\s+/).length : 0,
    characters: value.length
  };
}

function cleanPastedHtml(html: string) {
  const document = new DOMParser().parseFromString(html, "text/html");

  document
    .querySelectorAll("script, style, iframe, object, embed, link, meta, svg")
    .forEach((element) => element.remove());

  convertWordListParagraphs(document.body);

  document.querySelectorAll("h1").forEach((heading) => {
    const replacement = document.createElement("h2");
    replacement.innerHTML = heading.innerHTML;
    heading.replaceWith(replacement);
  });

  document.querySelectorAll("h4, h5, h6").forEach((heading) => {
    const replacement = document.createElement("h3");
    replacement.innerHTML = heading.innerHTML;
    heading.replaceWith(replacement);
  });

  document.querySelectorAll("*").forEach((element) => {
    if (element.tagName === "A") {
      const href = normalizeLinkHref(element.getAttribute("href") || "");
      const target = element.getAttribute("target");

      Array.from(element.attributes).forEach((attribute) =>
        element.removeAttribute(attribute.name)
      );

      if (href) {
        element.setAttribute("href", href);
      }

      if (target === "_blank") {
        element.setAttribute("target", "_blank");
        element.setAttribute("rel", "noopener noreferrer");
      }

      return;
    }

    if (element.tagName === "MARK") {
      const color = element.getAttribute("data-color")?.toLowerCase();

      Array.from(element.attributes).forEach((attribute) =>
        element.removeAttribute(attribute.name)
      );

      if (color && highlightOptions.some((option) => option.color === color)) {
        element.setAttribute("data-color", color);
        element.setAttribute("style", `background-color: ${color}`);
      }

      return;
    }

    Array.from(element.attributes).forEach((attribute) =>
      element.removeAttribute(attribute.name)
    );

    if (element.tagName === "FONT" || element.tagName === "SPAN") {
      element.replaceWith(...Array.from(element.childNodes));
    }
  });

  return document.body.innerHTML;
}

function convertWordListParagraphs(root: HTMLElement) {
  const candidates = Array.from(root.querySelectorAll("p")).filter((element) => {
    const className = element.getAttribute("class") || "";
    return /MsoList/i.test(className) || Boolean(parsePastedListLine(element.textContent || ""));
  });

  candidates.forEach((paragraph) => {
    if (!paragraph.isConnected || paragraph.parentElement?.tagName === "LI") {
      return;
    }

    const parsed = parsePastedListLine(paragraph.textContent || "", /MsoList/i.test(paragraph.className));

    if (!parsed) {
      return;
    }

    const previous = paragraph.previousElementSibling;
    const list =
      previous && previous.getAttribute("data-velomac-paste-list") === parsed.type
        ? previous
        : document.createElement(parsed.type);
    const item = document.createElement("li");

    item.textContent = parsed.text;
    list.appendChild(item);
    list.setAttribute("data-velomac-paste-list", parsed.type);

    if (list !== previous) {
      paragraph.before(list);
    }

    paragraph.remove();
  });
}

function plainTextToRichHtml(value: string) {
  const lines = value.replace(/\r\n?/g, "\n").split("\n");
  const output: string[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];
    const trimmed = line.trim();

    if (!trimmed) {
      index += 1;
      continue;
    }

    const heading3 = trimmed.match(/^###\s+(.+)$/);
    const heading2 = trimmed.match(/^##?\s+(.+)$/);

    if (heading3) {
      output.push(`<h3>${inlineMarkdownToHtml(heading3[1])}</h3>`);
      index += 1;
      continue;
    }

    if (heading2) {
      output.push(`<h2>${inlineMarkdownToHtml(heading2[1])}</h2>`);
      index += 1;
      continue;
    }

    const firstListItem = parseIndentedListLine(line);

    if (firstListItem) {
      const listItems: ParsedListItem[] = [];

      while (index < lines.length) {
        const parsed = parseIndentedListLine(lines[index]);

        if (!parsed) {
          break;
        }

        listItems.push(parsed);
        index += 1;
      }

      output.push(renderNestedLists(listItems));
      continue;
    }

    const paragraphLines = [trimmed];
    index += 1;

    while (index < lines.length) {
      const next = lines[index].trim();

      if (!next || /^#{1,3}\s+/.test(next) || parseIndentedListLine(lines[index])) {
        break;
      }

      paragraphLines.push(next);
      index += 1;
    }

    output.push(`<p>${inlineMarkdownToHtml(paragraphLines.join(" "))}</p>`);
  }

  return output.join("");
}

type ParsedListItem = {
  type: "ul" | "ol";
  level: number;
  text: string;
  children: ParsedListItem[];
};

function parseIndentedListLine(value: string): ParsedListItem | null {
  const bullet = value.match(/^(\s*)(?:[-*•·])\s+(.+)$/);
  const numbered = value.match(/^(\s*)\d+[.)]\s+(.+)$/);
  const match = bullet || numbered;

  if (!match) {
    return null;
  }

  const indentation = match[1].replace(/\t/g, "  ").length;

  return {
    type: bullet ? "ul" : "ol",
    level: Math.floor(indentation / 2),
    text: match[2],
    children: []
  };
}

function renderNestedLists(items: ParsedListItem[]) {
  if (!items.length) {
    return "";
  }

  const minLevel = Math.min(...items.map((item) => item.level));
  const roots: ParsedListItem[] = [];
  const lastAtLevel: ParsedListItem[] = [];

  items.forEach((item) => {
    const normalizedLevel = Math.max(0, item.level - minLevel);
    const normalized = { ...item, level: normalizedLevel, children: [] };

    if (normalizedLevel === 0 || !lastAtLevel[normalizedLevel - 1]) {
      roots.push(normalized);
    } else {
      lastAtLevel[normalizedLevel - 1].children.push(normalized);
    }

    lastAtLevel[normalizedLevel] = normalized;
    lastAtLevel.length = normalizedLevel + 1;
  });

  return renderListGroups(roots);
}

function renderListGroups(items: ParsedListItem[]) {
  const output: string[] = [];
  let index = 0;

  while (index < items.length) {
    const type = items[index].type;
    const group: ParsedListItem[] = [];

    while (index < items.length && items[index].type === type) {
      group.push(items[index]);
      index += 1;
    }

    output.push(
      `<${type}>${group
        .map(
          (item) =>
            `<li><p>${inlineMarkdownToHtml(item.text)}</p>${
              item.children.length ? renderListGroups(item.children) : ""
            }</li>`
        )
        .join("")}</${type}>`
    );
  }

  return output.join("");
}

function parsePastedListLine(value: string, assumeList = false) {
  const normalized = value.replace(/\u00a0/g, " ").trim();
  const bullet = normalized.match(/^(?:[-*•·▪◦])\s*(.+)$/);
  const numbered = normalized.match(/^\d+[.)]\s+(.+)$/);

  if (bullet) {
    return { type: "ul" as const, text: bullet[1] };
  }

  if (numbered) {
    return { type: "ol" as const, text: numbered[1] };
  }

  return assumeList && normalized
    ? { type: "ul" as const, text: normalized }
    : null;
}

function inlineMarkdownToHtml(value: string) {
  let html = escapeHtml(value);

  html = html.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    (_match, label: string, href: string) => {
      const safeHref = normalizeLinkHref(href);
      return safeHref
        ? `<a href="${escapeHtmlAttribute(safeHref)}">${label}</a>`
        : label;
    }
  );
  html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/__([^_]+)__/g, "<strong>$1</strong>");
  html = html.replace(/(^|[^*])\*([^*]+)\*/g, "$1<em>$2</em>");
  html = html.replace(/(^|[^_])_([^_]+)_/g, "$1<em>$2</em>");

  return html;
}

function normalizeLinkHref(value: string) {
  const href = value.trim();

  if (
    href.startsWith("/") ||
    href.startsWith("#") ||
    /^(https?:|mailto:|tel:)/i.test(href)
  ) {
    return href;
  }

  return "";
}

function isExternalHref(value: string) {
  return /^https?:\/\//i.test(value.trim());
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function escapeHtmlAttribute(value: string) {
  return escapeHtml(value);
}
