// YouCam API Skin AI & eCommerce VTO Mock Data Service
// Provides analyzeSkin(file), analyzeTone(file), tryOn(file, productId), and seeded 200-scan retailer telemetry.

export interface SkinConcern {
  id: string
  name: string
  score: number // 0-100 match/attention score
  severity: "Mild" | "Moderate" | "Elevated"
  zone: string
  description: string
  recommendedActives: string[]
}

export interface SkinAnalysisResult {
  skinType: string
  skinTypeSummary: string
  hydrationLevel: number
  barrierScore: number
  radianceIndex: number
  topConcerns: [SkinConcern, SkinConcern, SkinConcern]
  analyzedAt: string
  isDemoData: boolean
}

export interface SkinToneSwatch {
  id: string
  name: string
  code: string
  hex: string
  fitzpatrick: string
  undertone: "Warm" | "Neutral" | "Cool" | "Olive"
}

export interface ToneAnalysisResult {
  skinTone: string
  shadeCode: string
  hex: string
  fitzpatrick: string
  undertone: "Warm" | "Neutral" | "Cool" | "Olive"
  undertoneSubtitle: string
  undertoneBreakdown: {
    warm: number
    neutral: number
    cool: number
  }
  melaninIndex: number
  spectrumPosition: number // 0 - 100
  adjacentShades: SkinToneSwatch[]
  isDemoData: boolean
}

export interface TryOnResult {
  productId: string
  beforeImageUrl: string
  afterImageUrl: string
  overlayHex: string
  overlayOpacity: number
  warmthShift: number
  smoothingLevel: number
  radianceBoost: number
  effectType: "makeup-shade" | "skincare-glow"
  shadeLabel: string
  confidenceScore: number
  disclaimer: "Visual preview, not a guarantee."
  isDemoData: boolean
}

export type ProductCategory = "all" | "makeup" | "serum" | "cream" | "oil"

export interface ShadeMatchProduct {
  id: string
  name: string
  tagline: string
  description: string
  price: number
  originalPrice: number | null
  image: string
  badge: string | null
  category: Exclude<ProductCategory, "all">
  isMakeupShade?: boolean
  shadeHex?: string
  shadeCode?: string
  availableShades?: { code: string; name: string; hex: string }[]
  baseMatchScore: number
  defaultMatchReason: string
  targetConcerns: string[]
  bestUndertones: ("Warm" | "Neutral" | "Cool" | "Olive")[]
  sizes: string[]
  details: string
  howToUse: string
  ingredients: string
  delivery: string
}

export interface RankedProduct extends ShadeMatchProduct {
  matchScore: number
  matchReason: string
  isDemoData: boolean
}

// Full spectrum of 12 visual skin tones shown in the Hero and throughout ShadeMatch
export const SKIN_TONE_SPECTRUM: SkinToneSwatch[] = [
  { id: "tone-1", name: "Porcelain Alabaster", code: "100C", hex: "#F6E5D8", fitzpatrick: "Type I", undertone: "Cool" },
  { id: "tone-2", name: "Soft Ivory", code: "120N", hex: "#F1D9C6", fitzpatrick: "Type I", undertone: "Neutral" },
  { id: "tone-3", name: "Warm Linen", code: "150W", hex: "#EBCBB2", fitzpatrick: "Type II", undertone: "Warm" },
  { id: "tone-4", name: "Sand Bisque", code: "210N", hex: "#E0B899", fitzpatrick: "Type II", undertone: "Neutral" },
  { id: "tone-5", name: "Sunlit Beige", code: "240O", hex: "#D4A37E", fitzpatrick: "Type III", undertone: "Olive" },
  { id: "tone-6", name: "Honey Almond", code: "280W", hex: "#C68E65", fitzpatrick: "Type III", undertone: "Warm" },
  { id: "tone-7", name: "Golden Honey", code: "320W", hex: "#B67E52", fitzpatrick: "Type IV", undertone: "Warm" },
  { id: "tone-8", name: "Warm Caramel", code: "360O", hex: "#A36940", fitzpatrick: "Type IV", undertone: "Olive" },
  { id: "tone-9", name: "Rich Amber", code: "410W", hex: "#8E5531", fitzpatrick: "Type V", undertone: "Warm" },
  { id: "tone-10", name: "Spiced Chestnut", code: "450N", hex: "#764326", fitzpatrick: "Type V", undertone: "Neutral" },
  { id: "tone-11", name: "Deep Mahogany", code: "510W", hex: "#5C321C", fitzpatrick: "Type VI", undertone: "Warm" },
  { id: "tone-12", name: "Espresso Cocoa", code: "560C", hex: "#3F2214", fitzpatrick: "Type VI", undertone: "Cool" },
]

