import React, { FC, Suspense } from 'react'
import { Helmet } from 'react-helmet-async'

import {
  Content as ContentType,
  getMeta,
  isContent as isContentType,
} from '../../common'
import { useIframeListener } from '../../hooks/useIframeListener'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import Block from '../../components/Block'
import ErrorBoundary from '../../components/ErrorBoundary'
import ErrorHandler from '../../components/ErrorHandler'

const Preview: FC = () => {
  const content = useLocalStorage<ContentType>()
  const isContent = isContentType(content)

  useIframeListener()

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
