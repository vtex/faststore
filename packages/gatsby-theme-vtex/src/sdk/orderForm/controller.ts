import { Dispatch, SetStateAction } from 'react'
import { api } from '@vtex/gatsby-source-vtex'
import PQueue from 'p-queue'
import { gql, request } from '@vtex/gatsby-plugin-graphql'

import { postFetcher } from '../../utils/fetcher'
import { OrderFormItem } from './types'
import { storage } from './storage'
import {
  OrderFormQuery,
  OrderFormQueryQuery,
  OrderFormQueryQueryVariables,
} from './__generated__/OrderFormQuery.graphql'

type OrderForm = OrderFormQueryQuery['vtex']['orderForm']

type ReactOrderFormStateSetter = Dispatch<SetStateAction<OrderForm | null>>

// Queue to make changes to the orderForm
export const queue = new PQueue({
  concurrency: 1,
})

// This queue will be unpaused once we have an orderForm
queue.pause()

export const fetchOrderForm = async (
  initialOrderForm: OrderForm | null
): Promise<OrderForm | null> =>
  initialOrderForm ??
  request<OrderFormQueryQueryVariables, OrderFormQueryQuery>(
    '/graphql/',
    OrderFormQuery
  ).then((result) => result.data.vtex.orderForm as OrderForm)

export const orderFormQuery = gql`
  fragment Address_OrderForm on VTEX_Address {
    addressId
    addressType
    city
    complement
    country
    neighborhood
    number
    postalCode
    receiverName
    reference
    state
    street
  }

  query OrderFormQuery {
    vtex {
      orderForm {
        id
        items {
          additionalInfo {
            brandName
          }
          parentAssemblyBinding
          sellingPriceWithAssemblies
          options {
            assemblyId
            id
            quantity
            seller
            inputValues
            options {
              assemblyId
              id
              quantity
              seller
              inputValues
              options {
                assemblyId
                id
                quantity
                seller
                inputValues
              }
            }
          }
          availability
          detailUrl
          id
          imageUrls {
            at1x
            at2x
            at3x
          }
          listPrice
          measurementUnit
          name
          price
          productCategories
          productCategoryIds
          productRefId
          productId
          quantity
          sellingPrice
          skuName
          skuSpecifications {
            fieldName
            fieldValues
          }
          uniqueId
        }
        canEditData
        userProfileId
        marketingData {
          coupon
          utmCampaign
          utmMedium
          utmSource
          utmiCampaign
          utmiPart
          utmiPage
        }
        totalizers {
          id
          name
          value
        }
        shipping {
          countries
          availableAddresses {
            ...Address_OrderForm
          }
          selectedAddress {
            ...Address_OrderForm
          }
          deliveryOptions {
            id
            price
            estimate
            isSelected
          }
        }
        paymentData {
          paymentSystems {
            id
            name
            groupName
            validator {
              regex
              mask
              cardCodeRegex
              cardCodeMask
              weights
              useCvv
              useExpirationDate
              useCardHolderName
              useBillingAddress
            }
            stringId
            requiresDocument
            isCustom
            description
            requiresAuthentication
            dueDate
          }
        }
        clientProfileData {
          email
          firstName
          lastName
          document
          documentType
          phone
        }
        messages {
          couponMessages {
            code
          }
          generalMessages {
            code
            text
            status
          }
        }
        value
      }
    }
  }
`

export const setOrderFormState = (
  setReactState: ReactOrderFormStateSetter,
  orderForm: OrderForm | null
) => {
  setReactState(orderForm)
  storage.set(orderForm)
}

export const startOrderForm = async (
  orderForm: OrderForm | null,
  setReactState: ReactOrderFormStateSetter
) => {
  setOrderFormState(setReactState, orderForm)
  queue.start()
}

export const addItems = async (
  id: string | undefined,
  setOrderForm: ReactOrderFormStateSetter,
  items: OrderFormItem[]
) => {
  if (!id) {
    throw new Error('This page does not have an orderForm yet')
  }

  return queue.add(async () => {
    const newOrderForm = await postFetcher<OrderForm>(
      api.checkout.addItem(id),
      {
        body: JSON.stringify({ orderItems: items }),
      }
    )

    setOrderFormState(setOrderForm, newOrderForm)
  })
}
