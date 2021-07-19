import React, { Fragment, useMemo } from 'react'
import type { FC } from 'react'
import { usePixelEvent, once } from '@vtex/gatsby-theme-store'
import RecSys from '@biggy/recsys'
import { SessionPingEvent } from '@biggy/recsys/event/types/session/ping'

import { handler } from './handler'
import type { RecsysProviderProps } from './types'

const storeId = process.env.GATSBY_STORE_ID as string

const setupRecsys = once((allowedHosts: string[] = [window.location.host]) => {
  if (!allowedHosts.includes(window.location.host)) {
    return false
  }

  return true
})

const useSetupRecsys = (allowedHosts?: string[]) =>
  // We don't need allowedHosts in hooks deps since setupRecsys is run once
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useMemo(() => setupRecsys(allowedHosts), [])

const Provider: FC<RecsysProviderProps> = ({ children, allowedHosts }) => {
  // Setup Recsys
  // Remove localhost
  const shouldSetup = useSetupRecsys(allowedHosts?.concat('localhost:8000'))

  if (shouldSetup === true) {
    RecSys.init({
      environment: 'production',
      store: { slug: storeId },
    })

    // Send a first ping
    new SessionPingEvent().push()

    // Send ping every five minutes
    setInterval(async () => new SessionPingEvent().push(), 5000 * 60)

    // Register Pixel event handler
    // eslint-disable-next-line react-hooks/rules-of-hooks
    usePixelEvent(handler)
  }

  return <Fragment>{children}</Fragment>
}

export default Provider
