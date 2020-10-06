import { useSWRInfinite, SWRInfiniteConfigInterface } from 'swr'

import { request, RequestOptions } from './request'

export type QueryOptions = Omit<RequestOptions, 'variables'>

type GetVariablesForPageFn<D, V> = (
  index: number,
  previousPageData: D | null
) => V | null

export const useQueryInfinite = <
  Query extends any = any,
  Variables extends any = any
>(
  queryOptions: QueryOptions,
  getVariablesForPage: GetVariablesForPageFn<Query, Variables>,
  config?: SWRInfiniteConfigInterface<Query> | undefined
) =>
  useSWRInfinite<Query>(
    (index, previousPageData) => {
      const variables = getVariablesForPage(index, previousPageData)

      return JSON.stringify(variables)
    },
    (varStr: string) =>
      request<Query, Variables>({
        ...queryOptions,
        variables: JSON.parse(varStr),
      }),
    config
  )
