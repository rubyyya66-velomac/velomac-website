import Image from "next/image";
import Link from "next/link";
import { CTASection } from "@/components/CTASection";
import { Container, Section } from "@/components/Layout";
import { TechnologyCard, TechnologyCategoryLabel } from "@/components/TechnologyCard";
import {
  getTechnologyArticle,
  getTechnologyCategory,
  type TechnologyArticle
} from "@/content/technology";
import type {
  TechnologyDetailFact,
  TechnologyDetailImage,
  TechnologyDetailModule,
  TechnologyDetailPageContent
} from "@/content/technologyDetailPages";

export function TechnologyDetailExperience({
  article,
  page
}: {
  article: TechnologyArticle;
  page: TechnologyDetailPageContent;
}) {
  const category = getTechnologyCategory(article.categoryId);
  const relatedArticles = article.relatedSlugs
    .map((slug) => getTechnologyArticle(slug))
    .filter((related): related is TechnologyArticle => Boolean(related))
    .slice(0, 3);

  return (
    <>
      <section className="border-b border-metal-200 bg-white">
        <Container className="py-8 sm:py-10 lg:py-14">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
            <Link href="/" className="focus-ring rounded-sm transition hover:text-industrial-700">
              Home
            </Link>
            <span aria-hidden="true">/</span>
            <Link href="/technology" className="focus-ring rounded-sm transition hover:text-industrial-700">
              Technology
            </Link>
            <span aria-hidden="true">/</span>
            {category ? (
              <>
                <Link
                  href={`/technology/${category.slug}`}
                  className="focus-ring rounded-sm transition hover:text-industrial-700"
                >
                  {category.title}
                </Link>
                <span aria-hidden="true">/</span>
              </>
            ) : null}
            <span className="text-slate-700">{article.title}</span>
          </nav>

          <div className="mt-8 grid gap-9 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-14">
            <div className="max-w-2xl">
              <TechnologyCategoryLabel categoryId={article.categoryId} />
              <h1 className="mt-5 text-4xl font-semibold leading-[1.08] text-navy-950 sm:text-5xl">
                {article.title}
              </h1>
              <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
                {page.heroIntroduction}
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/contact"
                  className="focus-ring inline-flex items-center gap-2 bg-industrial-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-industrial-700"
                >
                  Request a Quote
                  <span aria-hidden="true">{">"}</span>
                </Link>
                {category ? (
                  <Link
                    href={`/technology/${category.slug}`}
                    className="focus-ring inline-flex items-center border border-metal-300 bg-white px-5 py-3 text-sm font-semibold text-navy-950 transition hover:border-industrial-600 hover:text-industrial-700"
                  >
                    Back to {category.title}
                  </Link>
                ) : null}
              </div>
            </div>
            <DetailImage image={page.heroImage} priority context="hero" />
          </div>
        </Container>
      </section>

      <FactStrip facts={page.facts} />

      {page.modules.map((module, index) => (
        <TechnologyModule key={`${module.kind}-${module.title}`} module={module} index={index} />
      ))}

      <Section className="border-t border-metal-200 bg-metal-50">
        <Container>
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-industrial-700">
              {page.relatedEyebrow}
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-navy-950 sm:text-4xl">
              {page.relatedHeading}
            </h2>
          </div>
          <div className="mt-9 grid gap-6 md:grid-cols-3">
            {relatedArticles.map((related) => (
              <TechnologyCard key={related.slug} article={related} />
            ))}
          </div>
        </Container>
      </Section>

      <CTASection
        title={page.cta.title}
        text={page.cta.text}
        buttonLabel="Request a Quote"
        href="/contact"
        surfaceClassName="bg-industrial-700"
      />
    </>
  );
}

