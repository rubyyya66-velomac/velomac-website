import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Container, Section } from "@/components/Layout";
import { aboutContent } from "@/content/about";

export const metadata: Metadata = {
  title: aboutContent.metadata.title,
  description: aboutContent.metadata.description
};

export default function AboutPage() {
  const { hero, companyProfile, processContext, capabilities, calibration, finalCta } = aboutContent;

  return (
    <>
      <section className="border-b border-metal-200 bg-gradient-to-br from-white via-white to-blue-50/70">
        <Container className="grid gap-9 py-12 sm:py-14 lg:grid-cols-[0.68fr_1.32fr] lg:items-center lg:py-16">
          <div className="max-w-lg">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-industrial-700">{hero.label}</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-normal text-navy-950 sm:text-[2.75rem] sm:leading-[1.08] lg:text-[3rem]">
              {hero.headline}
            </h1>
            <p className="mt-5 text-base leading-7 text-slate-600 sm:text-lg">
              {hero.description}
            </p>
            <p className="mt-4 text-base leading-7 text-slate-600">{hero.timelineLine}</p>
            <Link
              href={hero.ctaHref}
              className="focus-ring mt-7 inline-flex w-fit items-center gap-2 bg-navy-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-industrial-700"
            >
              {hero.ctaLabel}
              <span aria-hidden="true">{">"}</span>
            </Link>
          </div>
          <div className="overflow-hidden rounded-[6px] bg-white">
            <Image
              src={hero.image.src}
              alt={hero.image.alt}
              width={hero.image.width}
              height={hero.image.height}
              priority
              className="aspect-[16/9] min-h-[300px] w-full object-cover object-center sm:min-h-[360px] lg:min-h-[430px]"
            />
          </div>
        </Container>
      </section>

      <Section>
        <Container>
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-industrial-700">{companyProfile.label}</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-normal text-navy-950 sm:text-4xl">
              {companyProfile.headline}
            </h2>
            <p className="mt-5 text-base leading-7 text-slate-600 sm:text-lg">
              {companyProfile.description}
            </p>
          </div>
          <div className="mt-9 grid gap-x-7 gap-y-6 border-t border-metal-200 pt-8 sm:grid-cols-2 lg:grid-cols-6">
            {companyProfile.stats.map((fact) => (
              <div key={fact.label}>
                <p className="text-2xl font-semibold text-navy-950 sm:text-3xl">{fact.value}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{fact.label}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="border-y border-metal-200 bg-metal-50">
        <Container className="grid gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
          <div className="overflow-hidden rounded-[6px] bg-white">
            <Image
              src={processContext.image.src}
              alt={processContext.image.alt}
              width={processContext.image.width}
              height={processContext.image.height}
              className="aspect-[21/9] w-full object-cover object-center"
            />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-industrial-700">{processContext.label}</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-normal text-navy-950 sm:text-4xl">
              {processContext.headline}
            </h2>
            <p className="mt-5 text-base leading-7 text-slate-600 sm:text-lg">
              {processContext.description}
            </p>
          </div>
        </Container>
      </Section>

      <Section>
        <Container className="grid gap-10 lg:grid-cols-[0.84fr_1.16fr] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-industrial-700">{capabilities.label}</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-normal text-navy-950 sm:text-4xl">
              {capabilities.headline}
            </h2>
            <p className="mt-5 text-base leading-7 text-slate-600 sm:text-lg">
              {capabilities.intro}
            </p>
            <div className="mt-7 divide-y divide-metal-200">
              {capabilities.points.map((item) => (
                <article key={item.title} className="grid gap-2 py-4 md:grid-cols-[0.36fr_1fr]">
                  <h3 className="text-base font-semibold text-navy-950">{item.title}</h3>
                  <p className="text-sm leading-6 text-slate-600">{item.text}</p>
                </article>
              ))}
            </div>
          </div>
          <div className="overflow-hidden rounded-[6px] bg-metal-50">
            <Image
              src={capabilities.image.src}
              alt={capabilities.image.alt}
              width={capabilities.image.width}
              height={capabilities.image.height}
              className="aspect-[4/3] w-full object-cover"
            />
          </div>
        </Container>
      </Section>

      <Section className="bg-metal-50">
        <Container className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="overflow-hidden rounded-[6px] bg-white">
            <Image
              src={calibration.image.src}
              alt={calibration.image.alt}
              width={calibration.image.width}
              height={calibration.image.height}
              className="h-auto w-full object-contain"
            />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-industrial-700">{calibration.label}</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-normal text-navy-950 sm:text-4xl">
              {calibration.headline}
            </h2>
            <p className="mt-5 text-base leading-7 text-slate-600 sm:text-lg">
              {calibration.description}
            </p>
            <div className="mt-7 divide-y divide-metal-200 bg-white">
              {calibration.standards.map((standard) => (
                <div key={standard.title} className="py-4">
                  <h3 className="text-base font-semibold text-navy-950">{standard.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{standard.text}</p>
                </div>
              ))}
            </div>
            <Link
              href="/quality-innovation"
              className="focus-ring mt-7 inline-flex w-fit items-center gap-2 text-sm font-semibold text-industrial-700 transition hover:text-navy-950"
            >
              Explore Quality &amp; Innovation
              <span aria-hidden="true">{">"}</span>
            </Link>
          </div>
        </Container>
      </Section>

      <section className="bg-industrial-700 py-12 text-white sm:py-14">
        <Container className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-200">{finalCta.label}</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">{finalCta.headline}</h2>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-300">
              {finalCta.text}
            </p>
          </div>
          <Link
            href={finalCta.href}
            className="focus-ring inline-flex w-fit items-center gap-2 border border-white bg-white px-5 py-3 text-sm font-semibold text-navy-950 transition hover:bg-metal-100"
          >
            {finalCta.buttonLabel}
            <span aria-hidden="true">{">"}</span>
          </Link>
        </Container>
      </section>
    </>
  );
}
