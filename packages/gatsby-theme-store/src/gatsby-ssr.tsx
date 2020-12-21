import React from 'react'
import type { RenderBodyArgs } from 'gatsby'

const polyfillIOEventEmitter = `
var __POLYFILL_IO_EVENT_SUBSCRIBERS__ = new Array()
var __POLYFILL_IO_EVENT_TRIGGERED__ = false

function __SUBSCRIBE_POLYFILL_IO_EVENT__ (cb) {
  if (__POLYFILL_IO_EVENT_TRIGGERED__ === true) {
    cb()
  } else {
    __POLYFILL_IO_EVENT_SUBSCRIBERS__.push(cb)
  }
}

function __POLYFILL_IO_CALLBACK__ () {
  __POLYFILL_IO_EVENT_TRIGGERED__ = true
  for (var i=0; i < __POLYFILL_IO_EVENT_SUBSCRIBERS__.length; i++) {
    __POLYFILL_IO_EVENT_SUBSCRIBERS__[i]()
  }
}
`

export const onRenderBody = ({
  setPostBodyComponents,
  setHeadComponents,
}: RenderBodyArgs) => {
  const polyfillIOUrl =
    'https://polyfill.io/v3/polyfill.min.js?callback=__POLYFILL_IO_CALLBACK__&features=default%2Ces2015%2Ces2016%2Ces2017%2CrequestIdleCallback%2CIntersectionObserver'

  setHeadComponents([
    <link
      key="preload-polyfill-io"
      as="script"
      rel="preload"
      href={polyfillIOUrl}
    />,
  ])

  setPostBodyComponents([
    <script
      key="polyfill-io-event-emitter"
      dangerouslySetInnerHTML={{ __html: polyfillIOEventEmitter }}
    />,
    <script key="polyfill-io" src={polyfillIOUrl} async />,
  ])
}
