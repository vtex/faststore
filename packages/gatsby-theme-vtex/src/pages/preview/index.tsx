import {
  Content as ContentType,
  isContent as isContentType,
} from '@vtex/gatsby-transformer-vtex-cms'
import React, { FC, Suspense } from 'react'
import { Helmet } from 'react-helmet'

import Block from './Block'
import { useLocalStorage } from './localStorage'

export const CMS_CONTENT = 'cms-content'

const Preview: FC = () => {
  const content = useLocalStorage<ContentType>(CMS_CONTENT)
  const isContent = isContentType(content)

  if (!isContent || !content) {
    return <div>No Preview found. Waiting for input</div>
  }

  const {
    meta: { title, slug },
    blocks,
  } = content

  return (
    <>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <div>slug: {slug}</div>
      {blocks.map((block, index) => (
        <Suspense key={`block-${index}`} fallback={<div>Loading...</div>}>
          <Block block={block} />
        </Suspense>
      ))}
    </>
  )
}

export default Preview
