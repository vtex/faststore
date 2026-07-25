import {
  fetchFaqEntries,
  fetchInstitutionalPages,
  fetchPagesByContentTypes,
  fetchTopCategories,
} from './sources'
import type { LlmsConfig, LlmsSources } from './types'

export interface BuildLlmsTxtContext {
  config: LlmsConfig
  storeUrl: string
  sources?: Partial<LlmsSources>
}

export async function resolveSources(
  ctx: BuildLlmsTxtContext
): Promise<LlmsSources> {
  const { config, storeUrl } = ctx
  const sourcesCfg = config.sources ?? {}
  const categoriesEnabled = sourcesCfg.categories?.enabled !== false
  const categoryLimit =
    sourcesCfg.categories?.limit ?? config.maxLinksPerSection ?? 25

  return {
    storeUrl,
    categories:
      ctx.sources?.categories ??
      (categoriesEnabled ? await fetchTopCategories(categoryLimit) : []),
    institutional:
      ctx.sources?.institutional ??
      (await fetchInstitutionalPages(config.institutionalSlugs ?? [])),
    faq: ctx.sources?.faq ?? (await fetchFaqEntries()),
    pages: ctx.sources?.pages ?? (await fetchPagesByContentTypes(sourcesCfg)),
  }
}
