import { useEffect } from 'react'
import { useRouter } from 'next/router'

import { useSearch } from '@faststore/sdk'

export default function useScrollRestoration() {
  const router = useRouter()
  const { resetInfiniteScroll } = useSearch()

  useEffect(() => {
    let isPopState = false

    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual'
    }

    const saveScrollPos = () => {
      const key = window.history.state?.key
      if (key) {
        sessionStorage.setItem(
          `__fs_scroll_${key}`,
          JSON.stringify({ x: window.scrollX, y: window.scrollY })
        )
      }
    }

    const restoreScrollPos = async () => {
      const key = window.history.state?.key
      if (key) {
        const stored = sessionStorage.getItem(`__fs_scroll_${key}`)
        if (stored) {
          const { x, y } = await JSON.parse(stored)

          // Products rendering delay
          setTimeout(() => window.scrollTo(x, y), 800)
        }
      }
    }

    const onBeforePopState = () => (isPopState = true)

    const onRouteChangeStart = (url: string) => {
      // Save scroll position only when navigating to PDPs
      if (isPopState || url.includes(window.location.pathname)) return
      saveScrollPos()

      // Reset each PLP's infinite scroll when navigating to other pages than PDPs
      if (url.includes(window.location.pathname) || url.endsWith('/p')) return
      resetInfiniteScroll(0)
    }

    router.beforePopState(onBeforePopState)
    router.events.on('routeChangeStart', onRouteChangeStart)
    window.addEventListener('popstate', restoreScrollPos)

    return () => {
      router.beforePopState(() => true)
      router.events.off('routeChangeStart', onRouteChangeStart)
      window.removeEventListener('popstate', restoreScrollPos)
      if ('scrollRestoration' in history) {
        history.scrollRestoration = 'auto'
      }
    }
  }, [router])
}
