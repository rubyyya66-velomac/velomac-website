import { Container } from "@/components/Layout";

type InPageNavItem = {
  href: `#${string}`;
  label: string;
};

export function InPageNav({ label, items }: { label: string; items: InPageNavItem[] }) {
  return (
    <nav aria-label={label} className="overflow-hidden border-b border-metal-200 bg-white">
      <Container className="min-w-0">
        <div className="flex max-w-full items-center gap-5 overflow-x-auto overscroll-x-contain py-3 text-sm font-semibold text-slate-600 [scrollbar-width:none] sm:gap-6 [&::-webkit-scrollbar]:hidden">
          <span className="shrink-0 text-xs uppercase tracking-[0.14em] text-industrial-700">On this page</span>
          <span className="shrink-0 text-[11px] font-medium text-slate-400 sm:hidden" aria-hidden="true">Swipe →</span>
          {items.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="focus-ring shrink-0 border-b border-transparent py-1 transition hover:border-industrial-600 hover:text-industrial-700"
            >
              {item.label}
            </a>
          ))}
        </div>
      </Container>
    </nav>
  );
}
