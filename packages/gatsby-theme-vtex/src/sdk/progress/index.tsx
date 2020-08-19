import React, { FC, useEffect, useState, useMemo } from 'react'
import { useThemeUI } from '@vtex/store-ui'

import { NProgress } from './controller'

const loadController = () => import('./controller')

let progress: NProgress | null = null

const timeouts: NodeJS.Timeout[] = []

interface Props {
  location: Location
}

export const Progress: FC<Props> = ({ children, location }) => {
  const {
    theme: { colors },
  } = useThemeUI()

  useEffect(() => {
    const handler = window.requestIdleCallback(async () => {
      const controller = await loadController()

      progress = controller.setup({
        color: (colors as any).primary,
        showSpinner: false,
        trickleSpeed: 100,
      } as any)
    })

    return () => window.cancelIdleCallback(handler)
  }, [colors])

  useMemo(() => {
    if (progress && location.pathname) {
      const id = setTimeout(() => {
        console.log('progress.start')
        progress?.start()
      }, 300)

      timeouts.push(id)
    }
  }, [location.pathname])

  return children
}

export const onRouteUpdate = () => {
  if (!progress) {
    return
  }

  timeouts.forEach(clearTimeout)
  console.log('progress.done')
  progress.done()
}
