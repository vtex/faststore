import { useRef } from 'react'

const FIVE_MINUTES = 5 * 60 * 1000

function hasPeriodPassed({
  timestamp,
  period = FIVE_MINUTES,
}: { timestamp: number; period: number }): boolean {
  return Date.now() - timestamp > period
}

interface UseShouldFetchFirstPageParams {
  page: number
  generatedBuildTime: number
}

/**
 * This hook determines if the first page (page 0) should be fetched.
 * This is because the first page is initially fetched from the server side and injected into the cache for performance and SEO reasons.
 * So this hook checks if the first page should be fetched again on the client side
 * after 5 minutes since the build time (last fetch from the server side) or the last fetch time from the client side.
 *
 * @param page The page number
 * @param generatedBuildTime The time the page was generated
 * @returns boolean
 *
 **/
export function useShouldFetchFirstPage({
  page,
  generatedBuildTime,
}: UseShouldFetchFirstPageParams): boolean {
  const lastFetchTime = useRef<number | undefined>()

  if (page !== 0) return false

  const passedFiveMinutesAfterBuild = hasPeriodPassed({
    timestamp: generatedBuildTime,
    period: FIVE_MINUTES,
  })

  const isFirstClientSideFetchFromFirstPage =
    lastFetchTime.current === undefined

  const passedFiveMinutesSinceLastFetch =
    !isFirstClientSideFetchFromFirstPage &&
    hasPeriodPassed({
      timestamp: lastFetchTime.current!,
      period: FIVE_MINUTES,
    })

  if (
    passedFiveMinutesAfterBuild &&
    (isFirstClientSideFetchFromFirstPage || passedFiveMinutesSinceLastFetch)
  ) {
    lastFetchTime.current = Date.now()
    return true
  }

  return false
}
