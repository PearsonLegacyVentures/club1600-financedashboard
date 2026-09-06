import { FormEvent, ReactNode, useState } from "react";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "./SectionHeading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cta } from "@/lib/cta";
import { PilotRole, submitPilotInterest } from "@/lib/pilot-submissions";

interface ContactFormProps { eyebrow?: string; heading: string; description?: string; }
const roles: PilotRole[] = ["Supplier", "Buyer", "Distributor", "Partner / Agency / Investor", "Other"];
const categories = ["Fresh produce", "Root crops", "Fisheries", "Poultry", "Processed foods", "Herbs", "Grains", "Specialty Caribbean products"];
const buyerTypes = ["Hotel / Resort", "Restaurant", "Grocery / Retail", "Distributor", "Exporter", "Institution", "Other"];
const organizationTypes = ["Government agency", "Development institution", "Trade agency", "Investor", "NGO / Foundation", "Industry association", "Other"];

function Field({ id, label, children }: { id: string; label: string; children: ReactNode }) {
  return <div><label htmlFor={id} className="mb-1.5 block text-sm font-medium">{label}</label>{children}</div>;
}

function SelectField({ id, label, options, required = false }: { id: string; label: string; options: string[]; required?: boolean }) {
  return <Field id={id} label={label}><select id={id} name={id} required={required} className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"><option value="">Select one</option>{options.map((option)=><option key={option}>{option}</option>)}</select></Field>;
}

