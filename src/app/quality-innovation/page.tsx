import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Container, Section } from "@/components/Layout";
import type { QualityDocumentGroup } from "@/content/qualityInnovation";
import { qualityInnovationContent } from "@/content/qualityInnovation";

export const metadata: Metadata = {
  title: qualityInnovationContent.metadata.title,
  description: qualityInnovationContent.metadata.description,
  alternates: {
    canonical: "/quality-innovation"
  },
  openGraph: {
    title: qualityInnovationContent.metadata.title,
    description: qualityInnovationContent.metadata.description,
    url: "/quality-innovation",
    images: [
      {
        url: qualityInnovationContent.hero.image.src,
        alt: qualityInnovationContent.hero.image.alt
      }
    ]
  }
};

export default function QualityInnovationPage() {
  const {
    hero,
    trustFoundations,
    standardsSection,
    documentGroups,
    patentsSection,
    technicalAreas,
    patents,
    cta
  } = qualityInnovationContent;

  return (
    <>
      <section className="border-b border-metal-200 bg-white">
        <Container className="grid gap-9 py-12 sm:py-14 lg:grid-cols-[0.88fr_1.12fr] lg:items-center lg:gap-14 lg:py-16">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-industrial-700">
              {hero.eyebrow}
            </p>
            <h1 className="mt-4 text-4xl font-semibold leading-[1.08] tracking-normal text-navy-950 sm:text-5xl">
              {hero.headline}
            </h1>
            <p className="mt-5 text-base leading-7 text-slate-600 sm:text-lg">{hero.description}</p>
          </div>
          <div className="relative aspect-[16/11] w-full overflow-hidden rounded-[4px] bg-metal-100">
            <Image
              src={hero.image.src}
              alt={hero.image.alt}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 620px"
              className="object-cover object-[center_58%]"
            />
          </div>
        </Container>
      </section>

      <section className="border-b border-metal-200 bg-metal-50">
        <Container>
          <div className="grid md:grid-cols-3">
            {trustFoundations.map((foundation, index) => (
              <article
                key={foundation.title}
                className={`py-9 md:px-8 md:py-10 ${index > 0 ? "border-t border-metal-200 md:border-l md:border-t-0" : ""}`}
              >
                <h2 className="text-xl font-semibold text-navy-950">{foundation.title}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">{foundation.text}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <Section>
        <Container>
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-industrial-700">
              {standardsSection.eyebrow}
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-normal text-navy-950 sm:text-4xl">
              {standardsSection.headline}
            </h2>
            <p className="mt-5 text-base leading-7 text-slate-600 sm:text-lg">{standardsSection.description}</p>
          </div>

          <div className="mt-12 space-y-14">
            {documentGroups.map((group) => (
              <CertificateGroup key={group.id} group={group} />
            ))}
          </div>

          <p className="mt-12 border-t border-metal-200 pt-6 text-sm leading-6 text-slate-500">
            {standardsSection.note}
          </p>
        </Container>
      </Section>

      <section className="bg-navy-950 py-[var(--editable-section-spacing-mobile)] text-white sm:py-[var(--editable-section-spacing-tablet)] lg:py-[var(--editable-section-spacing-desktop)]">
        <Container>
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-200">
              {patentsSection.eyebrow}
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-normal text-white sm:text-4xl">
              {patentsSection.headline}
            </h2>
            <p className="mt-5 text-base leading-7 text-slate-300 sm:text-lg">{patentsSection.description}</p>
          </div>

          <div className="mt-12 grid gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-24">
            <div>
              <p className="text-[72px] font-semibold leading-none text-white sm:text-[92px] lg:text-[112px]">
                {patentsSection.count}
              </p>
              <p className="mt-3 text-sm font-semibold uppercase tracking-[0.16em] text-blue-200">
                {patentsSection.countLabel}
              </p>
              <p className="mt-6 max-w-sm text-sm leading-6 text-slate-300">{patentsSection.countDescription}</p>
            </div>

            <div className="space-y-8">
              {technicalAreas.map((area) => (
                <article key={area.title} className="grid gap-2 sm:grid-cols-[0.52fr_1fr] sm:gap-10">
                  <h3 className="text-base font-semibold leading-6 text-white">{area.title}</h3>
                  <p className="text-sm leading-6 text-slate-300">{area.description}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="mt-16">
            <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-200">
              {patentsSection.entriesHeadline}
            </h3>
            <div className="mt-7 grid gap-x-12 gap-y-9 md:grid-cols-3">
              {patents.map((patent) => (
                <article key={patent.publicationNumber} className="grid grid-cols-[112px_1fr] items-start gap-5 md:block">
                  <div className="relative h-[158px] w-[112px] overflow-hidden rounded-[3px] border border-white/15 bg-white md:h-[212px] md:w-[150px]">
                    <Image
                      src={patent.thumbnail}
                      alt={patent.alt}
                      fill
                      sizes="(max-width: 767px) 112px, 150px"
                      className="object-contain"
                    />
                  </div>
                  <div className="md:mt-5">
                    <h4 className="text-base font-semibold leading-6 text-white">{patent.title}</h4>
                    <p className="mt-3 text-sm font-semibold text-blue-200">{patent.publicationNumber}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-industrial-700 py-12 text-white sm:py-14">
        <Container className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <h2 className="text-3xl font-semibold text-white">{cta.headline}</h2>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-blue-50">{cta.description}</p>
          </div>
          <Link
            href={cta.href}
            className="focus-ring inline-flex w-fit items-center gap-2 border border-white bg-white px-5 py-3 text-sm font-semibold text-navy-950 transition hover:bg-metal-100"
          >
            {cta.buttonLabel}
            <span aria-hidden="true">{">"}</span>
          </Link>
        </Container>
      </section>
    </>
  );
}

function CertificateGroup({ group }: { group: QualityDocumentGroup }) {
  const isManagementGroup = group.id === "management-systems";

  return (
    <section aria-labelledby={`document-group-${group.id}`}>
      <div className="border-b border-metal-200 pb-4">
        <h3 id={`document-group-${group.id}`} className="text-xl font-semibold text-navy-950">
          {group.title}
        </h3>
      </div>
      <div
        className={`mt-6 grid grid-cols-2 gap-x-5 gap-y-8 ${
          isManagementGroup ? "sm:grid-cols-3" : "sm:grid-cols-2 lg:grid-cols-4"
        }`}
      >
        {group.documents.map((document) => (
          <figure key={document.id} className="min-w-0">
            <div className="flex h-[190px] items-center justify-center bg-metal-50 p-4 sm:h-[220px]">
              <div className="relative h-full w-full max-w-[160px]">
                <Image
                  src={document.thumbnail}
                  alt={document.alt}
                  fill
                  sizes="(max-width: 640px) 42vw, 160px"
                  className="object-contain"
                />
              </div>
            </div>
            <figcaption className="mt-3 text-sm font-semibold leading-5 text-navy-950">{document.title}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
