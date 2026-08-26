import type { Application } from "@/types/content";
import applicationsData from "./data/applications.json";

export const applications = applicationsData as Application[];

const applicationSlugAliases: Record<string, string> = {
  "steam-flow-measurement": "steam-measurement",
  "compressed-air-flow-measurement": "gas-flow-measurement",
  "conductive-liquid-flow-measurement": "conductive-liquid-measurement",
  "chemical-process-flow-measurement": "chemical-process-lines",
  "energy-management-flow-measurement": "energy-loss-visibility",
  "water-treatment-flow-measurement": "conductive-liquid-measurement",
  "hvac-chilled-water-flow-measurement": "conductive-liquid-measurement"
};

export function resolveApplicationSlug(slug: string) {
  return applicationSlugAliases[slug] || slug;
}

export function getApplicationsByRelatedSlugs(slugs: string[]) {
  const canonicalSlugs = new Set(slugs.map(resolveApplicationSlug));
  return applications.filter((application) => canonicalSlugs.has(application.slug));
}
