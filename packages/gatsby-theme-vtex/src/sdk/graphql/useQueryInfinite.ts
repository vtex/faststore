import { useSWRInfinite, SWRInfiniteConfigInterface } from 'swr'
import { request, RequestOptions } from '@vtex/gatsby-plugin-graphql'

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
    async (varStr: string) => {
      const { data, errors } = await request<Variables, Query>('/graphql/', {
        ...queryOptions,
        fetchOptions: {
          ...queryOptions.fetchOptions,
          headers: {
            'x-vtex-graphql-referer': window.location.host,
            ...queryOptions.fetchOptions?.headers,
          },
        },
        variables: JSON.parse(varStr),
      })

      if (errors?.length) {
        throw errors[0]
      }

      return data
    },
    config
  )
