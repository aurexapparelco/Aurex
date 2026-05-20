import { createClient } from "@/lib/supabase/server";

export interface HeroContent {
  visible: boolean;
  eyebrow: string;
  headline: string;
  headlineAccent: string;
  subtext: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  imageUrl: string;
  locationTagline: string;
  heroProductId: string;
}

export interface FeatureItem {
  icon: string;      // emoji/character fallback
  iconUrl: string;   // PNG upload URL (used when set)
  label: string;
  subtitle: string;
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
    imageUrl: "",
    locationTagline: "Cut & sewn in Colombo",
    heroProductId: "",
  },
  featureStrip: {
    visible: true,
    features: [
      { icon: "◈", iconUrl: "", label: "Thoughtfully Crafted", subtitle: "Carefully designed with attention to fit, comfort, and long-term wearability." },
      { icon: "✦", iconUrl: "", label: "Designed for Everyday Wear", subtitle: "Refined essentials made to move naturally through everyday life." },
      { icon: "⊹", iconUrl: "", label: "Minimal by Intention", subtitle: "Timeless design without excessive branding or trend-driven styling." },
      { icon: "◻", iconUrl: "", label: "Crafted in Sri Lanka", subtitle: "Carefully produced with a focus on quality, detail, and modern craftsmanship." },
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
