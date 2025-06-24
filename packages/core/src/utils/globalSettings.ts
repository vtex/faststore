import deepmerge from 'deepmerge'
import { usePage } from 'src/sdk/overrides/PageProvider'

export type RegionalizationCmsData = {
  inputField?: {
    label?: string
    errorMessage?: string
    noProductsAvailableErrorMessage?: string
    buttonActionText?: string
    errorMessageHelper?: string
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
    deliveryMethods?: {
      delivery?: string
      pickupInPoint?: string
      pickupNearby?: string
      pickupAll?: {
        label?: string
        enabled?: boolean
      }
    }
    regionSlider?: {
      title?: {
        setLocation?: string
        changeLocation?: string
        changePickupPoint?: string
      }
      pickupPointChangeApplyButtonLabel?: string
      choosePickupPointAriaLabel?: string
      noPickupPointsAvailableInLocation?: string
    }
  }
}

export function getRegionalizationSettings(
  sectionRegionalizationData?: RegionalizationCmsData['deliverySettings']
): RegionalizationCmsData {
  const context = usePage()
  const globalRegionalizationData =
    context?.globalSettings?.regionalization ?? {}

  if (sectionRegionalizationData === undefined) {
    return globalRegionalizationData
  }
  return deepmerge(globalRegionalizationData, {
    deliverySettings: sectionRegionalizationData,
  })
}
