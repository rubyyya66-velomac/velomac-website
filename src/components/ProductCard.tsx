import Image from "next/image";
import Link from "next/link";
import { site } from "@/content/site";
import type { Product } from "@/types/content";

type ProductCardVariant = "default" | "featured" | "compact";

export function ProductCard({
  product,
  variant = "default"
}: {
  product: Product;
  variant?: ProductCardVariant;
}) {
  const isFeatured = variant === "featured";
  const isCompact = variant === "compact";

  return (
    <article
      className={`group flex h-full flex-col overflow-hidden rounded-[6px] border border-metal-200 bg-white transition duration-300 hover:-translate-y-0.5 hover:border-industrial-600 ${
        isFeatured ? "lg:grid lg:grid-rows-[auto_1fr]" : ""
      }`}
    >
      <Link href={`/products/${product.slug}`} className="focus-ring block border-b border-metal-200 image-panel technical-grid">
        <div
          className={`relative w-full ${isFeatured ? "aspect-[5/3]" : ""}`}
          style={!isFeatured ? { aspectRatio: "var(--editable-card-image-aspect)" } : undefined}
        >
          <Image
            src={product.image}
            alt={product.imageAlt}
            fill
            sizes={isFeatured ? "(min-width: 1024px) 33vw, 100vw" : "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"}
            className={`object-contain transition duration-300 group-hover:scale-[1.03] ${
              isCompact ? "p-5" : isFeatured ? "p-8" : "p-6"
            }`}
          />
        </div>
      </Link>
      <div className={`flex flex-1 flex-col ${isFeatured ? "p-6" : isCompact ? "p-4" : "p-5"}`}>
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-metal-600">
          {product.category}
        </p>
        <h3 className={`${isFeatured ? "mt-3 text-2xl" : "mt-2 text-lg"} font-semibold text-navy-950`}>
          {product.name}
        </h3>
        <p className={`${isCompact ? "mt-2" : "mt-3"} flex-1 text-sm leading-6 text-slate-600`}>
          {product.shortDescription}
        </p>
        <Link
          href={`/products/${product.slug}`}
          className="focus-ring mt-5 inline-flex w-fit items-center gap-2 rounded-sm text-sm font-semibold text-industrial-600 transition hover:text-navy-950"
        >
          {site.buttons.viewDetails}
          <span aria-hidden="true">{">"}</span>
        </Link>
      </div>
    </article>
  );
}
