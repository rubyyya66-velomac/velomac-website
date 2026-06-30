"use client";

import { useEffect, useMemo, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import type { AdminContentFile } from "@/content/adminContentFiles";

type JsonPrimitive = string | number | boolean | null;
type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue };
type JsonObject = { [key: string]: JsonValue };

type AdminPayload = {
  file: AdminContentFile;
  content: JsonValue;
};

type AdminSelectedFile = AdminContentFile["key"] | "media";
type AuthState = "checking" | "login" | "authenticated" | "missing-config";
type SaveState = "idle" | "loading" | "saving" | "saved" | "error";
type UploadState = "idle" | "uploading" | "uploaded" | "error";

export function AdminEditor({ files }: { files: AdminContentFile[] }) {
  const [authState, setAuthState] = useState<AuthState>("checking");
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [authMessage, setAuthMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState<AdminSelectedFile>(files[0]?.key || "homepage");
  const [payload, setPayload] = useState<AdminPayload | null>(null);
  const [state, setState] = useState<SaveState>("idle");
  const [message, setMessage] = useState("");
  const [rawJson, setRawJson] = useState("");
  const [mediaImages, setMediaImages] = useState<string[]>([]);
  const [mediaMessage, setMediaMessage] = useState("");
  const [mediaState, setMediaState] = useState<UploadState>("idle");

  const activeFile = useMemo(
    () => files.find((file) => file.key === selectedFile),
    [files, selectedFile]
  );

  useEffect(() => {
    checkSession();
  }, []);

  useEffect(() => {
    if (authState !== "authenticated") {
      return;
    }

    loadMedia();
  }, [authState]);

  useEffect(() => {
    if (authState !== "authenticated" || selectedFile === "media") {
      return;
    }

    let ignore = false;

    async function loadContent() {
      setState("loading");
      setMessage("");
      setPayload(null);

      try {
        const response = await fetch(`/api/admin/content?file=${selectedFile}`, {
          cache: "no-store",
          credentials: "same-origin"
        });
        const responseBody = (await response.json()) as AdminPayload & { message?: string };

        if (response.status === 401) {
          setAuthState("login");
          throw new Error(responseBody.message || "Your admin session expired. Please log in again.");
        }

        if (!response.ok) {
          throw new Error(responseBody.message || "This content could not be loaded. Please refresh and try again.");
        }

        if (!ignore) {
          setPayload(responseBody);
          setRawJson(JSON.stringify(responseBody.content, null, 2));
          setState("idle");
        }
      } catch (error) {
        if (!ignore) {
          setState("error");
          setMessage(error instanceof Error ? error.message : "This content could not be loaded.");
        }
      }
    }

    loadContent();

    return () => {
      ignore = true;
    };
  }, [authState, selectedFile]);

  async function checkSession() {
    setAuthState("checking");
    setAuthMessage("");

    try {
      const response = await fetch("/api/admin/session", {
        cache: "no-store",
        credentials: "same-origin"
      });
      const session = (await response.json()) as {
        authenticated?: boolean;
        configured?: boolean;
        missing?: string[];
      };

      if (!session.configured) {
        setAuthState("missing-config");
        setAuthMessage(`Admin login is not configured. Please set ${session.missing?.join(", ") || "ADMIN_USERNAME and ADMIN_PASSWORD"}.`);
        return;
      }

      setAuthState(session.authenticated ? "authenticated" : "login");
    } catch {
      setAuthState("login");
      setAuthMessage("Admin status could not be checked. Please try logging in.");
    }
  }

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAuthMessage("Checking login...");

    try {
      const response = await fetch("/api/admin/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ username, password })
      });
      const responseBody = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(responseBody.message || "Authentication failed. Please check the username and password.");
      }

      setPassword("");
      setAuthMessage("");
      setAuthState("authenticated");
    } catch (error) {
      setAuthMessage(error instanceof Error ? error.message : "Authentication failed. Please try again.");
      setAuthState("login");
    }
  }

  async function logout() {
    await fetch("/api/admin/session", {
      method: "DELETE",
      credentials: "same-origin"
    });
    setPayload(null);
    setAuthState("login");
  }

  async function loadMedia() {
    try {
      const response = await fetch("/api/admin/media", {
        cache: "no-store",
        credentials: "same-origin"
      });
      const responseBody = (await response.json()) as { images?: string[]; message?: string };

      if (!response.ok) {
        throw new Error(responseBody.message || "Images could not be loaded.");
      }

      setMediaImages(responseBody.images || []);
    } catch (error) {
      setMediaMessage(error instanceof Error ? error.message : "Images could not be loaded.");
    }
  }

  async function uploadImage(file: File) {
    setMediaState("uploading");
    setMediaMessage("Uploading image...");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/admin/media", {
        method: "POST",
        credentials: "same-origin",
        body: formData
      });
      const responseBody = (await response.json()) as { path?: string; message?: string };

      if (!response.ok || !responseBody.path) {
        throw new Error(responseBody.message || "Image upload failed. Please try again.");
      }

      setMediaState("uploaded");
      setMediaMessage(`${responseBody.message || "Image uploaded."} Path: ${responseBody.path}`);
      setMediaImages((current) => Array.from(new Set([responseBody.path as string, ...current])));

      return responseBody.path;
    } catch (error) {
      setMediaState("error");
      setMediaMessage(error instanceof Error ? error.message : "Image upload failed. Please try again.");
      throw error;
    }
  }

  function updateContent(nextContent: JsonValue) {
    setPayload((current) => (current ? { ...current, content: nextContent } : current));
    setRawJson(JSON.stringify(nextContent, null, 2));
    setState("idle");
    setMessage("");
  }

  function applyRawJson() {
    try {
      updateContent(JSON.parse(rawJson) as JsonValue);
    } catch {
      setState("error");
      setMessage("The advanced JSON is not valid. Please fix it before applying.");
    }
  }

  async function saveContent() {
    if (!payload || selectedFile === "media") {
      return;
    }

    setState("saving");
    setMessage("Saving changes...");

    try {
      const response = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          file: selectedFile,
          content: payload.content
        })
      });
      const responseBody = (await response.json()) as { message?: string };

      if (response.status === 401) {
        setAuthState("login");
        throw new Error(responseBody.message || "Your admin session expired. Please log in again.");
      }

      if (!response.ok) {
        throw new Error(responseBody.message || "Save failed. Please try again.");
      }

      setState("saved");
      setMessage(responseBody.message || "Saved successfully.");
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : "Save failed. Please try again.");
    }
  }

  if (authState === "checking") {
    return (
      <AdminShell>
        <CenteredPanel title="Checking Admin Access" text="Please wait while the admin session is checked." />
      </AdminShell>
    );
  }

  if (authState === "missing-config") {
    return (
      <AdminShell>
        <CenteredPanel
          title="Admin Login Is Not Configured"
          text={authMessage || "Please set ADMIN_USERNAME and ADMIN_PASSWORD before using the admin editor."}
        />
      </AdminShell>
    );
  }

  if (authState === "login") {
    return (
      <AdminShell>
        <div className="mx-auto flex min-h-screen w-full max-w-md items-center px-5 py-12">
          <form className="w-full border border-metal-200 bg-white p-6 shadow-sm" onSubmit={login}>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-industrial-700">Velomac Admin</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-normal text-navy-950">Log In</h1>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Enter the admin username and password before editing website content.
            </p>
            <label className="mt-6 grid gap-2 text-sm font-semibold text-navy-950">
              <span>Username</span>
              <input
                className="rounded-[4px] border border-metal-200 px-3 py-3 text-sm"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                autoComplete="username"
              />
            </label>
            <label className="mt-4 grid gap-2 text-sm font-semibold text-navy-950">
              <span>Password</span>
              <input
                className="rounded-[4px] border border-metal-200 px-3 py-3 text-sm"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
              />
            </label>
            {authMessage ? (
              <div className="mt-4 rounded-[4px] border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-900" role="alert">
                {authMessage}
              </div>
            ) : null}
            <button
              className="mt-6 w-full bg-navy-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-industrial-700"
              type="submit"
            >
              Log In
            </button>
          </form>
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      <header className="border-b border-metal-200 bg-white">
        <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-4 px-5 py-6 sm:px-6 lg:flex-row lg:items-end lg:justify-between lg:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-industrial-700">Velomac Admin</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-normal">Website Content Editor</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Manage text, articles, links and images. Save changes before leaving this page.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a className="border border-metal-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-industrial-400" href="/" target="_blank">
              View Website
            </a>
            <button
              className="border border-navy-950 px-4 py-2.5 text-sm font-semibold text-navy-950 transition hover:bg-metal-50"
              type="button"
              onClick={logout}
            >
              Log Out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-[1200px] gap-6 px-5 py-8 sm:px-6 lg:grid-cols-[280px_1fr] lg:px-8">
        <aside className="h-fit border border-metal-200 bg-white p-4">
          <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-industrial-700">Edit Content</h2>
          <div className="mt-4 grid gap-2">
            {files.map((file) => (
              <button
                className={`rounded-[4px] border px-3 py-3 text-left text-sm transition ${
                  selectedFile === file.key
                    ? "border-industrial-600 bg-blue-50 text-navy-950"
                    : "border-metal-200 bg-white text-slate-600 hover:border-industrial-300"
                }`}
                key={file.key}
                type="button"
                onClick={() => setSelectedFile(file.key)}
              >
                <span className="block font-semibold">{file.label}</span>
                <span className="mt-1 block text-xs leading-5">{file.description}</span>
              </button>
            ))}
            <button
              className={`rounded-[4px] border px-3 py-3 text-left text-sm transition ${
                selectedFile === "media"
                  ? "border-industrial-600 bg-blue-50 text-navy-950"
                  : "border-metal-200 bg-white text-slate-600 hover:border-industrial-300"
              }`}
              type="button"
              onClick={() => setSelectedFile("media")}
            >
              <span className="block font-semibold">Media Library</span>
              <span className="mt-1 block text-xs leading-5">Upload images and copy image paths.</span>
            </button>
          </div>
        </aside>

        <section className="border border-metal-200 bg-white p-5 sm:p-6">
          <div className="flex flex-col gap-4 border-b border-metal-200 pb-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h2 className="text-2xl font-semibold">{selectedFile === "media" ? "Media Library" : activeFile?.label}</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                {selectedFile === "media" ? "Upload reusable website images and copy their public paths." : activeFile?.description}
              </p>
              {activeFile ? (
                <details className="mt-3 text-xs leading-5 text-slate-500">
                  <summary className="cursor-pointer font-semibold text-slate-500">Advanced file location</summary>
                  <code>{activeFile.path}</code>
                </details>
              ) : null}
            </div>
            {selectedFile !== "media" ? (
              <button
                className="w-fit bg-navy-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-industrial-700 disabled:cursor-not-allowed disabled:opacity-60"
                type="button"
                disabled={!payload || state === "saving" || state === "loading"}
                onClick={saveContent}
              >
                {state === "saving" ? "Saving..." : "Save Changes"}
              </button>
            ) : null}
          </div>

          {message ? <StatusMessage state={state} message={message} /> : null}

          {mediaMessage ? (
            <StatusMessage state={mediaState === "error" ? "error" : "saved"} message={mediaMessage} />
          ) : null}

          {selectedFile === "media" ? (
            <MediaLibrary images={mediaImages} onUploadImage={uploadImage} onRefresh={loadMedia} />
          ) : null}

          {selectedFile !== "media" && state === "loading" ? (
            <p className="mt-8 text-sm text-slate-600">Loading content...</p>
          ) : null}

          {selectedFile !== "media" && payload ? (
            <div className="mt-6">
              {selectedFile === "articles" && Array.isArray(payload.content) ? (
                <ArticleManager
                  articles={payload.content}
                  mediaImages={mediaImages}
                  onUploadImage={uploadImage}
                  onChange={updateContent}
                />
              ) : (
                <JsonEditor
                  value={payload.content}
                  path={[]}
                  mediaImages={mediaImages}
                  onUploadImage={uploadImage}
                  onChange={updateContent}
                />
              )}

              <details className="mt-8 border-t border-metal-200 pt-6">
                <summary className="cursor-pointer text-sm font-semibold text-industrial-700">Advanced JSON editor</summary>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Use this only for careful structural edits, such as adding a full new article object.
                </p>
                <textarea
                  className="mt-4 min-h-[360px] w-full rounded-[4px] border border-metal-200 bg-metal-50 px-3 py-3 font-mono text-xs leading-5 text-navy-950"
                  value={rawJson}
                  onChange={(event) => setRawJson(event.target.value)}
                  spellCheck={false}
                />
                <button
                  className="mt-3 border border-navy-950 px-4 py-2 text-sm font-semibold text-navy-950 transition hover:bg-metal-50"
                  type="button"
                  onClick={applyRawJson}
                >
                  Apply Advanced JSON
                </button>
              </details>
            </div>
          ) : null}
        </section>
      </main>
    </AdminShell>
  );
}

