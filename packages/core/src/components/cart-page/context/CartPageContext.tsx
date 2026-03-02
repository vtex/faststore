import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react'
import type { ReactNode } from 'react'

import { bffRequest } from '../graphql/client'
import { buildCartPageQuery } from '../graphql/queries'
import {
  CHANGE_PRODUCT_QUANTITY_MUTATION,
  REMOVE_PRODUCT_MUTATION,
  REMOVE_PRODUCTS_MUTATION,
  REMOVE_ALL_PRODUCTS_MUTATION,
  ADD_PROMO_CODE_MUTATION,
  REMOVE_PROMO_CODE_MUTATION,
  SELECT_DELIVERY_CHANNEL_MUTATION,
  SELECT_SINGLE_SLA_MUTATION,
  FIND_ADDRESS_AND_UPDATE_MUTATION,
  ADD_PRODUCT_MUTATION,
} from '../graphql/mutations'

import type {
  CartPageData,
  CartUnion,
  Summary,
  Shipping,
  CouponUnion,
  Customer,
  Auth,
  StorePreferences,
  OneClickCheckoutOptions,
  Comment,
  CustomFields,
  ChangeProductQuantityPayload,
  RemoveProductsPayload,
  RemoveAllProductsPayload,
  AddPromoCodePayload,
  ChangePromoCodesPayload,
  SelectDeliveryChannelPayload,
  SelectSingleSlaPayload,
  SelectAddressPayload,
} from './types'

// State
interface CartPageState {
  cart: CartUnion | null
  summary: Summary | null
  shipping: Shipping | null
  coupon: CouponUnion | null
  customer: Customer | null
  auth: Auth | null
  storePreferences: StorePreferences | null
  oneClickCheckoutOptions: OneClickCheckoutOptions | null
  comment: Comment | null
  customFields: CustomFields | null
  loading: boolean
  mutating: boolean
  error: string | null
}

const initialState: CartPageState = {
  cart: null,
  summary: null,
  shipping: null,
  coupon: null,
  customer: null,
  auth: null,
  storePreferences: null,
  oneClickCheckoutOptions: null,
  comment: null,
  customFields: null,
  loading: true,
  mutating: false,
  error: null,
}

// Actions
type CartPageAction =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: CartPageData }
  | { type: 'FETCH_ERROR'; payload: string }
  | { type: 'MUTATION_START' }
  | { type: 'MUTATION_END' }
  | {
      type: 'UPDATE_PARTIAL'
      payload: Partial<
        Pick<CartPageState, 'cart' | 'summary' | 'shipping' | 'coupon'>
      >
    }

function cartPageReducer(
  state: CartPageState,
  action: CartPageAction
): CartPageState {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: null }

    case 'FETCH_SUCCESS':
      return {
        ...state,
        loading: false,
        error: null,
        cart: action.payload.cart,
        summary: action.payload.summary,
        shipping: action.payload.shipping,
        coupon: action.payload.coupon,
        customer: action.payload.customer,
        auth: action.payload.auth,
        storePreferences: action.payload.storePreferences,
        oneClickCheckoutOptions: action.payload.oneClickCheckoutOptions,
        comment: action.payload.comment,
        customFields: action.payload.customFields,
      }

    case 'FETCH_ERROR':
      return { ...state, loading: false, error: action.payload }

    case 'MUTATION_START':
      return { ...state, mutating: true }

    case 'MUTATION_END':
      return { ...state, mutating: false }

    case 'UPDATE_PARTIAL': {
      const next = { ...state }

      if (action.payload.cart !== undefined) next.cart = action.payload.cart
      if (action.payload.summary !== undefined)
        next.summary = action.payload.summary
      if (action.payload.shipping !== undefined)
        next.shipping = action.payload.shipping
      if (action.payload.coupon !== undefined)
        next.coupon = action.payload.coupon

      return next
    }

    default:
      return state
  }
}

// Context value
interface CartPageContextValue extends CartPageState {
  refetch: () => Promise<void>
  changeProductQuantity: (
    itemIndex: number,
    quantity: number
  ) => Promise<void>
  removeProduct: (itemIndex: number) => Promise<void>
  removeProducts: (itemsIndexes: number[]) => Promise<void>
  removeAllProducts: () => Promise<void>
  addPromoCode: (
    promoCodes: string[],
    newPromoCode: string
  ) => Promise<void>
  removePromoCode: (
    promoCodes: string[],
    promoCode: string
  ) => Promise<void>
  selectDeliveryChannel: (
    channel: 'delivery' | 'pickup-in-point'
  ) => Promise<void>
  selectSingleSla: (slaId: string, items?: { itemIndex: number }[]) => Promise<void>
  findAddressAndUpdate: (input: {
    placeId: string
    addressQuery: string
    addressId: string | null
    addressType: string
    receiverName: string | null
    strategy?: string
  }) => Promise<void>
  addProduct: (
    id: string,
    seller: string,
    quantity: number
  ) => Promise<void>
}

