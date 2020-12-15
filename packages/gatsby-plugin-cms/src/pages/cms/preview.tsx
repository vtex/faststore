import React from 'react'
import { Helmet } from 'react-helmet-async'
import type { FC } from 'react'

import { getMeta, isContent as isContentType } from '../../common'
import ErrorBoundary from '../../components/ErrorBoundary'
import ErrorHandler from '../../components/ErrorHandler'
import { useIframeListener } from '../../hooks/useIframeListener'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import type { Content as ContentType } from '../../common'

const Preview: FC = () => {
  const content = useLocalStorage<ContentType>()
  const isContent = isContentType(content)

  useIframeListener()

  if (!isContent || !content) {
    return <div>No Preview found. Waiting for input</div>
  }

  const { extraBlocks } = content

  const { title, slug } = getMeta(extraBlocks) as any

  return (
    <ErrorBoundary fallback={(error) => <ErrorHandler error={error} />}>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <div>slug: {slug}</div>
    </ErrorBoundary>
  )
}

export default Preview
