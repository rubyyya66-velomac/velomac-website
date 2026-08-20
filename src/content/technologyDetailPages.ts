import type {
  TechnologyCategoryId,
  TechnologyImage,
  TechnologyTable
} from "@/content/technology";
import { calibrationDetailPages } from "@/content/calibrationDetailPages";
import technologyDetailPagesData from "./data/technology-detail-pages.json";

export type TechnologyDetailFact = {
  label: string;
  value: string;
};

export type TechnologyDetailImage = TechnologyImage & {
  caption?: string;
  position?: "center" | "top";
};

export type TechnologyDetailItem = {
  title: string;
  text?: string;
  bullets?: string[];
};

export type TechnologyDetailModule = {
  kind: "split" | "cards" | "steps" | "table" | "gallery" | "highlight" | "checklist";
  eyebrow?: string;
  title: string;
  description?: string;
  bullets?: string[];
  items?: TechnologyDetailItem[];
  image?: TechnologyDetailImage;
  images?: TechnologyDetailImage[];
  table?: TechnologyTable;
  result?: TechnologyDetailFact;
  link?: {
    label: string;
    href: string;
  };
  reverse?: boolean;
  tone?: "white" | "soft" | "blue" | "dark";
};

export type TechnologyDetailPageContent = {
  slug: string;
  categoryId: TechnologyCategoryId;
  heroLabel?: string;
  heroTitleLines?: string[];
  breadcrumbs?: {
    label: string;
    href?: string;
  }[];
  heroIntroduction: string;
  heroImage: TechnologyDetailImage;
  facts: TechnologyDetailFact[];
  modules: TechnologyDetailModule[];
  relatedEyebrow: string;
  relatedHeading: string;
  relatedLinks?: {
    label: string;
    href: string;
  }[];
  backLink?: {
    label: string;
    href: string;
  };
  heroCta?: {
    label: string;
    href: string;
  };
  cta: {
    title: string;
    text: string;
    eyebrow?: string;
    buttonLabel?: string;
    href?: string;
    detailChips?: string[];
  };
};

const detailPages = technologyDetailPagesData as TechnologyDetailPageContent[];

export function getTechnologyDetailPage(slug: string) {
  return (
    calibrationDetailPages.find((page) => page.slug === slug) ??
    detailPages.find((page) => page.slug === slug)
  );
}
