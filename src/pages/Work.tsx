import { PageLayout } from "@/components/layout/PageLayout";
import { CtaBand, MarketplacePreview, PageHeader, PageMeta, PillGrid } from "@/components/blocks/CaxBlocks";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/blocks/SectionHeading";
import { buyerRequests, productCategories, supplierListings } from "@/lib/cax-data";
import { SampleListingCard } from "@/components/blocks/CaxBlocks";

export default function Marketplace() {
  return <PageLayout><PageMeta title="Marketplace Preview | Caribbean Agricultural Exchange" />
    <PageHeader eyebrow="Marketplace Preview" heading="A polished preview of regional food supply and demand." description="The marketplace is shown as static sample UI for pilot planning. All listings and requests are examples only and do not represent live businesses or confirmed transactions." primaryCta="Join the pilot" />
    <MarketplacePreview />
    <Section><SectionHeading eyebrow="Supplier listings" heading="Sample supplier listings." description="Each card is clearly marked as a sample listing for interface preview purposes." /><div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">{supplierListings.map((item)=><SampleListingCard key={item.name} listing={item} />)}</div></Section>
    <Section variant="muted"><SectionHeading eyebrow="Buyer requests" heading="Sample buyer requests." description="Buyer requests show how recurring procurement needs could be structured in a future pilot." /><div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">{buyerRequests.map((item)=><SampleListingCard key={item.name} listing={item} tone="buyer" />)}</div></Section>
    <PillGrid heading="Product categories." items={productCategories} />
    <Section><SectionHeading eyebrow="Future transaction flow" heading="How future transactions will work." description="CAX can help structure discovery and matching. Commercial terms, logistics, payment, compliance, and fulfilment would be confirmed directly between qualified parties and relevant partners." /><div className="grid gap-4 md:grid-cols-4">{["Find matching supply or demand", "Confirm availability and standards", "Coordinate logistics and terms", "Track outcomes for better market data"].map((s,i)=><div key={s} className="rounded-2xl border bg-card p-6"><p className="text-cax-gold font-bold">0{i+1}</p><h3 className="mt-3 font-semibold">{s}</h3></div>)}</div></Section>
    <CtaBand />
  </PageLayout>;
}
