import type { Locator, Section } from '@vtex/client-cms'
import type { GetServerSideProps } from 'next'
import { NextSeo } from 'next-seo'
import type { ComponentType } from 'react'
import { Layout } from 'src/components/account'
import { OrderDetailsPageShell } from 'src/components/account/orders/OrderDetails'
import RenderSections, {
  RenderSectionsBase,
} from 'src/components/cms/RenderSections'
import ACCOUNT_COMPONENTS from 'src/components/cms/account/Components'
import { default as GLOBAL_COMPONENTS } from 'src/components/cms/global/Components'
import CUSTOM_COMPONENTS from 'src/customizations/src/components'
import type { MyAccountProps } from 'src/experimental/myAccountServerSideProps'
import type { AccountOrderDetailsPageData } from 'src/sdk/account/accountPageContext'
import type { AccountNavigationLabels } from 'src/sdk/account/getMyAccountRoutes'

import { gql } from '@generated'
import type {
  ServerOrderDetailsQueryQuery,
  ServerOrderDetailsQueryQueryVariables,
} from '@generated/graphql'
import storeConfig from 'discovery.config'
import { getGlobalSectionsData } from 'src/components/cms/GlobalSections'
import { default as AfterSection } from 'src/customizations/src/myAccount/extensions/orders/[id]/after'
import { default as BeforeSection } from 'src/customizations/src/myAccount/extensions/orders/[id]/before'
import { getIsRepresentative } from 'src/sdk/account/getIsRepresentative'
import PageProvider from 'src/sdk/overrides/PageProvider'
import { execute } from 'src/server'
import { injectGlobalSections } from 'src/server/cms/global'
import { extractAccountNavigationData } from 'src/server/cms/myAccountDefaultSections'
import { fetchMyAccountPageContent } from 'src/server/cms/fetchMyAccountPageContent'
import { getMyAccountRedirect } from 'src/utils/myAccountRedirect'
import { extractStatusFromError } from 'src/utils/utilities'
import { withLocaleValidationSSR } from 'src/utils/localization/withLocaleValidation'

const COMPONENTS: Record<string, ComponentType<any>> = {
  ...GLOBAL_COMPONENTS,
  ...CUSTOM_COMPONENTS,
}

type OrderDetailsPageProps = {
  pageSections: Section[]
  navigationLabels: AccountNavigationLabels
  accountPageData: AccountOrderDetailsPageData
} & MyAccountProps

export default function OrderDetailsPage({
  globalSections: globalSectionsProp,
  pageSections,
  navigationLabels,
  accountPageData,
  accountName,
  isRepresentative,
}: OrderDetailsPageProps) {
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
          <OrderDetailsPageShell>
            <main data-fs-order-details-content>
              <RenderSectionsBase
                sections={pageSections}
                components={ACCOUNT_COMPONENTS}
              />
            </main>
          </OrderDetailsPageShell>
          <AfterSection />
        </Layout>
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
            sellingPrice
            imageUrl
            tax
            taxPriceTagsTotal
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
      shopper {
        firstName
        lastName
        email
        phone
      }
      budgetData {
        budgets {
          id
          name
          balance {
            remaining
          }
          allocations {
            id
            linkedEntity {
              id
            }
            reservations
          }
        }
      }
    }
    accountProfile {
      name
    }
  }
`)

const getServerSidePropsBase: GetServerSideProps<
  OrderDetailsPageProps,
  Record<string, string>,
  Locator
> = async (context) => {
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
    params: { id },
  } = context
  const contentContext = {
    previewData: context.previewData,
    locale: context.locale,
  }

  const [
    globalSectionsPromise,
    globalSectionsHeaderPromise,
    globalSectionsFooterPromise,
  ] = getGlobalSectionsData(contentContext)

  const orderPath = `/pvt/account/orders/${id}`

  const [
    pageContent,
    orderDetails,
    globalSections,
    globalSectionsHeader,
    globalSectionsFooter,
  ] = await Promise.all([
    fetchMyAccountPageContent(
      'myaccountorderdetails',
      contentContext,
      orderPath
    ),
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
    console.error(...orderDetails.errors)
    const status = extractStatusFromError(orderDetails.errors?.[0])

    // Redirect to 403 for authentication errors (401/403) to handle token refresh
    // Redirect to 404 for other errors
    const destination =
      status === 403 || status === 401
        ? `/pvt/account/403?from=${encodeURIComponent(`/pvt/account/orders/${context.params?.id}`)}`
        : '/pvt/account/404'

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

  const { pageSections, navigationData } = extractAccountNavigationData(
    pageContent.sections
  )

  return {
    props: {
      globalSections: globalSectionsResult,
      accountName: orderDetails.data.accountProfile.name ?? '',
      navigationLabels: navigationData as AccountNavigationLabels,
      accountPageData: {
        order: orderDetails.data.userOrder,
      },
      pageSections,
      isRepresentative,
    },
  }
}

export const getServerSideProps = withLocaleValidationSSR(
  getServerSidePropsBase
)
