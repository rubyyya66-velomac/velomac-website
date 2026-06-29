import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CTASection } from "@/components/CTASection";
import { Container, Section } from "@/components/Layout";
import { applications } from "@/content/applications";
import { getArticleBySlug, resources } from "@/content/resources";
import { products } from "@/content/products";

export function generateStaticParams() {
  return resources.map((resource) => ({ slug: resource.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const article = getArticleBySlug(params.slug);

  if (!article) {
    return {};
  }

  return {
    title: `${article.title} | Velomac Flow Meter`,
    description: article.description,
    openGraph: {
      title: article.title,
      description: article.description,
      type: "article",
      publishedTime: article.publishedDate,
      images: [article.coverImage]
    }
  };
}

export default function ResourceArticlePage({ params }: { params: { slug: string } }) {
  const article = getArticleBySlug(params.slug);

  if (!article) {
    notFound();
  }

  const relatedProducts = products.filter((product) => article.relatedProductSlugs.includes(product.slug));
  const relatedApplications = applications.filter((application) =>
    article.relatedApplicationSlugs.includes(application.slug)
  );

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    datePublished: article.publishedDate,
    image: article.coverImage,
    publisher: {
      "@type": "Organization",
      name: "Velomac Flow Meter"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <section className="velomac-blue-surface text-white">
        <Container className="py-14 sm:py-16 lg:py-20">
          <div className="grid gap-9 lg:grid-cols-[0.92fr_0.78fr] lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-100">{article.category}</p>
              <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-normal text-white sm:text-5xl">
                {article.title}
              </h1>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-blue-50">{article.intro || article.summary}</p>
            </div>
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
          </div>
        </Container>
      </section>

      <Section>
        <Container className="max-w-[980px]">
          <div className="grid gap-8 lg:grid-cols-[1fr_280px] lg:items-start">
            <article className="min-w-0">
              <p className="text-lg leading-8 text-slate-600">{article.excerpt}</p>

              {article.sections.map((section) => (
                <section key={section.heading} className="mt-10">
                  <h2 className="text-[1.7rem] font-semibold tracking-normal text-navy-950">{section.heading}</h2>
                  <div className="mt-5 space-y-5">
                    {section.body.map((paragraph) => (
                      <p key={paragraph} className="text-base leading-8 text-slate-600 sm:text-[1.05rem]">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </section>
              ))}

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
                        href={`/applications#${application.slug}`}
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
