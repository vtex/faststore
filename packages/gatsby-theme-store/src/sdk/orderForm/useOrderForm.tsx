import {
  useOrderForm as useDefaultOrderForm,
  useOrderQueue as useDefaultOrderQueue,
} from '@vtex/order-manager'
import type { OrderFormContext, OrderQueueContext } from '@vtex/order-manager'

import type { OrderFormFragment_OrderFormFragment as OrderForm } from './controller/__generated__/OrderFormFragment_orderForm.graphql'

export const useOrderForm = useDefaultOrderForm as () => OrderFormContext<OrderForm>
export const useOrderQueue = useDefaultOrderQueue as () => OrderQueueContext<OrderForm>
export { useQueueStatus } from '@vtex/order-manager'
