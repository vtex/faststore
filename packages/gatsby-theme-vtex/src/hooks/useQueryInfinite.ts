import { useSWRInfinite, SWRInfiniteConfigInterface } from 'swr'
import { request, RequestOptions } from '@vtex/gatsby-plugin-graphql'

type QueryOptions = Omit<RequestOptions, 'variables'>

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
  config?: SWRInfiniteConfigInterface | undefined
) =>
  useSWRInfinite<Query>(
    (index, previousPageData) => {
      const variables = getVariablesForPage(index, previousPageData)

      return JSON.stringify(variables)
    },
    async (varStr: string) => {
      const { data, errors } = await request<Variables, Query>('/graphql/', {
        ...queryOptions,
        variables: JSON.parse(varStr),
      })

      if (errors?.length) {
        throw errors
      }

      return data
    },
    config
  )
