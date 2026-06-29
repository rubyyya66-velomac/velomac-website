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
    <section className="py-16 text-white velomac-blue-surface sm:py-20 lg:py-24">
      <Container>
        <SectionHeader
          eyebrow={eyebrow}
          title={title}
          description={description}
          className="[&_h2]:text-white [&_p:last-child]:text-slate-300 [&_p:first-child]:text-blue-200"
        />
        <div className="mt-10 grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="border-l border-blue-200/55 py-1 pl-5">
              <p className="text-3xl font-semibold text-white">{stat.value}</p>
              <p className="mt-2 text-sm leading-6 text-blue-50">{stat.label}</p>
            </div>
          ))}
        </div>
        {notes ? (
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {notes.map((note) => (
              <article key={note.title} className="rounded-[6px] border border-white/15 bg-white/95 p-5 text-navy-950">
                <h3 className="text-base font-semibold">{note.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{note.text}</p>
              </article>
            ))}
          </div>
        ) : null}
      </Container>
    </section>
  );
}