// Boty's existing products + 3 new makeup-shade products
export const SHADEMATCH_PRODUCTS: ShadeMatchProduct[] = [
  // 3 Makeup-Shade Products
  {
    id: "silk-skin-tint",
    name: "Botanical Silk Skin Tint",
    tagline: "Weightless second-skin mineral tint",
    description: "Breathable serum foundation with adaptive botanical pigments",
    price: 54,
    originalPrice: null,
    image: "/images/products/pump-bottles-cream.png",
    badge: "Shade Match",
    category: "makeup",
    isMakeupShade: true,
    shadeHex: "#B67E52",
    shadeCode: "320W Golden Honey",
    availableShades: [
      { code: "150W", name: "Warm Linen", hex: "#EBCBB2" },
      { code: "240O", name: "Sunlit Beige", hex: "#D4A37E" },
      { code: "320W", name: "Golden Honey", hex: "#B67E52" },
      { code: "410W", name: "Rich Amber", hex: "#8E5531" },
      { code: "510W", name: "Deep Mahogany", hex: "#5C321C" },
    ],
    baseMatchScore: 98,
    defaultMatchReason: "Calibrated for 320W Golden Honey with warm-peach micro-pigments that never oxidize.",
    targetConcerns: ["hyperpigmentation", "dehydration"],
    bestUndertones: ["Warm", "Olive", "Neutral"],
    sizes: ["30ml", "50ml"],
    details: "Our Botanical Silk Skin Tint merges pure mineral pigments with multi-weight hyaluronic acid and squalane. Calibrated to harmonize with your subsurface undertone without chalkiness or flashback.",
    howToUse: "Shake well. Apply 2-3 drops with fingertips or a damp sponge, blending outward from the center of the face.",
    ingredients: "Aqua, Squalane, Titanium Dioxide, Iron Oxides, Simmondsia Chinensis Seed Oil, Sodium Hyaluronate, Niacinamide, Tocopherol.",
    delivery: "Free standard shipping on orders over $50. Complimentary 30-day shade exchange guarantee."
  },
  {
    id: "velvet-mineral-concealer",
    name: "Velvet Mineral Concealer",
    tagline: "Crease-proof botanical brightening",
    description: "Luminous concealer calibrated for warm & neutral undertones",
    price: 38,
    originalPrice: null,
    image: "/images/products/tube-bottles.png",
    badge: "Shade Match",
    category: "makeup",
    isMakeupShade: true,
    shadeHex: "#C68E65",
    shadeCode: "280W Honey Almond",
    availableShades: [
      { code: "120N", name: "Soft Ivory", hex: "#F1D9C6" },
      { code: "280W", name: "Honey Almond", hex: "#C68E65" },
      { code: "320W", name: "Golden Honey", hex: "#B67E52" },
      { code: "450N", name: "Spiced Chestnut", hex: "#764326" },
    ],
    baseMatchScore: 95,
    defaultMatchReason: "Neutralizes periorbital dark spots while flexing seamlessly over fine dehydration lines.",
    targetConcerns: ["hyperpigmentation", "dehydration"],
    bestUndertones: ["Warm", "Neutral"],
    sizes: ["10ml", "15ml"],
    details: "Enriched with botanical caffeine, rosehip oil, and light-diffusing mineral spheres, Velvet Mineral Concealer brightens under-eye shadows and spot-corrects uneven tone with zero caking.",
    howToUse: "Dot gently under the eyes or over uneven spots. Pat in with ring finger until seamlessly blended.",
    ingredients: "Aqua, Caprylic/Capric Triglyceride, Iron Oxides, Glycerin, Rosa Canina Seed Oil, Caffeine, Panthenol, Tocopherol.",
    delivery: "Free standard shipping on orders over $50. Complimentary 30-day shade exchange guarantee."
  },
  {
    id: "botanical-lip-cheek-veil",
    name: "Botanical Lip & Cheek Veil",
    tagline: "Dewy plant-pigment flush",
    description: "Sheer buildable terracotta-rose balm for cheeks & lips",
    price: 36,
    originalPrice: null,
    image: "/images/products/cream-jars-colored.png",
    badge: "New Shade",
    category: "makeup",
    isMakeupShade: true,
    shadeHex: "#B55A4A",
    shadeCode: "Terracotta Rose",
    availableShades: [
      { code: "Petal", name: "Soft Petal", hex: "#D98A82" },
      { code: "Terracotta", name: "Terracotta Rose", hex: "#B55A4A" },
      { code: "SpicedPlum", name: "Spiced Berry", hex: "#7E353A" },
    ],
    baseMatchScore: 92,
    defaultMatchReason: "Warm terracotta-rose pigment complements golden undertones for a natural sunlit flush.",
    targetConcerns: ["dehydration", "texture"],
    bestUndertones: ["Warm", "Olive", "Neutral"],
    sizes: ["15g", "25g"],
    details: "Formulated with organic shea butter, jojoba oil, and alkanet root botanical pigments. Melts effortlessly into skin to impart a dewy, healthy-looking flush.",
    howToUse: "Warm a small amount on fingertips and tap onto the apples of the cheeks and center of the lips.",
    ingredients: "Butyrospermum Parkii Butter, Simmondsia Chinensis Seed Oil, Cera Alba, Alkanna Tinctoria Root Extract, Iron Oxides, Tocopherol.",
    delivery: "Free standard shipping on orders over $50. Express shipping available at checkout."
  },
  // Existing Boty Products
  {
    id: "radiance-serum",
    name: "Radiance Serum",
    tagline: "Illuminate your natural glow",
    description: "Vitamin C brightening formula",
    price: 68,
    originalPrice: null,
    image: "/images/products/serum-bottles-1.png",
    badge: "Bestseller",
    category: "serum",
    baseMatchScore: 96,
    defaultMatchReason: "15% stabilized Vitamin C directly targets your #1 concern: cheekbone uneven tone.",
    targetConcerns: ["hyperpigmentation"],
    bestUndertones: ["Warm", "Neutral", "Cool", "Olive"],
    sizes: ["30ml", "50ml"],
    details: "Our Radiance Serum combines 15% stabilized Vitamin C with rosehip seed oil and sea buckthorn extract. The formula is designed to penetrate deep into the skin, targeting dark spots and uneven tone while protecting against environmental stressors.",
    howToUse: "Apply 3-4 drops to cleansed face and neck morning and evening. Gently pat into skin until absorbed.",
    ingredients: "Aqua, Ascorbic Acid (Vitamin C), Rosa Canina Seed Oil, Hippophae Rhamnoides Oil, Glycerin, Niacinamide, Tocopherol (Vitamin E), Ferulic Acid.",
    delivery: "Free standard shipping on orders over $50. Returns accepted within 30 days of purchase."
  },
  {
    id: "hydrating-serum",
    name: "Hydrating Serum",
    tagline: "Multi-depth moisture replenishment",
    description: "Hyaluronic acid moisture boost",
    price: 62,
    originalPrice: null,
    image: "/images/products/eye-serum-bottles.png",
    badge: null,
    category: "serum",
    baseMatchScore: 94,
    defaultMatchReason: "Multi-weight hyaluronic acid plumps micro-dehydration lines without T-zone heaviness.",
    targetConcerns: ["dehydration"],
    bestUndertones: ["Warm", "Neutral", "Cool", "Olive"],
    sizes: ["30ml", "50ml"],
    details: "Formulated with triple-molecular-weight hyaluronic acid and snow mushroom extract to bind water across surface and deeper epidermal layers.",
    howToUse: "Apply 3-4 drops to damp skin morning and night before locking in with moisturizer.",
    ingredients: "Aqua, Sodium Hyaluronate, Tremella Fuciformis Sporocarp Extract, Panthenol, Glycerin, Aloe Barbadensis Leaf Juice.",
    delivery: "Free standard shipping on orders over $50. Express shipping available at checkout."
  },
  {
    id: "glow-serum",
    name: "Glow Serum",
    tagline: "Pore-refining botanical luminosity",
    description: "Niacinamide brightening boost",
    price: 58,
    originalPrice: 68,
    image: "/images/products/spray-bottles.png",
    badge: "Sale",
    category: "serum",
    baseMatchScore: 91,
    defaultMatchReason: "5% Niacinamide balances combination T-zone sebum while visibly refining pore texture.",
    targetConcerns: ["texture", "hyperpigmentation"],
    bestUndertones: ["Warm", "Neutral", "Cool", "Olive"],
    sizes: ["30ml", "50ml"],
    details: "A silky botanical serum powered by 5% Niacinamide and willow bark extract to visibly smooth texture, minimize pore appearance, and brighten dullness.",
    howToUse: "Mist or press 3 drops onto clean skin morning and evening before creams or oils.",
    ingredients: "Aqua, Niacinamide, Salix Alba Bark Extract, Glycerin, Zinc PCA, Lavandula Angustifolia Flower Water.",
    delivery: "Free standard shipping on orders over $50. Express shipping available at checkout."
  },
  {
    id: "hydra-cream",
    name: "Hydra Cream",
    tagline: "Deep moisture, lasting comfort",
    description: "Deep moisture with hyaluronic acid",
    price: 54,
    originalPrice: null,
    image: "/images/products/cream-jars-colored.png",
    badge: null,
    category: "cream",
    baseMatchScore: 89,
    defaultMatchReason: "Strengthens cheek moisture barrier and preps skin for smooth, streak-free shade wear.",
    targetConcerns: ["dehydration"],
    bestUndertones: ["Warm", "Neutral", "Cool", "Olive"],
    sizes: ["50ml", "100ml"],
    details: "Hydra Cream features multi-weight hyaluronic acid to hydrate at every level of the skin. Shea butter and jojoba oil lock in moisture while squalane provides a silky finish.",
    howToUse: "After cleansing and serum, apply a pearl-sized amount to face and neck in upward motions.",
    ingredients: "Aqua, Butyrospermum Parkii Butter, Simmondsia Chinensis Seed Oil, Sodium Hyaluronate, Squalane, Glycerin, Calendula Officinalis Extract.",
    delivery: "Free standard shipping on orders over $50. Express shipping available at checkout."
  },
  {
    id: "day-cream-spf",
    name: "Day Cream SPF 30",
    tagline: "Zero-white-cast mineral protection",
    description: "Protection & hydration",
    price: 58,
    originalPrice: null,
    image: "/images/products/pump-bottles-lavender.png",
    badge: null,
    category: "cream",
    baseMatchScore: 88,
    defaultMatchReason: "Sheer non-nano mineral SPF 30 leaves zero ashy cast on Golden Honey & deeper tones.",
    targetConcerns: ["hyperpigmentation", "dehydration"],
    bestUndertones: ["Warm", "Olive", "Neutral"],
    sizes: ["50ml", "75ml"],
    details: "Sheer dispersion zinc oxide paired with antioxidant green tea and raspberry seed oil prevents UV-induced hyperpigmentation with an invisible, radiant finish on all skin tones.",
    howToUse: "Apply generously as the final step of your morning skincare routine 15 minutes before sun exposure.",
    ingredients: "Aqua, Zinc Oxide (Non-Nano), Squalane, Camellia Sinensis Leaf Extract, Rubus Idaeus Seed Oil, Glycerin, Tocopherol.",
    delivery: "Free standard shipping on orders over $50. Express shipping available at checkout."
  },
  {
    id: "age-defense-serum",
    name: "Age Defense Serum",
    tagline: "Gentle botanical renewal",
    description: "Retinol & peptide complex",
    price: 78,
    originalPrice: null,
    image: "/images/products/amber-dropper-bottles.png",
    badge: "New",
    category: "serum",
    baseMatchScore: 86,
    defaultMatchReason: "Encapsulated phyto-retinol and peptides accelerate cell turnover for smoother texture.",
    targetConcerns: ["texture", "hyperpigmentation"],
    bestUndertones: ["Warm", "Neutral", "Cool", "Olive"],
    sizes: ["30ml", "50ml"],
    details: "Combines bakuchiol, encapsulated retinol, and botanical peptides to refine fine lines and surface texture without irritation.",
    howToUse: "Apply 2-3 drops in the evening to clean, dry skin. Follow with Night Cream or Renewal Oil.",
    ingredients: "Aqua, Bakuchiol, Retinol, Palmitoyl Tripeptide-1, Squalane, Rosa Canina Seed Oil, Tocopherol.",
    delivery: "Free standard shipping on orders over $50. Express shipping available at checkout."
  },
  {
    id: "gentle-cleanser",
    name: "Gentle Cleanser",
    tagline: "Cleanse without compromise",
    description: "Soothing botanical wash",
    price: 38,
    originalPrice: 48,
    image: "/images/products/tube-bottles.png",
    badge: "Sale",
    category: "cream",
    baseMatchScore: 84,
    defaultMatchReason: "pH-balanced oat & chamomile wash removes excess T-zone oil without stripping hydration.",
    targetConcerns: ["texture", "dehydration"],
    bestUndertones: ["Warm", "Neutral", "Cool", "Olive"],
    sizes: ["150ml", "250ml"],
    details: "Our Gentle Cleanser uses coconut-derived surfactants that cleanse effectively without stripping. Enriched with chamomile, oat extract, and aloe vera.",
    howToUse: "Wet face with lukewarm water. Massage onto face in circular motions and rinse thoroughly.",
    ingredients: "Aqua, Coco-Glucoside, Glycerin, Avena Sativa Kernel Extract, Aloe Barbadensis Leaf Juice, Chamomilla Recutita Extract.",
    delivery: "Free standard shipping on orders over $50. Express shipping available at checkout."
  },
  {
    id: "night-cream",
    name: "Night Cream",
    tagline: "Overnight barrier recovery",
    description: "Restorative overnight treatment",
    price: 64,
    originalPrice: null,
    image: "/images/products/jars-wooden-lid.png",
    badge: "Bestseller",
    category: "cream",
    baseMatchScore: 82,
    defaultMatchReason: "Ceramide-rich botanical butter locks in overnight hydration for supple morning skin.",
    targetConcerns: ["dehydration"],
    bestUndertones: ["Warm", "Neutral", "Cool", "Olive"],
    sizes: ["50ml", "100ml"],
    details: "A velvety overnight balm infused with plant ceramides, evening primrose, and shea butter to repair the moisture barrier while you sleep.",
    howToUse: "Warm a small amount between palms and press gently into face and neck each evening.",
    ingredients: "Aqua, Butyrospermum Parkii Butter, Oenothera Biennis Oil, Ceramide NP, Glycerin, Squalane, Lavandula Angustifolia Oil.",
    delivery: "Free standard shipping on orders over $50. Express shipping available at checkout."
  },
  {
    id: "renewal-oil",
    name: "Renewal Oil",
    tagline: "Nourish deeply, glow eternally",
    description: "Nourishing facial oil blend",
    price: 72,
    originalPrice: null,
    image: "/images/products/amber-dropper-bottles.png",
    badge: "New",
    category: "oil",
    baseMatchScore: 80,
    defaultMatchReason: "Cold-pressed rosehip & marula oils boost radiance and soften dry surface patches.",
    targetConcerns: ["dehydration", "hyperpigmentation"],
    bestUndertones: ["Warm", "Neutral", "Cool", "Olive"],
    sizes: ["30ml", "50ml"],
    details: "Renewal Oil combines argan, rosehip, and marula oils with vitamin E for intensive overnight nourishment.",
    howToUse: "Apply 4-6 drops to palms and press gently onto face and neck as the final step of your evening routine.",
    ingredients: "Argania Spinosa Kernel Oil, Rosa Canina Seed Oil, Sclerocarya Birrea Seed Oil, Tocopherol, Rosa Damascena Flower Oil.",
    delivery: "Free standard shipping on orders over $50. Express shipping available at checkout."
  },
  {
    id: "rosehip-oil",
    name: "Rosehip Oil",
    tagline: "Pure organic rosehip extract",
    description: "Pure organic rosehip extract",
    price: 48,
    originalPrice: null,
    image: "/images/products/serum-bottles-1.png",
    badge: null,
    category: "oil",
    baseMatchScore: 78,
    defaultMatchReason: "Natural trans-retinoic acid gently fades post-blemish marks and evens complexion.",
    targetConcerns: ["hyperpigmentation", "texture"],
    bestUndertones: ["Warm", "Neutral", "Cool", "Olive"],
    sizes: ["30ml"],
    details: "100% cold-pressed organic Rosa Canina seed oil rich in essential fatty acids Omega-3, 6, and 9.",
    howToUse: "Press 2-3 drops into damp skin after water-based serums.",
    ingredients: "100% Organic Rosa Canina (Rosehip) Seed Oil.",
    delivery: "Free standard shipping on orders over $50. Express shipping available at checkout."
  },
  {
    id: "jojoba-oil",
    name: "Jojoba Oil",
    tagline: "Biomimetic sebum balance",
    description: "Balancing & lightweight",
    price: 42,
    originalPrice: null,
    image: "/images/products/spray-bottles.png",
    badge: null,
    category: "oil",
    baseMatchScore: 76,
    defaultMatchReason: "Mimics natural skin lipids to regulate T-zone shine without clogging pores.",
    targetConcerns: ["texture"],
    bestUndertones: ["Warm", "Neutral", "Cool", "Olive"],
    sizes: ["30ml", "50ml"],
    details: "Golden cold-pressed jojoba liquid wax ester that harmonizes oil production for combination skin.",
    howToUse: "Apply 2-3 drops alone or mixed into your daily Hydra Cream.",
    ingredients: "100% Pure Simmondsia Chinensis (Jojoba) Seed Oil.",
    delivery: "Free standard shipping on orders over $50. Express shipping available at checkout."
  },
  {
    id: "argan-oil",
    name: "Argan Oil",
    tagline: "Moroccan beauty elixir",
    description: "Moroccan beauty elixir",
    price: 56,
    originalPrice: null,
    image: "/images/products/pump-bottles-cream.png",
    badge: "Bestseller",
    category: "oil",
    baseMatchScore: 74,
    defaultMatchReason: "Vitamin E & squalene lock in luminosity and can be mixed 1:1 with Skin Tint for extra dew.",
    targetConcerns: ["dehydration"],
    bestUndertones: ["Warm", "Neutral", "Cool", "Olive"],
    sizes: ["30ml", "50ml"],
    details: "Ethically harvested Moroccan Argania Spinosa kernel oil that deeply conditions skin and adds a lit-from-within sheen.",
    howToUse: "Press 3 drops into face and neck or blend a single drop with Botanical Silk Skin Tint.",
    ingredients: "100% Organic Argania Spinosa (Argan) Kernel Oil.",
    delivery: "Free standard shipping on orders over $50. Express shipping available at checkout."
  },
]

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// In-memory caches by image hash so the same photo never costs units twice
const skinAnalysisCache = new Map<string, SkinAnalysisResult>()
const toneAnalysisCache = new Map<string, ToneAnalysisResult>()

