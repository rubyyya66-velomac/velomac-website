"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { AdminContentFile } from "@/content/adminContentFiles";

type JsonPrimitive = string | number | boolean | null;
type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue };

type AdminPayload = {
  file: AdminContentFile;
  content: JsonValue;
};

type SaveState = "idle" | "loading" | "saving" | "saved" | "error";

export function AdminEditor({ files }: { files: AdminContentFile[] }) {
  const [selectedFile, setSelectedFile] = useState(files[0]?.key || "homepage");
  const [adminPassword, setAdminPassword] = useState("");
  const [payload, setPayload] = useState<AdminPayload | null>(null);
  const [state, setState] = useState<SaveState>("idle");
  const [message, setMessage] = useState("");
  const [rawJson, setRawJson] = useState("");

  const activeFile = useMemo(
    () => files.find((file) => file.key === selectedFile),
    [files, selectedFile]
  );

  useEffect(() => {
    let ignore = false;

    async function loadContent() {
      setState("loading");
      setMessage("");
      setPayload(null);

      try {
        const response = await fetch(`/api/admin/content?file=${selectedFile}`, {
          headers: buildAdminHeaders(adminPassword),
          cache: "no-store"
        });

        if (!response.ok) {
          throw new Error("Could not load this content file.");
        }

        const nextPayload = (await response.json()) as AdminPayload;

        if (!ignore) {
          setPayload(nextPayload);
          setRawJson(JSON.stringify(nextPayload.content, null, 2));
          setState("idle");
        }
      } catch (error) {
        if (!ignore) {
          setState("error");
          setMessage(error instanceof Error ? error.message : "Could not load content.");
        }
      }
    }

    loadContent();

    return () => {
      ignore = true;
    };
  }, [adminPassword, selectedFile]);

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
      setMessage("The raw JSON is not valid. Please fix it before applying.");
    }
  }

  async function saveContent() {
    if (!payload) {
      return;
    }

    setState("saving");
    setMessage("");

    try {
      const response = await fetch("/api/admin/content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...buildAdminHeaders(adminPassword)
        },
        body: JSON.stringify({
          file: selectedFile,
          content: payload.content,
          message: `Update ${payload.file.label} content`
        })
      });

      const responseBody = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(responseBody.message || "Could not save content.");
      }

      setState("saved");
      setMessage(responseBody.message || "Saved.");
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : "Could not save content.");
    }
  }

  return (
    <div className="min-h-screen bg-metal-50 text-navy-950">
      <header className="border-b border-metal-200 bg-white">
        <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-4 px-5 py-6 sm:px-6 lg:flex-row lg:items-end lg:justify-between lg:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-industrial-700">Velomac Admin</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-normal">Editable Content</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Update JSON-backed website content. Changes affect the public website after saving and redeployment.
            </p>
          </div>
          <label className="grid gap-2 text-sm font-semibold text-navy-950">
            <span>Admin password for save requests</span>
            <input
              className="w-full rounded-[4px] border border-metal-200 bg-white px-3 py-2 text-sm"
              type="password"
              value={adminPassword}
              onChange={(event) => setAdminPassword(event.target.value)}
              placeholder="Optional after browser sign-in"
            />
          </label>
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-[1200px] gap-6 px-5 py-8 sm:px-6 lg:grid-cols-[280px_1fr] lg:px-8">
        <aside className="h-fit border border-metal-200 bg-white p-4">
          <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-industrial-700">Content Files</h2>
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
                <span className="mt-1 block text-xs leading-5">{file.path}</span>
              </button>
            ))}
          </div>
        </aside>

        <section className="border border-metal-200 bg-white p-5 sm:p-6">
          <div className="flex flex-col gap-4 border-b border-metal-200 pb-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-sm font-semibold text-industrial-700">{activeFile?.path}</p>
              <h2 className="mt-2 text-2xl font-semibold">{activeFile?.label}</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{activeFile?.description}</p>
            </div>
            <button
              className="w-fit bg-navy-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-industrial-700 disabled:cursor-not-allowed disabled:opacity-60"
              type="button"
              disabled={!payload || state === "saving" || state === "loading"}
              onClick={saveContent}
            >
              {state === "saving" ? "Saving..." : "Save Changes"}
            </button>
          </div>

          {message ? (
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
          ) : null}

          {state === "loading" ? (
            <p className="mt-8 text-sm text-slate-600">Loading content...</p>
          ) : null}

          {payload ? (
            <div className="mt-6">
              <JsonEditor value={payload.content} path={[]} onChange={updateContent} />

              <details className="mt-8 border-t border-metal-200 pt-6">
                <summary className="cursor-pointer text-sm font-semibold text-industrial-700">Raw JSON editor</summary>
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
                  Apply Raw JSON
                </button>
              </details>
            </div>
          ) : null}
        </section>
      </main>
    </div>
  );
}

