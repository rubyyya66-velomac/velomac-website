"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export type ApplicationReviewSourceType =
  | "homepage"
  | "product"
  | "products_overview"
  | "application_page"
  | "resource"
  | "footer"
  | "navigation";

type ApplicationReviewLinkProps = {
  children: ReactNode;
  className?: string;
  href?: string;
  sourceType: ApplicationReviewSourceType;
  sourceSection: string;
  sourcePath?: string;
  productSlug?: string;
  applicationType?: string;
  mediumType?: "liquid" | "gas" | "steam" | "not-sure";
  ariaLabel?: string;
  role?: string;
  onNavigate?: () => void;
};

export function ApplicationReviewLink({
  children,
  className,
  href = "/application-review",
  sourceType,
  sourceSection,
  sourcePath,
  productSlug,
  applicationType,
  mediumType,
  ariaLabel,
  role,
  onNavigate
}: ApplicationReviewLinkProps) {
  const pathname = usePathname();
  const pagePath = sourcePath || pathname;
  const destination = buildDestination({
    href,
    sourceType,
    sourceSection,
    sourcePath: pagePath,
    productSlug,
    applicationType,
    mediumType
  });

  function handleClick() {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "application_review_cta_click",
      page_path: pagePath,
      source_type: sourceType,
      source_section: sourceSection,
      ...(productSlug ? { product_slug: productSlug } : {}),
      ...(applicationType ? { application_type: applicationType } : {})
    });
    onNavigate?.();
  }

  return (
    <Link
      href={destination}
      data-application-review-entry
      className={className}
      aria-label={ariaLabel}
      role={role}
      onClick={handleClick}
    >
      {children}
    </Link>
  );
}

function buildDestination({
  href,
  sourceType,
  sourceSection,
  sourcePath,
  productSlug,
  applicationType,
  mediumType
}: {
  href: string;
  sourceType: ApplicationReviewSourceType;
  sourceSection: string;
  sourcePath: string;
  productSlug?: string;
  applicationType?: string;
  mediumType?: "liquid" | "gas" | "steam" | "not-sure";
}) {
  if (!href.startsWith("/application-review")) return href;

  const [path, existingQuery = ""] = href.split("?");
  const params = new URLSearchParams(existingQuery);
  params.set("source_type", sourceType);
  params.set("source_section", sourceSection);
  params.set("source_path", sourcePath);
  if (productSlug) params.set("product_slug", productSlug);
  if (applicationType) params.set("application_type", applicationType);
  if (mediumType) params.set("mediumType", mediumType);
  return `${path}?${params.toString()}`;
}
