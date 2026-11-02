"use client"

import React, { useState, useRef } from "react"
import Image from "next/image"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import {
  Camera,
  Upload,
  Sparkles,
  Sun,
  ScanFace,
  CheckCircle2,
  Gift,
  Share2,
  Check,
  RefreshCw,
  Droplets,
  ShieldCheck,
  Palette,
  Layers,
  ShoppingBag,
} from "lucide-react"
import { SKIN_TONE_SPECTRUM } from "@/src/services/youcam"
import { useSkinScan, DemoDataBadge } from "./skin-scan-context"
import { MatchScoreRing, CountUpNumber } from "./match-score-ring"
import { useCart } from "./cart-context"

const SCAN_STATUS_MESSAGES = [
  "Calibrating ambient daylight & spectrophotometric white balance...",
  "Mapping 128-point facial mesh & surface melanin index...",
  "Detecting subsurface undertone & epidermal moisture barrier...",
  "Analyzing top 3 skin concerns & ranking matched formulations...",
]

const SAMPLE_PORTRAITS = [
  {
    id: "portrait-1",
    label: "Golden Honey (320W)",
    url: "/images/bento-skin-model.jpg",
    swatchIndex: 6,
  },
  {
    id: "portrait-2",
    label: "Warm Linen (150W)",
    url: "/images/hero-model.jpg",
    swatchIndex: 2,
  },
  {
    id: "portrait-3",
    label: "Rich Amber (410W)",
    url: "/images/skincare-ritual.jpg",
    swatchIndex: 8,
  },
]

