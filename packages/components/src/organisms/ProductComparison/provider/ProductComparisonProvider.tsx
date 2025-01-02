import React, { createContext, ReactNode, useEffect, useState } from 'react'

export interface IProductComparison {
  slug: string
  sku: string
  name: string
  gtin: string
  id: string
  brand: { name: string; brandName: string }
  isVariantOf: { productGroupID: string; name: string }
  image: Array<{ url: string; alternateName: string }>
  offers: {
    lowPrice: number
    lowPriceWithTaxes: number
    offers: Array<{
      availability: string
      price: number
      listPrice: number
      listPriceWithTaxes: number
      quantity: number
      seller: { identifier: string }
    }>
  }
  additionalProperty: Array<{
    propertyID: string
    name: string
    value: any
    valueReference: any
  }>
  advertisement: { adId: string; adResponseId: string } | null
  hasSpecifications?: boolean
  skuSpecifications?: Array<{ field: string; values: string }>
}

export interface ProductComparisonProviderContextValue {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  productIds: string[]
  products: IProductComparison[]
  setProducts: (products: IProductComparison[]) => void
  handleProductsIds: (product: IProductComparison) => void
  handleProductsComparison: (products: IProductComparison[]) => void
  clearProducts: () => void
}

export const ProductComparisonContext = createContext<
  ProductComparisonProviderContextValue | undefined
>(undefined)

function ProductComparisonProvider({ children }: { children: ReactNode }) {
  const [productIds, setProductIds] = useState<string[]>([])
  const [products, setProducts] = useState<
    IProductComparison[]
  >([])
  const [isOpen, setIsOpen] = useState(false)

  function handleProductsIds(product: IProductComparison) {
    setProductIds((prev) => {
      if (prev.includes(product?.id)) {
        return prev.filter((id) => id !== product.id)
      }
      return [...prev, product.id]
    })

    setProducts((prev) => {
      if (prev.some((p) => p.id === product.id)) {
        return prev.filter((p) => p.id !== product.id)
      }
      return [...prev, product]
    })
  }

  function handleProductsComparison(products: IProductComparison[]) {
    const productSelectedWithFullData = products.map((product) => {
      const productAlreadySelected = products.find((p) => p.id === product.id)
      return {
        ...product,
        ...productAlreadySelected,
      }
    })

    setProducts(productSelectedWithFullData)
  }

  function clearProducts() {
    setProductIds([])
    setProducts([])
  }

  useEffect(() => {
  }, [productIds])

  return (
    <ProductComparisonContext.Provider
      value={{
        isOpen,
        setIsOpen,
        productIds,
        products,
        setProducts,
        handleProductsIds,
        handleProductsComparison,
        clearProducts,
      }}
    >
      {children}
    </ProductComparisonContext.Provider>
  )
}

export default ProductComparisonProvider
