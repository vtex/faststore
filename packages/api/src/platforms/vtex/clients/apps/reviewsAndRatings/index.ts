import type { ProductRating } from './types/ProductRating'
import type {
  CreateProductReviewInput,
  ProductReviewsInput,
  ProductReviewsResult,
} from './types/ProductReview'
import { adaptObject } from '../../../utils/adaptObject'
import { camelToSnakeCase } from '../../../utils/camelToSnakeCase'
import { NotAuthorizedError } from '../../../../errors'
import type { Context, Options } from '../../../'
import { buildHeaders, getAppIOBaseUrl } from '..'
import { fetchAPI } from '../../fetch'
import {
  getCookieFromRequestHeaders,
  getStoreCookie,
} from '../../../utils/cookies'

export const ReviewsAndRatings = (
  { account, environment }: Options,
  ctx: Context
) => {
  const baseUrl = `${getAppIOBaseUrl(account, environment)}/reviews-and-ratings/api`
  const storeCookies = getStoreCookie(ctx)

  return {
    rating: (productId: string): Promise<ProductRating> => {
      return fetchAPI(
        `${baseUrl}/rating/${productId}`,
        {
          headers: buildHeaders(),
        },
        {
          storeCookies,
        }
      )
    },
    reviews: {
      create: (input: CreateProductReviewInput): Promise<string> => {
        const authCookieKey: string = `VtexIdclientAutCookie_${account}`

        const authCookie = getCookieFromRequestHeaders(ctx, authCookieKey) ?? ''

        if (!authCookie) {
          throw new NotAuthorizedError('Missing auth cookie')
        }

        return fetchAPI(
          `${baseUrl}/review`,
          {
            headers: buildHeaders({ VtexIdclientAutCookie: authCookie }),
            body: JSON.stringify(input),
            method: 'POST',
          },
          { storeCookies }
        )
      },
      list: ({
        orderBy,
        orderWay,
        ...partialInput
      }: ProductReviewsInput): Promise<ProductReviewsResult> => {
        const formattedInput = adaptObject<string>(
          {
            orderBy: orderBy ? `${orderBy}:${orderWay ?? 'asc'}` : undefined,
            ...partialInput,
          },
          (_, value) => value !== undefined,
          camelToSnakeCase,
          String
        )

        const params = new URLSearchParams(formattedInput)

        return fetchAPI(
          `${baseUrl}/reviews?${params.toString()}`,
          {
            headers: buildHeaders(),
          },
          {
            storeCookies,
          }
        )
      },
    },
  }
}
