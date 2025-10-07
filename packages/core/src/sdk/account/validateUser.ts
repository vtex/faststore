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
  try {
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

    if (validateUserResult?.errors && validateUserResult.errors.length > 0) {
      const hasUnauthorizedError = validateUserResult.errors.some(
        (error: any) => {
          const statusCode = error?.extensions?.status || error?.status
          const errorType = error?.extensions?.type
          return statusCode === 401 || errorType === 'UnauthorizedError'
        }
      )

      if (hasUnauthorizedError) {
        return {
          isValid: false,
          needsRefresh: true,
        }
      }

      // For other errors, return as invalid without refresh
      return {
        isValid: false,
        needsRefresh: false,
      }
    }

    return {
      isValid: !!validateUserResult?.data?.validateUser?.isValid,
      needsRefresh: false,
    }
  } catch (error: any) {
    const statusCode = error?.extensions?.status || error?.status
    const errorType = error?.extensions?.type

    if (statusCode === 401 || errorType === 'UnauthorizedError') {
      return {
        isValid: false,
        needsRefresh: true,
      }
    }

    // For other errors, return as invalid without refresh
    return {
      isValid: false,
      needsRefresh: false,
    }
  }
}
