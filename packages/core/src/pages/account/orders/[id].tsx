import type { Locator } from '@vtex/client-cms'
import type { GetServerSideProps } from 'next'
import { NextSeo } from 'next-seo'
import { useEffect, type ComponentType } from 'react'
import { MyAccountLayout } from 'src/components/account'
import MyAccountOrderDetails from 'src/components/account/orders/MyAccountOrderDetails'
import RenderSections from 'src/components/cms/RenderSections'
import { default as GLOBAL_COMPONENTS } from 'src/components/cms/global/Components'
import CUSTOM_COMPONENTS from 'src/customizations/src/components'
import type { MyAccountProps } from 'src/experimental/myAccountSeverSideProps'

import { gql } from '@generated'
import type {
  ServerOrderDetailsQueryQuery,
  ServerOrderDetailsQueryQueryVariables,
} from '@generated/graphql'
import { getGlobalSectionsData } from 'src/components/cms/GlobalSections'
import { default as AfterSection } from 'src/customizations/src/myAccount/extensions/orders/[id]/after'
import { default as BeforeSection } from 'src/customizations/src/myAccount/extensions/orders/[id]/before'
import { execute } from 'src/server'
import { injectGlobalSections } from 'src/server/cms/global'
import { getMyAccountRedirect } from 'src/utils/myAccountRedirect'
import { extractStatusFromError } from 'src/utils/utilities'
import storeConfig from '../../../../discovery.config'

const COMPONENTS: Record<string, ComponentType<any>> = {
  ...GLOBAL_COMPONENTS,
  ...CUSTOM_COMPONENTS,
}

type OrderDetailsPageProps = {
  order: ServerOrderDetailsQueryQuery['userOrder']
  debugInfo?: any
} & MyAccountProps

export default function OrderDetailsPage({
  globalSections,
  order,
  accountName,
  debugInfo,
}: OrderDetailsPageProps) {
  // Log debug info no console do browser
  useEffect(() => {
    if (debugInfo) {
      console.log('🐛 Order Details Debug Info:', debugInfo)
    }
  }, [debugInfo])

  // Se estiver em modo debug, mostrar informações na tela
  if (debugInfo.errors) {
    return (
      <div
        style={{ padding: '20px', fontFamily: 'monospace', fontSize: '12px' }}
      >
        <h1>🐛 Debug Mode - Order Details Error</h1>
        <div
          style={{
            background: '#f5f5f5',
            padding: '10px',
            marginBottom: '20px',
          }}
        >
          <h3>Request Info:</h3>
          <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
        </div>

        {debugInfo.errors && (
          <div
            style={{
              background: '#ffe6e6',
              padding: '10px',
              marginBottom: '20px',
            }}
          >
            <h3>GraphQL Errors:</h3>
            <pre>{JSON.stringify(debugInfo.errors, null, 2)}</pre>
          </div>
        )}

        <div style={{ background: '#e6f3ff', padding: '10px' }}>
          <h3>Navigation Context:</h3>
          <p>
            <strong>Referer:</strong> {debugInfo.referer || 'None'}
          </p>
          <p>
            <strong>Has Cookies:</strong> {debugInfo.hasCookie ? 'Yes' : 'No'}
          </p>
          <p>
            <strong>Cookie Count:</strong> {debugInfo.cookieCount}
          </p>
          <p>
            <strong>Timestamp:</strong> {debugInfo.timestamp}
          </p>
          <p>
            <strong>Environment:</strong> {debugInfo.environment}
          </p>
        </div>

        <div style={{ marginTop: '20px' }}>
          <button onClick={() => window.history.back()}>← Go Back</button>
          <button
            onClick={() => window.location.reload()}
            style={{ marginLeft: '10px' }}
          >
            🔄 Reload
          </button>
        </div>
      </div>
    )
  }

  return (
    <RenderSections
      globalSections={globalSections.sections}
      components={COMPONENTS}
    >
      <NextSeo noindex nofollow />

      <MyAccountLayout accountName={accountName}>
        <BeforeSection />
        <MyAccountOrderDetails order={order} />
        <AfterSection />
      </MyAccountLayout>
    </RenderSections>
  )
}

export const fragment = gql(`
  fragment UserOrderItemsFragment on UserOrderItems {
    id
    name
    quantity
    sellingPrice
    unitMultiplier
    measurementUnit
    imageUrl
    detailUrl
    refId
    rewardValue
  }
`)

