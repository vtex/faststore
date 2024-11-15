import type { PageViewEvent } from '@faststore/sdk'
import { useRouter } from 'next/router'
import { useCallback, useEffect } from 'react'

export const usePageViewEvent = (props?: any) => {
  const sendPageViewEvent = useCallback(() => {
    import('@faststore/sdk').then(({ sendAnalyticsEvent }) => {
      sendAnalyticsEvent<PageViewEvent>({
        name: 'page_view',
        params: {
          page_title: document.title,
          page_location: location.href,
          send_page_view: true,
          ...props,
        },
      })
    })
  }, [props])

  const router = useRouter()

  useEffect(() => {
    sendPageViewEvent()
  }, [router, sendPageViewEvent])

  return { sendPageViewEvent }
}
