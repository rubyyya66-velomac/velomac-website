import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/Layout";
import { homepage } from "@/content/homepage";

export function HeroSection() {
  const { hero } = homepage;
  const applicationChips = [
    { label: "Steam", href: "/applications#steam-measurement" },
    { label: "Gas", href: "/applications#gas-flow-measurement" },
    { label: "Liquid", href: "/applications#conductive-liquid-measurement" },
    { label: "Chemical", href: "/applications#chemical-process-lines" }
  ];

  return (
    <section className="homepage-hero relative isolate overflow-hidden bg-navy-950 text-white">
      <div className="homepage-hero__grid" aria-hidden="true" />
      <div className="homepage-hero__flow homepage-hero__flow--one" aria-hidden="true" />
      <div className="homepage-hero__flow homepage-hero__flow--two" aria-hidden="true" />

      <Container className="relative z-10 grid gap-11 py-[var(--editable-hero-section-padding)] lg:min-h-[700px] lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-14">
        <div className="max-w-2xl lg:pt-4">
          <p className="inline-flex border border-blue-300/25 bg-white/[0.06] px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-blue-100">
            {hero.label}
          </p>
          <h1 className="mt-6 text-[length:var(--editable-hero-headline-size)] font-semibold leading-[1.02] tracking-normal text-white">
            {hero.headline}
          </h1>
          <p className="mt-6 max-w-xl text-[length:var(--editable-hero-subheadline-size)] leading-8 text-slate-300">
            {hero.subheadline}
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              href={hero.primaryCta.href}
              className="focus-ring inline-flex min-h-12 items-center justify-center gap-2 border border-white bg-white px-5 py-3 text-sm font-semibold text-navy-950 transition hover:bg-metal-100"
            >
              {hero.primaryCta.label}
              <span aria-hidden="true">{">"}</span>
            </Link>
            <Link
              href={hero.secondaryCta.href}
              className="focus-ring inline-flex min-h-12 items-center justify-center border border-white/25 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-white transition hover:border-blue-200 hover:bg-white/10"
            >
              {hero.secondaryCta.label}
            </Link>
          </div>

          <div className="mt-9 flex flex-wrap gap-2.5" aria-label="Velomac trust points">
            {homepage.trustPoints.map((item) => (
              <span
                key={item.title}
                className="border border-white/10 bg-white/[0.035] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-blue-50/90"
              >
                {item.title}
              </span>
            ))}
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[var(--editable-hero-image-max-width)] lg:mx-0 lg:ml-auto">
          <div className="homepage-hero__visual">
            <div className="relative" style={{ aspectRatio: "var(--editable-hero-image-panel-aspect)" }}>
              <Image
                src={hero.image.src}
                alt={hero.image.alt}
                fill
                priority
                sizes="(min-width: 1024px) 56vw, 100vw"
                className="object-contain drop-shadow-[0_24px_48px_rgba(0,0,0,0.26)] lg:scale-[1.06]"
              />
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-blue-100/80">
            {applicationChips.map((chip) => (
              <Link
                key={chip.href}
                href={chip.href}
                className="focus-ring border border-white/15 bg-white/[0.05] px-3 py-2 transition hover:border-blue-200 hover:bg-white/[0.09]"
              >
                {chip.label}
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
