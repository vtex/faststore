import type { LlmsLink } from './types'

export const MAX_DESCRIPTION_LENGTH = 120

export function truncate(value: string, max = MAX_DESCRIPTION_LENGTH): string {
  const normalized = value.replace(/\s+/g, ' ').trim()
  if (normalized.length <= max) return normalized
  return `${normalized.slice(0, max - 1).trimEnd()}…`
}

export function absoluteUrl(storeUrl: string, path: string): string {
  if (/^https?:\/\//i.test(path)) return path
  const base = storeUrl.replace(/\/$/, '')
  const suffix = path.startsWith('/') ? path : `/${path}`
  return `${base}${suffix}`
}

export function linkLine(link: LlmsLink, storeUrl: string): string {
  const href = absoluteUrl(storeUrl, link.url)
  const desc = link.description ? `: ${truncate(link.description)}` : ''
  return `- [${link.name}](${href})${desc}`
}

export function section(
  title: string,
  lines: string[],
  maxItems?: number
): string | null {
  const items = typeof maxItems === 'number' ? lines.slice(0, maxItems) : lines
  if (items.length === 0) return null
  return [`## ${title}`, ...items].join('\n')
}
