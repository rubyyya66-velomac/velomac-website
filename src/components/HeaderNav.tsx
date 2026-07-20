"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type NavItem = {
  label: string;
  href: string;
};

export function HeaderNav({ navItems }: { navItems: NavItem[] }) {
  const [aboutOpen, setAboutOpen] = useState(false);
  const aboutRef = useRef<HTMLDivElement>(null);
  const aboutButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (aboutRef.current && !aboutRef.current.contains(event.target as Node)) {
        setAboutOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && aboutOpen) {
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
  }, [aboutOpen]);

  return (
    <nav
      aria-label="Main navigation"
      className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[length:var(--editable-header-nav-font-size)] font-semibold text-slate-600 lg:gap-x-7 lg:gap-y-3"
    >
      {navItems.map((item) => {
        if (item.href !== "/about") {
          return (
            <Link key={item.href} href={item.href} className="focus-ring rounded-sm transition hover:text-industrial-700">
              {item.label}
            </Link>
          );
        }

        return (
          <div
            key={item.href}
            ref={aboutRef}
            className="relative"
            onMouseEnter={() => setAboutOpen(true)}
            onMouseLeave={() => setAboutOpen(false)}
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setAboutOpen(false);
            }}
          >
            <button
              ref={aboutButtonRef}
              type="button"
              className="focus-ring inline-flex items-center gap-1.5 rounded-sm transition hover:text-industrial-700"
              aria-expanded={aboutOpen}
              aria-haspopup="menu"
              aria-controls="about-submenu"
              onClick={() => setAboutOpen((current) => !current)}
            >
              {item.label}
              <span className={`text-[10px] transition ${aboutOpen ? "rotate-180" : ""}`} aria-hidden="true">
                v
              </span>
            </button>
            <div
              id="about-submenu"
              className={`absolute left-1/2 top-full z-50 w-[220px] -translate-x-1/2 pt-3 transition ${
                aboutOpen ? "visible opacity-100" : "invisible opacity-0"
              }`}
              role="menu"
            >
              <div className="border border-metal-200 bg-white p-2 shadow-soft">
                <Link
                  href="/about"
                  role="menuitem"
                  onClick={() => setAboutOpen(false)}
                  className="focus-ring block px-3 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-metal-50 hover:text-industrial-700"
                >
                  About Velomac
                </Link>
                <Link
                  href="/quality-innovation"
                  role="menuitem"
                  onClick={() => setAboutOpen(false)}
                  className="focus-ring block border-t border-metal-100 px-3 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-metal-50 hover:text-industrial-700"
                >
                  Quality &amp; Innovation
                </Link>
              </div>
            </div>
          </div>
        );
      })}
    </nav>
  );
}
