import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { Container, Section } from "@/components/Layout";
import type { TechnologyArticle } from "@/content/technology";
import type {
  TechnologyDetailFact,
  TechnologyDetailModule,
  TechnologyDetailPageContent
} from "@/content/technologyDetailPages";

type CalibrationSlug =
  | "gas-flow-calibration"
  | "master-meter-liquid-calibration"
  | "gravimetric-liquid-calibration"
  | "liquid-flow-calibration-bench";

type RelatedLink = {
  label: string;
  href: string;
};

const heroAspectRatios: Record<CalibrationSlug, string> = {
  "gas-flow-calibration": "2200 / 733",
  "master-meter-liquid-calibration": "2200 / 825",
  "gravimetric-liquid-calibration": "1800 / 1311",
  "liquid-flow-calibration-bench": "1408 / 1117"
};

export function FlowCalibrationDetailPage({
  article,
  page
}: {
  article: TechnologyArticle;
  page: TechnologyDetailPageContent;
}) {
  const slug = article.slug as CalibrationSlug;

  if (slug === "gas-flow-calibration") {
    return <GasCalibrationPage article={article} page={page} />;
  }

  if (slug === "master-meter-liquid-calibration") {
    return <MasterMeterCalibrationPage article={article} page={page} />;
  }

  if (slug === "gravimetric-liquid-calibration") {
    return <GravimetricCalibrationPage article={article} page={page} />;
  }

  return <CalibrationBenchPage article={article} page={page} />;
}

function GasCalibrationPage({
  article,
  page
}: {
  article: TechnologyArticle;
  page: TechnologyDetailPageContent;
}) {
  const coreModule = page.modules[0];
  const processModule = page.modules[1];

  return (
    <>
      <GasCalibrationHero article={article} page={page} />
      <GasCoreCapability module={coreModule} />
      <GasCalibrationProcess module={processModule} />
      <GasRelatedMethods
        eyebrow={page.relatedEyebrow}
        links={page.relatedLinks ?? []}
      />

      <FlowCalibrationCTA {...page.cta} surfaceClassName="bg-industrial-700" />
    </>
  );
}

function GasCalibrationHero({
  article,
  page
}: {
  article: TechnologyArticle;
  page: TechnologyDetailPageContent;
}) {
  const highlights = page.facts;

  return (
    <section className="border-b border-metal-200 bg-white">
      <Container className="py-8 sm:py-10 lg:py-12">
        <Breadcrumb items={page.breadcrumbs ?? []} />
        <div className="mt-7 grid gap-9 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-12">
          <div className="max-w-xl">
            <p className="inline-flex bg-[#eef3f8] px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-industrial-700">
              {page.heroLabel}
            </p>
            <h1 className="mt-5 text-4xl font-semibold leading-[1.06] text-navy-950 sm:text-5xl lg:text-[3.5rem]">
              {article.title}
            </h1>
            <p className="mt-4 max-w-lg text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
              {page.heroIntroduction}
            </p>

            <dl className="mt-6 border-y border-metal-200 py-5">
              <div className="flex flex-wrap items-end gap-x-10 gap-y-4">
                {highlights.slice(0, 2).map((highlight, index) => (
                  <div key={highlight.label} className={index === 1 ? "min-w-[220px]" : "min-w-[100px]"}>
                    <dt className="text-xs font-semibold uppercase tracking-[0.13em] text-slate-500">
                      {highlight.label}
                    </dt>
                    <dd
                      className={`mt-1.5 font-semibold leading-tight ${
                        index === 1
                          ? "text-2xl text-industrial-700 sm:text-3xl"
                          : "text-xl text-navy-950 sm:text-2xl"
                      }`}
                    >
                      {highlight.value}
                    </dd>
                  </div>
                ))}
              </div>
              <div className="mt-5 flex flex-col gap-4 border-t border-metal-200 pt-5 sm:flex-row sm:gap-8">
                {highlights.slice(2).map((highlight) => (
                  <div key={highlight.label} className="min-w-0 flex-1">
                    <dt className="text-xs font-semibold uppercase tracking-[0.13em] text-slate-500">
                      {highlight.label}
                    </dt>
                    <dd className="mt-1.5 text-base font-semibold leading-7 text-navy-950 sm:text-lg">
                      {highlight.value}
                    </dd>
                  </div>
                ))}
              </div>
            </dl>

            <Link
              href={page.heroCta?.href ?? "/contact"}
              className="focus-ring mt-6 inline-flex items-center gap-2 bg-industrial-600 px-6 py-3.5 text-base font-semibold text-white transition hover:bg-industrial-700"
            >
              {page.heroCta?.label ?? "Request a Quote"}
              <span aria-hidden="true">{">"}</span>
            </Link>
          </div>

          <figure className="min-w-0">
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-metal-100">
              <Image
                src={page.heroImage.src}
                alt={page.heroImage.alt}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 680px"
                className="object-cover object-center"
              />
            </div>
            <div className="mt-3 space-y-2.5">
              {page.heroImage.caption ? (
                <figcaption className="text-sm leading-6 text-slate-500">
                  {page.heroImage.caption}
                </figcaption>
              ) : null}
              <Link
                href={page.backLink?.href ?? "/technology/flow-calibration-systems"}
                className="focus-ring inline-flex items-center text-base font-semibold text-industrial-700 transition hover:text-navy-950"
              >
                <span aria-hidden="true">←&nbsp;</span>
                {page.backLink?.label ?? "Back to Flow Calibration Systems"}
              </Link>
            </div>
          </figure>
        </div>
      </Container>
    </section>
  );
}

