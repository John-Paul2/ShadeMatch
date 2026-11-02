import fs from "fs"
import path from "path"

export interface YouCamApiConfig {
  apiKey: string
  secretKey?: string
  baseUrl: string
}

function cleanKey(val?: string | null): string {
  if (!val) return ""
  let clean = val.trim()
  if (clean.charCodeAt(0) === 0xfeff) {
    clean = clean.slice(1).trim()
  }
  return clean.replace(/^["']|["']$/g, "")
}

export function getYouCamConfig(): YouCamApiConfig {
  const apiKey = cleanKey(process.env.YOUCAM_API_KEY)
  const secretKey = cleanKey(process.env.YOUCAM_SECRET_KEY)
  const baseUrl = process.env.YOUCAM_BASE_URL || "https://yce-api-01.makeupar.com"

  return { apiKey, secretKey, baseUrl }
}

/**
 * Resolves local public image paths to a Buffer if the input is a relative URL (e.g. /images/bento-skin-model.jpg)
 */
export async function resolveImageBuffer(
  fileOrUrl: string | File | Blob
): Promise<{ buffer: Buffer; mimeType: string; filename: string }> {
  // If it's a browser File or Blob
  if (typeof Blob !== "undefined" && fileOrUrl instanceof Blob) {
    const arrayBuffer = await fileOrUrl.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const mimeType = fileOrUrl.type || "image/jpeg"
    const filename = (fileOrUrl as File).name || "upload.jpg"
    return { buffer, mimeType, filename }
  }

  if (typeof fileOrUrl === "string") {
    // Case 1: Data URI
    if (fileOrUrl.startsWith("data:")) {
      const match = fileOrUrl.match(/^data:([^;]+);base64,(.+)$/)
      if (match) {
        const mimeType = match[1]
        const buffer = Buffer.from(match[2], "base64")
        return { buffer, mimeType, filename: "upload.jpg" }
      }
    }

    // Case 2: Relative public image URL (e.g. /images/...)
    if (fileOrUrl.startsWith("/") || fileOrUrl.startsWith("images/")) {
      const cleanPath = fileOrUrl.startsWith("/") ? fileOrUrl.slice(1) : fileOrUrl
      const possiblePaths = [
        path.join(process.cwd(), "public", cleanPath),
        path.join(process.cwd(), "boty-e-commerce-template", "public", cleanPath),
        path.join(process.cwd(), cleanPath),
      ]

      for (const p of possiblePaths) {
        if (fs.existsSync(p)) {
          const buffer = fs.readFileSync(p)
          const ext = path.extname(p).toLowerCase()
          const mimeType = ext === ".png" ? "image/png" : ext === ".webp" ? "image/webp" : "image/jpeg"
          return { buffer, mimeType, filename: path.basename(p) }
        }
      }
    }

    // Case 3: Remote URL
    if (fileOrUrl.startsWith("http://") || fileOrUrl.startsWith("https://")) {
      const resp = await fetch(fileOrUrl)
      if (!resp.ok) {
        throw new Error(`Failed to fetch image from URL: ${resp.statusText}`)
      }
      const arrayBuffer = await resp.arrayBuffer()
      const mimeType = resp.headers.get("content-type") || "image/jpeg"
      return { buffer: Buffer.from(arrayBuffer), mimeType, filename: "remote-image.jpg" }
    }
  }

  throw new Error("Unsupported image input format")
}

/**
 * Uploads an image to YouCam File API and returns the file_id
 */
export async function uploadToYouCam(
  buffer: Buffer,
  mimeType: string,
  filename: string
): Promise<string> {
  const { apiKey, baseUrl } = getYouCamConfig()
  if (!apiKey) {
    throw new Error("YOUCAM_API_KEY is missing")
  }

  // 1. Initialize file upload
  const fileInitRes = await fetch(`${baseUrl}/s2s/v2.0/file`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      files: [
        {
          content_type: mimeType,
          file_name: filename,
          file_size: buffer.length,
        },
      ],
    }),
  })

  if (!fileInitRes.ok) {
    const errText = await fileInitRes.text()
    throw new Error(`YouCam file registration failed (${fileInitRes.status}): ${errText}`)
  }

  const initData = await fileInitRes.json()
  const fileMeta = initData?.data?.files?.[0]
  if (!fileMeta || !fileMeta.file_id || !fileMeta.requests?.[0]?.url) {
    throw new Error("Invalid file registration response from YouCam")
  }

  const presignedReq = fileMeta.requests[0]
  const uploadHeaders: Record<string, string> = {
    "Content-Type": mimeType,
    "Content-Length": String(buffer.length),
    ...(presignedReq.headers || {}),
  }

  // 2. Upload binary to presigned URL
  const uploadRes = await fetch(presignedReq.url, {
    method: presignedReq.method || "PUT",
    headers: uploadHeaders,
    body: new Uint8Array(buffer),
  })

  if (!uploadRes.ok) {
    const uploadErr = await uploadRes.text()
    throw new Error(`Failed to upload image binary (${uploadRes.status}): ${uploadErr}`)
  }

  return fileMeta.file_id
}

/**
 * Polls a YouCam task until completed or timed out (25 seconds)
 */
export async function pollYouCamTask<T>(
  taskPath: string,
  taskId: string,
  timeoutMs: number = 25000
): Promise<T> {
  const { apiKey, baseUrl } = getYouCamConfig()
  const startTime = Date.now()
  const pollInterval = 1200 // 1.2s intervals

  while (Date.now() - startTime < timeoutMs) {
    const res = await fetch(`${baseUrl}/s2s/v2.0/task/${taskPath}/${taskId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    })

    if (!res.ok) {
      const errText = await res.text()
      throw new Error(`Polling error (${res.status}): ${errText}`)
    }

    const data = await res.json()
    const status = data?.task_status || data?.status

    if (status === "success") {
      return data
    }

    if (status === "error" || data?.error) {
      throw new Error(`YouCam task failed: ${data?.error || JSON.stringify(data)}`)
    }

    // Task still running/pending - wait interval
    await new Promise((resolve) => setTimeout(resolve, pollInterval))
  }

  throw new Error(`YouCam task timed out after ${Math.round(timeoutMs / 1000)}s`)
}
