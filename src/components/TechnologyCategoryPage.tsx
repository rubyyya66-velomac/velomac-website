import Image from "next/image";
import Link from "next/link";
import { CTASection } from "@/components/CTASection";
import { Container, Section } from "@/components/Layout";
import { TechnologyCard } from "@/components/TechnologyCard";
import {
  getTechnologyArticlesByCategory,
  type TechnologyCategory
} from "@/content/technology";

export function TechnologyCategoryPage({ category }: { category: TechnologyCategory }) {
  const articles = getTechnologyArticlesByCategory(category.id);
  const useContain = category.image.fit === "contain";

  return (
    <>
      <section className="border-b border-metal-200 bg-white">
        <Container className="py-10 sm:py-12 lg:py-16">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
            <Link href="/" className="focus-ring rounded-sm transition hover:text-industrial-700">
              Home
            </Link>
            <span aria-hidden="true">/</span>
            <Link href="/technology" className="focus-ring rounded-sm transition hover:text-industrial-700">
              Technology
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-slate-700">{category.title}</span>
          </nav>

          <div className="mt-8 grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-14">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-industrial-700">
                {category.eyebrow}
              </p>
              <h1 className="mt-4 text-4xl font-semibold leading-[1.08] tracking-normal text-navy-950 sm:text-5xl">
                {category.title}
              </h1>
              <p className="mt-5 text-xl font-semibold leading-8 text-navy-950">
                {category.description}
              </p>
              <p className="mt-5 text-base leading-7 text-slate-600 sm:text-lg">
                {category.introduction}
              </p>
            </div>
            <div
              className={`relative aspect-[16/10] min-w-0 overflow-hidden border border-metal-200 ${
                useContain ? "bg-navy-950" : "bg-metal-100"
              }`}
            >
              <Image
                src={category.image.src}
                alt={category.image.alt}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 620px"
                className={useContain ? "object-contain" : "object-cover"}
              />
            </div>
          </div>
        </Container>
      </section>

      <Section>
        <Container>
          <div className="grid gap-6 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-industrial-700">
                Current Work
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-normal text-navy-950 sm:text-4xl">
                Development Cases
              </h2>
            </div>
            <p className="max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
              Each case focuses on the operating problem, the engineering approach and the confirmed
              information needed to judge its application value.
            </p>
          </div>

          <div className="mt-10 grid items-stretch gap-6 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <TechnologyCard key={article.slug} article={article} />
            ))}
          </div>
        </Container>
      </Section>

      <CTASection
        title="Discuss the operating condition behind the measurement."
        text="Share the medium, flow range, pressure, temperature, pipe size, vibration and installation details for a technical review."
        buttonLabel="Request a Quote"
        href="/contact"
        surfaceClassName="bg-industrial-700"
      />
    </>
  );
}
