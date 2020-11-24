import { useContext } from 'react'

import { OrderForm } from './Provider'

export const useOrderForm = () => useContext(OrderForm)
