import Image from "next/image";
import Link from "next/link";
import { Container, Section } from "@/components/Layout";
import { technologyContent } from "@/content/technology";

const overview = technologyContent.flowCalibrationOverview;
const methods = overview.methods;

export function FlowCalibrationCategoryPage() {
  return (
    <>
      <section className="border-b border-metal-200 bg-white">
        <Container className="py-10 sm:py-12 lg:py-16">
          <Breadcrumb />
          <div className="mt-8 grid gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:items-center lg:gap-14">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-industrial-700">
                {overview.hero.eyebrow}
              </p>
              <h1 className="mt-4 text-4xl font-semibold leading-[1.08] text-navy-950 sm:text-5xl">
                {overview.hero.title}
              </h1>
              <p className="mt-5 max-w-xl text-xl font-semibold leading-8 text-navy-950 sm:text-[1.4rem]">
                {overview.hero.description}
              </p>
            </div>
            <figure>
              <Image
                src={overview.hero.image.src}
                alt={overview.hero.image.alt}
                width={1522}
                height={1033}
                priority
                sizes="(max-width: 1024px) 100vw, 650px"
                className="h-auto w-full"
              />
              <figcaption className="mt-3 text-xs leading-5 text-slate-500">
                {overview.hero.image.caption}
              </figcaption>
            </figure>
          </div>
        </Container>
      </section>

      <Section className="border-b border-metal-200 bg-[#eef3f8]">
        <Container>
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-industrial-700">
              {overview.selection.eyebrow}
            </p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight text-navy-950 sm:text-4xl">
              {overview.selection.title}
            </h2>
          </div>

          <div className="mt-9 grid gap-px bg-blue-200 lg:grid-cols-3">
            {methods.map((method, index) => (
              <article
                key={method.number}
                className="bg-white p-6 sm:p-7"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-industrial-700">
                  {overview.selection.routeLabel} {method.number}
                </p>
                <h3 className="mt-2 text-xl font-semibold leading-8 text-navy-950 sm:text-2xl">
                  <Link href={method.href} className="focus-ring transition hover:text-industrial-700">
                    {method.title}
                  </Link>
                </h3>
                <p className="mt-6 text-sm font-semibold uppercase tracking-[0.12em] text-industrial-700">
                  {method.medium}
                </p>
                <p className="mt-1 text-2xl font-semibold leading-8 text-navy-950">{method.meterClass}</p>
                <div className="mt-5 border-t border-metal-200 pt-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                    {overview.selection.methodLabel}
                  </p>
                  <p className="mt-1.5 text-base font-medium leading-7 text-slate-700">
                    {method.summaryMethod}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="border-b border-metal-200 bg-white">
        <Container>
          <MethodHeading method={methods[0]} />
          <div className="mt-10 grid gap-9 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:gap-14">
            <figure>
              <Image
                src={methods[0].image.src}
                alt={methods[0].image.alt}
                width={2200}
                height={733}
                sizes="(max-width: 1024px) 100vw, 650px"
                className="h-auto w-full"
              />
              <figcaption className="mt-3 text-xs leading-5 text-slate-500">
                {methods[0].image.caption}
              </figcaption>
            </figure>
            <MethodSummary method={methods[0]} />
          </div>
        </Container>
      </Section>

      <Section className="border-b border-blue-200 bg-[#eef3f8]">
        <Container>
          <MethodHeading method={methods[1]} />
          <div className="mt-10 grid gap-9 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:gap-14">
            <figure>
              <Image
                src={methods[1].image.src}
                alt={methods[1].image.alt}
                width={1417}
                height={514}
                sizes="(max-width: 1024px) 100vw, 650px"
                className="h-auto w-full"
              />
              <figcaption className="mt-3 text-xs leading-5 text-slate-500">
                {methods[1].image.caption}
              </figcaption>
            </figure>
            <MethodSummary method={methods[1]} />
          </div>

          <article className="mt-11 grid max-w-5xl overflow-hidden border border-blue-200 bg-white md:grid-cols-[0.44fr_0.56fr]">
            <div className="relative aspect-[1300/572] bg-metal-100 md:aspect-auto">
              <Image
                src={overview.supportingEquipment.image.src}
                alt={overview.supportingEquipment.image.alt}
                fill
                sizes="(max-width: 768px) 100vw, 440px"
                className="object-contain"
              />
            </div>
            <div className="p-6 sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-industrial-700">
                {overview.supportingEquipment.eyebrow}
              </p>
              <h3 className="mt-3 text-xl font-semibold leading-7 text-navy-950 sm:text-2xl">
                {overview.supportingEquipment.title}
              </h3>
              <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
                {overview.supportingEquipment.description}
              </p>
              <Link
                href={overview.supportingEquipment.href}
                className="focus-ring mt-5 inline-flex items-center gap-2 text-base font-semibold text-industrial-700 transition hover:text-navy-950"
              >
                {overview.supportingEquipment.linkLabel}
                <span aria-hidden="true">{">"}</span>
              </Link>
            </div>
          </article>
        </Container>
      </Section>

      <Section className="border-b border-metal-200 bg-white">
        <Container>
          <MethodHeading method={methods[2]} />
          <div className="mt-10 grid gap-9 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:gap-14">
            <figure className="w-full max-w-[340px] justify-self-center">
              <Image
                src={methods[2].image.src}
                alt={methods[2].image.alt}
                width={1281}
                height={1500}
                sizes="(max-width: 640px) 88vw, 380px"
                className="h-auto w-full"
              />
              <figcaption className="mt-3 text-xs leading-5 text-slate-500">
                {methods[2].image.caption}
              </figcaption>
            </figure>
            <MethodSummary method={methods[2]} />
          </div>
        </Container>
      </Section>

      <SelectionCTA {...overview.cta} />
    </>
  );
}

function Breadcrumb() {
  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
      <Link href={overview.breadcrumb.parentHref} className="focus-ring rounded-sm transition hover:text-industrial-700">
        {overview.breadcrumb.parentLabel}
      </Link>
      <span aria-hidden="true">/</span>
      <span className="text-slate-700">{overview.breadcrumb.currentLabel}</span>
    </nav>
  );
}

function MethodHeading({ method }: { method: (typeof methods)[number] }) {
  return (
    <div className="grid gap-5 sm:grid-cols-[92px_1fr] lg:grid-cols-[108px_1fr] lg:gap-8">
      <p className="text-5xl font-semibold leading-none text-industrial-200 sm:text-6xl" aria-hidden="true">
        {method.number}
      </p>
      <div className="max-w-3xl border-l-2 border-industrial-600 pl-5 sm:pl-7">
        <p className="inline-flex border border-blue-300 bg-white px-3 py-1.5 text-sm font-semibold uppercase tracking-[0.12em] text-industrial-700">
          {method.classLabel}
        </p>
        <h2 className="mt-3 text-3xl font-semibold text-navy-950 sm:text-4xl">{method.title}</h2>
        <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">{method.description}</p>
      </div>
    </div>
  );
}

function MethodSummary({ method }: { method: (typeof methods)[number] }) {
  return (
    <div>
      <ul className="divide-y divide-metal-200 border-y border-metal-300">
        {method.points.map((point) => (
          <li
            key={point}
            className="flex items-start gap-4 py-5 text-lg font-semibold leading-8 text-navy-950"
          >
            <span
              className="mt-3 h-2 w-2 shrink-0 bg-industrial-600"
              aria-hidden="true"
            />
            {point}
          </li>
        ))}
      </ul>
      <Link
        href={method.href}
        className="focus-ring mt-8 inline-flex items-center gap-2 text-base font-semibold text-industrial-700 transition hover:text-navy-950 sm:text-lg"
      >
        {method.linkLabel}
        <span aria-hidden="true">{">"}</span>
      </Link>
    </div>
  );
}

function SelectionCTA({
  eyebrow,
  title,
  text,
  buttonLabel,
  href,
  detailChips
}: typeof overview.cta) {
  return (
    <section className="bg-industrial-700 py-16 text-white sm:py-20">
      <Container className="grid gap-9 lg:grid-cols-[0.95fr_0.72fr] lg:items-center lg:gap-14">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-100">
            {eyebrow}
          </p>
          <h2 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">{title}</h2>
          <p className="mt-5 text-lg leading-8 text-blue-50">{text}</p>
          <Link
            href={href}
            className="focus-ring mt-8 inline-flex items-center gap-2 bg-white px-6 py-3.5 text-base font-semibold text-navy-950 transition hover:bg-metal-100 sm:text-lg"
          >
            {buttonLabel}
            <span aria-hidden="true">{">"}</span>
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {detailChips.map((detail) => (
            <div key={detail} className="bg-white/10 px-5 py-4 text-base font-semibold leading-7">
              {detail}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
