import Image from "next/image";
import Link from "next/link";
import {
  getTechnologyCategory,
  type TechnologyArticle,
  type TechnologyCategoryId
} from "@/content/technology";

const categoryStyles: Record<TechnologyCategoryId, string> = {
  "product-sensor-innovation": "border-blue-200 bg-blue-50 text-industrial-700",
  "flow-calibration-systems": "border-blue-200 bg-blue-50 text-industrial-700",
  "testing-calibration": "border-slate-200 bg-slate-100 text-slate-700",
  "application-engineering": "border-teal-200 bg-teal-50 text-teal-800"
};

export function TechnologyCategoryLabel({
  categoryId,
  className = ""
}: {
  categoryId: TechnologyCategoryId;
  className?: string;
}) {
  const category = getTechnologyCategory(categoryId);

  return (
    <span
      className={`inline-flex w-fit border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${categoryStyles[categoryId]} ${className}`}
    >
      {category?.title}
    </span>
  );
}

export function TechnologyCard({
  article,
  showCategoryLabel = true
}: {
  article: TechnologyArticle;
  showCategoryLabel?: boolean;
}) {
  const useContain = article.image.fit === "contain";

  return (
    <article className="group flex h-full flex-col overflow-hidden border border-metal-200 bg-white transition hover:border-industrial-500">
      <Link
        href={`/technology/${article.slug}`}
        className={`focus-ring relative block aspect-[16/10] border-b border-metal-200 ${
          useContain ? "bg-metal-50" : "bg-navy-950"
        }`}
        aria-label={`View ${article.title}`}
      >
        <Image
          src={article.image.src}
          alt={article.image.alt}
          fill
          sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
          className={`${useContain ? "object-contain p-4 sm:p-5" : "object-cover"} transition duration-300 group-hover:scale-[1.015]`}
        />
      </Link>
      <div className="flex flex-1 flex-col p-6">
        {showCategoryLabel ? <TechnologyCategoryLabel categoryId={article.categoryId} /> : null}
        <h3
          className={`${showCategoryLabel ? "mt-4" : "lg:min-h-14"} text-xl font-semibold leading-7 text-navy-950`}
        >
          {article.title}
        </h3>
        <p className="mt-3 line-clamp-2 text-[15px] leading-7 text-slate-600">{article.summary}</p>
        <Link
          href={`/technology/${article.slug}`}
          className="focus-ring mt-auto inline-flex w-fit items-center gap-2 pt-6 text-sm font-semibold text-industrial-700 transition hover:text-navy-950"
        >
          View Details
          <span aria-hidden="true">{">"}</span>
        </Link>
      </div>
    </article>
  );
}
