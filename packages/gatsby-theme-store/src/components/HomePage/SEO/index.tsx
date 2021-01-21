import React from 'react'
import { graphql, useStaticQuery } from 'gatsby'
import type { FC } from 'react'
import type { PageProps } from 'gatsby'

import SiteMetadata from './SiteMetadata'
import Canonical from './Canonical'
import StructuredData from './StructuredData'

type Props = PageProps<unknown>

const SEO: FC<Props> = (props) => {
  const {
    site: { siteMetadata },
  } = useStaticQuery(
    graphql`
      query HomePageSEOQuery {
        site {
          siteMetadata {
            title
            siteUrl
            description
            author
          }
        }
      }
    `
  )

  const subProps = {
    ...props,
    siteMetadata,
  }

  return (
    <>
      <SiteMetadata {...subProps} />
      <Canonical {...subProps} />
      <StructuredData {...subProps} />
    </>
  )
}

export default SEO
