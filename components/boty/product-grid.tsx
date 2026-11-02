"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, useReducedMotion } from "framer-motion"
import { ShoppingBag, Sparkles, Eye } from "lucide-react"
import { useCart } from "./cart-context"
import { useSkinScan, DemoDataBadge } from "./skin-scan-context"
import { MatchScoreRing } from "./match-score-ring"
import { getRankedProducts, type ProductCategory } from "@/src/services/youcam"

const categories: { value: ProductCategory; label: string }[] = [
  { value: "all", label: "All Ranked" },
  { value: "makeup", label: "Shade Makeup" },
  { value: "serum", label: "Serums" },
  { value: "cream", label: "Creams" },
  { value: "oil", label: "Oils" },
]

export function ProductGrid() {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>("all")
  const { addItem } = useCart()
  const { skinResult, toneResult, isGiftMode, giftRecipientName } = useSkinScan()
  const shouldReduceMotion = useReducedMotion()

  const rankedProducts = useMemo(
    () => getRankedProducts(skinResult, toneResult),
    [skinResult, toneResult]
  )

  const filteredProducts = useMemo(() => {
    const list =
      selectedCategory === "all"
        ? rankedProducts
        : rankedProducts.filter((product) => product.category === selectedCategory)
    return list
  }, [rankedProducts, selectedCategory])

  return (
    <section id="matched-products" className="py-24 bg-card">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="text-sm tracking-[0.3em] uppercase text-primary block">
              {isGiftMode
                ? `Gift Vault Calibrated for ${giftRecipientName || "Recipient"}`
                : "AI-Ranked Formulations"}
            </span>
            <DemoDataBadge />
          </div>
          <h2 className="font-serif leading-tight text-foreground mb-4 text-balance text-5xl md:text-7xl">
            {isGiftMode ? "Gift-Ready Shade Matches" : "Ranked for Your Skin"}
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            {isGiftMode
              ? `Every formula below is ranked by match score for ${toneResult?.shadeCode || "320W"} ${toneResult?.skinTone || "Golden Honey"} and includes a free exchange pass.`
              : `Re-ranked by your personal Match Score (0–100) for ${toneResult?.shadeCode || "320W"} ${toneResult?.skinTone || "Golden Honey"} (${toneResult?.undertone || "Warm"} undertone) & ${skinResult?.skinType || "Combination-Radiant"} skin.`}
          </p>
        </div>

        {/* Segmented Control */}
        <div className="flex justify-center mb-12 overflow-x-auto pb-2">
          <div className="inline-flex bg-background rounded-full p-1.5 gap-1 boty-shadow border border-border/50">
            {categories.map((category) => (
              <button
                key={category.value}
                type="button"
                onClick={() => setSelectedCategory(category.value)}
                className={`relative z-10 px-5 py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 whitespace-nowrap active:scale-95 cursor-pointer ${
                  selectedCategory === category.value
                    ? "bg-primary text-primary-foreground boty-shadow"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product, index) => (
            <motion.div
              key={`${selectedCategory}-${product.id}`}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: Math.min(index * 0.06, 0.4) }}
              whileHover={shouldReduceMotion ? undefined : { y: -6 }}
              className="h-full"
            >
              <Link href={`/product/${product.id}`} className="group block h-full">
                <div className="bg-background rounded-3xl overflow-hidden boty-shadow boty-transition h-full flex flex-col justify-between border border-border/50">
                  <div>
                    {/* Image */}
                    <div className="relative aspect-square bg-muted overflow-hidden">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-cover boty-transition group-hover:scale-105"
                      />

                      {/* Left Badge */}
                      <div className="absolute top-4 left-4 flex flex-col gap-1.5 items-start">
                        {product.badge && (
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium tracking-wide ${
                              product.badge === "Sale"
                                ? "bg-destructive/15 text-destructive"
                                : product.badge === "Shade Match" || product.badge === "New Shade"
                                ? "bg-primary text-primary-foreground"
                                : "bg-background/90 backdrop-blur-sm text-foreground"
                            }`}
                          >
                            {product.badge}
                          </span>
                        )}
                        {product.isMakeupShade && product.shadeHex && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-background/95 backdrop-blur-sm text-foreground border border-border/70">
                            <span
                              className="w-3 h-3 rounded-full border border-black/20"
                              style={{ backgroundColor: product.shadeHex }}
                            />
                            {product.shadeCode}
                          </span>
                        )}
                      </div>

                      {/* Top Right: Animated Match Score Ring (0-100) */}
                      <div className="absolute top-3 right-3">
                        <MatchScoreRing score={product.matchScore} size={54} strokeWidth={4.5} />
                      </div>

                      {/* Bottom Right: Quick add button */}
                      <button
                        type="button"
                        className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-background/95 backdrop-blur-sm flex items-center justify-center opacity-95 group-hover:scale-105 active:scale-90 cursor-pointer boty-transition boty-shadow border border-border/60"
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

                      {/* Bottom Left: Try-On Pill */}
                      <span className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-background/90 backdrop-blur-sm text-[11px] font-medium text-foreground boty-shadow">
                        <Eye className="w-3.5 h-3.5 text-primary" />
                        Try-On Preview
                      </span>
                    </div>

                    {/* Info */}
                    <div className="p-5 pb-3">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h3 className="font-serif text-lg text-foreground leading-snug">
                          {product.name}
                        </h3>
                      </div>
                      <p className="text-xs text-muted-foreground mb-3">{product.description}</p>

                      {/* One-line reason per product */}
                      <div className="p-3 rounded-2xl bg-card/85 border border-border/60 mb-3">
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-primary font-semibold">
                            <Sparkles className="w-3 h-3" />
                            Why it matches
                          </span>
                          <DemoDataBadge className="scale-90 origin-right" />
                        </div>
                        <p className="text-xs text-foreground/90 leading-snug line-clamp-2">
                          {product.matchReason}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Price Footer */}
                  <div className="px-5 pb-5 pt-1 flex items-center justify-between border-t border-border/40 mt-auto">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground text-base">${product.price}</span>
                      {product.originalPrice && (
                        <span className="text-xs text-muted-foreground line-through">
                          ${product.originalPrice}
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-medium text-primary group-hover:underline">
                      Try On & Details →
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link
            href="/shop"
            className="inline-flex items-center justify-center gap-2 bg-transparent border border-foreground/20 text-foreground px-8 py-4 rounded-full text-sm tracking-wide boty-transition hover:bg-foreground/5 active:scale-95 cursor-pointer"
          >
            View All Ranked Products ({rankedProducts.length})
          </Link>
        </div>
      </div>
    </section>
  )
}