function StatusMessage({ state, message }: { state: SaveState; message: string }) {
  return (
    <div
      className={`mt-5 rounded-[4px] border px-4 py-3 text-sm leading-6 ${
        state === "error"
          ? "border-red-200 bg-red-50 text-red-900"
          : "border-industrial-200 bg-blue-50 text-navy-950"
      }`}
      role={state === "error" ? "alert" : "status"}
    >
      {message}
    </div>
  );
}

function AdminShell({ children }: { children: ReactNode }) {
  return <div className="admin-shell min-h-screen bg-metal-50 text-navy-950">{children}</div>;
}

function CenteredPanel({ title, text }: { title: string; text: string }) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-xl items-center px-5 py-12">
      <div className="w-full border border-metal-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-industrial-700">Velomac Admin</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-normal text-navy-950">{title}</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">{text}</p>
      </div>
    </div>
  );
}

function MediaLibrary({
  images,
  onUploadImage,
  onRefresh
}: {
  images: string[];
  onUploadImage: (file: File) => Promise<string>;
  onRefresh: () => void;
}) {
  return (
    <div className="mt-6">
      <div className="border border-metal-200 bg-metal-50 p-4">
        <h3 className="text-lg font-semibold text-navy-950">Upload Image</h3>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Accepted formats: JPG, PNG, WEBP and SVG. Maximum file size: 5 MB.
        </p>
        <input
          className="mt-4 w-full rounded-[4px] border border-dashed border-metal-300 bg-white px-3 py-3 text-sm"
          type="file"
          accept=".jpg,.jpeg,.png,.webp,.svg,image/jpeg,image/png,image/webp,image/svg+xml"
          onChange={async (event) => {
            const file = event.target.files?.[0];
            if (file) {
              await onUploadImage(file);
              event.target.value = "";
            }
          }}
        />
        <button className="mt-3 border border-navy-950 px-4 py-2 text-sm font-semibold text-navy-950" type="button" onClick={onRefresh}>
          Refresh Image List
        </button>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((image) => (
          <div className="border border-metal-200 bg-white p-3" key={image}>
            <div className="flex aspect-[4/3] items-center justify-center bg-metal-50">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img alt="" className="max-h-full max-w-full object-contain" src={image} />
            </div>
            <input className="mt-3 w-full rounded-[4px] border border-metal-200 px-2 py-2 text-xs text-slate-700" readOnly value={image} />
          </div>
        ))}
      </div>
    </div>
  );
}

