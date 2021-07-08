import { useLocation } from '@reach/router'
import { useMemo } from 'react'
import type { GatsbySeo } from 'gatsby-plugin-next-seo'
import type { ComponentPropsWithoutRef } from 'react'

import { useSearch } from '../../search/useSearch'
import { useLocale } from '../../localization/useLocale'

export interface Options {
  title?: string
  titleTemplate?: string
  description?: string
  canonical?: string
}

type GatsbySEOProps = ComponentPropsWithoutRef<typeof GatsbySeo>

export const useMetadata = ({
  title,
  titleTemplate,
  description,
  canonical,
}: Options): GatsbySEOProps => {
  const language = useLocale()
  const { host } = useLocation()
  const {
    pageInfo: { nextPage, prevPage },
  } = useSearch()

  // According to Google, one should use either noindex or canonical, never both.
  // Also, we generate relative canonicals in the HTML that will be hydrated to absolute ones via JS
  const canonicalTags = useMemo(() => {
    if (typeof canonical === 'string') {
      return {
        canonical:
          host !== undefined ? `https://${host}${canonical}` : canonical,
        noindex: false,
        nofollow: false,
      }
    }

    return { canonical: undefined, noindex: true, nofollow: false }
  }, [canonical, host])

  const linkTags = useMemo(() => {
    const tags: GatsbySEOProps['linkTags'] = []

    if (prevPage !== false) {
      tags.push({ rel: 'prev', href: prevPage.link })
    }

    if (nextPage !== false) {
      tags.push({ rel: 'next', href: nextPage.link })
    }

    return tags
  }, [nextPage, prevPage])

  return {
    ...canonicalTags,
    linkTags,
    language,
    title,
    titleTemplate,
    description,
    openGraph: {
      type: 'website',
      title,
      description,
    },
  }
}
