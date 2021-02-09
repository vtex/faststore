import React from 'react'
import type { FC } from 'react'

import Helmet from './Helmet'

export interface Props {
  title: string
  lang?: string
  description: string
  titleTemplate?: string
  social?: {
    facebook?: {
      title: string
      description: string
      thumbnail: string
    }
    twitter?: {
      title: string
      description: string
      author: string
    }
  }
}

const SiteMetadata: FC<Props> = ({
  title,
  titleTemplate,
  description,
  lang = 'en',
  social,
}) => {
  let meta = [
    {
      name: 'description',
      content: description,
    },
    {
      property: 'og:title',
      content: title,
    },
    {
      property: 'og:description',
      content: description,
    },
    {
      property: 'og:type',
      content: 'website',
    },
  ]

  if (social != null) {
    const { facebook, twitter } = social

    if (facebook != null) {
      meta = meta.concat([
        {
          property: 'og:title',
          content: facebook.title,
        },
        {
          property: 'og:description',
          content: facebook.description,
        },
        {
          property: 'og:image',
          content: facebook.thumbnail,
        },
      ])
    }

    if (twitter != null) {
      meta = meta.concat([
        {
          name: 'twitter:card',
          content: 'summary',
        },
        {
          name: 'twitter:creator',
          content: twitter.author,
        },
        {
          name: 'twitter:title',
          content: twitter.title,
        },
        {
          name: 'twitter:description',
          content: twitter.description,
        },
      ])
    }
  }

  return (
    <Helmet
      htmlAttributes={{
        lang,
      }}
      titleTemplate={titleTemplate}
      title={title}
      meta={meta}
    />
  )
}

export default SiteMetadata