function ArticleManager({
  articles,
  mediaImages,
  onUploadImage,
  onChange
}: {
  articles: JsonValue[];
  mediaImages: string[];
  onUploadImage: (file: File) => Promise<string>;
  onChange: (value: JsonValue) => void;
}) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedArticle = isObject(articles[selectedIndex]) ? articles[selectedIndex] : null;
  const slugs = articles.map((article) => (isObject(article) && typeof article.slug === "string" ? article.slug : ""));
  const duplicateSlug = selectedArticle?.slug ? slugs.filter((slug) => slug === selectedArticle.slug).length > 1 : false;

  useEffect(() => {
    if (selectedIndex >= articles.length) {
      setSelectedIndex(Math.max(articles.length - 1, 0));
    }
  }, [articles.length, selectedIndex]);

  function updateArticle(nextArticle: JsonObject) {
    onChange(articles.map((article, index) => (index === selectedIndex ? nextArticle : article)));
  }

  function createArticle() {
    const title = "New Article";
    const slug = uniqueSlug(slugify(title), slugs);
    const newArticle: JsonObject = {
      slug,
      title,
      category: "Flowmeter Selection",
      status: "draft",
      description: "",
      excerpt: "",
      summary: "",
      intro: "",
      coverImage: "/images/blog/flowmeter-quote-site-details.png",
      coverAlt: "",
      publishedDate: new Date().toISOString().slice(0, 10),
      relatedProducts: [],
      relatedApplications: [],
      relatedProductSlugs: [],
      relatedApplicationSlugs: [],
      takeaways: [],
      sections: [
        {
          heading: "Section heading",
          body: ["Write the article paragraph here."]
        }
      ],
      estimatedWordCount: 0,
      seo: {
        title: "",
        description: ""
      }
    };

    onChange([...articles, newArticle]);
    setSelectedIndex(articles.length);
  }

  function duplicateArticle() {
    if (!selectedArticle) {
      return;
    }

    const copy = cloneValue(selectedArticle) as JsonObject;
    const copyTitle = `${String(copy.title || "Article")} Copy`;
    copy.title = copyTitle;
    copy.slug = uniqueSlug(slugify(copyTitle), slugs);
    copy.status = "draft";
    onChange([...articles, copy]);
    setSelectedIndex(articles.length);
  }

  function deleteArticle() {
    if (!selectedArticle || !window.confirm("Remove this article from the website content?")) {
      return;
    }

    onChange(articles.filter((_, index) => index !== selectedIndex));
    setSelectedIndex(Math.max(selectedIndex - 1, 0));
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      <aside className="border border-metal-200 bg-metal-50 p-3">
        <div className="flex flex-wrap gap-2">
          <button className="bg-navy-950 px-3 py-2 text-xs font-semibold text-white" type="button" onClick={createArticle}>
            Add Article
          </button>
          <button className="border border-metal-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700" type="button" onClick={duplicateArticle}>
            Duplicate
          </button>
        </div>
        <div className="mt-4 grid gap-2">
          {articles.map((article, index) => (
            <button
              className={`rounded-[4px] border px-3 py-3 text-left text-sm ${
                selectedIndex === index ? "border-industrial-600 bg-blue-50" : "border-metal-200 bg-white"
              }`}
              key={`${index}-${isObject(article) ? article.slug : "article"}`}
              type="button"
              onClick={() => setSelectedIndex(index)}
            >
              <span className="block font-semibold">{isObject(article) && typeof article.title === "string" ? article.title : `Article ${index + 1}`}</span>
              <span className="mt-1 block text-xs text-slate-500">{isObject(article) && typeof article.slug === "string" ? article.slug : "No slug"}</span>
            </button>
          ))}
        </div>
      </aside>

      <div>
        {selectedArticle ? (
          <div className="grid gap-6">
            {duplicateSlug ? (
              <div className="rounded-[4px] border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                This slug is already used by another article. Please edit it before saving.
              </div>
            ) : null}
            {!selectedArticle.slug ? (
              <div className="rounded-[4px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">
                Slug is required before saving.
              </div>
            ) : null}

            <FieldGroup label="Article Basics">
              <div className="grid gap-4">
                <TextField label="Article Title" value={stringValue(selectedArticle.title)} onChange={(value) => updateArticle({ ...selectedArticle, title: value })} />
                <div className="grid gap-2">
                  <TextField label="Slug" value={stringValue(selectedArticle.slug)} onChange={(value) => updateArticle({ ...selectedArticle, slug: slugify(value) })} />
                  <button
                    className="w-fit border border-metal-300 px-3 py-2 text-xs font-semibold text-slate-700"
                    type="button"
                    onClick={() => updateArticle({ ...selectedArticle, slug: uniqueSlug(slugify(stringValue(selectedArticle.title)), slugs.filter((_, index) => index !== selectedIndex)) })}
                  >
                    Generate Slug From Title
                  </button>
                </div>
                <TextField label="Category" value={stringValue(selectedArticle.category)} onChange={(value) => updateArticle({ ...selectedArticle, category: value })} />
                <label className="grid gap-2 text-sm font-semibold text-navy-950">
                  <span>Publishing Status</span>
                  <select
                    className="rounded-[4px] border border-metal-200 px-3 py-3 text-sm"
                    value={stringValue(selectedArticle.status || "published")}
                    onChange={(event) => updateArticle({ ...selectedArticle, status: event.target.value })}
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </label>
                <TextField label="Published Date" value={stringValue(selectedArticle.publishedDate)} onChange={(value) => updateArticle({ ...selectedArticle, publishedDate: value })} />
              </div>
            </FieldGroup>

            <FieldGroup label="Summary And SEO">
              <div className="grid gap-4">
                <TextareaField label="Article Excerpt" value={stringValue(selectedArticle.excerpt)} onChange={(value) => updateArticle({ ...selectedArticle, excerpt: value })} />
                <TextareaField label="Summary" value={stringValue(selectedArticle.summary)} onChange={(value) => updateArticle({ ...selectedArticle, summary: value })} />
                <TextareaField label="SEO Description" value={stringValue(selectedArticle.description)} onChange={(value) => updateArticle({ ...selectedArticle, description: value })} />
                <TextareaField label="Intro" value={stringValue(selectedArticle.intro)} onChange={(value) => updateArticle({ ...selectedArticle, intro: value })} />
              </div>
            </FieldGroup>

            <FieldGroup label="Cover Image">
              <ImagePathEditor
                value={stringValue(selectedArticle.coverImage)}
                mediaImages={mediaImages}
                onUploadImage={onUploadImage}
                onChange={(value) => updateArticle({ ...selectedArticle, coverImage: value })}
              />
              <TextField label="Cover Image Alt Text" value={stringValue(selectedArticle.coverAlt)} onChange={(value) => updateArticle({ ...selectedArticle, coverAlt: value })} />
            </FieldGroup>

            <ArticleSectionsEditor article={selectedArticle} onChange={updateArticle} />

            <FieldGroup label="Related Products And Applications">
              <div className="grid gap-4">
                <ListTextarea label="Related Product Slugs" value={stringArray(selectedArticle.relatedProductSlugs)} onChange={(value) => updateArticle({ ...selectedArticle, relatedProductSlugs: value })} />
                <ListTextarea label="Related Application Slugs" value={stringArray(selectedArticle.relatedApplicationSlugs)} onChange={(value) => updateArticle({ ...selectedArticle, relatedApplicationSlugs: value })} />
                <ListTextarea label="Takeaways" value={stringArray(selectedArticle.takeaways)} onChange={(value) => updateArticle({ ...selectedArticle, takeaways: value })} />
              </div>
            </FieldGroup>

            <FieldGroup label="Article Preview">
              <article className="border border-metal-200 bg-metal-50 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-industrial-700">{stringValue(selectedArticle.category)}</p>
                <h3 className="mt-2 text-2xl font-semibold text-navy-950">{stringValue(selectedArticle.title) || "Untitled article"}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{stringValue(selectedArticle.excerpt)}</p>
              </article>
            </FieldGroup>

            <button className="w-fit border border-red-200 px-4 py-2 text-sm font-semibold text-red-700" type="button" onClick={deleteArticle}>
              Delete Article
            </button>
          </div>
        ) : (
          <p className="text-sm text-slate-600">No article selected.</p>
        )}
      </div>
    </div>
  );
}

