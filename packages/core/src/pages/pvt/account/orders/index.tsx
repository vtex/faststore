import type { Locator } from '@vtex/client-cms'
import type { GetServerSideProps } from 'next'
import { NextSeo } from 'next-seo'
import type { ComponentType } from 'react'
import { MyAccountLayout } from 'src/components/account'
import RenderSections from 'src/components/cms/RenderSections'
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
import type { MyAccountProps } from 'src/experimental/myAccountSeverSideProps'
import { execute } from 'src/server'
import { injectGlobalSections } from 'src/server/cms/global'
import { getMyAccountRedirect } from 'src/utils/myAccountRedirect'
import { groupOrderStatusByLabel } from 'src/utils/userOrderStatus'

import storeConfig from 'discovery.config'
import { MyAccountListOrders } from 'src/components/account/orders/MyAccountListOrders'
import { getIsRepresentative } from 'src/sdk/account/getIsRepresentative'
import { validateUser } from 'src/sdk/account/validateUser'
import PageProvider from 'src/sdk/overrides/PageProvider'
import { extractStatusFromError } from 'src/utils/utilities'

/* A list of components that can be used in the CMS. */
const COMPONENTS: Record<string, ComponentType<any>> = {
  ...GLOBAL_COMPONENTS,
  ...CUSTOM_COMPONENTS,
}

type ListOrdersPageProps = {
  listOrders: ServerListOrdersQueryQuery['listUserOrders']
  total: number
  perPage: number
  filters: {
    page: number
    status: string[]
    dateInitial: string
    dateFinal: string
    text: string
    clientEmail: string
    purchaseAgentId?: string
  }
} & MyAccountProps

export default function ListOrdersPage({
  globalSections: globalSectionsProp,
  accountName,
  listOrders,
  total,
  perPage,
  filters,
  isRepresentative,
}: ListOrdersPageProps) {
  const { sections: globalSections, settings: globalSettings } =
    globalSectionsProp ?? {}

  return (
    <PageProvider context={{ globalSettings }}>
      <RenderSections globalSections={globalSections} components={COMPONENTS}>
        <NextSeo noindex nofollow />

        <MyAccountLayout
          isRepresentative={isRepresentative}
          accountName={accountName}
        >
          <BeforeSection />
          <MyAccountListOrders
            listOrders={listOrders}
            filters={filters}
            perPage={perPage}
            total={total}
          />
          <AfterSection />
        </MyAccountLayout>
      </RenderSections>
    </PageProvider>
  )
}

const query = gql(`
  query ServerListOrdersQuery ($page: Int,$perPage: Int, $status: [String], $dateInitial: String, $dateFinal: String, $text: String, $clientEmail: String) {
    listUserOrders (page: $page, perPage: $perPage, status: $status, dateInitial: $dateInitial, dateFinal: $dateFinal, text: $text, clientEmail: $clientEmail) {
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

  const { previewData } = context

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
  ] = getGlobalSectionsData(previewData)

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
  // TODO: Integration: ensure `purchaseAgentId` is mapped to `purchase_agent_id`
  // when calling the OMS API. Keep camelCase across the frontend.
  const purchaseAgentId =
    (context.query.purchaseAgentId as string | undefined) || ''

  // Map labels from FastStore status to API status
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
    listOrders,
    globalSections,
    globalSectionsHeader,
    globalSectionsFooter,
  ] = await Promise.all([
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

    const status = extractStatusFromError(listOrders.errors[0])
    const isForbidden = status === 403 || status === 401

    return {
      redirect: {
        destination: isForbidden ? '/pvt/account/403' : '/pvt/account/404',
        permanent: false,
      },
    }
  }

  const globalSectionsResult = injectGlobalSections({
    globalSections,
    globalSectionsHeader,
    globalSectionsFooter,
  })

  return {
    props: {
      globalSections: globalSectionsResult,
      accountName: listOrders.data.accountProfile.name,
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
        purchaseAgentId,
      },
      isRepresentative,
    },
  }
}
