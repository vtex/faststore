import React, { Fragment } from 'react'
import type { FC } from 'react'

import { useLazyScript } from '../../lazyScript/useLazyScript'
import { usePixelEvent } from '../usePixelEvent'
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
  useLazyScript({
    src: 'https://io.vtex.com.br/rc/rc.js',
    id: 'async-vtex-rc',
    timeout: 5500,
  })

  usePixelEvent(handler)

  return <Fragment>{children}</Fragment>
}

export default Provider
