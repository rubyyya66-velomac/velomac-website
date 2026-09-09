import type { Metadata } from "next";
import { ApplicationReview } from "@/components/ApplicationReview";
import { JsonLd } from "@/components/JsonLd";
import { Container } from "@/components/Layout";
import { getApplicationReviewProductOption } from "@/content/applicationReview";
import { buildPageMetadata } from "@/lib/seo";
import { breadcrumbStructuredData } from "@/lib/structuredData";

export const metadata: Metadata = buildPageMetadata({
  title: "Flowmeter Application Review | Velomac",
  description: "Start a Velomac flowmeter application review with the medium, flow range, pressure, temperature and pipe size. Add installation details when available.",
  path: "/application-review"
});

type SearchParams = Record<string, string | string[] | undefined>;

const sourceTypes = new Set(["homepage", "product", "products_overview", "application_page", "resource", "footer", "navigation"]);
const sourceSections = new Set([
  "site-conditions",
  "bottom-selection-support",
  "bottom-application-review",
  "quick-answer",
  "contact-alternative",
  "contact-column",
  "products-submenu"
]);
const applicationTypes = new Set([
  "steam-measurement",
  "gas-flow-measurement",
  "conductive-liquid-measurement",
  "chemical-process-lines",
  "high-vibration-pipelines",
  "energy-loss-visibility"
]);

export default function FlowmeterApplicationReviewPage({ searchParams }: { searchParams: SearchParams }) {
  const initialProductSlug = getApplicationReviewProductOption(readParam(searchParams.product_slug))?.value;
  const initialMediumType = normalizeMediumParam(readParam(searchParams.mediumType));
  const sourceContext = {
    sourceType: readAllowedParam(searchParams.source_type, sourceTypes),
    sourceSection: readAllowedParam(searchParams.source_section, sourceSections),
    sourcePath: normalizeSourcePath(readParam(searchParams.source_path)),
    applicationType: readAllowedParam(searchParams.application_type, applicationTypes)
  };

  return (
    <>
      <JsonLd
        data={breadcrumbStructuredData([
          { name: "Home", path: "/" },
          { name: "Flowmeter Application Review", path: "/application-review" }
        ])}
      />

      <section className="velomac-blue-surface text-white">
        <Container className="py-12 sm:py-14 lg:py-16">
          <div className="max-w-4xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-100">Selection Support</p>
            <h1 className="mt-4 text-4xl font-semibold leading-[1.08] tracking-[-0.02em] text-white sm:text-5xl lg:text-[3.5rem]">
              Flowmeter Application Review
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-blue-50 sm:text-xl">
              Medium, flow range, pressure, temperature and pipe size are enough to start. Add more details only if available.
            </p>
          </div>
        </Container>
      </section>

      <ApplicationReview
        productName="Not sure yet"
        productSlug="not-sure-yet"
        productCategory="Flowmeters"
        sourcePath="/application-review"
        allowProductSelection
        initialProductSlug={initialProductSlug}
        initialMediumType={initialMediumType}
        sourceContext={sourceContext}
      />
    </>
  );
}

function readParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] || "" : value || "";
}

function normalizeMediumParam(value: string) {
  return ["liquid", "gas", "steam", "not-sure"].includes(value)
    ? (value as "liquid" | "gas" | "steam" | "not-sure")
    : undefined;
}

function readAllowedParam(value: string | string[] | undefined, allowedValues: Set<string>) {
  const normalized = readParam(value);
  return allowedValues.has(normalized) ? normalized : "";
}

function normalizeSourcePath(value: string) {
  return value.length <= 160 && /^\/[a-z0-9/-]*$/.test(value) ? value : "";
}
