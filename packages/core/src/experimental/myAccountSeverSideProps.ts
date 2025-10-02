import type { Locator } from '@vtex/client-cms'
import type { GetServerSideProps } from 'next'
import { gql } from '../../@generated/gql'
import type {
  ServerAccountPageQueryQuery,
  ServerAccountPageQueryQueryVariables,
} from '../../@generated/graphql'

import {
  getGlobalSectionsData,
  type GlobalSectionsData,
} from '../components/cms/GlobalSections'
import { getIsRepresentative } from '../sdk/account/getIsRepresentative'
import { execute } from '../server'

import storeConfig from '../../discovery.config'
import { validateUser } from '../sdk/account/validateUser'
import { injectGlobalSections } from '../server/cms/global'
import { getMyAccountRedirect } from '../utils/myAccountRedirect'

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

export const getServerSideProps: GetServerSideProps<
  MyAccountProps,
  Record<string, string>,
  Locator
> = async (context) => {
  const isValid = await validateUser(context)

  if (!isValid) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }

  const isRepresentative = getIsRepresentative({
    headers: context.req.headers as Record<string, string>,
    account: storeConfig.api.storeId,
  })

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
      accountName: account.data.accountProfile.name,
      isRepresentative,
    },
  }
}
