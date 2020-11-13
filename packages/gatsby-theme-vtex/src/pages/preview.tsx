import {
  Content as ContentType,
  isContent as isContentType,
  getMeta,
} from '@vtex/gatsby-transformer-vtex-cms'
import React, { FC, Suspense } from 'react'
import { Helmet } from 'react-helmet-async'

import Block from '../components/cms/Block'
import { CMS_CONTENT, setupIframeListener } from '../components/cms/iframe'
import { useLocalStorage } from '../components/cms/localStorage'
import ErrorBoundary from '../components/Error/ErrorBoundary'
import ErrorHandler from '../components/Error/ErrorHandler'
import { isServer } from '../utils/env'

if (!isServer) {
  setupIframeListener()
}

const Preview: FC = () => {
  const content = useLocalStorage<ContentType>(CMS_CONTENT)
  const isContent = isContentType(content)

  if (!isContent || !content) {
    return <div>No Preview found. Waiting for input</div>
  }

  const { beforeBlocks, blocks, afterBlocks, extraBlocks } = content

  const { title, slug } = getMeta(extraBlocks) as any

  return (
    <ErrorBoundary fallback={(error) => <ErrorHandler error={error} />}>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <div>slug: {slug}</div>
      {beforeBlocks?.map((block, index) => (
        <Suspense key={`block-${index}`} fallback={<div>Loading...</div>}>
          <Block block={block} />
        </Suspense>
      ))}
      {blocks.map((block, index) => (
        <Suspense key={`block-${index}`} fallback={<div>Loading...</div>}>
          <Block block={block} />
        </Suspense>
      ))}
      {afterBlocks?.map((block, index) => (
        <Suspense key={`block-${index}`} fallback={<div>Loading...</div>}>
          <Block block={block} />
        </Suspense>
      ))}
    </ErrorBoundary>
  )
}

export default Preview
