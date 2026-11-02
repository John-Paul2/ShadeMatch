"use client"

import Link from "next/link"
import { motion, useReducedMotion } from "framer-motion"
import { Sparkles, ScanFace, ArrowRight, Check } from "lucide-react"
import { SKIN_TONE_SPECTRUM } from "@/src/services/youcam"
import { useSkinScan, DemoDataBadge } from "./skin-scan-context"

export function Hero() {
  const { selectedSwatch, setSelectedSwatch, runScanAnalysis } = useSkinScan()
  const shouldReduceMotion = useReducedMotion()

  const handleSwatchSelect = (swatch: (typeof SKIN_TONE_SPECTRUM)[number]) => {
    setSelectedSwatch(swatch)
    runScanAnalysis(swatch.code, swatch)
  }

  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden pt-24 pb-16"
      style={{ backgroundColor: "#e3e1e2" }}
    >
      {/* Background Video (Preserved from Boty) */}
      <div className="border-b border-border/50 p-6 py-2" style={{ backgroundColor: "#e3e1e2" }}>
        <video
          autoPlay
          muted
          loop
          playsInline
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            minWidth: "100%",
            minHeight: "100%",
            width: "auto",
            height: "auto",
            objectFit: "cover",
          }}
        >
          <source
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/f3d8cad2-8091-4809-aac0-eaac74b0be7c-Z4XUCz3CRR7qjaOsoq6rFmbJfIRdgs.mp4"
            type="video/mp4"
          />
        </video>
        {/* Bottom fade gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-[65%] bg-gradient-to-t from-background via-background/60 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full pt-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="w-full lg:max-w-2xl mx-auto lg:mx-0 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 mb-5 animate-blur-in opacity-0" style={{ animationDelay: "0.15s", animationFillMode: "forwards" }}>
              <span className="text-xs uppercase tracking-[0.25em] text-black font-medium px-3.5 py-1.5 rounded-full bg-background/80 backdrop-blur-sm border border-border/60">
                YouCam Skin AI & Virtual Try-On
              </span>
              <DemoDataBadge />
            </div>

            <h2 className="font-serif text-5xl md:text-6xl lg:text-7xl leading-[1.08] mb-5 text-balance text-black">
              <span
                className="block animate-blur-in opacity-0 font-semibold"
                style={{ animationDelay: "0.3s", animationFillMode: "forwards" }}
              >
                Glow gently.
              </span>
              <span
                className="block animate-blur-in opacity-0 font-semibold xl:text-8xl text-6xl"
                style={{ animationDelay: "0.45s", animationFillMode: "forwards" }}
              >
                Every shade, matched.
              </span>
            </h2>

            <p
              className="text-base sm:text-lg leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0 text-black/90 animate-blur-in opacity-0"
              style={{ animationDelay: "0.6s", animationFillMode: "forwards" }}
            >
              Instant skin-tone calibration, subsurface undertone analysis, and botanical formulas ranked by your personal match score.
            </p>

            {/* Primary CTA Buttons */}
            <div
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10 animate-blur-in opacity-0"
              style={{ animationDelay: "0.75s", animationFillMode: "forwards" }}
            >
              <Link
                href="#skin-scanner"
                className="group inline-flex items-center justify-center gap-3 bg-primary text-primary-foreground px-8 py-4 rounded-full text-sm font-medium tracking-wide boty-transition hover:bg-primary/90 boty-shadow"
              >
                <ScanFace className="w-4 h-4" />
                Scan my skin
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 boty-transition" />
              </Link>
              <Link
                href="#matched-products"
                className="inline-flex items-center justify-center gap-2 bg-background/85 backdrop-blur-sm border border-foreground/20 text-foreground px-7 py-4 rounded-full text-sm tracking-wide boty-transition hover:bg-background boty-shadow"
              >
                <Sparkles className="w-4 h-4 text-primary" />
                Explore Matched Formulas
              </Link>
            </div>

            {/* Full Range of Skin Tones Shown Visually */}
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-background/90 backdrop-blur-md rounded-3xl p-5 sm:p-6 border border-border/80 boty-shadow max-w-xl mx-auto lg:mx-0 text-left"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div>
                  <span className="text-[11px] uppercase tracking-[0.2em] text-primary font-semibold block">
                    Inclusive Shade Telemetry
                  </span>
                  <h3 className="font-serif text-lg text-foreground">
                    Full Spectrum Skin Tone Range (I–VI)
                  </h3>
                </div>
                <span className="text-xs font-medium px-3 py-1 rounded-full bg-card text-foreground border border-border/60">
                  {selectedSwatch.code} • {selectedSwatch.name} ({selectedSwatch.undertone})
                </span>
              </div>

              {/* Continuous Visual Gradient Bar + 12 Interactive Swatches */}
              <div
                className="h-2.5 w-full rounded-full mb-4 border border-black/10"
                style={{
                  background:
                    "linear-gradient(90deg, #F6E5D8 0%, #F1D9C6 9%, #EBCBB2 18%, #E0B899 27%, #D4A37E 36%, #C68E65 45%, #B67E52 55%, #A36940 64%, #8E5531 73%, #764326 82%, #5C321C 91%, #3F2214 100%)",
                }}
              />

              <div className="grid grid-cols-6 sm:grid-cols-12 gap-2">
                {SKIN_TONE_SPECTRUM.map((swatch) => {
                  const isSelected = selectedSwatch.id === swatch.id
                  return (
                    <button
                      key={swatch.id}
                      type="button"
                      onClick={() => handleSwatchSelect(swatch)}
                      className={`group relative flex flex-col items-center focus:outline-none`}
                      title={`${swatch.code} ${swatch.name} (${swatch.undertone} Undertone)`}
                      aria-label={`Select skin tone ${swatch.name}`}
                    >
                      <span
                        className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full transition-transform duration-200 flex items-center justify-center border ${
                          isSelected
                            ? "scale-110 ring-2 ring-primary ring-offset-2 ring-offset-background border-white"
                            : "border-black/15 hover:scale-105"
                        }`}
                        style={{ backgroundColor: swatch.hex }}
                      >
                        {isSelected && (
                          <Check
                            className={`w-3.5 h-3.5 ${
                              swatch.fitzpatrick === "Type I" || swatch.fitzpatrick === "Type II"
                                ? "text-foreground"
                                : "text-white"
                            }`}
                          />
                        )}
                      </span>
                      <span className="text-[10px] text-muted-foreground mt-1 font-medium">
                        {swatch.code}
                      </span>
                    </button>
                  )
                })}
              </div>

              <p className="text-xs text-muted-foreground mt-3 flex items-center justify-between">
                <span>Tap any tone to preview instant catalog re-ranking, or scan your photo below.</span>
                <span className="text-primary font-medium hidden sm:inline">12/12 Shades Calibrated</span>
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