const query = gql(`
  query ServerOrderDetailsQuery($orderId: String!) {
    userOrder(orderId: $orderId) {
      orderId
      status
      statusDescription
      allowCancellation
      storePreferencesData {
        currencyCode
      }
      clientProfileData {
        firstName
        lastName
        email
        phone
        corporateName
        isCorporate
      }
      customFields {
        type
        id
        fields {
          name
          value
          refId
        }
      }
      deliveryOptionsData {
        deliveryOptions {
          selectedSla
          deliveryChannel
          deliveryCompany
          deliveryWindow {
            startDateUtc
            endDateUtc
            price
          }
          shippingEstimate
          shippingEstimateDate
          friendlyShippingEstimate
          friendlyDeliveryOptionName
          seller
          address {
            addressType
            receiverName
            addressId
            versionId
            entityId
            postalCode
            city
            state
            country
            street
            number
            neighborhood
            complement
            reference
            geoCoordinates
          }
          pickupStoreInfo {
            additionalInfo
            address {
              addressType
              receiverName
              addressId
              versionId
              entityId
              postalCode
              city
              state
              country
              street
              number
              neighborhood
              complement
              reference
              geoCoordinates
            }
            dockId
            friendlyName
            isPickupStore
          }
          quantityOfDifferentItems
          total
          items {
            id
            name
            quantity
            price
            imageUrl
            tax
            total
          }
        }
        contact {
          email
          phone
          name
        }
      }
      paymentData {
        transactions {
          isActive
          payments {
            id
            paymentSystemName
            value
            installments
            referenceValue
            lastDigits
            url
            group
            tid
            connectorResponses {
              authId
            }
            bankIssuedInvoiceIdentificationNumber
            redemptionCode
            paymentOrigin
          }
        }
      }
      totals {
        id
        name
        value
      }
    }
    accountName
  }
`)

export const getServerSideProps: GetServerSideProps<
  OrderDetailsPageProps,
  Record<string, string>,
  Locator
> = async (context) => {
  // TODO validate permissions here

  const { isFaststoreMyAccountEnabled, redirect } = getMyAccountRedirect({
    query: context.query,
  })

  if (!isFaststoreMyAccountEnabled) {
    return { redirect }
  }

  const {
    previewData,
    params: { id },
  } = context

  // Coletar informações de debug
  const debugInfo = {
    timestamp: new Date().toISOString(),
    orderId: id,
    referer: context.req.headers.referer,
    userAgent: context.req.headers['user-agent'],
    hasCookie: !!context.req.headers.cookie,
    VtexIdclientAutCookie: context.req.headers.cookie?.includes(
      `VtexIdclientAutCookie_${storeConfig.api.storeId}`
    )
      ? context.req.headers.cookie
          .split(';')
          .find((cookie) =>
            cookie
              .trim()
              .startsWith(`VtexIdclientAutCookie_${storeConfig.api.storeId}`)
          )
      : undefined,
    cookieCount: context.req.headers.cookie?.split(';').length || 0,
    method: context.req.method,
    url: context.req.url,
    host: context.req.headers.host,
    environment: process.env.NODE_ENV,
    headers: context.req.headers,
  }

  const [
    globalSectionsPromise,
    globalSectionsHeaderPromise,
    globalSectionsFooterPromise,
  ] = getGlobalSectionsData(previewData)

  const [
    orderDetails,
    globalSections,
    globalSectionsHeader,
    globalSectionsFooter,
  ] = await Promise.all([
    execute<
      ServerOrderDetailsQueryQueryVariables,
      ServerOrderDetailsQueryQuery
    >(
      {
        variables: { orderId: id },
        operation: query,
      },
      { headers: { ...context.req.headers } }
    ),
    globalSectionsPromise,
    globalSectionsHeaderPromise,
    globalSectionsFooterPromise,
  ])

  if (orderDetails.errors) {
    const errorDebugInfo = {
      ...debugInfo,
      errors: orderDetails.errors,
      graphqlResponse: {
        hasData: !!orderDetails.data,
        dataKeys: orderDetails.data ? Object.keys(orderDetails.data) : [],
        data: orderDetails.data,
      },
    }

    const status = extractStatusFromError(orderDetails.errors?.[0])

    // Se estiver em debug mode, não fazer redirect
    return {
      props: {
        globalSections: { sections: [] },
        order: null,
        accountName: '',
        debugInfo: errorDebugInfo,
      },
    }

    // const isForbidden = status === 403 || status === 401

    // return {
    //   redirect: {
    //     destination: isForbidden ? '/account/403' : '/account/404',
    //     permanent: false,
    //   },
    // }
  }

  const globalSectionsResult = injectGlobalSections({
    globalSections,
    globalSectionsHeader,
    globalSectionsFooter,
  })

  return {
    props: {
      globalSections: globalSectionsResult,
      order: orderDetails.data.userOrder,
      accountName: orderDetails.data.accountName,
      // Sempre passar debug info em produção para console logs
      debugInfo: {
        ...debugInfo,
        success: true,
        hasOrder: !!orderDetails.data.userOrder,
        hasAccountName: !!orderDetails.data.accountName,
      },
    },
  }
}
