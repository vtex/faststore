import { gql } from '@generated/gql'
import type {
  ValidateUserQuery,
  ValidateUserQueryVariables,
} from '@generated/graphql'
import type { GetServerSidePropsContext } from 'next'
import { execute } from 'src/server'

const query = gql(`
  query ValidateUser {
    validateUser {
      isValid
    }
  }
`)

export async function validateUser(context: GetServerSidePropsContext) {
  const validateUserResult = await execute<
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
