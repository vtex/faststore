import type { GetServerSidePropsContext } from 'next'
import { ServerExecuteFunction } from '..'
import { gql } from '../../../@generated/gql'
import type {
  ValidateUserQuery,
  ValidateUserQueryVariables,
} from '../../../@generated/graphql'

const query = gql(`
  query ValidateUser {
    validateUser {
      isValid
    }
  }
`)

export async function serverValidateUser(context: GetServerSidePropsContext) {
  const validateUserResult = await ServerExecuteFunction<
    ValidateUserQueryVariables,
    ValidateUserQuery
  >(
    {
      variables: {},
      operation: query,
    },
    {
      headers: { ...context.req.headers },
    }
  )

  return validateUserResult?.data?.validateUser?.isValid
}
