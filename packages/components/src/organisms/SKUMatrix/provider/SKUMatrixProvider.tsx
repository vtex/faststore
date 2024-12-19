import React, { createContext, useCallback, useState, SetStateAction  } from 'react'
import type { ReactNode } from 'react'

interface IAllVariantProducts {
  id: string
  name: string
  image: {
    url: string
    alternateName: string
  }
  inventory: number
  availability: string
  price: number
  listPrice: number
  priceWithTaxes: number
  listPriceWithTaxes: number
  specifications: Record<string, string>
  selectedCount: number
  offers: {
    highPrice: number
    lowPrice: number
    lowPriceWithTaxes: number
    offerCount: number
    priceCurrency: string
    offers: Array<{
      listPrice: number
      listPriceWithTaxes: number
      sellingPrice: number
      priceCurrency: string
      price: number
      priceWithTaxes: number
      priceValidUntil: string
      itemCondition: string
      availability: string
      quantity: number
    }>
  }
}

export interface SKUMatrixProviderContextValue {
  /*
    A boolean value that indicates if the modal is open.
  */
  isOpen: boolean
  /*
    Array of all variant products.
  */
  allVariantProducts: IAllVariantProducts[]
  /*
    Function to set the array of all variant products.
  */
  setAllVariantProducts(
    items: SetStateAction<IAllVariantProducts[]>
  ): void
  /*
  */
  onChangeQuantityItem(id: string, value: number): IAllVariantProducts[]
  /*
    function to set the modal is open
  */
  setIsOpen(value: boolean): void
}

export const SKUMatrixContext =
  createContext<SKUMatrixProviderContextValue | null>(null)

function SKUMatrixProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [allVariantProducts, setAllVariantProducts] = useState<
    IAllVariantProducts[]
  >([])

  const onChangeQuantityItem = useCallback(
    (id: string, value: number) => {
      const data = [...allVariantProducts]
      const matchedSKU = data.find((item) => item.id === id)
      
      if(matchedSKU) {
        matchedSKU.selectedCount = value
      }

      setAllVariantProducts(data)

      return data
    },
    [allVariantProducts]
  )

  return (
    <SKUMatrixContext.Provider
      value={{
        isOpen,
        allVariantProducts,
        setAllVariantProducts,
        onChangeQuantityItem,
        setIsOpen,
      }}
    >
      {children}
    </SKUMatrixContext.Provider>
  )
}

export default SKUMatrixProvider
