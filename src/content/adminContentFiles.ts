export type AdminContentFileKey =
  | "site"
  | "homepage"
  | "about"
  | "products"
  | "applications"
  | "articles"
  | "contact";

export type AdminContentFile = {
  key: AdminContentFileKey;
  label: string;
  description: string;
  path: string;
};

export const adminContentFiles: AdminContentFile[] = [
  {
    key: "site",
    label: "Site Settings",
    description: "Company name, contact details, logo paths, navigation and footer labels.",
    path: "src/content/data/site.json"
  },
  {
    key: "homepage",
    label: "Homepage",
    description: "Homepage hero, trust points, product preview text, application preview text and CTA copy.",
    path: "src/content/data/homepage.json"
  },
  {
    key: "about",
    label: "About",
    description: "About page profile, stats, capability sections, image paths and SEO text.",
    path: "src/content/data/about.json"
  },
  {
    key: "products",
    label: "Products",
    description: "Product descriptions, product image paths, SEO text, tables and related applications.",
    path: "src/content/data/products.json"
  },
  {
    key: "applications",
    label: "Applications",
    description: "Application cards, condition descriptions, recommended meters and image paths.",
    path: "src/content/data/applications.json"
  },
  {
    key: "articles",
    label: "Articles / Resources",
    description: "Article titles, summaries, cover images, body sections, takeaways and related content.",
    path: "src/content/data/articles.json"
  },
  {
    key: "contact",
    label: "Contact Page",
    description: "Contact page text, form labels, helper text and form state messages.",
    path: "src/content/data/contact.json"
  }
];

export function getAdminContentFile(key: string) {
  return adminContentFiles.find((file) => file.key === key);
}
