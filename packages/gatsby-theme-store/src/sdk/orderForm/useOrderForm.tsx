import { useOrderForm as useDefaultOrderForm } from '@vtex/order-manager'
import type { OrderFormContext } from '@vtex/order-manager'

import type { OrderFormFragment_OrderFormFragment as OrderForm } from './controller/__generated__/OrderFormFragment_orderForm.graphql'

export const useOrderForm = useDefaultOrderForm as () => OrderFormContext<OrderForm>