export function getImageHash(file?: File | string | null): string {
  if (!file) return "default-seed"
  if (typeof file === "string") return file
  return `${file.name}-${file.size}-${(file as any).lastModified || 0}`
}

async function callServerRoute<T>(
  endpoint: string,
  file?: File | string | null,
  timeoutMs: number = 25000
): Promise<T | null> {
  if (typeof window === "undefined") {
    return null
  }

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

  try {
    let body: FormData | string
    const headers: Record<string, string> = {}

    if (file && typeof file === "object" && "arrayBuffer" in file) {
      const formData = new FormData()
      formData.append("file", file)
      body = formData
    } else {
      headers["Content-Type"] = "application/json"
      body = JSON.stringify({ image: file || "/images/bento-skin-model.jpg" })
    }

    const res = await fetch(endpoint, {
      method: "POST",
      headers,
      body,
      signal: controller.signal,
    })

    if (!res.ok) {
      return null
    }

    const json = await res.json()
    if (json?.success && json?.data) {
      return json.data as T
    }
    return null
  } catch {
    return null
  } finally {
    clearTimeout(timeoutId)
  }
}

// Deterministic hash helper from file name or string seed
function getSeedFromInput(file?: File | string | null): number {
  if (!file) return 6
  const str = typeof file === "string" ? file : `${file.name}-${file.size}`
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) % 1000
  }
  return hash
}

