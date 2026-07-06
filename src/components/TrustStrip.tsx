import { Container } from "@/components/Layout";
import { homepage } from "@/content/homepage";

export function TrustStrip() {
  return (
    <section className="relative z-10 bg-white">
      <Container className="-mt-8 grid gap-0 overflow-hidden rounded-[8px] border border-metal-200 bg-white py-0 shadow-[0_22px_70px_rgba(6,20,38,0.10)] sm:grid-cols-3">
        {homepage.trustPoints.map((item, index) => (
          <div
            key={item.title}
            className="border-b border-metal-200 px-5 py-5 sm:border-b-0 sm:border-r sm:px-6 sm:last:border-r-0 lg:px-7"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-industrial-700">
              {String(index + 1).padStart(2, "0")}
            </p>
            <p className="mt-3 text-sm font-semibold uppercase tracking-[0.12em] text-navy-950">{item.title}</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">{item.text}</p>
          </div>
        ))}
      </Container>
    </section>
  );
}
