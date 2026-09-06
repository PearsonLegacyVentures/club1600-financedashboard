export type PilotRole = "Supplier" | "Buyer" | "Distributor" | "Partner / Agency / Investor" | "Other";
export type PilotStatus = "New" | "Pending verification" | "Contacted" | "Qualified";

export type PilotSubmission = {
  id: string;
  submittedAt: string;
  fullName: string;
  organization?: string;
  email: string;
  phone?: string;
  role: PilotRole;
  country: string;
  productCategory?: string;
  products?: string;
  quantityOrVolume?: string;
  frequencyOrSeasonality?: string;
  buyerType?: string;
  organizationType?: string;
  partnershipInterest?: string;
  message?: string;
  status: PilotStatus;
};

export type PilotSubmissionInput = Omit<PilotSubmission, "id" | "submittedAt" | "status">;

const STORAGE_KEY = "cax_pilot_submissions";

export const mockPilotSubmissions: PilotSubmission[] = [
  {
    id: "sample-001",
    submittedAt: "2026-06-10",
    fullName: "Sample supplier contact",
    organization: "Sample Producer Group",
    email: "sample-supplier@example.com",
    phone: "+1 000 000 0000",
    role: "Supplier",
    country: "Jamaica",
    productCategory: "Fresh produce",
    products: "Sweet peppers, tomatoes, herbs",
    quantityOrVolume: "Weekly small-batch supply",
    frequencyOrSeasonality: "Year-round with seasonal peaks",
    status: "New",
  },
  {
    id: "sample-002",
    submittedAt: "2026-06-11",
    fullName: "Sample buyer contact",
    organization: "Sample Hotel Buyer",
    email: "sample-buyer@example.com",
    role: "Buyer",
    country: "The Bahamas",
    productCategory: "Fisheries",
    products: "Snapper, lobster, herbs",
    quantityOrVolume: "Recurring weekly requirement",
    frequencyOrSeasonality: "Weekly",
    buyerType: "Hotel / Resort",
    status: "Pending verification",
  },
  {
    id: "sample-003",
    submittedAt: "2026-06-12",
    fullName: "Sample agency contact",
    organization: "Sample Trade Agency",
    email: "sample-agency@example.com",
    role: "Partner / Agency / Investor",
    country: "Barbados",
    productCategory: "Partnership",
    organizationType: "Trade agency",
    partnershipInterest: "Pilot coordination and producer readiness",
    message: "Interested in understanding requirements for a practical regional pilot.",
    status: "Contacted",
  },
  {
    id: "sample-004",
    submittedAt: "2026-06-13",
    fullName: "Sample distributor contact",
    organization: "Sample Regional Distributor",
    email: "sample-distributor@example.com",
    role: "Distributor",
    country: "Trinidad & Tobago",
    productCategory: "Root crops",
    products: "Cassava, plantain, sweet potato",
    quantityOrVolume: "Monthly consolidated loads",
    frequencyOrSeasonality: "Monthly",
    status: "Qualified",
  },
];

export async function submitPilotInterest(input: PilotSubmissionInput) {
  const submission: PilotSubmission = {
    ...input,
    id: `local-${Date.now()}`,
    submittedAt: new Date().toISOString(),
    status: "New",
  };

  if (typeof window !== "undefined") {
    const existing = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]") as PilotSubmission[];
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([submission, ...existing]));
  }

  return submission;
}

export function getPilotSubmissions() {
  if (typeof window === "undefined") return mockPilotSubmissions;
  const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]") as PilotSubmission[];
  return [...stored, ...mockPilotSubmissions];
}
