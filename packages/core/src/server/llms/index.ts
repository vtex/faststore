import { resolveSources, type BuildLlmsTxtContext } from './build'
import {
  brandHeader,
  categoriesSection,
  contactSection,
  customSectionsLines,
  faqSection,
  landingPagesSection,
  optionalSection,
  policiesSection,
} from './sections'

export async function buildLlmsTxt(
  ctx: BuildLlmsTxtContext
): Promise<string | null> {
  const { config, storeUrl } = ctx
  if (!config?.enabled) return null

  const sources = await resolveSources(ctx)

  const blocks: Array<string | null> = [
    brandHeader(config),
    categoriesSection(sources, config),
    landingPagesSection(sources, config),
    policiesSection(sources, config),
    faqSection(sources, config),
    ...customSectionsLines(config, storeUrl).map((s) => s),
    contactSection(config),
    optionalSection(sources),
  ]

  const body = blocks.filter((b): b is string => Boolean(b)).join('\n\n')
  if (!body) return null
  return `${body}\n`
}

export { resolveSources } from './build'
export type { BuildLlmsTxtContext } from './build'
export { buildLlmsFullTxt } from './full'
export type { BuildLlmsFullTxtContext } from './full'
export type { LlmsConfig, LlmsLink, LlmsSources } from './types'