function JsonEditor({
  value,
  path,
  onChange
}: {
  value: JsonValue;
  path: string[];
  onChange: (value: JsonValue) => void;
}) {
  if (Array.isArray(value)) {
    return <ArrayEditor value={value} path={path} onChange={onChange} />;
  }

  if (isObject(value)) {
    return (
      <div className="grid gap-5">
        {Object.entries(value).map(([key, itemValue]) => (
          <FieldGroup key={key} label={labelFromKey(key)} path={[...path, key]}>
            <JsonEditor
              value={itemValue}
              path={[...path, key]}
              onChange={(nextValue) => {
                onChange({
                  ...value,
                  [key]: nextValue
                });
              }}
            />
          </FieldGroup>
        ))}
      </div>
    );
  }

  return <PrimitiveEditor value={value} fieldKey={path[path.length - 1] || ""} onChange={onChange} />;
}

function ArrayEditor({
  value,
  path,
  onChange
}: {
  value: JsonValue[];
  path: string[];
  onChange: (value: JsonValue) => void;
}) {
  if (value.every((item) => typeof item === "string" || typeof item === "number")) {
    return (
      <textarea
        className="min-h-28 w-full rounded-[4px] border border-metal-200 bg-white px-3 py-3 text-sm leading-6 text-navy-950"
        value={value.join("\n")}
        onChange={(event) => onChange(event.target.value.split("\n").filter(Boolean))}
      />
    );
  }

  if (value.some(Array.isArray)) {
    return (
      <textarea
        className="min-h-40 w-full rounded-[4px] border border-metal-200 bg-metal-50 px-3 py-3 font-mono text-xs leading-5 text-navy-950"
        value={JSON.stringify(value, null, 2)}
        onChange={(event) => {
          try {
            onChange(JSON.parse(event.target.value) as JsonValue);
          } catch {
            // Keep the user's draft visible until valid JSON is entered.
          }
        }}
        spellCheck={false}
      />
    );
  }

  return (
    <div className="grid gap-4">
      {value.map((item, index) => (
        <div className="border border-metal-200 bg-metal-50 p-4" key={`${path.join(".")}-${index}`}>
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-semibold text-navy-950">{arrayItemTitle(item, index)}</p>
            <div className="flex gap-2">
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
          </div>
          <JsonEditor
            value={item}
            path={[...path, String(index)]}
            onChange={(nextValue) => onChange(value.map((entry, entryIndex) => (entryIndex === index ? nextValue : entry)))}
          />
        </div>
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

function PrimitiveEditor({
  value,
  fieldKey,
  onChange
}: {
  value: JsonPrimitive;
  fieldKey: string;
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

  const useTextarea = shouldUseTextarea(fieldKey, value);

  if (useTextarea) {
    return (
      <textarea
        className="min-h-28 w-full rounded-[4px] border border-metal-200 bg-white px-3 py-3 text-sm leading-6 text-navy-950"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    );
  }

  return (
    <input
      className="w-full rounded-[4px] border border-metal-200 bg-white px-3 py-3 text-sm text-navy-950"
      type="text"
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  );
}

function FieldGroup({
  label,
  path,
  children
}: {
  label: string;
  path: string[];
  children: ReactNode;
}) {
  return (
    <section className="grid gap-2">
      <div>
        <h3 className="text-sm font-semibold text-navy-950">{label}</h3>
        <p className="text-xs leading-5 text-slate-500">{path.join(".")}</p>
      </div>
      {children}
    </section>
  );
}

function buildAdminHeaders(password: string): Record<string, string> {
  return password ? { "x-admin-password": password } : {};
}

function isObject(value: JsonValue): value is { [key: string]: JsonValue } {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function shouldUseTextarea(fieldKey: string, value: string) {
  const longFieldKeys = [
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

function cloneValue<T extends JsonValue>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}
