import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CTASection } from "@/components/CTASection";
import { JsonLd } from "@/components/JsonLd";
import { Container, Section } from "@/components/Layout";
import { getApplicationsByRelatedSlugs } from "@/content/applications";
import { getArticleBySlug, resources } from "@/content/resources";
import { products } from "@/content/products";
import { legacySectionsToHtml } from "@/lib/articleBody";
import { sanitizeArticleBodyHtml } from "@/lib/richTextSanitizer";
import { buildPageMetadata } from "@/lib/seo";
import { articleStructuredData, breadcrumbStructuredData } from "@/lib/structuredData";

export function generateStaticParams() {
  return resources.map((resource) => ({ slug: resource.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const article = getArticleBySlug(params.slug);

  if (!article) {
    return {};
  }

  const metadata = buildPageMetadata({
    title: `${article.title} | Velomac Flow Meter`,
    description: article.description,
    path: `/resources/${article.slug}`,
    image: article.coverImage,
    imageAlt: article.coverAlt,
    type: "article"
  });

  return {
    ...metadata,
    openGraph: {
      ...metadata.openGraph,
      type: "article",
      publishedTime: article.publishedDate,
      modifiedTime: article.modifiedDate
    }
  };
}

export default function ResourceArticlePage({ params }: { params: { slug: string } }) {
  const article = getArticleBySlug(params.slug);

  if (!article) {
    notFound();
  }

  const relatedProducts = products.filter((product) => article.relatedProductSlugs.includes(product.slug));
  const relatedApplications = getApplicationsByRelatedSlugs(article.relatedApplicationSlugs);
  const articleBodyHtml = sanitizeArticleBodyHtml(
    article.bodyHtml || legacySectionsToHtml(article.sections)
  );

  return (
    <>
      <JsonLd data={articleStructuredData(article)} />
      <JsonLd
        data={breadcrumbStructuredData([
          { name: "Home", path: "/" },
          { name: "Resources", path: "/resources" },
          { name: article.title, path: `/resources/${article.slug}` }
        ])}
      />
      <section className="velomac-blue-surface text-white">
        <Container className="py-14 sm:py-16 lg:py-20">
          <nav aria-label="Breadcrumb" className="mb-8 flex flex-wrap items-center gap-2 text-sm text-blue-100">
            <Link href="/" className="focus-ring transition hover:text-white">Home</Link>
            <span aria-hidden="true">/</span>
            <Link href="/resources" className="focus-ring transition hover:text-white">Resources</Link>
            <span aria-hidden="true">/</span>
            <span className="text-white">{article.title}</span>
          </nav>
          <div className="grid gap-9 lg:grid-cols-[0.92fr_0.78fr] lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-100">{article.category}</p>
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-blue-100">
                <time dateTime={article.publishedDate}>Published {formatResourceDate(article.publishedDate)}</time>
                {article.modifiedDate && article.modifiedDate !== article.publishedDate ? (
                  <time dateTime={article.modifiedDate}>Updated {formatResourceDate(article.modifiedDate)}</time>
                ) : null}
              </div>
              <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-normal text-white sm:text-5xl">
                {article.title}
              </h1>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-blue-50">{article.intro || article.summary}</p>
            </div>
            <figure>
              <div className="relative aspect-[16/9] overflow-hidden rounded-[6px] bg-white/10">
                <Image
                  src={article.coverImage}
                  alt={article.coverAlt}
                  fill
                  sizes="(min-width: 1024px) 460px, 100vw"
                  className="object-cover"
                  priority
                />
              </div>
              {article.coverCaption ? (
                <figcaption className="mt-3 text-sm leading-6 text-blue-100">{article.coverCaption}</figcaption>
              ) : null}
            </figure>
          </div>
        </Container>
      </section>

      <Section>
        <Container className="max-w-[980px]">
          <div className="grid gap-8 lg:grid-cols-[1fr_280px] lg:items-start">
            <article className="min-w-0">
              <p className="text-lg leading-8 text-slate-600">{article.excerpt}</p>

              <div
                className="resource-article-body mt-10"
                dangerouslySetInnerHTML={{ __html: articleBodyHtml }}
              />

              {article.takeaways.length ? (
                <section className="mt-10 rounded-[6px] border border-metal-200 bg-metal-50 p-6">
                  <h2 className="text-xl font-semibold text-navy-950">Key points</h2>
                  <ul className="mt-4 grid gap-3">
                    {article.takeaways.map((takeaway) => (
                      <li key={takeaway} className="border-l-2 border-industrial-600 pl-4 text-base leading-7 text-slate-600">
                        {takeaway}
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}
            </article>

            <aside className="rounded-[6px] border border-metal-200 bg-white p-5">
              {relatedProducts.length ? (
                <div>
                  <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-navy-950">Related products</h2>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {relatedProducts.map((product) => (
                      <Link
                        key={product.slug}
                        href={`/products/${product.slug}`}
                        className="focus-ring rounded-full border border-metal-200 bg-metal-50 px-3 py-2 text-sm font-semibold leading-5 text-slate-700 transition hover:border-industrial-500 hover:text-industrial-700"
                      >
                        {product.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : null}

              {relatedApplications.length ? (
                <div className="mt-7">
                  <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-navy-950">
                    Related applications
                  </h2>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {relatedApplications.map((application) => (
                      <Link
                        key={application.slug}
                        href={`/applications/${application.slug}`}
                        className="focus-ring rounded-full border border-metal-200 bg-metal-50 px-3 py-2 text-sm font-semibold leading-5 text-slate-700 transition hover:border-industrial-500 hover:text-industrial-700"
                      >
                        {application.title}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : null}
            </aside>
          </div>
        </Container>
      </Section>

      <CTASection
        title="Send Site Details for a Better Recommendation."
        text="Share the fluid, pipe size, flow range, pressure, temperature and application background. Velomac will review the conditions and suggest the next step."
        surfaceClassName="velomac-blue-surface"
      />
    </>
  );
}

function formatResourceDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC"
  }).format(new Date(`${value}T00:00:00Z`));
}
