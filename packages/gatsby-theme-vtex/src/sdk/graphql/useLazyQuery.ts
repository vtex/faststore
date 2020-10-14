import { request, RequestOptions } from '@vtex/gatsby-plugin-graphql'
import useSWR, { ConfigInterface } from 'swr'

type QueryOptions = ConfigInterface & RequestOptions

// TODO: Change here
const getKey = (options: QueryOptions) =>
  `${options.sha256Hash}::${JSON.stringify(options.variables)}`

export const useLazyQuery = <
  Query extends any = any,
  Variables extends any = any
>(
  options: QueryOptions
) => {
  const response = useSWR<Query | null, any[]>(getKey(options), () => null, {
    revalidateOnFocus: false,
  })

  const execute = async (variables: Variables) => {
    const { data } = await request<Variables, Query>('/graphql/', {
      ...options,
      variables,
      fetchOptions: {
        ...options.fetchOptions,
        headers: {
          'x-vtex-graphql-referer': window.location.host,
          ...options.fetchOptions?.headers,
        },
      },
    })

    response.mutate(data, false)
  }

  return [execute, response] as [typeof execute, typeof response]
}
