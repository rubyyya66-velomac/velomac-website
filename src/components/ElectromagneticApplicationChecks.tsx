"use client";

import { useEffect, useRef, useState } from "react";
import { ApplicationReviewLink } from "@/components/ApplicationReviewLink";
import { Container } from "@/components/Layout";

const checks = [
  {
    number: "01",
    title: "Full Pipe",
    question: "Is the measuring tube completely filled during operation?",
    note: "Electromagnetic flow measurement requires a full pipe. Partial filling, air pockets or unsuitable high-point installation can cause unstable or misleading readings.",
    detail: "Check horizontal or vertical installation, high points, downstream discharge conditions and whether air can collect around the electrodes."
  },
  {
    number: "02",
    title: "Conductivity",
    question: "Is the liquid conductive enough for electromagnetic measurement?",
    note: "Conductivity can differ across wastewater, reclaimed water, RO feed, treated water and highly purified water. Confirm the actual value at the measurement point.",
    detail: "Review the real process medium and confirm conductivity under normal and low-load operating conditions rather than relying only on a general water description."
  },
  {
    number: "03",
    title: "Grounding",
    question: "Is the meter correctly grounded for the actual piping system?",
    note: "Check the grounding arrangement, especially with non-metallic piping, lined pipes or electrically noisy installations.",
    detail: "Record the pipe material, grounding-ring or grounding-electrode arrangement and nearby sources of electrical noise for application review."
  },
  {
    number: "04",
    title: "Air / Solids",
    question: "Could air, bubbles, suspended solids or deposits be affecting the signal?",
    note: "Wastewater, slurry, chemical dosing, pump conditions and process transitions can introduce air or changing solids content. Review these together with velocity and installation position.",
    detail: "Check pump suction and discharge conditions, aeration, changing solids concentration and whether coating or deposits can form around the electrodes."
  },
  {
    number: "05",
    title: "Electrode & Liner",
    question: "Do the wetted materials match the actual medium?",
    note: "Review chemical composition, concentration, temperature, abrasion, coating tendency and cleaning conditions before confirming electrode and liner materials.",
    detail: "Include the medium name, concentration, operating temperature, cleaning chemicals or cycles and any known abrasion or coating behavior."
  }
] as const;

export function ElectromagneticApplicationChecks() {
  const sectionRef = useRef<HTMLElement>(null);
  const viewedRef = useRef(false);
  const [expandedCheck, setExpandedCheck] = useState<string | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || viewedRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || viewedRef.current) return;
        viewedRef.current = true;
        trackCheckEvent("electromagnetic_application_check_view");
        observer.disconnect();
      },
      { threshold: 0.3 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  function toggleCheck(title: string) {
    const willExpand = expandedCheck !== title;
    setExpandedCheck(willExpand ? title : null);
    if (willExpand) {
      trackCheckEvent("electromagnetic_application_check_expand", { application_check: title });
    }
  }

  return (
    <section
      ref={sectionRef}
      id="application-checks"
      aria-labelledby="application-checks-title"
      className="scroll-mt-28 border-y border-metal-200 bg-[#f7f9fb] py-[var(--editable-section-spacing-mobile)] sm:py-[var(--editable-section-spacing-tablet)] lg:py-[var(--editable-section-spacing-desktop)]"
    >
      <Container>
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-industrial-700">
            Electromagnetic application check
          </p>
          <h2 id="application-checks-title" className="mt-3 text-2xl font-semibold tracking-normal text-navy-950 sm:text-4xl">
            Before Blaming the Meter, Check the Application
          </h2>
          <p className="mt-3 text-base leading-7 text-slate-600 sm:mt-5 sm:text-lg">
            Unstable readings often start with the application conditions. Check these five points before changing the meter or configuration.
          </p>
        </div>

        <div className="mt-7 grid gap-3 sm:mt-9 sm:grid-cols-2 sm:gap-4 lg:grid-cols-5">
          {checks.map((check) => {
            const isExpanded = expandedCheck === check.title;
            const detailId = `application-check-${check.number}`;

            return (
              <article key={check.number} className="flex h-full flex-col border border-metal-200 bg-white">
                <div className="flex flex-1 flex-col p-4 sm:p-5">
                  <p className="text-xs font-semibold tracking-[0.16em] text-industrial-700">{check.number}</p>
                  <h3 className="mt-2 text-lg font-semibold leading-6 text-navy-950">{check.title}</h3>
                  <p className="mt-3 text-sm font-semibold leading-6 text-navy-950">{check.question}</p>
                  <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">{check.note}</p>
                  <button
                    type="button"
                    aria-expanded={isExpanded}
                    aria-controls={detailId}
                    onClick={() => toggleCheck(check.title)}
                    className="focus-ring mt-4 flex min-h-11 w-full items-center justify-between border-t border-metal-200 pt-3 text-left text-sm font-semibold text-industrial-700 transition hover:text-navy-950"
                  >
                    Review points
                    <span aria-hidden="true" className="text-lg font-normal leading-none">{isExpanded ? "−" : "+"}</span>
                  </button>
                  <div id={detailId} className={isExpanded ? "block" : "hidden"}>
                    <p className="border-l-2 border-industrial-500 pl-3 pt-2 text-sm leading-6 text-slate-600">
                      {check.detail}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-7 border-t border-metal-300 pt-6 sm:mt-9 sm:flex sm:items-end sm:justify-between sm:gap-8">
          <div className="max-w-3xl">
            <h3 className="text-xl font-semibold leading-7 text-navy-950">
              Not sure which condition is affecting the measurement?
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600 sm:text-base">
              Send us the medium, pipe size, minimum / normal / maximum flow, pressure, temperature and installation conditions.
            </p>
          </div>
          <ApplicationReviewLink
            href="#application-review"
            sourceType="product"
            sourceSection="electromagnetic-application-checks"
            sourcePath="/products/electromagnetic-flowmeter"
            productSlug="electromagnetic-flowmeter"
            mediumType="liquid"
            className="focus-ring mt-5 inline-flex min-h-12 w-fit items-center justify-center gap-2 bg-navy-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-industrial-700 sm:mt-0"
          >
            Review Your Application <span aria-hidden="true">→</span>
          </ApplicationReviewLink>
        </div>
      </Container>
    </section>
  );
}

function trackCheckEvent(event: string, details: Record<string, string> = {}) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event,
    page_path: "/products/electromagnetic-flowmeter",
    product_slug: "electromagnetic-flowmeter",
    ...details
  });
}
