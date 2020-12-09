import { request as baseRequest } from '@vtex/gatsby-plugin-graphql'
import type { RequestOptions as GraphQLRequestOptions } from '@vtex/gatsby-plugin-graphql'

export type RequestOptions = GraphQLRequestOptions

export const request = async <Query = any, Variables = any>(
  options: RequestOptions
) => {
  const { data, errors } = await baseRequest<Variables, Query>('/graphql/', {
    ...options,
    fetchOptions: {
      credentials: 'include',
      ...options.fetchOptions,
      headers: {
        'x-vtex-graphql-referer': window.location.host,
        ...options.fetchOptions?.headers,
      },
    },
  })

  if (errors?.length) {
    throw errors[0]
  }

  return data
}
