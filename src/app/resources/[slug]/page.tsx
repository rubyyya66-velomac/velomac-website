import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CTASection } from "@/components/CTASection";
import { ApplicationReviewLink } from "@/components/ApplicationReviewLink";
import { JsonLd } from "@/components/JsonLd";
import { Container, Section } from "@/components/Layout";
import { getApplicationsByRelatedSlugs } from "@/content/applications";
import { getResourceEnhancement } from "@/content/resourceEnhancements";
import { getArticleBySlug, resources } from "@/content/resources";
import { getProductsByRelatedSlugs } from "@/content/products";
import { getTechnologyArticle } from "@/content/technology";
import { legacySectionsToHtml } from "@/lib/articleBody";
import { sanitizeArticleBodyHtml } from "@/lib/richTextSanitizer";
import { buildPageMetadata } from "@/lib/seo";
import { articleStructuredData, breadcrumbStructuredData } from "@/lib/structuredData";

export function generateStaticParams() {
  return resources.map((resource) => ({ slug: resource.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

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

export default async function ResourceArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const relatedProducts = getProductsByRelatedSlugs(article.relatedProductSlugs);
  const relatedApplications = getApplicationsByRelatedSlugs(article.relatedApplicationSlugs);
  const enhancement = getResourceEnhancement(article.slug);
  const relatedTechnology = (enhancement?.relatedTechnologySlugs || [])
    .map(getTechnologyArticle)
    .filter((item): item is NonNullable<typeof item> => Boolean(item));
  const relatedResources = (enhancement?.relatedResourceSlugs || [])
    .map(getArticleBySlug)
    .filter((item): item is NonNullable<typeof item> => Boolean(item));
  const preparedArticle = addArticleHeadingAnchors(
    sanitizeArticleBodyHtml(article.bodyHtml || legacySectionsToHtml(article.sections))
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

              {preparedArticle.headings.length >= 3 ? (
                <details className="group mt-8 border-y border-metal-200 bg-metal-50 px-5 py-4">
                  <summary className="focus-ring cursor-pointer list-none text-sm font-semibold text-navy-950 marker:content-none">
                    <span className="flex items-center justify-between gap-4">
                      On this page
                      <span aria-hidden="true" className="text-industrial-700 transition group-open:rotate-45">+</span>
                    </span>
                  </summary>
                  <nav aria-label="Article contents" className="mt-4 border-t border-metal-200 pt-4">
                    <ol className="grid gap-x-7 gap-y-2 sm:grid-cols-2">
                      {preparedArticle.headings.map((heading, index) => (
                        <li key={heading.id}>
                          <a className="focus-ring text-sm leading-6 text-slate-600 transition hover:text-industrial-700" href={`#${heading.id}`}>
                            <span className="mr-2 text-xs font-semibold text-industrial-700">{String(index + 1).padStart(2, "0")}</span>
                            {heading.label}
                          </a>
                        </li>
                      ))}
                    </ol>
                  </nav>
                </details>
              ) : null}

              {enhancement ? (
                <section className="mt-9 border-y border-metal-200 py-7" aria-labelledby="quick-answer-heading">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-industrial-700">Direct answer</p>
                  <h2 id="quick-answer-heading" className="mt-2 text-2xl font-semibold text-navy-950">Quick Answer</h2>
                  <p className="mt-4 text-base leading-7 text-slate-600">{enhancement.quickAnswer}</p>
                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    {enhancement.keyConditions.map((condition) => (
                      <p key={condition} className="border-l-2 border-industrial-600 pl-4 text-sm font-semibold leading-6 text-navy-950">
                        {condition}
                      </p>
                    ))}
                  </div>
                  <ApplicationReviewLink
                    sourceType="resource"
                    sourceSection="quick-answer"
                    sourcePath={`/resources/${article.slug}`}
                    applicationType={article.relatedApplicationSlugs[0]}
                    className="focus-ring mt-6 inline-flex items-center gap-2 text-sm font-semibold text-industrial-700 transition hover:text-navy-950"
                  >
                    Review these operating conditions <span aria-hidden="true">→</span>
                  </ApplicationReviewLink>
                </section>
              ) : null}

              <div
                className={`resource-article-body ${enhancement ? "mt-8" : "mt-10"}`}
                dangerouslySetInnerHTML={{ __html: preparedArticle.html }}
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
                  <p className="text-base font-semibold text-navy-950">Related products</p>
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
                  <p className="text-base font-semibold text-navy-950">
                    Related applications
                  </p>
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

              {relatedTechnology.length ? (
                <div className="mt-7">
                  <p className="text-base font-semibold text-navy-950">Engineering evidence</p>
                  <div className="mt-3 grid gap-2">
                    {relatedTechnology.map((item) => (
                      <Link key={item.slug} href={`/technology/${item.slug}`} className="focus-ring text-sm font-semibold leading-6 text-industrial-700 transition hover:text-navy-950">
                        {item.title} <span aria-hidden="true">→</span>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : null}

              {relatedResources.length ? (
                <div className="mt-7 border-t border-metal-200 pt-6">
                  <p className="text-base font-semibold text-navy-950">Continue the review</p>
                  <div className="mt-3 grid gap-3">
                    {relatedResources.map((resource) => (
                      <Link key={resource.slug} href={`/resources/${resource.slug}`} className="focus-ring text-sm font-semibold leading-6 text-slate-700 transition hover:text-industrial-700">
                        {resource.title}
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

function addArticleHeadingAnchors(html: string) {
  const headings: Array<{ id: string; label: string }> = [];
  const usedIds = new Set<string>();
  const transformedHtml = html.replace(/<h2([^>]*)>([\s\S]*?)<\/h2>/gi, (_match, attributes: string, content: string) => {
    const label = decodeHtmlText(content.replace(/<[^>]*>/g, "").trim());
    const baseId = slugifyHeading(label) || `section-${headings.length + 1}`;
    let id = baseId;
    let suffix = 2;
    while (usedIds.has(id)) {
      id = `${baseId}-${suffix}`;
      suffix += 1;
    }
    usedIds.add(id);
    headings.push({ id, label });
    const cleanAttributes = attributes.replace(/\s+id=("[^"]*"|'[^']*')/i, "");
    return `<h2${cleanAttributes} id="${id}" class="scroll-mt-28">${content}</h2>`;
  });

  return { html: transformedHtml, headings };
}

function slugifyHeading(value: string) {
  return value
    .toLowerCase()
    .replace(/&amp;/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 72);
}

function decodeHtmlText(value: string) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}
