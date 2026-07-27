import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CTASection } from "@/components/CTASection";
import { Container, Section } from "@/components/Layout";
import { TechnologyCard } from "@/components/TechnologyCard";
import { TechnologySubnav } from "@/components/TechnologySubnav";
import {
  technologyContent,
  getTechnologyArticle,
  getTechnologyArticlesByCategory,
  getTechnologyCategory,
  type TechnologyCategory
} from "@/content/technology";

export const metadata: Metadata = {
  title: technologyContent.metadata.title,
  description: technologyContent.metadata.description,
  alternates: {
    canonical: "/technology"
  },
  openGraph: {
    title: technologyContent.metadata.title,
    description: technologyContent.metadata.description,
    url: "/technology",
    images: [
      {
        url: technologyContent.hero.image.src,
        alt: technologyContent.hero.image.alt
      }
    ]
  }
};

export default function TechnologyPage() {
  const { hero } = technologyContent;
  const sensorCategory = getTechnologyCategory("product-sensor-innovation")!;
  const testingCategory = getTechnologyCategory("testing-calibration")!;
  const applicationCategory = getTechnologyCategory("application-engineering")!;
  const sensorArticles = getTechnologyArticlesByCategory(sensorCategory.id);
  const calibrationArticle = getTechnologyArticle("in-house-liquid-flow-calibration-bench")!;
  const vibrationArticle = getTechnologyArticle("vibration-measurement-test-system")!;
  const upgradeArticle = getTechnologyArticle("smart-vortex-upgrade-chemical-pharmaceutical")!;

  return (
    <>
      <TechnologySubnav />
      <section className="border-b border-metal-200 bg-white">
        <Container className="grid gap-10 py-12 sm:py-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-14 lg:py-16">
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
          <div className="relative aspect-[16/10] w-full min-w-0 overflow-hidden bg-navy-950">
            <Image
              src={hero.image.src}
              alt={hero.image.alt}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 620px"
              className={hero.image.fit === "contain" ? "object-contain" : "object-cover object-center"}
            />
          </div>
        </Container>
      </section>

      <Section>
        <Container className="grid gap-7 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-industrial-700">
              How Velomac Develops
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-normal text-navy-950 sm:text-4xl">
              From sensing structure to field application
            </h2>
          </div>
          <div className="max-w-3xl">
            <p className="text-lg leading-8 text-slate-600">
              Velomac connects product development, controlled validation and application review so a
              measurement concept can be assessed against the conditions it will meet in the field.
            </p>
            <p className="mt-4 text-base leading-7 text-slate-600">
              Each engineering area below presents a distinct part of that work, with concise case
              summaries and confirmed technical information.
            </p>
          </div>
        </Container>
      </Section>

      <Section className="border-y border-metal-200 bg-white">
        <Container>
          <TechnologySectionHeading number="01" category={sensorCategory} />
          <div className="mt-11 grid items-stretch gap-6 md:grid-cols-2 lg:grid-cols-3">
            {sensorArticles.map((article) => (
              <TechnologyCard key={article.slug} article={article} />
            ))}
          </div>
        </Container>
      </Section>

      <Section className="border-b border-metal-200 bg-[#eef3f8]">
        <Container>
          <TechnologySectionHeading number="02" category={testingCategory} />

          <div className="mt-11 overflow-hidden border border-blue-100 bg-white">
            <div className="grid lg:grid-cols-[1.18fr_0.82fr]">
              <div className="relative aspect-[16/10] min-w-0 bg-metal-100 lg:aspect-auto lg:min-h-[430px]">
                <Image
                  src={calibrationArticle.image.src}
                  alt={calibrationArticle.image.alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 700px"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col justify-center p-7 sm:p-9 lg:p-11">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-industrial-700">
                  Liquid Calibration
                </p>
                <h3 className="mt-3 text-2xl font-semibold leading-8 text-navy-950 sm:text-3xl">
                  {calibrationArticle.title}
                </h3>
                <p className="mt-4 text-base leading-7 text-slate-600">{calibrationArticle.summary}</p>
                <ul className="mt-7 space-y-3 border-t border-metal-200 pt-6 text-sm font-semibold leading-6 text-navy-950">
                  <li>Volume-and-mass reference method</li>
                  <li>Liquid accumulated and instantaneous flow checks</li>
                  <li>Calibration work kept close to manufacturing</li>
                </ul>
                <Link
                  href={`/technology/${calibrationArticle.slug}`}
                  className="focus-ring mt-7 inline-flex w-fit items-center gap-2 text-sm font-semibold text-industrial-700 transition hover:text-navy-950"
                >
                  View Calibration System
                  <span aria-hidden="true">{">"}</span>
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-7 grid overflow-hidden border border-blue-100 bg-white lg:grid-cols-[0.82fr_1.18fr]">
            <div className="flex flex-col justify-center p-7 sm:p-9 lg:p-10">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-industrial-700">
                Controlled Vibration
              </p>
              <h3 className="mt-3 text-2xl font-semibold leading-8 text-navy-950">
                {vibrationArticle.title}
              </h3>
              <p className="mt-4 text-base leading-7 text-slate-600">{vibrationArticle.summary}</p>
              <Link
                href={`/technology/${vibrationArticle.slug}`}
                className="focus-ring mt-6 inline-flex w-fit items-center gap-2 text-sm font-semibold text-industrial-700 transition hover:text-navy-950"
              >
                View Test System
                <span aria-hidden="true">{">"}</span>
              </Link>
            </div>
            <div className="relative aspect-[16/9] min-w-0 bg-white lg:order-last lg:aspect-auto lg:min-h-[340px]">
              <Image
                src={vibrationArticle.image.src}
                alt={vibrationArticle.image.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 700px"
                className="object-cover"
              />
            </div>
          </div>
        </Container>
      </Section>

      <Section className="border-b border-metal-200 bg-white">
        <Container>
          <TechnologySectionHeading number="03" category={applicationCategory} />

          <article className="mt-11 grid overflow-hidden border-y border-metal-200 lg:grid-cols-[1.08fr_0.92fr]">
            <div className="relative aspect-[16/10] min-w-0 bg-navy-950 lg:aspect-auto lg:min-h-[470px]">
              <Image
                src={upgradeArticle.image.src}
                alt={upgradeArticle.image.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 680px"
                className="object-cover"
              />
            </div>
            <div className="flex flex-col justify-center bg-metal-50 p-7 sm:p-10 lg:p-12">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-industrial-700">
                Featured Upgrade Project
              </p>
              <h3 className="mt-3 text-2xl font-semibold leading-8 text-navy-950 sm:text-3xl">
                {upgradeArticle.title}
              </h3>
              <p className="mt-5 text-base leading-7 text-slate-600">{upgradeArticle.summary}</p>
              <ul className="mt-7 grid gap-3 text-sm font-semibold leading-6 text-navy-950">
                <li className="border-l-2 border-industrial-600 pl-4">Review existing pressure loss</li>
                <li className="border-l-2 border-industrial-600 pl-4">
                  Check minimum, normal and maximum flow
                </li>
                <li className="border-l-2 border-industrial-600 pl-4">
                  Confirm straight pipe and installation space
                </li>
              </ul>
              <Link
                href={`/technology/${upgradeArticle.slug}`}
                className="focus-ring mt-8 inline-flex w-fit items-center gap-2 text-sm font-semibold text-industrial-700 transition hover:text-navy-950"
              >
                View Project
                <span aria-hidden="true">{">"}</span>
              </Link>
            </div>
          </article>
        </Container>
      </Section>

      <CTASection
        title="Discuss the process condition behind the measurement."
        text="Share the medium, flow range, pressure, temperature, pipe size, vibration and installation details for a technical review."
        imageSrc="/images/technology/vibration-measurement-test-system.jpg"
        imageAlt="Velomac in-house vibration measurement test system"
        surfaceClassName="bg-industrial-700"
      />
    </>
  );
}

function TechnologySectionHeading({
  number,
  category
}: {
  number: string;
  category: TechnologyCategory;
}) {
  return (
    <div className="grid gap-5 sm:grid-cols-[92px_1fr] lg:grid-cols-[108px_1fr_auto] lg:items-end lg:gap-8">
      <p className="text-5xl font-semibold leading-none text-industrial-200 sm:text-6xl" aria-hidden="true">
        {number}
      </p>
      <div className="max-w-3xl border-l-2 border-industrial-600 pl-5 sm:pl-7">
        <h2 className="text-3xl font-semibold tracking-normal text-navy-950 sm:text-4xl">
          {category.title}
        </h2>
        <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">{category.description}</p>
      </div>
      <Link
        href={`/technology/${category.slug}`}
        className="focus-ring inline-flex w-fit items-center gap-2 text-sm font-semibold text-industrial-700 transition hover:text-navy-950 sm:col-start-2 lg:col-start-auto"
      >
        Explore This Area
        <span aria-hidden="true">{">"}</span>
      </Link>
    </div>
  );
}
