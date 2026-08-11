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
        origin
      }
    }
    accountProfile {
      name
    }
    hasAdHocCardAccess
  }
`)

type ListCardsPageProps = {
  pageSections: Section[]
  navigationLabels: AccountNavigationLabels
  accountPageData: AccountCardsPageData
} & MyAccountProps

export default function ListCardsPage({
  globalSections: globalSectionsProp,
  pageSections,
  navigationLabels,
  accountPageData,
  accountName,
  isRepresentative,
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

  const { hasOrgAssociation, hasCustomerId } = getB2BSessionClaims({
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

  // `useAdHocCard` does not gate access to the Cards route (spec
  // my-account-cards-gating-plan, the rectified model) — it, together with
  // `customerId`, gates visibility of the Personal tab only. The route always
  // stays reachable and the sidebar entry always stays visible; there is no
  // redirect and no menu hiding. Default to allowed so a query failure renders
  // the page's own error state instead of hiding the Personal tab.
  const hasAdHocCardAccess = listCards.data?.hasAdHocCardAccess ?? true
  const canViewPersonalCards = hasCustomerId && hasAdHocCardAccess

  const { pageSections, navigationData } = extractAccountNavigationData(
    pageContent.sections
  )

  const globalSectionsResult = injectGlobalSections({
    globalSections,
    globalSectionsHeader,
    globalSectionsFooter,
  })

  // The Saved-cards service returns personal and shared cards merged into one
  // list, each tagged `origin` (spec my-account-cards-shared-listing-unblock).
  // Partition here rather than de-duplicating: a card present under both
  // origins is intentionally rendered in both tabs.
  const allCards = hasError ? [] : (listCards.data?.listCreditCards?.list ?? [])
  const personalCards = allCards.filter((card) => card.origin === 'personal')
  const sharedCards = allCards.filter((card) => card.origin === 'shared')

  return {
    props: {
      globalSections: globalSectionsResult,
      accountName: listCards.data?.accountProfile.name ?? '',
      navigationLabels: navigationData as AccountNavigationLabels,
      accountPageData: {
        personalCards,
        sharedCards,
        hasOrgAssociation,
        canViewPersonalCards,
        hasError,
      },
      pageSections,
      isRepresentative,
    },
  }
}

export const getServerSideProps = withLocaleValidationSSR(
  getServerSidePropsBase
)
