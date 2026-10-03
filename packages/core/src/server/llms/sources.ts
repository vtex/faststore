import storeConfig from 'discovery.config'
import { contentService } from 'src/server/content/service'
import { execute } from 'src/server'

import type { LlmsLink, LlmsPage, LlmsSourcesConfig } from './types'

interface CollectionNode {
  id: string
  slug: string
  type: string
  seo?: { title?: string; description?: string }
  breadcrumbList?: {
    itemListElement: Array<{ item: string; name: string; position: number }>
  }
}

interface AllCollectionsResult {
  allCollections: {
    edges: Array<{ node: CollectionNode }>
  }
}

const ALL_COLLECTIONS_QUERY = `
  query LlmsAllCollectionsQuery($first: Int!) {
    allCollections(first: $first) {
      edges {
        node {
          id
          slug
          type
          seo {
            title
            description
          }
          breadcrumbList {
            itemListElement {
              item
              name
              position
            }
          }
        }
      }
    }
  }
`

const ALL_COLLECTIONS_OP = {
  __meta__: {
    operationName: 'LlmsAllCollectionsQuery',
    operationHash: 'llms-all-collections',
  },
} as unknown as Parameters<typeof execute>[0]['operation']

/**
 * Fetches top-level categories for the current binding via the GraphQL API.
 * Only `Department` and `Category` types are returned; deep leaf nodes are
 * filtered out to keep the LLM file high-signal.
 */
export async function fetchTopCategories(limit = 25): Promise<LlmsLink[]> {
  try {
    const { data, errors } = await execute<
      { first: number },
      AllCollectionsResult
    >({
      operation: ALL_COLLECTIONS_OP,
      variables: { first: Math.max(limit * 2, limit) },
      query: ALL_COLLECTIONS_QUERY,
    })

    if (errors?.length) {
      console.warn('[llms] allCollections returned errors', errors)
    }

    const edges = data?.allCollections?.edges ?? []
    return edges
      .map((edge) => edge.node)
      .filter((node) => node.type === 'Department' || node.type === 'Category')
      .slice(0, limit)
      .map<LlmsLink>((node) => ({
        name: node.seo?.title || node.slug,
        url: `/${node.slug.replace(/^\//, '')}`,
        description: node.seo?.description,
      }))
  } catch (error) {
    console.warn('[llms] fetchTopCategories failed', error)
    return []
  }
}

/**
 * Fetches CMS pages for the configured contentTypes. Applies allow- and
 * deny-list filters on slug. Returns the raw shape needed by both `/llms.txt`
 * (link + description) and `/llms-full.txt` (full sections payload).
 */
export async function fetchPagesByContentTypes(
  config: LlmsSourcesConfig
): Promise<LlmsPage[]> {
  const contentTypes = config.contentTypes ?? []
  if (contentTypes.length === 0) return []

  const allow = new Set((config.slugAllowList ?? []).map(normalizeSlug))
  const deny = new Set((config.slugDenyList ?? []).map(normalizeSlug))

  const results = await Promise.all(
    contentTypes.map(async (contentType) => {
      try {
        const { data } = await contentService.getMultipleContent({
          contentType,
        })
        return data
      } catch (error) {
        console.warn(
          `[llms] failed to fetch contentType="${contentType}"`,
          error
        )
        return []
      }
    })
  )

  const pages: LlmsPage[] = []
  for (const entries of results) {
    for (const entry of entries) {
      const page = toLlmsPage(entry)
      if (!page) continue
      const slug = normalizeSlug(page.slug)
      if (deny.has(slug)) continue
      if (allow.size > 0 && !allow.has(slug)) continue
      pages.push(page)
    }
  }
  return pages
}

function toLlmsPage(entry: any): LlmsPage | null {
  const seo = entry?.settings?.seo
  const slug = seo?.slug ?? entry?.slug
  if (!slug) return null
  return {
    slug,
    title: seo?.title || entry?.name || slug,
    description: seo?.description,
    sections: Array.isArray(entry?.sections) ? entry.sections : [],
  }
}

/**
 * Converts a discovered CMS page to a link suitable for `/llms.txt`'s
 * `## Pages` section.
 */
export function pageToLink(page: LlmsPage): LlmsLink {
  return {
    name: page.title,
    url: page.slug.startsWith('/') ? page.slug : `/${page.slug}`,
    description: page.description,
  }
}

function normalizeSlug(slug: string): string {
  return slug.replace(/^\//, '').toLowerCase()
}

/**
 * Institutional pages were a v1 concept. v2 keeps the helper as a no-op so
 * stores still on the v1 config (`institutionalSlugs`) don't crash; the
 * `## Pages` section sourced from `sources.contentTypes` supersedes it.
 */
export async function fetchInstitutionalPages(
  _slugs: string[]
): Promise<LlmsLink[]> {
  return []
}

/**
 * FAQ entries are not exposed by the base CMS content model. Stores that want
 * an FAQ block can populate `discovery.config.llms.customSections`.
 */
export async function fetchFaqEntries(): Promise<LlmsLink[]> {
  return []
}

export function getLlmsSourcesConfig(): LlmsSourcesConfig {
  const llms = (storeConfig as { llms?: { sources?: LlmsSourcesConfig } }).llms
  return llms?.sources ?? {}
}