export function ContactForm({ eyebrow, heading, description }: ContactFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [role, setRole] = useState<PilotRole>("Supplier");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    const formData = new FormData(event.currentTarget);
    await submitPilotInterest({
      fullName: String(formData.get("fullName") ?? ""),
      organization: String(formData.get("organization") ?? ""),
      email: String(formData.get("email") ?? ""),
      phone: String(formData.get("phone") || formData.get("whatsapp") || ""),
      role,
      country: String(formData.get("country") || formData.get("deliveryCountry") || ""),
      productCategory: String(formData.get("productCategory") ?? ""),
      products: String(formData.get("products") || formData.get("productsNeeded") || ""),
      quantityOrVolume: String(formData.get("estimatedVolume") || formData.get("quantity") || ""),
      frequencyOrSeasonality: String(formData.get("seasonality") || formData.get("frequency") || ""),
      buyerType: String(formData.get("buyerType") ?? ""),
      organizationType: String(formData.get("organizationType") ?? ""),
      partnershipInterest: String(formData.get("partnershipInterest") ?? ""),
      message: String(formData.get("message") ?? ""),
    });
    setSubmitted(true);
    setSubmitting(false);
    event.currentTarget.reset();
    setRole("Supplier");
  }

  return <Section><div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr]"><div><SectionHeading eyebrow={eyebrow} heading={heading} description={description} align="left" className="mb-8" /><div className="rounded-2xl bg-cax-charcoal p-6 text-white"><h4 className="text-lg font-semibold text-white">Pilot intake</h4><p className="mt-3 text-sm leading-relaxed text-white/72">This form now captures structured pilot interest by role so CAX can review supply, demand, distribution, partnership, agency, and investment conversations without overclaiming readiness.</p><p className="mt-5 text-sm font-medium text-cax-gold">Frontend-safe submission</p><p className="mt-2 text-xs leading-relaxed text-white/58">Submissions are stored locally for this pilot preview. The service layer is ready for a secure backend or CRM connection without exposing secrets.</p></div></div>
    <form className="space-y-5 rounded-2xl border border-border bg-card p-5 shadow-sm md:p-7" onSubmit={handleSubmit}>
      <div className="grid gap-5 sm:grid-cols-2"><Field id="fullName" label="Full name"><Input id="fullName" name="fullName" required /></Field><Field id="organization" label="Organization"><Input id="organization" name="organization" /></Field></div>
      <div className="grid gap-5 sm:grid-cols-2"><Field id="email" label="Email"><Input id="email" name="email" type="email" required /></Field><Field id="phone" label="Phone"><Input id="phone" name="phone" /></Field></div>
      <Field id="role" label="I am a"><select id="role" name="role" value={role} onChange={(event)=>setRole(event.target.value as PilotRole)} className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">{roles.map((r)=><option key={r}>{r}</option>)}</select></Field>

      {(role === "Supplier" || role === "Distributor") && <div className="rounded-2xl border border-cax-green/15 bg-cax-cream p-4"><p className="mb-4 text-sm font-semibold text-cax-green">Supply details</p><div className="grid gap-5 sm:grid-cols-2"><SelectField id="productCategory" label="Product categories" options={categories} required /><Field id="country" label="Country"><Input id="country" name="country" required /></Field><Field id="products" label="Products available"><Input id="products" name="products" placeholder="e.g. callaloo, snapper, cassava" required /></Field><Field id="estimatedVolume" label="Estimated volume"><Input id="estimatedVolume" name="estimatedVolume" placeholder="e.g. 200 lb weekly" /></Field><Field id="seasonality" label="Seasonality"><Input id="seasonality" name="seasonality" placeholder="Year-round, seasonal, harvest window" /></Field><Field id="whatsapp" label="WhatsApp"><Input id="whatsapp" name="whatsapp" /></Field></div></div>}

      {role === "Buyer" && <div className="rounded-2xl border border-cax-gold/30 bg-cax-cream p-4"><p className="mb-4 text-sm font-semibold text-cax-green">Buyer requirements</p><div className="grid gap-5 sm:grid-cols-2"><SelectField id="productCategory" label="Product category" options={categories} required /><Field id="productsNeeded" label="Products needed"><Input id="productsNeeded" name="productsNeeded" placeholder="e.g. herbs, lettuce, fresh fish" required /></Field><Field id="quantity" label="Quantity"><Input id="quantity" name="quantity" placeholder="Estimated amount or range" /></Field><Field id="frequency" label="Frequency"><Input id="frequency" name="frequency" placeholder="Weekly, monthly, seasonal" /></Field><Field id="deliveryCountry" label="Delivery country"><Input id="deliveryCountry" name="deliveryCountry" required /></Field><SelectField id="buyerType" label="Buyer type" options={buyerTypes} required /></div></div>}

      {role === "Partner / Agency / Investor" && <div className="rounded-2xl border border-border bg-cax-cream p-4"><p className="mb-4 text-sm font-semibold text-cax-green">Partnership details</p><div className="grid gap-5 sm:grid-cols-2"><SelectField id="organizationType" label="Organization type" options={organizationTypes} required /><Field id="country" label="Country"><Input id="country" name="country" required /></Field></div><div className="mt-5"><Field id="partnershipInterest" label="Partnership interest"><Input id="partnershipInterest" name="partnershipInterest" placeholder="Pilot support, market access, readiness, investment review…" required /></Field></div><div className="mt-5"><Field id="message" label="Message"><Textarea id="message" name="message" rows={5} /></Field></div></div>}

      {role === "Other" && <><Field id="country" label="Country"><Input id="country" name="country" required /></Field><Field id="message" label="Message"><Textarea id="message" name="message" rows={5} required /></Field></>}
      {role !== "Partner / Agency / Investor" && role !== "Other" && <Field id="message" label="Additional notes"><Textarea id="message" name="message" rows={4} /></Field>}
      {submitted && <div className="rounded-xl bg-cax-green/10 p-4 text-sm font-medium text-cax-green">Thank you. Your pilot interest has been recorded for review.</div>}
      <Button variant="hero" type="submit" className="w-full sm:w-auto" data-cta={cta.primary.trackingId} disabled={submitting}>{submitting ? "Submitting…" : cta.primary.label}</Button>
    </form></div></Section>;
}
