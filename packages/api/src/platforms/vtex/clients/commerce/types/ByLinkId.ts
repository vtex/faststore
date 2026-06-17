export interface ByLinkIdCategoryResponse {
  id: number
  fatherCategoryId: number | null
  name: string
  linkId: string
  title: string | null
  description: string | null
  /** SEO meta description — equivalent to pagetype.metaTagDescription. TODO: to be added by Catalog team. */
  metaTagDescription: string | null
  /** Localized linkIds keyed by locale. Null when no multilanguage entries are registered. */
  availableLinkIds: Record<string, string> | null
}

export interface ByLinkIdBrandResponse {
  id: number
  name: string
  linkId: string
  title: string | null
  description: string | null
  /** SEO meta description — equivalent to pagetype.metaTagDescription. TODO: to be added by Catalog team. */
  metaTagDescription: string | null
  availableLinkIds: Record<string, string> | null
}

export interface ByLinkIdCollectionResponse {
  id: number
  name: string
  linkId: string | null
  title: string | null
  description: string | null
  /** SEO meta description — equivalent to pagetype.metaTagDescription. TODO: to be added by Catalog team. */
  metaTagDescription: string | null
  availableLinkIds: Record<string, string> | null
}
