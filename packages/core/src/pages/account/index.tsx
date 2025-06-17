import { gql } from '@generated/gql'
import type {
  ValidateUserQuery,
  ValidateUserQueryVariables,
} from '@generated/graphql'
import type { GetServerSideProps, NextPage } from 'next'
import { execute } from 'src/server'
import { getMyAccountRedirect } from 'src/utils/myAccountRedirect'

const MyAccountRedirectPage: NextPage = () => {
  return null
}

const validateUserQuery = gql(`
  query ValidateUser {
    validateUser {
      isValid
    }
  }
`)

export const getServerSideProps: GetServerSideProps = async ({
  query,
  req,
}) => {
  const validateUserResult = await execute<
    ValidateUserQueryVariables,
    ValidateUserQuery
  >(
    {
      variables: {},
      operation: validateUserQuery,
    },
    {
      headers: { ...req.headers },
    }
  )

  const isValid = validateUserResult?.data?.validateUser?.isValid

  if (!isValid) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }

  const { isFaststoreMyAccountEnabled, redirect } = getMyAccountRedirect({
    query,
  })

  if (!isFaststoreMyAccountEnabled) {
    return { redirect }
  }

  return {
    redirect: {
      destination: '/account/profile',
      permanent: false,
    },
  }
}

export default MyAccountRedirectPage
