import { Dispatch, SetStateAction } from 'react'
import PQueue from 'p-queue'
import { gql, request } from '@vtex/gatsby-plugin-graphql'

import { storage } from './storage'
import {
  OrderFormQuery,
  OrderFormQueryQuery,
  OrderFormQueryQueryVariables,
} from './__generated__/OrderFormQuery.graphql'
import {
  AddToCartMutation,
  AddToCartMutationMutation,
  AddToCartMutationMutationVariables,
} from './__generated__/AddToCartMutation.graphql'
import {
  UpdateItemsMutation,
  UpdateItemsMutationMutation,
  UpdateItemsMutationMutationVariables,
} from './__generated__/UpdateItemsMutation.graphql'
import { VTEX_ItemInput } from '../../__generated__/HomePageQuery.graphql'
import {
  VTEX_AddressInput,
  EstimateShippingMutationMutationVariables,
  EstimateShippingMutationMutation,
  EstimateShippingMutation,
} from './__generated__/EstimateShippingMutation.graphql'
import {
  SelectDeliveryOptionMutationMutationVariables,
  SelectDeliveryOptionMutationMutation,
  SelectDeliveryOptionMutation,
} from './__generated__/SelectDeliveryOptionMutation.graphql'
import {
  UpdateSelectedAddressMutationMutationVariables,
  UpdateSelectedAddressMutationMutation,
  UpdateSelectedAddressMutation,
} from './__generated__/UpdateSelectedAddressMutation.graphql'

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
  request<OrderFormQueryQueryVariables, OrderFormQueryQuery>('/graphql/', {
    ...OrderFormQuery,
    fetchOptions: {
      headers: { 'x-vtex-graphql-referer': window.location.host },
    },
  }).then((result) => result.data.vtex.orderForm as OrderForm)

export const orderFormFragment = gql`
  fragment Address_orderForm on VTEX_Address {
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

  fragment OrderForm_orderForm on VTEX_OrderForm {
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
        ...Address_orderForm
      }
      selectedAddress {
        ...Address_orderForm
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
`

export const orderFormQuery = gql`
  query OrderFormQuery {
    vtex {
      orderForm {
        ...OrderForm_orderForm
      }
    }
  }
`

export const addToCartMutation = gql`
  mutation AddToCartMutation(
    $items: [VTEX_ItemInput!]!
    $marketingData: VTEX_MarketingDataInput
  ) {
    addToCart(items: $items, marketingData: $marketingData) {
      ...OrderForm_orderForm
    }
  }
`

export const updateItemsMutation = gql`
  mutation UpdateItemsMutation($items: [VTEX_ItemInput!]!) {
    updateItems(orderItems: $items) {
      ...OrderForm_orderForm
    }
  }
`

export const estimateShippingMutation = gql`
  mutation EstimateShippingMutation($address: VTEX_AddressInput!) {
    estimateShipping(address: $address) {
      ...OrderForm_orderForm
    }
  }
`

export const selectDeliveryOptionMutation = gql`
  mutation SelectDeliveryOptionMutation($deliveryOptionId: String!) {
    selectDeliveryOption(deliveryOptionId: $deliveryOptionId) {
      ...OrderForm_orderForm
    }
  }
`

export const updateSelectedAddressMutation = gql`
  mutation UpdateSelectedAddressMutation($address: VTEX_AddressInput!) {
    updateSelectedAddress(input: $address) {
      ...OrderForm_orderForm
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
  items: VTEX_ItemInput[]
) => {
  if (!id) {
    throw new Error('This page does not have an orderForm yet')
  }

  return queue.add(async () => {
    const {
      data: { addToCart: newOrderForm },
    } = await request<
      AddToCartMutationMutationVariables,
      AddToCartMutationMutation
    >('/graphql/', {
      ...AddToCartMutation,
      variables: { items, marketingData: null },
      fetchOptions: {
        headers: { 'x-vtex-graphql-referer': window.location.host },
      },
    })

    setOrderFormState(setOrderForm, newOrderForm)
  })
}

export const updateItems = async (
  id: string | undefined,
  setOrderForm: ReactOrderFormStateSetter,
  items: VTEX_ItemInput[]
) => {
  if (!id) {
    throw new Error('This page does not have an orderForm yet')
  }

  return queue.add(async () => {
    const {
      data: { updateItems: newOrderForm },
    } = await request<
      UpdateItemsMutationMutationVariables,
      UpdateItemsMutationMutation
    >('/graphql/', {
      ...UpdateItemsMutation,
      variables: { items },
      fetchOptions: {
        headers: { 'x-vtex-graphql-referer': window.location.host },
      },
    })

    setOrderFormState(setOrderForm, newOrderForm)
  })
}

export const insertAddress = async (
  id: string | undefined,
  setOrderForm: ReactOrderFormStateSetter,
  address: VTEX_AddressInput
) => {
  if (!id) {
    throw new Error('This page does not have an orderForm yet')
  }

  return queue.add(async () => {
    const {
      data: { estimateShipping: newOrderForm },
    } = await request<
      EstimateShippingMutationMutationVariables,
      EstimateShippingMutationMutation
    >('/graphql/', {
      ...EstimateShippingMutation,
      variables: { address },
      fetchOptions: {
        headers: { 'x-vtex-graphql-referer': window.location.host },
      },
    })

    setOrderFormState(setOrderForm, newOrderForm)
  })
}

export const selectDeliveryOption = async (
  id: string | undefined,
  setOrderForm: ReactOrderFormStateSetter,
  deliveryOption: string
) => {
  if (!id) {
    throw new Error('This page does not have an orderForm yet')
  }

  return queue.add(async () => {
    const {
      data: { selectDeliveryOption: newOrderForm },
    } = await request<
      SelectDeliveryOptionMutationMutationVariables,
      SelectDeliveryOptionMutationMutation
    >('/graphql/', {
      ...SelectDeliveryOptionMutation,
      variables: { deliveryOptionId: deliveryOption },
      fetchOptions: {
        headers: { 'x-vtex-graphql-referer': window.location.host },
      },
    })

    setOrderFormState(setOrderForm, newOrderForm)
  })
}

export const updateSelectedAddress = async (
  id: string | undefined,
  setOrderForm: ReactOrderFormStateSetter,
  address: VTEX_AddressInput
) => {
  if (!id) {
    throw new Error('This page does not have an orderForm yet')
  }

  return queue.add(async () => {
    const {
      data: { updateSelectedAddress: newOrderForm },
    } = await request<
      UpdateSelectedAddressMutationMutationVariables,
      UpdateSelectedAddressMutationMutation
    >('/graphql/', {
      ...UpdateSelectedAddressMutation,
      variables: { address },
      fetchOptions: {
        headers: { 'x-vtex-graphql-referer': window.location.host },
      },
    })

    setOrderFormState(setOrderForm, newOrderForm)
  })
}
