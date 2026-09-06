import { PageLayout } from "@/components/layout/PageLayout";
import { CtaBand, PageHeader, PageMeta, SimpleGrid } from "@/components/blocks/CaxBlocks";
import { Section } from "@/components/layout/Section";

const focus = [
  { title: "Regional food security", description: "Improving visibility between supply, demand, procurement, and trade readiness." },
  { title: "Local producers", description: "Helping farmers, fisheries, processors, and cooperatives present supply more clearly." },
  { title: "Tourism buyers", description: "Supporting hotels, restaurants, and distributors that want more regional sourcing options." },
  { title: "Institutional procurement", description: "Creating clearer pathways for recurring food needs and public-interest purchasing." },
  { title: "Development partnerships", description: "Designed for collaboration with agencies, funders, researchers, and regional institutions." },
];

export default function About() { return <PageLayout><PageMeta title="About | Caribbean Agricultural Exchange" />
  <PageHeader eyebrow="About CAX" heading="Built from The Bahamas for the Caribbean." description="Caribbean Agricultural Exchange is an early-stage platform concept focused on improving how food supply and demand connect across the region." primaryCta="Join the pilot" secondaryCta="Request partnership deck" />
  <Section><div className="mx-auto max-w-3xl space-y-6 text-lg leading-relaxed text-muted-foreground"><p>Caribbean Agricultural Exchange is being developed to support farmers, fisheries, buyers, governments, and development partners with better market visibility and practical trade tools.</p><p>The platform concept centers on a simple idea: if regional suppliers and buyers can see each other more clearly, the Caribbean can reduce waste, improve procurement planning, and strengthen food security over time.</p><p>CAX does not claim live country launches, confirmed institutional backing, or completed trade volume. The current priority is a focused pilot model with credible partners, practical data, and clear commercial use cases.</p></div></Section>
  <SimpleGrid heading="What the platform is being shaped around." items={focus} columns="lg:grid-cols-3" />
  <CtaBand />
</PageLayout>; }
