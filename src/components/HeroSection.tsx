import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/Layout";
import { homepage } from "@/content/homepage";

export function HeroSection() {
  const { hero } = homepage;

  return (
    <section className="relative overflow-hidden text-white velomac-blue-surface">
      <Container className="grid gap-12 py-[var(--editable-hero-section-padding)] lg:min-h-[650px] lg:grid-cols-[0.86fr_1.14fr] lg:items-center lg:gap-14">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-200">
            {hero.label}
          </p>
          <h1 className="mt-5 text-[length:var(--editable-hero-headline-size)] font-semibold leading-[1.03] tracking-normal">
            {hero.headline}
          </h1>
          <p className="mt-6 max-w-xl text-[length:var(--editable-hero-subheadline-size)] leading-8 text-slate-300">
            {hero.subheadline}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={hero.primaryCta.href}
              className="focus-ring inline-flex items-center justify-center gap-2 border border-white bg-white px-5 py-3 text-sm font-semibold text-navy-950 transition hover:bg-metal-100"
            >
              {hero.primaryCta.label}
              <span aria-hidden="true">{">"}</span>
            </Link>
            <Link
              href={hero.secondaryCta.href}
              className="focus-ring inline-flex items-center justify-center border border-white/30 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:border-blue-200 hover:bg-white/10"
            >
              {hero.secondaryCta.label}
            </Link>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[var(--editable-hero-image-max-width)] lg:mx-0 lg:ml-auto">
          <div className="rounded-[8px] border border-white/20 bg-white shadow-[0_28px_80px_rgba(6,20,38,0.24)]">
            <div className="relative bg-white" style={{ aspectRatio: "var(--editable-hero-image-panel-aspect)" }}>
              <Image
                src={hero.image.src}
                alt={hero.image.alt}
                fill
                priority
                sizes="(min-width: 1024px) 56vw, 100vw"
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
