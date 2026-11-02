# ShadeMatch 🌿

> **Inclusive Skin AI & eCommerce Shade Matching Platform** powered by Perfect Corp YouCam APIs.

ShadeMatch decodes individual skin identity—spectrophotometric skin tone, subsurface undertone, and epidermal health diagnostics—to dynamically rank botanical beauty formulations by personal match score (0–100) and eliminate shade-mismatch returns for shoppers and beauty retailers.

---

## 🌟 Key Features

1. **YouCam Skin & Tone AI**:
   - **File Upload & Presigned S3 Ingestion**: Direct binary upload via YouCam File API.
   - **Skin Analysis**: Multi-zone assessment of hydration, lipid barrier, radiance, and top concerns (uneven tone, texture, fine dehydration lines).
   - **Skin Tone & Undertone Analysis**: Spectrophotometric melanin mapping across Fitzpatrick Types I–VI and undertone classification (Warm, Neutral, Cool, Olive).
2. **Real-Time Catalog Ranking**:
   - Every product in the catalog is dynamically scored and personalized with an individualized match reason.
   - Shade-match cosmetics calibrate pigment codes (e.g., `320W Golden Honey`, `280W Honey Almond`, `150W Warm Linen`) to match the scanned skin profile.
3. **Interactive Virtual Try-On**:
   - Dual-view split slider with before-and-after realistic skin tint and botanical glow simulation.
4. **Gift Concierge Mode**:
   - "Shopping for someone else?" toggle creates custom shade gift profiles with personalized gift notes and complimentary digital shade-exchange passes.
5. **Retailer Merchandising Intelligence**:
   - Live telemetry synthesizing biometric shopper scans against SKU catalog coverage to identify shade and formulation inventory gaps.
   - Every real scan is appended to the dashboard data so merchandising charts update in real-time.

---

## 🔌 YouCam APIs Used

ShadeMatch integrates with official Perfect Corp YouCam Server-to-Server (S2S) APIs:

* **File API** (`POST /s2s/v2.0/file`): Registers image metadata and provides pre-signed AWS S3 URLs for binary uploads.
* **AI Skin Tone Analysis** (`POST /s2s/v2.0/task/skin-tone-analysis` & `GET /s2s/v2.0/task/skin-tone-analysis/{task_id}`): Analyzes skin hex color, melanin depth, undertones (warm, neutral, cool, olive), and Fitzpatrick scale.
* **AI Skin Analysis** (`POST /s2s/v2.0/task/skin-analysis` & `GET /s2s/v2.0/task/skin-analysis/{task_id}`): Diagnostic computer vision evaluation for wrinkles, pores, texture, spots, and moisture.

### Robust Graceful Fallback & In-Memory Caching
* **In-Memory Image Hash Caching**: Image hashes are cached in memory so the same photo never costs API units twice.
* **Seamless Sample Data Fallback**: When API credits/units are unavailable (`CreditInsufficiency`) or if network timeouts occur (25s polling timeout), ShadeMatch automatically and gracefully falls back to deterministic, calibrated sample data without breaking the user experience or throwing raw errors.
* **Live Badge Indicator**:
  - `Live YouCam analysis` — Displayed with a green live pulse badge when powered by the live YouCam API.
  - `Demo data` — Displayed with a subtle badge when running on fallback sample data.

---

## 🚀 Getting Started

### 1. Prerequisites
* Node.js 18+ (tested on Node 20 & Node 24)
* npm or pnpm

### 2. Environment Setup
Copy `.env.example` to `.env.local` inside `boty-e-commerce-template/`:

```bash
cp .env.example boty-e-commerce-template/.env.local
```

Add your credentials (keys remain strictly confidential and are `.gitignore`d):
```env
YOUCAM_API_KEY=your_youcam_api_key_here
YOUCAM_SECRET_KEY=your_optional_secret_key_here
```

> **Security Note**: `.env.local` is listed in `.gitignore` and is never committed or logged.

### 3. Install & Run

```bash
# Navigate to the Next.js project directory
cd boty-e-commerce-template

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Production Build

```bash
cd boty-e-commerce-template
npm run build
npm start
```

---

## 🧪 How to Test with One Photo

1. Start the app (`npm run dev` in `boty-e-commerce-template`).
2. Navigate to [http://localhost:3000](http://localhost:3000).
3. Scroll down to the **Skin & Shade Scanner** section (or click **Scan my skin** in the hero).
4. Click **Upload Photo** and select any front-facing portrait or selfie from your device (or choose one of the quick studio sample portraits: *Golden Honey 320W*, *Warm Linen 150W*, or *Rich Amber 410W*).
5. Click **Scan My Skin Now (3s)**:
   - The scanner sweeps through the 4-step biometric alignment.
   - Server-side routes `/api/skin` and `/api/tone` are invoked.
   - Results display your spectrophotometric skin tone, undertone breakdown, hydration/barrier scores, and top 3 skin concerns.
   - The product recommendations below immediately re-rank and display your calibrated shade.
   - Click **Retailer** in the top navigation to view the live merchandising dashboard, where your scan is recorded and reflected in the distribution chart.
