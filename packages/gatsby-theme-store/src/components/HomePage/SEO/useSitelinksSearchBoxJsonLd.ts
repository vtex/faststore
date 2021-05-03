import { useLocation } from '@reach/router'
import type { PageProps } from 'gatsby'

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

export const useSiteLinksSearchBoxJsonLd = (_: Options): Return | null => {
  const { host } = useLocation()
  const url = `https://${host}`

  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    url,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${url}/s/{search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }
}
