import type { Metadata } from "next";
import { Section, Container, SectionHeader } from "@/components/Layout";
import { ProductCard } from "@/components/ProductCard";
import { getProductsByCategory } from "@/content/products";

export const metadata: Metadata = {
  title: "Industrial Flowmeters | Vortex, Electromagnetic, Turbine and Thermal Mass",
  description:
    "Explore Velomac industrial flowmeters and level instruments for steam, gas, liquid, water, wastewater and chemical applications."
};

export default function ProductsPage() {
  const flowmeters = getProductsByCategory("Flowmeters");
  const levelInstruments = getProductsByCategory("Level Instruments");

  return (
    <>
      <section className="velomac-blue-surface text-white">
        <Container className="py-14 sm:py-16 lg:py-20">
          <div className="max-w-4xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-200">Products</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-normal text-white sm:text-5xl lg:text-[3.4rem] lg:leading-[1.06]">
              Industrial Flowmeters
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-blue-50">
              A clear overview of Velomac flowmeter and level instrument families. Start with media, flow range, pressure, temperature, pipe size and installation details.
            </p>
          </div>
        </Container>
      </section>
      <Section>
        <Container>
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeader
              title="Flowmeters"
              description="Steam, gas, liquid, water and chemical flow measurement families."
            />
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-industrial-700">
              Steam · Gas · Liquid · Water · Chemical
            </p>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {flowmeters.map((product) => (
              <ProductCard key={product.slug} product={product} variant="compact" />
            ))}
          </div>
        </Container>
      </Section>
      <Section className="bg-metal-50 py-12 sm:py-14 lg:py-16">
        <Container>
          <SectionHeader title="Level Instruments" description="Level measurement and local level indication products." />
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:max-w-3xl">
            {levelInstruments.map((product) => (
              <ProductCard key={product.slug} product={product} variant="featured" />
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
