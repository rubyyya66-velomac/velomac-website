import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Container, Section } from "@/components/Layout";
import { applications } from "@/content/applications";

export const metadata: Metadata = {
  title: "Flowmeter Applications for Steam, Gas, Liquids and Utilities | Velomac",
  description:
    "Application notes for Velomac flowmeter selection in steam, gas, conductive liquid, chemical, high vibration and energy loss visibility applications."
};

export default function ApplicationsPage() {
  return (
    <>
      <section className="velomac-blue-surface text-white">
        <Container className="py-14 sm:py-16 lg:py-20">
          <div className="max-w-[1120px]">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-100">
              APPLICATIONS
            </p>
            <h1 className="mt-4 text-4xl font-semibold leading-[1.06] tracking-normal text-white sm:text-5xl lg:text-[3.2rem] xl:whitespace-nowrap xl:text-[3.45rem]">
              Flowmeter Selection by Site Condition
            </h1>
            <p className="mt-5 max-w-[820px] text-lg leading-8 text-blue-50 sm:text-xl">
              Industrial flow measurement starts with the operating condition. Review common application scenarios
              before selecting a meter.
            </p>
          </div>
        </Container>
      </section>
      <Section>
        <Container className="max-w-[1180px]">
          <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-semibold tracking-normal text-navy-950 sm:text-4xl lg:text-[2.6rem] lg:leading-[1.08]">
                Match Meter to Site Conditions
              </h2>
              <p className="mt-5 max-w-[680px] text-base leading-7 text-slate-600 sm:text-lg">
                Use media, installation limits and output needs as the starting point before sending site details.
              </p>
            </div>
            <nav aria-label="Application categories" className="flex max-w-[620px] flex-wrap gap-2.5">
              {applications.map((application) => (
                <Link
                  key={application.slug}
                  href={`#${application.slug}`}
                  className="focus-ring rounded-full border border-metal-200/80 bg-metal-50 px-5 py-2.5 text-[15px] font-semibold text-slate-700 transition hover:border-industrial-300 hover:bg-blue-50 hover:text-industrial-700"
                >
                  {application.title}
                </Link>
              ))}
            </nav>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {applications.map((application) => {
              return (
                <article
                  key={application.slug}
                  id={application.slug}
                  className="scroll-mt-28 overflow-hidden rounded-[6px] border border-metal-200 bg-white transition hover:border-industrial-500"
                >
                  <div className="relative aspect-[16/9] border-b border-metal-200 bg-navy-950">
                    <Image
                      src={application.image.src}
                      alt={application.image.alt}
                      fill
                      sizes="(min-width: 1024px) 560px, 100vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6 sm:p-7">
                    <h2 className="text-[1.65rem] font-semibold leading-tight text-navy-950">{application.title}</h2>
                    <p className="mt-3 text-[15px] leading-7 text-slate-600 sm:text-base">{application.cardDescription}</p>
                    <div className="mt-6 grid gap-5">
                      <DetailText title="Where it fits" text={application.whereItFits} />
                      <TagList title="Recommended meters" items={application.suitableMeters} />
                      <TagList title="Site details to prepare" items={application.detailsToSend} />
                    </div>
                    <Link
                      href={`/contact?application=${application.slug}`}
                      className="focus-ring mt-6 inline-flex w-fit items-center gap-2 text-[15px] font-semibold text-industrial-600 transition hover:text-navy-950"
                    >
                      Discuss this application
                      <span aria-hidden="true">{">"}</span>
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="mt-10 overflow-hidden rounded-[6px] p-7 text-white velomac-blue-surface sm:p-8">
            <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-100">Selection support</p>
                <h2 className="mt-3 text-2xl font-semibold text-white">Send Site Details for Selection</h2>
                <p className="mt-3 max-w-3xl text-[15px] leading-7 text-blue-50">
                  Share the fluid, pipe size, flow range, pressure, temperature, quantity and application background.
                </p>
              </div>
              <Link
                href="/contact"
                className="focus-ring inline-flex w-fit gap-2 border border-white bg-white px-5 py-3 text-sm font-semibold text-navy-950 transition hover:bg-metal-100"
              >
                Request a Quote
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
      <p className="mt-2 text-[15px] leading-7 text-slate-600 sm:text-base">{text}</p>
    </div>
  );
}

function TagList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h3 className="text-[13px] font-semibold uppercase tracking-[0.08em] text-navy-950">{title}</h3>
      <ul className="mt-3 flex flex-wrap gap-2.5 text-sm leading-6 text-slate-600">
        {items.map((item) => (
          <li
            key={item}
            className="rounded-full border border-metal-200/60 bg-metal-50 px-3.5 py-2 text-sm font-semibold text-slate-600"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
