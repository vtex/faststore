import { useEffect } from 'react'
import { useRouter } from 'next/router'

import { useSearch } from '@faststore/sdk'

export default function useScrollRestoration() {
  const router = useRouter()
  const { resetInfiniteScroll } = useSearch()

  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual'
    }

    let isPopState = false
    const onBeforePopState = () => (isPopState = true)
    const onRouteChangeStart = () => {
      if (isPopState) return

      saveScrollPos()
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

    const restoreScrollPos = () => {
      const key = window.history.state?.key
      if (key) {
        const stored = sessionStorage.getItem(`__fs_scroll_${key}`)
        if (stored) {
          const { x, y } = JSON.parse(stored)

          const tryScroll = () => {
            window.scrollTo(x, y)
            if (
              document.documentElement.scrollHeight <
              y + window.innerHeight
            ) {
              window.requestAnimationFrame(tryScroll)
            }
          }

          // Products rendering delay
          setTimeout(tryScroll, 300)
        }
      }
    }

    router.beforePopState(onBeforePopState)
    router.events.on('routeChangeStart', onRouteChangeStart)
    window.addEventListener('popstate', restoreScrollPos)

    // Reset each PLP's infinite scroll when navigating to other pages than PDPs
    router.events.on('routeChangeStart', (url) => {
      if (url.includes(window.location.pathname) || url.endsWith('/p')) return

      resetInfiniteScroll(0)
    })

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
