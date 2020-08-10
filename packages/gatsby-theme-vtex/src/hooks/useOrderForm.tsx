import { useContext } from 'react'

import { OrderForm } from '../providers/OrderForm'

export const useOrderForm = () => useContext(OrderForm)
