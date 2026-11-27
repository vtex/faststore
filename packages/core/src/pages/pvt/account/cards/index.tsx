import type { Locator, Section } from '@vtex/client-cms'
import type { GetServerSideProps } from 'next'
import { NextSeo } from 'next-seo'
import type { ComponentType } from 'react'
import { Layout } from 'src/components/account'
import RenderSections, {
  RenderSectionsBase,
} from 'src/components/cms/RenderSections'
import ACCOUNT_COMPONENTS from 'src/components/cms/account/Components'
import GLOBAL_COMPONENTS from 'src/components/cms/global/Components'
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
import { getIsB2BBuyer } from 'src/sdk/account/getIsB2BBuyer'
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
    personalCards: listPersonalCreditCards {
      list {
        accountId
        bin
        cardNumber
        cardLabel
        paymentSystem
        paymentSystemName
        isDefault
        isActive
        origin
      }
    }
    sharedCards: listCreditCards {
      list {
        accountId
        bin
        cardNumber
        cardLabel
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
  isB2BBuyer,
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
          isB2BBuyer={isB2BBuyer}
          accountName={accountName}
          navigationLabels={navigationLabels}
        >
          <RenderSectionsBase
            skipLazyLoading
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
  const isB2BBuyer = getIsB2BBuyer({
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

  // Cards requires a unit/contract association, mirroring the sidebar gate in
  // account/Layout (ROUTES_ONLY_FOR_B2B_MEMBERS). This resolves O1: the
  // combinations without an association used to render a lone, inert Personal
  // tab over a list the Saved-cards service answers 500 for. Gated ahead of
  // the query so those buyers never trigger that call.
  if (!hasOrgAssociation) {
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

  // Each tab has its own query, backed by its own saved-cards route
  // (`listPersonalCreditCards` and `listCreditCards`), so they can fail
  // independently. A failure attributable to one field only empties and flags
  // that tab; `hasError` (whole page) is kept for failures that can't be
  // attributed to a single tab, or when both tabs failed.
  const queryErrors = (listCards.errors ?? []) as Array<{
    path?: ReadonlyArray<string | number>
  }>
  const failedFields = new Set(
    queryErrors.map((error) => error.path?.[0] as string | undefined)
  )
  const personalHasError = failedFields.has('personalCards')
  const sharedHasError = failedFields.has('sharedCards')
  const hasUnattributedError = queryErrors.some(
    (error) =>
      error.path?.[0] !== 'personalCards' && error.path?.[0] !== 'sharedCards'
  )
  const hasError = hasUnattributedError || (personalHasError && sharedHasError)

  if (queryErrors.length > 0) {
    console.error(...queryErrors)
  }

  // Auth failures still redirect (consistent with Orders), but only when the
  // whole page failed. A 401/403 that belongs to a single tab's query degrades
  // to that tab's error state instead of discarding the other tab's cards.
  // Anything else (e.g. the Saved-cards service being down) also renders the
  // page's own error state instead of a hard redirect (spec US-5) — the buyer
  // stays in My Account and can retry.
  const hasAuthError = queryErrors.some((error) => {
    const statusCode = extractStatusFromError(error)
    return statusCode === 403 || statusCode === 401
  })

  if (hasError && hasAuthError) {
    return {
      redirect: {
        destination: `/pvt/account/403?from=${encodeURIComponent('/pvt/account/cards')}`,
        permanent: false,
      },
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

  // A card present in both wallets is intentionally rendered in both tabs.
  const allPersonalCards =
    hasError || personalHasError
      ? []
      : (listCards.data?.personalCards?.list ?? [])
  // Defensive: keep only shared cards in the Shared tab, so a personal card
  // can never surface there without the Personal tab's gate.
  const sharedCards =
    hasError || sharedHasError
      ? []
      : (listCards.data?.sharedCards?.list ?? []).filter(
          (card) => card.origin === 'shared'
        )
  // Mirrors MyAccountListCards.tsx's `sharedOnly` exactly — that's the only
  // combination where the UI actually hides the Personal tab (spec
  // my-account-cards-gating-plan, O1). Stripping personalCards any time
  // `canViewPersonalCards` is false would also empty it for the two
  // "kept as-is" combinations (no `unitId`), which still render the tab and,
  // per FR-7, must never be subject to this check at all. Drop the data from
  // the SSR payload only when the chrome that would show it is gone too — an
  // always-false strip ships nothing extra, but a too-broad one silently
  // hides real cards from buyers this gate was never meant to touch.
  const sharedOnly = !canViewPersonalCards && hasOrgAssociation
  const personalCards = sharedOnly ? [] : allPersonalCards

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
        personalHasError,
        sharedHasError,
      },
      pageSections,
      isB2BBuyer,
    },
  }
}

export const getServerSideProps = withLocaleValidationSSR(
  getServerSidePropsBase
)