function generateMockSkinAnalysis(file?: File | string | null): SkinAnalysisResult {
  const seed = getSeedFromInput(file)
  const skinTypes = [
    {
      type: "Combination-Radiant",
      summary: "Balanced T-zone sebum with mild micro-dehydration along cheekbones",
      hydration: 82,
      barrier: 88,
      radiance: 86,
    },
    {
      type: "Normal-to-Dry",
      summary: "Delicate lipid barrier that thrives on multi-weight hyaluronic hydration",
      hydration: 74,
      barrier: 84,
      radiance: 81,
    },
    {
      type: "Combination-Balanced",
      summary: "Resilient epidermal texture with localized UV pigment clustering",
      hydration: 85,
      barrier: 91,
      radiance: 89,
    },
  ]
  const picked = skinTypes[seed % skinTypes.length]

  return {
    skinType: picked.type,
    skinTypeSummary: picked.summary,
    hydrationLevel: picked.hydration,
    barrierScore: picked.barrier,
    radianceIndex: picked.radiance,
    topConcerns: [
      {
        id: "hyperpigmentation",
        name: "Uneven Tone & Sun Spots",
        score: 84,
        severity: "Moderate",
        zone: "Cheekbones & Upper Bridge",
        description: "Localized melanin clustering detected; responds strongly to Vitamin C & non-nano mineral SPF.",
        recommendedActives: ["15% Vitamin C", "Niacinamide", "Rosehip Oil"],
      },
      {
        id: "dehydration",
        name: "Fine Dehydration Lines",
        score: 72,
        severity: "Mild",
        zone: "Under-Eye & Outer Cheek",
        description: "Surface moisture depletion creating subtle creasing under concealer; needs hyaluronic acid.",
        recommendedActives: ["Hyaluronic Acid", "Squalane", "Plant Ceramides"],
      },
      {
        id: "texture",
        name: "Pore & Surface Texture",
        score: 61,
        severity: "Mild",
        zone: "Center T-Zone & Nasal Ala",
        description: "Mild sebum congestion around pores; lightweight botanical esters keep finish smooth.",
        recommendedActives: ["Niacinamide", "Jojoba Ester", "Bakuchiol"],
      },
    ],
    analyzedAt: new Date().toISOString(),
    isDemoData: true,
  }
}

