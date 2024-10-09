import { useEffect } from 'react'
import { useRouter } from 'next/router'

export const usePageViewEvent = () => {
  const router = useRouter()
  useEffect(() => {
    const handleRouteChange = () => {
      window.dataLayer = window.dataLayer || []
      window.dataLayer.push({
        event: 'pageview',
        pageTitle: document.title,
      })
    }
    router.events.on('routeChangeComplete', handleRouteChange)

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [])

  return
}
