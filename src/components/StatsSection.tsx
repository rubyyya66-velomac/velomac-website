import { Container, SectionHeader } from "@/components/Layout";

type Stat = {
  value: string;
  label: string;
};

type Note = {
  title: string;
  text: string;
};

export function StatsSection({
  eyebrow,
  title,
  description,
  stats,
  notes
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  stats: Stat[];
  notes?: Note[];
}) {
  return (
    <section className="homepage-proof-surface homepage-reveal relative overflow-hidden py-16 text-white sm:py-20 lg:py-24">
      <Container className="relative z-10">
        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <SectionHeader
            eyebrow={eyebrow}
            title={title}
            description={description}
            className="[&_h2]:text-white [&_p:last-child]:text-slate-300 [&_p:first-child]:text-blue-200"
          />
          <div className="grid gap-x-8 gap-y-6 border-y border-white/[0.12] py-7 sm:grid-cols-2">
            {stats.map((stat) => (
              <div key={stat.label} className="border-l border-blue-200/[0.45] py-1 pl-5">
                <p className="text-3xl font-semibold text-white">{stat.value}</p>
                <p className="mt-2 text-sm leading-6 text-blue-50">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
        {notes ? (
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {notes.map((note) => (
              <article key={note.title} className="rounded-[8px] border border-white/[0.12] bg-white/[0.06] p-5 text-white backdrop-blur-sm transition duration-300 hover:-translate-y-0.5 hover:bg-white/[0.09]">
                <h3 className="text-base font-semibold">{note.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-300">{note.text}</p>
              </article>
            ))}
          </div>
        ) : null}
      </Container>
    </section>
  );
}
