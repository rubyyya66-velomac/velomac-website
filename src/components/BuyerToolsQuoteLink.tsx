"use client";

import Link from "next/link";
import { trackAnalyticsEvent } from "@/lib/analytics";

export function BuyerToolsQuoteLink() {
  return (
    <Link
      href="/contact"
      className="focus-ring inline-flex min-h-11 items-center text-sm font-semibold text-industrial-700 underline underline-offset-4 hover:text-navy-950"
      onClick={() => trackAnalyticsEvent("contact_link_click", {
        contact_channel: "quote",
        cta_location: "buyer_tools",
        page_path: "/resources"
      })}
    >
      Request a flow meter quote
    </Link>
  );
}
