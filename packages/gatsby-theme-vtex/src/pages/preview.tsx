import {
  Content as ContentType,
  isContent as isContentType,
} from '@vtex/gatsby-transformer-vtex-cms'
import React, { FC, Suspense } from 'react'
import { Helmet } from 'react-helmet'
import { FormattedMessage } from 'react-intl'
// import { t } from 'frenchkiss'

import Block from '../components/cms/Block'
import { CMS_CONTENT, setupIframeListener } from '../components/cms/iframe'
import { useLocalStorage } from '../components/cms/localStorage'
import { isServer } from '../utils/env'

if (!isServer) {
  setupIframeListener()
}

const Preview: FC = () => {
  const content = useLocalStorage<ContentType>(CMS_CONTENT)
  const isContent = isContentType(content)

  if (!isContent || !content) {
    return <FormattedMessage id="preview.not-found" />
    // return<div>{t('preview.not-found')}</div>
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
        // <Suspense key={`block-${index}`} fallback={<div>{t('loading')}</div>}>
        <Suspense key={`block-${index}`} fallback={<FormattedMessage id="loading" />}>
          <Block block={block} />
        </Suspense>
      ))}
    </>
  )
}

export default Preview
