import type { PageViewEvent } from '@faststore/sdk'
import { useRouter } from 'next/router'
import { useCallback, useEffect } from 'react'

export const usePageViewEvent = () => {
  const sendPageViewEvent = useCallback(() => {
    import('@faststore/sdk').then(({ sendAnalyticsEvent }) => {
      sendAnalyticsEvent<PageViewEvent>({
        name: 'page_view',
        params: {
          page_title: document.title,
          page_location: location.href,
          send_page_view: true,
        },
      })
    })
  }, [])

  const router = useRouter()

  useEffect(() => {
    router.events.on('routeChangeComplete', sendPageViewEvent)

    return () => {
      router.events.off('routeChangeComplete', sendPageViewEvent)
    }
  }, [router, sendPageViewEvent])

  return { sendPageViewEvent }
}
