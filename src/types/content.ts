export type Seo = {
  title: string;
  description: string;
};

export type TableBlock = {
  title?: string;
  columns: string[];
  rows: string[][];
  note?: string;
};

export type ProductCategory = "Flowmeters" | "Level Instruments";

export type Product = {
  slug: string;
  name: string;
  category: ProductCategory;
  shortDescription: string;
  overview: string;
  image: string;
  imageAlt: string;
  relatedApplicationSlugs?: string[];
  typicalMedia: string[];
  typicalApplications: string[];
  availableTypes: string[];
  coreCapabilities: {
    title: string;
    text: string;
  }[];
  technicalData: TableBlock;
  flowRange?: TableBlock;
  seo: Seo;
};

export type Application = {
  slug: string;
  title: string;
  focus: string;
  image: {
    src: string;
    alt: string;
  };
  cardDescription: string;
  whereItFits: string;
  siteCondition: string;
  challenge: string;
  suitableMeters: string[];
  detailsToSend: string[];
};

export type ResourceCard = {
  title: string;
  category: string;
  description: string;
  slug: string;
};
