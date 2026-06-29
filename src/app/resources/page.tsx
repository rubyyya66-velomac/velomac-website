import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CTASection } from "@/components/CTASection";
import { Container, Section } from "@/components/Layout";
import { articles, resourceCategories } from "@/content/resources";

export const metadata: Metadata = {
  title: "Flow Measurement Resources | Velomac Flow Meter",
  description:
    "Practical flow measurement resources for selecting flowmeters by media, site conditions and industrial utility systems.",
  openGraph: {
    title: "Flow Measurement Resources | Velomac Flow Meter",
    description:
      "Practical notes for selecting flowmeters by media, site conditions and industrial utility systems.",
    images: [articles[0]?.coverImage || "/images/applications/quote-support.png"]
  }
};

export default function ResourcesPage() {
  const featured = articles.find((article) => article.slug === "flowmeter-quote-site-details") || articles[0];
  const articleCards = articles.filter((article) => article.slug !== featured.slug);

  return (
    <>
      <section className="velomac-blue-surface text-white">
        <Container className="py-14 sm:py-16 lg:py-20">
          <div className="max-w-4xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-100">RESOURCES</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-normal text-white sm:text-5xl lg:text-6xl">
              Flow Measurement Resources
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-blue-50 sm:text-xl">
              Practical notes for selecting flowmeters by media, site conditions and industrial utility systems.
            </p>
          </div>
        </Container>
      </section>

      <Section>
        <Container>
          <article className="grid overflow-hidden rounded-[6px] border border-metal-200 bg-white lg:grid-cols-[1.05fr_0.95fr]">
            <Link href={`/resources/${featured.slug}`} className="focus-ring relative min-h-[280px] bg-navy-950 sm:min-h-[360px]">
              <Image
                src={featured.coverImage}
                alt={featured.coverAlt}
                fill
                sizes="(min-width: 1024px) 620px, 100vw"
                className="object-cover"
                priority
              />
            </Link>
            <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-industrial-700">
                Featured article
              </p>
              <p className="mt-5 text-sm font-semibold text-slate-500">{featured.category}</p>
              <h2 className="mt-3 text-3xl font-semibold leading-tight text-navy-950 sm:text-4xl">
                {featured.title}
              </h2>
              <p className="mt-5 text-base leading-7 text-slate-600 sm:text-lg">{featured.summary}</p>
              <Link
                href={`/resources/${featured.slug}`}
                className="focus-ring mt-7 inline-flex w-fit items-center gap-2 text-sm font-semibold text-industrial-700 transition hover:text-navy-950"
              >
                Read article
                <span aria-hidden="true">{">"}</span>
              </Link>
            </div>
          </article>

          <div className="mt-10 flex flex-wrap gap-2.5">
            {resourceCategories.map((category) => (
              <span
                key={category}
                className="rounded-full border border-metal-200/80 bg-metal-50 px-4 py-2 text-sm font-semibold text-slate-700"
              >
                {category}
              </span>
            ))}
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {articleCards.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
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

function ArticleCard({ article }: { article: (typeof articles)[number] }) {
  return (
    <article className="flex min-h-full flex-col overflow-hidden rounded-[6px] border border-metal-200 bg-white transition hover:border-industrial-500">
      <Link href={`/resources/${article.slug}`} className="focus-ring relative block aspect-[16/9] bg-navy-950">
        <Image
          src={article.coverImage}
          alt={article.coverAlt}
          fill
          sizes="(min-width: 1024px) 370px, (min-width: 768px) 50vw, 100vw"
          className="object-cover"
        />
      </Link>
      <div className="flex flex-1 flex-col p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-industrial-700">{article.category}</p>
        <h2 className="mt-3 text-[1.35rem] font-semibold leading-snug text-navy-950">{article.title}</h2>
        <p className="mt-3 text-[15px] leading-7 text-slate-600">{article.summary}</p>
        <Link
          href={`/resources/${article.slug}`}
          className="focus-ring mt-auto inline-flex items-center gap-2 pt-6 text-sm font-semibold text-industrial-700 transition hover:text-navy-950"
        >
          Read article
          <span aria-hidden="true">{">"}</span>
        </Link>
      </div>
    </article>
  );
}
