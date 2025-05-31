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
    postalCodeEditSlider?: {
      setLocation?: string
      changeLocation?: string
      changeStore?: string
    }
    deliveryMethods?: {
      delivery?: string
      pickupInPoint?: string
      pickupNearby?: string
      pickupAll?: {
        label?: string
        enabled?: boolean
      }
    }
  }
}

export function getRegionalizationSettings(
  deliverySettings?: RegionalizationCmsData['deliverySettings']
): RegionalizationCmsData {
  const context = usePage<SearchPageContext | PLPContext>()
  const regionalizationData =
    context?.globalSectionsSettings?.regionalization ?? {}

  if (deliverySettings !== undefined) {
    return deepmerge(regionalizationData, {
      deliverySettings,
    })
  }

  return regionalizationData
}
