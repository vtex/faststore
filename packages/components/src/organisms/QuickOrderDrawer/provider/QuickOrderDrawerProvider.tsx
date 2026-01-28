import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useCallback,
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
  setAlertMessage: (message: string) => void
  onChangeQuantityItem: (id: string, value: number) => void
  onDelete: (id: string) => void
  onAddToCart: () => void
  formatter?: PriceFormatter
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
  formatter?: PriceFormatter
  /**
   * Initial alert message for CMS configuration
   */
  initialAlertMessage?: string
}

// Mock data for demonstration
const mockProducts: Product[] = [
  ...Array.from(
    { length: 4 },
    (_, i): Product => ({
      id: `SGS23U-256GRN-EU${i}`,
      price: 1249.9,
      quantityUpdated: i % 3 === 0,
      availability: i % 4 ? 'available' : 'outOfStock',
      inventory: 100,
      name: `Business Smartphone X5 256GB/8GB ${['Green', 'Phantom Black', 'Lavender', 'Cream'][i]}`,
      selectedCount: i % 4 ? [18, 20, 20, 12][i] : 0,
      image: { url: '/image.png', alternateName: 'Business Smartphone' },
    })
  ),
  {
    id: 'SGS23U-512BLK-EU',
    price: 1499.9,
    availability: 'available',
    inventory: 100,
    name: 'Business Smartphone X5 512GB/12GB Phantom Black',
    selectedCount: 40,
    quantityUpdated: false,
    image: { url: '/image.png', alternateName: 'Business Smartphone' },
  },
]

export const QuickOrderDrawerProvider = ({
  children,
  initialProducts = mockProducts,
  onAddToCart: onAddToCartCallback,
  formatter,
  initialAlertMessage,
}: QuickOrderDrawerProviderProps) => {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [alertMessage, setAlertMessage] = useState<string>(
    initialAlertMessage || ''
  )

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
