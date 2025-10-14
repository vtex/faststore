import { ServerExecuteFunction } from '../'
import { gql } from '../../../@generated/gql'
import type {
  ServerUserDetailsQueryQuery,
  ServerUserDetailsQueryQueryVariables,
} from '../../../@generated/graphql'

const query = gql(`
  query ServerUserDetailsQuery {
    accountProfile {
      name
    }
    userDetails {
      name
      email
      role
      orgUnit
    }
  }
`)

export function serverUserDetailsRequest(context: {
  req: { headers: Record<string, unknown> }
}) {
  return ServerExecuteFunction<
    ServerUserDetailsQueryQueryVariables,
    ServerUserDetailsQueryQuery
  >(
    {
      variables: {},
      operation: query,
    },
    {
      headers: { ...context.req.headers },
    }
  )
}
