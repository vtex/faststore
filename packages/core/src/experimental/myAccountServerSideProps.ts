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
import { getIsRepresentative } from 'src/sdk/account/getIsRepresentative'
import { execute } from 'src/server'

import { validateUser } from 'src/sdk/account/validateUser'
import { injectGlobalSections } from 'src/server/cms/global'
import { getMyAccountRedirect } from 'src/utils/myAccountRedirect'
import { withLocaleValidationSSR } from 'src/utils/withLocaleValidation'
import storeConfig from '../../discovery.config'

export type MyAccountProps = {
  globalSections: GlobalSectionsData
  accountName: string
  isRepresentative?: boolean
}

const query = gql(`
  query ServerAccountPageQuery {
    accountProfile {
      name
    }
  }
`)

const getServerSidePropsBase: GetServerSideProps<
  MyAccountProps,
  Record<string, string>,
  Locator
> = async (context) => {
  const validationResult = await validateUser(context)

  // Guard clause: Early redirect to login if user is invalid and doesn't need refresh
  if (!validationResult.isValid && !validationResult.needsRefresh) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }

  // Handle refresh token case with minimal props
  if (!validationResult.isValid && validationResult.needsRefresh) {
    const currentPath = context.req.url || '/pvt/account'
    return {
      redirect: {
        destination: `/pvt/account/403?from=${encodeURIComponent(currentPath)}`,
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

  const isRepresentative = getIsRepresentative({
    headers: context.req.headers as Record<string, string>,
    account: storeConfig.api.storeId,
  })

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
      accountName: account.data.accountProfile.name,
      isRepresentative,
    },
  }
}

export const getServerSideProps = withLocaleValidationSSR(
  getServerSidePropsBase
)
