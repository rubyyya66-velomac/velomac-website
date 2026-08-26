import type { Product } from "@/types/content";
import type { ResourceArticle } from "@/content/articles";
import { site } from "@/content/site";
import { absoluteUrl } from "@/lib/seo";

export type BreadcrumbItem = {
  name: string;
  path: string;
};

export function organizationStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": absoluteUrl("/#organization"),
    name: site.name,
    legalName: site.legalName,
    foundingDate: site.foundingDate,
    url: absoluteUrl("/"),
    logo: absoluteUrl(site.logos.header),
    email: site.email,
    telephone: site.whatsapp,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Weihai",
      addressCountry: "CN"
    },
    sameAs: [
      site.footer.social.linkedin,
      site.footer.social.facebook,
      site.footer.social.tiktok
    ]
  };
}

export function websiteStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": absoluteUrl("/#website"),
    name: site.name,
    url: absoluteUrl("/"),
    publisher: {
      "@id": absoluteUrl("/#organization")
    },
    inLanguage: "en"
  };
}

export function breadcrumbStructuredData(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path)
    }))
  };
}

export function productStructuredData(product: Product) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": absoluteUrl(`/products/${product.slug}#product`),
    name: product.name,
    description: product.seo.description,
    image: absoluteUrl(product.image),
    url: absoluteUrl(`/products/${product.slug}`),
    category: product.category,
    brand: {
      "@type": "Brand",
      name: "Velomac"
    },
    manufacturer: {
      "@id": absoluteUrl("/#organization")
    },
    mainEntityOfPage: absoluteUrl(`/products/${product.slug}`)
  };

  if (product.slug === "vortex-flowmeter") {
    return {
      ...data,
      hasVariant: {
        "@id": absoluteUrl("/products/vortex-flowmeter/wide-turndown-anti-vibration#product")
      }
    };
  }

  return data;
}

export function articleStructuredData(article: ResourceArticle) {
  const articleUrl = absoluteUrl(`/resources/${article.slug}`);

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${articleUrl}#article`,
    headline: article.title,
    description: article.description,
    image: absoluteUrl(article.coverImage),
    datePublished: article.publishedDate,
    dateModified: article.modifiedDate || article.publishedDate,
    author: {
      "@id": absoluteUrl("/#organization")
    },
    publisher: {
      "@id": absoluteUrl("/#organization")
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": articleUrl
    }
  };
}
