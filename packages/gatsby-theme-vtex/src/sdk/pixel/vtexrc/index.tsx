import React, { FC } from 'react'

import { useLazyScript } from '../../lazyScript/useLazyScript'
import { usePixelCallbackEvent } from '../usePixelCallbackEvent'
import { handler } from './handler'

// Register VTEX RC synchronously
if (!window.vtexrca) {
  // eslint-disable-next-line func-names
  window.vtexrca = function () {
    // eslint-disable-next-line prefer-rest-params
    vtexrca.q.push(arguments)
  } as any

  Object.defineProperty(window.vtexrca, 'q', {
    configurable: true,
    writable: true,
    enumerable: true,
    value: [],
  })

  Object.defineProperty(window.vtexrca, 'l', {
    configurable: true,
    writable: true,
    enumerable: true,
    value: +new Date(),
  })
}

const Provider: FC = ({ children }) => {
  useLazyScript({ src: 'https://io.vtex.com.br/rc/rc.js', id: 'async-vtex-rc' })

  usePixelCallbackEvent(handler)

  return <>{children}</>
}

export default Provider
