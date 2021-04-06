import React from 'react'
import type { FC } from 'react'
import {
  OrderQueueProvider,
  createOrderFormProvider,
  DEFAULT_ORDER_FORM,
  useOrderQueue,
  useQueueStatus,
  useOrderForm,
} from '@vtex/order-manager'
import { createOrderItemsProvider } from '@vtex/order-items'

import { useClearOrderFormMessages } from './useClearOrderFormMessage'
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

const { OrderFormProvider } = createOrderFormProvider<OrderForm>({
  useGetOrderForm,
  useClearOrderFormMessages,
  useToast,
  defaultOrderForm,
})

const { OrderItemsProvider } = createOrderItemsProvider<OrderForm>({
  useMutateAddItems,
  useMutateUpdateQuantity,
  useOrderForm,
  useMutateSetManualPrice: () => undefined,
  useLogger,
  useOrderQueue,
  useQueueStatus,
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

export type { OrderForm }
