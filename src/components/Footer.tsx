import Image from "next/image";
import Link from "next/link";
import { applications } from "@/content/applications";
import { products } from "@/content/products";
import { resourceCategories } from "@/content/resources";
import { site } from "@/content/site";

export function Footer() {
  const flowProducts = products.filter((product) => product.category === "Flowmeters").slice(0, 5);
  const applicationLinks = applications.slice(0, 4);

  return (
    <footer className="border-t border-metal-200 bg-white text-navy-950">
      <div className="mx-auto grid w-full max-w-[1200px] gap-x-10 gap-y-9 px-5 py-[var(--editable-footer-spacing)] sm:px-6 lg:grid-cols-[1.25fr_0.95fr_0.95fr_0.85fr_1fr] lg:px-8">
        <div>
          <Link href="/" className="focus-ring inline-flex items-center gap-3 rounded-sm">
            <Image
              src={site.logos.footer}
              alt={site.logos.alt}
              width={1254}
              height={1254}
              className="h-24 w-auto sm:h-28"
            />
          </Link>
          <p className="mt-4 max-w-sm text-[15px] leading-7 text-slate-600">
            {site.footer.description}
          </p>
          <p className="mt-5 text-[15px] leading-6 text-slate-500">Copyright © {new Date().getFullYear()} {site.footer.copyrightName}.</p>
        </div>
        <FooterColumn title={site.footer.columns.products}>
          {flowProducts.map((product) => (
            <FooterLink key={product.slug} href={`/products/${product.slug}`}>
              {product.name}
            </FooterLink>
          ))}
        </FooterColumn>
        <FooterColumn title={site.footer.columns.applications}>
          {applicationLinks.map((application) => (
            <FooterLink key={application.slug} href={`/applications#${application.slug}`}>
              {application.title}
            </FooterLink>
          ))}
        </FooterColumn>
        <FooterColumn title={site.footer.columns.resources}>
          {resourceCategories.slice(0, 4).map((category) => (
            <FooterLink key={category} href="/resources">
              {category}
            </FooterLink>
          ))}
        </FooterColumn>
        <FooterColumn title={site.footer.columns.contact}>
          <p className="text-[15px] leading-7 text-slate-600">Location: {site.location}</p>
          <FooterLink href="/contact">{site.buttons.requestQuote}</FooterLink>
        </FooterColumn>
      </div>
    </footer>
  );
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-industrial-700">{title}</h2>
      <div className="mt-5 flex flex-col gap-3.5">{children}</div>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="focus-ring rounded-sm text-[15px] leading-7 text-slate-600 transition hover:text-industrial-700">
      {children}
    </Link>
  );
}
