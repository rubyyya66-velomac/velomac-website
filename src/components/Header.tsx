import Image from "next/image";
import Link from "next/link";
import { CopyEmailButton } from "@/components/CopyEmailButton";
import { HeaderNav } from "@/components/HeaderNav";
import { TrackedContactLink } from "@/components/TrackedContactLink";
import { navItems, site } from "@/content/site";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-metal-200 bg-white backdrop-blur-md">
      <div className="hidden border-b border-metal-100 bg-metal-50/70 lg:block">
        <div className="mx-auto flex w-full max-w-[1200px] justify-end gap-5 px-8 py-2 text-[13px] font-medium leading-5 text-slate-600">
          <CopyEmailButton email={site.email} />
          <span className="text-metal-300">|</span>
          <TrackedContactLink
            href="https://wa.me/8613326311877"
            channel="whatsapp"
            newTab
            ariaLabel={`Contact ${site.name} on WhatsApp`}
            className="focus-ring rounded-sm transition hover:text-industrial-700"
          >
            WhatsApp: {site.whatsapp}
          </TrackedContactLink>
        </div>
      </div>
      <div className="mx-auto grid w-full max-w-[1200px] grid-cols-[auto_1fr_auto] items-center gap-x-3 gap-y-2 px-5 py-2.5 sm:px-6 lg:px-8 xl:flex xl:justify-between xl:gap-6 xl:py-4">
        <Link href="/" className="focus-ring flex w-fit items-center rounded-sm xl:min-w-[225px]" aria-label={`${site.name} home`}>
          <Image
            src={site.logos.header}
            alt={site.logos.alt}
            width={211}
            height={140}
            priority
            className="h-12 w-auto sm:h-14 xl:h-[72px]"
          />
        </Link>
        <TrackedContactLink
          href="https://wa.me/8613326311877"
          channel="whatsapp"
          newTab
          ariaLabel={`Contact ${site.name} on WhatsApp`}
          className="focus-ring justify-self-end rounded-sm text-xs font-semibold text-slate-600 transition hover:text-industrial-700 sm:text-sm xl:hidden"
        >
          WhatsApp
        </TrackedContactLink>
        <Link
          href="/contact"
          className="focus-ring inline-flex w-fit items-center justify-center border border-industrial-600 bg-industrial-600 px-3 py-2 text-[13px] font-semibold text-white transition hover:border-industrial-700 hover:bg-industrial-700 sm:px-4 sm:py-2.5 sm:text-[15px] xl:order-3"
          aria-label={`Request a quote from ${site.name}`}
        >
          {site.buttons.requestQuote}
        </Link>
        <div className="col-span-3 w-full xl:order-2 xl:col-span-1 xl:w-auto">
          <HeaderNav navItems={navItems} />
        </div>
      </div>
    </header>
  );
}
