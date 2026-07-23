export interface ByLinkIdCategoryResponse {
  id: number
  fatherCategoryId: number | null
  name: string
  linkId: string
  title: string | null
  description: string | null
  /**
   * Optional SEO meta description. pagetype.metaTagDescription
   * was backed by the same source as `description`; prefer `description` for
   * parity when this field is absent.
   */
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
  /**
   * Optional SEO meta description. Catalog confirmed pagetype.metaTagDescription
   * was backed by the same source as `description`; prefer `description` for
   * parity when this field is absent.
   */
  metaTagDescription: string | null
  availableLinkIds: Record<string, string> | null
}

export interface ByLinkIdCollectionResponse {
  id: number
  name: string
  linkId: string | null
  title: string | null
  description: string | null
  /**
   * Optional SEO meta description. pagetype.metaTagDescription
   * was backed by the same source as `description`; prefer `description` for
   * parity when this field is absent.
   */
  metaTagDescription: string | null
  availableLinkIds: Record<string, string> | null
}
