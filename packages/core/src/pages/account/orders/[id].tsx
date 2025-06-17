import type { Locator } from '@vtex/client-cms'
import type { GetServerSideProps } from 'next'
import { NextSeo } from 'next-seo'
import type { ComponentType } from 'react'
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
import { getIsRepresentative } from 'src/sdk/account/getIsRepresentative'
import { execute } from 'src/server'
import { injectGlobalSections } from 'src/server/cms/global'
import { getMyAccountRedirect } from 'src/utils/myAccountRedirect'
import storeConfig from '../../../../discovery.config'

const COMPONENTS: Record<string, ComponentType<any>> = {
  ...GLOBAL_COMPONENTS,
  ...CUSTOM_COMPONENTS,
}

type OrderDetailsPageProps = {
  order: ServerOrderDetailsQueryQuery['userOrder']
} & MyAccountProps

export default function OrderDetailsPage({
  globalSections,
  order,
  accountName,
  isRepresentative,
}: OrderDetailsPageProps) {
  return (
    <RenderSections
      globalSections={globalSections.sections}
      components={COMPONENTS}
    >
      <NextSeo noindex nofollow />

      <MyAccountLayout
        isRepresentative={isRepresentative}
        accountName={accountName}
      >
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
      canCancelOrder
      canProcessOrderAuthorization
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

  const {
    previewData,
    params: { id },
  } = context
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
    const statusCode: number = (orderDetails.errors[0] as any)?.extensions
      ?.status
    const destination: string =
      statusCode === 403 ? '/account/403' : '/account/404'

    return {
      redirect: {
        destination,
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
      order: orderDetails.data.userOrder,
      accountName: orderDetails.data.accountName,
      isRepresentative,
    },
  }
}
