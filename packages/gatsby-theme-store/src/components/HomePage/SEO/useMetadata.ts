import { useLocation } from '@reach/router'
import { graphql, useStaticQuery } from 'gatsby'
import type { PageProps } from 'gatsby'
import type { GatsbySeo } from 'gatsby-plugin-next-seo'
import type { ComponentPropsWithoutRef } from 'react'

import type { HomePageSeoQueryQuery } from './__generated__/HomePageSEOQuery.graphql'

type Options = PageProps<unknown>

type Return = ComponentPropsWithoutRef<typeof GatsbySeo>

export const useMetadata = (_: Options): Return => {
  const { pathname, host } = useLocation()
  const siteUrl = `https://${host}${pathname}`
  const {
    site: {
      siteMetadata: { title, description, titleTemplate },
    },
  } = useStaticQuery<HomePageSeoQueryQuery>(
    graphql`
      query HomePageSEOQuery {
        site {
          siteMetadata {
            title
            titleTemplate
            description
            author
          }
        }
      }
    `
  )

  return {
    title,
    description,
    titleTemplate,
    canonical: siteUrl,
    openGraph: {
      type: 'website',
      url: siteUrl,
      title,
      description,
    },
  }
}
