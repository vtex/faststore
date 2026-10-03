export interface LlmsLink {
  name: string
  url: string
  description?: string
}

export interface LlmsCustomSection {
  title: string
  items: LlmsLink[]
}

export interface LlmsCustomPage {
  title: string
  slug: string
  body: string
}

export interface LlmsSourcesConfig {
  categories?: { enabled?: boolean; limit?: number }
  contentTypes?: string[]
  slugAllowList?: string[]
  slugDenyList?: string[]
  textSectionNames?: string[]
}

export interface LlmsConfig {
  enabled: boolean
  title: string
  tagline?: string
  about?: string
  contact?: {
    email?: string
    url?: string
  }
  customSections?: LlmsCustomSection[]
  customPages?: LlmsCustomPage[]
  institutionalSlugs?: string[]
  sources?: LlmsSourcesConfig
  maxLinksPerSection?: number
}

export interface LlmsPage {
  slug: string
  title: string
  description?: string
  sections?: Array<{ name: string; data: unknown }>
}

export interface LlmsSources {
  storeUrl: string
  categories: LlmsLink[]
  institutional: LlmsLink[]
  faq: LlmsLink[]
  pages: LlmsPage[]
}
