import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CTASection } from "@/components/CTASection";
import { JsonLd } from "@/components/JsonLd";
import { Container, Section } from "@/components/Layout";
import { applications, resolveApplicationSlug } from "@/content/applications";
import { products } from "@/content/products";
import { articles } from "@/content/resources";
import { buildPageMetadata } from "@/lib/seo";
import { breadcrumbStructuredData } from "@/lib/structuredData";

export function generateStaticParams() {
  return applications.map((application) => ({ slug: application.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const application = applications.find((item) => item.slug === params.slug);

  if (!application) {
    return {};
  }

  return buildPageMetadata({
    title: application.detailPage.metadata.title,
    description: application.detailPage.metadata.description,
    path: `/applications/${application.slug}`,
    image: application.image.src,
    imageAlt: application.image.alt
  });
}

export default function ApplicationDetailPage({ params }: { params: { slug: string } }) {
  const application = applications.find((item) => item.slug === params.slug);

  if (!application) {
    notFound();
  }

  const relatedProducts = products.filter((product) =>
    application.detailPage.relatedProductSlugs.includes(product.slug)
  );
  const relatedResources = articles
    .filter((article) =>
      article.relatedApplicationSlugs.some(
        (slug) => resolveApplicationSlug(slug) === application.slug
      )
    )
    .slice(0, 3);
  const otherApplications = applications.filter((item) => item.slug !== application.slug).slice(0, 5);
  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "Applications", path: "/applications" },
    { name: application.title, path: `/applications/${application.slug}` }
  ];

  return (
    <>
      <JsonLd data={breadcrumbStructuredData(breadcrumbs)} />

      <section className="border-b border-metal-200 bg-white">
        <Container className="py-10 sm:py-12 lg:py-16">
          <Breadcrumb items={breadcrumbs} />
          <div className="mt-8 grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-14">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-industrial-700">
                {application.detailPage.eyebrow}
              </p>
              <h1 className="mt-4 text-4xl font-semibold leading-[1.08] text-navy-950 sm:text-5xl">
                {application.detailPage.h1}
              </h1>
              <p className="mt-5 text-lg leading-8 text-slate-600">
                {application.detailPage.introduction}
              </p>
              <Link
                href={`/contact?application=${application.slug}`}
                className="focus-ring mt-7 inline-flex items-center gap-2 bg-navy-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-industrial-700"
              >
                Request a Quote <span aria-hidden="true">→</span>
              </Link>
            </div>
            <div className="relative aspect-[16/9] overflow-hidden bg-navy-950">
              <Image
                src={application.image.src}
                alt={application.image.alt}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 650px"
                className="object-cover"
              />
            </div>
          </div>
        </Container>
      </section>

      <Section>
        <Container className="grid gap-12 lg:grid-cols-[0.88fr_1.12fr] lg:gap-16">
          <SectionHeading eyebrow="What Needs to Be Measured" title={application.detailPage.measurementTitle} />
          <div>
            <p className="text-lg leading-8 text-slate-600">{application.detailPage.measurementText}</p>
            <p className="mt-5 border-l-2 border-industrial-600 pl-5 text-base font-semibold leading-7 text-navy-950">
              {application.focus}
            </p>
          </div>
        </Container>
      </Section>

      <Section className="border-y border-metal-200 bg-metal-50">
        <Container>
          <SectionHeading eyebrow="Site Conditions" title="Conditions that affect meter selection" />
          <div className="mt-9 grid gap-px bg-metal-300 md:grid-cols-2">
            <ConditionCard title="Operating condition" text={application.siteCondition} />
            <ConditionCard title="Selection risk" text={application.challenge} />
          </div>
        </Container>
      </Section>

      <Section>
        <Container className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeading eyebrow="Recommended Meter Direction" title="Review suitable meter families" />
            <ul className="mt-8 divide-y divide-metal-200 border-y border-metal-200">
              {application.suitableMeters.map((meter) => {
                const product = relatedProducts.find((item) => item.name === meter);
                return (
                  <li key={meter} className="py-4 text-base font-semibold text-navy-950">
                    {product ? (
                      <Link className="focus-ring transition hover:text-industrial-700" href={`/products/${product.slug}`}>
                        {meter} <span aria-hidden="true">→</span>
                      </Link>
                    ) : (
                      meter
                    )}
                  </li>
                );
              })}
            </ul>
            <p className="mt-5 text-sm leading-6 text-slate-500">
              Final selection depends on the actual media, operating range and installation condition.
            </p>
          </div>
          <div>
            <SectionHeading eyebrow="Site Details to Prepare" title="Send the working-line information" />
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {application.detailsToSend.map((detail) => (
                <li key={detail} className="border-l-2 border-industrial-600 bg-metal-50 px-4 py-3 text-sm font-semibold text-navy-950">
                  {detail}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </Section>

      {relatedProducts.length ? (
        <Section className="border-y border-metal-200 bg-metal-50">
          <Container>
            <SectionHeading eyebrow="Related Velomac Products" title="Product directions for this application" />
            <div className="mt-9 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {relatedProducts.map((product) => (
                <article key={product.slug} className="border border-metal-200 bg-white p-6">
                  <h3 className="text-xl font-semibold text-navy-950">
                    <Link className="focus-ring transition hover:text-industrial-700" href={`/products/${product.slug}`}>
                      {product.name}
                    </Link>
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{product.shortDescription}</p>
                  <Link className="focus-ring mt-5 inline-flex text-sm font-semibold text-industrial-700" href={`/products/${product.slug}`}>
                    View product&nbsp;→
                  </Link>
                </article>
              ))}
            </div>
          </Container>
        </Section>
      ) : null}

      {relatedResources.length ? (
        <Section>
          <Container>
            <SectionHeading eyebrow="Related Resources" title="Practical notes for the application review" />
            <div className="mt-8 divide-y divide-metal-200 border-y border-metal-200">
              {relatedResources.map((article) => (
                <Link
                  key={article.slug}
                  href={`/resources/${article.slug}`}
                  className="focus-ring grid gap-2 py-5 transition hover:text-industrial-700 md:grid-cols-[0.28fr_1fr_auto] md:items-center"
                >
                  <span className="text-xs font-semibold uppercase tracking-[0.14em] text-industrial-700">{article.category}</span>
                  <span className="text-lg font-semibold text-navy-950">{article.title}</span>
                  <span className="text-sm font-semibold text-industrial-700">Read article →</span>
                </Link>
              ))}
            </div>
          </Container>
        </Section>
      ) : null}

      <section className="border-t border-metal-200 bg-white py-10 sm:py-12">
        <Container>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-industrial-700">Other Applications</p>
          <nav aria-label="Related applications" className="mt-4 flex flex-wrap gap-3">
            {otherApplications.map((item) => (
              <Link
                key={item.slug}
                href={`/applications/${item.slug}`}
                className="focus-ring border border-metal-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-industrial-600 hover:text-industrial-700"
              >
                {item.title}
              </Link>
            ))}
          </nav>
        </Container>
      </section>

      <CTASection
        title={application.detailPage.ctaTitle}
        text="Share the media, pipe size, flow range, pressure, temperature and installation details for an application review."
        href={`/contact?application=${application.slug}`}
        buttonLabel="Request a Quote"
        surfaceClassName="velomac-blue-surface"
      />
    </>
  );
}

function Breadcrumb({ items }: { items: { name: string; path: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
      {items.map((item, index) => (
        <span key={item.path} className="contents">
          {index < items.length - 1 ? (
            <Link href={item.path} className="focus-ring transition hover:text-industrial-700">{item.name}</Link>
          ) : (
            <span className="text-slate-700">{item.name}</span>
          )}
          {index < items.length - 1 ? <span aria-hidden="true">/</span> : null}
        </span>
      ))}
    </nav>
  );
}

function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="max-w-3xl">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-industrial-700">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-semibold leading-tight text-navy-950 sm:text-4xl">{title}</h2>
    </div>
  );
}

function ConditionCard({ title, text }: { title: string; text: string }) {
  return (
    <article className="bg-white p-6 sm:p-7">
      <h3 className="text-xl font-semibold text-navy-950">{title}</h3>
      <p className="mt-3 text-base leading-7 text-slate-600">{text}</p>
    </article>
  );
}
