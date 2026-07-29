import type { Locator, Section } from '@vtex/client-cms'
import type { GetServerSideProps } from 'next'
import { NextSeo } from 'next-seo'
import type { ComponentType } from 'react'
import { Layout } from 'src/components/account'
import RenderSections, {
  RenderSectionsBase,
} from 'src/components/cms/RenderSections'
import ACCOUNT_COMPONENTS from 'src/components/cms/account/Components'
import { default as GLOBAL_COMPONENTS } from 'src/components/cms/global/Components'
import CUSTOM_COMPONENTS from 'src/customizations/src/components'

import { getGlobalSectionsData } from 'src/components/cms/GlobalSections'

import { gql } from '@generated/gql'
import type {
  ServerListCardsQueryQuery,
  ServerListCardsQueryQueryVariables,
} from '@generated/graphql'
import type { MyAccountProps } from 'src/experimental/myAccountServerSideProps'
import type { AccountCardsPageData } from 'src/sdk/account/accountPageContext'
import type { AccountNavigationLabels } from 'src/sdk/account/getMyAccountRoutes'
import { getB2BSessionClaims } from 'src/sdk/account/getB2BSessionClaims'
import { getIsRepresentative } from 'src/sdk/account/getIsRepresentative'
import { execute } from 'src/server'
import { injectGlobalSections } from 'src/server/cms/global'
import { extractAccountNavigationData } from 'src/server/cms/myAccountDefaultSections'
import { fetchMyAccountPageContent } from 'src/server/cms/fetchMyAccountPageContent'
import { withLocaleValidationSSR } from 'src/utils/localization/withLocaleValidation'
import { getMyAccountRedirect } from 'src/utils/myAccountRedirect'

import storeConfig from 'discovery.config'
import PageProvider from 'src/sdk/overrides/PageProvider'
import { extractStatusFromError } from 'src/utils/utilities'

const COMPONENTS: Record<string, ComponentType<any>> = {
  ...GLOBAL_COMPONENTS,
  ...CUSTOM_COMPONENTS,
}

const query = gql(`
  query ServerListCardsQuery {
    listCreditCards {
      list {
        accountId
        bin
        cardNumber
        paymentSystem
        paymentSystemName
        isDefault
        isActive
      }
    }
    accountProfile {
      name
    }
  }
`)

type ListCardsPageProps = {
  pageSections: Section[]
  navigationLabels: AccountNavigationLabels
  accountPageData: AccountCardsPageData
  hasAdHocCardAccess: boolean
} & MyAccountProps

export default function ListCardsPage({
  globalSections: globalSectionsProp,
  pageSections,
  navigationLabels,
  accountPageData,
  accountName,
  isRepresentative,
  hasAdHocCardAccess,
}: ListCardsPageProps) {
  const { sections: globalSections, settings: globalSettings } =
    globalSectionsProp ?? {}

  return (
    <PageProvider
      context={{
        globalSettings,
        accountPageData,
        navigationLabels,
      }}
    >
      <RenderSections globalSections={globalSections} components={COMPONENTS}>
        <NextSeo noindex nofollow />

        <Layout
          isRepresentative={isRepresentative}
          hasAdHocCardAccess={hasAdHocCardAccess}
          accountName={accountName}
          navigationLabels={navigationLabels}
        >
          <RenderSectionsBase
            sections={pageSections}
            components={ACCOUNT_COMPONENTS}
          />
        </Layout>
      </RenderSections>
    </PageProvider>
  )
}

const getServerSidePropsBase: GetServerSideProps<
  ListCardsPageProps,
  Record<string, string>,
  Locator
> = async (context) => {
  const isRepresentative = getIsRepresentative({
    headers: context.req.headers as Record<string, string>,
    account: storeConfig.api.storeId,
  })

  const { hasOrgAssociation, hasAdHocCardAccess } = getB2BSessionClaims({
    headers: context.req.headers as Record<string, string>,
    account: storeConfig.api.storeId,
  })

  const contentContext = {
    previewData: context.previewData,
    locale: context.locale,
  }

  const { isFaststoreMyAccountEnabled, redirect } = getMyAccountRedirect({
    query: context.query,
  })

  if (!isFaststoreMyAccountEnabled) {
    return { redirect }
  }

  // Gated route (spec US-4): Unit/Contract-affiliated buyers without
  // `useAdHocCard` don't get a page-level error — the route is simply
  // treated as not found, same as other My Account access-denied flows.
  if (hasOrgAssociation && !hasAdHocCardAccess) {
    return {
      redirect: {
        destination: '/pvt/account/404',
        permanent: false,
      },
    }
  }

  const [
    globalSectionsPromise,
    globalSectionsHeaderPromise,
    globalSectionsFooterPromise,
  ] = getGlobalSectionsData(contentContext)

  const [
    pageContent,
    listCards,
    globalSections,
    globalSectionsHeader,
    globalSectionsFooter,
  ] = await Promise.all([
    fetchMyAccountPageContent(
      'myAccountCards',
      contentContext,
      '/pvt/account/cards'
    ),
    execute<ServerListCardsQueryQueryVariables, ServerListCardsQueryQuery>(
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

  const hasError = !!listCards.errors

  if (hasError) {
    console.error(...listCards.errors!)

    const statusCode = extractStatusFromError(listCards.errors![0])

    // Auth failures still redirect (consistent with Orders); anything else
    // (e.g. the Saved-cards service being down) renders the page's own error
    // state instead of a hard redirect (spec US-5) — the buyer stays in My
    // Account and can retry.
    if (statusCode === 403 || statusCode === 401) {
      return {
        redirect: {
          destination: `/pvt/account/403?from=${encodeURIComponent('/pvt/account/cards')}`,
          permanent: false,
        },
      }
    }
  }

  const { pageSections, navigationData } = extractAccountNavigationData(
    pageContent.sections
  )

  const globalSectionsResult = injectGlobalSections({
    globalSections,
    globalSectionsHeader,
    globalSectionsFooter,
  })

  return {
    props: {
      globalSections: globalSectionsResult,
      accountName: listCards.data?.accountProfile.name ?? '',
      navigationLabels: navigationData as AccountNavigationLabels,
      accountPageData: {
        personalCards: hasError
          ? []
          : (listCards.data?.listCreditCards?.list ?? []),
        // Shared cards data source is blocked pending confirmation from
        // Nicholas (spec US-2) — stubbed empty until the BFF/API side lands.
        sharedCards: [],
        hasOrgAssociation,
        hasError,
      },
      pageSections,
      isRepresentative,
      hasAdHocCardAccess,
    },
  }
}

export const getServerSideProps = withLocaleValidationSSR(
  getServerSidePropsBase
)
