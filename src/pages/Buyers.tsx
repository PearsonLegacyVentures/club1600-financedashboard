import { PageLayout } from "@/components/layout/PageLayout";
import { CtaBand, PageHeader, PageMeta, SampleListingCard, SimpleGrid } from "@/components/blocks/CaxBlocks";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/blocks/SectionHeading";
import { buyerRequests } from "@/lib/cax-data";

const benefits = ["Find regional suppliers faster.", "Compare availability by country and product.", "Post recurring supply needs.", "Support local and regional procurement.", "Reduce dependence on imported supply where practical."];
const workflow = ["Post a request", "Review matched suppliers", "Confirm standards and volume", "Coordinate purchasing and logistics"];

export default function Buyers() { return <PageLayout><PageMeta title="For Buyers | Caribbean Agricultural Exchange" />
  <PageHeader eyebrow="For buyers" heading="Source more regional food with less friction." description="CAX is being built for hotels, restaurants, grocery stores, distributors, exporters, and institutions that want clearer access to regional suppliers and product availability." primaryCta="Join the pilot" />
  <Section><SectionHeading eyebrow="Why buyers need CAX" heading="Regional sourcing should be easier to plan." description="Buyers often want more local and Caribbean supply, but availability is fragmented across islands, seasons, standards, and logistics routes. CAX provides a clearer view of supply and a structured request board." /></Section>
  <SimpleGrid heading="Buyer benefits." items={benefits.map((title)=>({title, description:"A practical pilot feature designed to improve regional sourcing visibility without promising guaranteed supply."}))} />
  <Section variant="muted"><SectionHeading eyebrow="Request board preview" heading="Sample buyer requests." /><div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">{buyerRequests.map((item)=><SampleListingCard key={item.name} listing={item} tone="buyer" />)}</div></Section>
  <SimpleGrid heading="Regional sourcing workflow." items={workflow.map((title)=>({title, description:"A simple step in moving from need identification to supplier conversations and procurement planning."}))} columns="lg:grid-cols-4" />
  <CtaBand heading="Make regional procurement easier to see, compare, and plan." />
</PageLayout>; }
