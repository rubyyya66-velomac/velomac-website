"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  getActiveTechnologyPath,
  technologyNavigationItems
} from "@/content/technologyNavigation";

export function TechnologySubnav() {
  const pathname = usePathname();
  const activePath = getActiveTechnologyPath(pathname);
  const [activeHref, setActiveHref] = useState(activePath);

  useEffect(() => {
    function syncActiveSection() {
      if (pathname === "/technology" && window.location.hash) {
        setActiveHref(`/technology${window.location.hash}`);
        return;
      }

      setActiveHref(activePath);
    }

    syncActiveSection();
    window.addEventListener("hashchange", syncActiveSection);

    return () => window.removeEventListener("hashchange", syncActiveSection);
  }, [activePath, pathname]);

  return (
    <div className="overflow-hidden border-b border-metal-200 bg-white">
      <div className="relative mx-auto w-full max-w-[1200px]">
        <div className="overflow-x-auto overscroll-x-contain px-5 [scrollbar-width:none] sm:px-6 lg:px-8 [&::-webkit-scrollbar]:hidden">
          <nav
            aria-label="Technology sections"
            className="flex min-w-max items-center gap-6 pr-7 text-sm font-semibold text-slate-600 lg:gap-8 lg:pr-0"
          >
          {technologyNavigationItems.map((item) => {
            const active = activeHref === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "location" : undefined}
                onClick={() => setActiveHref(item.href)}
                className={`focus-ring border-b-2 py-3.5 transition ${
                  active
                    ? "border-industrial-600 text-industrial-700"
                    : "border-transparent hover:border-metal-300 hover:text-navy-950"
                }`}
              >
                {item.label}
              </Link>
            );
            })}
          </nav>
        </div>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-white to-transparent lg:hidden" aria-hidden="true" />
      </div>
    </div>
  );
}
