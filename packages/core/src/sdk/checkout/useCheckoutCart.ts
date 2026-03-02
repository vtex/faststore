import { useCallback, useMemo } from 'react'

import { useBffQuery } from './useBffQuery'
import { useBffMutation } from './useBffMutation'
import { bffRequest } from './bffClient'
import {
  CART_PAGE_QUERY,
  CHANGE_PRODUCT_QUANTITY_MUTATION,
  REMOVE_PRODUCT_MUTATION,
  REMOVE_PRODUCTS_MUTATION,
  ADD_PROMO_CODE_MUTATION,
  REMOVE_PROMO_CODE_MUTATION,
  UPDATE_ADDRESS_MUTATION,
  FIND_ADDRESS_AND_UPDATE_MUTATION,
  ADDRESS_SUGGESTION_QUERY,
  type CartPageData,
  type MutationPayload,
  type PromoCodeMutationPayload,
  type AddressMutationPayload,
  type AddressSuggestionData,
  type BffProduct,
  type BffUnavailableProduct,
  type BffSummary,
  type BffDeliveryUnion,
  type BffStorePreferences,
  type CompleteAddressSuggestion,
} from './operations/cartOperations'

function getLocale(): string {
  if (typeof navigator !== 'undefined' && navigator.language) {
    return navigator.language
  }
  return 'en-US'
}

export interface CheckoutCartData {
  items: BffProduct[]
  unavailableItems: BffUnavailableProduct[]
  summary: BffSummary | null
  delivery: BffDeliveryUnion | null
  storePreferences: BffStorePreferences | null
  promoCodes: string[]
  cartId: string | null
  cartValue: number
  totalItems: number
  locale: string
  isEmpty: boolean
  isLoading: boolean
  isValidating: boolean
  error: unknown
  refetch: () => void
  changeQuantity: (itemIndex: number, quantity: number) => Promise<unknown>
  removeProduct: (itemIndex: number) => Promise<unknown>
  removeProducts: (itemIndexes: number[]) => Promise<unknown>
  addPromoCode: (code: string) => Promise<unknown>
  removePromoCode: (code: string) => Promise<unknown>
  searchAddress: (query: string) => Promise<AddressSuggestionData>
  selectCompleteAddress: (
    suggestion: CompleteAddressSuggestion
  ) => Promise<unknown>
  selectIncompleteAddress: (
    placeId: string,
    addressQuery: string
  ) => Promise<unknown>
}

export function useCheckoutCart(): CheckoutCartData {
  const { data, error, isLoading, isValidating, mutate } =
    useBffQuery<CartPageData>('CartPageQuery', CART_PAGE_QUERY)

  const changeQuantityMutation = useBffMutation<{
    changeProductQuantity: MutationPayload
  }>(CHANGE_PRODUCT_QUANTITY_MUTATION)
  const removeProductMutation = useBffMutation<{
    removeProduct: MutationPayload
  }>(REMOVE_PRODUCT_MUTATION)
  const removeProductsMutation = useBffMutation<{
    removeProducts: MutationPayload
  }>(REMOVE_PRODUCTS_MUTATION)
  const addPromoCodeMutation = useBffMutation<{
    addPromoCode: PromoCodeMutationPayload
  }>(ADD_PROMO_CODE_MUTATION)
  const removePromoCodeMutation = useBffMutation<{
    removePromoCode: PromoCodeMutationPayload
  }>(REMOVE_PROMO_CODE_MUTATION)
  const updateAddressMutation = useBffMutation<{
    updateAddress: AddressMutationPayload
  }>(UPDATE_ADDRESS_MUTATION)
  const findAddressAndUpdateMutation = useBffMutation<{
    findAddressDetailsAndUpdateAddress: AddressMutationPayload
  }>(FIND_ADDRESS_AND_UPDATE_MUTATION)

  const cart = data?.cart ?? null
  const isCart = cart?.__typename === 'Cart'

  const items = isCart ? cart.availableItems : []
  const unavailableItems = isCart ? cart.unavailableItems : []
  const summary = data?.summary ?? null
  const delivery = data?.shipping?.delivery ?? null
  const storePreferences = data?.storePreferences ?? null

  const promoCodes = useMemo(() => {
    const coupon = data?.coupon
    if (coupon && coupon.__typename === 'Coupon') {
      return coupon.promoCodes.map((pc) => pc.value)
    }
    return []
  }, [data?.coupon])

  const cartValue = summary?.total?.asNumber ?? 0
  const totalItems = isCart ? cart.totalItems : 0
  const locale = getLocale()

  const changeQuantity = useCallback(
    (itemIndex: number, quantity: number) =>
      changeQuantityMutation({
        itemIndex,
        quantity,
        userIsoDate: new Date().toISOString(),
      }),
    [changeQuantityMutation]
  )

  const removeProduct = useCallback(
    (itemIndex: number) =>
      removeProductMutation({
        input: { itemIndex, userIsoDate: new Date().toISOString() },
      }),
    [removeProductMutation]
  )

  const removeProducts = useCallback(
    (itemIndexes: number[]) =>
      removeProductsMutation({
        input: {
          itemsIndexes: itemIndexes,
          userIsoDate: new Date().toISOString(),
        },
      }),
    [removeProductsMutation]
  )

  const addPromoCode = useCallback(
    (code: string) =>
      addPromoCodeMutation({
        input: { newPromoCode: code, promoCodes },
      }),
    [addPromoCodeMutation, promoCodes]
  )

  const removePromoCode = useCallback(
    (code: string) =>
      removePromoCodeMutation({
        promoCode: code,
        promoCodes,
      }),
    [removePromoCodeMutation, promoCodes]
  )

  const searchAddress = useCallback(
    (query: string) =>
      bffRequest<AddressSuggestionData>(ADDRESS_SUGGESTION_QUERY, {
        searchAddress: query,
      }),
    []
  )

  const selectCompleteAddress = useCallback(
    (suggestion: CompleteAddressSuggestion) =>
      updateAddressMutation({
        input: {
          postalCode: suggestion.zipCode,
          street: suggestion.street,
          city: suggestion.city,
          state: suggestion.state,
          country: storePreferences?.country ?? 'BRA',
          addressQuery: suggestion.addressQuery,
          addressType: 'residential',
        },
        userIsoDate: new Date().toISOString(),
      }),
    [updateAddressMutation, storePreferences?.country]
  )

  const selectIncompleteAddress = useCallback(
    (placeId: string, addressQuery: string) =>
      findAddressAndUpdateMutation({
        input: {
          placeId,
          addressQuery,
          addressType: 'residential',
        },
        userIsoDate: new Date().toISOString(),
      }),
    [findAddressAndUpdateMutation]
  )

  return {
    items,
    unavailableItems,
    summary,
    delivery,
    storePreferences,
    promoCodes,
    cartId: cart?.id ?? null,
    cartValue,
    totalItems,
    locale,
    isEmpty: items.length === 0,
    isLoading,
    isValidating,
    error,
    refetch: mutate,
    changeQuantity,
    removeProduct,
    removeProducts,
    addPromoCode,
    removePromoCode,
    searchAddress,
    selectCompleteAddress,
    selectIncompleteAddress,
  }
}
