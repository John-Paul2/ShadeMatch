"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, ShoppingBag, Sparkles, BarChart3, Store } from "lucide-react"
import { CartDrawer } from "./cart-drawer"
import { useCart } from "./cart-context"
import { useSkinScan } from "./skin-scan-context"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const { setIsOpen, itemCount } = useCart()
  const { toneResult } = useSkinScan()

  const isRetailer = pathname?.startsWith("/retailer")
  const isShop = !isRetailer

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 px-4 pt-4">
        <nav
          className="max-w-7xl mx-auto px-5 lg:px-8 backdrop-blur-md rounded-2xl py-0 my-0 animate-scale-fade-in bg-[rgba(247,244,239,0.82)] border border-border/70"
          style={{ boxShadow: "rgba(0, 0, 0, 0.07) 0px 10px 40px" }}
        >
          <div className="flex items-center justify-between h-[68px]">
            {/* Mobile menu button */}
            <button
              type="button"
              className="lg:hidden p-2 text-foreground/80 hover:text-foreground boty-transition"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Desktop Navigation - Left: Two primary tabs (Shop & Retailer) */}
            <div className="hidden lg:flex items-center gap-2 bg-card/90 p-1 rounded-full border border-border/60">
              <Link
                href="/"
                className={`inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium tracking-wide boty-transition ${
                  isShop
                    ? "bg-primary text-primary-foreground boty-shadow"
                    : "text-foreground/70 hover:text-foreground"
                }`}
              >
                <Store className="w-4 h-4" />
                Shop
              </Link>
              <Link
                href="/retailer"
                className={`inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium tracking-wide boty-transition ${
                  isRetailer
                    ? "bg-primary text-primary-foreground boty-shadow"
                    : "text-foreground/70 hover:text-foreground"
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                Retailer
              </Link>
            </div>

            {/* Logo */}
            <Link href="/" className="absolute left-1/2 -translate-x-1/2 text-center">
              <h1 className="font-serif text-2xl sm:text-3xl tracking-wider text-foreground">
                ShadeMatch
              </h1>
            </Link>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              {toneResult && (
                <Link
                  href="/#skin-scanner"
                  className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-card border border-border text-xs font-medium text-foreground hover:border-primary/50 boty-transition"
                  title="Your calibrated skin tone"
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-foreground/20 flex-shrink-0"
                    style={{ backgroundColor: toneResult.hex }}
                  />
                  <span>{toneResult.shadeCode}</span>
                  <span className="text-muted-foreground hidden md:inline">• {toneResult.undertone}</span>
                </Link>
              )}

              <Link
                href="/#skin-scanner"
                className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium hover:bg-primary/15 boty-transition"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Skin AI
              </Link>

              <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="relative p-2 text-foreground/70 hover:text-foreground boty-transition"
                aria-label="Cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-0 -right-0 w-4 h-4 bg-primary text-primary-foreground text-[10px] flex items-center justify-center rounded-full">
                    {itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          <CartDrawer />

          {/* Mobile Drawer Navigation */}
          <div
            className={`lg:hidden overflow-hidden boty-transition ${
              isMenuOpen ? "max-h-64 pb-6" : "max-h-0"
            }`}
          >
            <div className="flex flex-col gap-3 pt-4 border-t border-border/50">
              <Link
                href="/"
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm tracking-wide boty-transition ${
                  isShop
                    ? "bg-primary text-primary-foreground font-medium"
                    : "text-foreground/70 hover:text-foreground"
                }`}
              >
                <Store className="w-4 h-4" />
                Shop & Skin AI Scan
              </Link>
              <Link
                href="/retailer"
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm tracking-wide boty-transition ${
                  isRetailer
                    ? "bg-primary text-primary-foreground font-medium"
                    : "text-foreground/70 hover:text-foreground"
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                Retailer Dashboard
              </Link>
              <Link
                href="/shop"
                onClick={() => setIsMenuOpen(false)}
                className="px-4 py-2 text-sm tracking-wide text-foreground/70 hover:text-foreground boty-transition"
              >
                Full Catalog
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Bottom Tab Bar with two tabs: Shop and Retailer */}
      <div
        className="lg:hidden fixed bottom-0 left-0 right-0 z-50 px-4 pb-3 pt-1 pointer-events-none"
        role="navigation"
        aria-label="Primary Bottom Navigation"
      >
        <div
          className="max-w-md mx-auto pointer-events-auto grid grid-cols-2 gap-2 p-1.5 rounded-full backdrop-blur-md bg-[rgba(247,244,239,0.92)] border border-border"
          style={{ boxShadow: "rgba(0, 0, 0, 0.12) 0px 8px 32px" }}
        >
          <Link
            href="/"
            className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-full text-sm font-medium boty-transition ${
              isShop
                ? "bg-primary text-primary-foreground boty-shadow"
                : "text-foreground/75 hover:text-foreground"
            }`}
          >
            <Store className="w-4 h-4" />
            <span>Shop</span>
          </Link>
          <Link
            href="/retailer"
            className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-full text-sm font-medium boty-transition ${
              isRetailer
                ? "bg-primary text-primary-foreground boty-shadow"
                : "text-foreground/75 hover:text-foreground"
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Retailer</span>
          </Link>
        </div>
      </div>
    </>
  )
}
