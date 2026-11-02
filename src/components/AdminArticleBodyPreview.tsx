"use client";

import { useEffect, useRef, useState } from "react";

export function AdminArticleBodyPreview({html}: {html: string}) {
  const [preview, setPreview] = useState<{source: string; html: string} | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  useEffect(() => { setPreview(null); setError(""); }, [html]);
  useEffect(() => { if (preview?.source === html) dialogRef.current?.showModal(); }, [preview, html]);
  async function showPreview() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/article-preview", {method: "POST", credentials: "same-origin", headers: {"Content-Type": "application/json"}, body: JSON.stringify({html})});
      const result = await response.json();
      if (!response.ok || typeof result.html !== "string") throw new Error(result.message || "Preview failed.");
      setPreview({source: html, html: result.html});
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : "Preview failed.");
    } finally { setLoading(false); }
  }
  return <div className="mt-5 border-t border-metal-200 pt-4">
    <button type="button" disabled={loading} onClick={showPreview} className="border border-metal-300 bg-white px-4 py-3 text-sm font-semibold text-navy-950">{loading ? "Rendering…" : "Preview article body"}</button>
    <p className="mt-2 text-xs leading-5 text-slate-500">Uses the public Resource Article HTML sanitizer and image styles. Previewing does not save or publish.</p>
    {error ? <p role="alert" className="mt-3 text-sm text-red-700">{error}</p> : null}
    {preview?.source === html ? <dialog ref={dialogRef} className="article-body-preview-dialog" aria-label="Public article preview" onCancel={event => {event.preventDefault(); setPreview(null);}}>
      <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-metal-200 bg-white p-4">
        <p className="text-sm font-semibold text-navy-950">Resource Article body · preview only</p>
        <button type="button" aria-label="Close article preview" onClick={() => setPreview(null)} className="min-h-11 min-w-11 border border-metal-200 text-navy-950">×</button>
      </div>
      <div className="resource-article-body bg-white p-5 sm:p-8" aria-label="Public article body preview" dangerouslySetInnerHTML={{__html: preview.html}} />
    </dialog> : null}
  </div>;
}
