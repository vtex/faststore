/**
 * This provider starts fetching early and adds a suspendable reader to
 * the context. Use the hooks to interact with the context
 */
import React, {
  createContext,
  FC,
  useCallback,
  useEffect,
  useState,
  useMemo,
} from 'react'

import { storage } from './storage'
import { OrderFormQueryQuery } from './__generated__/OrderFormQuery.graphql'
import { VTEX_ItemInput } from './__generated__/AddToCartMutation.graphql'

type OrderForm = OrderFormQueryQuery['vtex']['orderForm']

const controller = () => import('./controller')

type AddItemInput = Partial<
  Pick<VTEX_ItemInput, 'id' | 'index' | 'quantity' | 'seller'>
>
type UpdateItemInput = Partial<
  Pick<VTEX_ItemInput, 'id' | 'index' | 'uniqueId' | 'quantity' | 'seller'>
>

const defaultItem = {
  id: null,
  index: null,
  seller: null,
  quantity: null,
  uniqueId: null,
  inputValues: null,
  options: null,
}

export type OrderFormContext = {
  orderForm: OrderForm | null
  addItems: (items: AddItemInput[]) => Promise<void>
  updateItems: (items: UpdateItemInput[]) => Promise<void>
}

export const OrderForm = createContext<OrderFormContext | undefined>(undefined)

export const OrderFormProvider: FC = ({ children }) => {
  const [orderForm, setOrderForm] = useState<OrderForm | null>(() =>
    storage.get()
  )

  const id = orderForm?.id

  // Fetch orderForm on first render
  useEffect(() => {
    let cancel = false

    const fetchAndDispatch = async () => {
      const { fetchOrderForm, startOrderForm } = await controller()

      const data = await fetchOrderForm(orderForm)

      if (!cancel) {
        startOrderForm(data, setOrderForm)
      }
    }

    fetchAndDispatch()

    return () => {
      cancel = true
    }
  }, [orderForm])

  // Add item to cart using the queue
  const addItems = useCallback(
    async (items: AddItemInput[]) => {
      const ctl = await controller()

      ctl.addItems(
        id,
        setOrderForm,
        items.map((item) => ({
          ...defaultItem,
          ...item,
        }))
      )
    },
    [id]
  )

  const updateItems = useCallback(
    async (items: UpdateItemInput[]) => {
      const ctl = await controller()

      ctl.updateItems(
        id,
        setOrderForm,
        items.map((item) => ({
          ...defaultItem,
          ...item,
        }))
      )
    },
    [id]
  )

  const ctx: OrderFormContext = useMemo(
    () => ({
      orderForm,
      addItems,
      updateItems,
    }),
    [orderForm, addItems, updateItems]
  )

  return <OrderForm.Provider value={ctx}>{children}</OrderForm.Provider>
}
