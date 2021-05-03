import type { PageProps } from 'gatsby'

import { useCanonical } from './useCanonical'

type Options = PageProps<unknown>

interface Return {
  '@context': 'https://schema.org'
  '@type': 'WebSite'
  url: string
  potentialAction: {
    '@type': 'SearchAction'
    target: string
    'query-input': string
  }
}

export const useSiteLinksSearchBoxJsonLd = (opts: Options): Return | null => {
  const { canonical } = useCanonical(opts)

  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    url: canonical ?? '',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${canonical}/s/{search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }
}
