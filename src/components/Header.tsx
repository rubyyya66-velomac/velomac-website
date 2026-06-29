import Image from "next/image";
import Link from "next/link";
import { navItems, site } from "@/content/site";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-metal-200 bg-white backdrop-blur-md">
      <div className="hidden border-b border-metal-100 bg-metal-50/70 lg:block">
        <div className="mx-auto flex w-full max-w-[1200px] justify-end gap-5 px-8 py-2 text-[13px] font-medium leading-5 text-slate-600">
          <a className="focus-ring rounded-sm transition hover:text-industrial-700" href={`mailto:${site.email}`}>
            Email: {site.email}
          </a>
          <span className="text-metal-300">|</span>
          <span>WhatsApp: {site.whatsapp}</span>
        </div>
      </div>
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-3 px-5 py-3 sm:px-6 sm:py-4 lg:flex-row lg:items-center lg:justify-between lg:gap-6 lg:px-8">
        <Link href="/" className="focus-ring flex w-fit items-center rounded-sm lg:min-w-[245px]" aria-label={`${site.name} home`}>
          <Image
            src={site.logos.header}
            alt={site.logos.alt}
            width={211}
            height={140}
            priority
            className="h-14 w-auto sm:h-[72px]"
          />
        </Link>
        <nav aria-label="Main navigation" className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[length:var(--editable-header-nav-font-size)] font-semibold text-slate-600 lg:gap-x-7 lg:gap-y-3">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="focus-ring rounded-sm transition hover:text-industrial-700">
              {item.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/contact"
          className="focus-ring inline-flex w-fit items-center justify-center border border-navy-950 bg-navy-950 px-4 py-2.5 text-[15px] font-semibold text-white transition hover:border-industrial-600 hover:bg-industrial-700"
          aria-label={`Request a quote from ${site.name}`}
        >
          {site.buttons.requestQuote}
        </Link>
      </div>
    </header>
  );
}
