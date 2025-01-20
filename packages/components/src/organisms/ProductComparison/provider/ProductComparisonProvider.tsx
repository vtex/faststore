import React, { createContext, ReactNode, useState } from 'react'

export interface IProductComparison {
  slug: string
  sku: string
  name: string
  gtin: string
  id: string
  unitMultiplier: number
  brand: { name: string; brandName: string }
  isVariantOf: {
    productGroupID: string
    name: string
    skuVariants: {
      activeVariations: any | null
      slugsMap: any | null
      availableVariations: any | null
      allVariantProducts: Array<{
        name: string
        productID: string
      }> | null
    }
  }
  image: Array<{ url: string; alternateName: string }>
  offers: {
    lowPrice: number
    lowPriceWithTaxes: number
    offers: Array<{
      availability: string
      price: number
      listPrice: number
      listPriceWithTaxes: number
      priceWithTaxes: number
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
  skuSpecifications?: Array<{ field: string; values: string[] }>
}

export interface ProductComparisonProviderContextValue {
  /*
    A boolean value that indicates if the modal is open.
  */
  isOpen: boolean
  /*
    function to set the modal is open
  */
  setIsOpen: (isOpen: boolean) => void
  /*
   * Array of all product ids selected to compare.
   */
  productIds: string[]
  /*
   * Array of all products selected to compare.
   */
  products: IProductComparison[]
  /*
   * Function to handle the product ids selected to compare.
   */
  handleProductsIds: (product: IProductComparison) => void
  /*
   * Function to handle the products selected to compare.
   */
  handleProductsComparison: (products: IProductComparison[]) => void
  /*
   * Function to clear all products selected to compare.
   */
  clearProducts: () => void
}

export const ProductComparisonContext = createContext<
  ProductComparisonProviderContextValue | undefined
>(undefined)

function ProductComparisonProvider({ children }: { children: ReactNode }) {
  const [productIds, setProductIds] = useState<string[]>([])
  const [products, setProducts] = useState<IProductComparison[]>([])
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

  return (
    <ProductComparisonContext.Provider
      value={{
        isOpen,
        setIsOpen,
        productIds,
        products,
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
