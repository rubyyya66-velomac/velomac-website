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

const productNavigationItems = [
  { label: "Flow Measurement", href: "/products#flow-measurement" },
  { label: "Level Measurement", href: "/products#level-measurement" }
] as const;

const applicationNavigationItems = [
  { label: "Application Overview", href: "/applications" },
  { label: "Steam Measurement", href: "/applications/steam-measurement" },
  { label: "Gas Flow Measurement", href: "/applications/gas-flow-measurement" },
  {
    label: "Conductive Liquid Measurement",
    href: "/applications/conductive-liquid-measurement"
  },
  { label: "Chemical Process Lines", href: "/applications/chemical-process-lines" },
  { label: "High Vibration Pipelines", href: "/applications/high-vibration-pipelines" },
  { label: "Energy Loss Visibility", href: "/applications/energy-loss-visibility" }
] as const;

export function HeaderNav({ navItems }: { navItems: NavItem[] }) {
  const pathname = usePathname();
  const [productsOpen, setProductsOpen] = useState(false);
  const [productsHover, setProductsHover] = useState(false);
  const [applicationsOpen, setApplicationsOpen] = useState(false);
  const [applicationsHover, setApplicationsHover] = useState(false);
  const [technologyOpen, setTechnologyOpen] = useState(false);
  const [technologyHover, setTechnologyHover] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const productsRef = useRef<HTMLDivElement>(null);
  const productsButtonRef = useRef<HTMLButtonElement>(null);
  const applicationsRef = useRef<HTMLDivElement>(null);
  const applicationsButtonRef = useRef<HTMLButtonElement>(null);
  const technologyRef = useRef<HTMLDivElement>(null);
  const technologyButtonRef = useRef<HTMLButtonElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const aboutButtonRef = useRef<HTMLButtonElement>(null);
  const activeTechnologyPath = getActiveTechnologyPath(pathname);
  const productsMenuVisible = productsOpen || productsHover;
  const applicationsMenuVisible = applicationsOpen || applicationsHover;
  const technologyMenuVisible = technologyOpen || technologyHover;

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (mobileOpen) return;

      const target = event.target as Node;
      const insideProducts = productsRef.current?.contains(target);
      const insideApplications = applicationsRef.current?.contains(target);
      const insideTechnology = technologyRef.current?.contains(target);
      const insideAbout = aboutRef.current?.contains(target);

      if (insideProducts || insideApplications || insideTechnology || insideAbout) return;

      setProductsOpen(false);
      setProductsHover(false);
      setApplicationsOpen(false);
      setApplicationsHover(false);
      setTechnologyOpen(false);
      setTechnologyHover(false);
      setAboutOpen(false);
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;

      if (productsMenuVisible) {
        setProductsOpen(false);
        setProductsHover(false);
        productsButtonRef.current?.focus();
      }
      if (applicationsMenuVisible) {
        setApplicationsOpen(false);
        setApplicationsHover(false);
        applicationsButtonRef.current?.focus();
      }
      if (technologyMenuVisible) {
        setTechnologyOpen(false);
        setTechnologyHover(false);
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
  }, [aboutOpen, applicationsMenuVisible, mobileOpen, productsMenuVisible, technologyMenuVisible]);

  function closeNavigation() {
    setMobileOpen(false);
    setProductsOpen(false);
    setProductsHover(false);
    setApplicationsOpen(false);
    setApplicationsHover(false);
    setTechnologyOpen(false);
    setTechnologyHover(false);
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
          if (item.href === "/products") {
            const productsActive = pathname === "/products" || pathname.startsWith("/products/");

            return (
              <div
                key={item.href}
                ref={productsRef}
                className="relative"
                onMouseEnter={() => {
                  if (window.matchMedia("(min-width: 1280px)").matches) {
                    setProductsHover(true);
                    setApplicationsOpen(false);
                    setApplicationsHover(false);
                    setTechnologyOpen(false);
                    setTechnologyHover(false);
                    setAboutOpen(false);
                  }
                }}
                onMouseLeave={() => {
                  if (window.matchMedia("(min-width: 1280px)").matches) {
                    setProductsHover(false);
                  }
                }}
                onBlur={(event) => {
                  if (mobileOpen) return;

                  if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                    setProductsOpen(false);
                    setProductsHover(false);
                  }
                }}
              >
                <div
                  className={`flex items-center border-b border-metal-100 transition xl:border-0 ${
                    productsActive ? "text-industrial-700" : ""
                  }`}
                >
                  <Link
                    href={item.href}
                    aria-current={pathname === "/products" ? "page" : undefined}
                    onClick={closeNavigation}
                    className="focus-ring flex-1 py-3 transition hover:text-industrial-700 xl:py-0"
                  >
                    {item.label}
                  </Link>
                  <button
                    ref={productsButtonRef}
                    type="button"
                    className="focus-ring flex h-10 w-10 shrink-0 items-center justify-center text-slate-500 transition hover:text-industrial-700 xl:h-8 xl:w-8"
                    aria-label="Toggle Products menu"
                    aria-expanded={productsMenuVisible}
                    aria-haspopup="menu"
                    aria-controls="products-submenu"
                    onClick={() => {
                      setProductsOpen((current) => !current);
                      setApplicationsOpen(false);
                      setApplicationsHover(false);
                      setTechnologyOpen(false);
                      setTechnologyHover(false);
                      setAboutOpen(false);
                    }}
                  >
                    <span
                      className={`text-[10px] transition ${productsMenuVisible ? "rotate-180" : ""}`}
                      aria-hidden="true"
                    >
                      v
                    </span>
                  </button>
                </div>
                <div
                  id="products-submenu"
                  className={`z-50 w-full pt-1 transition xl:absolute xl:left-1/2 xl:top-full xl:w-[230px] xl:-translate-x-1/2 xl:pt-3 ${
                    productsMenuVisible ? "block visible opacity-100" : "hidden invisible opacity-0"
                  }`}
                  role="menu"
                >
                  <div className="border border-metal-200 bg-white p-2 xl:shadow-soft">
                    {productNavigationItems.map((productItem, index) => (
                      <Link
                        key={productItem.href}
                        href={productItem.href}
                        role="menuitem"
                        onClick={closeNavigation}
                        className={`focus-ring block px-3 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-metal-50 hover:text-industrial-700 ${
                          index > 0 ? "border-t border-metal-100" : ""
                        }`}
                      >
                        {productItem.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            );
          }

          if (item.href === "/applications") {
            const applicationsActive =
              pathname === "/applications" || pathname.startsWith("/applications/");

            return (
              <div
                key={item.href}
                ref={applicationsRef}
                className="relative"
                onMouseEnter={() => {
                  if (window.matchMedia("(min-width: 1280px)").matches) {
                    setApplicationsHover(true);
                    setProductsOpen(false);
                    setProductsHover(false);
                    setTechnologyOpen(false);
                    setTechnologyHover(false);
                    setAboutOpen(false);
                  }
                }}
                onMouseLeave={() => {
                  if (window.matchMedia("(min-width: 1280px)").matches) {
                    setApplicationsHover(false);
                  }
                }}
                onFocusCapture={(event) => {
                  if (
                    event.target instanceof HTMLAnchorElement &&
                    window.matchMedia("(min-width: 1280px)").matches
                  ) {
                    setApplicationsOpen(true);
                    setProductsOpen(false);
                    setProductsHover(false);
                    setTechnologyOpen(false);
                    setTechnologyHover(false);
                    setAboutOpen(false);
                  }
                }}
                onBlur={(event) => {
                  if (mobileOpen) return;

                  if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                    setApplicationsOpen(false);
                    setApplicationsHover(false);
                  }
                }}
              >
                <div
                  className={`flex items-center border-b border-metal-100 transition xl:border-0 ${
                    applicationsActive ? "text-industrial-700" : ""
                  }`}
                >
                  <Link
                    href={item.href}
                    aria-current={pathname === "/applications" ? "page" : undefined}
                    onClick={closeNavigation}
                    className="focus-ring flex-1 py-3 transition hover:text-industrial-700 xl:py-0"
                  >
                    {item.label}
                  </Link>
                  <button
                    ref={applicationsButtonRef}
                    type="button"
                    className="focus-ring flex h-10 w-10 shrink-0 items-center justify-center text-slate-500 transition hover:text-industrial-700 xl:h-8 xl:w-8"
                    aria-label="Toggle Applications menu"
                    aria-expanded={applicationsMenuVisible}
                    aria-haspopup="menu"
                    aria-controls="applications-submenu"
                    onClick={() => {
                      setApplicationsOpen((current) => !current);
                      setProductsOpen(false);
                      setProductsHover(false);
                      setTechnologyOpen(false);
                      setTechnologyHover(false);
                      setAboutOpen(false);
                    }}
                  >
                    <span
                      className={`text-[10px] transition ${applicationsMenuVisible ? "rotate-180" : ""}`}
                      aria-hidden="true"
                    >
                      v
                    </span>
                  </button>
                </div>
                <div
                  id="applications-submenu"
                  className={`z-50 w-full pt-1 transition xl:absolute xl:left-1/2 xl:top-full xl:w-[310px] xl:-translate-x-1/2 xl:pt-3 ${
                    applicationsMenuVisible ? "block visible opacity-100" : "hidden invisible opacity-0"
                  }`}
                  role="menu"
                >
                  <div className="border border-metal-200 bg-white p-2 xl:shadow-soft">
                    {applicationNavigationItems.map((applicationItem, index) => {
                      const active = pathname === applicationItem.href;

                      return (
                        <Link
                          key={applicationItem.href}
                          href={applicationItem.href}
                          role="menuitem"
                          aria-current={active ? "page" : undefined}
                          onClick={closeNavigation}
                          className={`focus-ring block px-3 py-2.5 text-sm font-semibold transition hover:bg-metal-50 hover:text-industrial-700 ${
                            index > 0 ? "border-t border-metal-100" : ""
                          } ${active ? "bg-metal-50 text-industrial-700" : "text-slate-600"}`}
                        >
                          {applicationItem.label}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          }

          if (item.href === "/technology") {
            const technologyActive =
              pathname === "/technology" || pathname.startsWith("/technology/");

            return (
              <div
                key={item.href}
                ref={technologyRef}
                className="relative"
                onMouseEnter={() => {
                  if (window.matchMedia("(min-width: 1280px)").matches) {
                    setTechnologyHover(true);
                    setProductsOpen(false);
                    setProductsHover(false);
                    setApplicationsOpen(false);
                    setApplicationsHover(false);
                    setAboutOpen(false);
                  }
                }}
                onMouseLeave={() => {
                  if (window.matchMedia("(min-width: 1280px)").matches) {
                    setTechnologyHover(false);
                  }
                }}
                onBlur={(event) => {
                  if (mobileOpen) return;

                  if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                    setTechnologyOpen(false);
                    setTechnologyHover(false);
                  }
                }}
              >
                <div
                  className={`flex items-center border-b border-metal-100 transition xl:border-0 ${
                    technologyActive ? "text-industrial-700" : ""
                  }`}
                >
                  <Link
                    href={item.href}
                    aria-current={pathname === "/technology" ? "page" : undefined}
                    onClick={closeNavigation}
                    className="focus-ring flex-1 py-3 transition hover:text-industrial-700 xl:py-0"
                  >
                    {item.label}
                  </Link>
                  <button
                    ref={technologyButtonRef}
                    type="button"
                    className="focus-ring flex h-10 w-10 shrink-0 items-center justify-center text-slate-500 transition hover:text-industrial-700 xl:h-8 xl:w-8"
                    aria-label="Toggle Technology menu"
                    aria-expanded={technologyMenuVisible}
                    aria-haspopup="menu"
                    aria-controls="technology-submenu"
                    onClick={() => {
                      setTechnologyOpen((current) => !current);
                      setProductsOpen(false);
                      setProductsHover(false);
                      setApplicationsOpen(false);
                      setApplicationsHover(false);
                      setAboutOpen(false);
                    }}
                  >
                    <span
                      className={`text-[10px] transition ${technologyMenuVisible ? "rotate-180" : ""}`}
                      aria-hidden="true"
                    >
                      v
                    </span>
                  </button>
                </div>
                <div
                  id="technology-submenu"
                  className={`z-50 w-full pt-1 transition xl:absolute xl:left-1/2 xl:top-full xl:w-[310px] xl:-translate-x-1/2 xl:pt-3 ${
                    technologyMenuVisible ? "block visible opacity-100" : "hidden invisible opacity-0"
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
                          aria-current={active ? "location" : undefined}
                          onClick={closeNavigation}
                          className={`focus-ring block px-3 py-2.5 text-sm font-semibold transition hover:bg-metal-50 hover:text-industrial-700 ${
                            index > 0 ? "border-t border-metal-100" : ""
                          } ${active ? "bg-metal-50 text-industrial-700" : "text-slate-600"}`}
                        >
                          {technologyItem.label}
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
                    setProductsOpen(false);
                    setProductsHover(false);
                    setApplicationsOpen(false);
                    setApplicationsHover(false);
                    setTechnologyOpen(false);
                    setTechnologyHover(false);
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
