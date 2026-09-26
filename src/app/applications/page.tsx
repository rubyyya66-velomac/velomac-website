import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Container, Section } from "@/components/Layout";
import { applications } from "@/content/applications";
import { applicationsPage } from "@/content/applicationsPage";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: applicationsPage.metadata.title,
  description: applicationsPage.metadata.description,
  path: "/applications",
  image: applications[0].image.src,
  imageAlt: applications[0].image.alt
});

export default function ApplicationsPage() {
  return (
    <>
      <section className="velomac-blue-surface text-white">
        <Container className="py-10 sm:py-16 lg:py-20">
          <div className="max-w-[1120px]">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-100">
              {applicationsPage.hero.eyebrow}
            </p>
            <h1 className="mt-4 text-[1.875rem] font-semibold leading-[1.12] tracking-normal text-white sm:text-5xl sm:leading-[1.06] lg:text-[3.2rem] xl:whitespace-nowrap xl:text-[3.45rem]">
              {applicationsPage.hero.title}
            </h1>
            <p className="mt-3 max-w-[820px] text-lg leading-8 text-blue-50 sm:mt-5 sm:text-xl">
              {applicationsPage.hero.description}
            </p>
          </div>
        </Container>
      </section>
      <Section>
        <Container className="max-w-[1180px]">
          <div className="flex flex-col gap-5 sm:gap-7 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <h2 className="text-2xl font-semibold tracking-normal text-navy-950 sm:text-4xl lg:text-[2.6rem] lg:leading-[1.08]">
                {applicationsPage.introduction.title}
              </h2>
              <p className="mt-3 max-w-[680px] text-base leading-7 text-slate-600 sm:mt-5 sm:text-lg">
                {applicationsPage.introduction.description}
              </p>
            </div>
            <nav aria-label="Application categories" className="flex max-w-[620px] flex-wrap gap-2.5">
              {applications.map((application) => (
                <Link
                  key={application.slug}
                  href={`/applications/${application.slug}`}
                  className="focus-ring rounded-full border border-metal-200/80 bg-metal-50 px-5 py-2.5 text-[15px] font-semibold text-slate-700 transition hover:border-industrial-300 hover:bg-blue-50 hover:text-industrial-700"
                >
                  {application.title}
                </Link>
              ))}
            </nav>
          </div>

          <div className="mt-7 grid gap-4 sm:mt-10 sm:gap-6 lg:grid-cols-2">
            {applications.map((application) => {
              return (
                <article
                  key={application.slug}
                  id={application.slug}
                  className="scroll-mt-28 overflow-hidden rounded-[6px] border border-metal-200 bg-white transition hover:border-industrial-500"
                >
                  <Link
                    href={`/applications/${application.slug}`}
                    className="focus-ring relative block aspect-[16/9] border-b border-metal-200 bg-navy-950"
                  >
                    <Image
                      src={application.image.src}
                      alt={application.image.alt}
                      fill
                      loading="eager"
                      sizes="(min-width: 1024px) 560px, 100vw"
                      className="object-cover"
                    />
                  </Link>
                  <div className="p-5 sm:p-7">
                    <h2 className="text-[1.65rem] font-semibold leading-tight text-navy-950">
                      <Link className="focus-ring transition hover:text-industrial-700" href={`/applications/${application.slug}`}>
                        {application.title}
                      </Link>
                    </h2>
                    <p className="mt-2 text-[15px] leading-6 text-slate-600 sm:mt-3 sm:text-base sm:leading-7">{application.cardDescription}</p>
                    <div className="mt-4 grid gap-4 sm:mt-6 sm:gap-5">
                      <DetailText title={applicationsPage.cardLabels.whereItFits} text={application.whereItFits} />
                      <TagList title={applicationsPage.cardLabels.recommendedMeters} items={application.suitableMeters} />
                      <TagList title={applicationsPage.cardLabels.siteDetails} items={application.detailsToSend} />
                    </div>
                    <Link
                      href={`/contact?application=${application.slug}`}
                      className="focus-ring mt-4 inline-flex w-fit items-center gap-2 text-[15px] font-semibold text-industrial-600 transition hover:text-navy-950 sm:mt-6"
                    >
                      {applicationsPage.cardLabels.ctaLabel}
                      <span aria-hidden="true">{">"}</span>
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="mt-7 overflow-hidden rounded-[6px] p-5 text-white velomac-blue-surface sm:mt-10 sm:p-8">
            <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-100">{applicationsPage.bottomCta.eyebrow}</p>
                <h2 className="mt-3 text-2xl font-semibold text-white">{applicationsPage.bottomCta.title}</h2>
                <p className="mt-3 max-w-3xl text-[15px] leading-7 text-blue-50">
                  {applicationsPage.bottomCta.text}
                </p>
              </div>
              <Link
                href={applicationsPage.bottomCta.buttonHref}
                className="focus-ring inline-flex w-fit gap-2 border border-white bg-white px-5 py-3 text-sm font-semibold text-navy-950 transition hover:bg-metal-100"
              >
                {applicationsPage.bottomCta.buttonLabel}
                <span aria-hidden="true">{">"}</span>
              </Link>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}

function DetailText({ title, text }: { title: string; text: string }) {
  return (
    <div>
      <h3 className="text-[13px] font-semibold uppercase tracking-[0.08em] text-navy-950">{title}</h3>
      <p className="mt-1.5 text-[15px] leading-6 text-slate-600 sm:mt-2 sm:text-base sm:leading-7">{text}</p>
    </div>
  );
}

function TagList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h3 className="text-[13px] font-semibold uppercase tracking-[0.08em] text-navy-950">{title}</h3>
      <ul className="mt-2 flex flex-wrap gap-2 text-sm leading-6 text-slate-600 sm:mt-3 sm:gap-2.5">
        {items.map((item) => (
          <li
            key={item}
            className="rounded-full border border-metal-200/60 bg-metal-50 px-3 py-1.5 text-sm font-semibold text-slate-600 sm:px-3.5 sm:py-2"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
