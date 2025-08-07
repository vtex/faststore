import type { Locator } from '@vtex/client-cms'
import type { GetServerSideProps } from 'next'
import { NextSeo } from 'next-seo'
import type { ComponentType } from 'react'
import { MyAccountLayout } from '../../../components/account'
import MyAccountOrderDetails from '../../../components/account/orders/MyAccountOrderDetails'
import RenderSections from '../../../components/cms/RenderSections'
import { default as GLOBAL_COMPONENTS } from '../../../components/cms/global/Components'
import CUSTOM_COMPONENTS from '../../../customizations/src/components'
import type { MyAccountProps } from '../../../experimental/myAccountSeverSideProps'
import { validateUser } from '../../../sdk/account/validateUser'

import { gql } from '../../../../@generated'
import type {
  ServerOrderDetailsQueryQuery,
  ServerOrderDetailsQueryQueryVariables,
} from '../../../../@generated/graphql'
import { getGlobalSectionsData } from '../../../components/cms/GlobalSections'
import { default as AfterSection } from '../../../customizations/src/myAccount/extensions/orders/[id]/after'
import { default as BeforeSection } from '../../../customizations/src/myAccount/extensions/orders/[id]/before'
import { getIsRepresentative } from '../../../sdk/account/getIsRepresentative'
import PageProvider from '../../../sdk/overrides/PageProvider'
import { execute } from '../../../server'
import { injectGlobalSections } from '../../../server/cms/global'
import { getMyAccountRedirect } from '../../../utils/myAccountRedirect'
import { extractStatusFromError } from '../../../utils/utilities'
import storeConfig from '../../../../discovery.config'

const COMPONENTS: Record<string, ComponentType<any>> = {
  ...GLOBAL_COMPONENTS,
  ...CUSTOM_COMPONENTS,
}

type OrderDetailsPageProps = {
  order: ServerOrderDetailsQueryQuery['userOrder']
} & MyAccountProps

export default function OrderDetailsPage({
  globalSections: globalSectionsProp,
  order,
  accountName,
  isRepresentative,
}: OrderDetailsPageProps) {
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
          <MyAccountOrderDetails order={order} />
          <AfterSection />
        </MyAccountLayout>
      </RenderSections>
    </PageProvider>
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
      creationDate
      status
      canProcessOrderAuthorization
      statusDescription
      allowCancellation
      ruleForAuthorization {
        orderAuthorizationId
        dimensionId
        rule {
          id
          name
          status
          doId
          authorizedEmails
          priority
          trigger {
            condition {
              conditionType
              description
              lessThan
              greatherThan
              expression
            }
            effect {
              description
              effectType
              funcPath
            }
          }
          timeout
          notification
          scoreInterval {
            accept
            deny
          }
          authorizationData {
            requireAllApprovals
            authorizers {
              id
              email
              type
              authorizationDate
            }
          }
          isUserAuthorized
          isUserNextAuthorizer
        }
      }
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
            uniqueId
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
      shopperName {
        firstName
        lastName
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
    const status = extractStatusFromError(orderDetails.errors?.[0])

    const isForbidden = status === 403 || status === 401

    return {
      redirect: {
        destination: isForbidden ? '/account/403' : '/account/404',
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
