import React from 'react'
import type { FC } from 'react'
import {
  OrderQueueProvider,
  createOrderFormProvider,
  DEFAULT_ORDER_FORM,
} from '@vtex/order-manager'
import { createOrderItemsProvider } from '@vtex/order-items'

import { clearOrderFormMessages } from './clearOrderFormMessage'
import { useToast } from './useToast'
import { useLogger } from './useLogger'
import { useGetOrderForm } from './useGetOrderForm'
import { useMutateAddItems } from './useMutateAddItems'
import { useMutateUpdateQuantity } from './useMutateUpdateQuantity'
import type { OrderFormFragment_OrderFormFragment as OrderForm } from './controller/__generated__/OrderFormFragment_orderForm.graphql'

const defaultOrderForm: OrderForm = {
  ...DEFAULT_ORDER_FORM,
  userProfileId: '',
  userType: '',
  allowManualPrice: null,
  clientPreferencesData: null,
  clientProfileData: null,
  marketingData: {
    coupon: null,
    utmCampaign: null,
    utmMedium: null,
    utmSource: null,
    utmiCampaign: null,
    utmiPage: null,
    utmiPart: null,
  },
  shipping: {
    ...DEFAULT_ORDER_FORM.shipping,
    countries: null,
    availableAddresses: null,
    selectedAddress: null,
  },
}

const { OrderFormProvider, useOrderForm } = createOrderFormProvider<OrderForm>({
  useGetOrderForm,
  clearOrderFormMessages,
  useToast,
  defaultOrderForm,
})

const {
  OrderItemsProvider,
  useOrderItems,
} = createOrderItemsProvider<OrderForm>({
  useMutateAddItems,
  useMutateUpdateQuantity,
  useOrderForm,
  useMutateSetManualPrice: () => undefined,
  useLogger,
})

export const Provider: FC = ({ children }) => {
  return (
    <OrderQueueProvider>
      <OrderFormProvider>
        <OrderItemsProvider>{children}</OrderItemsProvider>
      </OrderFormProvider>
    </OrderQueueProvider>
  )
}

export { useOrderForm, useOrderItems }
export type { OrderForm }
