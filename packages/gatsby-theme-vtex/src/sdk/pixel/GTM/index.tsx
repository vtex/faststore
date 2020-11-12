import React, { FC, Fragment } from 'react'

import { isServer } from '../../../utils/env'
import { useLazyScript } from '../../lazyScript/useLazyScript'
import { usePixelEvent } from '../usePixelEvent'
import { handler } from './handler'

if (!isServer) {
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({ 'gtm.blacklist': ['html'] })
  window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' })
}

interface Props {
  gtmId: string
}

const Provider: FC<Props> = ({ children, gtmId }) => {
  useLazyScript({
    src: `https://www.googletagmanager.com/gtm.js?id=${gtmId}`,
    id: gtmId,
    timeout: 5.5e3,
  })

  usePixelEvent(handler)

  return <Fragment>{children}</Fragment>
}

export default Provider
