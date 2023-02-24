import React, { useContext } from 'react'

export type SkuVariantsByName = Record<
  string,
  Array<{ alt: string; src: string; label: string; value: string }>
>

interface ContextState {
  /**
   * Maps property value combinations to their respective SKU's slug
   */
  slugsMap: Record<string, string>
  /**
   * Available options for each varying SKU property, taking into account the `dominantVariantName` property.
   */
  availableVariations: SkuVariantsByName
  /**
   * SKU property values for the current SKU.
   */
  activeVariations: Record<string, string>
  /**
   * Name of the property that's considered **dominant**. Which means that all
   * other varying properties will be filtered according to the current value
   * of this property.
   *
   * Ex: If `Red` is the current value for the 'Color' variation, we'll only
   * render possible values for 'Size' that are available in `Red`.
   */
  dominantProperty: string
}

export const SkuSelectorsContext = React.createContext<
  ContextState | undefined
>(undefined)

export function useSkuSelectors() {
  const context = useContext(SkuSelectorsContext)

  if (!context) {
    throw new Error(
      `useSkuSelector hook cannot be used outside a SkuSelectorContext context.`
    )
  }

  return context
}
