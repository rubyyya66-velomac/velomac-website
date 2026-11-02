"use client";

import { useEffect, useRef, useState } from "react";
import { normalizeArticleImage, safeArticleImageSrc, type ArticleImageAttributes } from "@/lib/articleImage";

export function ArticleImageSettings({ initial, replacing, mediaImages, onUploadImage, onApply, onRemove, onClose }: {
  initial: ArticleImageAttributes;
  replacing: boolean;
  mediaImages: string[];
  onUploadImage: (file: File) => Promise<string>;
  onApply: (attributes: ArticleImageAttributes) => void;
  onRemove: () => void;
  onClose: () => void;
}) {
  const [attributes, setAttributes] = useState(initial);
  const [search, setSearch] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [uploadNote, setUploadNote] = useState("");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const visibleImages = mediaImages.filter(src => safeArticleImageSrc(src) && src.toLowerCase().includes(search.toLowerCase()));

  useEffect(() => {
    const dialog = dialogRef.current;
    dialog?.showModal();
    return () => dialog?.close();
  }, []);

  function chooseSource(src: string) {
    setAttributes(current => ({ ...current, src, width: null, height: null }));
    setError("");
  }

  async function upload(file: File) {
    if (!/\.(jpe?g|png|webp)$/i.test(file.name) || !["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Choose a JPG, JPEG, PNG or WebP image.");
      return;
    }
    if (!file.size || file.size > 5 * 1024 * 1024) {
      setError("Choose a non-empty image under 5 MB.");
      return;
    }
    setUploading(true);
    setError("");
    // Read dimensions locally, even when a production upload awaits redeployment.
    const objectUrl = URL.createObjectURL(file);
    try {
      const dimensions = await new Promise<{ width: number; height: number }>((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve({ width: image.naturalWidth, height: image.naturalHeight });
        image.onerror = () => reject(new Error("This file could not be decoded as an image."));
        image.src = objectUrl;
      });
      const src = await onUploadImage(file);
      setAttributes(current => ({ ...current, src, ...dimensions }));
      setUploadNote("Uploaded to the existing Media Library. On production, new files become public after the GitHub deployment finishes. Save the article after setting ALT text.");
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : "Image upload failed. Try again.");
    } finally {
      URL.revokeObjectURL(objectUrl);
      setUploading(false);
    }
  }

  return (
    <dialog ref={dialogRef} className="article-image-settings" aria-labelledby="article-image-settings-title" onCancel={event => { event.preventDefault(); if (!uploading) onClose(); }}>
      <div className="flex items-start justify-between gap-4 border-b border-metal-200 p-5">
        <div>
          <h3 id="article-image-settings-title" className="text-lg font-semibold">{replacing ? "Edit article image" : "Insert article image"}</h3>
          <p className="mt-1 text-sm text-slate-600">Image settings belong to this article placement, not every use of the file.</p>
        </div>
        <button type="button" aria-label="Close image settings" disabled={uploading} onClick={onClose} className="min-h-11 min-w-11 border border-metal-200">×</button>
      </div>
      <div className="grid gap-5 p-5 md:grid-cols-2">
        <div className="order-2 min-w-0 space-y-4 md:order-none">
          <label className="grid gap-2 text-sm font-semibold">
            {replacing ? "Replace image from computer" : "Upload image from computer"}
            <input type="file" accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp" disabled={uploading} onChange={event => {
              const file = event.currentTarget.files?.[0];
              event.currentTarget.value = "";
              if (file) void upload(file);
            }} className="w-full border border-metal-300 p-2 text-sm font-normal" />
          </label>
          <label className="grid gap-2 text-sm font-semibold">Search Media Library
            <input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search by file path" className={fieldClass} />
          </label>
          <label className="grid gap-2 text-sm font-semibold">Select existing Media Library image
            <select aria-label="Select existing Media Library image" className={fieldClass} value={attributes.src} disabled={uploading} onChange={event => chooseSource(event.target.value)}>
              <option value="">Choose an image</option>
              {attributes.src && !visibleImages.includes(attributes.src) ? <option value={attributes.src}>{attributes.src}</option> : null}
              {visibleImages.map(src => <option key={src} value={src}>{src}</option>)}
            </select>
          </label>
          {attributes.src ? <div className="border border-metal-200 bg-metal-50 p-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img key={attributes.src} src={attributes.src} alt={attributes.alt} className="mx-auto max-h-52 max-w-full object-contain" onLoad={event => {
              const { naturalWidth: width, naturalHeight: height } = event.currentTarget;
              setAttributes(current => ({...current, width, height}));
            }} onError={() => setUploadNote("Preview not available yet. For a new production upload, wait for deployment; if this is an existing image, select a different file or check its path.")} />
            <p className="mt-2 break-all text-xs text-slate-500">{attributes.src}</p>
          </div> : null}
          <p className="text-xs text-slate-500">JPG / JPEG / PNG / WebP · Up to 5 MB. Existing SVG library files remain selectable. No Base64 images are stored in articles.</p>
          {uploading ? <p role="status" className="text-sm">Uploading image…</p> : null}
          {uploadNote ? <p role="status" className="text-sm text-slate-600">{uploadNote}</p> : null}
        </div>
        <div className="order-1 min-w-0 space-y-4 md:order-none">
          <label className="grid gap-2 text-sm font-semibold">ALT text
            <textarea autoFocus rows={3} value={attributes.alt} disabled={attributes.decorative} onChange={event => setAttributes(current => ({...current, alt: event.target.value}))} placeholder="Describe what this image shows and why it matters here." className={fieldClass} />
          </label>
          <label className="flex items-start gap-2 text-sm"><input type="checkbox" checked={attributes.decorative} onChange={event => setAttributes(current => ({...current, decorative: event.target.checked}))} className="mt-1" />Purely decorative image (empty ALT)</label>
          {!attributes.decorative && !attributes.alt.trim() ? <p role="status" className="border-l-2 border-amber-500 pl-3 text-sm text-amber-800">Add descriptive ALT text for an informative image. The filename will not be used as ALT text.</p> : null}
          <label className="grid gap-2 text-sm font-semibold">Caption (optional)
            <textarea rows={2} value={attributes.caption} onChange={event => setAttributes(current => ({...current, caption: event.target.value}))} placeholder="A short, separate explanation below the image." className={fieldClass} />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="grid gap-2 text-sm font-semibold">Image width
              <select className={fieldClass} value={attributes.displayWidth} onChange={event => setAttributes(current => normalizeArticleImage({...current, displayWidth: event.target.value}))}>
                <option value="50">50%</option><option value="75">75%</option><option value="100">100%</option>
              </select>
            </label>
            <label className="grid gap-2 text-sm font-semibold">Alignment
              <select className={fieldClass} value={attributes.alignment} onChange={event => setAttributes(current => normalizeArticleImage({...current, alignment: event.target.value}))}>
                <option value="left">Left</option><option value="center">Center</option><option value="right">Right</option>
              </select>
            </label>
          </div>
          <p className="text-xs leading-5 text-slate-500">Original aspect ratio is always preserved. Small screens use the available article width. Replacing a photo keeps this placement’s text: review ALT and caption for the new image.</p>
        </div>
      </div>
      <div className="sticky bottom-0 border-t border-metal-200 bg-white p-5">
        {error ? <p role="alert" className="mb-3 text-sm text-red-700">{error}</p> : null}
        <div className="flex flex-wrap gap-3">
          <button type="button" disabled={uploading || !safeArticleImageSrc(attributes.src)} className="bg-industrial-700 px-4 py-3 text-sm font-semibold text-white disabled:opacity-40" onClick={() => onApply(normalizeArticleImage(attributes))}>{replacing ? "Apply image settings" : "Insert image"}</button>
          <button type="button" disabled={uploading} className="border border-metal-300 px-4 py-3 text-sm" onClick={onClose}>Cancel</button>
          {replacing ? <button type="button" disabled={uploading} className="ml-auto px-2 py-3 text-sm text-red-700" onClick={onRemove}>Remove image from article</button> : null}
        </div>
      </div>
    </dialog>
  );
}

const fieldClass = "min-w-0 w-full border border-metal-300 bg-white px-3 py-2.5 text-base font-normal text-navy-950 sm:text-sm";
