"use client"

import React, { useState, useEffect, useRef, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import { motion, useReducedMotion } from "framer-motion"
import {
  ChevronLeft,
  Minus,
  Plus,
  ChevronDown,
  Leaf,
  Heart,
  Award,
  Recycle,
  Star,
  Check,
  Sparkles,
  Upload,
  SlidersHorizontal,
  Info,
  Eye,
  Package,
} from "lucide-react"
import { Header } from "@/components/boty/header"
import { Footer } from "@/components/boty/footer"
import { useCart } from "@/components/boty/cart-context"
import { useSkinScan, DemoDataBadge } from "@/components/boty/skin-scan-context"
import { MatchScoreRing } from "@/components/boty/match-score-ring"
import {
  getRankedProducts,
  tryOn,
  type TryOnResult,
} from "@/src/services/youcam"

const benefits = [
  { icon: Leaf, label: "100% Natural" },
  { icon: Heart, label: "Cruelty-Free" },
  { icon: Recycle, label: "Eco-Friendly" },
  { icon: Award, label: "Shade Guaranteed" },
]

type AccordionSection = "details" | "howToUse" | "ingredients" | "delivery"

export default function ProductPage() {
  const params = useParams()
  const productId = (params?.id as string) || "silk-skin-tint"
  const { addItem } = useCart()
  const { uploadedPhotoUrl, setUploadedPhotoUrl, skinResult, toneResult } = useSkinScan()
  const shouldReduceMotion = useReducedMotion()

  const rankedProducts = useMemo(
    () => getRankedProducts(skinResult, toneResult),
    [skinResult, toneResult]
  )

  const product = useMemo(
    () => rankedProducts.find((p) => p.id === productId) || rankedProducts[0],
    [rankedProducts, productId]
  )

  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || "30ml")
  const [selectedShade, setSelectedShade] = useState(
    product.availableShades?.[2] ||
      product.availableShades?.[0] || {
        code: toneResult?.shadeCode || "320W",
        name: toneResult?.skinTone || "Golden Honey",
        hex: product.shadeHex || toneResult?.hex || "#B67E52",
      }
  )
  const [quantity, setQuantity] = useState(1)
  const [openAccordion, setOpenAccordion] = useState<AccordionSection | null>("details")
  const [isAdded, setIsAdded] = useState(false)

  // Virtual Try-On state
  const [viewMode, setViewMode] = useState<"tryon" | "bottle">("tryon")
  const [sliderPos, setSliderPos] = useState(52) // 0 to 100
  const [tryOnData, setTryOnData] = useState<TryOnResult | null>(null)
  const [isLoadingTryOn, setIsLoadingTryOn] = useState(false)
  const sliderContainerRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [productId])

  useEffect(() => {
    setSelectedSize(product.sizes[0] || "30ml")
    if (product.availableShades && product.availableShades.length > 0) {
      const matched =
        product.availableShades.find((s) => s.code === toneResult?.shadeCode) ||
        product.availableShades[Math.min(2, product.availableShades.length - 1)]
      setSelectedShade(matched)
    }
  }, [product, toneResult])

  // Fetch Virtual Try-On preview from src/services/youcam.ts
  useEffect(() => {
    let active = true
    setIsLoadingTryOn(true)
    tryOn(uploadedPhotoUrl, product.id, selectedShade?.hex || product.shadeHex).then((res) => {
      if (active) {
        setTryOnData(res)
        setIsLoadingTryOn(false)
      }
    })
    return () => {
      active = false
    }
  }, [uploadedPhotoUrl, product.id, product.shadeHex, selectedShade])

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setUploadedPhotoUrl(url)
    setViewMode("tryon")
  }

  const updateSliderFromClientX = (clientX: number) => {
    if (!sliderContainerRef.current) return
    const rect = sliderContainerRef.current.getBoundingClientRect()
    const pct = ((clientX - rect.left) / rect.width) * 100
    setSliderPos(Math.max(4, Math.min(96, pct)))
  }

  const toggleAccordion = (section: AccordionSection) => {
    setOpenAccordion(openAccordion === section ? null : section)
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: product.isMakeupShade
          ? `${product.name} (${selectedShade.code} ${selectedShade.name})`
          : `${product.name} (${selectedSize})`,
        description: product.description,
        price: product.price,
        image: product.image,
      })
    }
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000)
  }

  const accordionItems: { key: AccordionSection; title: string; content: string }[] = [
    { key: "details", title: "Details & Formulation", content: product.details },
    { key: "howToUse", title: "How to Use", content: product.howToUse },
    { key: "ingredients", title: "Full Ingredients", content: product.ingredients },
    { key: "delivery", title: "Delivery & Shade Guarantee", content: product.delivery },
  ]

  return (
    <main className="min-h-screen">
      <Header />

      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="pt-28 pb-24"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Back Link */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <Link
              href="/#matched-products"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground boty-transition"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Ranked Catalog
            </Link>
            <DemoDataBadge />
          </div>

          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Left Column (6 cols): Product Detail Try-On Preview (Before/After Slider) */}
            <div className="lg:col-span-6 space-y-4">
              {/* Switcher between Virtual Try-On Preview & Studio Bottle View */}
              <div className="flex flex-wrap items-center justify-between gap-2 bg-card p-2 rounded-full border border-border/60 boty-shadow">
                <div className="inline-flex rounded-full bg-background p-1 gap-1">
                  <button
                    type="button"
                    onClick={() => setViewMode("tryon")}
                    className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium boty-transition ${
                      viewMode === "tryon"
                        ? "bg-primary text-primary-foreground boty-shadow"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Virtual Try-On Preview
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("bottle")}
                    className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium boty-transition ${
                      viewMode === "bottle"
                        ? "bg-primary text-primary-foreground boty-shadow"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Package className="w-3.5 h-3.5" />
                    Product Bottle
                  </button>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-background text-foreground text-xs font-medium border border-border hover:bg-secondary/50 boty-transition"
                >
                  <Upload className="w-3.5 h-3.5 text-primary" />
                  Change Photo
                </button>
              </div>

              {viewMode === "tryon" ? (
                <div className="bg-card rounded-3xl p-4 sm:p-5 boty-shadow border border-border/60">
                  {/* Interactive Before/After Slider Viewport */}
                  <div
                    ref={sliderContainerRef}
                    onPointerDown={(e) => updateSliderFromClientX(e.clientX)}
                    onPointerMove={(e) => {
                      if (e.buttons === 1) {
                        updateSliderFromClientX(e.clientX)
                      }
                    }}
                    className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden bg-muted select-none cursor-ew-resize touch-none border border-border/70"
                  >
                    {/* AFTER LAYER (Full width underneath, with calibrated shade/glow filter & pigment overlay) */}
                    <div className="absolute inset-0">
                      <Image
                        src={tryOnData?.afterImageUrl || uploadedPhotoUrl || "/images/bento-skin-model.jpg"}
                        alt={`After applying ${product.name}`}
                        fill
                        className="object-cover"
                        style={{
                          filter: product.isMakeupShade
                            ? "brightness(1.05) contrast(1.03) saturate(1.10)"
                            : "brightness(1.08) contrast(1.02) saturate(1.06)",
                        }}
                        priority
                      />
                      {/* Calibrated Subsurface Shade / Glow Overlay */}
                      <div
                        className="absolute inset-0 pointer-events-none mix-blend-soft-light transition-colors duration-300"
                        style={{
                          backgroundColor:
                            selectedShade?.hex || tryOnData?.overlayHex || "#B67E52",
                          opacity: product.isMakeupShade ? 0.42 : 0.22,
                        }}
                      />
                      {/* Subtle radiant finish highlight */}
                      <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          background:
                            "radial-gradient(circle at 50% 38%, rgba(255,248,238,0.22) 0%, rgba(182,126,82,0.10) 55%, transparent 85%)",
                        }}
                      />
                    </div>

                    {/* BEFORE LAYER (Clipped from left to sliderPos%) */}
                    <div
                      className="absolute inset-0 overflow-hidden"
                      style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
                    >
                      <Image
                        src={tryOnData?.beforeImageUrl || uploadedPhotoUrl || "/images/bento-skin-model.jpg"}
                        alt="Before try-on"
                        fill
                        className="object-cover"
                        priority
                      />
                    </div>

                    {/* Top Labels: BEFORE / AFTER + Demo Data Badge */}
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none z-20">
                      <span className="px-3 py-1 rounded-full bg-background/90 backdrop-blur-sm text-foreground text-xs font-medium border border-border/60 boty-shadow">
                        Before (Original Photo)
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium boty-shadow">
                        <Sparkles className="w-3 h-3" />
                        After ({product.isMakeupShade ? selectedShade.code : "Botanical Glow"})
                      </span>
                    </div>

                    {/* Vertical Divider Line + Draggable Handle */}
                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-background shadow-[0_0_12px_rgba(0,0,0,0.35)] z-20 pointer-events-none"
                      style={{ left: `${sliderPos}%` }}
                    >
                      <motion.div
                        whileHover={shouldReduceMotion ? undefined : { scale: 1.08 }}
                        className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-background text-foreground border-2 border-primary boty-shadow flex items-center justify-center"
                      >
                        <SlidersHorizontal className="w-4 h-4 text-primary" />
                      </motion.div>
                    </div>

                    {/* Bottom Required Disclaimer Label on Preview */}
                    <div className="absolute bottom-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-2 bg-background/95 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-border/80 boty-shadow pointer-events-none">
                      <div className="flex items-center gap-2">
                        <Info className="w-4 h-4 text-primary flex-shrink-0" />
                        <span className="text-xs font-semibold text-foreground">
                          Visual preview, not a guarantee.
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {isLoadingTryOn && (
                          <span className="text-[11px] text-muted-foreground">Calibrating...</span>
                        )}
                        <DemoDataBadge />
                      </div>
                    </div>
                  </div>

                  {/* Accessible Range Slider Control */}
                  <div className="mt-4 px-2">
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
                      <span>Drag slider to compare Before &amp; After</span>
                      <span className="font-medium text-foreground">
                        {Math.round(sliderPos)}% After Preview
                      </span>
                    </div>
                    <input
                      type="range"
                      min={4}
                      max={96}
                      value={sliderPos}
                      onChange={(e) => setSliderPos(Number(e.target.value))}
                      aria-label="Before and after try-on comparison slider"
                      className="w-full accent-[#4F5B3A] cursor-pointer"
                    />
                  </div>
                </div>
              ) : (
                <div className="relative aspect-square rounded-3xl overflow-hidden bg-card boty-shadow border border-border/60">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              )}
            </div>

            {/* Right Column (6 cols): Product Info + Match Score Ring + Shade/Size Selector */}
            <div className="lg:col-span-6 flex flex-col">
              {/* Header + Match Score Card */}
              <div className="mb-6">
                <div className="flex items-center justify-between gap-4 mb-3">
                  <span className="text-sm tracking-[0.3em] uppercase text-primary block">
                    ShadeMatch Essentials
                  </span>
                  <DemoDataBadge />
                </div>

                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-2">
                      {product.name}
                    </h1>
                    <p className="text-lg text-muted-foreground italic">{product.tagline}</p>
                  </div>
                  <MatchScoreRing score={product.matchScore} size={68} strokeWidth={5} />
                </div>

                {/* Personal AI Match Reason Banner */}
                <div className="p-4 rounded-2xl bg-card border border-border/70 boty-shadow mb-5">
                  <div className="flex items-center justify-between mb-1">
                    <span className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-primary font-semibold">
                      <Sparkles className="w-3.5 h-3.5" />
                      Why It Matches Your Scan ({product.matchScore}/100)
                    </span>
                    <DemoDataBadge />
                  </div>
                  <p className="text-sm text-foreground/90 leading-relaxed">{product.matchReason}</p>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">(128 verified shade reviews)</span>
                </div>

                <p className="text-foreground/80 leading-relaxed">{product.description}</p>
              </div>

              {/* Price */}
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl font-medium text-foreground">${product.price}</span>
                {product.originalPrice && (
                  <span className="text-xl text-muted-foreground line-through">
                    ${product.originalPrice}
                  </span>
                )}
              </div>

              {/* Shade Swatch Selector (for Makeup-Shade products) */}
              {product.isMakeupShade && product.availableShades && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2.5">
                    <label className="text-sm font-medium text-foreground">
                      Calibrated Shade:{" "}
                      <span className="text-primary font-semibold">
                        {selectedShade.code} — {selectedShade.name}
                      </span>
                    </label>
                    <span className="text-xs text-primary font-medium">AI Recommended</span>
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    {product.availableShades.map((shade) => {
                      const active = selectedShade.code === shade.code
                      return (
                        <button
                          key={shade.code}
                          type="button"
                          onClick={() => {
                            setSelectedShade(shade)
                            setViewMode("tryon")
                          }}
                          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-medium border active:scale-95 cursor-pointer boty-transition ${
                            active
                              ? "bg-primary text-primary-foreground border-primary boty-shadow"
                              : "bg-card text-foreground border-border hover:border-primary/40 hover:bg-secondary/40"
                          }`}
                        >
                          <span
                            className="w-4 h-4 rounded-full border border-white/60"
                            style={{ backgroundColor: shade.hex }}
                          />
                          <span>
                            {shade.code} {shade.name}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Size Selector */}
              <div className="mb-6">
                <label className="text-sm font-medium text-foreground mb-3 block">Size</label>
                <div className="flex gap-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`px-6 py-3 rounded-full text-sm active:scale-95 cursor-pointer boty-transition boty-shadow ${
                        selectedSize === size
                          ? "bg-primary text-primary-foreground"
                          : "bg-card text-foreground hover:bg-card/80"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="mb-8">
                <label className="text-sm font-medium text-foreground mb-3 block">Quantity</label>
                <div className="inline-flex items-center gap-4 bg-card rounded-full px-2 py-2 boty-shadow">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-full bg-background flex items-center justify-center text-foreground/60 hover:text-foreground active:scale-90 cursor-pointer boty-transition"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center font-medium text-foreground">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded-full bg-background flex items-center justify-center text-foreground/60 hover:text-foreground active:scale-90 cursor-pointer boty-transition"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Add to Cart Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className={`flex-1 inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-sm font-medium tracking-wide active:scale-95 cursor-pointer boty-transition boty-shadow ${
                    isAdded
                      ? "bg-primary/80 text-primary-foreground"
                      : "bg-primary text-primary-foreground hover:bg-primary/90"
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4" />
                      Added to Cart
                    </>
                  ) : (
                    "Add to Cart"
                  )}
                </button>
                <Link
                  href="/#skin-scanner"
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-transparent border border-foreground/20 text-foreground px-8 py-4 rounded-full text-sm tracking-wide active:scale-95 cursor-pointer boty-transition hover:bg-foreground/5 text-center"
                >
                  Re-Calibrate My Skin
                </Link>
              </div>

              {/* Benefits */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
                {benefits.map((benefit) => (
                  <div
                    key={benefit.label}
                    className="flex flex-col items-center gap-2 p-4 bg-card/60 rounded-2xl border border-border/50"
                  >
                    <benefit.icon className="w-5 h-5 text-primary" />
                    <span className="text-xs text-muted-foreground text-center">
                      {benefit.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Accordion */}
              <div className="border-t border-border/50">
                {accordionItems.map((item) => (
                  <div key={item.key} className="border-b border-border/50">
                    <button
                      type="button"
                      onClick={() => toggleAccordion(item.key)}
                      className="w-full flex items-center justify-between py-5 text-left"
                    >
                      <span className="font-medium text-foreground">{item.title}</span>
                      <ChevronDown
                        className={`w-5 h-5 text-muted-foreground boty-transition ${
                          openAccordion === item.key ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    <div
                      className={`overflow-hidden boty-transition ${
                        openAccordion === item.key ? "max-h-96 pb-5" : "max-h-0"
                      }`}
                    >
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {item.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <Footer />
    </main>
  )
}
