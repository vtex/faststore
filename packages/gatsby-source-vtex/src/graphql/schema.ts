import { print } from 'graphql'
import { introspectSchema } from '@graphql-tools/wrap'
import type { AsyncExecutor } from '@graphql-tools/delegate'

import { fetchGraphQL } from '../fetch'
import type { Options } from '../gatsby-node'

export const getGraphQLUrl = (tenant: string, workspace: string) =>
  `http://${workspace}--${tenant}.myvtex.com/graphql`

export const getExecutor = ({ tenant, workspace }: Options): AsyncExecutor => {
  const endpoint = getGraphQLUrl(tenant, workspace)

  return ({ document, variables, info }) => {
    const query = print(document)

    return fetchGraphQL<any>(endpoint, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables,
        operatioName: info?.operation.name?.value,
      }),
    })
  }
}

export const getGatewaySchema = async (options: Options) =>
  introspectSchema(getExecutor(options))
