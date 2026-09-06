import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index";
import About from "./pages/About";
import Suppliers from "./pages/Services";
import Marketplace from "./pages/Work";
import Buyers from "./pages/Buyers";
import Partners from "./pages/Partners";
import Contact from "./pages/Contact";
import PilotDashboard from "./pages/PilotDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();
const App = () => <QueryClientProvider client={queryClient}><TooltipProvider><Toaster /><Sonner /><BrowserRouter><Routes><Route path="/" element={<Index />} /><Route path="/marketplace" element={<Marketplace />} /><Route path="/suppliers" element={<Suppliers />} /><Route path="/buyers" element={<Buyers />} /><Route path="/partners" element={<Partners />} /><Route path="/about" element={<About />} /><Route path="/contact" element={<Contact />} /><Route path="/pilot-dashboard" element={<PilotDashboard />} />{/* Preserve original template routes as working aliases. */}<Route path="/services" element={<Suppliers />} /><Route path="/work" element={<Marketplace />} /><Route path="*" element={<NotFound />} /></Routes></BrowserRouter></TooltipProvider></QueryClientProvider>;
export default App;
