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
  getTechnologyArticlesByCategory
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

const calibrationMethods = [
  {
    code: "01",
    title: "Gas Flow Calibration",
    image: "/images/technology/calibration/gas-flow-calibration.jpg",
    imageAlt: "Gas flow calibration system with controlled comparison lines",
    medium: "Gas",
    meterClass: "1.0",
    description: "Controlled gas-flow comparison across configured operating points.",
    href: "/technology/gas-flow-calibration",
    linkLabel: "Explore Gas Calibration"
  },
  {
    code: "02",
    title: "Master-Meter Liquid Calibration",
    image: "/images/technology/calibration/master-meter-liquid-calibration.jpg",
    imageAlt: "Master-meter liquid calibration lines in the Velomac workshop",
    medium: "Liquid",
    meterClass: "0.5",
    description: "Liquid circulation and comparison with reference flow meters.",
    href: "/technology/master-meter-liquid-calibration",
    linkLabel: "Explore Master-Meter Calibration"
  },
  {
    code: "03",
    title: "Gravimetric Liquid Calibration",
    image: "/images/technology/calibration/gravimetric-liquid-calibration.jpg",
    imageAlt: "Gravimetric liquid calibration equipment using METTLER TOLEDO weighing equipment",
    medium: "Liquid",
    meterClass: "0.3",
    description: "Mass-based liquid calibration using METTLER TOLEDO weighing equipment.",
    href: "/technology/gravimetric-liquid-calibration",
    linkLabel: "Explore Gravimetric Calibration"
  }
] as const;

const testingCapabilities = [
  "Vibration measurement test system",
  "Wide-range vibration testing",
  "Sensor and signal validation"
];

export default function TechnologyPage() {
  const { hero } = technologyContent;
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
            number="01"
            eyebrow="Sensing and Product Design"
            title="Sensor & Product Development"
            description="Product and sensing developments created for demanding flow measurement conditions."
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
            number="02"
            eyebrow="Reference Comparison"
            title="Flow Calibration Systems"
            description="Gas and liquid calibration matched to the medium and required accuracy class."
          />

          <div className="mt-11 border-y border-blue-200 bg-white lg:grid lg:grid-cols-3">
            {calibrationMethods.map((calibration, index) => (
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
                    src={calibration.image}
                    alt={calibration.imageAlt}
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
            number="03"
            eyebrow="Controlled Observation"
            title="Testing & Verification Systems"
            description="Controlled testing of meter, sensor and signal behavior under defined conditions."
            dark
          />

          <div className="mt-9 grid gap-9 lg:grid-cols-[1.65fr_0.85fr] lg:items-center lg:gap-10">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="relative aspect-[16/10] min-w-0 overflow-hidden bg-white/5">
                <Image
                  src="/images/technology/vibration-measurement-test-system.jpg"
                  alt="Velomac vibration measurement test system"
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 34vw, 360px"
                  className="object-cover"
                />
              </div>
              <div className="relative aspect-[16/10] min-w-0 overflow-hidden border border-white/15 bg-white">
                <Image
                  src="/images/technology/anti-vibration-dynamic-enabled.jpg"
                  alt="Flow signal waveform observed during controlled vibration testing"
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 34vw, 360px"
                  className="object-cover"
                />
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-200">
                Current capability
              </p>
              <h3 className="mt-3 text-2xl font-semibold leading-8 text-white sm:text-3xl">
                Observe behavior under controlled conditions
              </h3>
              <ul className="mt-7 grid gap-3">
                {testingCapabilities.map((item) => (
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
                View Vibration Test System
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
            number="04"
            eyebrow="Process-Based Engineering"
            title="Application Upgrade Projects"
            description="Measurement upgrade reviews developed around actual process, installation and operating conditions."
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
                Featured Upgrade Project
              </p>
              <h3 className="mt-3 text-2xl font-semibold leading-8 text-navy-950 sm:text-3xl">
                {upgradeArticle.title}
              </h3>
              <ul className="mt-7 grid gap-4 text-sm font-semibold leading-6 text-navy-950">
                <li className="border-l-2 border-industrial-600 pl-4">
                  Review the existing method and pressure loss.
                </li>
                <li className="border-l-2 border-industrial-600 pl-4">
                  Check minimum, normal and maximum flow.
                </li>
                <li className="border-l-2 border-industrial-600 pl-4">
                  Confirm straight pipe and installation space.
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
        detailChips={["Medium", "Flow range", "Pressure and temperature", "Installation details"]}
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
  dark = false
}: {
  number: string;
  eyebrow: string;
  title: string;
  description: string;
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
      </div>
    </div>
  );
}