function ArticleSectionsEditor({
  article,
  onChange
}: {
  article: JsonObject;
  onChange: (value: JsonObject) => void;
}) {
  const sections = Array.isArray(article.sections) ? article.sections : [];

  return (
    <FieldGroup label="Article Body">
      <div className="grid gap-4">
        {sections.map((section, index) => {
          const sectionObject = isObject(section) ? section : { heading: "", body: [] };
          const body = Array.isArray(sectionObject.body) ? sectionObject.body.filter((entry): entry is string => typeof entry === "string") : [];

          return (
            <details className="border border-metal-200 bg-metal-50 p-4" key={index} open={index === 0}>
              <summary className="cursor-pointer text-sm font-semibold text-navy-950">{stringValue(sectionObject.heading) || `Section ${index + 1}`}</summary>
              <div className="mt-4 grid gap-4">
                <TextField
                  label="Section Heading"
                  value={stringValue(sectionObject.heading)}
                  onChange={(value) => updateArticleSection(article, index, { ...sectionObject, heading: value }, onChange)}
                />
                <ListTextarea
                  label="Paragraphs"
                  value={body}
                  onChange={(value) => updateArticleSection(article, index, { ...sectionObject, body: value }, onChange)}
                />
                <button
                  className="w-fit border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-700"
                  type="button"
                  onClick={() => {
                    const nextSections = sections.filter((_, sectionIndex) => sectionIndex !== index);
                    onChange({ ...article, sections: nextSections });
                  }}
                >
                  Remove Section
                </button>
              </div>
            </details>
          );
        })}
        <button
          className="w-fit border border-navy-950 px-4 py-2 text-sm font-semibold text-navy-950"
          type="button"
          onClick={() => onChange({ ...article, sections: [...sections, { heading: "New Section", body: ["Write a paragraph here."] }] })}
        >
          Add Section
        </button>
      </div>
    </FieldGroup>
  );
}

