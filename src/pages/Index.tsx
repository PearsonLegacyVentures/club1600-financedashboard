import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PageLayout } from "@/components/layout/PageLayout";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/blocks/SectionHeading";
import { CtaBand, InsightPanel, MarketplacePreview, PageMeta, PartnerCategories, PillGrid, PilotCountries, SimpleGrid } from "@/components/blocks/CaxBlocks";
import { audiences, features, impactPillars } from "@/lib/cax-data";
import { cta } from "@/lib/cta";

const problemBullets = [
  "Buyers cannot easily find verified regional suppliers.",
  "Farmers and fisheries often lack predictable demand.",
  "Surplus in one island may never reach buyers in another.",
  "Pricing and availability data are hard to compare.",
  "Small producers struggle to access finance and export channels.",
];

const steps = [
  ["01", "Suppliers list available products.", "Farms, fisheries, processors, and cooperatives present supply by country, category, volume, and season."],
  ["02", "Buyers post what they need.", "Hotels, restaurants, groceries, distributors, exporters, and institutions publish recurring or one-time requests."],
  ["03", "The platform matches supply with demand.", "CAX highlights practical regional sourcing opportunities without implying guaranteed transactions."],
  ["04", "Partners support logistics, standards, data, and financing.", "Institutions can help strengthen readiness, visibility, and market access around the pilot."],
];

export default function Home() {
  return (
    <PageLayout>
      <PageMeta title="Caribbean Agricultural Exchange | Regional Food Trade Platform" description="A regional platform concept connecting Caribbean farmers, fisheries, processors, distributors, hotels, restaurants, grocery stores, exporters, and institutional buyers." />
      <section className="overflow-hidden bg-cax-charcoal section-padding text-white">
        <div className="content-container grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <p className="text-eyebrow mb-5">The digital trade infrastructure for Caribbean food security.</p>
            <h1 className="text-display max-w-4xl text-balance text-white">Caribbean food trade needs better infrastructure.</h1>
            <p className="mt-7 max-w-2xl text-xl leading-relaxed text-white/78">Caribbean Agricultural Exchange connects farmers, fisheries, processors, distributors, hotels, restaurants, grocery stores, exporters, and institutional buyers across the region.</p>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/64">Built to improve market access, reduce waste, strengthen food security, and make regional sourcing easier.</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row"><Button variant="accent" size="lg" asChild><Link to={cta.primary.route} data-cta={cta.primary.trackingId}>{cta.primary.label}</Link></Button><Button variant="outline" size="lg" className="border-white/30 bg-transparent text-white hover:bg-white hover:text-cax-charcoal" asChild><Link to={cta.secondary.route} data-cta={cta.secondary.trackingId}>{cta.secondary.label}</Link></Button></div>
          </div>
          <InsightPanel />
        </div>
      </section>

      <Section>
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <SectionHeading align="left" eyebrow="The problem" heading="The Caribbean does not have a supply problem only. It has a market connection problem." description="Many hotels, restaurants, grocery stores, and institutions import food while regional farmers and fisheries struggle to access consistent buyers. Supply, demand, logistics, pricing, and standards are fragmented across islands." />
          <div className="space-y-3">{problemBullets.map((item) => <div key={item} className="rounded-xl border border-border bg-card p-4 text-sm font-medium text-cax-charcoal">{item}</div>)}</div>
        </div>
      </Section>


      <Section>
        <div className="grid gap-8 rounded-[2rem] border border-border bg-card p-6 shadow-sm md:p-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <SectionHeading align="left" eyebrow="Pilot status" heading="Pilot status" description="CAX is in an honest early pilot-readiness phase. The current priority is to collect credible interest, understand practical demand, and identify partners before any launch claims are made." className="mb-0" />
          <div className="grid gap-4 sm:grid-cols-2">
            {["Concept validation", "Stakeholder discovery", "Pilot interest collection", "Partnership readiness"].map((item) => <div key={item} className="rounded-2xl bg-cax-cream p-5"><p className="text-sm font-semibold text-cax-green">{item}</p><p className="mt-2 text-sm leading-relaxed text-muted-foreground">Active planning work; no launch, funding, user base, or institutional backing is claimed.</p></div>)}
          </div>
        </div>
      </Section>

      <SimpleGrid eyebrow="Who it serves" heading="Built for the full food value chain." items={audiences} />

      <Section variant="muted"><SectionHeading eyebrow="How it works" heading="Simple trade matching for regional food supply." /><div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">{steps.map(([num,title,desc]) => <div key={num} className="rounded-2xl border border-border bg-card p-6"><p className="text-sm font-bold text-cax-gold">{num}</p><h3 className="mt-4 text-lg font-semibold">{title}</h3><p className="mt-3 text-sm leading-relaxed text-muted-foreground">{desc}</p></div>)}</div></Section>

      <MarketplacePreview compact />
      <SimpleGrid eyebrow="Platform features" heading="From marketplace to market intelligence." items={features.map(([title, description]) => ({ title, description }))} />
      <PillGrid heading="Designed for commercial use. Built for development impact." items={impactPillars} />
      <PilotCountries />
      <PartnerCategories />
      <CtaBand />
    </PageLayout>
  );
}
