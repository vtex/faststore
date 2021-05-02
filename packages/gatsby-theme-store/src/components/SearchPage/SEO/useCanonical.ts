import { useLocation } from '@reach/router'
import type { GatsbySeo } from 'gatsby-plugin-next-seo'
import type { ComponentPropsWithoutRef } from 'react'

interface Options {
  pageContext: {
    canonicalPath?: string
  }
}

type Return = Pick<
  ComponentPropsWithoutRef<typeof GatsbySeo>,
  'canonical' | 'noindex' | 'nofollow'
>

/**
 * @description: Returns the canonical tag, deduplicating pages and increasing Google Ranking for the site.
 * If the page has no canonical tag, returns a no-index tag.
 * Pay attention, one should use either noindex or canonical, never both
 */
export const useCanonical = (options: Options): Return => {
  const {
    pageContext: { canonicalPath },
  } = options

  const { host } = useLocation()

  if (typeof canonicalPath === 'string') {
    return { canonical: `https://${host}${canonicalPath}` }
  }

  return { noindex: true, nofollow: false }
}