function updateArticleSection(
  article: JsonObject,
  index: number,
  section: JsonObject,
  onChange: (value: JsonObject) => void
) {
  const sections = Array.isArray(article.sections) ? article.sections : [];
  onChange({
    ...article,
    sections: sections.map((currentSection, sectionIndex) => (sectionIndex === index ? section : currentSection))
  });
}

function JsonEditor({
  value,
  path,
  mediaImages,
  onUploadImage,
  onChange
}: {
  value: JsonValue;
  path: string[];
  mediaImages: string[];
  onUploadImage: (file: File) => Promise<string>;
  onChange: (value: JsonValue) => void;
}) {
  const fieldKey = path[path.length - 1] || "";

  if (Array.isArray(value)) {
    return <ArrayEditor value={value} path={path} mediaImages={mediaImages} onUploadImage={onUploadImage} onChange={onChange} />;
  }

  if (isObject(value)) {
    return (
      <div className="grid gap-4">
        {Object.entries(value).map(([key, itemValue]) => (
          <details className="border border-metal-200 bg-white p-4" key={key} open={path.length === 0}>
            <summary className="cursor-pointer text-sm font-semibold text-navy-950">{labelFromKey(key)}</summary>
            <div className="mt-4">
              <JsonEditor
                value={itemValue}
                path={[...path, key]}
                mediaImages={mediaImages}
                onUploadImage={onUploadImage}
                onChange={(nextValue) => {
                  onChange({
                    ...value,
                    [key]: nextValue
                  });
                }}
              />
            </div>
          </details>
        ))}
      </div>
    );
  }

  return (
    <PrimitiveEditor
      value={value}
      fieldKey={fieldKey}
      mediaImages={mediaImages}
      onUploadImage={onUploadImage}
      onChange={onChange}
    />
  );
}

