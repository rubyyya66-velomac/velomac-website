"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  getActiveTechnologyPath,
  technologyNavigationItems
} from "@/content/technologyNavigation";

type NavItem = {
  label: string;
  href: string;
};

export function HeaderNav({ navItems }: { navItems: NavItem[] }) {
  const pathname = usePathname();
  const [technologyOpen, setTechnologyOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const technologyRef = useRef<HTMLDivElement>(null);
  const technologyButtonRef = useRef<HTMLButtonElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const aboutButtonRef = useRef<HTMLButtonElement>(null);
  const activeTechnologyPath = getActiveTechnologyPath(pathname);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (mobileOpen) return;

      const target = event.target as Node;
      const insideTechnology = technologyRef.current?.contains(target);
      const insideAbout = aboutRef.current?.contains(target);

      if (insideTechnology || insideAbout) return;

      setTechnologyOpen(false);
      setAboutOpen(false);
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;

      if (technologyOpen) {
        setTechnologyOpen(false);
        technologyButtonRef.current?.focus();
      }
      if (aboutOpen) {
        setAboutOpen(false);
        aboutButtonRef.current?.focus();
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [aboutOpen, mobileOpen, technologyOpen]);

  function closeNavigation() {
    setMobileOpen(false);
    setTechnologyOpen(false);
    setAboutOpen(false);
  }

  function isSectionActive(href: string) {
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  const mainItemClass = (active: boolean) =>
    `focus-ring rounded-sm border-b border-metal-100 py-3 transition hover:text-industrial-700 xl:border-0 xl:py-0 ${
      active ? "text-industrial-700" : ""
    }`;

  return (
    <div className="w-full xl:w-auto">
      <button
        type="button"
        className="focus-ring flex w-full items-center justify-between border-y border-metal-200 py-3 text-sm font-semibold text-navy-950 xl:hidden"
        aria-expanded={mobileOpen}
        aria-controls="mobile-main-navigation"
        onClick={() => setMobileOpen((current) => !current)}
      >
        Navigation
        <span className="text-xs text-industrial-700" aria-hidden="true">
          {mobileOpen ? "Close" : "Menu"}
        </span>
      </button>
      <nav
        id="mobile-main-navigation"
        aria-label="Main navigation"
        className={`${mobileOpen ? "flex" : "hidden"} flex-col items-stretch gap-1 pt-2 text-[length:var(--editable-header-nav-font-size)] font-semibold text-slate-600 xl:flex xl:flex-row xl:flex-wrap xl:items-center xl:gap-x-5 xl:gap-y-3 xl:pt-0`}
      >
        {navItems.map((item) => {
          if (item.href === "/technology") {
            return (
              <div
                key={item.href}
                ref={technologyRef}
                className="relative"
                onBlur={(event) => {
                  if (mobileOpen) return;

                  if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                    setTechnologyOpen(false);
                  }
                }}
              >
                <button
                  ref={technologyButtonRef}
                  type="button"
                  className={`${mainItemClass(Boolean(activeTechnologyPath))} inline-flex w-full items-center justify-between gap-1.5 text-left xl:w-auto`}
                  aria-expanded={technologyOpen}
                  aria-haspopup="menu"
                  aria-controls="technology-submenu"
                  onClick={() => {
                    setTechnologyOpen((current) => !current);
                    setAboutOpen(false);
                  }}
                >
                  {item.label}
                  <span
                    className={`text-[10px] transition ${technologyOpen ? "rotate-180" : ""}`}
                    aria-hidden="true"
                  >
                    v
                  </span>
                </button>
                <div
                  id="technology-submenu"
                  className={`z-50 w-full pt-1 transition xl:absolute xl:left-1/2 xl:top-full xl:w-[310px] xl:-translate-x-1/2 xl:pt-3 ${
                    technologyOpen ? "block visible opacity-100" : "hidden invisible opacity-0"
                  }`}
                  role="menu"
                >
                  <div className="border border-metal-200 bg-white p-2 xl:shadow-soft">
                    {technologyNavigationItems.map((technologyItem, index) => {
                      const active = activeTechnologyPath === technologyItem.href;

                      return (
                        <Link
                          key={technologyItem.href}
                          href={technologyItem.href}
                          role="menuitem"
                          aria-current={active ? "page" : undefined}
                          onClick={closeNavigation}
                          className={`focus-ring block px-3 py-2.5 text-sm font-semibold transition hover:bg-metal-50 hover:text-industrial-700 ${
                            index > 0 ? "border-t border-metal-100" : ""
                          } ${active ? "bg-metal-50 text-industrial-700" : "text-slate-600"}`}
                        >
                          {index === 0 ? "Technology Overview" : technologyItem.label}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          }

          if (item.href === "/about") {
            const aboutActive = pathname === "/about" || pathname === "/quality-innovation";

            return (
              <div
                key={item.href}
                ref={aboutRef}
                className="relative"
                onBlur={(event) => {
                  if (mobileOpen) return;

                  if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                    setAboutOpen(false);
                  }
                }}
              >
                <button
                  ref={aboutButtonRef}
                  type="button"
                  className={`${mainItemClass(aboutActive)} inline-flex w-full items-center justify-between gap-1.5 text-left xl:w-auto`}
                  aria-expanded={aboutOpen}
                  aria-haspopup="menu"
                  aria-controls="about-submenu"
                  onClick={() => {
                    setAboutOpen((current) => !current);
                    setTechnologyOpen(false);
                  }}
                >
                  {item.label}
                  <span
                    className={`text-[10px] transition ${aboutOpen ? "rotate-180" : ""}`}
                    aria-hidden="true"
                  >
                    v
                  </span>
                </button>
                <div
                  id="about-submenu"
                  className={`z-50 w-full pt-1 transition xl:absolute xl:left-1/2 xl:top-full xl:w-[220px] xl:-translate-x-1/2 xl:pt-3 ${
                    aboutOpen ? "block visible opacity-100" : "hidden invisible opacity-0"
                  }`}
                  role="menu"
                >
                  <div className="border border-metal-200 bg-white p-2 xl:shadow-soft">
                    <Link
                      href="/about"
                      role="menuitem"
                      aria-current={pathname === "/about" ? "page" : undefined}
                      onClick={closeNavigation}
                      className={`focus-ring block px-3 py-2.5 text-sm font-semibold transition hover:bg-metal-50 hover:text-industrial-700 ${
                        pathname === "/about" ? "bg-metal-50 text-industrial-700" : "text-slate-600"
                      }`}
                    >
                      About Velomac
                    </Link>
                    <Link
                      href="/quality-innovation"
                      role="menuitem"
                      aria-current={pathname === "/quality-innovation" ? "page" : undefined}
                      onClick={closeNavigation}
                      className={`focus-ring block border-t border-metal-100 px-3 py-2.5 text-sm font-semibold transition hover:bg-metal-50 hover:text-industrial-700 ${
                        pathname === "/quality-innovation"
                          ? "bg-metal-50 text-industrial-700"
                          : "text-slate-600"
                      }`}
                    >
                      Quality &amp; Innovation
                    </Link>
                  </div>
                </div>
              </div>
            );
          }

          const active = isSectionActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              onClick={closeNavigation}
              className={mainItemClass(active)}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
