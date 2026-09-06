import { PageLayout } from "@/components/layout/PageLayout";
import { CtaBand, PageHeader, PageMeta, SimpleGrid } from "@/components/blocks/CaxBlocks";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/blocks/SectionHeading";

const benefits = [
  "Reach hotels, restaurants, groceries, distributors, and exporters.",
  "Reduce waste from unsold supply.",
  "Show availability by product and season.",
  "Build a verified supplier profile.",
  "Prepare for financing and larger buyers.",
];
const listable = ["Fresh produce", "Root crops", "Seafood", "Poultry", "Processed foods", "Herbs", "Specialty Caribbean products", "Seasonal bulk supply"];
const readiness = ["Product list and seasonal calendar", "Country and parish or island location", "Estimated volumes and harvest windows", "Packaging and cold storage needs", "Food safety or export documents if available", "Preferred contact and delivery terms"];

export default function Suppliers() {
  return <PageLayout><PageMeta title="For Suppliers | Caribbean Agricultural Exchange" />
    <PageHeader eyebrow="For suppliers" heading="Reach more buyers across the Caribbean." description="CAX is being designed for farmers, fisheries, processors, and cooperatives that need clearer demand, stronger profiles, and more practical routes to regional buyers." primaryCta="Join the pilot" />
    <Section><div className="grid gap-8 lg:grid-cols-2"><SectionHeading align="left" eyebrow="Why suppliers need CAX" heading="Good supply needs visible demand." description="Many producers can grow, catch, or process more than their local market can absorb, but finding consistent buyers across islands is difficult. CAX gives suppliers a structured way to show availability and prepare for larger trade opportunities." /><div className="rounded-2xl bg-cax-charcoal p-7 text-white"><h3 className="text-2xl font-semibold text-white">Supplier benefits</h3><div className="mt-6 space-y-3">{benefits.map((b)=><p key={b} className="rounded-xl bg-white/8 p-4 text-sm text-white/82">{b}</p>)}</div></div></div></Section>
    <SimpleGrid heading="What you can list." items={listable.map((title)=>({title, description:"Add basic availability, country, production type, and readiness details for pilot review."}))} />
    <Section variant="muted"><SectionHeading eyebrow="Matching" heading="How supplier matching works." description="During the pilot, supplier profiles and product availability can be compared with buyer requests by country, category, season, and readiness." /><div className="grid gap-4 md:grid-cols-3">{["Create a supplier profile", "List available products", "Review matched buyer demand"].map((s,i)=><div key={s} className="rounded-2xl border bg-card p-6"><p className="text-cax-gold font-bold">0{i+1}</p><h3 className="mt-3 font-semibold">{s}</h3></div>)}</div></Section>
    <SimpleGrid heading="Supplier readiness checklist." items={readiness.map((title)=>({title, description:"Helpful information for buyers, distributors, institutions, and finance partners."}))} columns="lg:grid-cols-3" />
    <CtaBand heading="Put your supply where regional buyers can find it." />
  </PageLayout>;
}
