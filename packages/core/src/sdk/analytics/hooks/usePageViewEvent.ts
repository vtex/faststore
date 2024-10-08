import { useCallback, useEffect } from 'react'
import { useRouter } from 'next/router'
import { sendAnalyticsEvent } from '@faststore/sdk'
import type { PageViewEvent } from '@faststore/sdk'

export const usePageViewEvent = () => {
  const sendPageViewEvent = useCallback(() => {
    setTimeout(() => {
      sendAnalyticsEvent<any>({
        name: 'page_view',
        params: {
          test: true,
          page_title: document.title,
          page_location: location.href,
          send_page_view: true,
        },
      })
    }, 0)
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