export function SkinScannerFlow() {
  const {
    uploadedPhotoUrl,
    setUploadedPhotoUrl,
    selectedSwatch,
    setSelectedSwatch,
    hasCompletedScan,
    skinResult,
    toneResult,
    isGiftMode,
    setIsGiftMode,
    giftRecipientName,
    setGiftRecipientName,
    giftMessage,
    setGiftMessage,
    giftSenderName,
    setGiftSenderName,
    runScanAnalysis,
  } = useSkinScan()

  const { addItem } = useCart()
  const shouldReduceMotion = useReducedMotion()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isScanningLocal, setIsScanningLocal] = useState(false)
  const [scanStepIndex, setScanStepIndex] = useState(0)
  const [scanProgress, setScanProgress] = useState(0)
  const [showResultsTab, setShowResultsTab] = useState(true)
  const [copiedGiftNote, setCopiedGiftNote] = useState(false)
  const [cameraNotice, setCameraNotice] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setSelectedFile(file)
    setCameraNotice(null)
    const objectUrl = URL.createObjectURL(file)
    setUploadedPhotoUrl(objectUrl)
  }

  const handleSampleSelect = (sample: (typeof SAMPLE_PORTRAITS)[number]) => {
    setUploadedPhotoUrl(sample.url)
    setSelectedFile(null)
    setCameraNotice(null)
    const swatch = SKIN_TONE_SPECTRUM[sample.swatchIndex]
    if (swatch) {
      setSelectedSwatch(swatch)
    }
  }

  const handleStartScan = async () => {
    if (isScanningLocal) return
    setIsScanningLocal(true)
    setScanStepIndex(0)
    setScanProgress(8)

    // Rotate status text & progress over ~3 seconds (3000ms)
    const stepTimer1 = setTimeout(() => {
      setScanStepIndex(1)
      setScanProgress(36)
    }, 750)
    const stepTimer2 = setTimeout(() => {
      setScanStepIndex(2)
      setScanProgress(68)
    }, 1500)
    const stepTimer3 = setTimeout(() => {
      setScanStepIndex(3)
      setScanProgress(92)
    }, 2250)

    const analysisPromise = runScanAnalysis(selectedFile || uploadedPhotoUrl, selectedSwatch)
    const threeSecWait = new Promise((resolve) => setTimeout(resolve, 3000))

    await Promise.all([analysisPromise, threeSecWait])

    clearTimeout(stepTimer1)
    clearTimeout(stepTimer2)
    clearTimeout(stepTimer3)
    setScanProgress(100)
    setIsScanningLocal(false)
    setShowResultsTab(true)

    const resultsEl = document.getElementById("scan-results")
    if (resultsEl) {
      resultsEl.scrollIntoView({ behavior: shouldReduceMotion ? "auto" : "smooth", block: "start" })
    }
  }

  const handleShareGiftNote = () => {
    const textToShare = `ShadeMatch Atelier Gift Note for ${giftRecipientName}: "${giftMessage}" — ${giftSenderName} (Calibrated Shade: ${toneResult?.shadeCode || "320W"} ${toneResult?.skinTone || "Golden Honey"})`
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(textToShare).catch(() => {})
    }
    setCopiedGiftNote(true)
    setTimeout(() => setCopiedGiftNote(false), 2500)
  }

  return (
    <section id="skin-scanner" className="py-24 bg-background border-b border-border/50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="text-sm tracking-[0.3em] uppercase text-primary block">
              Biometric Skin & Tone AI
            </span>
            <DemoDataBadge />
          </div>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground mb-4 text-balance">
            {isGiftMode
              ? `Calibrate a Shade Gift for ${giftRecipientName || "Someone Special"}`
              : "Your Skin Identity, Decoded"}
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground">
            {isGiftMode
              ? "Upload a candid photo or choose their closest tone below. We calibrate gift-ready shades and include a personal gift note."
              : "Upload a selfie or choose a sample portrait. Our AI maps your skin tone, undertone, skin type, and top 3 concerns in 3 seconds."}
          </p>
        </div>

        {/* SCANNER + LIVE DIAGNOSTIC GRID */}
        <div className="grid lg:grid-cols-12 gap-10 items-start">
          {/* Left Column (5 cols): Scan Screen with Face Guide, Lighting Hint & 3s Sweep */}
          <div className="lg:col-span-5 bg-card rounded-3xl p-6 sm:p-8 boty-shadow border border-border/60">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ScanFace className="w-5 h-5 text-primary" />
                <h3 className="font-serif text-2xl text-foreground">
                  {isGiftMode ? "Candid Photo Scanner" : "Skin & Shade Scanner"}
                </h3>
              </div>
              <DemoDataBadge />
            </div>

            {/* Lighting Hint Banner */}
            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-background/90 border border-border/70 mb-5">
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                <Sun className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                  Lighting Hint • Natural Daylight Ideal
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Face a window or even soft lighting without glasses or heavy shadows. Center your face inside the oval guide below.
                </p>
              </div>
            </div>

            {/* Upload / Camera Viewport with Face Guide & 3-Second Scanning State */}
            <div className="relative aspect-[4/5] w-full rounded-3xl overflow-hidden bg-muted border-2 border-dashed border-primary/30 mb-5 group">
              <Image
                src={uploadedPhotoUrl || "/images/bento-skin-model.jpg"}
                alt="Face scan preview"
                fill
                className="object-cover"
              />

              {/* Subtle vignette for face guide contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/20 pointer-events-none" />

              {/* Face Guide Overlay (Oval + Biometric Alignment Crosshairs) */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none p-6">
                <div className="relative w-[72%] h-[76%] rounded-[50%] border-2 border-dashed border-white/85 shadow-[0_0_0_9999px_rgba(28,25,23,0.22)] flex items-center justify-center">
                  {/* Corner registration brackets */}
                  <span className="absolute -top-2 -left-2 w-5 h-5 border-t-2 border-l-2 border-white rounded-tl-md" />
                  <span className="absolute -top-2 -right-2 w-5 h-5 border-t-2 border-r-2 border-white rounded-tr-md" />
                  <span className="absolute -bottom-2 -left-2 w-5 h-5 border-b-2 border-l-2 border-white rounded-bl-md" />
                  <span className="absolute -bottom-2 -right-2 w-5 h-5 border-b-2 border-r-2 border-white rounded-br-md" />

                  {/* Cheek & Forehead telemetry nodes */}
                  <div className="w-full px-6 flex justify-between items-center opacity-80">
                    <span className="w-2.5 h-2.5 rounded-full bg-white ring-4 ring-white/30" />
                    <span className="w-8 border-t border-white/50" />
                    <span className="w-2.5 h-2.5 rounded-full bg-white ring-4 ring-white/30" />
                  </div>
                </div>

                <span className="mt-3 px-3 py-1 rounded-full bg-background/90 backdrop-blur-sm text-[11px] font-medium text-foreground shadow-sm">
                  {isScanningLocal
                    ? "Biometric Mesh Active — Hold Steady"
                    : "Align face within guide • 98% Lux Optimal"}
                </span>
              </div>

              {/* Animated Scanning State (Sweeping Scan Line + Rotating Status Text for 3s) */}
              <AnimatePresence>
                {isScanningLocal && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-20 bg-black/35 backdrop-blur-[2px] flex flex-col justify-between p-5"
                  >
                    {/* Sweeping Scan Line */}
                    {!shouldReduceMotion ? (
                      <motion.div
                        initial={{ top: "6%" }}
                        animate={{ top: ["6%", "88%", "6%"] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute left-4 right-4 h-1 rounded-full bg-gradient-to-r from-transparent via-[#F7F4EF] to-transparent shadow-[0_0_20px_4px_rgba(79,91,58,0.9)]"
                      />
                    ) : (
                      <div className="absolute top-1/2 left-4 right-4 h-1 rounded-full bg-background" />
                    )}

                    {/* Top badge */}
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-background/95 text-foreground text-xs font-medium">
                        <RefreshCw className="w-3.5 h-3.5 text-primary animate-spin" />
                        YouCam AI Scanning...
                      </span>
                      <span className="px-2.5 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                        {scanProgress}%
                      </span>
                    </div>

                    {/* Rotating Status Text Card */}
                    <div className="bg-background/95 backdrop-blur-md rounded-2xl p-4 border border-border boty-shadow">
                      <p className="text-[11px] uppercase tracking-wider text-primary font-semibold mb-1">
                        Step {scanStepIndex + 1} of 4 • Spectral Telemetry
                      </p>
                      <AnimatePresence mode="wait">
                        <motion.p
                          key={scanStepIndex}
                          initial={shouldReduceMotion ? false : { opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={shouldReduceMotion ? undefined : { opacity: 0, y: -6 }}
                          transition={{ duration: 0.2 }}
                          className="text-sm font-medium text-foreground"
                        >
                          {SCAN_STATUS_MESSAGES[scanStepIndex]}
                        </motion.p>
                      </AnimatePresence>
                      <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden mt-3">
                        <motion.div
                          className="h-full bg-primary rounded-full"
                          animate={{ width: `${scanProgress}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Upload / Camera Controls */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            <div className="grid grid-cols-2 gap-3 mb-4">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isScanningLocal}
                className="inline-flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-background border border-border text-foreground text-xs sm:text-sm font-medium hover:bg-background/80 boty-transition boty-shadow disabled:opacity-50"
              >
                <Upload className="w-4 h-4 text-primary" />
                Upload Photo
              </button>
              <button
                type="button"
                onClick={() => {
                  setCameraNotice(
                    "Camera preview simulated with studio daylight portrait. You can also upload any photo from your device."
                  )
                  fileInputRef.current?.click()
                }}
                disabled={isScanningLocal}
                className="inline-flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-background border border-border text-foreground text-xs sm:text-sm font-medium hover:bg-background/80 boty-transition boty-shadow disabled:opacity-50"
              >
                <Camera className="w-4 h-4 text-primary" />
                Use Camera
              </button>
            </div>

            {cameraNotice && (
              <p className="text-xs text-muted-foreground bg-background/80 rounded-xl p-2.5 mb-4 border border-border/60">
                {cameraNotice}
              </p>
            )}

            {/* Quick Sample Portraits */}
            <div className="mb-5">
              <span className="text-xs text-muted-foreground block mb-2">
                Or test with a calibrated studio portrait:
              </span>
              <div className="grid grid-cols-3 gap-2">
                {SAMPLE_PORTRAITS.map((sample) => {
                  const active = uploadedPhotoUrl === sample.url
                  return (
                    <button
                      key={sample.id}
                      type="button"
                      onClick={() => handleSampleSelect(sample)}
                      disabled={isScanningLocal}
                      className={`px-2.5 py-2 rounded-xl text-left border text-xs boty-transition ${
                        active
                          ? "bg-primary text-primary-foreground border-primary font-medium"
                          : "bg-background/80 text-foreground border-border/60 hover:bg-background"
                      }`}
                    >
                      <span className="block truncate">{sample.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Submit / Scan Button */}
            <button
              type="button"
              onClick={handleStartScan}
              disabled={isScanningLocal}
              className="w-full inline-flex items-center justify-center gap-2.5 bg-primary text-primary-foreground py-4 px-6 rounded-full text-sm font-medium tracking-wide boty-transition hover:bg-primary/90 boty-shadow disabled:opacity-60"
            >
              {isScanningLocal ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Scanning Skin & Tone (3s)...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  {hasCompletedScan ? "Re-Scan Photo (3s)" : "Scan My Skin Now (3s)"}
                </>
              )}
            </button>
          </div>

          {/* Right Column (7 cols): Results Cards + "Shopping for someone else?" Gift Toggle */}
          <div id="scan-results" className="lg:col-span-7 space-y-6">
            {/* Top Bar: Results Header + "Shopping for someone else?" Toggle */}
            <div className="bg-card rounded-3xl p-6 sm:p-7 boty-shadow border border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  <span className="text-xs uppercase tracking-[0.2em] text-primary font-semibold">
                    {isGiftMode ? "Gift Concierge Mode Active" : "Diagnostic Profile Complete"}
                  </span>
                  <DemoDataBadge />
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl text-foreground">
                  {isGiftMode
                    ? `Gift Profile for ${giftRecipientName || "Your Recipient"}`
                    : "Your Personal Skin & Shade Results"}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {isGiftMode
                    ? "Every gift includes a complimentary digital shade-exchange pass so they can swap shades effortlessly."
                    : "Calibrated across 12 Fitzpatrick depth bands and 3 epidermal hydration zones."}
                </p>
              </div>

              {/* Toggle: "Shopping for someone else?" */}
              <div className="flex items-center gap-3 bg-background px-4 py-3 rounded-2xl border border-border/80 boty-shadow self-start sm:self-center">
                <Gift className={`w-4 h-4 ${isGiftMode ? "text-primary" : "text-muted-foreground"}`} />
                <label
                  htmlFor="gift-mode-toggle"
                  className="text-xs sm:text-sm font-medium text-foreground cursor-pointer select-none whitespace-nowrap"
                >
                  Shopping for someone else?
                </label>
                <button
                  id="gift-mode-toggle"
                  type="button"
                  role="switch"
                  aria-checked={isGiftMode}
                  onClick={() => setIsGiftMode(!isGiftMode)}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    isGiftMode ? "bg-primary" : "bg-secondary"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-background shadow ring-0 transition duration-200 ease-in-out ${
                      isGiftMode ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* 3 Primary Diagnostic Cards: Skin Tone, Undertone, Skin Type */}
            {toneResult && skinResult && (
              <div className="grid sm:grid-cols-3 gap-5">
                {/* 1. SKIN TONE CARD */}
                <motion.div
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.05 }}
                  whileHover={shouldReduceMotion ? undefined : { y: -4 }}
                  className="bg-card rounded-3xl p-6 boty-shadow border border-border/60 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                        <Palette className="w-3.5 h-3.5 text-primary" />
                        Skin Tone
                      </span>
                      <DemoDataBadge />
                    </div>

                    <div className="flex items-center gap-3.5 mb-4">
                      <div
                        className="w-12 h-12 rounded-2xl border-2 border-white boty-shadow flex-shrink-0"
                        style={{ backgroundColor: toneResult.hex }}
                      />
                      <div>
                        <p className="font-serif text-xl font-semibold text-foreground leading-tight">
                          {toneResult.skinTone}
                        </p>
                        <p className="text-xs text-primary font-medium mt-0.5">
                          Shade {toneResult.shadeCode} • {toneResult.fitzpatrick}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-border/50">
                    <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                      <span>Melanin Index</span>
                      <span className="font-semibold text-foreground">
                        <CountUpNumber value={toneResult.melaninIndex} decimals={1} /> MI
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-2">
                      {toneResult.adjacentShades.map((adj) => (
                        <button
                          key={adj.id}
                          type="button"
                          onClick={() => {
                            setSelectedSwatch(adj)
                            runScanAnalysis(adj.code, adj)
                          }}
                          className={`flex-1 py-1 px-2 rounded-lg text-[10px] font-medium border flex items-center justify-center gap-1 ${
                            adj.code === toneResult.shadeCode
                              ? "bg-background border-primary text-foreground"
                              : "bg-background/50 border-border/60 text-muted-foreground"
                          }`}
                        >
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: adj.hex }}
                          />
                          {adj.code}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* 2. UNDERTONE CARD */}
                <motion.div
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.12 }}
                  whileHover={shouldReduceMotion ? undefined : { y: -4 }}
                  className="bg-card rounded-3xl p-6 boty-shadow border border-border/60 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                        <Sun className="w-3.5 h-3.5 text-primary" />
                        Undertone
                      </span>
                      <DemoDataBadge />
                    </div>

                    <p className="font-serif text-2xl font-semibold text-foreground mb-1">
                      {toneResult.undertone} Undertone
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                      {toneResult.undertoneSubtitle}
                    </p>
                  </div>

                  <div className="space-y-2 pt-3 border-t border-border/50 text-xs">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-muted-foreground">Warm Gold</span>
                        <span className="font-medium text-foreground">{toneResult.undertoneBreakdown.warm}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${toneResult.undertoneBreakdown.warm}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-muted-foreground">Neutral Balance</span>
                        <span className="font-medium text-foreground">{toneResult.undertoneBreakdown.neutral}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                        <div
                          className="h-full bg-accent rounded-full"
                          style={{ width: `${toneResult.undertoneBreakdown.neutral}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* 3. SKIN TYPE CARD */}
                <motion.div
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.19 }}
                  whileHover={shouldReduceMotion ? undefined : { y: -4 }}
                  className="bg-card rounded-3xl p-6 boty-shadow border border-border/60 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                        <Droplets className="w-3.5 h-3.5 text-primary" />
                        Skin Type
                      </span>
                      <DemoDataBadge />
                    </div>

                    <p className="font-serif text-2xl font-semibold text-foreground mb-1">
                      {skinResult.skinType}
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                      {skinResult.skinTypeSummary}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-3 border-t border-border/50">
                    <div className="bg-background rounded-2xl p-2.5 text-center">
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground block">
                        Hydration
                      </span>
                      <span className="font-serif text-lg font-bold text-foreground">
                        <CountUpNumber value={skinResult.hydrationLevel} suffix="%" />
                      </span>
                    </div>
                    <div className="bg-background rounded-2xl p-2.5 text-center">
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground block">
                        Barrier
                      </span>
                      <span className="font-serif text-lg font-bold text-primary">
                        <CountUpNumber value={skinResult.barrierScore} suffix="/100" />
                      </span>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}

            {/* TOP 3 SKIN CONCERNS AS CLEAN CARDS */}
            {skinResult && (
              <div className="bg-card rounded-3xl p-6 sm:p-7 boty-shadow border border-border/60">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-5">
                  <div>
                    <span className="text-xs uppercase tracking-[0.2em] text-primary font-semibold block">
                      {isGiftMode
                        ? `${giftRecipientName || "Recipient"}'s Targeted Care Priorities`
                        : "Diagnostic Telemetry • Top 3 Concerns"}
                    </span>
                    <h4 className="font-serif text-2xl text-foreground">
                      {isGiftMode
                        ? "Gentle Botanical Priorities for Their Routine"
                        : "Top 3 Detected Skin Concerns"}
                    </h4>
                  </div>
                  <DemoDataBadge />
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  {skinResult.topConcerns.map((concern, idx) => (
                    <motion.div
                      key={concern.id}
                      initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: idx * 0.08 }}
                      whileHover={shouldReduceMotion ? undefined : { y: -3 }}
                      className="bg-background rounded-2xl p-5 border border-border/60 boty-shadow flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary">
                            #{idx + 1} • {concern.severity}
                          </span>
                          <MatchScoreRing score={concern.score} size={42} strokeWidth={3.5} showLabel={false} />
                        </div>
                        <h5 className="font-serif text-lg font-semibold text-foreground mb-1">
                          {concern.name}
                        </h5>
                        <p className="text-[11px] text-primary font-medium mb-2">
                          Zone: {concern.zone}
                        </p>
                        <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                          {concern.description}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-border/50 flex flex-wrap gap-1.5">
                        {concern.recommendedActives.map((active) => (
                          <span
                            key={active}
                            className="text-[10px] px-2.5 py-1 rounded-full bg-card text-foreground font-medium"
                          >
                            {active}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* SHAREABLE GIFT-NOTE CARD WITH PERSONAL MESSAGE (Shown when "Shopping for someone else?" is toggled on) */}
            <AnimatePresence>
              {isGiftMode && (
                <motion.div
                  initial={shouldReduceMotion ? false : { opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={shouldReduceMotion ? undefined : { opacity: 0, height: 0 }}
                  transition={{ duration: 0.35 }}
                  className="overflow-hidden"
                >
                  <div className="bg-card rounded-3xl p-6 sm:p-8 boty-shadow border-2 border-primary/30">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                          <Gift className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-xs uppercase tracking-[0.2em] text-primary font-semibold block">
                            Bespoke Gift Concierge
                          </span>
                          <h4 className="font-serif text-2xl text-foreground">
                            Shareable Gift-Note Card & Shade Voucher
                          </h4>
                        </div>
                      </div>
                      <DemoDataBadge />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 items-stretch">
                      {/* Left: Personalize Inputs */}
                      <div className="space-y-4">
                        <div>
                          <label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold block mb-1.5">
                            Recipient Name
                          </label>
                          <input
                            type="text"
                            value={giftRecipientName}
                            onChange={(e) => setGiftRecipientName(e.target.value)}
                            placeholder="e.g., Elena"
                            className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-sm text-foreground focus:outline-none focus:border-primary"
                          />
                        </div>

                        <div>
                          <label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold block mb-1.5">
                            Personal Gift Message
                          </label>
                          <textarea
                            rows={3}
                            value={giftMessage}
                            onChange={(e) => setGiftMessage(e.target.value)}
                            placeholder="Write a personal note..."
                            className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-sm text-foreground focus:outline-none focus:border-primary resize-none"
                          />
                        </div>

                        <div>
                          <label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold block mb-1.5">
                            Your Sign-Off
                          </label>
                          <input
                            type="text"
                            value={giftSenderName}
                            onChange={(e) => setGiftSenderName(e.target.value)}
                            placeholder="With love, Maya"
                            className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-sm text-foreground focus:outline-none focus:border-primary"
                          />
                        </div>
                      </div>

                      {/* Right: Live Shareable Gift-Note Card Preview */}
                      <div className="bg-background rounded-3xl p-6 border border-border boty-shadow flex flex-col justify-between relative overflow-hidden">
                        <div className="flex items-center justify-between border-b border-border/60 pb-3 mb-4">
                          <div>
                            <span className="font-serif text-lg font-semibold text-foreground block">
                              ShadeMatch Atelier
                            </span>
                            <span className="text-[10px] uppercase tracking-[0.2em] text-primary">
                              Calibrated Shade Gift Pass
                            </span>
                          </div>
                          {toneResult && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-card text-xs font-medium text-foreground border border-border">
                              <span
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: toneResult.hex }}
                              />
                              {toneResult.shadeCode}
                            </span>
                          )}
                        </div>

                        <div className="my-2">
                          <p className="font-serif text-xl text-foreground mb-2">
                            Dear {giftRecipientName || "Friend"},
                          </p>
                          <p className="font-serif italic text-foreground/85 text-base leading-relaxed mb-4">
                            &ldquo;{giftMessage}&rdquo;
                          </p>
                          <p className="text-sm font-medium text-primary text-right">
                            — {giftSenderName}
                          </p>
                        </div>

                        <div className="pt-4 border-t border-border/60 mt-4 flex flex-col sm:flex-row gap-2.5">
                          <button
                            type="button"
                            onClick={handleShareGiftNote}
                            className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-full bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 boty-transition"
                          >
                            {copiedGiftNote ? (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                Gift Note Link Copied!
                              </>
                            ) : (
                              <>
                                <Share2 className="w-3.5 h-3.5" />
                                Share Gift Note
                              </>
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              addItem({
                                id: "silk-skin-tint",
                                name: `Gift Set: Silk Skin Tint (${toneResult?.shadeCode || "320W"}) + Note for ${giftRecipientName || "Recipient"}`,
                                description: `Includes bespoke gift note & free shade-exchange pass`,
                                price: 54,
                                image: "/images/products/pump-bottles-cream.png",
                              })
                            }
                            className="inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-full bg-card border border-border text-foreground text-xs font-medium hover:bg-secondary/60 boty-transition"
                          >
                            <ShoppingBag className="w-3.5 h-3.5 text-primary" />
                            Add Gift to Bag
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
