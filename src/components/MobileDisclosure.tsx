"use client";

import { useId, useState, type ReactNode } from "react";

export function MobileDisclosure({
  label,
  children,
  className = ""
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const contentId = useId();

  return (
    <>
      <button
        type="button"
        aria-controls={contentId}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
        className="focus-ring mt-6 flex min-h-12 w-full items-center justify-between border-y border-metal-200 py-3 text-left text-sm font-semibold text-navy-950 sm:hidden"
      >
        <span>{isOpen ? "Hide details" : label}</span>
        <span aria-hidden="true" className="text-xl font-normal leading-none text-industrial-700">
          {isOpen ? "−" : "+"}
        </span>
      </button>
      <div id={contentId} className={`${isOpen ? "block" : "hidden"} sm:block ${className}`}>
        {children}
      </div>
    </>
  );
}
