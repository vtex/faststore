import {
  request as baseRequest,
  RequestOptions as GraphQLRequestOptions,
} from '@vtex/gatsby-plugin-graphql'

export type RequestOptions = GraphQLRequestOptions

export const request = async <
  Query extends any = any,
  Variables extends any = any
>(
  options: RequestOptions
) => {
  const { data, errors } = await baseRequest<Variables, Query>('/graphql/', {
    ...options,
    fetchOptions: {
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
