import type { Metadata } from "next";
import { Container, PageIntro, Section } from "@/components/Layout";
import { QuoteForm } from "@/components/QuoteForm";
import { contactContent } from "@/content/contact";

export const metadata: Metadata = {
  title: contactContent.metadata.title,
  description: contactContent.metadata.description
};

export default function ContactPage() {
  const { intro, sidebar, contactInfo } = contactContent;

  return (
    <>
      <PageIntro
        eyebrow={intro.label}
        title={intro.headline}
        description={intro.description}
      />
      <Section>
        <Container className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr]">
          <aside className="rounded-[6px] border border-navy-950 bg-navy-950 p-6 text-white dark-technical-grid">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-200">{sidebar.label}</p>
            <h2 className="mt-3 text-2xl font-semibold text-white">{sidebar.headline}</h2>
            <div className="mt-5 grid gap-3 text-sm leading-6 text-slate-300">
              <p>Email: {contactInfo.email}</p>
              <p>WhatsApp: {contactInfo.whatsapp}</p>
              <p>Location: {contactInfo.location}</p>
            </div>
            <div className="mt-8 border-t border-white/15 pt-6">
              <h3 className="font-semibold text-white">{sidebar.helpfulDetailsTitle}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                {sidebar.helpfulDetailsText}
              </p>
            </div>
          </aside>
          <div className="rounded-[6px] border border-metal-200 bg-white p-6 shadow-sm sm:p-8">
            <QuoteForm />
          </div>
        </Container>
      </Section>
    </>
  );
}