function ArrayEditor({
  value,
  path,
  mediaImages,
  onUploadImage,
  onChange
}: {
  value: JsonValue[];
  path: string[];
  mediaImages: string[];
  onUploadImage: (file: File) => Promise<string>;
  onChange: (value: JsonValue) => void;
}) {
  if (value.every((item) => typeof item === "string" || typeof item === "number")) {
    return (
      <ListTextarea
        label={labelFromKey(path[path.length - 1] || "Items")}
        value={value.map(String)}
        onChange={(items) => onChange(items)}
      />
    );
  }

  if (value.some(Array.isArray)) {
    return <JsonTextareaEditor value={value} onChange={onChange} />;
  }

  return (
    <div className="grid gap-4">
      {value.map((item, index) => (
        <details className="border border-metal-200 bg-metal-50 p-4" key={`${path.join(".")}-${index}`} open={index === 0 && value.length < 4}>
          <summary className="cursor-pointer text-sm font-semibold text-navy-950">{arrayItemTitle(item, index)}</summary>
          <div className="mt-4 grid gap-4">
            <div className="flex flex-wrap gap-2">
              <button
                className="border border-metal-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700"
                type="button"
                onClick={() => onChange(value.flatMap((entry, entryIndex) => (entryIndex === index ? [entry, cloneValue(entry)] : [entry])))}
              >
                Duplicate
              </button>
              <button
                className="border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-700"
                type="button"
                onClick={() => onChange(value.filter((_, entryIndex) => entryIndex !== index))}
              >
                Remove
              </button>
            </div>
            <JsonEditor
              value={item}
              path={[...path, String(index)]}
              mediaImages={mediaImages}
              onUploadImage={onUploadImage}
              onChange={(nextValue) => onChange(value.map((entry, entryIndex) => (entryIndex === index ? nextValue : entry)))}
            />
          </div>
        </details>
      ))}
      <button
        className="w-fit border border-navy-950 px-4 py-2 text-sm font-semibold text-navy-950"
        type="button"
        onClick={() => onChange([...value, value.length ? cloneValue(value[value.length - 1]) : {}])}
      >
        Add Item
      </button>
    </div>
  );
}

