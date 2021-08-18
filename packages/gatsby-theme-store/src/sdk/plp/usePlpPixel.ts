import { useEffect } from 'react'
import type { SearchParamsState } from '@vtex/store-sdk'
import { sendAnalyticsEvent } from '@vtex/store-sdk'

interface Args {
  location: Location
  searchParams: SearchParamsState
  totalCount: number
}

export const usePlpPixelEffect = ({
  location,
  totalCount,
  searchParams,
}: Args) => {
  useEffect(() => {
    const { term } = searchParams
    const pageType = term ? 'fullText' : 'plp'

    const events = [
      {
        type: 'vtex:pageView',
        data: {
          pageUrl: location.href,
          pageTitle: document.title,
          referrer: document.referrer,
          accountName: process.env.GATSBY_STORE_ID!,
          pageType,
        },
      },
      {
        type: 'vtex:internalSiteSearchView',
        data: {
          accountName: process.env.GATSBY_STORE_ID!,
          pageUrl: location.href,
          pageTitle: document.title,
          referrer: document.referrer,
          term: term ?? '',
          results: totalCount ?? 0,
          pageType,
        },
      },
    ] as const

    events.forEach(sendAnalyticsEvent)
  }, [location.href, totalCount, searchParams])
}
