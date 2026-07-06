import Image from "next/image";
import Link from "next/link";
import { site } from "@/content/site";

export function CTASection({
  title,
  text,
  buttonLabel = site.buttons.requestQuote,
  href = "/contact",
  imageSrc,
  imageAlt,
  detailChips,
  surfaceClassName = "bg-navy-950 blueprint-surface dark-technical-grid"
}: {
  title: string;
  text: string;
  buttonLabel?: string;
  href?: string;
  imageSrc?: string;
  imageAlt?: string;
  detailChips?: string[];
  surfaceClassName?: string;
}) {
  const hasSideContent = Boolean(imageSrc || detailChips?.length);

  return (
    <section className={`${surfaceClassName} py-16 text-white sm:py-20`}>
      <div
        className={`mx-auto grid w-full max-w-[1200px] gap-8 px-5 sm:px-6 lg:items-center lg:px-8 ${
          hasSideContent ? "lg:grid-cols-[0.95fr_0.72fr]" : "lg:grid-cols-[1fr_auto]"
        }`}
      >
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-200">Selection support</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-normal sm:text-4xl">{title}</h2>
          <p className="mt-5 text-base leading-7 text-slate-300 sm:text-lg">{text}</p>
          {hasSideContent ? (
            <Link
              href={href}
              className="focus-ring mt-8 inline-flex w-fit items-center justify-center gap-2 border border-white bg-white px-5 py-3 text-sm font-semibold text-navy-950 transition hover:bg-metal-100"
            >
              {buttonLabel}
              <span aria-hidden="true">{">"}</span>
            </Link>
          ) : null}
        </div>
        {imageSrc ? (
          <div className="relative min-h-[240px] overflow-hidden rounded-[6px] bg-white/10 sm:min-h-[300px]">
            <Image
              src={imageSrc}
              alt={imageAlt || "Industrial flow measurement application context"}
              fill
              sizes="(min-width: 1024px) 430px, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-navy-950/10" />
          </div>
        ) : detailChips?.length ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {detailChips.map((chip) => (
              <div
                key={chip}
                className="border border-white/15 bg-white/[0.07] px-4 py-4 text-sm font-semibold leading-6 text-blue-50"
              >
                {chip}
              </div>
            ))}
          </div>
        ) : (
          <Link
            href={href}
            className="focus-ring inline-flex w-fit items-center justify-center gap-2 border border-white bg-white px-5 py-3 text-sm font-semibold text-navy-950 transition hover:bg-metal-100"
          >
            {buttonLabel}
            <span aria-hidden="true">{">"}</span>
          </Link>
        )}
      </div>
    </section>
  );
}
