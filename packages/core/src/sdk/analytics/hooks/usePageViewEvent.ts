import { useCallback } from 'react'
import { sendAnalyticsEvent } from '@faststore/sdk'
import type { PageViewEvent } from '@faststore/sdk'

export const usePageViewEvent = ({
  send_page_view = true,
}: {
  send_page_view?: boolean
}) => {
  const sendPageViewEvent = useCallback(() => {
    sendAnalyticsEvent<PageViewEvent>({
      name: 'page_view',
      params: {
        page_title: document.title,
        page_location: location.href,
        send_page_view,
      },
    })
  }, [])

  return { sendPageViewEvent }
}
