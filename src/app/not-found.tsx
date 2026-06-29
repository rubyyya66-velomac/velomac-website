import Link from "next/link";
import { Container, Section } from "@/components/Layout";

export default function NotFound() {
  return (
    <Section>
      <Container className="max-w-3xl">
        <h1 className="text-4xl font-semibold text-navy-950">Page not found</h1>
        <p className="mt-4 text-base leading-7 text-slate-600">
          The page may have moved, or the requested content is not available.
        </p>
        <Link
          href="/"
          className="focus-ring mt-8 inline-flex bg-navy-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-navy-800"
        >
          Back to Home
        </Link>
      </Container>
    </Section>
  );
}
