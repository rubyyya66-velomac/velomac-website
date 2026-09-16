import { Container } from "@/components/Layout";

type InPageNavItem = {
  href: `#${string}`;
  label: string;
};

export function InPageNav({ label, items }: { label: string; items: InPageNavItem[] }) {
  return (
    <nav aria-label={label} className="border-b border-metal-200 bg-white">
      <Container>
        <div className="flex items-center gap-6 overflow-x-auto py-3 text-sm font-semibold text-slate-600 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <span className="shrink-0 text-xs uppercase tracking-[0.14em] text-industrial-700">On this page</span>
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
