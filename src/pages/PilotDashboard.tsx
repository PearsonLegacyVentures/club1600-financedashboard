import { useMemo, useState } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageHeader, PageMeta } from "@/components/blocks/CaxBlocks";
import { Section } from "@/components/layout/Section";
import { getPilotSubmissions } from "@/lib/pilot-submissions";

const statuses = ["New", "Pending verification", "Contacted", "Qualified"];
type FilterConfig = { label: string; value: string; set: (value: string) => void; options: string[] };

export default function PilotDashboard() {
  const submissions = getPilotSubmissions();
  const [country, setCountry] = useState("All");
  const [role, setRole] = useState("All");
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("All");
  const countries = useMemo(() => ["All", ...Array.from(new Set(submissions.map((item) => item.country).filter(Boolean)))], [submissions]);
  const roles = useMemo(() => ["All", ...Array.from(new Set(submissions.map((item) => item.role)))], [submissions]);
  const categories = useMemo(() => ["All", ...Array.from(new Set(submissions.map((item) => item.productCategory).filter(Boolean)))], [submissions]);
  const filtered = submissions.filter((item) => (country === "All" || item.country === country) && (role === "All" || item.role === role) && (category === "All" || item.productCategory === category) && (status === "All" || item.status === status));

  return <PageLayout><PageMeta title="Pilot Dashboard | Caribbean Agricultural Exchange" />
    <PageHeader eyebrow="Pilot dashboard" heading="Pending pilot interest review." description="A simple admin-style view for reviewing sample and locally submitted pilot interest. This is not a live institutional dashboard." />
    <Section>
      <div className="grid gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm md:grid-cols-4">
        {([{label:"Country", value:country, set:setCountry, options:countries}, {label:"Role", value:role, set:setRole, options:roles}, {label:"Product category", value:category, set:setCategory, options:categories}, {label:"Status", value:status, set:setStatus, options:["All", ...statuses]}] satisfies FilterConfig[]).map((filter) => <label key={filter.label} className="text-sm font-medium">{filter.label}<select value={filter.value} onChange={(event)=>filter.set(event.target.value)} className="mt-2 h-10 w-full rounded-md border border-input bg-background px-3 text-sm"><option value="All">All</option>{filter.options.filter((option)=>option !== "All").map((option)=><option key={option}>{option}</option>)}</select></label>)}
      </div>
      <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="grid grid-cols-1 gap-4 border-b border-border bg-cax-cream p-4 text-sm font-semibold text-cax-charcoal md:grid-cols-[1.1fr_0.8fr_0.8fr_0.8fr_0.8fr]"><span>Contact</span><span>Role</span><span>Country</span><span>Category</span><span>Status</span></div>
        {filtered.map((item) => <article key={item.id} className="grid grid-cols-1 gap-4 border-b border-border p-4 text-sm last:border-b-0 md:grid-cols-[1.1fr_0.8fr_0.8fr_0.8fr_0.8fr]"><div><p className="font-semibold text-cax-charcoal">{item.organization || item.fullName}</p><p className="text-muted-foreground">{item.email}</p><p className="mt-1 text-xs text-muted-foreground">{item.products || item.partnershipInterest || item.message}</p></div><span>{item.role}</span><span>{item.country}</span><span>{item.productCategory || "—"}</span><span><span className="rounded-full bg-cax-green/10 px-3 py-1 text-xs font-semibold text-cax-green">{item.status}</span></span></article>)}
      </div>
    </Section>
  </PageLayout>;
}
