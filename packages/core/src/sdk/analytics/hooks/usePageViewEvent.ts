import { useCallback, useEffect } from 'react'
import { useRouter } from 'next/router'
import { sendAnalyticsEvent } from '@faststore/sdk'
import type { PageViewEvent } from '@faststore/sdk'

export const usePageViewEvent = () => {
  const sendPageViewEvent = useCallback(() => {
    sendAnalyticsEvent<PageViewEvent>({
      name: 'page_view',
      params: {
        page_title: document.title,
        page_location: location.href,
        send_page_view: true,
      },
    })
  }, [])

  const router = useRouter()

  useEffect(() => {
    sendPageViewEvent()

    router.events.on('routeChangeComplete', sendPageViewEvent)

    return () => {
      router.events.off('routeChangeComplete', sendPageViewEvent)
    }
  }, [router])

  return { sendPageViewEvent }
}
