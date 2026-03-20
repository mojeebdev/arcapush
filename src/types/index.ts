
export type StartupTier = "FREE" | "PINNED";


export interface Startup {
  id:               string;
  slug:             string | null;
  categorySlug?:    string;          
  name:             string;
  tagline:          string;
  problemStatement: string;
  category:         string;
  website:          string | null;
  twitter:          string | null;
  bannerUrl:        string;
  logoUrl:          string | null;
  ogImage:          string | null;
  faviconUrl:       string | null;
  scrapedAt:        string | Date | null;
  pitchDeckUrl:     string | null;
  founderName:      string;
  founderEmail:     string;
  founderLinkedIn:  string | null;
  founderTwitter:   string | null;
  tier:             StartupTier;
  pinnedAt:         string | Date | null;
  pinnedUntil:      string | Date | null;
  pinTxHash:        string | null;
  pinChain:         string | null;
  founderId:        string | null;
  viewCount:        number;
  approved:         boolean;
  metaTitle:        string | null;
  metaDescription:  string | null;
  canonicalUrl:     string | null;
  createdAt:        string | Date;
  updatedAt:        string | Date;
}


export interface StartupCardData {
  id:               string;
  slug:             string | null;
  categorySlug?:    string | null;
  name:             string;
  tagline:          string;
  problemStatement: string;
  bannerUrl:        string;
  logoUrl:          string | null;
  ogImage?:         string | null;
  faviconUrl?:      string | null;
  category:         string;
  website:          string | null;
  twitter:          string | null;
  viewCount:        number;
  scrapedAt?:       string | Date | null;
  tier?:            StartupTier;
  pinnedAt?:        string | Date | null;
  pinnedUntil?:     string | Date | null;
  createdAt?:       string | Date;
}



export interface SiteStats {
  totalCount: string;
  vcVisits:   string;
  ecosystems: string;
}


export function categoryToSlug(category: string): string {
  return category.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}


export function buildStartupUrl(
  startup: Pick<StartupCardData, "id" | "slug" | "categorySlug" | "category">
): string {
  const cat  = startup.categorySlug
    ?? categoryToSlug(startup.category);
  const path = startup.slug ?? startup.id;
  return `/startup/${cat}/${path}`;
}