function JsonTextareaEditor({ value, onChange }: { value: JsonValue; onChange: (value: JsonValue) => void }) {
  const [draft, setDraft] = useState(JSON.stringify(value, null, 2));
  const [error, setError] = useState("");

  useEffect(() => {
    setDraft(JSON.stringify(value, null, 2));
  }, [value]);

  return (
    <div>
      <textarea
        className="min-h-40 w-full rounded-[4px] border border-metal-200 bg-metal-50 px-3 py-3 font-mono text-xs leading-5 text-navy-950"
        value={draft}
        onChange={(event) => {
          setDraft(event.target.value);
          setError("");
        }}
        spellCheck={false}
      />
      <button
        className="mt-3 border border-navy-950 px-4 py-2 text-sm font-semibold text-navy-950 transition hover:bg-white"
        type="button"
        onClick={() => {
          try {
            onChange(JSON.parse(draft) as JsonValue);
            setError("");
          } catch {
            setError("This table needs valid JSON before it can be applied.");
          }
        }}
      >
        Apply Table Edit
      </button>
      {error ? <p className="mt-2 text-sm text-red-700">{error}</p> : null}
    </div>
  );
}

function PrimitiveEditor({
  value,
  fieldKey,
  mediaImages,
  onUploadImage,
  onChange
}: {
  value: JsonPrimitive;
  fieldKey: string;
  mediaImages: string[];
  onUploadImage: (file: File) => Promise<string>;
  onChange: (value: JsonValue) => void;
}) {
  if (typeof value === "boolean") {
    return (
      <label className="inline-flex items-center gap-2 text-sm text-slate-700">
        <input type="checkbox" checked={value} onChange={(event) => onChange(event.target.checked)} />
        Enabled
      </label>
    );
  }

  if (typeof value === "number") {
    return (
      <input
        className="w-full rounded-[4px] border border-metal-200 bg-white px-3 py-3 text-sm text-navy-950"
        type="number"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    );
  }

  if (value === null) {
    return <p className="text-sm text-slate-500">No value</p>;
  }

  if (isImageField(fieldKey, value)) {
    return (
      <ImagePathEditor
        value={value}
        mediaImages={mediaImages}
        onUploadImage={onUploadImage}
        onChange={onChange}
      />
    );
  }

  if (isLinkField(fieldKey)) {
    return <LinkField value={value} onChange={onChange} />;
  }

  const useTextarea = shouldUseTextarea(fieldKey, value);

  if (useTextarea) {
    return <TextareaField label={labelFromKey(fieldKey)} value={value} onChange={onChange} />;
  }

  return <TextField label={labelFromKey(fieldKey)} value={value} onChange={onChange} />;
}

