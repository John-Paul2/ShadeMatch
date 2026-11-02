"use client"

import React, { useState, useMemo } from "react"
import Link from "next/link"
import { motion, useReducedMotion } from "framer-motion"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from "recharts"
import {
  BarChart3,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Users,
  PackagePlus,
  ArrowUpRight,
  Layers,
  ShieldCheck,
  Store,
} from "lucide-react"
import { Header } from "@/components/boty/header"
import { Footer } from "@/components/boty/footer"
import { DemoDataBadge } from "@/components/boty/skin-scan-context"
import { CountUpNumber, MatchScoreRing } from "@/components/boty/match-score-ring"
import { getRetailerDashboardData } from "@/src/services/youcam"

export default function RetailerDashboardPage() {
  const shouldReduceMotion = useReducedMotion()
  const baseData = useMemo(() => getRetailerDashboardData(), [])
  const [fixedGapIds, setFixedGapIds] = useState<string[]>([])
  const [chartMode, setChartMode] = useState<"scans" | "undertones">("scans")

  const handleToggleFixGap = (gapId: string) => {
    setFixedGapIds((prev) =>
      prev.includes(gapId) ? prev.filter((id) => id !== gapId) : [...prev, gapId]
    )
  }

  const handleFixAllGaps = () => {
    setFixedGapIds(baseData.catalogGaps.map((g) => g.id))
  }

  // Dynamically adjust return-reduction & SKU coverage when gaps are fixed
  const fixedCount = fixedGapIds.length
  const activeReturnReduction = baseData.estimatedReturnReductionPercent + fixedCount * 3
  const activeProjectedReturnRate = Math.max(
    6.4,
    Number((baseData.projectedReturnRate - fixedCount * 0.8).toFixed(1))
  )
  const recoveredMonthlyRevenue = baseData.catalogGaps
    .filter((g) => fixedGapIds.includes(g.id))
    .reduce((sum, g) => sum + g.missedMonthlyRevenue, 0)

  const chartData = useMemo(() => {
    return baseData.toneDistribution.map((item) => {
      let extraSkus = 0
      if (item.shortLabel.includes("IV") && fixedGapIds.includes("gap-golden-olive")) {
        extraSkus += 2
      }
      if (
        (item.shortLabel.includes("V") || item.shortLabel.includes("VI")) &&
        fixedGapIds.includes("gap-deep-amber")
      ) {
        extraSkus += 2
      }
      if (
        (item.shortLabel.includes("IV") ||
          item.shortLabel.includes("V") ||
          item.shortLabel.includes("VI")) &&
        fixedGapIds.includes("gap-tinted-spf-melanin")
      ) {
        extraSkus += 1
      }
      return {
        ...item,
        matchingProducts: item.matchingProducts + extraSkus,
      }
    })
  }, [baseData.toneDistribution, fixedGapIds])

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="pt-28 pb-24"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Top Hero Header */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12 pb-8 border-b border-border/60">
            <div>
              <div className="inline-flex items-center gap-2.5 mb-3">
                <span className="text-xs tracking-[0.28em] uppercase text-primary font-semibold">
                  Retailer Merchandising Telemetry
                </span>
                <DemoDataBadge />
                <span className="text-xs px-3 py-0.5 rounded-full bg-card border border-border text-foreground font-medium">
                  Seeded Cohort: 200 Scans
                </span>
              </div>
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-foreground leading-tight text-balance">
                Skin AI &amp; Catalog Intelligence
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mt-2">
                Live synthesis of 200 biometric skin-tone &amp; concern scans compared against your active SKU inventory to eliminate shade-mismatch returns.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/#skin-scanner"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-card border border-border text-foreground text-xs sm:text-sm font-medium hover:bg-secondary/60 boty-transition boty-shadow"
              >
                <Store className="w-4 h-4 text-primary" />
                View Shopper Scanner
              </Link>
              <button
                type="button"
                onClick={handleFixAllGaps}
                disabled={fixedGapIds.length === baseData.catalogGaps.length}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground text-xs sm:text-sm font-medium hover:bg-primary/90 boty-transition boty-shadow disabled:opacity-60"
              >
                <PackagePlus className="w-4 h-4" />
                {fixedGapIds.length === baseData.catalogGaps.length
                  ? "All 4 Catalog Gaps Queued"
                  : "Auto-Fix All Catalog Gaps"}
              </button>
            </div>
          </div>

          {/* 4 Executive KPI Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
            {/* KPI 1: Seeded Scans */}
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.05 }}
              whileHover={shouldReduceMotion ? undefined : { y: -4 }}
              className="bg-card rounded-3xl p-6 boty-shadow border border-border/60"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                  Biometric Scans Analyzed
                </span>
                <DemoDataBadge />
              </div>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="font-serif text-4xl font-bold text-foreground">
                  <CountUpNumber value={baseData.totalScans} />
                </span>
                <span className="text-xs font-medium text-primary">100% Validated</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Seeded across Fitzpatrick bands I–VI with subsurface undertone telemetry
              </p>
            </motion.div>

            {/* KPI 2: Estimated Return-Reduction Number */}
            <motion.div
              id="return-reduction"
              initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              whileHover={shouldReduceMotion ? undefined : { y: -4 }}
              className="bg-primary text-primary-foreground rounded-3xl p-6 boty-shadow border border-primary"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs uppercase tracking-wider text-primary-foreground/80 font-semibold flex items-center gap-1.5">
                  <TrendingDown className="w-4 h-4" />
                  Est. Return Reduction
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-primary-foreground/15 text-primary-foreground">
                  Demo data
                </span>
              </div>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="font-serif text-4xl font-bold">
                  -<CountUpNumber value={activeReturnReduction} suffix="%" />
                </span>
                <span className="text-xs text-primary-foreground/90 font-medium">
                  ({baseData.baselineReturnRate}% → {activeProjectedReturnRate}%)
                </span>
              </div>
              <p className="text-xs text-primary-foreground/80">
                Estimated reduction in shade-mismatch &amp; oxidation returns via YouCam VTO
              </p>
            </motion.div>

            {/* KPI 3: Catalog Gaps Identified */}
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              whileHover={shouldReduceMotion ? undefined : { y: -4 }}
              className="bg-card rounded-3xl p-6 boty-shadow border border-border/60"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                  High-Demand SKU Gaps
                </span>
                <DemoDataBadge />
              </div>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="font-serif text-4xl font-bold text-foreground">
                  <CountUpNumber value={baseData.catalogGaps.length - fixedCount} />
                </span>
                <span className="text-xs font-medium text-destructive">
                  {fixedCount > 0 ? `${fixedCount} Fixed in PO` : "Action Recommended"}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                53.5% of scans fall in Type IV–VI bands with only 4 matching shade SKUs
              </p>
            </motion.div>

            {/* KPI 4: Annualized Return Savings + Recovered Revenue */}
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              whileHover={shouldReduceMotion ? undefined : { y: -4 }}
              className="bg-card rounded-3xl p-6 boty-shadow border border-border/60"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                  Est. Margin Impact
                </span>
                <DemoDataBadge />
              </div>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="font-serif text-4xl font-bold text-foreground">
                  $<CountUpNumber value={baseData.estimatedAnnualSavings + recoveredMonthlyRevenue} />
                </span>
                <span className="text-xs font-medium text-primary inline-flex items-center">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  /yr
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                {recoveredMonthlyRevenue > 0
                  ? `Includes +$${recoveredMonthlyRevenue.toLocaleString()}/mo from fixed catalog gaps`
                  : "Saved in reverse-logistics & destroyed open-box cosmetics"}
              </p>
            </motion.div>
          </div>

          {/* MAIN CHARTS ROW: Skin-Tone Distribution (Recharts) + Top Concerns */}
          <div id="tone-distribution" className="grid lg:grid-cols-12 gap-8 mb-12">
            {/* Left (7 cols): Skin-Tone Distribution Chart (Recharts) */}
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45 }}
              className="lg:col-span-7 bg-card rounded-3xl p-6 sm:p-8 boty-shadow border border-border/60 flex flex-col justify-between"
            >
              <div>
                <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <BarChart3 className="w-4 h-4 text-primary" />
                      <span className="text-xs uppercase tracking-[0.2em] text-primary font-semibold">
                        Fitzpatrick I–VI Telemetry (n = 200 Scans)
                      </span>
                      <DemoDataBadge />
                    </div>
                    <h2 className="font-serif text-2xl sm:text-3xl text-foreground">
                      Skin-Tone Distribution vs. Catalog SKUs
                    </h2>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                      Compares shopper scan demand against matching shade products in stock.
                    </p>
                  </div>

                  {/* Chart View Switcher */}
                  <div className="inline-flex bg-background rounded-full p-1 border border-border/70">
                    <button
                      type="button"
                      onClick={() => setChartMode("scans")}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-medium boty-transition ${
                        chartMode === "scans"
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Demand vs. SKUs
                    </button>
                    <button
                      type="button"
                      onClick={() => setChartMode("undertones")}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-medium boty-transition ${
                        chartMode === "undertones"
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      By Undertone
                    </button>
                  </div>
                </div>

                {/* Recharts Responsive Container */}
                <div className="h-[320px] w-full bg-background/80 rounded-2xl p-4 border border-border/60">
                  <ResponsiveContainer width="100%" height="100%">
                    {chartMode === "scans" ? (
                      <BarChart
                        data={chartData}
                        margin={{ top: 12, right: 16, left: -8, bottom: 8 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#D8CFC4" vertical={false} />
                        <XAxis
                          dataKey="shortLabel"
                          tick={{ fill: "#2C2C2C", fontSize: 12 }}
                          axisLine={{ stroke: "#D8CFC4" }}
                        />
                        <YAxis
                          tick={{ fill: "#6B6560", fontSize: 12 }}
                          axisLine={{ stroke: "#D8CFC4" }}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#F7F4EF",
                            borderColor: "#D8CFC4",
                            borderRadius: "16px",
                            color: "#2C2C2C",
                            fontSize: "12px",
                          }}
                        />
                        <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }} />
                        <Bar
                          dataKey="scans"
                          name="Shopper Scans (out of 200)"
                          radius={[8, 8, 0, 0]}
                        >
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.hex} stroke="#2C2C2C" strokeWidth={0.5} />
                          ))}
                        </Bar>
                        <Bar
                          dataKey="matchingProducts"
                          name="Matching Shade SKUs"
                          fill="#4F5B3A"
                          radius={[8, 8, 0, 0]}
                        />
                      </BarChart>
                    ) : (
                      <BarChart
                        data={chartData}
                        margin={{ top: 12, right: 16, left: -8, bottom: 8 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#D8CFC4" vertical={false} />
                        <XAxis
                          dataKey="shortLabel"
                          tick={{ fill: "#2C2C2C", fontSize: 12 }}
                          axisLine={{ stroke: "#D8CFC4" }}
                        />
                        <YAxis
                          tick={{ fill: "#6B6560", fontSize: 12 }}
                          axisLine={{ stroke: "#D8CFC4" }}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#F7F4EF",
                            borderColor: "#D8CFC4",
                            borderRadius: "16px",
                            color: "#2C2C2C",
                            fontSize: "12px",
                          }}
                        />
                        <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }} />
                        <Bar
                          dataKey="warmScans"
                          stackId="a"
                          name="Warm Undertone"
                          fill="#B67E52"
                          radius={[0, 0, 0, 0]}
                        />
                        <Bar
                          dataKey="neutralScans"
                          stackId="a"
                          name="Neutral Undertone"
                          fill="#B8ADA3"
                        />
                        <Bar
                          dataKey="coolOliveScans"
                          stackId="a"
                          name="Cool / Olive Undertone"
                          fill="#4F5B3A"
                          radius={[8, 8, 0, 0]}
                        />
                      </BarChart>
                    )}
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Swatch Legend Strip for the 6 Bands */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 mt-5">
                {chartData.map((band) => (
                  <div
                    key={band.shortLabel}
                    className="bg-background rounded-2xl p-3 border border-border/60 flex flex-col justify-between"
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <span
                        className="w-4 h-4 rounded-full border border-black/20 flex-shrink-0"
                        style={{ backgroundColor: band.hex }}
                      />
                      <span className="text-xs font-semibold text-foreground truncate">
                        {band.shortLabel}
                      </span>
                    </div>
                    <div className="text-[11px] text-muted-foreground flex items-center justify-between">
                      <span>{band.scans} scans</span>
                      <span
                        className={`font-semibold ${
                          band.matchingProducts <= 2 ? "text-destructive" : "text-primary"
                        }`}
                      >
                        {band.matchingProducts} SKUs
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right (5 cols): Top Skin Concerns Telemetry */}
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.1 }}
              className="lg:col-span-5 bg-card rounded-3xl p-6 sm:p-8 boty-shadow border border-border/60 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs uppercase tracking-[0.2em] text-primary font-semibold">
                    Epidermal Diagnostics
                  </span>
                  <DemoDataBadge />
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl text-foreground mb-1">
                  Top Skin Concerns (200 Scans)
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground mb-6">
                  Frequency of primary concerns detected per shopper scan and active SKU coverage.
                </p>

                <div className="space-y-4">
                  {baseData.topConcerns.map((concern, index) => (
                    <div
                      key={concern.id}
                      className="bg-background rounded-2xl p-4 border border-border/60 boty-shadow"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <span className="text-sm font-serif font-semibold text-foreground block">
                            {index + 1}. {concern.name}
                          </span>
                          <span className="text-[11px] text-muted-foreground">
                            Top match: <strong className="text-foreground">{concern.topMatchedProduct}</strong> •{" "}
                            {concern.matchingSkus} SKUs
                          </span>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <span className="text-sm font-bold text-primary block">
                            {concern.scans} scans ({concern.percentage}%)
                          </span>
                          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                            {concern.growth}
                          </span>
                        </div>
                      </div>

                      <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-primary rounded-full"
                          initial={{ width: shouldReduceMotion ? `${concern.percentage}%` : 0 }}
                          whileInView={{ width: `${concern.percentage}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, delay: index * 0.08 }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
                <span>Multi-label telemetry (up to 3 concerns/scan)</span>
                <span className="font-medium text-primary">Avg Match Score: 93.4/100</span>
              </div>
            </motion.div>
          </div>

          {/* CATALOG GAP REPORT SECTION */}
          <div id="catalog-gaps" className="bg-card rounded-3xl p-6 sm:p-10 boty-shadow border border-border/60">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
              <div>
                <div className="inline-flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-destructive" />
                  <span className="text-xs uppercase tracking-[0.22em] text-destructive font-semibold">
                    Actionable Merchandising Alerts
                  </span>
                  <DemoDataBadge />
                </div>
                <h2 className="font-serif text-3xl sm:text-4xl text-foreground">
                  Catalog Gap Report
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mt-1">
                  High-demand skin tones and concern combinations where current product inventory has few matching SKUs—driving avoidable shade returns.
                </p>
              </div>

              <div className="bg-background rounded-2xl px-4 py-3 border border-border/70 flex items-center gap-3 self-start md:self-end">
                <ShieldCheck className="w-5 h-5 text-primary" />
                <div className="text-xs">
                  <span className="text-muted-foreground block">Est. Return Rate Impact</span>
                  <span className="font-semibold text-foreground">
                    -{activeReturnReduction}% Reduction ({baseData.baselineReturnRate}% → {activeProjectedReturnRate}%)
                  </span>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {baseData.catalogGaps.map((gap, index) => {
                const isFixed = fixedGapIds.includes(gap.id)
                return (
                  <motion.div
                    key={gap.id}
                    initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.08 }}
                    whileHover={shouldReduceMotion ? undefined : { y: -4 }}
                    className={`rounded-3xl p-6 sm:p-7 boty-shadow border transition-all flex flex-col justify-between ${
                      isFixed
                        ? "bg-background border-primary/60"
                        : "bg-background border-border/80"
                    }`}
                  >
                    <div>
                      {/* Top Header */}
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                            isFixed
                              ? "bg-primary/15 text-primary"
                              : "bg-destructive/15 text-destructive"
                          }`}
                        >
                          {isFixed ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Gap Resolved • PO Queued
                            </>
                          ) : (
                            <>
                              <AlertTriangle className="w-3.5 h-3.5" />
                              {gap.category} • High Demand / Low SKU
                            </>
                          )}
                        </span>
                        <DemoDataBadge />
                      </div>

                      {/* Swatch + Title */}
                      <div className="flex items-start gap-3.5 mb-4">
                        <div
                          className="w-11 h-11 rounded-2xl border-2 border-white boty-shadow flex-shrink-0 mt-0.5"
                          style={{ backgroundColor: gap.swatchHex }}
                        />
                        <div>
                          <h3 className="font-serif text-xl font-semibold text-foreground leading-snug">
                            {gap.title}
                          </h3>
                          <p className="text-xs text-destructive font-medium mt-0.5">
                            {gap.estimatedReturnRisk}
                          </p>
                        </div>
                      </div>

                      {/* Telemetry Metrics Strip */}
                      <div className="grid grid-cols-3 gap-2.5 p-3.5 rounded-2xl bg-card/80 border border-border/60 mb-4 text-center">
                        <div>
                          <span className="text-[10px] uppercase tracking-wider text-muted-foreground block">
                            Scan Demand
                          </span>
                          <span className="font-serif text-lg font-bold text-foreground">
                            {gap.demandScans}/200 ({gap.demandPercentage}%)
                          </span>
                        </div>
                        <div className="border-x border-border/60">
                          <span className="text-[10px] uppercase tracking-wider text-muted-foreground block">
                            Matching Products
                          </span>
                          <span
                            className={`font-serif text-lg font-bold ${
                              isFixed ? "text-primary" : "text-destructive"
                            }`}
                          >
                            {isFixed
                              ? `${gap.matchingProductsCount + 2} SKUs`
                              : `Only ${gap.matchingProductsCount} ${
                                  gap.matchingProductsCount === 1 ? "SKU" : "SKUs"
                                }`}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase tracking-wider text-muted-foreground block">
                            Missed Rev/Mo
                          </span>
                          <span className="font-serif text-lg font-bold text-foreground">
                            ${gap.missedMonthlyRevenue.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* Recommendation */}
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-5">
                        <strong className="text-foreground">AI Merchandising Action:</strong>{" "}
                        {gap.recommendation}
                      </p>
                    </div>

                    {/* Footer with "Fix this gap" button */}
                    <div className="pt-4 border-t border-border/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <span className="text-xs text-muted-foreground truncate">
                        SKU: <strong className="text-foreground">{gap.suggestedSkuName}</strong>
                      </span>

                      <button
                        type="button"
                        onClick={() => handleToggleFixGap(gap.id)}
                        className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-xs font-medium tracking-wide boty-transition boty-shadow flex-shrink-0 ${
                          isFixed
                            ? "bg-secondary text-foreground hover:bg-secondary/80"
                            : "bg-primary text-primary-foreground hover:bg-primary/90"
                        }`}
                      >
                        {isFixed ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-primary" />
                            Gap Fixed (Undo)
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4" />
                            Fix this gap
                          </>
                        )}
                      </button>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>
      </motion.div>

      <Footer />
    </main>
  )
}
