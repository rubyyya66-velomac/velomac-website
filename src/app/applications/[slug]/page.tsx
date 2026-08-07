import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container, Section } from "@/components/Layout";
import { applications, getApplicationBySlug } from "@/content/applications";
import { products } from "@/content/products";
import { articles } from "@/content/resources";
import { absoluteUrl } from "@/lib/seo";

export function generateStaticParams() {
  return applications.map((application) => ({ slug: application.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const application = getApplicationBySlug(params.slug);

  if (!application) {
    return {};
  }

  const canonicalPath = `/applications/${application.slug}`;
  const description = `${application.cardDescription} Review site conditions, meter direction and details to prepare with Velomac.`;

  return {
    title: `${application.title} Flowmeter Selection | Velomac`,
    description,
    alternates: {
      canonical: canonicalPath
    },
    openGraph: {
      title: `${application.title} Flowmeter Selection | Velomac`,
      description,
      url: canonicalPath,
      images: [
        {
          url: application.image.src,
          alt: application.image.alt
        }
      ]
    }
  };
}

export default function ApplicationDetailPage({ params }: { params: { slug: string } }) {
  const application = getApplicationBySlug(params.slug);

  if (!application) {
    notFound();
  }

  const relatedProducts = products
    .filter((product) => product.relatedApplicationSlugs?.includes(application.slug))
    .slice(0, 4);
  const relatedArticles = articles
    .filter((article) => article.relatedApplicationSlugs.includes(application.slug))
    .slice(0, 3);
  const relatedApplications = getRelatedApplications(
    application.slug,
    relatedProducts.map((product) => product.slug)
  );
  const applicationUrl = `/applications/${application.slug}`;
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: absoluteUrl("/")
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Applications",
        item: absoluteUrl("/applications")
      },
      {
        "@type": "ListItem",
        position: 3,
        name: application.title,
        item: absoluteUrl(applicationUrl)
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema).replace(/</g, "\\u003c") }}
      />

      <section className="velomac-blue-surface text-white">
        <Container className="grid gap-10 py-14 sm:py-16 lg:grid-cols-[1fr_0.78fr] lg:items-center lg:py-20">
          <div className="max-w-3xl">
            <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-blue-100">
              <Link href="/" className="focus-ring rounded-sm transition hover:text-white">
                Home
              </Link>
              <span aria-hidden="true">/</span>
              <Link href="/applications" className="focus-ring rounded-sm transition hover:text-white">
                Applications
              </Link>
              <span aria-hidden="true">/</span>
              <span aria-current="page" className="text-white">
                {application.title}
              </span>
            </nav>
            <p className="mt-8 text-xs font-semibold uppercase tracking-[0.18em] text-blue-100">
              APPLICATION REVIEW
            </p>
            <h1 className="mt-4 text-4xl font-semibold leading-[1.06] tracking-normal text-white sm:text-5xl lg:text-[3.45rem]">
              {application.title}
            </h1>
            <p className="mt-5 max-w-[760px] text-lg leading-8 text-blue-50 sm:text-xl">
              {application.focus}
            </p>
          </div>
          <div className="relative overflow-hidden rounded-[6px] border border-white/20 bg-navy-950">
            <Image
              src={application.image.src}
              alt={application.image.alt}
              width={840}
              height={630}
              priority
              className="aspect-[4/3] w-full object-cover"
            />
          </div>
        </Container>
      </section>

      <Section>
        <Container className="grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:gap-16">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-industrial-700">
              Application / Operating Condition
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-normal text-navy-950 sm:text-4xl">
              Start With the Real Process Condition
            </h2>
            <p className="mt-5 text-base leading-7 text-slate-600 sm:text-lg">
              {application.cardDescription}
            </p>
            <p className="mt-4 text-base leading-7 text-slate-600">{application.whereItFits}</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <InformationBlock title="What needs to be measured" text={application.focus} />
            <InformationBlock
              title="Site conditions that affect selection"
              text={application.siteCondition}
            />
          </div>
        </Container>
      </Section>

      <Section className="bg-metal-50">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:gap-16">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-industrial-700">
                Recommended Meter Direction
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-normal text-navy-950 sm:text-4xl">
                Compare the Meter With the Site
              </h2>
              <p className="mt-5 text-base leading-7 text-slate-600 sm:text-lg">{application.challenge}</p>
              <ul className="mt-7 flex flex-wrap gap-2.5" aria-label="Suitable meter directions">
                {application.suitableMeters.map((meter) => (
                  <li
                    key={meter}
                    className="rounded-full border border-metal-200 bg-white px-4 py-2 text-sm font-semibold text-navy-950"
                  >
                    {meter}
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {relatedProducts.map((product) => (
                <Link
                  key={product.slug}
                  href={`/products/${product.slug}`}
                  className="focus-ring group flex min-h-44 flex-col justify-between rounded-[6px] border border-metal-200 bg-white p-5 transition hover:border-industrial-500"
                >
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-industrial-700">
                      Related Product
                    </p>
                    <h3 className="mt-3 text-xl font-semibold text-navy-950">{product.name}</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{product.shortDescription}</p>
                  </div>
                  <span className="mt-5 text-sm font-semibold text-industrial-700 transition group-hover:text-navy-950">
                    View product {">"}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <Section>
        <Container className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-industrial-700">
              Site Details to Prepare
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-normal text-navy-950 sm:text-4xl">
              Prepare the Application Context
            </h2>
            <p className="mt-5 text-base leading-7 text-slate-600">
              These details give the selection review a practical starting point before configuration and quotation.
            </p>
          </div>
          <ol className="grid gap-3 sm:grid-cols-2">
            {application.detailsToSend.map((detail, index) => (
              <li key={detail} className="flex items-center gap-4 border-l-2 border-industrial-600 bg-metal-50 px-5 py-4">
                <span className="text-xs font-semibold tracking-[0.12em] text-industrial-700">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="font-semibold text-navy-950">{detail}</span>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      {relatedArticles.length ? (
        <Section className="bg-metal-50">
          <Container>
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-industrial-700">
                Related Resources
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-normal text-navy-950 sm:text-4xl">
                Practical Notes for This Application
              </h2>
            </div>
            <div className="mt-8 divide-y divide-metal-200 border-y border-metal-200">
              {relatedArticles.map((article) => (
                <Link
                  key={article.slug}
                  href={`/resources/${article.slug}`}
                  className="focus-ring grid gap-2 py-5 transition hover:text-industrial-700 md:grid-cols-[0.26fr_1fr_auto] md:items-center"
                >
                  <span className="text-xs font-semibold uppercase tracking-[0.16em] text-industrial-700">
                    {article.category}
                  </span>
                  <span className="text-lg font-semibold text-navy-950">{article.title}</span>
                  <span className="text-sm font-semibold text-industrial-700">Read article {">"}</span>
                </Link>
              ))}
            </div>
          </Container>
        </Section>
      ) : null}

      <Section>
        <Container>
          <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-start lg:gap-16">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-industrial-700">
                Related Applications
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-normal text-navy-950">
                Continue the Site Review
              </h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {relatedApplications.map((item) => (
                <Link
                  key={item.slug}
                  href={`/applications/${item.slug}`}
                  className="focus-ring flex min-h-28 items-end border border-metal-200 p-5 text-base font-semibold text-navy-950 transition hover:border-industrial-500 hover:text-industrial-700"
                >
                  {item.title}
                </Link>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <section className="velomac-blue-surface text-white">
        <Container className="grid gap-7 py-12 sm:py-14 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-100">APPLICATION SUPPORT</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">Discuss This Application</h2>
            <p className="mt-3 max-w-3xl text-base leading-7 text-blue-50">
              Send the available site details so Velomac can review the operating condition before meter selection.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href={`/contact?application=${application.slug}`}
              className="focus-ring inline-flex items-center justify-center gap-2 bg-white px-5 py-3 text-sm font-semibold text-navy-950 transition hover:bg-metal-100"
            >
              Discuss This Application
              <span aria-hidden="true">{">"}</span>
            </Link>
            <Link
              href="/contact"
              className="focus-ring inline-flex items-center justify-center border border-white/60 px-5 py-3 text-sm font-semibold text-white transition hover:border-white hover:bg-white/10"
            >
              Request a Quote
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}

function InformationBlock({ title, text }: { title: string; text: string }) {
  return (
    <div className="border-t-2 border-industrial-600 bg-metal-50 p-6">
      <h2 className="text-lg font-semibold text-navy-950">{title}</h2>
      <p className="mt-3 text-[15px] leading-7 text-slate-600">{text}</p>
    </div>
  );
}

function getRelatedApplications(currentSlug: string, relatedProductSlugs: string[]) {
  const ranked = applications
    .filter((application) => application.slug !== currentSlug)
    .map((application) => {
      const sharedProducts = products.filter(
        (product) =>
          relatedProductSlugs.includes(product.slug) &&
          product.relatedApplicationSlugs?.includes(application.slug)
      ).length;

      return { application, sharedProducts };
    })
    .sort((a, b) => b.sharedProducts - a.sharedProducts);

  return ranked.slice(0, 3).map(({ application }) => application);
}
