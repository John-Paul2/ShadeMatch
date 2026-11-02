"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, useReducedMotion } from "framer-motion"
import { ShoppingBag, SlidersHorizontal, X, Sparkles, Eye } from "lucide-react"
import { Header } from "@/components/boty/header"
import { Footer } from "@/components/boty/footer"
import { useCart } from "@/components/boty/cart-context"
import { useSkinScan, DemoDataBadge } from "@/components/boty/skin-scan-context"
import { MatchScoreRing } from "@/components/boty/match-score-ring"
import { getRankedProducts, type ProductCategory } from "@/src/services/youcam"

const categories: { value: ProductCategory; label: string }[] = [
  { value: "all", label: "All Ranked" },
  { value: "makeup", label: "Shade Makeup" },
  { value: "serum", label: "Serums" },
  { value: "cream", label: "Creams" },
  { value: "oil", label: "Oils" },
]

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>("all")
  const [showFilters, setShowFilters] = useState(false)
  const { addItem } = useCart()
  const { skinResult, toneResult } = useSkinScan()
  const shouldReduceMotion = useReducedMotion()

  const rankedProducts = useMemo(
    () => getRankedProducts(skinResult, toneResult),
    [skinResult, toneResult]
  )

  const filteredProducts = useMemo(
    () =>
      selectedCategory === "all"
        ? rankedProducts
        : rankedProducts.filter((p) => p.category === selectedCategory),
    [rankedProducts, selectedCategory]
  )

  return (
    <main className="min-h-screen">
      <Header />

      <div className="pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="text-sm tracking-[0.3em] uppercase text-primary block">
                AI-Calibrated Catalog
              </span>
              <DemoDataBadge />
            </div>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground mb-4 text-balance">
              Shop Ranked Matches
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Sorted by Match Score (0–100) for {toneResult?.shadeCode || "320W"}{" "}
              {toneResult?.skinTone || "Golden Honey"} &amp; {skinResult?.skinType || "Combination-Radiant"} skin.
            </p>
          </div>

          {/* Filter Bar */}
          <div className="flex items-center justify-between mb-10 pb-6 border-b border-border/50">
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden inline-flex items-center gap-2 text-sm text-foreground"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </button>

            {/* Desktop Categories */}
            <div className="hidden lg:flex items-center gap-2">
              {categories.map((category) => (
                <button
                  key={category.value}
                  type="button"
                  onClick={() => setSelectedCategory(category.value)}
                  className={`px-4 py-2 rounded-full text-sm capitalize active:scale-95 cursor-pointer boty-transition ${
                    selectedCategory === category.value
                      ? "bg-primary text-primary-foreground"
                      : "bg-card text-foreground/70 hover:text-foreground hover:bg-card/90 boty-shadow"
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>

            <span className="text-sm text-muted-foreground">
              {filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"} ranked
            </span>
          </div>

          {/* Mobile Filters */}
          {showFilters && (
            <div className="lg:hidden fixed inset-0 z-50 bg-background">
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="font-serif text-2xl text-foreground">Filters</h2>
                  <button
                    type="button"
                    onClick={() => setShowFilters(false)}
                    className="p-2 text-foreground/70 hover:text-foreground"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-3">
                  {categories.map((category) => (
                    <button
                      key={category.value}
                      type="button"
                      onClick={() => {
                        setSelectedCategory(category.value)
                        setShowFilters(false)
                      }}
                      className={`w-full px-6 py-4 rounded-2xl text-left capitalize boty-transition ${
                        selectedCategory === category.value
                          ? "bg-primary text-primary-foreground"
                          : "bg-card text-foreground boty-shadow"
                      }`}
                    >
                      {category.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Product Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: Math.min(index * 0.06, 0.4) }}
                whileHover={shouldReduceMotion ? undefined : { y: -6 }}
                className="h-full"
              >
                <Link href={`/product/${product.id}`} className="group block h-full">
                  <div className="bg-card rounded-3xl overflow-hidden boty-shadow boty-transition h-full flex flex-col justify-between border border-border/50">
                    <div>
                      <div className="relative aspect-square bg-muted overflow-hidden">
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          fill
                          className="object-cover boty-transition group-hover:scale-105"
                        />

                        {/* Left Badges */}
                        <div className="absolute top-4 left-4 flex flex-col gap-1.5 items-start">
                          {product.badge && (
                            <span
                              className={`px-3 py-1 rounded-full text-xs tracking-wide ${
                                product.badge === "Sale"
                                  ? "bg-destructive/15 text-destructive"
                                  : product.badge === "Shade Match" || product.badge === "New Shade"
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-background/90 text-foreground"
                              }`}
                            >
                              {product.badge}
                            </span>
                          )}
                          {product.isMakeupShade && product.shadeHex && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-background/95 text-foreground border border-border/70">
                              <span
                                className="w-3 h-3 rounded-full border border-black/20"
                                style={{ backgroundColor: product.shadeHex }}
                              />
                              {product.shadeCode}
                            </span>
                          )}
                        </div>

                        {/* Top Right: Match Score Ring */}
                        <div className="absolute top-3 right-3">
                          <MatchScoreRing score={product.matchScore} size={56} strokeWidth={4.5} />
                        </div>

                        {/* Quick add button */}
                        <button
                          type="button"
                          className="absolute bottom-4 right-4 w-11 h-11 rounded-full bg-background/95 backdrop-blur-sm flex items-center justify-center group-hover:scale-105 active:scale-90 cursor-pointer boty-transition boty-shadow border border-border/60"
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            addItem({
                              id: product.id,
                              name: product.name,
                              description: product.description,
                              price: product.price,
                              image: product.image,
                            })
                          }}
                          aria-label="Add to cart"
                        >
                          <ShoppingBag className="w-4 h-4 text-foreground" />
                        </button>

                        {/* Try-On Indicator */}
                        <span className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-background/90 backdrop-blur-sm text-xs font-medium text-foreground boty-shadow">
                          <Eye className="w-3.5 h-3.5 text-primary" />
                          Virtual Try-On
                        </span>
                      </div>

                      <div className="p-6 pb-3">
                        <h3 className="font-serif text-xl text-foreground mb-1">{product.name}</h3>
                        <p className="text-sm text-muted-foreground mb-3">{product.description}</p>

                        <div className="p-3.5 rounded-2xl bg-background/85 border border-border/60 mb-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-primary font-semibold">
                              <Sparkles className="w-3 h-3" />
                              Match Reason
                            </span>
                            <DemoDataBadge className="scale-90 origin-right" />
                          </div>
                          <p className="text-xs text-foreground/90 leading-relaxed">
                            {product.matchReason}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="px-6 pb-6 pt-2 flex items-center justify-between border-t border-border/40">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-medium text-foreground">${product.price}</span>
                        {product.originalPrice && (
                          <span className="text-sm text-muted-foreground line-through">
                            ${product.originalPrice}
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-medium text-primary group-hover:underline">
                        Before/After Try-On →
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
