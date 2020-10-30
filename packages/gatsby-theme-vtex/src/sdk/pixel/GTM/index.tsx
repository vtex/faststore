import React, { FC } from 'react'

import { isServer } from '../../../utils/env'
import { useLazyScript } from '../../lazyScript/useLazyScript'
import { usePixelCallbackEvent } from '../usePixelCallbackEvent'
import { handler } from './handler'

if (!isServer) {
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' })
}

interface Props {
  gtmId: string
}

const Provider: FC<Props> = ({ children, gtmId }) => {
  useLazyScript({
    src: `https://www.googletagmanager.com/gtm.js?id=${gtmId}`,
    id: gtmId,
  })

  usePixelCallbackEvent(handler)

  return <>{children}</>
}

export default Provider
