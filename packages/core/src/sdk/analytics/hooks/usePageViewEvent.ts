import { useCallback, useEffect } from 'react'
import { useRouter } from 'next/router'
import { sendAnalyticsEvent } from '@faststore/sdk'
import type { PageViewEvent } from '@faststore/sdk'

interface PageViewEventProps {
  pageTitle?: string
}

export const usePageViewEvent = ({ pageTitle }: PageViewEventProps) => {
  const sendPageViewEvent = useCallback(() => {
    sendAnalyticsEvent<PageViewEvent>({
      name: 'page_view',
      params: {
        page_title: pageTitle ?? document.title,
        page_location: location.href,
        send_page_view: true,
      },
    })
  }, [])

  const router = useRouter()

  useEffect(() => {
    router.events.on('routeChangeComplete', sendPageViewEvent)

    return () => {
      router.events.off('routeChangeComplete', sendPageViewEvent)
    }
  }, [router])

  return { sendPageViewEvent }
}
