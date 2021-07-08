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
  const {
    pageInfo: { nextPage, prevPage },
  } = useSearch()

  const linkTags: GatsbySEOProps['linkTags'] = []

  if (prevPage !== false) {
    linkTags.push({ rel: 'prev', href: prevPage.link })
  }

  if (nextPage !== false) {
    linkTags.push({ rel: 'next', href: nextPage.link })
  }

  // According to Google, one should use either noindex or canonical, never both
  const canonicalTags =
    typeof canonical === 'string'
      ? { canonical, noindex: false, nofollow: false }
      : { canonical: undefined, noindex: true, nofollow: false }

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
