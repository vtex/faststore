import type {
  ValidateUserQuery,
  ValidateUserQueryVariables,
} from '@generated/graphql'
import type { Locator } from '@vtex/client-cms'
import { execute } from 'src/server'
import type { GetStaticPaths, GetStaticProps } from 'next'

import type { MyAccountProps } from 'src/experimental/myAccountSeverSideProps'
import { getMyAccountRedirect } from 'src/utils/myAccountRedirect'
import { gql } from '@generated/gql'

export default function Page() {
  return <></>
}

const validateUserQuery = gql(`
  query ValidateUser {
    validateUser {
      isValid
    }
  }
`)

export const getStaticProps: GetStaticProps<
  MyAccountProps,
  Record<string, string>,
  Locator
> = async () => {
  const validateUserResult = await execute<
    ValidateUserQueryVariables,
    ValidateUserQuery
  >({
    variables: {},
    operation: validateUserQuery,
  })

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
    query: {},
  })

  if (!isFaststoreMyAccountEnabled) {
    return { redirect }
  }

  return {
    redirect: {
      destination: '/account/404',
      permanent: false,
    },
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  }
}
