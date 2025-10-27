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
    const onRouteChangeStart = (url: string) => {
      // Save scroll position only when navigating to PDPs
      if (isPopState || url.includes(window.location.pathname)) return

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

          let attempts = 0
          const maxAttempts = 60 // ~1s with 60fps
          let lastScrollHeight = 0

          const tryScroll = () => {
            const currentScrollHeight = document.documentElement.scrollHeight
            const hasEnoughHeight =
              currentScrollHeight >= y + window.innerHeight
            const heightStabilized = currentScrollHeight === lastScrollHeight

            window.scrollTo(x, y)

            // Check if we've reached our target position
            const scrolledCorrectly =
              Math.abs(window.scrollY - y) < 5 &&
              Math.abs(window.scrollX - x) < 5

            // Continue trying if:
            // - Haven't scrolled correctly yet
            // - Height is still changing (content loading)
            // - Haven't reached max attempts
            if (
              attempts < maxAttempts &&
              (!scrolledCorrectly || (!hasEnoughHeight && !heightStabilized))
            ) {
              lastScrollHeight = currentScrollHeight
              attempts++
              window.requestAnimationFrame(tryScroll)
            }
          }

          // Wait for Next.js to finish initial render
          setTimeout(() => {
            // Give the browser a chance to calculate layout
            window.requestAnimationFrame(() =>
              window.requestAnimationFrame(tryScroll)
            )
          }, 300)
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
