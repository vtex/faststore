import { useSWRInfinite } from 'swr'
import type { SWRInfiniteConfigInterface } from 'swr'

import { request } from './request'
import type { RequestOptions } from './request'

export type QueryOptions = Omit<RequestOptions, 'variables'>

type GetVariablesForPageFn<D, V> = (
  index: number,
  previousPageData: D | null
) => V | null

export const useQueryInfinite = <Query = any, Variables = any>(
  queryOptions: QueryOptions,
  getVariablesForPage: GetVariablesForPageFn<Query, Variables>,
  config?: SWRInfiniteConfigInterface<Query> | undefined
) =>
  useSWRInfinite<Query>(
    (index, previousPageData) => {
      const variables = getVariablesForPage(index, previousPageData)

      return JSON.stringify(variables)
    },
    (variables: string) =>
      request<Query, Variables>({
        ...queryOptions,
        variables,
      }),
    config
  )
