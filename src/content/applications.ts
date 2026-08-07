import type { Application } from "@/types/content";
import applicationsData from "./data/applications.json";

export const applications = applicationsData as Application[];

export function getApplicationBySlug(slug: string) {
  return applications.find((application) => application.slug === slug);
}
