import Image from "next/image";
import Link from "next/link";
import { CopyEmailButton } from "@/components/CopyEmailButton";
import { HeaderNav } from "@/components/HeaderNav";
import { navItems, site } from "@/content/site";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-metal-200 bg-white backdrop-blur-md">
      <div className="hidden border-b border-metal-100 bg-metal-50/70 lg:block">
        <div className="mx-auto flex w-full max-w-[1200px] justify-end gap-5 px-8 py-2 text-[13px] font-medium leading-5 text-slate-600">
          <CopyEmailButton email={site.email} />
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
        <HeaderNav navItems={navItems} />
        <Link
          href="/contact"
          className="focus-ring inline-flex w-fit items-center justify-center border border-industrial-600 bg-industrial-600 px-4 py-2.5 text-[15px] font-semibold text-white transition hover:border-industrial-700 hover:bg-industrial-700"
          aria-label={`Request a quote from ${site.name}`}
        >
          {site.buttons.requestQuote}
        </Link>
      </div>
    </header>
  );
}
