"use client";

import { useEffect, useState } from "react";

export function CopyEmailButton({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) {
      return;
    }

    const timeout = window.setTimeout(() => setCopied(false), 1800);

    return () => window.clearTimeout(timeout);
  }, [copied]);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = email;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }

    setCopied(true);
  }

  return (
    <span className="relative inline-flex">
      <button
        type="button"
        className="focus-ring rounded-sm text-left transition hover:text-industrial-700"
        onClick={copyEmail}
        aria-label={`Copy email address ${email}`}
      >
        Email: {email}
      </button>
      {copied ? (
        <span
          className="absolute right-0 top-full mt-2 whitespace-nowrap rounded-[4px] bg-navy-950 px-3 py-1.5 text-xs font-semibold text-white shadow-soft"
          role="status"
        >
          Email copied
        </span>
      ) : null}
    </span>
  );
}