const CartPageContext = createContext<CartPageContextValue | null>(null)

export function useCartPage(): CartPageContextValue {
  const ctx = useContext(CartPageContext)

  if (!ctx) {
    throw new Error('useCartPage must be used within a CartPageProvider')
  }

  return ctx
}

interface CartPageProviderProps {
  children: ReactNode
}

export function CartPageProvider({ children }: CartPageProviderProps) {
  const [state, dispatch] = useReducer(cartPageReducer, initialState)

  const fetchCartData = useCallback(async () => {
    dispatch({ type: 'FETCH_START' })

    try {
      const data = await bffRequest<CartPageData>(buildCartPageQuery())

      dispatch({ type: 'FETCH_SUCCESS', payload: data })
    } catch (err) {
      dispatch({
        type: 'FETCH_ERROR',
        payload: err instanceof Error ? err.message : 'Unknown error',
      })
    }
  }, [])

  useEffect(() => {
    fetchCartData()
  }, [fetchCartData])

  const applyMutationResult = useCallback(
    (result: Partial<Pick<CartPageState, 'cart' | 'summary' | 'shipping' | 'coupon'>>) => {
      const payload: typeof result = {}

      if (result.cart) payload.cart = result.cart
      if (result.summary) payload.summary = result.summary
      if (result.shipping) payload.shipping = result.shipping
      if (result.coupon) payload.coupon = result.coupon
      dispatch({ type: 'UPDATE_PARTIAL', payload })
    },
    []
  )

  const withMutation = useCallback(
    async <T,>(fn: () => Promise<T>): Promise<T> => {
      dispatch({ type: 'MUTATION_START' })

      try {
        const result = await fn()

        dispatch({ type: 'MUTATION_END' })

        return result
      } catch (err) {
        dispatch({ type: 'MUTATION_END' })
        throw err
      }
    },
    []
  )

  const changeProductQuantity = useCallback(
    async (itemIndex: number, quantity: number) => {
      await withMutation(async () => {
        const data = await bffRequest<{
          changeProductQuantity: ChangeProductQuantityPayload
        }>(CHANGE_PRODUCT_QUANTITY_MUTATION, {
          itemIndex,
          quantity,
          userIsoDate: new Date().toISOString(),
        })

        applyMutationResult({
          cart: data.changeProductQuantity.cart,
          summary: data.changeProductQuantity.summary,
          coupon: data.changeProductQuantity.coupon,
          shipping: data.changeProductQuantity.shipping,
        })
      })
    },
    [withMutation, applyMutationResult]
  )

  const removeProduct = useCallback(
    async (itemIndex: number) => {
      await withMutation(async () => {
        const data = await bffRequest<{
          removeProduct: RemoveProductsPayload
        }>(REMOVE_PRODUCT_MUTATION, {
          input: {
            itemIndex,
            userIsoDate: new Date().toISOString(),
          },
        })

        applyMutationResult({
          cart: data.removeProduct.cart,
          summary: data.removeProduct.summary,
          coupon: data.removeProduct.coupon,
          shipping: data.removeProduct.shipping,
        })
      })
    },
    [withMutation, applyMutationResult]
  )

  const removeProducts = useCallback(
    async (itemsIndexes: number[]) => {
      await withMutation(async () => {
        const data = await bffRequest<{
          removeProducts: RemoveProductsPayload
        }>(REMOVE_PRODUCTS_MUTATION, {
          input: {
            itemsIndexes,
            userIsoDate: new Date().toISOString(),
          },
        })

        applyMutationResult({
          cart: data.removeProducts.cart,
          summary: data.removeProducts.summary,
          coupon: data.removeProducts.coupon,
          shipping: data.removeProducts.shipping,
        })
      })
    },
    [withMutation, applyMutationResult]
  )

  const removeAllProducts = useCallback(async () => {
    await withMutation(async () => {
      const data = await bffRequest<{
        removeAllProducts: RemoveAllProductsPayload
      }>(REMOVE_ALL_PRODUCTS_MUTATION)

      applyMutationResult({
        cart: data.removeAllProducts.cart,
        summary: data.removeAllProducts.summary,
        coupon: data.removeAllProducts.coupon,
      })
    })
  }, [withMutation, applyMutationResult])

  const addPromoCode = useCallback(
    async (promoCodes: string[], newPromoCode: string) => {
      await withMutation(async () => {
        const data = await bffRequest<{
          addPromoCode: AddPromoCodePayload
        }>(ADD_PROMO_CODE_MUTATION, {
          input: { promoCodes, newPromoCode },
        })

        applyMutationResult({
          cart: data.addPromoCode.cart,
          summary: data.addPromoCode.summary,
          coupon: data.addPromoCode.coupon,
        })
      })
    },
    [withMutation, applyMutationResult]
  )

  const removePromoCode = useCallback(
    async (promoCodes: string[], promoCode: string) => {
      await withMutation(async () => {
        const data = await bffRequest<{
          removePromoCode: ChangePromoCodesPayload
        }>(REMOVE_PROMO_CODE_MUTATION, { promoCodes, promoCode })

        applyMutationResult({
          cart: data.removePromoCode.cart,
          summary: data.removePromoCode.summary,
          coupon: data.removePromoCode.coupon,
        })
      })
    },
    [withMutation, applyMutationResult]
  )

  const selectDeliveryChannel = useCallback(
    async (channel: 'delivery' | 'pickup-in-point') => {
      await withMutation(async () => {
        const data = await bffRequest<{
          selectDeliveryChannel: SelectDeliveryChannelPayload
        }>(SELECT_DELIVERY_CHANNEL_MUTATION, {
          input: {
            selectedDeliveryChannel: channel,
            userIsoDate: new Date().toISOString(),
          },
        })

        applyMutationResult({
          cart: data.selectDeliveryChannel.cart,
          summary: data.selectDeliveryChannel.summary,
          shipping: data.selectDeliveryChannel.shipping,
        })
      })
    },
    [withMutation, applyMutationResult]
  )

  const selectSingleSla = useCallback(
    async (slaId: string, items?: { itemIndex: number }[]) => {
      await withMutation(async () => {
        const data = await bffRequest<{
          selectSingleSla: SelectSingleSlaPayload
        }>(SELECT_SINGLE_SLA_MUTATION, {
          input: {
            id: slaId,
            userIsoDate: new Date().toISOString(),
            items,
          },
        })

        applyMutationResult({
          cart: data.selectSingleSla.cart,
          summary: data.selectSingleSla.summary,
          shipping: data.selectSingleSla.shipping,
        })
      })
    },
    [withMutation, applyMutationResult]
  )

  const findAddressAndUpdate = useCallback(
    async (input: {
      placeId: string
      addressQuery: string
      addressId: string | null
      addressType: string
      receiverName: string | null
      strategy?: string
    }) => {
      await withMutation(async () => {
        const data = await bffRequest<{
          findAddressDetailsAndUpdateAddress: SelectAddressPayload
        }>(FIND_ADDRESS_AND_UPDATE_MUTATION, {
          input,
          userIsoDate: new Date().toISOString(),
        })

        applyMutationResult({
          cart: data.findAddressDetailsAndUpdateAddress.cart,
          summary: data.findAddressDetailsAndUpdateAddress.summary,
          shipping: data.findAddressDetailsAndUpdateAddress.shipping,
        })
      })
    },
    [withMutation, applyMutationResult]
  )

  const addProduct = useCallback(
    async (id: string, seller: string, quantity: number) => {
      await withMutation(async () => {
        const data = await bffRequest<{
          addProduct: RemoveProductsPayload
        }>(ADD_PRODUCT_MUTATION, {
          id,
          seller,
          quantity,
          userIsoDate: new Date().toISOString(),
        })

        applyMutationResult({
          cart: data.addProduct.cart,
          summary: data.addProduct.summary,
          shipping: data.addProduct.shipping,
        })
      })
    },
    [withMutation, applyMutationResult]
  )

  const value = useMemo<CartPageContextValue>(
    () => ({
      ...state,
      refetch: fetchCartData,
      changeProductQuantity,
      removeProduct,
      removeProducts,
      removeAllProducts,
      addPromoCode,
      removePromoCode,
      selectDeliveryChannel,
      selectSingleSla,
      findAddressAndUpdate,
      addProduct,
    }),
    [
      state,
      fetchCartData,
      changeProductQuantity,
      removeProduct,
      removeProducts,
      removeAllProducts,
      addPromoCode,
      removePromoCode,
      selectDeliveryChannel,
      selectSingleSla,
      findAddressAndUpdate,
      addProduct,
    ]
  )

  return (
    <CartPageContext.Provider value={value}>{children}</CartPageContext.Provider>
  )
}
