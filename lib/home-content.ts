import { createClient } from "@/lib/supabase/server";

export interface HeroStat {
  value: string;
  unit: string;
  label: string;
}

export interface HeroContent {
  visible: boolean;
  eyebrow: string;
  headline: string;
  headlineAccent: string;
  subtext: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  stats: HeroStat[];
  imageUrl: string;
}

export interface FeatureItem {
  icon: string;
  label: string;
}

export interface FeatureStripContent {
  visible: boolean;
  features: FeatureItem[];
}

export interface CollectionCard {
  overline: string;
  heading: string;
  description: string;
  cta: string;
  href: string;
}

export interface CollectionCardsContent {
  visible: boolean;
  cards: CollectionCard[];
}

export interface HomeContent {
  hero: HeroContent;
  featureStrip: FeatureStripContent;
  collectionCards: CollectionCardsContent;
}

const DEFAULTS: HomeContent = {
  hero: {
    visible: true,
    eyebrow: "Precision Crafted",
    headline: "Essentials,",
    headlineAccent: "Elevated.",
    subtext:
      "Premium-grade tees engineered for Sri Lanka's climate. 200GSM supima cotton, tailored silhouettes.",
    primaryCta: { label: "Shop Collection", href: "/shop" },
    secondaryCta: { label: "Premium Collection", href: "/shop?type=Premium" },
    stats: [
      { value: "200", unit: "GSM", label: "Premium Cotton" },
      { value: "5", unit: "Colors", label: "Per Drop" },
      { value: "100%", unit: "LK", label: "Made in Sri Lanka" },
    ],
    imageUrl: "",
  },
  featureStrip: {
    visible: true,
    features: [
      { icon: "✦", label: "Premium 200GSM Supima" },
      { icon: "◈", label: "Structured Tailored Fit" },
      { icon: "⊹", label: "Free Returns · 30 Days" },
      { icon: "◻", label: "Made in Sri Lanka" },
    ],
  },
  collectionCards: {
    visible: true,
    cards: [
      {
        overline: "Collection 01",
        heading: "Plain Essentials",
        description:
          "Refined basics in signature colours. The foundation of every wardrobe.",
        cta: "Explore →",
        href: "/shop?type=Plain",
      },
      {
        overline: "Collection 02",
        heading: "Premium Collection",
        description:
          "Elevated fabrication with structured details. Crafted for distinction.",
        cta: "Explore →",
        href: "/shop?type=Premium",
      },
    ],
  },
};

export async function getHomeContent(): Promise<HomeContent> {
  const supabase = await createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (supabase as unknown as any)
    .from("home_content")
    .select("hero, feature_strip, collection_cards")
    .single();

  if (!data) return DEFAULTS;

  return {
    hero: { ...DEFAULTS.hero, ...(data.hero as Partial<HeroContent>) },
    featureStrip: {
      ...DEFAULTS.featureStrip,
      ...(data.feature_strip as Partial<FeatureStripContent>),
    },
    collectionCards: {
      ...DEFAULTS.collectionCards,
      ...(data.collection_cards as Partial<CollectionCardsContent>),
    },
  };
}
