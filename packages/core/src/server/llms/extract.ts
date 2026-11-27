interface CmsSection {
  name: string
  data: unknown
}

const TEXT_FIELDS = [
  'title',
  'subtitle',
  'caption',
  'text',
  'body',
  'description',
] as const

/**
 * Extract human-readable paragraphs from a CMS sections array, restricted to
 * the section names in `whitelist`. Unknown sections and unknown fields are
 * ignored. Order is preserved.
 */
export function extractSectionParagraphs(
  sections: CmsSection[] | undefined,
  whitelist: string[]
): string[] {
  if (!Array.isArray(sections) || sections.length === 0) return []
  const allow = new Set(whitelist)
  const paragraphs: string[] = []

  for (const section of sections) {
    if (!section || !allow.has(section.name)) continue
    const data = (section.data ?? {}) as Record<string, unknown>
    for (const field of TEXT_FIELDS) {
      const value = data[field]
      const text = normalizeText(value)
      if (text) paragraphs.push(text)
    }
  }

  return paragraphs
}

function normalizeText(value: unknown): string | null {
  if (typeof value !== 'string') return null
  const trimmed = value.replace(/\s+/g, ' ').trim()
  return trimmed.length > 0 ? trimmed : null
}
