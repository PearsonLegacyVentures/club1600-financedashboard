import type { ElementType } from "react";
import { Link } from "react-router-dom";
import { Check, Filter, LineChart, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/blocks/SectionHeading";
import { buyerRequests, partnerCategories, partnerOpportunities, pilotCountries, productCategories, supplierListings } from "@/lib/cax-data";
import { cta } from "@/lib/cta";

type Listing = { name: string; country: string; products: string; availability: string; label: string; type: string };

export function PageMeta({ title, description }: { title: string; description?: string }) {
  document.title = title;
  const desc = description ?? "Caribbean Agricultural Exchange is a regional platform concept for Caribbean food trade and food security.";
  let tag = document.querySelector('meta[name="description"]');
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute("name", "description");
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", desc);
  return null;
}

export function PageHeader({ eyebrow, heading, description, primaryCta, secondaryCta }: { eyebrow: string; heading: string; description: string; primaryCta?: string; secondaryCta?: string }) {
  return (
    <section className="relative overflow-hidden border-b border-emerald-950/10 bg-cax-cream section-padding-sm">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(181,145,73,0.18),transparent_32rem)]" />
      <div className="content-container relative max-w-5xl">
        <p className="text-eyebrow mb-4">{eyebrow}</p>
        <h1 className="text-headline max-w-4xl text-balance">{heading}</h1>
        <p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted-foreground">{description}</p>
        {(primaryCta || secondaryCta) && (
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            {primaryCta && <Button variant="hero" asChild><Link to={cta.primary.route} data-cta={cta.primary.trackingId}>{primaryCta}</Link></Button>}
            {secondaryCta && <Button variant="hero-outline" asChild><Link to={cta.secondary.route} data-cta={cta.secondary.trackingId}>{secondaryCta}</Link></Button>}
          </div>
        )}
      </div>
    </section>
  );
}

export function CtaBand({ heading = "Help build the Caribbean’s food trade infrastructure.", description = "CAX is accepting pilot interest from suppliers, buyers, institutions, and partners exploring practical regional sourcing.", partnerOnly = false }: { heading?: string; description?: string; partnerOnly?: boolean }) {
  return (
    <Section className="bg-cax-charcoal text-white">
      <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.24em] text-cax-gold">Pilot interest</p>
          <h2 className="text-3xl font-bold tracking-tight text-white md:text-5xl">{heading}</h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/72">{description}</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
          {!partnerOnly && <Button variant="accent" size="lg" asChild><Link to={cta.primary.route} data-cta={cta.primary.trackingId}>{cta.primary.label}</Link></Button>}
          <Button variant="outline" size="lg" className="border-white/30 bg-transparent text-white hover:bg-white hover:text-cax-charcoal" asChild><Link to={cta.secondary.route} data-cta={cta.secondary.trackingId}>{cta.secondary.label}</Link></Button>
        </div>
      </div>
    </Section>
  );
}

export function FilterBar() {
  return <div className="grid gap-3 rounded-2xl border border-border bg-card p-3 shadow-sm sm:grid-cols-2 lg:grid-cols-4">{["Country", "Product category", "Supplier type", "Buyer type"].map((item) => <div key={item} className="flex items-center justify-between rounded-xl bg-cax-cream px-4 py-3 text-sm font-medium"><span>{item}</span><Filter className="h-4 w-4 text-cax-green" /></div>)}</div>;
}

