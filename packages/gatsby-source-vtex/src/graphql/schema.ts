import { print } from 'graphql'
import type { AsyncExecutor } from '@graphql-tools/delegate'
import { introspectSchema } from '@graphql-tools/wrap'

import { fetchGraphQL } from '../fetch'
import type { Options } from '../gatsby-node'

export const getGraphQLUrl = (tenant: string, workspace: string) =>
  `http://${workspace}--${tenant}.myvtex.com/graphql`

export const getExecutor = ({ tenant, workspace }: Options) => {
  const endpoint = getGraphQLUrl(tenant, workspace)
  const executor: AsyncExecutor = ({ document, variables, info }) => {
    return fetchGraphQL<any>(endpoint, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: print(document),
        variables,
        operatioName: info?.operation.name?.value,
      }),
    })
  }

  return executor
}

export const getGatewaySchema = (options: Options) =>
  introspectSchema(getExecutor(options))
