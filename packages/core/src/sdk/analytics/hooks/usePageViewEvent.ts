import type { PageViewEvent } from '@faststore/sdk'
import { useRouter } from 'next/router'
import { useCallback, useEffect } from 'react'

export const usePageViewEvent = (props?: any) => {
  console.log('🚀 ~ props:', props)
  const sendPageViewEvent = useCallback(() => {
    import('@faststore/sdk').then(({ sendAnalyticsEvent }) => {
      console.log('~ 🚀 - page_view')
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
    console.log('🚀 ~ useEffect')
    sendPageViewEvent()
  }, [router, sendPageViewEvent])

  return { sendPageViewEvent }
}