export function SampleListingCard({ listing, tone = "supplier" }: { listing: Listing; tone?: "supplier" | "buyer" }) {
  return (
    <article className="group rounded-2xl border border-border bg-card p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="mb-5 flex items-start justify-between gap-4">
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${tone === "supplier" ? "bg-emerald-950 text-white" : "bg-cax-gold text-cax-charcoal"}`}>{listing.label}</span>
        <span className="text-xs font-medium text-muted-foreground">{listing.type}</span>
      </div>
      <h3 className="text-xl font-semibold">{listing.name}</h3>
      <p className="mt-2 flex items-center gap-2 text-sm font-medium text-cax-green"><MapPin className="h-4 w-4" />{listing.country}</p>
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{listing.products}</p>
      <div className="mt-5 rounded-xl bg-cax-cream p-3 text-sm font-medium text-cax-charcoal">{listing.availability}</div>
    </article>
  );
}

export function MarketplacePreview({ compact = false }: { compact?: boolean }) {
  const listings = compact ? [supplierListings[0], supplierListings[1]] : supplierListings;
  const requests = compact ? [buyerRequests[0], { name: "School Meal Program", country: "Barbados", products: "Seeking root crops and fresh produce", availability: "Recurring procurement", label: "Sample Buyer Request", type: "Institution" }] : buyerRequests;
  const tabs = [
    { label: "Supplier Listings", items: listings, tone: "supplier" as const },
    { label: "Buyer Requests", items: requests, tone: "buyer" as const },
    { label: "Partner Opportunities", items: partnerOpportunities, tone: "partner" as const },
  ];
  return (
    <Section variant={compact ? "muted" : "default"}>
      <SectionHeading eyebrow="Platform preview" heading="A regional marketplace for supply, demand, and support." description="Static sample records show how CAX could organize pilot listings, buyer requests, and partnership opportunities. No live businesses, transactions, or institutional backing are implied." />
      <FilterBar />
      <Tabs defaultValue={tabs[0].label} className="mt-8">
        <TabsList className="grid h-auto w-full grid-cols-1 gap-2 bg-cax-cream p-2 sm:grid-cols-3">
          {tabs.map((tab) => <TabsTrigger key={tab.label} value={tab.label} className="py-3 text-sm">{tab.label}</TabsTrigger>)}
        </TabsList>
        {tabs.map((tab) => (
          <TabsContent key={tab.label} value={tab.label} className="mt-6">
            <div className="mb-4 flex items-center justify-between gap-4 border-b border-border pb-3">
              <h3 className="text-xl font-semibold">{tab.label}</h3>
              <span className="rounded-full bg-cax-cream px-3 py-1 text-xs font-semibold text-cax-green">Sample data</span>
            </div>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {tab.items.map((item) => <SampleListingCard key={item.name} listing={item} tone={tab.tone === "buyer" ? "buyer" : "supplier"} />)}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </Section>
  );
}

export function SimpleGrid({ eyebrow, heading, description, items, columns = "lg:grid-cols-4" }: { eyebrow?: string; heading: string; description?: string; items: { title: string; description: string; icon?: ElementType }[]; columns?: string }) {
  return <Section><SectionHeading eyebrow={eyebrow} heading={heading} description={description} /><div className={`grid gap-5 sm:grid-cols-2 ${columns}`}>{items.map((item) => <div key={item.title} className="rounded-2xl border border-border bg-card p-6"><div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-cax-green/10 text-cax-green">{item.icon ? <item.icon className="h-5 w-5" /> : <Check className="h-5 w-5" />}</div><h3 className="text-lg font-semibold">{item.title}</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p></div>)}</div></Section>;
}

export function PillGrid({ heading, items, description }: { heading: string; items: string[]; description?: string }) {
  return <Section variant="muted"><SectionHeading heading={heading} description={description} /><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{items.map((item) => <div key={item} className="rounded-xl border border-border bg-card px-5 py-4 text-sm font-semibold">{item}</div>)}</div></Section>;
}

export function PilotCountries() {
  return <Section><SectionHeading eyebrow="Pilot markets" heading="Starting with focused regional pilots." description="The first phase should focus on a small group of countries with strong agricultural production, tourism demand, and trade potential." /><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{pilotCountries.map((country) => <div key={country} className="rounded-2xl border border-border bg-card p-6"><p className="text-xs font-semibold uppercase tracking-widest text-cax-gold">Proposed pilot market</p><h3 className="mt-3 text-xl font-semibold">{country}</h3></div>)}</div></Section>;
}

export function PartnerCategories() {
  return <Section><SectionHeading eyebrow="Collaboration" heading="Built for collaboration with regional institutions." description="CAX is designed to work alongside agriculture ministries, trade agencies, development banks, hotel associations, farmer groups, fisheries organizations, logistics partners, and regional institutions." /><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{partnerCategories.map((item) => <div key={item} className="rounded-xl bg-cax-cream px-4 py-4 text-sm font-semibold text-cax-charcoal">{item}</div>)}</div><div className="mt-8"><Button variant="hero" asChild><Link to={cta.secondary.route} data-cta={cta.secondary.trackingId}>{cta.secondary.label}</Link></Button></div></Section>;
}

export function InsightPanel() {
  return <div className="rounded-[2rem] border border-white/10 bg-white/8 p-4 shadow-2xl backdrop-blur"><div className="rounded-[1.5rem] bg-cax-cream p-5 text-cax-charcoal"><div className="mb-5 flex items-center justify-between"><div><p className="text-xs font-semibold uppercase tracking-widest text-cax-green">Platform Preview</p><h3 className="mt-1 text-xl font-bold">Regional trade desk</h3></div><LineChart className="h-6 w-6 text-cax-gold" /></div>{["Supplier listings", "Buyer requests", "Regional trade matches", "Food security insights"].map((row, i) => <div key={row} className="mb-3 flex items-center justify-between rounded-xl border border-cax-green/10 bg-white p-4"><span className="text-sm font-semibold">{row}</span><span className="rounded-full bg-cax-green/10 px-3 py-1 text-xs font-semibold text-cax-green">Sample {i + 1}</span></div>)}<p className="mt-4 text-xs leading-relaxed text-muted-foreground">Illustrative interface only. No live listings, users, partners, or transactions are implied.</p></div></div>;
}
