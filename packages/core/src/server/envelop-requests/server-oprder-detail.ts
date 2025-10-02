import { ServerExecuteFunction } from '..'
import { gql } from '../../../@generated/gql'
import type {
  ServerOrderDetailsQueryQuery,
  ServerOrderDetailsQueryQueryVariables,
} from '../../../@generated/graphql'

export function serverOrderDetailRequest({
  req,
  variables,
}: {
  variables: ServerOrderDetailsQueryQueryVariables
  req: { headers: Record<string, unknown> }
}) {
  return ServerExecuteFunction<
    ServerOrderDetailsQueryQueryVariables,
    ServerOrderDetailsQueryQuery
  >(
    {
      variables,
      operation: query,
    },
    { headers: { ...req.headers } }
  )
}

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
      shopper {
        firstName
        lastName
        email
        phone
      }
    }
    accountName
  }
`)
