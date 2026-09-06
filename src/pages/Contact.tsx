import { PageLayout } from "@/components/layout/PageLayout";
import { ContactForm } from "@/components/blocks/ContactForm";
import { PageHeader, PageMeta } from "@/components/blocks/CaxBlocks";

export default function Contact() { return <PageLayout><PageMeta title="Join the Pilot | Caribbean Agricultural Exchange" />
  <PageHeader eyebrow="Contact" heading="Join the CAX pilot." description="Share your supplier, buyer, distributor, agency, partner, or investment interest. This early-stage form helps identify practical pilot demand across the Caribbean." />
  <ContactForm heading="Pilot interest form." description="Tell us who you are, where you operate, and how you would like to participate in Caribbean Agricultural Exchange." />
</PageLayout>; }
