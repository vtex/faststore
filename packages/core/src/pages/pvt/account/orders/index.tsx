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
  ServerListOrdersQueryQuery,
  ServerListOrdersQueryQueryVariables,
} from '@generated/graphql'
import { default as AfterSection } from 'src/customizations/src/myAccount/extensions/orders/after'
import { default as BeforeSection } from 'src/customizations/src/myAccount/extensions/orders/before'
import type { MyAccountProps } from 'src/experimental/myAccountServerSideProps'
import type { AccountOrdersListPageData } from 'src/sdk/account/accountPageContext'
import type { AccountNavigationLabels } from 'src/sdk/account/getMyAccountRoutes'
import { getIsRepresentative } from 'src/sdk/account/getIsRepresentative'
import { execute } from 'src/server'
import { injectGlobalSections } from 'src/server/cms/global'
import { extractAccountNavigationData } from 'src/server/cms/myAccountDefaultSections'
import { fetchMyAccountPageContent } from 'src/server/cms/fetchMyAccountPageContent'
import { withLocaleValidationSSR } from 'src/utils/localization/withLocaleValidation'
import { getMyAccountRedirect } from 'src/utils/myAccountRedirect'
import { groupOrderStatusByLabel } from 'src/utils/userOrderStatus'

import storeConfig from 'discovery.config'
import PageProvider from 'src/sdk/overrides/PageProvider'
import { extractStatusFromError } from 'src/utils/utilities'

const COMPONENTS: Record<string, ComponentType<any>> = {
  ...GLOBAL_COMPONENTS,
  ...CUSTOM_COMPONENTS,
}

type ListOrdersPageProps = {
  pageSections: Section[]
  navigationLabels: AccountNavigationLabels
  accountPageData: AccountOrdersListPageData
} & MyAccountProps

export default function ListOrdersPage({
  globalSections: globalSectionsProp,
  pageSections,
  navigationLabels,
  accountPageData,
  accountName,
  isRepresentative,
}: ListOrdersPageProps) {
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
          <BeforeSection />
          <RenderSectionsBase
            sections={pageSections}
            components={ACCOUNT_COMPONENTS}
          />
          <AfterSection />
        </Layout>
      </RenderSections>
    </PageProvider>
  )
}

const query = gql(`
  query ServerListOrdersQuery ($page: Int,$perPage: Int, $status: [String], $dateInitial: String, $dateFinal: String, $text: String, $clientEmail: String, $pendingMyApproval: Boolean) {
    listUserOrders (page: $page, perPage: $perPage, status: $status, dateInitial: $dateInitial, dateFinal: $dateFinal, text: $text, clientEmail: $clientEmail, pendingMyApproval: $pendingMyApproval) {
      list {
        orderId
        creationDate
        clientName
        items {
          seller
          quantity
          description
          ean
          refId
          id
          productId
          sellingPrice
          price
        }
        totalValue
        status
        statusDescription
        ShippingEstimatedDate
        currencyCode
        customFields {
          type
          value
        }
      }
      paging {
        total
        pages
        currentPage
        perPage
      }
    }
    accountProfile {
      name
    }
  }
`)

const getServerSidePropsBase: GetServerSideProps<
  ListOrdersPageProps,
  Record<string, string>,
  Locator
> = async (context) => {
  const isRepresentative = getIsRepresentative({
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

  const page = Number(context.query.page as string | undefined) || 1
  const perPage = 25 // TODO: make this configurable
  const status =
    (Array.isArray(context.query.status)
      ? context.query.status
      : [context.query.status]
    ).filter(Boolean) || []
  const dateInitial = (context.query.dateInitial as string | undefined) || ''
  const dateFinal = (context.query.dateFinal as string | undefined) || ''
  const text = (context.query.text as string | undefined) || ''
  const clientEmail = (context.query.clientEmail as string | undefined) || ''
  const pendingMyApproval = context.query.pendingMyApproval === 'true'

  const groupedStatus = groupOrderStatusByLabel()
  const allStatuses =
    status
      .reduce((acc, item) => {
        const statusGroup = Object.entries(groupedStatus).find(
          ([key]) => key.toLowerCase() === item.toLowerCase()
        )
        if (statusGroup) {
          const [, statusValues] = statusGroup
          return [...acc, ...statusValues]
        }
        return acc
      }, [] as string[])
      .filter(Boolean) || []

  const [
    pageContent,
    listOrders,
    globalSections,
    globalSectionsHeader,
    globalSectionsFooter,
  ] = await Promise.all([
    fetchMyAccountPageContent(
      'myaccountorders',
      contentContext,
      '/pvt/account/orders'
    ),
    execute<ServerListOrdersQueryQueryVariables, ServerListOrdersQueryQuery>(
      {
        variables: {
          page,
          perPage,
          status: allStatuses,
          dateInitial,
          dateFinal,
          text,
          clientEmail,
          pendingMyApproval,
        },
        operation: query,
      },
      { headers: { ...context.req.headers } }
    ),
    globalSectionsPromise,
    globalSectionsHeaderPromise,
    globalSectionsFooterPromise,
  ])

  if (listOrders.errors) {
    console.error(...listOrders.errors)

    const statusCode = extractStatusFromError(listOrders.errors[0])

    const destination =
      statusCode === 403 || statusCode === 401
        ? `/pvt/account/403?from=${encodeURIComponent('/pvt/account/orders')}`
        : '/pvt/account/404'

    return {
      redirect: {
        destination,
        permanent: false,
      },
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
      accountName: listOrders.data.accountProfile.name ?? '',
      navigationLabels: navigationData as AccountNavigationLabels,
      accountPageData: {
        listOrders: listOrders.data.listUserOrders,
        total: listOrders.data.listUserOrders.paging.total,
        perPage: listOrders.data.listUserOrders.paging.perPage,
        filters: {
          page: listOrders.data.listUserOrders.paging.currentPage ?? page,
          status,
          dateInitial,
          dateFinal,
          text,
          clientEmail,
          pendingMyApproval,
        },
      },
      pageSections,
      isRepresentative,
    },
  }
}

export const getServerSideProps = withLocaleValidationSSR(
  getServerSidePropsBase
)
