export type Product = {
  id: string;
  name: string;
  brand: string;
  category: "Electronics" | "Home";
  subcategory: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
  deal?: boolean;
  featured?: boolean;
  image: string;
  blurb: string;
  /** Paste the Amazon Associates link here for a tracked outbound click. */
  affiliateUrl?: string;
};

export const products: Product[] = [
  {
    id: "aurora-14-ultrabook",
    name: "Aurora 14 Ultrabook",
    brand: "Aurora",
    category: "Electronics",
    subcategory: "Ultrabooks",
    price: 1299,
    oldPrice: 1499,
    rating: 4.8,
    reviews: 1284,
    deal: true,
    featured: true,
    image:
      "https://images.unsplash.com/photo-1636115305669-9096bffe87fd?crop=entropy&cs=srgb&fm=jpg&q=90&w=1600",
    blurb: "Featherweight aluminium body, 18-hour battery and a display that earns its keep.",
  },
  {
    id: "halo-anc-headphones",
    name: "Halo ANC Headphones",
    brand: "Halo",
    category: "Electronics",
    subcategory: "Noise-cancelling audio",
    price: 279,
    oldPrice: 349,
    rating: 4.7,
    reviews: 3120,
    deal: true,
    featured: true,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?crop=entropy&cs=srgb&fm=jpg&q=85&w=1400",
    blurb: "Deep, even noise cancellation with a tuning that never gets tiring.",
  },
  {
    id: "lumen-mirrorless-c9",
    name: "Lumen Mirrorless C9",
    brand: "Lumen",
    category: "Electronics",
    subcategory: "4K cameras",
    price: 899,
    rating: 4.6,
    reviews: 642,
    featured: true,
    image:
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?crop=entropy&cs=srgb&fm=jpg&q=85&w=1400",
    blurb: "Compact 4K body with the kind of colour science you stop editing around.",
  },
  {
    id: "pulse-fit-watch",
    name: "Pulse Fit Watch",
    brand: "Pulse",
    category: "Electronics",
    subcategory: "Wearables",
    price: 199,
    oldPrice: 249,
    rating: 4.5,
    reviews: 2210,
    deal: true,
    featured: true,
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?crop=entropy&cs=srgb&fm=jpg&q=85&w=1400",
    blurb: "Sleep, strain and steps — tracked quietly, charged weekly.",
  },
  {
    id: "echo-buds-mini",
    name: "Echo Buds Mini",
    brand: "Echo",
    category: "Electronics",
    subcategory: "Noise-cancelling audio",
    price: 129,
    rating: 4.4,
    reviews: 1870,
    image:
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?crop=entropy&cs=srgb&fm=jpg&q=85&w=1400",
    blurb: "Pocketable buds with surprisingly grown-up bass and a 30-hour case.",
  },
  {
    id: "nimbus-tablet-11",
    name: "Nimbus Tablet 11",
    brand: "Nimbus",
    category: "Electronics",
    subcategory: "Ultrabooks",
    price: 549,
    rating: 4.6,
    reviews: 980,
    image:
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?crop=entropy&cs=srgb&fm=jpg&q=85&w=1400",
    blurb: "The couch computer: laminated screen, stylus support, all-day battery.",
  },
  {
    id: "vega-action-cam",
    name: "Vega Action Cam",
    brand: "Vega",
    category: "Electronics",
    subcategory: "4K cameras",
    price: 329,
    oldPrice: 379,
    rating: 4.5,
    reviews: 745,
    deal: true,
    image:
      "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?crop=entropy&cs=srgb&fm=jpg&q=85&w=1400",
    blurb: "Stabilised 4K60 in a body you can genuinely throw in a bag.",
  },
  {
    id: "sonar-desk-speaker",
    name: "Sonar Desk Speaker",
    brand: "Sonar",
    category: "Electronics",
    subcategory: "Noise-cancelling audio",
    price: 189,
    rating: 4.7,
    reviews: 512,
    image:
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?crop=entropy&cs=srgb&fm=jpg&q=85&w=1400",
    blurb: "A small speaker that fills a room without shouting about it.",
  },
  {
    id: "orbit-smart-hub",
    name: "Orbit Smart Hub",
    brand: "Orbit",
    category: "Electronics",
    subcategory: "Smart home",
    price: 149,
    rating: 4.3,
    reviews: 430,
    image:
      "https://images.unsplash.com/photo-1558089687-f282ffcbc126?crop=entropy&cs=srgb&fm=jpg&q=85&w=1400",
    blurb: "One hub, every protocol — the tidy way to end app sprawl.",
  },
  {
    id: "atlas-power-bank",
    name: "Atlas 20K Power Bank",
    brand: "Atlas",
    category: "Electronics",
    subcategory: "Wearables",
    price: 79,
    oldPrice: 99,
    rating: 4.6,
    reviews: 1610,
    deal: true,
    image:
      "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?crop=entropy&cs=srgb&fm=jpg&q=85&w=1400",
    blurb: "100W out, 20,000mAh in. Charges the laptop, not just the phone.",
  },
  {
    id: "crema-espresso-pro",
    name: "Crema Espresso Pro",
    brand: "Crema",
    category: "Home",
    subcategory: "Espresso & coffee",
    price: 649,
    oldPrice: 749,
    rating: 4.8,
    reviews: 892,
    deal: true,
    featured: true,
    image:
      "https://images.unsplash.com/photo-1707241358597-bafcc8a8e73d?crop=entropy&cs=srgb&fm=jpg&q=85&w=1400",
    blurb: "Dual boiler, PID control, café shots on a Tuesday morning.",
  },
  {
    id: "grind-burr-mill",
    name: "Grind Burr Mill",
    brand: "Grind",
    category: "Home",
    subcategory: "Espresso & coffee",
    price: 229,
    rating: 4.7,
    reviews: 654,
    image:
      "https://images.unsplash.com/photo-1516224498413-84ecf3a1e7fd?crop=entropy&cs=srgb&fm=jpg&q=85&w=1400",
    blurb: "Stepless conical burrs — the single best upgrade to any setup.",
  },
  {
    id: "drift-cordless-vacuum",
    name: "Drift Cordless Vacuum",
    brand: "Drift",
    category: "Home",
    subcategory: "Cordless cleaning",
    price: 449,
    oldPrice: 529,
    rating: 4.6,
    reviews: 1340,
    deal: true,
    featured: true,
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?crop=entropy&cs=srgb&fm=jpg&q=85&w=1400",
    blurb: "60 minutes of real suction and a bin you can empty one-handed.",
  },
  {
    id: "glow-ambient-lamp",
    name: "Glow Ambient Lamp",
    brand: "Glow",
    category: "Home",
    subcategory: "Ambient lighting",
    price: 119,
    rating: 4.5,
    reviews: 380,
    featured: true,
    image:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?crop=entropy&cs=srgb&fm=jpg&q=85&w=1400",
    blurb: "Warm, dimmable light that makes a room look considered.",
  },
  {
    id: "hearth-air-purifier",
    name: "Hearth Air Purifier",
    brand: "Hearth",
    category: "Home",
    subcategory: "Cordless cleaning",
    price: 299,
    rating: 4.4,
    reviews: 522,
    image:
      "https://images.unsplash.com/photo-1585771724684-38269d6639fd?crop=entropy&cs=srgb&fm=jpg&q=85&w=1400",
    blurb: "HEPA filtration that's quiet enough to sleep beside.",
  },
  {
    id: "stone-cast-skillet",
    name: "Stone Cast Skillet",
    brand: "Stone",
    category: "Home",
    subcategory: "Kitchen",
    price: 89,
    rating: 4.9,
    reviews: 2410,
    image:
      "https://images.unsplash.com/photo-1556909212-d5b604d0c90d?crop=entropy&cs=srgb&fm=jpg&q=85&w=1400",
    blurb: "Pre-seasoned, oven-safe, and effectively immortal.",
  },
  {
    id: "linen-throw-set",
    name: "Linen Throw Set",
    brand: "Field",
    category: "Home",
    subcategory: "Ambient living",
    price: 139,
    oldPrice: 169,
    rating: 4.5,
    reviews: 298,
    deal: true,
    image:
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?crop=entropy&cs=srgb&fm=jpg&q=85&w=1400",
    blurb: "Stonewashed linen that gets better with every wash.",
  },
];

export const marqueeItems = [
  "Noise-cancelling audio",
  "4K cameras",
  "Smart home",
  "Espresso & coffee",
  "Ultrabooks",
  "Cordless cleaning",
  "Wearables",
  "Ambient lighting",
];
