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
  return {
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
    }
  };
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
