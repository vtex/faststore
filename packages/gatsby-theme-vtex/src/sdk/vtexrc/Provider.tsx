import { PropsWithChildren } from 'react'

import { useLazyScript } from '../lazyScript/useLazyScript'

const id = 'async-vtex-rc'
const src = 'https://io.vtex.com.br/rc/rc.js'

// Register VTEX RC synchronously
if (!window.vtexrca) {
  // eslint-disable-next-line func-names
  window.vtexrca = function () {
    // eslint-disable-next-line prefer-rest-params
    window.vtexrca!.q.push(arguments)
  } as any

  window.vtexrca!.q = []
  window.vtexrca!.l = +new Date()
}

const Provider = ({ children }: PropsWithChildren<unknown>) => {
  useLazyScript({ src, id })

  return children
}

export default Provider
