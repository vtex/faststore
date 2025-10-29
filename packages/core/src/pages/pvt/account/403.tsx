import type { Locator } from '@vtex/client-cms'
import type { GetServerSideProps } from 'next'
import { NextSeo } from 'next-seo'
import type { ComponentType } from 'react'
import {
  type GlobalSectionsData,
  getGlobalSectionsData,
} from 'src/components/cms/GlobalSections'

import { LinkButton } from '@faststore/ui'
import { gql } from '@generated/gql'
import type {
  ServerAccountPageQueryQuery,
  ServerAccountPageQueryQueryVariables,
} from '@generated/graphql'
import { MyAccountLayout } from 'src/components/account'
import { default as GLOBAL_COMPONENTS } from 'src/components/cms/global/Components'
import RenderSections from 'src/components/cms/RenderSections'
import { OverriddenDefaultEmptyState as EmptyState } from 'src/components/sections/EmptyState/OverriddenDefaultEmptyState'
import CUSTOM_COMPONENTS from 'src/customizations/src/components'
import PLUGINS_COMPONENTS from 'src/plugins'
import { useRefreshToken } from 'src/sdk/account/useRefreshToken'
import PageProvider from 'src/sdk/overrides/PageProvider'
import { execute } from 'src/server'
import { injectGlobalSections } from 'src/server/cms/global'
import { getMyAccountRedirect } from 'src/utils/myAccountRedirect'

import storeConfig from 'discovery.config'

/* A list of components that can be used in the CMS. */
const COMPONENTS: Record<string, ComponentType<any>> = {
  ...GLOBAL_COMPONENTS,
  ...PLUGINS_COMPONENTS,
  ...CUSTOM_COMPONENTS,
}

type Props = {
  globalSections?: GlobalSectionsData
  accountName?: ServerAccountPageQueryQuery['accountProfile']['name']
  needsRefreshToken?: boolean
  fromPage?: string
}

function Page({
  globalSections: globalSectionsProp,
  accountName,
  needsRefreshToken,
  fromPage,
}: Props) {
  const { sections: globalSections, settings: globalSettings } =
    globalSectionsProp ?? { sections: [], settings: {} }

  // Use the new hook to handle refresh token with session management
  const { shouldShow403 } = useRefreshToken(needsRefreshToken, fromPage)

  // Handle refresh token case - show loading while attempting refresh
  if (needsRefreshToken && !shouldShow403) {
    console.info('Refreshing authentication...')
    return <></>
  }

  // Show 403 page if refresh failed or if we don't need refresh token
  return (
    <PageProvider context={{ globalSettings }}>
      <RenderSections globalSections={globalSections} components={COMPONENTS}>
        <NextSeo noindex nofollow />

        <MyAccountLayout accountName={accountName}>
          <EmptyState
            title="Unauthorized Access"
            titleIcon={{ icon: 'ShoppingCart', alt: 'Shopping Cart' }}
            subtitle="You don't have permission to access this page."
            showLoader={false}
          >
            <LinkButton variant="secondary" href="/pvt/account">
              Back to Account
            </LinkButton>
          </EmptyState>
        </MyAccountLayout>
      </RenderSections>
    </PageProvider>
  )
}

const query = gql(`
  query ServerAccountPageQuery {
    accountProfile {
      name
    }
  }
`)

export const getServerSideProps: GetServerSideProps<
  Props,
  Record<string, string>,
  Locator
> = async (context) => {
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

  if (account.errors) {
    console.error(...account.errors)

    const statusCode: number = (account.errors[0] as any)?.extensions?.status

    const fromPage =
      typeof context.query.from === 'string' ? context.query.from : ''

    return {
      props: {
        globalSections: globalSectionsResult,
        needsRefreshToken:
          (statusCode === 401 || statusCode === 403) &&
          storeConfig.experimental?.refreshToken,
        fromPage,
      },
    }
  }

  const { isFaststoreMyAccountEnabled, redirect } = getMyAccountRedirect({
    query: context.query,
  })

  if (!isFaststoreMyAccountEnabled) {
    return { redirect }
  }

  return {
    props: {
      // The sections from the CMS page are not utilized here for the My Account page.
      globalSections: globalSectionsResult,
      accountName: account?.data?.accountProfile?.name ?? '',
    },
  }
}

export default Page
