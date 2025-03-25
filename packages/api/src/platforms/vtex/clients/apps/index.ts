import type { Context, Options } from '../..'
import { IntelligentSearch } from './search'
import { ReviewsAndRatings } from './reviewsAndRatings'

export function getAppIOBaseUrl(account: string, environment: string): string {
  return `https://${account}.${environment}.com.br/api/io`
}

export function buildHeaders(headers?: Record<string, string>) {
  return {
    'Content-Type': 'application/json',
    ...headers,
  }
}

export const AppsIO = (options: Options, ctx: Context) => {
  return {
    search: IntelligentSearch(options, ctx),
    reviewsAndRatings: ReviewsAndRatings(options, ctx),
  }
}
