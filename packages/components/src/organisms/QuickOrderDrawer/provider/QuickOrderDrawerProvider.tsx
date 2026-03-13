import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { PriceFormatter } from '../../../atoms/Price'

export interface Product {
  id: string
  name: string
  price: number
  quantityUpdated: boolean
  image: {
    url: string
    alternateName: string
  }
  inventory: number
  availability: 'available' | 'outOfStock'
  selectedCount: number
}

export interface VariationProductColumn {
  name: string
  availability: {
    label: string
    stockDisplaySettings: 'showStockQuantity' | 'showAvailability'
  }
  price: string
  quantity: string
}

interface QuickOrderDrawerContextValue {
  products: Product[]
  totalPrice: number
  itemsCount: number
  alertMessage: string
  isLoading: boolean
  setAlertMessage: (message: string) => void
  onChangeQuantityItem: (id: string, value: number) => void
  onDelete: (id: string) => void
  onAddToCart: () => void
  formatter?: PriceFormatter
}

const QuickOrderDrawerContext = createContext<
  QuickOrderDrawerContextValue | undefined
>(undefined)

export interface AlertMessages {
  notFoundAndOutOfStock?: string
  notFound?: string
  outOfStock?: string
}

export interface QuickOrderDrawerProviderProps {
  children: ReactNode
  initialProducts?: Product[]
  isLoading?: boolean
  totalRequestedSkus?: number
  onAddToCart?: (
    products: Product[],
    totalPrice: number,
    itemsCount: number
  ) => void
  formatter?: PriceFormatter
  /**
   * Initial alert message for CMS configuration
   */
  initialAlertMessage?: string
  /**
   * Alert messages from CMS for different scenarios.
   */
  alertMessages?: AlertMessages
}

export const QuickOrderDrawerProvider = ({
  children,
  initialProducts = [],
  isLoading = false,
  totalRequestedSkus,
  onAddToCart: onAddToCartCallback,
  formatter,
  initialAlertMessage,
  alertMessages,
}: QuickOrderDrawerProviderProps) => {
  const [products, setProducts] = useState<Product[]>(initialProducts || [])

  const getAlertMessage = (prods: Product[], totalRequestedSkus?: number) => {
    if (prods.length === 0) {
      return ''
    }

    const hasOutOfStock = prods.some((p) => p.availability === 'outOfStock')
    const hasNotFound =
      totalRequestedSkus !== undefined &&
      totalRequestedSkus > 0 &&
      prods.length < totalRequestedSkus

    if (hasNotFound && hasOutOfStock) {
      return alertMessages?.notFoundAndOutOfStock ?? ''
    }
    if (hasNotFound) {
      return alertMessages?.notFound ?? ''
    }
    if (hasOutOfStock) {
      return alertMessages?.outOfStock ?? ''
    }
    return ''
  }

  const [alertMessage, setAlertMessage] = useState<string>(
    initialAlertMessage ?? ''
  )

  useEffect(() => {
    const newProducts = initialProducts || []

    setProducts(newProducts)
  }, [initialProducts])

  useEffect(() => {
    if (!isLoading) {
      setAlertMessage(getAlertMessage(products, totalRequestedSkus))
    } else if (isLoading) {
      setAlertMessage('')
    }
  }, [products, isLoading, totalRequestedSkus])

  const { totalPrice, itemsCount } = useMemo(() => {
    const filteredProducts = products.filter(
      (product) =>
        product.selectedCount > 0 && product.availability === 'available'
    )

    return filteredProducts.reduce<{ totalPrice: number; itemsCount: number }>(
      (prev, curr) => ({
        totalPrice: prev.totalPrice + curr.price * curr.selectedCount,
        itemsCount: prev.itemsCount + curr.selectedCount,
      }),
      { totalPrice: 0, itemsCount: 0 }
    )
  }, [products])

  const onChangeQuantityItem = useCallback((id: string, value: number) => {
    setProducts((oldProducts) =>
      oldProducts.map((product) => {
        if (product.id !== id) {
          return product
        }

        return { ...product, selectedCount: value }
      })
    )
  }, [])

  const onDelete = useCallback((id: string) => {
    setProducts((oldProducts) =>
      oldProducts.filter((product) => product.id !== id)
    )
  }, [])

  const onAddToCart = useCallback(() => {
    const productsToAdd = products.filter(
      (product) =>
        product.selectedCount > 0 && product.availability === 'available'
    )

    onAddToCartCallback?.(productsToAdd, totalPrice, itemsCount)
  }, [products, totalPrice, itemsCount, onAddToCartCallback])

  const value: QuickOrderDrawerContextValue = {
    products,
    totalPrice,
    itemsCount,
    alertMessage,
    isLoading,
    setAlertMessage,
    onChangeQuantityItem,
    onDelete,
    onAddToCart,
    formatter,
  }

  return (
    <QuickOrderDrawerContext.Provider value={value}>
      {children}
    </QuickOrderDrawerContext.Provider>
  )
}

export const useQuickOrderDrawer = (): QuickOrderDrawerContextValue => {
  const context = useContext(QuickOrderDrawerContext)

  if (context === undefined) {
    throw new Error(
      'useQuickOrderDrawer should be used within a QuickOrderDrawerProvider'
    )
  }

  return context
}
