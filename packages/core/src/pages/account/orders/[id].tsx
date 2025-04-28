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
import { execute } from 'src/server'
import { injectGlobalSections } from 'src/server/cms/global'
import { getMyAccountRedirect } from 'src/utils/myAccountRedirect'

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
}: OrderDetailsPageProps) {
  return (
    <RenderSections
      globalSections={globalSections.sections}
      components={COMPONENTS}
    >
      <NextSeo noindex nofollow />

      <MyAccountLayout>
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
      sequence
      marketplaceOrderId
      marketplaceServicesEndpoint
      sellerOrderId
      origin
      affiliateId
      salesChannel
      merchantName
      status
      workflowIsInError
      statusDescription
      value
      creationDate
      lastChange
      orderGroup
      giftRegistryData
      marketingData
      callCenterOperatorData
      followUpEmail
      lastMessage
      hostname
      invoiceData
      changesAttachment
      openTextField
      roundingError
      orderFormId
      commercialConditionData
      isCompleted
      customData {
        customApps {
          fields {
            cartEtag
          }
          id
          major
        }
      }
      allowCancellation
      allowEdition
      isCheckedIn
      authorizedDate
      invoicedDate
      cancelReason
      subscriptionData
      taxData
      checkedInPickupPointId
      cancellationData {
        RequestedByUser
        RequestedBySystem
        RequestedBySellerNotification
        RequestedByPaymentNotification
        Reason
        CancellationDate
      }
      cancellationRequests {
        id
        reason
        cancellationRequestDate
        requestedByUser
        deniedBySeller
        deniedBySellerReason
        cancellationRequestDenyDate
      }
      clientPreferencesData {
        locale
        optinNewsLetter
      }
      itemMetadata {
        Items {
          Id
          Seller
          Name
          SkuName
          ProductId
          RefId
          Ean
          ImageUrl
          DetailUrl
          AssemblyOptions {
            Id
            Name
            Required
          }
        }
      }
      marketplace {
        baseURL
        isCertified
        name
      }
      storePreferencesData {
        countryCode
        currencyCode
        currencyLocale
        currencySymbol
        timeZone
        currencyFormatInfo {
          CurrencyDecimalDigits
          CurrencyDecimalSeparator
          CurrencyGroupSeparator
          CurrencyGroupSize
          StartsWithCurrencySymbol
        }
      }
      sellers {
        id
        name
        logo
        fulfillmentEndpoint
      }
      packageAttachment {
        packages {
          courier
          courierStatus {
            data {
              city
              description
              lastChange
              state
            }
            finished
            status
          }
          invoiceNumber
          invoiceUrl
          invoiceValue
          extraValue
          issuanceDate
          items {
            description
            itemIndex
            price
            quantity
          }
          trackingNumber
          trackingUrl
          invoiceKey
          type
          restitutions {
            Refund {
              value
              items {
                useFreight
                isCompensation
                compensationValue
                itemIndex
                id
                quantity
                price
                description
                unitMultiplier
              }
            }
            GiftCard {
              value
              items {
                useFreight
                isCompensation
                compensationValue
                itemIndex
                id
                quantity
                price
                description
                unitMultiplier
              }
            }
          }
        }
      }
      paymentData {
        transactions {
          isActive
          transactionId
          merchantName
          payments {
            id
            paymentSystem
            paymentSystemName
            value
            installments
            referenceValue
            cardHolder
            cardNumber
            firstDigits
            lastDigits
            cvv2
            expireMonth
            expireYear
            url
            giftCardId
            giftCardName
            giftCardCaption
            redemptionCode
            group
            tid
            dueDate
            connectorResponses {
              Message
              ReturnCode
              Tid
              authId
            }
            giftCardProvider
            giftCardAsDiscount
            koinUrl
            accountId
            parentAccountId
            bankIssuedInvoiceIdentificationNumber
            bankIssuedInvoiceIdentificationNumberFormatted
            bankIssuedInvoiceBarCodeNumber
            bankIssuedInvoiceBarCodeType
            billingAddress
            paymentOrigin
          }
        }
        giftCards
      }
      shippingData {
        id
        trackingHints
        contactInformation {
          id
          email
          firstName
          lastName
          document
          documentType
          phone
        }
        availableAddresses {
          addressId
          versionId
          entityId
          addressType
          receiverName
          street
          number
          complement
          neighborhood
          postalCode
          city
          state
          country
          reference
          geoCoordinates
        }
        selectedAddresses {
          addressId
          versionId
          entityId
          addressType
          receiverName
          street
          number
          complement
          neighborhood
          postalCode
          city
          state
          country
          reference
          geoCoordinates
        }
        logisticsInfo {
          itemIndex
          itemId
          selectedDeliveryChannel
          selectedSla
          lockTTL
          price
          listPrice
          sellingPrice
          deliveryWindow {
            startDateUtc
            endDateUtc
            price
          }
          deliveryCompany
          shippingEstimate
          shippingEstimateDate
          deliveryChannel
          addressId
          versionId
          entityId
          polygonName
          pickupPointId
          transitTime
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
          deliveryChannels {
            id
            stockBalance
          }
          deliveryIds {
            courierId
            courierName
            dockId
            quantity
            warehouseId
            accountCarrierName
            kitItemDetails
          }
          shipsTo
          slas {
            id
            name
            shippingEstimate
            shippingEstimateDate
            deliveryWindow {
              startDateUtc
              endDateUtc
              price
            }
            listPrice
            price
            deliveryChannel
            polygonName
            lockTTL
            pickupPointId
            transitTime
            pickupDistance
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
            deliveryIds {
              courierId
              courierName
              dockId
              quantity
              warehouseId
              accountCarrierName
              kitItemDetails
            }
            availableDeliveryWindows {
              startDateUtc
              endDateUtc
              price
            }
          }
        }
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
      }
      ratesAndBenefitsData {
        id
        rateAndBenefitsIdentifiers {
          id
          additionalInfo
          description
          featured
          name
        }
      }
      clientProfileData {
        id
        email
        firstName
        lastName
        documentType
        document
        phone
        corporateName
        tradeName
        corporateDocument
        stateInscription
        corporatePhone
        isCorporate
        userProfileId
        userProfileVersion
        customerClass
        customerCode
      }
      items {
        uniqueId
        id
        productId
        ean
        lockId
        quantity
        seller
        name
        refId
        price
        listPrice
        manualPrice
        manualPriceAppliedBy
        imageUrl
        detailUrl
        sellerSku
        priceValidUntil
        commission
        tax
        preSaleDate
        measurementUnit
        unitMultiplier
        sellingPrice
        isGift
        shippingPrice
        rewardValue
        freightCommission
        taxCode
        parentItemIndex
        parentAssemblyBinding
        callCenterOperator
        serialNumbers
        costPrice
        assemblies
        priceDefinition {
          calculatedSellingPrice
          total
          reason
          sellingPrices {
            value
            quantity
          }
        }
        additionalInfo {
          brandName
          brandId
          categoriesIds
          productClusterId
          commercialConditionId
          offeringInfo
          offeringType
          offeringTypeId
          dimension {
            cubicweight
            height
            length
            weight
            width
          }
          categories {
            id
            name
          }
        }
        attachmentOfferings {
          name
          required
        }
        offerings {
          type
          id
          name
          price
        }
        params
        bundleItems {
          ...UserOrderItemsFragment
          attachments {
            name
            content
          }
        }
        components {
          ...UserOrderItemsFragment
        }
        priceTags {
          name
          value
          rawValue
          isPercentual
        }
        attachments {
          name
          content
        }
        itemAttachment {
          name
        }
      }
      totals {
        id
        name
        value
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
    }
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
    return {
      notFound: true,
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
    },
  }
}
