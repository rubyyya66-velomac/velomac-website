import { Container } from "@/components/Layout";
import { homepage } from "@/content/homepage";

export function TrustStrip() {
  return (
    <section className="border-b border-metal-200 bg-white">
      <Container className="grid gap-0 py-0 sm:grid-cols-3">
        {homepage.trustPoints.map((item) => (
          <div key={item.title} className="border-b border-metal-200 py-6 sm:border-b-0 sm:border-r sm:px-6 sm:last:border-r-0">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-navy-950">{item.title}</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">{item.text}</p>
          </div>
        ))}
      </Container>
    </section>
  );
}
