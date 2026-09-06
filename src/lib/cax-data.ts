import { Building2, Fish, Handshake, Landmark, Leaf, PackageCheck, Ship, ShoppingBasket, Store, Tractor, Truck } from "lucide-react";

export const supplierListings = [
  { name: "Green Valley Farms", country: "Jamaica", products: "Sweet peppers, callaloo, tomatoes", availability: "Available weekly", label: "Sample Supplier Listing", type: "Farm" },
  { name: "North Coast Fisheries", country: "Belize", products: "Snapper, lobster", availability: "Seasonal availability", label: "Sample Supplier Listing", type: "Fisheries" },
  { name: "Root Crop Collective", country: "Guyana", products: "Cassava, sweet potato, plantain", availability: "Bulk supply available", label: "Sample Supplier Listing", type: "Cooperative" },
  { name: "Island Herb Growers", country: "Barbados", products: "Basil, thyme, lettuce", availability: "Small batch weekly", label: "Sample Supplier Listing", type: "Farm" },
];

export const buyerRequests = [
  { name: "Boutique Hotel Group", country: "The Bahamas", products: "Herbs, lettuce, tomatoes", availability: "Monthly supply request", label: "Sample Buyer Request", type: "Hotel" },
  { name: "Restaurant Distributor", country: "Trinidad & Tobago", products: "Fresh fish and root crops", availability: "Weekly demand", label: "Sample Buyer Request", type: "Distributor" },
  { name: "Grocery Retailer", country: "Barbados", products: "Local produce and packaged goods", availability: "Recurring procurement", label: "Sample Buyer Request", type: "Grocery" },
  { name: "Institutional Meal Program", country: "Saint Lucia", products: "Root crops, fruit, vegetables", availability: "Seasonal procurement", label: "Sample Buyer Request", type: "Institution" },
];

export const partnerOpportunities = [
  { name: "Producer readiness support", country: "Regional", products: "Training, standards, and onboarding support", availability: "Sample opportunity", label: "Sample Listing", type: "Partner" },
  { name: "Cold chain coordination", country: "Regional", products: "Storage, routing, and logistics planning", availability: "Sample opportunity", label: "Sample Listing", type: "Partner" },
  { name: "Market data collaboration", country: "Regional", products: "Aggregated demand and supply insight", availability: "Sample opportunity", label: "Sample Listing", type: "Agency" },
  { name: "Pilot evaluation support", country: "Regional", products: "Impact measurement and practical reporting", availability: "Sample opportunity", label: "Sample Listing", type: "Institution" },
];

export const productCategories = ["Fresh produce", "Root crops", "Fisheries", "Poultry", "Processed foods", "Herbs", "Grains", "Specialty Caribbean products"];

export const audiences = [
  { icon: Tractor, title: "Farmers", description: "List crops by product, season, volume, and readiness for buyers." },
  { icon: Fish, title: "Fisheries", description: "Show seasonal catch availability and connect with regional demand." },
  { icon: PackageCheck, title: "Processors", description: "Present packaged and value-added products to trade buyers." },
  { icon: Truck, title: "Distributors", description: "Find supply sources and buyer demand across nearby markets." },
  { icon: Store, title: "Hotels & restaurants", description: "Source more regional produce, seafood, and specialty products." },
  { icon: ShoppingBasket, title: "Grocery stores", description: "Compare availability and build recurring regional sourcing plans." },
  { icon: Ship, title: "Exporters", description: "Identify trade-ready supply and regional product opportunities." },
  { icon: Landmark, title: "Governments & development partners", description: "Use better market visibility to support practical food security work." },
];

export const features = [
  ["Supplier and buyer profiles", "Clear profiles for trade readiness and contact pathways."],
  ["Product availability listings", "Current and seasonal supply shown by product and country."],
  ["Buyer request board", "Recurring and one-time demand posted in one regional view."],
  ["Regional price indicators", "Reference signals to support better market decisions."],
  ["Logistics partner referrals", "Visibility for shipping, cold chain, and distribution support."],
  ["Quality and standards support", "Practical readiness prompts for larger buyers and exports."],
  ["Trade readiness profiles", "Structured information buyers and finance partners can review."],
  ["Market intelligence dashboards", "Aggregated insights for planning, procurement, and policy."],
];

export const impactPillars = ["Food security", "Import substitution", "Farmer income", "Fisheries value chain visibility", "Regional trade", "Climate resilience", "Investment readiness", "Better procurement data"];
export const pilotCountries = ["The Bahamas", "Jamaica", "Trinidad & Tobago", "Barbados", "Guyana", "Belize"];
export const partnerCategories = ["Development banks", "Agriculture ministries", "Farmer cooperatives", "Fisheries organizations", "Hotel and tourism associations", "Export agencies", "Cold chain and shipping providers", "Research institutions"];
export const partnerRoles = [
  { icon: Handshake, title: "Institutional coordination", description: "Help align pilots with national and regional food security priorities." },
  { icon: Building2, title: "Market access support", description: "Connect producer groups, buyers, and trade agencies around practical demand." },
  { icon: Leaf, title: "Standards and readiness", description: "Support quality, traceability, climate-smart production, and export preparation." },
];
