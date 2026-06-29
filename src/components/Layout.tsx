import type { ReactNode } from "react";

export function Container({
  children,
  className = ""
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`mx-auto w-full max-w-[1200px] px-5 sm:px-6 lg:px-8 ${className}`}>{children}</div>;
}

export function Section({
  children,
  className = "",
  id
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={`py-[var(--editable-section-spacing-mobile)] sm:py-[var(--editable-section-spacing-tablet)] lg:py-[var(--editable-section-spacing-desktop)] ${className}`}>
      {children}
    </section>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  className = ""
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    <div className={`max-w-3xl ${className}`}>
      {eyebrow ? (
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-industrial-700">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="mt-3 text-3xl font-semibold tracking-normal text-navy-950 sm:text-4xl lg:text-[2.75rem] lg:leading-[1.08]">
        {title}
      </h2>
      {description ? (
        <p className="mt-5 text-base leading-7 text-slate-600 sm:text-lg">{description}</p>
      ) : null}
    </div>
  );
}

export function PageIntro({
  eyebrow,
  title,
  description
}: {
  eyebrow?: string;
  title: string;
  description: string;
}) {
  return (
    <div className="border-b border-navy-800 bg-navy-950 text-white blueprint-surface dark-technical-grid">
      <Container className="py-[var(--editable-section-spacing-mobile)] sm:py-[var(--editable-section-spacing-tablet)] lg:py-[var(--editable-section-spacing-desktop)]">
        <div className="max-w-4xl border-l-2 border-industrial-400 pl-6 sm:pl-8">
          {eyebrow ? (
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-200">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="mt-4 text-4xl font-semibold tracking-normal text-white sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300 sm:text-xl">{description}</p>
        </div>
      </Container>
    </div>
  );
}
