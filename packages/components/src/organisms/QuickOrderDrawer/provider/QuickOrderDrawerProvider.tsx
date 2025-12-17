import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

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
  setAlertMessage: (message: string) => void
  onChangeQuantityItem: (id: string, value: number) => void
  onDelete: (id: string) => void
  onAddToCart: () => void
}

const QuickOrderDrawerContext = createContext<
  QuickOrderDrawerContextValue | undefined
>(undefined)

export interface QuickOrderDrawerProviderProps {
  children: ReactNode
  initialProducts?: Product[]
  onAddToCart?: (
    products: Product[],
    totalPrice: number,
    itemsCount: number
  ) => void
}

export const QuickOrderDrawerProvider = ({
  children,
  initialProducts,
  onAddToCart: onAddToCartCallback,
}: QuickOrderDrawerProviderProps) => {
  const [products, setProducts] = useState<Product[]>(initialProducts || [])

  const getAlertMessage = (prods: Product[]) => {
    const hasOutOfStock = prods.some((p) => p.availability === 'outOfStock')
    return hasOutOfStock
      ? 'Some of the SKUs are not available. Please adjust the amount before proceeding to the cart.'
      : ''
  }

  const [alertMessage, setAlertMessage] = useState<string>(
    getAlertMessage(products)
  )

  useEffect(() => {
    const newProducts = initialProducts || []

    setProducts(newProducts)

    setAlertMessage(getAlertMessage(newProducts))
  }, [initialProducts])

  const { totalPrice, itemsCount } = useMemo(() => {
    return products.reduce<{ totalPrice: number; itemsCount: number }>(
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

    if (onAddToCartCallback) {
      onAddToCartCallback(productsToAdd, totalPrice, itemsCount)
    }
  }, [products, totalPrice, itemsCount, onAddToCartCallback])

  const value: QuickOrderDrawerContextValue = {
    products,
    totalPrice,
    itemsCount,
    alertMessage,
    setAlertMessage,
    onChangeQuantityItem,
    onDelete,
    onAddToCart,
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
