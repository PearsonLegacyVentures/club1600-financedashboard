import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { siteConfig } from "@/lib/site-config";
import { Button } from "@/components/ui/button";
import { cta } from "@/lib/cta";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  return <header className="sticky top-0 z-50 border-b border-emerald-950/10 bg-cax-cream/92 backdrop-blur-xl"><div className="content-container flex h-16 items-center justify-between"><Link to="/" className="flex items-center gap-3 font-bold tracking-tight text-cax-charcoal"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-cax-green text-sm text-white">CAX</span><span className="hidden sm:inline">{siteConfig.name}</span></Link><nav className="hidden items-center gap-5 lg:flex">{siteConfig.nav.map((item)=><Link key={item.href} to={item.href} className={`text-sm font-medium transition-colors hover:text-cax-green ${location.pathname===item.href?"text-cax-green":"text-muted-foreground"}`}>{item.label}</Link>)}<Button variant="default" size="sm" asChild><Link to={cta.primary.route} data-cta={cta.primary.trackingId}>{cta.primary.label}</Link></Button></nav><button className="p-2 text-foreground lg:hidden" onClick={()=>setMobileOpen(!mobileOpen)} aria-label="Toggle menu">{mobileOpen?<X className="h-5 w-5"/>:<Menu className="h-5 w-5"/>}</button></div>{mobileOpen&&<div className="border-t border-border bg-cax-cream lg:hidden"><nav className="content-container flex flex-col gap-4 py-6">{siteConfig.nav.map((item)=><Link key={item.href} to={item.href} onClick={()=>setMobileOpen(false)} className={`text-base font-medium ${location.pathname===item.href?"text-cax-green":"text-muted-foreground"}`}>{item.label}</Link>)}<Button className="mt-2 w-full" asChild><Link to={cta.primary.route} data-cta={cta.primary.trackingId} onClick={()=>setMobileOpen(false)}>{cta.primary.label}</Link></Button></nav></div>}</header>;
}