function ImagePathEditor({
  value,
  mediaImages,
  onUploadImage,
  onChange
}: {
  value: string;
  mediaImages: string[];
  onUploadImage: (file: File) => Promise<string>;
  onChange: (value: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const hasPreview = value.startsWith("/images/") || value.startsWith("http");

  return (
    <div className="grid gap-3">
      {hasPreview ? (
        <div className="flex min-h-[180px] items-center justify-center border border-metal-200 bg-metal-50 p-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img alt="" className="max-h-64 max-w-full object-contain" src={value} />
        </div>
      ) : null}
      <TextField label="Image Path" value={value} placeholder="/images/products/example.jpg" onChange={onChange} />
      <label className="grid gap-2 text-sm font-semibold text-navy-950">
        <span>Select Existing Image</span>
        <select className="rounded-[4px] border border-metal-200 px-3 py-3 text-sm" value={value} onChange={(event) => onChange(event.target.value)}>
          <option value="">Choose an image</option>
          {mediaImages.map((image) => (
            <option key={image} value={image}>
              {image}
            </option>
          ))}
        </select>
      </label>
      <label className="grid gap-2 text-sm font-semibold text-navy-950">
        <span>Upload Replacement Image</span>
        <input
          className="rounded-[4px] border border-dashed border-metal-300 px-3 py-3 text-sm"
          type="file"
          accept=".jpg,.jpeg,.png,.webp,.svg,image/jpeg,image/png,image/webp,image/svg+xml"
          disabled={uploading}
          onChange={async (event) => {
            const file = event.target.files?.[0];
            if (!file) {
              return;
            }

            setUploading(true);
            try {
              onChange(await onUploadImage(file));
              event.target.value = "";
            } finally {
              setUploading(false);
            }
          }}
        />
      </label>
      {uploading ? <p className="text-sm text-slate-600">Uploading image...</p> : null}
    </div>
  );
}

function LinkField({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const type = getLinkType(value);

  return (
    <div className="grid gap-3">
      <label className="grid gap-2 text-sm font-semibold text-navy-950">
        <span>Link Type</span>
        <select
          className="rounded-[4px] border border-metal-200 px-3 py-3 text-sm"
          value={type}
          onChange={(event) => {
            const nextType = event.target.value;
            if (nextType === "internal") onChange("/");
            if (nextType === "external") onChange("https://");
            if (nextType === "email") onChange("mailto:info@velomacflowmeter.com");
            if (nextType === "phone") onChange("tel:");
          }}
        >
          <option value="internal">Internal link</option>
          <option value="external">External link</option>
          <option value="email">Email link</option>
          <option value="phone">Phone / WhatsApp link</option>
        </select>
      </label>
      <TextField
        label="Link URL"
        value={value}
        placeholder="/products, /contact, mailto:info@velomacflowmeter.com, https://..."
        onChange={onChange}
      />
      {value && !looksLikeValidLink(value) ? (
        <p className="text-sm text-amber-700">This link looks unusual. Use /contact, mailto:..., tel:... or https://...</p>
      ) : null}
    </div>
  );
}

function TextField({
  label,
  value,
  placeholder,
  onChange
}: {
  label: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-navy-950">
      <span>{label}</span>
      <input
        className="w-full rounded-[4px] border border-metal-200 bg-white px-3 py-3 text-sm text-navy-950"
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

function TextareaField({
  label,
  value,
  onChange
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-navy-950">
      <span>{label}</span>
      <textarea
        className="min-h-28 w-full rounded-[4px] border border-metal-200 bg-white px-3 py-3 text-sm leading-6 text-navy-950"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

function ListTextarea({
  label,
  value,
  onChange
}: {
  label: string;
  value: string[];
  onChange: (value: string[]) => void;
}) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-navy-950">
      <span>{label}</span>
      <textarea
        className="min-h-28 w-full rounded-[4px] border border-metal-200 bg-white px-3 py-3 text-sm leading-6 text-navy-950"
        value={value.join("\n")}
        onChange={(event) => onChange(event.target.value.split("\n").map((item) => item.trim()).filter(Boolean))}
      />
    </label>
  );
}

function FieldGroup({
  label,
  children
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <section className="grid gap-3 border border-metal-200 bg-white p-4">
      <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-industrial-700">{label}</h3>
      {children}
    </section>
  );
}

function isObject(value: JsonValue): value is JsonObject {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isImageField(fieldKey: string, value: string) {
  const lowerKey = fieldKey.toLowerCase();

  if (lowerKey.includes("alt")) {
    return false;
  }

  return (
    fieldKey === "src" ||
    fieldKey === "coverImage" ||
    fieldKey === "image" ||
    lowerKey === "coverimage" ||
    value.startsWith("/images/")
  );
}

function isLinkField(fieldKey: string) {
  const lowerKey = fieldKey.toLowerCase();
  return lowerKey === "href" || lowerKey === "url" || lowerKey.includes("link");
}

function getLinkType(value: string) {
  if (value.startsWith("mailto:")) return "email";
  if (value.startsWith("tel:") || value.includes("wa.me")) return "phone";
  if (value.startsWith("http")) return "external";
  return "internal";
}

function looksLikeValidLink(value: string) {
  return value.startsWith("/") || value.startsWith("https://") || value.startsWith("mailto:") || value.startsWith("tel:");
}

function shouldUseTextarea(fieldKey: string, value: string) {
  const longFieldKeys = [
    "alt",
    "body",
    "description",
    "excerpt",
    "focus",
    "intro",
    "overview",
    "summary",
    "text",
    "challenge",
    "siteCondition",
    "whereItFits",
    "subheadline",
    "helpfulDetailsText"
  ];

  return value.length > 90 || longFieldKeys.includes(fieldKey);
}

function labelFromKey(key: string) {
  const labels: Record<string, string> = {
    alt: "Image Alt Text",
    ctaHref: "Button Link",
    ctaLabel: "Button Text",
    description: "Description",
    email: "Email",
    errorEmail: "Fallback Email",
    errorMessage: "Error Message",
    excerpt: "Article Excerpt",
    headline: "Headline",
    href: "Link URL",
    image: "Image",
    imageAlt: "Image Alt Text",
    intro: "Intro",
    metadata: "SEO",
    name: "Name",
    navItems: "Navigation Links",
    overview: "Product Description",
    primaryCta: "Primary Button",
    secondaryCta: "Secondary Button",
    seo: "SEO",
    src: "Image Path",
    subheadline: "Subheading",
    title: "Title",
    url: "Website URL",
    whatsapp: "WhatsApp"
  };

  if (labels[key]) {
    return labels[key];
  }

  return key
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replaceAll("-", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function arrayItemTitle(value: JsonValue, index: number) {
  if (isObject(value)) {
    const title = value.title || value.name || value.headline || value.slug || value.heading || value.label;
    if (typeof title === "string") {
      return title;
    }
  }

  return `Item ${index + 1}`;
}

function stringValue(value: JsonValue | undefined) {
  return typeof value === "string" ? value : "";
}

function stringArray(value: JsonValue | undefined) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function uniqueSlug(baseSlug: string, slugs: string[]) {
  const safeBaseSlug = baseSlug || "new-article";
  let nextSlug = safeBaseSlug;
  let count = 2;

  while (slugs.includes(nextSlug)) {
    nextSlug = `${safeBaseSlug}-${count}`;
    count += 1;
  }

  return nextSlug;
}

function cloneValue<T extends JsonValue>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}
