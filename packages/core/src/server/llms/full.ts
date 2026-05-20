import { extractSectionParagraphs } from './extract'
import { absoluteUrl } from './format'
import { resolveSources, type BuildLlmsTxtContext } from './build'
import type { LlmsConfig, LlmsLink, LlmsPage, LlmsSources } from './types'

const PER_PAGE_CAP = 8 * 1024
const TOTAL_FILE_CAP = 500 * 1024
const DEFAULT_TEXT_SECTIONS = ['BannerText', 'Hero']

export type BuildLlmsFullTxtContext = BuildLlmsTxtContext

export async function buildLlmsFullTxt(
  ctx: BuildLlmsFullTxtContext
): Promise<string | null> {
  const { config, storeUrl } = ctx
  if (!config?.enabled) return null

  const sources = await resolveSources(ctx)
  const textSectionNames =
    config.sources?.textSectionNames ?? DEFAULT_TEXT_SECTIONS

  const header = renderHeader(config)
  const categories = renderCategoriesBlock(sources)
  const pages = renderPagesBlock(sources.pages, sources, textSectionNames)
  const customPages = renderCustomPagesBlock(config, storeUrl)

  const parts = [header, categories, pages, customPages].filter(
    (s): s is string => Boolean(s)
  )
  if (parts.length === 0) return null

  const joined = parts.join('\n\n---\n\n')
  const capped = applyTotalCap(joined)
  return `${capped}\n`
}

function renderHeader(config: LlmsConfig): string {
  const lines: string[] = [`# ${config.title || 'Store'} — Full content`]
  if (config.tagline) lines.push('', `> ${config.tagline.trim()}`)
  if (config.about) lines.push('', config.about.trim())
  return lines.join('\n')
}

function renderCategoriesBlock(sources: LlmsSources): string | null {
  if (sources.categories.length === 0) return null
  const blocks = sources.categories.map((category) =>
    renderLinkBlock(category, sources.storeUrl)
  )
  return ['# Categories', '', ...blocks].join('\n\n')
}

function renderLinkBlock(link: LlmsLink, storeUrl: string): string {
  const url = absoluteUrl(storeUrl, link.url)
  const lines = [`## ${link.name}`, `URL: ${url}`]
  if (link.description) lines.push('', link.description.trim())
  return lines.join('\n')
}

function renderPagesBlock(
  pages: LlmsPage[],
  sources: LlmsSources,
  textSectionNames: string[]
): string | null {
  if (!pages?.length) return null
  const blocks = pages.map((page) =>
    renderPageBlock(page, sources.storeUrl, textSectionNames)
  )
  return ['# Pages', '', ...blocks].join('\n\n')
}

function renderPageBlock(
  page: LlmsPage,
  storeUrl: string,
  textSectionNames: string[]
): string {
  const url = absoluteUrl(storeUrl, page.slug)
  const lines = [`## ${page.title}`, `URL: ${url}`]

  if (page.description) {
    lines.push('', page.description.trim())
  }

  const paragraphs = extractSectionParagraphs(page.sections, textSectionNames)
  for (const paragraph of paragraphs) {
    lines.push('', paragraph)
  }

  const block = lines.join('\n')
  return truncateBlock(block, PER_PAGE_CAP)
}

function renderCustomPagesBlock(
  config: LlmsConfig,
  storeUrl: string
): string | null {
  const pages = config.customPages ?? []
  if (pages.length === 0) return null
  const blocks = pages.map((page) => {
    const url = absoluteUrl(storeUrl, page.slug)
    const body = truncateBlock(page.body.trim(), PER_PAGE_CAP)
    return [`## ${page.title}`, `URL: ${url}`, '', body].join('\n')
  })
  return ['# Custom pages', '', ...blocks].join('\n\n')
}

function truncateBlock(block: string, cap: number): string {
  if (block.length <= cap) return block
  return `${block.slice(0, cap).trimEnd()}\n\n(truncated)`
}

function applyTotalCap(body: string): string {
  if (body.length <= TOTAL_FILE_CAP) return body
  // Cut at a page boundary (## heading) just before the cap.
  const slice = body.slice(0, TOTAL_FILE_CAP)
  const lastBoundary = slice.lastIndexOf('\n## ')
  const cut = lastBoundary > 0 ? slice.slice(0, lastBoundary) : slice
  return `${cut.trimEnd()}\n\n(truncated — content omitted to stay under ${Math.round(
    TOTAL_FILE_CAP / 1024
  )}KB)`
}
