import { gql } from '@generated/gql'
import type {
  ServerAccountPageQueryQuery,
  ServerAccountPageQueryQueryVariables,
} from '@generated/graphql'
import type { Locator } from '@vtex/client-cms'
import type { GetServerSideProps } from 'next'

import {
  type GlobalSectionsData,
  getGlobalSectionsData,
} from 'src/components/cms/GlobalSections'
import { execute } from 'src/server'

import { injectGlobalSections } from 'src/server/cms/global'
import { getMyAccountRedirect } from 'src/utils/myAccountRedirect'
import type {
  ValidateUserQuery,
  ValidateUserQueryVariables,
} from '@generated/graphql'

export type MyAccountProps = {
  globalSections: GlobalSectionsData
  accountName: string
}

const query = gql(`
  query ServerAccountPageQuery {
    accountName
  }
`)

const validateUserQuery = gql(`
  query ValidateUser {
    validateUser {
      isValid
    }
  }
`)

export const getServerSideProps: GetServerSideProps<
  MyAccountProps,
  Record<string, string>,
  Locator
> = async (context) => {
  const validateUserResult = await execute<
    ValidateUserQueryVariables,
    ValidateUserQuery
  >(
    {
      variables: {},
      operation: validateUserQuery,
    },
    {
      headers: { ...context.req.headers },
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
    query: context.query,
  })

  if (!isFaststoreMyAccountEnabled) {
    return { redirect }
  }

  const [
    globalSectionsPromise,
    globalSectionsHeaderPromise,
    globalSectionsFooterPromise,
  ] = getGlobalSectionsData(context.previewData)

  const [account, globalSections, globalSectionsHeader, globalSectionsFooter] =
    await Promise.all([
      execute<
        ServerAccountPageQueryQueryVariables,
        ServerAccountPageQueryQuery
      >(
        {
          variables: {},
          operation: query,
        },
        { headers: { ...context.req.headers } }
      ),
      globalSectionsPromise,
      globalSectionsHeaderPromise,
      globalSectionsFooterPromise,
    ])

  const globalSectionsResult = injectGlobalSections({
    globalSections,
    globalSectionsHeader,
    globalSectionsFooter,
  })

  return {
    props: {
      globalSections: globalSectionsResult,
      accountName: account.data.accountName,
    },
  }
}
