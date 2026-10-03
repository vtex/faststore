import { linkLine, section, truncate } from './format'
import { pageToLink } from './sources'
import type { LlmsConfig, LlmsLink, LlmsSources } from './types'

export function brandHeader(config: LlmsConfig): string | null {
  if (!config.title) return null
  const lines: string[] = [`# ${config.title}`]
  if (config.tagline) lines.push('', `> ${truncate(config.tagline, 200)}`)
  if (config.about) lines.push('', config.about.trim())
  return lines.join('\n')
}

export function categoriesSection(
  sources: LlmsSources,
  config: LlmsConfig
): string | null {
  if (sources.categories.length === 0) return null
  const lines = sources.categories.map((c) => linkLine(c, sources.storeUrl))
  return section('Shop by category', lines, config.maxLinksPerSection)
}

export function landingPagesSection(
  sources: LlmsSources,
  config: LlmsConfig
): string | null {
  if (!sources.pages?.length) return null
  const lines = sources.pages
    .map(pageToLink)
    .map((link) => linkLine(link, sources.storeUrl))
  return section('Pages', lines, config.maxLinksPerSection)
}

export function policiesSection(
  sources: LlmsSources,
  config: LlmsConfig
): string | null {
  if (sources.institutional.length === 0) return null
  const lines = sources.institutional.map((p) => linkLine(p, sources.storeUrl))
  return section('Customer service', lines, config.maxLinksPerSection)
}

export function faqSection(
  sources: LlmsSources,
  config: LlmsConfig
): string | null {
  if (sources.faq.length === 0) return null
  const lines = sources.faq.map((p) => linkLine(p, sources.storeUrl))
  return section('FAQ', lines, config.maxLinksPerSection)
}

export function contactSection(config: LlmsConfig): string | null {
  const contact = config.contact
  if (!contact?.email && !contact?.url) return null
  const lines: string[] = []
  if (contact.email) lines.push(`- Email: ${contact.email}`)
  if (contact.url) lines.push(`- [Contact form](${contact.url})`)
  return section('Contact', lines)
}

export function customSectionsLines(
  config: LlmsConfig,
  storeUrl: string
): string[] {
  const sections = config.customSections ?? []
  const rendered: string[] = []
  for (const s of sections) {
    const lines = s.items.map((item: LlmsLink) => linkLine(item, storeUrl))
    const block = section(s.title, lines, config.maxLinksPerSection)
    if (block) rendered.push(block)
  }
  return rendered
}

export function optionalSection(sources: LlmsSources): string | null {
  const items: LlmsLink[] = [
    { name: 'Sitemap', url: '/sitemap.xml' },
    { name: 'Full LLM content', url: '/llms-full.txt' },
  ]
  return section(
    'Optional',
    items.map((item) => linkLine(item, sources.storeUrl))
  )
}