function GasCoreCapability({ module }: { module: TechnologyDetailModule }) {
  const items = module.items ?? [];
  return (
    <section className="border-b border-metal-200 bg-white py-12 sm:py-14 lg:py-16">
      <Container>
        <GasSectionHeading
          eyebrow={module.eyebrow ?? ""}
          title={module.title}
        />
        <ol className="mt-8 border-y border-metal-200">
          {items.map((item, index) => (
            <li
              key={item.title}
              className={`grid gap-3 py-5 sm:grid-cols-[60px_0.9fr_1fr] sm:items-center sm:gap-7 ${
                index > 0 ? "border-t border-metal-200" : ""
              }`}
            >
              <span className="text-xl font-semibold text-industrial-600">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="text-lg font-semibold leading-7 text-navy-950 sm:text-xl">{item.title}</h3>
              <p className="text-base leading-7 text-slate-600">{item.text}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}

function GasCalibrationProcess({ module }: { module: TechnologyDetailModule }) {
  const stages = module.items ?? [];
  return (
    <section className="border-b border-metal-200 bg-[#eef3f8] py-12 sm:py-14 lg:py-16">
      <Container>
        <GasSectionHeading eyebrow={module.eyebrow ?? ""} title={module.title} />
        <div className="relative mt-9">
          <div
            className="absolute left-0 right-0 top-6 hidden h-px bg-blue-300 md:block"
            aria-hidden="true"
          />
          <ol className="relative grid gap-8 sm:grid-cols-2 md:grid-cols-4 md:gap-7">
            {stages.map((stage, index) => (
              <li key={stage.title} className="relative">
                <span className="relative z-10 inline-flex h-12 w-12 items-center justify-center rounded-full bg-industrial-600 text-sm font-semibold text-white">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-5 text-xl font-semibold leading-8 text-navy-950">
                  {stage.title}
                </h3>
                <p className="mt-2 text-base leading-7 text-slate-600">{stage.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}

function GasSectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="max-w-3xl">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-industrial-700">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-2xl font-semibold leading-tight text-navy-950 sm:text-3xl">
        {title}
      </h2>
    </div>
  );
}

function GasRelatedMethods({ eyebrow, links }: { eyebrow: string; links: RelatedLink[] }) {
  return (
    <section className="border-b border-metal-200 bg-white py-10 sm:py-12">
      <Container className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between sm:gap-10">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-industrial-700">
          {eyebrow}
        </p>
        <div className="flex flex-wrap gap-x-8 gap-y-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="focus-ring inline-flex items-center gap-2 text-base font-semibold text-navy-950 transition hover:text-industrial-700 sm:text-lg"
            >
              {link.label}
              <span aria-hidden="true">→</span>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}

function MasterMeterCalibrationPage({
  article,
  page
}: {
  article: TechnologyArticle;
  page: TechnologyDetailPageContent;
}) {
  const methodModule = page.modules[0];
  const referenceModule = page.modules[1];
  const benchModule = page.modules[2];

  return (
    <>
      <MasterMeterCalibrationHero article={article} page={page} />
      <MasterReferenceSystemHighlight module={referenceModule} />
      <MasterMeterMethodSection module={methodModule} />
      <MasterMeterBenchSection module={benchModule} />
      <MasterRelatedMethods
        eyebrow={page.relatedEyebrow}
        links={page.relatedLinks ?? []}
      />

      <FlowCalibrationCTA {...page.cta} surfaceClassName="bg-industrial-700" />
    </>
  );
}

function MasterMeterCalibrationHero({
  article,
  page
}: {
  article: TechnologyArticle;
  page: TechnologyDetailPageContent;
}) {
  const evidence = page.facts.slice(2);

  return (
    <section className="border-b border-metal-200 bg-white">
      <Container className="py-8 sm:py-10 lg:py-12">
        <Breadcrumb items={page.breadcrumbs ?? []} />
        <div className="mt-7 grid gap-9 lg:grid-cols-[0.96fr_1.04fr] lg:items-center lg:gap-12">
          <div className="max-w-2xl">
            <p className="inline-flex bg-[#eef3f8] px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-industrial-700">
              {page.heroLabel}
            </p>
            <h1 className="mt-4 text-4xl font-semibold leading-[1.06] text-navy-950 sm:text-5xl lg:text-[3.1rem]">
              {page.heroTitleLines?.length
                ? page.heroTitleLines.map((line) => (
                    <span key={line} className="block xl:whitespace-nowrap">
                      {line}
                    </span>
                  ))
                : article.title}
            </h1>
            <p className="mt-3.5 max-w-xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
              {page.heroIntroduction}
            </p>

            <div className="mt-5 border-y border-metal-200 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                Reference-system evidence
              </p>
              <ul className="mt-2 divide-y divide-metal-200">
                {evidence.map((item) => (
                  <li
                    key={item.label}
                    className="grid gap-1 py-2.5 sm:grid-cols-[1.2fr_0.8fr] sm:items-baseline sm:gap-5"
                  >
                    <span className="text-base font-semibold leading-6 text-navy-950">
                      {item.value}
                    </span>
                    <span className="text-sm font-medium leading-6 text-slate-600">
                      {item.label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <Link
              href={page.heroCta?.href ?? "/contact"}
              className="focus-ring mt-5 inline-flex items-center gap-2 bg-industrial-600 px-6 py-3.5 text-base font-semibold text-white transition hover:bg-industrial-700"
            >
              {page.heroCta?.label ?? "Request a Quote"}
              <span aria-hidden="true">{">"}</span>
            </Link>
          </div>

          <figure className="min-w-0">
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-metal-100">
              <Image
                src={page.heroImage.src}
                alt={page.heroImage.alt}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 700px"
                className="object-cover object-center"
              />
            </div>
            <div className="mt-3 space-y-2.5">
              {page.heroImage.caption ? (
                <figcaption className="text-[15px] leading-6 text-slate-600">
                  {page.heroImage.caption}
                </figcaption>
              ) : null}
              <Link
                href={page.backLink?.href ?? "/technology/flow-calibration-systems"}
                className="focus-ring inline-flex items-center text-[15px] font-semibold leading-6 text-industrial-700 transition hover:text-navy-950"
              >
                <span aria-hidden="true">←&nbsp;</span>
                {page.backLink?.label ?? "Back to Flow Calibration Systems"}
              </Link>
            </div>
          </figure>
        </div>
      </Container>
    </section>
  );
}

function MasterReferenceSystemHighlight({
  module
}: {
  module: TechnologyDetailModule;
}) {
  const metrics = module.items ?? [];
  return (
    <section className="border-b border-navy-800 bg-navy-950 py-10 text-white sm:py-12 lg:py-14">
      <Container>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-200">
          {module.eyebrow}
        </p>
        <h2 className="mt-3 text-2xl font-semibold leading-tight text-white sm:text-3xl">
          {module.title}
        </h2>
        <dl className="mt-7 grid border-y border-white/15 lg:grid-cols-3">
          {metrics.map((metric, index) => (
            <div
              key={metric.title}
              className={`flex min-h-[138px] flex-col justify-center px-5 py-6 sm:px-6 lg:px-7 ${
                index > 0 ? "border-t border-white/15 lg:border-l lg:border-t-0" : ""
              }`}
            >
              <dd className="text-[1.75rem] font-semibold leading-tight text-white lg:whitespace-nowrap">
                {metric.title}
              </dd>
              <dt className="mt-3 max-w-sm text-[15px] font-semibold leading-6 text-blue-100">
                {metric.text}
              </dt>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}

function MasterMeterMethodSection({ module }: { module: TechnologyDetailModule }) {
  const stages = module.items ?? [];
  const image = module.image;
  return (
    <section className="border-b border-metal-200 bg-[#eef3f8] py-12 sm:py-14 lg:py-16">
      <Container>
        <MasterSectionHeading eyebrow={module.eyebrow ?? ""} title={module.title} />
        <div className="mt-8 grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-start lg:gap-14">
          <ol className="border-l-2 border-blue-300">
            {stages.map((stage, index) => (
              <li key={stage.title} className="relative pb-7 pl-10 last:pb-0">
                <span className="absolute -left-[17px] top-0 inline-flex h-8 w-8 items-center justify-center rounded-full bg-industrial-600 text-xs font-semibold text-white">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="text-xl font-semibold leading-7 text-navy-950">{stage.title}</h3>
                <p className="mt-1.5 text-base leading-7 text-slate-600">{stage.text}</p>
              </li>
            ))}
          </ol>
          {image ? (
            <MasterPurposefulImage
              src={image.src}
              alt={image.alt}
              width={1417}
              height={514}
              sizes="(max-width: 1024px) 100vw, 700px"
              caption={image.caption ?? ""}
            />
          ) : null}
        </div>
      </Container>
    </section>
  );
}

function MasterMeterBenchSection({ module }: { module: TechnologyDetailModule }) {
  const image = module.image;

  if (!image) {
    return null;
  }

  return (
    <section className="border-b border-metal-200 bg-white py-12 sm:py-14 lg:py-16">
      <Container>
        <div className="grid overflow-hidden bg-[#eef3f8] lg:grid-cols-2 lg:items-stretch">
          <div className="flex items-center p-6 sm:p-8">
            <figure className="min-w-0 w-full">
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-metal-100">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 550px"
                  className="object-cover object-center"
                />
              </div>
              <figcaption className="mt-3 text-[15px] leading-6 text-slate-600">
                {image.caption}
              </figcaption>
            </figure>
          </div>
          <div className="flex flex-col justify-center border-t border-blue-200 p-7 sm:p-9 lg:border-l lg:border-t-0 lg:p-10">
            <MasterSectionHeading
              eyebrow={module.eyebrow ?? ""}
              title={module.title}
              description={module.description}
            />
            <ul className="mt-7 grid gap-4">
              {(module.bullets ?? []).map(
                (item) => (
                  <li
                    key={item}
                    className="border-l-2 border-industrial-600 pl-5 text-lg font-semibold leading-8 text-navy-950"
                  >
                    {item}
                  </li>
                )
              )}
            </ul>
            <PrimaryTextLink href={module.link?.href ?? "/technology/liquid-flow-calibration-bench"}>
              {module.link?.label ?? "View Calibration Bench"}
            </PrimaryTextLink>
          </div>
        </div>
      </Container>
    </section>
  );
}

function MasterSectionHeading({
  eyebrow,
  title,
  description
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="max-w-3xl">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-industrial-700">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-2xl font-semibold leading-tight text-navy-950 sm:text-3xl">
        {title}
      </h2>
      {description ? <p className="mt-4 text-base leading-7 text-slate-600">{description}</p> : null}
    </div>
  );
}

function MasterPurposefulImage({
  src,
  alt,
  width,
  height,
  caption,
  sizes
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption: string;
  sizes: string;
}) {
  return (
    <figure className="min-w-0 w-full">
      <Image src={src} alt={alt} width={width} height={height} sizes={sizes} className="h-auto w-full" />
      <figcaption className="mt-3 text-[15px] leading-6 text-slate-600">{caption}</figcaption>
    </figure>
  );
}

function MasterRelatedMethods({ eyebrow, links }: { eyebrow: string; links: RelatedLink[] }) {
  return (
    <section className="border-b border-metal-200 bg-white py-10 sm:py-12">
      <Container className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between sm:gap-10">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-industrial-700">
          {eyebrow}
        </p>
        <div className="flex flex-wrap gap-x-8 gap-y-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="focus-ring inline-flex items-center gap-2 text-base font-semibold text-navy-950 transition hover:text-industrial-700 sm:text-lg"
            >
              {link.label}
              <span aria-hidden="true">→</span>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}

function GravimetricCalibrationPage({
  article,
  page
}: {
  article: TechnologyArticle;
  page: TechnologyDetailPageContent;
}) {
  const processModule = page.modules[0];
  const evidenceModule = page.modules[1];
  const capacitiesModule = page.modules[2];

  return (
    <>
      <GravimetricCalibrationHero article={article} page={page} />
      <GravimetricEvidenceSection
        module={evidenceModule}
        capacitiesModule={capacitiesModule}
      />
      <GravimetricProcessSection module={processModule} />
      <GravimetricRelatedMethods
        eyebrow={page.relatedEyebrow}
        links={page.relatedLinks ?? []}
      />

      <FlowCalibrationCTA {...page.cta} surfaceClassName="bg-industrial-700" />
    </>
  );
}

function GravimetricCalibrationHero({
  article,
  page
}: {
  article: TechnologyArticle;
  page: TechnologyDetailPageContent;
}) {
  return (
    <section className="border-b border-metal-200 bg-white">
      <Container className="py-8 sm:py-10 lg:py-12">
        <Breadcrumb items={page.breadcrumbs ?? []} />
        <div className="mt-7 grid gap-9 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-12">
          <div className="max-w-xl">
            <p className="inline-flex bg-[#eef3f8] px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-industrial-700">
              {page.heroLabel}
            </p>
            <h1 className="mt-5 text-4xl font-semibold leading-[1.06] text-navy-950 sm:text-5xl lg:text-[3.25rem]">
              {article.title}
            </h1>
            <p className="mt-4 max-w-lg text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
              {page.heroIntroduction}
            </p>

            <div className="mt-7 border-y border-metal-200 py-5">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                Reference principle
              </p>
              <p className="mt-2 text-xl font-semibold uppercase leading-snug text-industrial-700 sm:text-2xl">
                {page.facts.find((fact) => fact.label === "Method")?.value}
              </p>
            </div>

            <Link
              href={page.heroCta?.href ?? "/contact"}
              className="focus-ring mt-6 inline-flex items-center gap-2 bg-industrial-600 px-6 py-3.5 text-base font-semibold text-white transition hover:bg-industrial-700"
            >
              {page.heroCta?.label ?? "Request a Quote"}
              <span aria-hidden="true">{">"}</span>
            </Link>
          </div>

          <figure className="min-w-0">
            <Image
              src={page.heroImage.src}
              alt={page.heroImage.alt}
              width={1800}
              height={1311}
              priority
              sizes="(max-width: 1024px) 100vw, 680px"
              className="h-auto w-full"
            />
            <div className="mt-3 space-y-2.5">
              {page.heroImage.caption ? (
                <figcaption className="text-[15px] leading-6 text-slate-600">
                  {page.heroImage.caption}
                </figcaption>
              ) : null}
              <Link
                href={page.backLink?.href ?? "/technology/flow-calibration-systems"}
                className="focus-ring inline-flex items-center text-base font-semibold text-industrial-700 transition hover:text-navy-950"
              >
                <span aria-hidden="true">←&nbsp;</span>
                {page.backLink?.label ?? "Back to Flow Calibration Systems"}
              </Link>
            </div>
          </figure>
        </div>
      </Container>
    </section>
  );
}

function GravimetricEvidenceSection({
  module,
  capacitiesModule
}: {
  module: TechnologyDetailModule;
  capacitiesModule: TechnologyDetailModule;
}) {
  const metrics = module.items ?? [];
  const image = module.image;

  if (!image) {
    return null;
  }

  return (
    <section className="border-b border-metal-200 bg-[#eef3f8] py-12 sm:py-14 lg:py-16">
      <Container className="grid gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:gap-14">
        <div>
          <GravimetricSectionHeading
            eyebrow={module.eyebrow ?? ""}
            title={module.title}
          />

          <dl className="mt-8 border-y border-metal-300 sm:grid sm:grid-cols-2">
            <div className="py-5 sm:pr-8">
              <dt className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
                {metrics[0]?.text}
              </dt>
              <dd className="mt-2 text-4xl font-semibold leading-none text-navy-950 sm:text-5xl">
                {metrics[0]?.title}
              </dd>
            </div>
            <div className="border-t border-metal-300 py-5 sm:border-l sm:border-t-0 sm:pl-8">
              <dt className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
                {metrics[1]?.text}
              </dt>
              <dd className="mt-2 text-2xl font-semibold leading-tight text-industrial-700 sm:text-3xl">
                {metrics[1]?.title}
              </dd>
            </div>
          </dl>

          <div className="mt-8">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              {capacitiesModule.eyebrow}
            </p>
            <p className="mt-3 text-2xl font-semibold leading-snug text-navy-950 sm:text-3xl">
              {(capacitiesModule.items ?? []).map((item) => item.title).join(" · ")}
            </p>
          </div>
        </div>

        <figure className="min-w-0">
          <div className="relative aspect-[5/4] w-full overflow-hidden bg-metal-100">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(max-width: 1024px) 100vw, 560px"
              className="object-cover object-[center_44%]"
            />
          </div>
          <figcaption className="mt-3 text-[15px] leading-6 text-slate-600">
            {image.caption}
          </figcaption>
        </figure>
      </Container>
    </section>
  );
}

function GravimetricProcessSection({ module }: { module: TechnologyDetailModule }) {
  const steps = module.items ?? [];
  return (
    <section className="border-b border-metal-200 bg-white py-12 sm:py-14 lg:py-16">
      <Container>
        <GravimetricSectionHeading
          eyebrow={module.eyebrow ?? ""}
          title={module.title}
        />
        <ol className="mt-9 grid gap-8 sm:grid-cols-3 sm:gap-0">
          {steps.map((step, index) => (
            <li key={step.title} className="relative border-t border-metal-300 pt-6 sm:pr-8">
              <span className="absolute -top-[17px] left-0 flex h-8 w-8 items-center justify-center rounded-full bg-industrial-700 text-xs font-semibold text-white">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="text-xl font-semibold text-navy-950 sm:text-2xl">{step.title}</h3>
              <p className="mt-2 max-w-xs text-base leading-7 text-slate-600">{step.text}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}

function GravimetricSectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="max-w-3xl">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-industrial-700">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-2xl font-semibold leading-tight text-navy-950 sm:text-3xl">{title}</h2>
    </div>
  );
}

function GravimetricRelatedMethods({ eyebrow, links }: { eyebrow: string; links: RelatedLink[] }) {
  return (
    <section className="border-b border-metal-200 bg-[#f7f9fb] py-10 sm:py-12">
      <Container className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between sm:gap-10">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-industrial-700">
          {eyebrow}
        </p>
        <div className="flex flex-wrap gap-x-8 gap-y-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="focus-ring inline-flex items-center gap-2 text-base font-semibold text-navy-950 transition hover:text-industrial-700 sm:text-lg"
            >
              {link.label}
              <span aria-hidden="true">→</span>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}

function CalibrationBenchPage({
  article,
  page
}: {
  article: TechnologyArticle;
  page: TechnologyDetailPageContent;
}) {
  const developedModule = page.modules[0];
  const structureModule = page.modules[1];
  const roleModule = page.modules[page.modules.length - 1];

  return (
    <>
      <CalibrationHero
        article={article}
        page={page}
        slug="liquid-flow-calibration-bench"
        facts={page.facts}
        secondaryHref={page.backLink?.href}
        secondaryLabel={page.backLink?.label}
      />

      <TechnicalCards
        eyebrow={developedModule.eyebrow ?? ""}
        title={developedModule.title}
        columns={4}
        items={developedModule.items ?? []}
      />

      <section className="border-b border-metal-200 bg-[#eef3f8] py-14 sm:py-16 lg:py-20">
        <Container className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <SectionHeading
            eyebrow={structureModule.eyebrow ?? ""}
            title={structureModule.title}
          />
          <ReadableBullets
            items={structureModule.bullets ?? []}
            columns={2}
          />
        </Container>
      </section>

      <section className="border-b border-navy-800 bg-navy-950 py-14 text-white sm:py-16 lg:py-20">
        <Container className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-200">
              {roleModule.eyebrow}
            </p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">
              {roleModule.title}
            </h2>
            <p className="mt-5 text-base leading-7 text-blue-50 sm:text-lg">
              {roleModule.description}
            </p>
          </div>
          <Link
            href={roleModule.link?.href ?? "/technology/master-meter-liquid-calibration"}
            className="focus-ring inline-flex w-fit items-center gap-2 bg-white px-6 py-3.5 text-base font-semibold text-navy-950 transition hover:bg-metal-100"
          >
            {roleModule.link?.label ?? "View Master-Meter Liquid Calibration"}
            <span aria-hidden="true">{">"}</span>
          </Link>
        </Container>
      </section>

      <RelatedContent
        eyebrow={page.relatedEyebrow}
        heading={page.relatedHeading}
        links={page.relatedLinks ?? []}
      />

      <FlowCalibrationCTA {...page.cta} surfaceClassName="bg-industrial-700" />
    </>
  );
}

function CalibrationHero({
  article,
  page,
  slug,
  facts,
  secondaryHref = "/technology/flow-calibration-systems",
  secondaryLabel = "Back to Flow Calibration Systems"
}: {
  article: TechnologyArticle;
  page: TechnologyDetailPageContent;
  slug: CalibrationSlug;
  facts: TechnologyDetailFact[];
  secondaryHref?: string;
  secondaryLabel?: string;
}) {
  return (
    <section className="border-b border-metal-200 bg-white">
      <Container className="py-8 sm:py-10 lg:py-14">
        <Breadcrumb items={page.breadcrumbs ?? []} />
        <div
          className={`mt-8 grid gap-10 lg:items-center lg:gap-14 ${
            slug === "gravimetric-liquid-calibration"
              ? "lg:grid-cols-[1.08fr_0.92fr]"
              : "lg:grid-cols-[0.9fr_1.1fr]"
          }`}
        >
          <div className="max-w-2xl">
            {page.heroLabel ? (
              <p className="inline-flex bg-[#eef3f8] px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-industrial-700">
                {page.heroLabel}
              </p>
            ) : (
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-industrial-700">
                Velomac In-House Engineering
              </p>
            )}
            <h1 className="mt-5 text-4xl font-semibold leading-[1.08] text-navy-950 sm:text-5xl">
              {article.title}
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">
              {page.heroIntroduction}
            </p>
            <HeroFacts facts={facts} />
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={page.heroCta?.href ?? "/contact"}
                className="focus-ring inline-flex items-center gap-2 bg-industrial-600 px-6 py-3.5 text-base font-semibold text-white transition hover:bg-industrial-700"
              >
                {page.heroCta?.label ?? "Request a Quote"}
                <span aria-hidden="true">{">"}</span>
              </Link>
              <Link
                href={secondaryHref}
                className="focus-ring inline-flex items-center border border-metal-300 bg-white px-6 py-3.5 text-base font-semibold text-navy-950 transition hover:border-industrial-600 hover:text-industrial-700"
              >
                {secondaryLabel}
              </Link>
            </div>
          </div>
          <figure
            className={`min-w-0 ${
              slug === "gravimetric-liquid-calibration" ? "lg:ml-auto lg:w-full lg:max-w-[520px]" : ""
            }`}
          >
            <div className="relative w-full overflow-hidden" style={{ aspectRatio: heroAspectRatios[slug] }}>
              <Image
                src={page.heroImage.src}
                alt={page.heroImage.alt}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 650px"
                className="object-contain"
              />
            </div>
            {page.heroImage.caption ? (
              <figcaption className="mt-3 text-sm leading-6 text-slate-500">
                {page.heroImage.caption}
              </figcaption>
            ) : null}
          </figure>
        </div>
      </Container>
    </section>
  );
}

function Breadcrumb({
  items
}: {
  items: NonNullable<TechnologyDetailPageContent["breadcrumbs"]>;
}) {
  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
      {items.map((item, index) => (
        <span key={`${item.label}-${item.href ?? "current"}`} className="contents">
          {item.href ? (
            <Link href={item.href} className="focus-ring rounded-sm transition hover:text-industrial-700">
              {item.label}
            </Link>
          ) : (
            <span className="text-slate-700">{item.label}</span>
          )}
          {index < items.length - 1 ? <span aria-hidden="true">/</span> : null}
        </span>
      ))}
    </nav>
  );
}

function HeroFacts({ facts }: { facts: TechnologyDetailFact[] }) {
  return (
    <dl className="mt-7 grid border-y border-metal-200 sm:grid-cols-2">
      {facts.map((fact, index) => (
        <div
          key={fact.label}
          className={`py-4 sm:px-5 ${
            index > 0 ? "border-t border-metal-200 sm:border-l sm:border-t-0" : ""
          } ${index > 1 ? "sm:border-t" : ""}`}
        >
          <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
            {fact.label}
          </dt>
          <dd className="mt-1.5 text-lg font-semibold leading-7 text-navy-950">{fact.value}</dd>
        </div>
      ))}
    </dl>
  );
}

function TechnicalCards({
  eyebrow,
  title,
  items,
  columns = 3
}: {
  eyebrow: string;
  title: string;
  items: { title: string; text?: string }[];
  columns?: 3 | 4;
}) {
  return (
    <Section className="border-b border-metal-200 bg-white">
      <Container>
        <SectionHeading eyebrow={eyebrow} title={title} />
        <div className={`mt-10 grid gap-7 ${columns === 4 ? "sm:grid-cols-2 lg:grid-cols-4" : "md:grid-cols-3"}`}>
          {items.map((item) => (
            <article key={item.title} className="border-t-2 border-industrial-600 pt-5">
              <h3 className="text-xl font-semibold leading-8 text-navy-950">{item.title}</h3>
              {item.text ? <p className="mt-3 text-base leading-7 text-slate-600">{item.text}</p> : null}
            </article>
          ))}
        </div>
      </Container>
    </Section>
  );
}

function ProcessSteps({
  eyebrow,
  title,
  steps,
  tone = "white"
}: {
  eyebrow: string;
  title: string;
  steps: [string, string][];
  tone?: "white" | "blue";
}) {
  return (
    <Section className={`border-b border-metal-200 ${tone === "blue" ? "bg-[#eef3f8]" : "bg-white"}`}>
      <Container>
        <SectionHeading eyebrow={eyebrow} title={title} />
        <div className="mt-10">
          <NumberedList items={steps} horizontal />
        </div>
      </Container>
    </Section>
  );
}

function NumberedList({
  items,
  horizontal = false
}: {
  items: [string, string][];
  horizontal?: boolean;
}) {
  return (
    <ol className={`grid gap-px bg-metal-300 ${horizontal ? (items.length === 4 ? "sm:grid-cols-2 lg:grid-cols-4" : "md:grid-cols-3") : "mt-8"}`}>
      {items.map(([title, text], index) => (
        <li key={title} className="bg-white px-6 py-6 lg:py-7">
          <p className="text-sm font-semibold text-industrial-600">{String(index + 1).padStart(2, "0")}</p>
          <h3 className="mt-3 text-lg font-semibold leading-7 text-navy-950">{title}</h3>
          <p className="mt-2 text-base leading-7 text-slate-600">{text}</p>
        </li>
      ))}
    </ol>
  );
}

function SelectionSection({
  eyebrow = "Selection Considerations",
  title,
  items
}: {
  eyebrow?: string;
  title: string;
  items: string[];
}) {
  return (
    <Section className="border-b border-metal-200 bg-metal-50">
      <Container className="grid gap-9 lg:grid-cols-[0.78fr_1.22fr] lg:gap-16">
        <SectionHeading eyebrow={eyebrow} title={title} />
        <ReadableBullets items={items} columns={2} />
      </Container>
    </Section>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
  dark = false
}: {
  eyebrow: string;
  title: string;
  description?: string;
  dark?: boolean;
}) {
  return (
    <div className="max-w-3xl">
      <p className={`text-xs font-semibold uppercase tracking-[0.18em] ${dark ? "text-blue-200" : "text-industrial-700"}`}>
        {eyebrow}
      </p>
      <h2 className={`mt-3 text-3xl font-semibold leading-tight sm:text-4xl ${dark ? "text-white" : "text-navy-950"}`}>
        {title}
      </h2>
      {description ? (
        <p className={`mt-5 text-base leading-7 sm:text-lg ${dark ? "text-blue-50" : "text-slate-600"}`}>
          {description}
        </p>
      ) : null}
    </div>
  );
}

function ReadableBullets({
  items,
  columns = 1
}: {
  items: string[];
  columns?: 1 | 2;
}) {
  return (
    <ul className={`mt-8 grid gap-4 ${columns === 2 ? "sm:grid-cols-2" : ""}`}>
      {items.map((item) => (
        <li
          key={item}
          className="border-l-2 border-industrial-600 pl-5 text-base font-semibold leading-7 text-navy-950 sm:text-lg"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

function TechnicalMetric({
  label,
  value,
  dark = false
}: {
  label: string;
  value: string;
  dark?: boolean;
}) {
  return (
    <div className={`px-6 py-7 sm:px-7 lg:py-8 ${dark ? "bg-navy-900" : "bg-white"}`}>
      <p className={`text-xs font-semibold uppercase tracking-[0.14em] ${dark ? "text-blue-200" : "text-slate-500"}`}>
        {label}
      </p>
      <p className={`mt-3 text-3xl font-semibold leading-tight sm:text-4xl ${dark ? "text-white" : "text-navy-950"}`}>
        {value}
      </p>
    </div>
  );
}

function PurposefulImage({
  src,
  alt,
  width,
  height,
  caption,
  sizes = "(max-width: 1024px) 100vw, 620px",
  className = ""
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption: string;
  sizes?: string;
  className?: string;
}) {
  return (
    <figure className={`min-w-0 ${className}`}>
      <Image src={src} alt={alt} width={width} height={height} sizes={sizes} className="h-auto w-full" />
      <figcaption className="mt-3 text-sm leading-6 text-slate-500">{caption}</figcaption>
    </figure>
  );
}

function PrimaryTextLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="focus-ring mt-8 inline-flex w-fit items-center gap-2 text-base font-semibold text-industrial-700 transition hover:text-navy-950 sm:text-lg"
    >
      {children}
      <span aria-hidden="true">{">"}</span>
    </Link>
  );
}

function FlowCalibrationCTA({
  title,
  text,
  eyebrow = "Selection support",
  buttonLabel = "Request a Quote",
  href = "/contact",
  detailChips,
  surfaceClassName = "bg-industrial-700"
}: {
  title: string;
  text: string;
  eyebrow?: string;
  buttonLabel?: string;
  href?: string;
  detailChips?: string[];
  surfaceClassName?: string;
}) {
  return (
    <section className={`${surfaceClassName} py-16 text-white sm:py-20`}>
      <Container className="grid gap-9 lg:grid-cols-[0.95fr_0.72fr] lg:items-center lg:gap-14">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-100">
            {eyebrow}
          </p>
          <h2 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">{title}</h2>
          <p className="mt-5 text-lg leading-8 text-blue-50">{text}</p>
          <Link
            href={href}
            className="focus-ring mt-8 inline-flex w-fit items-center justify-center gap-2 bg-white px-6 py-3.5 text-base font-semibold text-navy-950 transition hover:bg-metal-100 sm:text-lg"
          >
            {buttonLabel}
            <span aria-hidden="true">{">"}</span>
          </Link>
        </div>
        {detailChips?.length ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {detailChips.map((chip) => (
              <div
                key={chip}
                className="bg-white/10 px-5 py-4 text-base font-semibold leading-7 text-white"
              >
                {chip}
              </div>
            ))}
          </div>
        ) : (
          <div className="hidden lg:block" />
        )}
      </Container>
    </section>
  );
}

function RelatedContent({
  eyebrow,
  heading,
  links
}: {
  eyebrow: string;
  heading: string;
  links: RelatedLink[];
}) {
  return (
    <section className="border-b border-metal-200 bg-white py-10 sm:py-12">
      <Container className="grid gap-6 lg:grid-cols-[0.34fr_0.66fr] lg:items-center lg:gap-12">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-industrial-700">
            {eyebrow}
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-navy-950">{heading}</h2>
        </div>
        <div className={`grid gap-3 ${links.length === 3 ? "md:grid-cols-3" : "sm:grid-cols-2"}`}>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="focus-ring flex items-center justify-between gap-4 bg-metal-50 px-5 py-4 text-base font-semibold leading-6 text-navy-950 transition hover:bg-[#eef3f8] hover:text-industrial-700"
            >
              {link.label}
              <span aria-hidden="true">{">"}</span>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
