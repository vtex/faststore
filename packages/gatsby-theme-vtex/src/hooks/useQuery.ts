import { request, RequestOptions } from '@vtex/gatsby-plugin-graphql'
import useSWR, { ConfigInterface } from 'swr'

type QueryOptions = ConfigInterface & RequestOptions

const getKey = (options: QueryOptions) =>
  `${options.sha256Hash}::${JSON.stringify(options.variables)}`

export const useQuery = <Query extends any = any, Variables extends any = any>(
  options: QueryOptions
) =>
  useSWR<Query, any[]>(getKey(options), {
    fetcher: async () => {
      const { data, errors } = await request<Variables, Query>('/graphql/', {
        ...options,
        fetchOptions: {
          ...options.fetchOptions,
          headers: {
            'x-vtex-graphql-referer': window.location.host,
            ...options.fetchOptions?.headers,
          },
        },
      })

      if (errors?.length > 0) {
        throw errors[0]
      }

      return data
    },
    ...options,
  })
