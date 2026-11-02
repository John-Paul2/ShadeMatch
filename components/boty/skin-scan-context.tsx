"use client"

import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import {
  analyzeSkin,
  analyzeTone,
  SKIN_TONE_SPECTRUM,
  type SkinAnalysisResult,
  type ToneAnalysisResult,
  type SkinToneSwatch,
} from "@/src/services/youcam"

interface SkinScanContextType {
  uploadedPhotoUrl: string
  setUploadedPhotoUrl: (url: string) => void
  selectedSwatch: SkinToneSwatch
  setSelectedSwatch: (swatch: SkinToneSwatch) => void
  hasCompletedScan: boolean
  isScanning: boolean
  skinResult: SkinAnalysisResult | null
  toneResult: ToneAnalysisResult | null
  isGiftMode: boolean
  setIsGiftMode: (val: boolean) => void
  giftRecipientName: string
  setGiftRecipientName: (name: string) => void
  giftMessage: string
  setGiftMessage: (msg: string) => void
  giftSenderName: string
  setGiftSenderName: (name: string) => void
  runScanAnalysis: (fileOrUrl?: File | string | null, presetSwatch?: SkinToneSwatch) => Promise<void>
  openScannerModal: boolean
  setOpenScannerModal: (open: boolean) => void
}

const DEFAULT_PHOTO = "/images/bento-skin-model.jpg"

const SkinScanContext = createContext<SkinScanContextType | undefined>(undefined)

export function SkinScanProvider({ children }: { children: ReactNode }) {
  const [uploadedPhotoUrl, setUploadedPhotoUrl] = useState<string>(DEFAULT_PHOTO)
  const [selectedSwatch, setSelectedSwatch] = useState<SkinToneSwatch>(SKIN_TONE_SPECTRUM[6]) // 320W Golden Honey
  const [hasCompletedScan, setHasCompletedScan] = useState<boolean>(false)
  const [isScanning, setIsScanning] = useState<boolean>(false)
  const [skinResult, setSkinResult] = useState<SkinAnalysisResult | null>(null)
  const [toneResult, setToneResult] = useState<ToneAnalysisResult | null>(null)
  const [isGiftMode, setIsGiftMode] = useState<boolean>(false)
  const [giftRecipientName, setGiftRecipientName] = useState<string>("Elena")
  const [giftMessage, setGiftMessage] = useState<string>(
    "I used ShadeMatch AI to calibrate these botanical shades & serums to your exact golden-honey undertone. Glow gently!"
  )
  const [giftSenderName, setGiftSenderName] = useState<string>("With love, Maya")
  const [openScannerModal, setOpenScannerModal] = useState<boolean>(false)

  // Initialize default mock analysis so product rankings and results are always ready
  useEffect(() => {
    let mounted = true
    Promise.all([analyzeSkin("initial"), analyzeTone(SKIN_TONE_SPECTRUM[6].code)]).then(
      ([skin, tone]) => {
        if (mounted) {
          setSkinResult(skin)
          setToneResult(tone)
        }
      }
    )
    return () => {
      mounted = false
    }
  }, [])

  const runScanAnalysis = useCallback(
    async (fileOrUrl?: File | string | null, presetSwatch?: SkinToneSwatch) => {
      setIsScanning(true)
      try {
        const swatchToUse = presetSwatch || selectedSwatch
        const [skin, tone] = await Promise.all([
          analyzeSkin(fileOrUrl || swatchToUse.code),
          analyzeTone(fileOrUrl || swatchToUse.code),
        ])
        setSkinResult(skin)
        setToneResult(tone)
        if (tone?.shadeCode) {
          const found = SKIN_TONE_SPECTRUM.find(
            (s) => s.code === tone.shadeCode || tone.skinTone.includes(s.name)
          )
          if (found) {
            setSelectedSwatch(found)
          }
        }
        setHasCompletedScan(true)
      } finally {
        setIsScanning(false)
      }
    },
    [selectedSwatch]
  )

  return (
    <SkinScanContext.Provider
      value={{
        uploadedPhotoUrl,
        setUploadedPhotoUrl,
        selectedSwatch,
        setSelectedSwatch,
        hasCompletedScan,
        isScanning,
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
        openScannerModal,
        setOpenScannerModal,
      }}
    >
      {children}
    </SkinScanContext.Provider>
  )
}

export function useSkinScan() {
  const context = useContext(SkinScanContext)
  if (!context) {
    throw new Error("useSkinScan must be used within a SkinScanProvider")
  }
  return context
}

export function DemoDataBadge({
  isDemo,
  className = "",
}: {
  isDemo?: boolean
  className?: string
}) {
  const context = useContext(SkinScanContext)
  const effectiveIsDemo =
    typeof isDemo === "boolean"
      ? isDemo
      : (context?.skinResult?.isDemoData ?? context?.toneResult?.isDemoData ?? true)

  if (!effectiveIsDemo) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-emerald-500/40 shadow-sm ${className}`}
        title="Live analysis from Perfect Corp YouCam AI API"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
        Live YouCam analysis
      </span>
    )
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium tracking-wide bg-secondary/80 text-foreground/80 border border-border ${className}`}
      title="Simulated YouCam API response (mock data)"
    >
      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
      Demo data
    </span>
  )
}
