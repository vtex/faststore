type CmsSection = {
  name?: string
  $componentKey?: string
  data?: {
    campaignVrn?: string
    enableRecommendations?: boolean
    recommendations?: {
      campaignVrn?: string
      shouldDisplayRecommendationShelf?: boolean
    }
  }
}

function isRecommendationsEnabled(
  enableRecommendations?: boolean,
  campaignVrn?: string
) {
  if (enableRecommendations === false) {
    return false
  }

  return enableRecommendations === true || Boolean(campaignVrn)
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

function isComponent(section: CmsSection, componentKey: string) {
  return section.name === componentKey || section.$componentKey === componentKey
}

/**
 * Returns true when the current page CMS data enables recommendations on any
 * surface, so the personalization session is started for it.
 *
 * Two shapes opt in:
 * - a `RecommendationShelf` section with `enableRecommendations: true` or a
 *   `campaignVrn`;
 * - a `CartSidebar` section with
 *   `data.recommendations.shouldDisplayRecommendationShelf: true`.
 *
 * The cart drawer shape matters because the drawer only mounts once the shopper
 * opens it, long after this runs: without starting the session on page load the
 * `vtex-rec-user-id` cookie would never exist and the mini cart shelf would
 * silently never render.
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
      (isComponent(section, 'RecommendationShelf') &&
        isRecommendationsEnabled(
          section.data?.enableRecommendations,
          section.data?.campaignVrn
        )) ||
      (isComponent(section, 'CartSidebar') &&
        section.data?.recommendations?.shouldDisplayRecommendationShelf ===
          true)
  )
}
