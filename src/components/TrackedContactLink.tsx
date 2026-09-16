"use client";

import type { ReactNode } from "react";

type TrackedContactLinkProps = {
  href: string;
  channel: "whatsapp" | "email";
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
  newTab?: boolean;
};

export function TrackedContactLink({
  href,
  channel,
  children,
  className,
  ariaLabel,
  newTab = false
}: TrackedContactLinkProps) {
  function trackClick() {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "contact_link_click",
      contact_channel: channel,
      page_path: window.location.pathname
    });
  }

  return (
    <a
      href={href}
      className={className}
      aria-label={ariaLabel}
      target={newTab ? "_blank" : undefined}
      rel={newTab ? "noopener noreferrer" : undefined}
      onClick={trackClick}
    >
      {children}
    </a>
  );
}
