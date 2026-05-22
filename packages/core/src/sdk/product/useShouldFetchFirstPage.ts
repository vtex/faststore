import { useRef } from 'react'

const FIVE_MINUTES = 5 * 60 * 1000

function hasTimeElapsed({
  timestamp,
  period = FIVE_MINUTES,
}: { timestamp: number; period: number }): boolean {
  return Date.now() - timestamp > period
}

interface UseShouldFetchFirstPageParams {
  page: number
}

/**
 * This hook determines if the first page (page 0) should be fetched.
 * This is because the first page is initially fetched from the server side and injected into the cache for performance and SEO reasons.
 * So this hook checks if the first page should be fetched again on the client side
 * after 5 minutes since the user loaded the page (not the build time), or the last fetch time from the client side.
 *
 * @param page The page number
 * @returns boolean
 *
 **/
export function useShouldFetchFirstPage({
  page,
}: UseShouldFetchFirstPageParams): boolean {
  // useRef must be called before any early return to comply with Rules of Hooks.
  const pageLoadTime = useRef(Date.now())
  const lastFetchTime = useRef<number | undefined>()

  if (page !== 0) return false

  const passedFiveMinutesSincePageLoad = hasTimeElapsed({
    timestamp: pageLoadTime.current,
    period: FIVE_MINUTES,
  })

  const currentLastFetchTime = lastFetchTime.current
  const isFirstClientSideFetchFromFirstPage = currentLastFetchTime === undefined

  const passedFiveMinutesSinceLastFetch =
    currentLastFetchTime !== undefined &&
    hasTimeElapsed({
      timestamp: currentLastFetchTime,
      period: FIVE_MINUTES,
    })

  if (
    passedFiveMinutesSincePageLoad &&
    (isFirstClientSideFetchFromFirstPage || passedFiveMinutesSinceLastFetch)
  ) {
    lastFetchTime.current = Date.now()
    return true
  }

  return false
}
