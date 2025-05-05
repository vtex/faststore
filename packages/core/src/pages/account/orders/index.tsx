/* ######################################### */
/* Mocked Page until development is finished, it will be removed after */

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

/* A list of components that can be used in the CMS. */
const COMPONENTS: Record<string, ComponentType<any>> = {
  ...GLOBAL_COMPONENTS,
  ...CUSTOM_COMPONENTS,
}

type ListOrdersPageProps = {
  listOrders: ServerListOrdersQueryQuery['listUserOrders']
} & MyAccountProps

export default function ListOrders({
  globalSections,
  listOrders,
}: ListOrdersPageProps) {
  return (
    <RenderSections
      globalSections={globalSections.sections}
      components={COMPONENTS}
    >
      <NextSeo noindex nofollow />

      <MyAccountLayout>
        <BeforeSection />
        <div>
          <h1>List Orders</h1>
          <p>Orders: {JSON.stringify(listOrders, null, 2)}</p>
          <p>Orders count: {listOrders?.list?.length}</p>
        </div>
        <AfterSection />
      </MyAccountLayout>
    </RenderSections>
  )
}

const query = gql(`
  query ServerListOrdersQuery {
    listUserOrders {
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
        paymentNames
        status
        statusDescription
        marketPlaceOrderId
        sequence
        salesChannel
        affiliateId
        origin
        workflowInErrorState
        workflowInRetry
        lastMessageUnread
        ShippingEstimatedDate
        ShippingEstimatedDateMax
        ShippingEstimatedDateMin
        orderIsComplete
        listId
        listType
        authorizedDate
        callCenterOperatorName
        totalItems
        currencyCode
        hostname
        invoiceOutput
        invoiceInput
        lastChange
        isAllDelivered
        isAnyDelivered
        giftCardProviders
        orderFormId
        paymentApprovedDate
        readyForHandlingDate
        deliveryDates
      }
      paging {
        total
        pages
        currentPage
        perPage
      }
      stats {
        stats {
          totalValue {
            Count
            Max
            Mean
            Min
            Missing
            StdDev
            Sum
            SumOfSquares
            Facets
          }
          totalItems {
            Count
            Max
            Mean
            Min
            Missing
            StdDev
            Sum
            SumOfSquares
            Facets
          }
        }
      }
      facets
      reportRecordsLimit
    }
  }
`)

export const getServerSideProps: GetServerSideProps<
  MyAccountProps,
  Record<string, string>,
  Locator
> = async (context) => {
  // TODO validate permissions here

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

  const [
    listOrders,
    globalSections,
    globalSectionsHeader,
    globalSectionsFooter,
  ] = await Promise.all([
    execute<ServerListOrdersQueryQueryVariables, ServerListOrdersQueryQuery>(
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

  if (listOrders.errors) {
    return {
      notFound: true,
    }
  }

  // TODO handle 404 when listOrders request is made
  // if (listOrders.errors) {
  //   return {
  //     redirect: {
  //       destination: '/account/404',
  //       permanent: false,
  //     },
  //   }
  // }

  const globalSectionsResult = injectGlobalSections({
    globalSections,
    globalSectionsHeader,
    globalSectionsFooter,
  })

  return {
    props: {
      globalSections: globalSectionsResult,
      listOrders: listOrders.data.listUserOrders,
    },
  }
}
