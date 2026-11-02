"use client"

import Link from "next/link"
import { Instagram, Facebook, Twitter } from "lucide-react"

const footerLinks = {
  shop: [
    { name: "Skin AI Scanner", href: "/#skin-scanner" },
    { name: "Matched Products", href: "/#matched-products" },
    { name: "All Products", href: "/shop" },
    { name: "Shade Tints & Makeup", href: "/shop" },
    { name: "Botanical Serums", href: "/shop" }
  ],
  retailer: [
    { name: "Retailer Dashboard", href: "/retailer" },
    { name: "Tone Distribution", href: "/retailer#tone-distribution" },
    { name: "Catalog Gap Report", href: "/retailer#catalog-gaps" },
    { name: "Return Impact Model", href: "/retailer#return-reduction" }
  ],
  support: [
    { name: "Shade Guarantee", href: "/" },
    { name: "Gift Concierge", href: "/#scan-results" },
    { name: "Shipping & Returns", href: "/" },
    { name: "Privacy & Biometrics", href: "/" }
  ]
}

export function Footer() {
  return (
    <footer className="bg-card pt-20 pb-24 lg:pb-12 relative overflow-hidden">
      {/* Giant Background Text */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none select-none z-0">
        <span className="font-serif text-[110px] sm:text-[160px] md:text-[230px] lg:text-[290px] font-bold text-white/25 whitespace-nowrap leading-none">
          ShadeMatch
        </span>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-16">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <h2 className="font-serif text-3xl text-foreground mb-4">ShadeMatch</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              Natural skincare & shade-calibrated beauty powered by YouCam Skin AI & Virtual Try-On.
            </p>
            <div className="flex gap-4">
              <a
                href="https://x.com/Kerroudjm"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-background flex items-center justify-center text-foreground/60 hover:text-foreground boty-transition boty-shadow"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://x.com/Kerroudjm"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-background flex items-center justify-center text-foreground/60 hover:text-foreground boty-transition boty-shadow"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://x.com/Kerroudjm"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-background flex items-center justify-center text-foreground/60 hover:text-foreground boty-transition boty-shadow"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="font-medium text-foreground mb-4">Shop & AI Scan</h3>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground boty-transition"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Retailer Links */}
          <div>
            <h3 className="font-medium text-foreground mb-4">Retailer Intelligence</h3>
            <ul className="space-y-3">
              {footerLinks.retailer.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground boty-transition"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="font-medium text-foreground mb-4">Support</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground boty-transition"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-border/50">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} ShadeMatch (Boty Atelier) • YouCam API Skin AI & eCommerce VTO Hackathon.
            </p>
            <div className="flex gap-6">
              <Link href="/" className="text-sm text-muted-foreground hover:text-foreground boty-transition">
                Privacy Policy
              </Link>
              <Link href="/retailer" className="text-sm text-muted-foreground hover:text-foreground boty-transition">
                Retailer Portal
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
