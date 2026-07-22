type CmsSection = {
  name?: string
  $componentKey?: string
  data?: {
    enableRecommendations?: boolean
  }
}

function pushSections(target: CmsSection[], value: unknown) {
  if (Array.isArray(value)) {
    for (const item of value) {
      if (item && typeof item === 'object') {
        target.push(item as CmsSection)
      }
    }
    return
  }

  if (value && typeof value === 'object') {
    const sections = (value as { sections?: unknown }).sections
    if (Array.isArray(sections)) {
      pushSections(target, sections)
    }
  }
}

/**
 * Returns true when the current page CMS data includes at least one
 * `RecommendationShelf` with `enableRecommendations: true`.
 */
export function hasEnabledRecommendationShelf(pageProps: unknown): boolean {
  if (!pageProps || typeof pageProps !== 'object') {
    return false
  }

  const props = pageProps as Record<string, unknown>
  const sections: CmsSection[] = []

  pushSections(sections, props.sections)
  pushSections(sections, props.globalSections)
  pushSections(sections, props.page)

  return sections.some(
    (section) =>
      (section.name === 'RecommendationShelf' ||
        section.$componentKey === 'RecommendationShelf') &&
      section.data?.enableRecommendations === true
  )
}
