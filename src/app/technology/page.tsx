import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CTASection } from "@/components/CTASection";
import { Container, Section } from "@/components/Layout";
import { TechnologyCard } from "@/components/TechnologyCard";
import { TechnologySubnav } from "@/components/TechnologySubnav";
import { buildPageMetadata } from "@/lib/seo";
import {
  technologyContent,
  getTechnologyArticle,
  getTechnologyArticlesByCategory
} from "@/content/technology";

export const metadata: Metadata = buildPageMetadata({
  title: technologyContent.metadata.title,
  description: technologyContent.metadata.description,
  path: "/technology",
  image: technologyContent.hero.image.src,
  imageAlt: technologyContent.hero.image.alt
});

export default function TechnologyPage() {
  const { hero } = technologyContent;
  const overview = technologyContent.overviewSections;
  const sensorArticles = getTechnologyArticlesByCategory("product-sensor-innovation");
  const vibrationArticle = getTechnologyArticle("vibration-measurement-test-system")!;
  const upgradeArticle = getTechnologyArticle("smart-vortex-upgrade-chemical-pharmaceutical")!;

  return (
    <>
      <TechnologySubnav />

      <section className="border-b border-metal-200 bg-white">
        <Container className="grid gap-10 py-12 sm:py-14 lg:grid-cols-[0.88fr_1.12fr] lg:items-center lg:gap-14 lg:py-16">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-industrial-700">
              {hero.eyebrow}
            </p>
            <h1 className="mt-4 text-4xl font-semibold leading-[1.06] tracking-normal text-navy-950 sm:text-5xl lg:text-6xl">
              {hero.title}
            </h1>
            <p className="mt-5 text-xl font-semibold leading-8 text-navy-950 sm:text-2xl">
              {hero.description}
            </p>
            <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
              {hero.supportingText}
            </p>
          </div>
          <div className="relative aspect-[16/10] w-full min-w-0 overflow-hidden bg-metal-50">
            <Image
              src={hero.image.src}
              alt={hero.image.alt}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 640px"
              className={hero.image.fit === "contain" ? "object-contain" : "object-cover object-center"}
            />
          </div>
        </Container>
      </section>

      <Section
        id="sensor-product-development"
        className="scroll-mt-32 border-b border-metal-200 bg-white lg:scroll-mt-44"
      >
        <Container>
          <TechnologySectionHeading
            number={overview.sensor.number}
            eyebrow={overview.sensor.eyebrow}
            title={overview.sensor.title}
            description={overview.sensor.description}
          />
          <div className="mt-11 grid items-stretch gap-6 md:grid-cols-2 lg:grid-cols-3">
            {sensorArticles.map((article) => (
              <TechnologyCard key={article.slug} article={article} showCategoryLabel={false} />
            ))}
          </div>
        </Container>
      </Section>

      <Section
        id="flow-calibration-systems"
        className="scroll-mt-32 border-b border-metal-200 bg-[#eef3f8] lg:scroll-mt-44"
      >
        <Container>
          <TechnologySectionHeading
            number={overview.calibration.number}
            eyebrow={overview.calibration.eyebrow}
            title={overview.calibration.title}
            description={overview.calibration.description}
          />

          <div className="mt-11 border-y border-blue-200 bg-white lg:grid lg:grid-cols-3">
            {overview.calibration.methods.map((calibration, index) => (
              <article
                key={calibration.code}
                className={`flex min-w-0 flex-col py-7 sm:py-8 lg:px-7 ${
                  index > 0
                    ? "border-t border-blue-100 lg:border-l lg:border-t-0"
                    : ""
                } ${index === 0 ? "lg:pr-7" : ""} ${index === 2 ? "lg:pl-7" : ""}`}
              >
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-metal-100">
                  <Image
                    src={calibration.image.src}
                    alt={calibration.image.alt}
                    fill
                    priority={calibration.code === "02"}
                    sizes="(min-width: 1024px) 370px, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col pt-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-industrial-700">
                    Method {calibration.code}
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold leading-8 text-navy-950 lg:min-h-16">
                    {calibration.title}
                  </h3>
                  <dl className="mt-6 grid grid-cols-2 border-y border-metal-200">
                    <div className="py-4 pr-4">
                      <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                        Medium
                      </dt>
                      <dd className="mt-1 text-lg font-semibold text-navy-950">{calibration.medium}</dd>
                    </div>
                    <div className="border-l border-metal-200 py-4 pl-4">
                      <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                        Accuracy Class
                      </dt>
                      <dd className="mt-1 text-xl font-semibold text-navy-950">{calibration.meterClass}</dd>
                    </div>
                  </dl>
                  <p className="mt-5 text-[15px] leading-7 text-slate-600">
                    {calibration.description}
                  </p>

                  <Link
                    href={calibration.href}
                    className="focus-ring mt-auto inline-flex w-fit items-center gap-2 pt-7 text-sm font-semibold text-industrial-700 transition hover:text-navy-950"
                  >
                    {calibration.linkLabel}
                    <span aria-hidden="true">{">"}</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </Section>

      <Section
        id="testing-verification-systems"
        className="scroll-mt-32 border-b border-navy-800 bg-navy-950 text-white lg:scroll-mt-44"
      >
        <Container>
          <TechnologySectionHeading
            number={overview.testing.number}
            eyebrow={overview.testing.eyebrow}
            title={overview.testing.title}
            description={overview.testing.description}
            href="/technology/testing-calibration-systems"
            linkLabel="View testing system overview"
            dark
          />

          <div className="mt-9 grid gap-9 lg:grid-cols-[1.65fr_0.85fr] lg:items-center lg:gap-10">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="relative aspect-[16/10] min-w-0 overflow-hidden bg-white/5">
                <Image
                  src={overview.testing.images[0].src}
                  alt={overview.testing.images[0].alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 34vw, 360px"
                  className="object-cover"
                />
              </div>
              <div className="relative aspect-[16/10] min-w-0 overflow-hidden border border-white/15 bg-white">
                <Image
                  src={overview.testing.images[1].src}
                  alt={overview.testing.images[1].alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 34vw, 360px"
                  className="object-cover"
                />
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-200">
                {overview.testing.capabilityEyebrow}
              </p>
              <h3 className="mt-3 text-2xl font-semibold leading-8 text-white sm:text-3xl">
                {overview.testing.capabilityTitle}
              </h3>
              <ul className="mt-7 grid gap-3">
                {overview.testing.capabilities.map((item) => (
                  <li
                    key={item}
                    className="border-l-2 border-blue-400 pl-4 text-sm font-semibold leading-6 text-blue-50"
                  >
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href={`/technology/${vibrationArticle.slug}`}
                className="focus-ring mt-7 inline-flex w-fit items-center gap-2 text-sm font-semibold text-blue-200 transition hover:text-white"
              >
                {overview.testing.linkLabel}
                <span aria-hidden="true">{">"}</span>
              </Link>
            </div>
          </div>
        </Container>
      </Section>

      <Section
        id="application-upgrade-projects"
        className="scroll-mt-32 border-b border-metal-200 bg-metal-50 lg:scroll-mt-44"
      >
        <Container>
          <TechnologySectionHeading
            number={overview.upgrade.number}
            eyebrow={overview.upgrade.eyebrow}
            title={overview.upgrade.title}
            description={overview.upgrade.description}
            href="/technology/application-upgrade-projects"
            linkLabel="View upgrade project overview"
          />

          <article className="mt-11 grid overflow-hidden border-y border-metal-200 bg-white lg:grid-cols-[1.08fr_0.92fr]">
            <div className="relative aspect-[16/10] min-w-0 bg-navy-950 lg:aspect-auto lg:min-h-[470px]">
              <Image
                src={upgradeArticle.image.src}
                alt={upgradeArticle.image.alt}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 680px"
                className="object-cover"
              />
            </div>
            <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-12">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-industrial-700">
                {overview.upgrade.featureEyebrow}
              </p>
              <h3 className="mt-3 text-2xl font-semibold leading-8 text-navy-950 sm:text-3xl">
                {upgradeArticle.title}
              </h3>
              <ul className="mt-7 grid gap-4 text-sm font-semibold leading-6 text-navy-950">
                {overview.upgrade.points.map((point) => (
                  <li key={point} className="border-l-2 border-industrial-600 pl-4">{point}</li>
                ))}
              </ul>
              <Link
                href={`/technology/${upgradeArticle.slug}`}
                className="focus-ring mt-8 inline-flex w-fit items-center gap-2 text-sm font-semibold text-industrial-700 transition hover:text-navy-950"
              >
                {overview.upgrade.linkLabel}
                <span aria-hidden="true">{">"}</span>
              </Link>
            </div>
          </article>
        </Container>
      </Section>

      <CTASection
        title={overview.cta.title}
        text={overview.cta.text}
        detailChips={overview.cta.detailChips}
        surfaceClassName="bg-industrial-700"
      />
    </>
  );
}

function TechnologySectionHeading({
  number,
  eyebrow,
  title,
  description,
  href,
  linkLabel,
  dark = false
}: {
  number: string;
  eyebrow: string;
  title: string;
  description: string;
  href?: string;
  linkLabel?: string;
  dark?: boolean;
}) {
  return (
    <div className="grid gap-5 sm:grid-cols-[92px_1fr] lg:grid-cols-[108px_1fr] lg:gap-8">
      <p
        className={`text-5xl font-semibold leading-none sm:text-6xl ${
          dark ? "text-blue-300/55" : "text-industrial-200"
        }`}
        aria-hidden="true"
      >
        {number}
      </p>
      <div className={`max-w-3xl border-l-2 pl-5 sm:pl-7 ${dark ? "border-blue-400" : "border-industrial-600"}`}>
        <p
          className={`text-xs font-semibold uppercase tracking-[0.16em] ${
            dark ? "text-blue-200" : "text-industrial-700"
          }`}
        >
          {eyebrow}
        </p>
        <h2 className={`mt-2 text-3xl font-semibold tracking-normal sm:text-4xl ${dark ? "text-white" : "text-navy-950"}`}>
          {title}
        </h2>
        <p className={`mt-4 text-base leading-7 sm:text-lg ${dark ? "text-slate-300" : "text-slate-600"}`}>
          {description}
        </p>
        {href && linkLabel ? (
          <Link
            href={href}
            className={`focus-ring mt-5 inline-flex items-center gap-2 text-sm font-semibold transition ${
              dark ? "text-blue-200 hover:text-white" : "text-industrial-700 hover:text-navy-950"
            }`}
          >
            {linkLabel} <span aria-hidden="true">→</span>
          </Link>
        ) : null}
      </div>
    </div>
  );
}
