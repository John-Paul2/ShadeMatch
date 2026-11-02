"use client"

import { useEffect, useState } from "react"
import { motion, useReducedMotion } from "framer-motion"

interface MatchScoreRingProps {
  score: number
  size?: number
  strokeWidth?: number
  className?: string
  showLabel?: boolean
}

export function MatchScoreRing({
  score,
  size = 56,
  strokeWidth = 4.5,
  className = "",
  showLabel = true,
}: MatchScoreRingProps) {
  const shouldReduceMotion = useReducedMotion()
  const clampedScore = Math.max(0, Math.min(100, Math.round(score)))
  const radius = (size - strokeWidth * 2) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (clampedScore / 100) * circumference

  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-full bg-background/95 backdrop-blur-sm boty-shadow border border-border/60 ${className}`}
      style={{ width: size, height: size }}
      title={`ShadeMatch AI Match Score: ${clampedScore}/100`}
    >
      <svg width={size} height={size} className="-rotate-90 transform">
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-secondary"
        />
        {/* Animated progress arc */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: shouldReduceMotion ? strokeDashoffset : circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: shouldReduceMotion ? 0 : 1.1, ease: "easeOut" }}
          className="text-primary"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
        <span className="font-serif font-bold text-foreground text-xs sm:text-sm">
          <CountUpNumber value={clampedScore} duration={0.9} />
        </span>
        {showLabel && (
          <span className="text-[8px] uppercase tracking-wider text-muted-foreground font-medium">
            Match
          </span>
        )}
      </div>
    </div>
  )
}

interface CountUpNumberProps {
  value: number
  duration?: number
  prefix?: string
  suffix?: string
  decimals?: number
  className?: string
}

export function CountUpNumber({
  value,
  duration = 1.0,
  prefix = "",
  suffix = "",
  decimals = 0,
  className = "",
}: CountUpNumberProps) {
  const shouldReduceMotion = useReducedMotion()
  const [displayValue, setDisplayValue] = useState(shouldReduceMotion ? value : 0)

  useEffect(() => {
    if (shouldReduceMotion) {
      setDisplayValue(value)
      return
    }

    let startTimestamp: number | null = null
    const startVal = 0
    const totalMs = duration * 1000
    let animationFrameId: number

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp
      const progress = Math.min((timestamp - startTimestamp) / totalMs, 1)
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = startVal + eased * (value - startVal)
      setDisplayValue(current)

      if (progress < 1) {
        animationFrameId = window.requestAnimationFrame(step)
      } else {
        setDisplayValue(value)
      }
    }

    animationFrameId = window.requestAnimationFrame(step)
    return () => window.cancelAnimationFrame(animationFrameId)
  }, [value, duration, shouldReduceMotion])

  const formatted =
    decimals > 0
      ? displayValue.toFixed(decimals)
      : Math.round(displayValue).toLocaleString()

  return (
    <span className={className}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  )
}
