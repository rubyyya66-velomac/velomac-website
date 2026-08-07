import Image from "next/image";
import Link from "next/link";
import type { Application } from "@/types/content";

export function ApplicationCard({
  application,
  variant = "default"
}: {
  application: Application;
  variant?: "default" | "featured";
}) {
  const isFeatured = variant === "featured";

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[6px] border border-metal-200 bg-white transition duration-300 hover:border-industrial-600 hover:shadow-soft">
      <Link href={`/applications#${application.slug}`} className="focus-ring block border-b border-metal-200 bg-navy-950">
        <div
          className={`relative w-full ${isFeatured ? "aspect-[16/9]" : ""}`}
          style={!isFeatured ? { aspectRatio: "var(--editable-card-image-aspect)" } : undefined}
        >
          <Image
            src={application.image.src}
            alt={application.image.alt}
            fill
            sizes={isFeatured ? "(min-width: 1024px) 33vw, 100vw" : "(min-width: 768px) 50vw, 100vw"}
            className="object-cover object-[center_58%] transition duration-300 group-hover:scale-[1.03]"
          />
        </div>
      </Link>
      <div className={isFeatured ? "flex flex-1 flex-col p-7" : "flex flex-1 flex-col p-6"}>
        <div className="mb-5 h-1 w-14 bg-industrial-600" />
        <h3 className={`${isFeatured ? "text-2xl" : "text-lg"} font-semibold text-navy-950`}>{application.title}</h3>
        <p className="mt-3 flex-1 overflow-hidden text-sm leading-6 text-slate-600 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3]">
          {application.focus}
        </p>
        <Link
          href={`/applications#${application.slug}`}
          className="focus-ring mt-5 inline-flex items-center gap-2 rounded-sm text-sm font-semibold text-industrial-700 transition hover:text-navy-950"
        >
          Application notes
          <span aria-hidden="true">{">"}</span>
        </Link>
      </div>
    </article>
  );
}
