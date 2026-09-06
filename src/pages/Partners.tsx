import { PageLayout } from "@/components/layout/PageLayout";
import { CtaBand, PageHeader, PageMeta, PillGrid, SimpleGrid } from "@/components/blocks/CaxBlocks";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/blocks/SectionHeading";
import { partnerRoles } from "@/lib/cax-data";

const outcomes = ["Stronger food security", "Better market access for small producers", "Regional trade visibility", "Improved procurement data", "Support for climate-smart agriculture", "Investment readiness for producers", "Better linkages between tourism and agriculture"];
const pilot = ["Select proposed pilot markets", "Register sample supplier and buyer cohorts", "Map priority products and procurement needs", "Review logistics, standards, and data requirements"];
const data = ["Product availability by country", "Buyer demand by category", "Readiness gaps for producers", "Procurement and sourcing patterns", "Logistics and standards bottlenecks", "Pilot reporting for institutions"];

export default function Partners() { return <PageLayout><PageMeta title="For Partners | Caribbean Agricultural Exchange" />
  <PageHeader eyebrow="For partners" heading="A regional platform for food security, trade, and market intelligence." description="CAX is designed to align with priorities often supported by regional development institutions, governments, trade agencies, hotel associations, and producer organizations. No institutional support is claimed unless formally confirmed." secondaryCta="Request partnership deck" />
  <Section><SectionHeading eyebrow="Why this matters" heading="Food security needs practical market infrastructure." description="Regional food systems need better visibility into what is available, who is buying, where gaps exist, and what support producers need to become trade-ready." /></Section>
  <PillGrid heading="Development outcomes." items={outcomes} />
  <SimpleGrid eyebrow="Partner roles" heading="Where partners can strengthen the pilot." items={partnerRoles} columns="lg:grid-cols-3" />
  <SimpleGrid heading="Pilot model." items={pilot.map((title)=>({title, description:"A focused step for testing market connection, readiness, and reporting value before broader rollout."}))} columns="lg:grid-cols-4" />
  <SimpleGrid heading="Data and reporting value." items={data.map((title)=>({title, description:"Aggregated pilot insight that can support planning without overstating live platform traction."}))} columns="lg:grid-cols-3" />
  <CtaBand partnerOnly heading="Explore a partnership deck for the CAX pilot." />
</PageLayout>; }
