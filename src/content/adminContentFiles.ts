export type AdminContentFileKey =
  | "site"
  | "homepage"
  | "about"
  | "quality"
  | "productCatalog"
  | "products"
  | "productApplicationMedia"
  | "featuredVortex"
  | "applicationsPage"
  | "applications"
  | "technology"
  | "technologyDetails"
  | "calibrationDetails"
  | "articles"
  | "resourcesPage"
  | "resourceCategories"
  | "contact";

export type AdminContentFile = {
  key: AdminContentFileKey;
  label: string;
  description: string;
  path: string;
  group: string;
};

export const adminContentFiles: AdminContentFile[] = [
  {
    key: "site",
    label: "Site Settings",
    description: "Company details, logos, controlled navigation, footer labels and social media links.",
    path: "src/content/data/site.json",
    group: "Site"
  },
  {
    key: "homepage",
    label: "Homepage",
    description: "Homepage hero, featured vortex, trust points, products, applications, technology, proof and CTA sections.",
    path: "src/content/data/homepage.json",
    group: "Homepage"
  },
  {
    key: "about",
    label: "About",
    description: "About page profile, stats, capability sections, image paths and SEO text.",
    path: "src/content/data/about.json",
    group: "Company"
  },
  {
    key: "quality",
    label: "Quality & Innovation",
    description: "Quality page hero, capability sections, proof points, images, CTA and SEO.",
    path: "src/content/data/quality-innovation.json",
    group: "Company"
  },
  {
    key: "productCatalog",
    label: "Product Catalogue",
    description: "Products overview hero, Flow and Level group labels, descriptions, order, card copy and featured module.",
    path: "src/content/data/product-catalog.json",
    group: "Products"
  },
  {
    key: "products",
    label: "Individual Products",
    description: "Reusable product basics, hero copy, capabilities, applications, technical data, images, SEO and related links.",
    path: "src/content/data/products.json",
    group: "Products"
  },
  {
    key: "productApplicationMedia",
    label: "Product Application Media",
    description: "Application-context image, ALT text and supporting summary used on each standard product page.",
    path: "src/content/data/product-application-context.json",
    group: "Products"
  },
  {
    key: "featuredVortex",
    label: "Featured Vortex Solution",
    description: "Wide-turndown anti-vibration page hero, benefits, engineering sections, technical range and CTA.",
    path: "src/content/data/featured-vortex-solution.json",
    group: "Products"
  },
  {
    key: "applicationsPage",
    label: "Applications Overview",
    description: "Applications page hero, introduction, reusable card labels and selection CTA.",
    path: "src/content/data/applications-page.json",
    group: "Applications"
  },
  {
    key: "applications",
    label: "Application Categories",
    description: "Application navigation labels, cards, conditions, recommended meters, details, images and links.",
    path: "src/content/data/applications.json",
    group: "Applications"
  },
  {
    key: "technology",
    label: "Technology Overview",
    description: "Technology hero, controlled navigation, overview sections, methods, images, supporting copy and SEO.",
    path: "src/content/data/technology.json",
    group: "Technology"
  },
  {
    key: "technologyDetails",
    label: "Technology Detail Pages",
    description: "Sensor, testing and application-upgrade detail modules, images, facts, related content and CTA.",
    path: "src/content/data/technology-detail-pages.json",
    group: "Technology"
  },
  {
    key: "calibrationDetails",
    label: "Calibration Detail Pages",
    description: "Gas, master-meter, liquid-bench and gravimetric calibration content, technical facts, images and CTA.",
    path: "src/content/data/calibration-detail-pages.json",
    group: "Technology"
  },
  {
    key: "resourcesPage",
    label: "Resources Overview",
    description: "Resources page hero, search metadata and final CTA.",
    path: "src/content/data/resources-page.json",
    group: "Resources"
  },
  {
    key: "articles",
    label: "Articles",
    description: "Article titles, summaries, cover images, rich article body, takeaways and related content.",
    path: "src/content/data/articles.json",
    group: "Resources"
  },
  {
    key: "resourceCategories",
    label: "Resource Categories",
    description: "Resource topic and industry labels, aliases, order and controlled category slugs.",
    path: "src/content/data/resource-categories.json",
    group: "Resources"
  },
  {
    key: "contact",
    label: "Contact Page",
    description: "Contact page text, form labels, helper text and form state messages.",
    path: "src/content/data/contact.json",
    group: "Contact"
  }
];

export function getAdminContentFile(key: string) {
  return adminContentFiles.find((file) => file.key === key);
}