function FactStrip({ facts }: { facts: TechnologyDetailFact[] }) {
  const gridClass =
    facts.length === 2
      ? "sm:grid-cols-2"
      : facts.length === 3
        ? "sm:grid-cols-3"
        : "sm:grid-cols-2 lg:grid-cols-4";

  return (
    <section className="border-b border-metal-200 bg-metal-50" aria-label="Key capabilities">
      <Container>
        <div className={`grid ${gridClass}`}>
          {facts.map((fact, index) => (
            <div
              key={fact.label}
              className={`py-6 sm:px-6 lg:py-7 ${
                index > 0 ? "border-t border-metal-200 sm:border-l sm:border-t-0" : ""
              }`}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                {fact.label}
              </p>
              <p className="mt-2 text-xl font-semibold leading-7 text-navy-950">{fact.value}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

function TechnologyModule({ module, index }: { module: TechnologyDetailModule; index: number }) {
  if (module.kind === "split") {
    return <SplitModule module={module} index={index} />;
  }

  if (module.kind === "cards") {
    return <CardsModule module={module} index={index} />;
  }

  if (module.kind === "steps") {
    return <StepsModule module={module} index={index} />;
  }

  if (module.kind === "table") {
    return <TableModule module={module} index={index} />;
  }

  if (module.kind === "gallery") {
    return <GalleryModule module={module} index={index} />;
  }

  if (module.kind === "highlight") {
    return <HighlightModule module={module} index={index} />;
  }

  return <ChecklistModule module={module} index={index} />;
}

function SplitModule({ module, index }: { module: TechnologyDetailModule; index: number }) {
  return (
    <ModuleSection module={module}>
      <Container
        className={`grid gap-9 lg:grid-cols-2 lg:items-center lg:gap-14 ${
          module.reverse ? "lg:[&>*:first-child]:order-2" : ""
        }`}
      >
        <ModuleCopy module={module} index={index} />
        {module.image ? <DetailImage image={module.image} context="split" /> : null}
      </Container>
    </ModuleSection>
  );
}

function CardsModule({ module, index }: { module: TechnologyDetailModule; index: number }) {
  const itemCount = module.items?.length ?? 0;
  const gridClass =
    itemCount === 2
      ? "md:grid-cols-2"
      : itemCount === 4
        ? "sm:grid-cols-2 lg:grid-cols-4"
        : "md:grid-cols-3";

  return (
    <ModuleSection module={module}>
      <Container>
        <ModuleHeading module={module} index={index} />
        <div className={`mt-9 grid gap-x-8 gap-y-8 ${gridClass}`}>
          {module.items?.map((item) => (
            <article key={item.title} className="border-t-2 border-industrial-600 pt-5">
              <h3 className="text-xl font-semibold leading-7 text-navy-950">{item.title}</h3>
              {item.text ? <p className="mt-3 text-sm leading-6 text-slate-600">{item.text}</p> : null}
              {item.bullets?.length ? <BulletList items={item.bullets} className="mt-4" /> : null}
            </article>
          ))}
        </div>
      </Container>
    </ModuleSection>
  );
}

function StepsModule({ module, index }: { module: TechnologyDetailModule; index: number }) {
  return (
    <ModuleSection module={module}>
      <Container>
        <ModuleHeading module={module} index={index} />
        <ol className="mt-9 grid gap-0 border-y border-metal-300 sm:grid-cols-2 lg:grid-cols-5">
          {module.items?.map((item, itemIndex) => (
            <li
              key={item.title}
              className={`py-6 sm:px-5 lg:py-7 ${
                itemIndex > 0 ? "border-t border-metal-300 sm:border-l sm:border-t-0" : ""
              }`}
            >
              <h3 className="text-base font-semibold leading-6 text-navy-950">{item.title}</h3>
              {item.text ? <p className="mt-2 text-sm leading-6 text-slate-600">{item.text}</p> : null}
            </li>
          ))}
        </ol>
      </Container>
    </ModuleSection>
  );
}

function TableModule({ module, index }: { module: TechnologyDetailModule; index: number }) {
  if (!module.table) return null;
  const dark = module.tone === "dark";

  return (
    <ModuleSection module={module}>
      <Container>
        <div className="grid gap-8 lg:grid-cols-[0.32fr_0.68fr] lg:gap-14">
          <ModuleHeading module={module} index={index} compact />
          <div className="min-w-0">
            {module.result ? (
              <div className={`mb-6 border-l-2 pl-5 ${dark ? "border-blue-300" : "border-industrial-600"}`}>
                <p
                  className={`text-xs font-semibold uppercase tracking-[0.14em] ${
                    dark ? "text-blue-200" : "text-slate-500"
                  }`}
                >
                  {module.result.label}
                </p>
                <p className={`mt-2 text-2xl font-semibold ${dark ? "text-white" : "text-navy-950"}`}>
                  {module.result.value}
                </p>
              </div>
            ) : null}
            <div className={`overflow-x-auto border ${dark ? "border-white/20" : "border-metal-200"}`}>
              <table className="w-full min-w-[680px] border-collapse text-left">
                <thead className={dark ? "bg-white/10 text-white" : "bg-navy-950 text-white"}>
                  <tr>
                    {module.table.columns.map((column) => (
                      <th
                        key={column}
                        scope="col"
                        className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.1em]"
                      >
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className={dark ? "divide-y divide-white/15" : "divide-y divide-metal-200 bg-white"}>
                  {module.table.rows.map((row) => (
                    <tr key={row.join("|")}>
                      {row.map((cell, cellIndex) => (
                        <td
                          key={`${cellIndex}-${cell}`}
                          className={`px-4 py-3.5 text-sm leading-6 ${
                            dark
                              ? cellIndex === 0
                                ? "font-semibold text-white"
                                : "text-blue-50"
                              : cellIndex === 0
                                ? "font-semibold text-navy-950"
                                : "text-slate-600"
                          }`}
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Container>
    </ModuleSection>
  );
}

function GalleryModule({ module, index }: { module: TechnologyDetailModule; index: number }) {
  const imageCount = module.images?.length ?? 0;
  const gridClass =
    imageCount === 2 ? "md:grid-cols-2" : imageCount === 4 ? "md:grid-cols-2" : "md:grid-cols-3";

  return (
    <ModuleSection module={module}>
      <Container>
        <ModuleHeading module={module} index={index} />
        <div className={`mt-9 grid gap-6 ${gridClass}`}>
          {module.images?.map((image) => (
            <DetailImage key={`${image.src}-${image.caption ?? ""}`} image={image} context="gallery" />
          ))}
        </div>
      </Container>
    </ModuleSection>
  );
}

function HighlightModule({ module, index }: { module: TechnologyDetailModule; index: number }) {
  return (
    <ModuleSection module={{ ...module, tone: "dark" }}>
      <Container className="grid gap-8 lg:grid-cols-[0.7fr_0.3fr] lg:items-end lg:gap-16">
        <ModuleHeading module={{ ...module, tone: "dark" }} index={index} compact />
        {module.result ? (
          <div className="border-l-2 border-blue-300 pl-5">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-200">
              {module.result.label}
            </p>
            <p className="mt-2 text-2xl font-semibold leading-8 text-white">{module.result.value}</p>
          </div>
        ) : null}
      </Container>
    </ModuleSection>
  );
}

function ChecklistModule({ module, index }: { module: TechnologyDetailModule; index: number }) {
  return (
    <ModuleSection module={module}>
      <Container className="grid gap-8 lg:grid-cols-[0.36fr_0.64fr] lg:gap-16">
        <ModuleHeading module={module} index={index} compact />
        <ul className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
          {module.bullets?.map((item) => (
            <li
              key={item}
              className="border-l-2 border-industrial-600 pl-4 text-sm font-semibold leading-6 text-navy-950"
            >
              {item}
            </li>
          ))}
        </ul>
      </Container>
    </ModuleSection>
  );
}

function ModuleSection({
  module,
  children
}: {
  module: TechnologyDetailModule;
  children: React.ReactNode;
}) {
  const surface =
    module.tone === "dark"
      ? "bg-navy-950 text-white"
      : module.tone === "blue"
        ? "bg-[#eef3f8]"
        : module.tone === "soft"
          ? "bg-metal-50"
          : "bg-white";

  return <Section className={`border-b border-metal-200 ${surface}`}>{children}</Section>;
}

function ModuleCopy({ module, index }: { module: TechnologyDetailModule; index: number }) {
  return (
    <div className="max-w-2xl">
      <ModuleHeading module={module} index={index} compact />
      {module.bullets?.length ? <BulletList items={module.bullets} className="mt-6" /> : null}
    </div>
  );
}

function ModuleHeading({
  module,
  index,
  compact = false
}: {
  module: TechnologyDetailModule;
  index: number;
  compact?: boolean;
}) {
  const dark = module.tone === "dark";

  return (
    <div className={compact ? "max-w-xl" : "max-w-3xl"}>
      <p
        className={`text-xs font-semibold uppercase tracking-[0.18em] ${
          dark ? "text-blue-200" : "text-industrial-700"
        }`}
      >
        {module.eyebrow ?? `Engineering Area ${String(index + 1).padStart(2, "0")}`}
      </p>
      <h2
        className={`mt-3 text-3xl font-semibold leading-tight sm:text-4xl ${
          dark ? "text-white" : "text-navy-950"
        }`}
      >
        {module.title}
      </h2>
      {module.description ? (
        <p className={`mt-4 text-base leading-7 ${dark ? "text-blue-50" : "text-slate-600"}`}>
          {module.description}
        </p>
      ) : null}
    </div>
  );
}

function BulletList({ items, className = "" }: { items: string[]; className?: string }) {
  return (
    <ul className={`grid gap-3 ${className}`}>
      {items.map((item) => (
        <li key={item} className="border-l-2 border-industrial-600 pl-4 text-sm font-semibold leading-6 text-navy-950">
          {item}
        </li>
      ))}
    </ul>
  );
}

function DetailImage({
  image,
  priority = false,
  context
}: {
  image: TechnologyDetailImage;
  priority?: boolean;
  context: "hero" | "split" | "gallery";
}) {
  const useContain = image.fit === "contain";
  const aspect =
    context === "hero" ? "aspect-[16/11]" : context === "gallery" ? "aspect-[16/10]" : "aspect-[4/3]";
  const positionClass = image.position === "top" ? "object-top" : "object-center";

  return (
    <figure className="min-w-0">
      <div
        className={`relative ${aspect} w-full overflow-hidden border border-metal-200 ${
          useContain ? "bg-white" : "bg-metal-100"
        }`}
      >
        <Image
          src={image.src}
          alt={image.alt}
          fill
          priority={priority}
          sizes={
            context === "gallery"
              ? "(max-width: 768px) 100vw, 520px"
              : "(max-width: 1024px) 100vw, 680px"
          }
          className={useContain ? "object-contain p-4 sm:p-6" : `object-cover ${positionClass}`}
        />
      </div>
      {image.caption ? (
        <figcaption className="mt-3 text-xs leading-5 text-slate-500">{image.caption}</figcaption>
      ) : null}
    </figure>
  );
}

