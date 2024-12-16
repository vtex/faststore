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
}

export interface ProductComparisonProviderContextValue {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  selectedProducts: IProductComparison[]
  handleProductsComparison: (product: IProductComparison) => void
  clearProducts: () => void
}

export const ProductComparisonContext = createContext<ProductComparisonProviderContextValue | undefined>(undefined)

function ProductComparisonProvider({children}: {children: ReactNode}) {
  const [selectedProducts, setSelectedProducts] = useState<IProductComparison[]>([])
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    console.log(selectedProducts)
  }, [selectedProducts])

  function handleProductsComparison(product: IProductComparison) {
    setSelectedProducts((prev) => {
      const productIndex = prev.findIndex((selectedProduct) => selectedProduct.id === product.id)

      if (productIndex === -1) {
        return [...prev, product]
      } else {
        return prev.filter((selectedProduct) => selectedProduct.id !== product.id)
      }
    })
  }

  function clearProducts(){
    setSelectedProducts([])
  }

  return (
    <ProductComparisonContext.Provider value={{
      isOpen,
      setIsOpen,
      selectedProducts,
      handleProductsComparison,
      clearProducts
    }}>
      {children}
    </ProductComparisonContext.Provider>
  )
}

export default ProductComparisonProvider