/**
 * Calls Next.js YouCam Skin API route first with 25s polling timeout.
 * Caches results in memory by image hash.
 * On any error, falls back to the existing mock data without breaking the UI.
 */
export async function analyzeSkin(file?: File | string | null): Promise<SkinAnalysisResult> {
  const hashKey = getImageHash(file)
  if (skinAnalysisCache.has(hashKey)) {
    return skinAnalysisCache.get(hashKey)!
  }

  try {
    const liveResult = await callServerRoute<SkinAnalysisResult>("/api/skin", file, 25000)
    if (liveResult) {
      skinAnalysisCache.set(hashKey, liveResult)
      appendRealScanToRetailer({ skinResult: liveResult })
      return liveResult
    }
  } catch {
    // Graceful fallback to mock data
  }

  await delay(400)
  const fallback = generateMockSkinAnalysis(file)
  skinAnalysisCache.set(hashKey, fallback)
  return fallback
}

function generateMockToneAnalysis(file?: File | string | null): ToneAnalysisResult {
  // Check if a specific swatch ID was passed as a preset string
  let swatchIndex = 6 // Default: 320W Golden Honey
  if (typeof file === "string") {
    const foundIdx = SKIN_TONE_SPECTRUM.findIndex(
      (s) => s.id === file || s.code === file || file.includes(s.code)
    )
    if (foundIdx !== -1) {
      swatchIndex = foundIdx
    }
  }

  const matched = SKIN_TONE_SPECTRUM[swatchIndex] || SKIN_TONE_SPECTRUM[6]
  const prevSwatch = SKIN_TONE_SPECTRUM[Math.max(0, swatchIndex - 1)]
  const nextSwatch = SKIN_TONE_SPECTRUM[Math.min(SKIN_TONE_SPECTRUM.length - 1, swatchIndex + 1)]

  const breakdownMap: Record<SkinToneSwatch["undertone"], { warm: number; neutral: number; cool: number; subtitle: string }> = {
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

  const breakdown = breakdownMap[matched.undertone]
  const spectrumPosition = Math.round(((swatchIndex + 0.5) / SKIN_TONE_SPECTRUM.length) * 100)
  const melaninIndex = Number((22 + swatchIndex * 5.4).toFixed(1))

  return {
    skinTone: matched.name,
    shadeCode: matched.code,
    hex: matched.hex,
    fitzpatrick: matched.fitzpatrick,
    undertone: matched.undertone,
    undertoneSubtitle: breakdown.subtitle,
    undertoneBreakdown: {
      warm: breakdown.warm,
      neutral: breakdown.neutral,
      cool: breakdown.cool,
    },
    melaninIndex,
    spectrumPosition,
    adjacentShades: [prevSwatch, matched, nextSwatch],
    isDemoData: true,
  }
}

/**
 * Calls Next.js YouCam Tone API route first with 25s polling timeout.
 * Caches results in memory by image hash.
 * On any error, falls back to the existing mock data without breaking the UI.
 */
export async function analyzeTone(file?: File | string | null): Promise<ToneAnalysisResult> {
  const hashKey = getImageHash(file)
  if (toneAnalysisCache.has(hashKey)) {
    return toneAnalysisCache.get(hashKey)!
  }

  try {
    const liveResult = await callServerRoute<ToneAnalysisResult>("/api/tone", file, 25000)
    if (liveResult) {
      toneAnalysisCache.set(hashKey, liveResult)
      appendRealScanToRetailer({ toneResult: liveResult })
      return liveResult
    }
  } catch {
    // Graceful fallback to mock data
  }

  await delay(400)
  const fallback = generateMockToneAnalysis(file)
  toneAnalysisCache.set(hashKey, fallback)
  return fallback
}

/**
 * Simulates YouCam eCommerce Virtual Try-On (VTO) API
 * Never throws raw errors; returns realistic try-on preview config for the uploaded photo.
 */
export async function tryOn(
  file: File | string | null,
  productId: string,
  customToneHex?: string
): Promise<TryOnResult> {
  try {
    await delay(350)
    const product = SHADEMATCH_PRODUCTS.find((p) => p.id === productId) || SHADEMATCH_PRODUCTS[0]
    const photoUrl =
      typeof file === "string" && file.length > 0 && !file.startsWith("tone-")
        ? file
        : "/images/bento-skin-model.jpg"

    const isMakeup = Boolean(product.isMakeupShade)
    const overlayHex = customToneHex || product.shadeHex || "#B67E52"

    return {
      productId: product.id,
      beforeImageUrl: photoUrl,
      afterImageUrl: photoUrl,
      overlayHex,
      overlayOpacity: isMakeup ? 0.28 : 0.14,
      warmthShift: isMakeup ? 1.08 : 1.04,
      smoothingLevel: isMakeup ? 1.15 : 1.1,
      radianceBoost: isMakeup ? 1.07 : 1.12,
      effectType: isMakeup ? "makeup-shade" : "skincare-glow",
      shadeLabel: isMakeup
        ? `${product.name} — ${product.shadeCode || "320W Golden Honey"}`
        : `${product.name} — Botanical Radiance Preview`,
      confidenceScore: product.baseMatchScore,
      disclaimer: "Visual preview, not a guarantee.",
      isDemoData: true,
    }
  } catch {
    return {
      productId,
      beforeImageUrl: "/images/bento-skin-model.jpg",
      afterImageUrl: "/images/bento-skin-model.jpg",
      overlayHex: "#B67E52",
      overlayOpacity: 0.24,
      warmthShift: 1.06,
      smoothingLevel: 1.1,
      radianceBoost: 1.08,
      effectType: "makeup-shade",
      shadeLabel: "ShadeMatch Calibrated Preview",
      confidenceScore: 95,
      disclaimer: "Visual preview, not a guarantee.",
      isDemoData: true,
    }
  }
}

/**
 * Ranks all products by Match Score (0-100) with a personalized one-line reason per product.
 */
export function getRankedProducts(
  skinResult?: SkinAnalysisResult | null,
  toneResult?: ToneAnalysisResult | null
): RankedProduct[] {
  const toneName = toneResult?.skinTone || "Golden Honey"
  const shadeCode = toneResult?.shadeCode || "320W"
  const undertone = toneResult?.undertone || "Warm"
  const skinType = skinResult?.skinType || "Combination-Radiant"

  return SHADEMATCH_PRODUCTS.map((product) => {
    let score = product.baseMatchScore
    let reason = product.defaultMatchReason

    if (product.id === "silk-skin-tint") {
      score = 98
      reason = `Exact pigment match for ${shadeCode} ${toneName} (${undertone} undertone) with breathable hydration.`
    } else if (product.id === "radiance-serum") {
      score = 96
      reason = `15% Vitamin C targets your #1 scan concern (Uneven Tone) while boosting ${toneName} luminosity.`
    } else if (product.id === "velvet-mineral-concealer") {
      score = 95
      reason = `Calibrated ${undertone.toLowerCase()} undertone brightens under-eye shadows without settling into fine lines.`
    } else if (product.id === "hydrating-serum") {
      score = 93
      reason = `Multi-weight hyaluronic acid resolves under-eye micro-dehydration for ${skinType} skin.`
    } else if (product.id === "botanical-lip-cheek-veil") {
      score = 92
      reason = `Warm terracotta-rose plant pigment harmonizes naturally with ${toneName} (${undertone}).`
    } else if (product.id === "glow-serum") {
      score = 90
      reason = `5% Niacinamide refines T-zone pore texture and supports even pigment across cheekbones.`
    } else if (product.id === "hydra-cream") {
      score = 89
      reason = `Silky squalane & hyaluronic barrier prep ensures streak-free wear under ${shadeCode} Skin Tint.`
    } else if (product.id === "day-cream-spf") {
      score = 88
      reason = `Zero-white-cast mineral SPF 30 protects ${toneName} skin from UV-triggered dark spots.`
    }

    return {
      ...product,
      shadeHex: product.id === "silk-skin-tint" && toneResult ? toneResult.hex : product.shadeHex,
      shadeCode:
        product.id === "silk-skin-tint" && toneResult
          ? `${toneResult.shadeCode} ${toneResult.skinTone}`
          : product.shadeCode,
      matchScore: Math.min(100, Math.max(0, score)),
      matchReason: reason,
      isDemoData: Boolean(skinResult?.isDemoData ?? toneResult?.isDemoData ?? true),
    }
  }).sort((a, b) => b.matchScore - a.matchScore)
}

// ============================================================================
// RETAILER DASHBOARD SEEDED MOCK DATA (200 SCANS)
// ============================================================================

export interface ToneDistributionItem {
  band: string
  shortLabel: string
  fitzpatrick: string
  hex: string
  scans: number
  percentage: number
  warmScans: number
  neutralScans: number
  coolOliveScans: number
  matchingProducts: number
  status: "Well Stocked" | "Moderate Coverage" | "Critical Gap"
}

export interface ConcernTelemetryItem {
  id: string
  name: string
  scans: number
  percentage: number
  growth: string
  matchingSkus: number
  topMatchedProduct: string
}

export interface CatalogGapItem {
  id: string
  title: string
  category: "Shade Gap" | "Concern & Tone Gap"
  swatchHex: string
  demandScans: number
  demandPercentage: number
  matchingProductsCount: number
  estimatedReturnRisk: string
  missedMonthlyRevenue: number
  recommendation: string
  suggestedSkuName: string
}

export interface RetailerDashboardData {
  totalScans: number
  dateRangeLabel: string
  estimatedReturnReductionPercent: number // e.g. 64% reduction in shade/fit returns
  baselineReturnRate: number
  projectedReturnRate: number
  estimatedAnnualSavings: number
  avgMatchScore: number
  toneDistribution: ToneDistributionItem[]
  topConcerns: ConcernTelemetryItem[]
  catalogGaps: CatalogGapItem[]
  isDemoData: boolean
}

export interface RecordedRealScan {
  skinResult?: SkinAnalysisResult | null
  toneResult?: ToneAnalysisResult | null
  timestamp: string
}

const recordedRealScans: RecordedRealScan[] = []

export function appendRealScanToRetailer(scan: {
  skinResult?: SkinAnalysisResult | null
  toneResult?: ToneAnalysisResult | null
}) {
  recordedRealScans.push({
    ...scan,
    timestamp: new Date().toISOString(),
  })

  if (typeof window !== "undefined") {
    try {
      window.sessionStorage.setItem("shadematch_real_scans", JSON.stringify(recordedRealScans))
    } catch {}
    window.dispatchEvent(new CustomEvent("shadematch:scan-recorded", { detail: scan }))
  }
}

/**
 * Generates deterministic, seeded mock data for shopper scans,
 * dynamically augmented with every real scan executed during the session.
 */
export function getRetailerDashboardData(): RetailerDashboardData {
  if (typeof window !== "undefined") {
    try {
      const saved = window.sessionStorage.getItem("shadematch_real_scans")
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > recordedRealScans.length) {
          recordedRealScans.splice(0, recordedRealScans.length, ...parsed)
        }
      }
    } catch {}
  }

  // 6 Fitzpatrick / Skin-Tone bands summing to exactly 200 scans baseline:
  // 18 + 29 + 46 + 52 + 34 + 21 = 200 scans
  const toneDistribution: ToneDistributionItem[] = [
    {
      band: "Porcelain & Fair (100C–120N)",
      shortLabel: "Fair (I)",
      fitzpatrick: "Type I",
      hex: "#F2DEC9",
      scans: 18,
      percentage: 9.0,
      warmScans: 5,
      neutralScans: 7,
      coolOliveScans: 6,
      matchingProducts: 6,
      status: "Well Stocked",
    },
    {
      band: "Light Linen & Bisque (150W–210N)",
      shortLabel: "Light (II)",
      fitzpatrick: "Type II",
      hex: "#E2BE9F",
      scans: 29,
      percentage: 14.5,
      warmScans: 13,
      neutralScans: 10,
      coolOliveScans: 6,
      matchingProducts: 8,
      status: "Well Stocked",
    },
    {
      band: "Sunlit Beige & Almond (240O–280W)",
      shortLabel: "Medium (III)",
      fitzpatrick: "Type III",
      hex: "#CD9871",
      scans: 46,
      percentage: 23.0,
      warmScans: 21,
      neutralScans: 11,
      coolOliveScans: 14,
      matchingProducts: 4,
      status: "Moderate Coverage",
    },
    {
      band: "Golden Honey & Caramel (320W–360O)",
      shortLabel: "Tan-Deep (IV)",
      fitzpatrick: "Type IV",
      hex: "#B67E52",
      scans: 52,
      percentage: 26.0,
      warmScans: 28,
      neutralScans: 9,
      coolOliveScans: 15,
      matchingProducts: 2,
      status: "Critical Gap",
    },
    {
      band: "Rich Amber & Chestnut (410W–450N)",
      shortLabel: "Deep (V)",
      fitzpatrick: "Type V",
      hex: "#844D2C",
      scans: 34,
      percentage: 17.0,
      warmScans: 19,
      neutralScans: 9,
      coolOliveScans: 6,
      matchingProducts: 1,
      status: "Critical Gap",
    },
    {
      band: "Mahogany & Espresso (510W–560C)",
      shortLabel: "Rich Deep (VI)",
      fitzpatrick: "Type VI",
      hex: "#4E2A18",
      scans: 21,
      percentage: 10.5,
      warmScans: 9,
      neutralScans: 5,
      coolOliveScans: 7,
      matchingProducts: 1,
      status: "Critical Gap",
    },
  ]

  // Top concerns baseline
  const topConcerns: ConcernTelemetryItem[] = [
    {
      id: "hyperpigmentation",
      name: "Uneven Tone & Hyperpigmentation",
      scans: 136,
      percentage: 68,
      growth: "+24% vs last mo",
      matchingSkus: 4,
      topMatchedProduct: "Radiance Serum",
    },
    {
      id: "dehydration",
      name: "Micro-Dehydration & Barrier Dryness",
      scans: 118,
      percentage: 59,
      growth: "+16% vs last mo",
      matchingSkus: 7,
      topMatchedProduct: "Hydrating Serum",
    },
    {
      id: "texture",
      name: "Pore Refinement & T-Zone Texture",
      scans: 88,
      percentage: 44,
      growth: "+11% vs last mo",
      matchingSkus: 4,
      topMatchedProduct: "Glow Serum",
    },
    {
      id: "white-cast-spf",
      name: "Zero-Cast UV Protection (Types IV–VI)",
      scans: 79,
      percentage: 39.5,
      growth: "+38% vs last mo",
      matchingSkus: 1,
      topMatchedProduct: "Day Cream SPF 30",
    },
    {
      id: "redness",
      name: "Sensitivity & Barrier Redness",
      scans: 54,
      percentage: 27,
      growth: "+6% vs last mo",
      matchingSkus: 3,
      topMatchedProduct: "Gentle Cleanser",
    },
  ]

  // Incorporate real scans
  let totalScans = 200 + recordedRealScans.length
  const hasRealScans = recordedRealScans.length > 0

  for (const scan of recordedRealScans) {
    if (scan.toneResult) {
      const fitz = scan.toneResult.fitzpatrick || ""
      const shade = scan.toneResult.shadeCode || ""
      let bandIndex = 3 // default: IV

      if (fitz.includes("I") && !fitz.includes("II") && !fitz.includes("IV") && !fitz.includes("V")) {
        bandIndex = 0
      } else if (fitz.includes("II") && !fitz.includes("III")) {
        bandIndex = 1
      } else if (fitz.includes("III")) {
        bandIndex = 2
      } else if (fitz.includes("IV")) {
        bandIndex = 3
      } else if (fitz.includes("VI")) {
        bandIndex = 5
      } else if (fitz.includes("V")) {
        bandIndex = 4
      } else if (shade.startsWith("100") || shade.startsWith("120")) {
        bandIndex = 0
      } else if (shade.startsWith("150") || shade.startsWith("210")) {
        bandIndex = 1
      } else if (shade.startsWith("240") || shade.startsWith("280")) {
        bandIndex = 2
      } else if (shade.startsWith("320") || shade.startsWith("360")) {
        bandIndex = 3
      } else if (shade.startsWith("410") || shade.startsWith("450")) {
        bandIndex = 4
      } else if (shade.startsWith("510") || shade.startsWith("560")) {
        bandIndex = 5
      }

      toneDistribution[bandIndex].scans += 1
      const undertone = scan.toneResult.undertone
      if (undertone === "Warm") {
        toneDistribution[bandIndex].warmScans += 1
      } else if (undertone === "Neutral") {
        toneDistribution[bandIndex].neutralScans += 1
      } else {
        toneDistribution[bandIndex].coolOliveScans += 1
      }
    }

    if (scan.skinResult?.topConcerns) {
      for (const concern of scan.skinResult.topConcerns) {
        const found = topConcerns.find(
          (c) => c.id === concern.id || c.name.toLowerCase().includes(concern.name.toLowerCase())
        )
        if (found) {
          found.scans += 1
        }
      }
    }
  }

  // Recalculate percentages
  toneDistribution.forEach((band) => {
    band.percentage = Number(((band.scans / totalScans) * 100).toFixed(1))
  })
  topConcerns.forEach((concern) => {
    concern.percentage = Number(((concern.scans / totalScans) * 100).toFixed(1))
  })

  // Catalog Gap Report listing high-demand tones/concerns with few matching products
  const catalogGaps: CatalogGapItem[] = [
    {
      id: "gap-golden-olive",
      title: "Golden Honey & Olive Undertones (320W–360O)",
      category: "Shade Gap",
      swatchHex: "#B67E52",
      demandScans: 52 + (toneDistribution[3].scans - 52),
      demandPercentage: toneDistribution[3].percentage,
      matchingProductsCount: 2,
      estimatedReturnRisk: "31% return rate from warm/olive oxidation",
      missedMonthlyRevenue: 14800,
      recommendation: "Expand Botanical Silk Skin Tint & Concealer with dedicated 340O & 360O Olive-Gold shades.",
      suggestedSkuName: "Silk Skin Tint — 340O Warm Olive & 360O Caramel",
    },
    {
      id: "gap-deep-amber",
      title: "Deep Amber to Espresso Shades (410W–560C)",
      category: "Shade Gap",
      swatchHex: "#764326",
      demandScans: 55 + (toneDistribution[4].scans + toneDistribution[5].scans - 55),
      demandPercentage: Number((toneDistribution[4].percentage + toneDistribution[5].percentage).toFixed(1)),
      matchingProductsCount: 1,
      estimatedReturnRisk: "36% return rate due to limited intermediate undertones",
      missedMonthlyRevenue: 18400,
      recommendation: "Add 4 intermediate deep shades (430N, 480W, 530N, 560C) with red-gold subsurface balance.",
      suggestedSkuName: "Velvet Concealer & Skin Tint — Deep Atelier Capsule (4 SKUs)",
    },
    {
      id: "gap-tinted-spf-melanin",
      title: "Melanin-Safe Tinted Mineral SPF (Types IV–VI + Hyperpigmentation)",
      category: "Concern & Tone Gap",
      swatchHex: "#8E5531",
      demandScans: topConcerns[3].scans,
      demandPercentage: topConcerns[3].percentage,
      matchingProductsCount: 1,
      estimatedReturnRisk: "24% cart abandonment on untinted mineral sunscreens",
      missedMonthlyRevenue: 12200,
      recommendation: "Formulate sheer bronze-infused Day Cream SPF 30 variant to eliminate cast on deeper tones.",
      suggestedSkuName: "Day Cream SPF 30 — Golden & Deep Sheer Tint",
    },
    {
      id: "gap-cool-deep-lip",
      title: "Rich Berry & Espresso Lip/Cheek Pigments",
      category: "Concern & Tone Gap",
      swatchHex: "#5C321C",
      demandScans: 38,
      demandPercentage: 19.0,
      matchingProductsCount: 1,
      estimatedReturnRisk: "19% return rate from pale/ashy payoff on Type V–VI skin",
      missedMonthlyRevenue: 7600,
      recommendation: "Introduce high-pigment Spiced Fig & Espresso Rose shades to Botanical Lip & Cheek Veil.",
      suggestedSkuName: "Botanical Lip & Cheek Veil — High-Pigment Deep Duo",
    },
  ]

  return {
    totalScans,
    dateRangeLabel: hasRealScans
      ? `Live Cohort • ${totalScans} Biometric Scans (${recordedRealScans.length} Live YouCam Scans Appended)`
      : "Seeded Cohort • 200 Biometric Scans",
    estimatedReturnReductionPercent: 64,
    baselineReturnRate: 28.4,
    projectedReturnRate: 10.2,
    estimatedAnnualSavings: 48600,
    avgMatchScore: 93.4,
    toneDistribution,
    topConcerns,
    catalogGaps,
    isDemoData: !hasRealScans,
  }
}
