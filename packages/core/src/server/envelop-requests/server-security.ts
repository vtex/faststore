import { ServerExecuteFunction } from '..'
import { gql } from '../../../@generated/gql'
import type {
  ServerSecurityQuery,
  ServerSecurityQueryVariables,
} from '../../../@generated/graphql'

const query = gql(`
  query ServerSecurity {
    accountProfile {
      name
    }
    userDetails {
      email
    }
  }
`)

export function serverSecurityRequest(context: {
  req: { headers: Record<string, unknown> }
}) {
  return ServerExecuteFunction<
    ServerSecurityQueryVariables,
    ServerSecurityQuery
  >(
    {
      variables: {},
      operation: query,
    },
    { headers: { ...context.req.headers } }
  )
}
