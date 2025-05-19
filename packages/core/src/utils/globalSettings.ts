import deepmerge from 'deepmerge'
import {
  type PLPContext,
  type SearchPageContext,
  usePage,
} from 'src/sdk/overrides/PageProvider'

export type RegionalizationCmsData = {
  inputField?: {
    label?: string
    errorMessage?: string
    noProductsAvailableErrorMessage?: string
    buttonActionText?: string
  }
  idkPostalCodeLink?: {
    text?: string
    to?: string
    icon?: {
      icon?: string
      alt?: string
    }
  }
  deliverySettings?: {
    title?: string
    description?: string
    setLocationButtonLabel?: string
    deliveryCustomLabels?: {
      delivery?: string
      pickupInPoint?: string
      pickupNearby?: string
      pickupAll?: string
    }
  }
}

export function getRegionalizationSettings(
  deliverySettings?: RegionalizationCmsData['deliverySettings']
): RegionalizationCmsData {
  const context = usePage<SearchPageContext | PLPContext>()
  const regionalizationData =
    context?.globalSectionsSettings?.regionalization ?? {}
  return deepmerge(regionalizationData, {
    deliverySettings,
  })
}
