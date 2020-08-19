import { FC, useEffect, useMemo } from 'react'
import { useThemeUI } from '@vtex/store-ui'

import { NProgress } from './controller'

const loadController = () => import('./controller')

let progress: NProgress | null = null

const timeouts: NodeJS.Timeout[] = []

const TRANSITION_AFTER_MS = 300

interface Props {
  location: Location
}

export const Progress: FC<Props> = ({ children, location }) => {
  const {
    theme: { colors },
  } = useThemeUI()

  // Load and Setup nprogress once the browser is idle
  useEffect(() => {
    const handler = window.requestIdleCallback(async () => {
      const controller = await loadController()

      // nprogress default options
      progress = controller.setup({
        color: (colors as any).primary,
        showSpinner: false,
        trickleSpeed: 100,
      })
    })

    return () => window.cancelIdleCallback(handler)
  }, [colors])

  // Starts progress bar after milliseconds
  useMemo(() => {
    if (progress && location.pathname) {
      const id = setTimeout(() => progress?.start(), TRANSITION_AFTER_MS)

      timeouts.push(id)
    }
  }, [location.pathname])

  return children as any
}

// Once the route is updated, clean scheduled timeouts
// and eventual progress bar being displayed
export const onRouteUpdate = () => {
  if (!progress) {
    return
  }

  timeouts.forEach(clearTimeout)
  progress.done()
}
