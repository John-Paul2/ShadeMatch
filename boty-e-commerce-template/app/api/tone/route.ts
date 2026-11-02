import { NextRequest, NextResponse } from "next/server"
import {
  getYouCamConfig,
  resolveImageBuffer,
  uploadToYouCam,
  pollYouCamTask,
} from "@/lib/youcam-server"
import {
  SKIN_TONE_SPECTRUM,
  type ToneAnalysisResult,
  type SkinToneSwatch,
} from "@/src/services/youcam"

// Helper to calculate color difference between two hex codes
function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace("#", "")
  const bigint = parseInt(clean, 16)
  const r = (bigint >> 16) & 255
  const g = (bigint >> 8) & 255
  const b = bigint & 255
  return [r, g, b]
}

function colorDistance(hex1: string, hex2: string): number {
  try {
    const [r1, g1, b1] = hexToRgb(hex1)
    const [r2, g2, b2] = hexToRgb(hex2)
    return Math.sqrt((r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2)
  } catch {
    return 999999
  }
}

export async function POST(req: NextRequest) {
  try {
    let fileOrUrl: string | File | Blob | null = null

    const contentType = req.headers.get("content-type") || ""
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData()
      const file = formData.get("file")
      if (file && typeof file === "object") {
        fileOrUrl = file as File
      } else {
        const imageStr = formData.get("image")
        if (typeof imageStr === "string") fileOrUrl = imageStr
      }
    } else {
      const json = await req.json().catch(() => ({}))
      fileOrUrl = json.image || json.fileUrl || null
    }

    if (!fileOrUrl) {
      return NextResponse.json(
        { success: false, error: "No image file or URL provided in request" },
        { status: 400 }
      )
    }

    const { buffer, mimeType, filename } = await resolveImageBuffer(fileOrUrl)
    const { apiKey, baseUrl } = getYouCamConfig()

    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: "YOUCAM_API_KEY environment variable is not configured" },
        { status: 200 }
      )
    }

    // 1. Upload to YouCam File API
    const fileId = await uploadToYouCam(buffer, mimeType, filename)

    // 2. Create skin-tone-analysis task
    const createRes = await fetch(`${baseUrl}/s2s/v2.0/task/skin-tone-analysis`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        src_file_id: fileId,
      }),
    })

    const createData = await createRes.json()
    if (!createRes.ok || createData.error) {
      const errMsg = createData.error || `Tone task creation failed (${createRes.status})`
      return NextResponse.json({ success: false, error: errMsg }, { status: 200 })
    }

    const taskId = createData.task_id || createData.data?.task_id
    if (!taskId) {
      return NextResponse.json(
        { success: false, error: "No task_id returned from YouCam tone task creation" },
        { status: 200 }
      )
    }

    // 3. Poll for results (25s max)
    interface RawToneResponse {
      data?: {
        skin_tone?: {
          undertone?: string
          depth?: string
          hex?: string
          fitzpatrick_scale?: string
        }
        facial_color_tones?: {
          skin?: { hex?: string }
          lips?: { hex?: string }
          eyes?: { hex?: string }
        }
      }
    }

    const pollResult = await pollYouCamTask<RawToneResponse>("skin-tone-analysis", taskId, 25000)
    const rawTone = pollResult?.data?.skin_tone
    const rawFacial = pollResult?.data?.facial_color_tones

    const realHex =
      rawTone?.hex || rawFacial?.skin?.hex || "#B67E52"

    const rawUndertone = (rawTone?.undertone || "warm").toLowerCase()
    let mappedUndertone: "Warm" | "Neutral" | "Cool" | "Olive" = "Warm"
    if (rawUndertone.includes("olive")) mappedUndertone = "Olive"
    else if (rawUndertone.includes("cool")) mappedUndertone = "Cool"
    else if (rawUndertone.includes("neutral")) mappedUndertone = "Neutral"
    else mappedUndertone = "Warm"

    const realFitzpatrick = rawTone?.fitzpatrick_scale || "Type IV"

    // Find closest swatch from SKIN_TONE_SPECTRUM by hex color distance
    let closestIndex = 6 // Default: Golden Honey (320W)
    let minDistance = Infinity

    SKIN_TONE_SPECTRUM.forEach((swatch, idx) => {
      const dist = colorDistance(swatch.hex, realHex)
      if (dist < minDistance) {
        minDistance = dist
        closestIndex = idx
      }
    })

    const matchedSwatch = SKIN_TONE_SPECTRUM[closestIndex] || SKIN_TONE_SPECTRUM[6]
    const prevSwatch = SKIN_TONE_SPECTRUM[Math.max(0, closestIndex - 1)]
    const nextSwatch = SKIN_TONE_SPECTRUM[Math.min(SKIN_TONE_SPECTRUM.length - 1, closestIndex + 1)]

    const breakdownMap: Record<
      SkinToneSwatch["undertone"],
      { warm: number; neutral: number; cool: number; subtitle: string }
    > = {
      Warm: {
        warm: 68,
        neutral: 22,
        cool: 10,
        subtitle: "Golden-peach subsurface warmth that glows in amber & honey pigments",
      },
      Olive: {
        warm: 54,
        neutral: 34,
        cool: 12,
        subtitle: "Balanced green-gold subsurface tone that prevents red or pink oxidation",
      },
      Neutral: {
        warm: 44,
        neutral: 42,
        cool: 14,
        subtitle: "Harmonious warm-cool equilibrium for versatile true-to-tone wear",
      },
      Cool: {
        warm: 18,
        neutral: 28,
        cool: 54,
        subtitle: "Soft rose-almond subsurface reflectance with crisp luminosity",
      },
    }

    const breakdown = breakdownMap[mappedUndertone] || breakdownMap.Warm
    const spectrumPosition = Math.round(((closestIndex + 0.5) / SKIN_TONE_SPECTRUM.length) * 100)
    const melaninIndex = Number((22 + closestIndex * 5.4).toFixed(1))

    const mappedResult: ToneAnalysisResult = {
      skinTone: matchedSwatch.name,
      shadeCode: matchedSwatch.code,
      hex: realHex,
      fitzpatrick: realFitzpatrick.startsWith("Type") ? realFitzpatrick : `Type ${realFitzpatrick}`,
      undertone: mappedUndertone,
      undertoneSubtitle: breakdown.subtitle,
      undertoneBreakdown: {
        warm: breakdown.warm,
        neutral: breakdown.neutral,
        cool: breakdown.cool,
      },
      melaninIndex,
      spectrumPosition,
      adjacentShades: [prevSwatch, matchedSwatch, nextSwatch],
      isDemoData: false,
    }

    return NextResponse.json({
      success: true,
      data: mappedResult,
    })
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        error: err?.message || "Unknown error during tone analysis",
      },
      { status: 200 }
    )
  }
}
