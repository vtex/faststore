import { print } from 'graphql'
import type { AsyncExecutor } from '@graphql-tools/delegate'

import { fetchGraphQL } from '../fetch'
import type { Options } from '../gatsby-node'

const getGraphQLUrl = ({ tenant, workspace }: Options) =>
  `http://${workspace}--${tenant}.myvtex.com/graphql`

export const getExecutor = (options: Options): AsyncExecutor => {
  const url = getGraphQLUrl(options)

  return ({ document, variables }) =>
    fetchGraphQL(url, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: print(document), variables }),
    })
}
