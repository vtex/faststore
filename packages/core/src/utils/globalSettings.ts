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
      title?: string
      allDeliveryMethods?: string
      delivery?: string
      pickupInPoint?: string
      pickupNearby?: string
      pickupAll?: {
        label?: string
        enabled?: boolean
      }
    }
    deliveryOptions?: {
      title?: string
      allDeliveryOptions?: string
      expressDelivery?: string
      standardDelivery?: string
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
  deliveryOptions?: {
    allDeliveryOptions?: string
  }
}

export function getRegionalizationSettings(
  sectionRegionalizationData?: RegionalizationCmsData
): RegionalizationCmsData {
  const context = usePage()
  const globalRegionalizationData =
    context?.globalSettings?.regionalization ?? {}

  if (sectionRegionalizationData === undefined) {
    return globalRegionalizationData
  }
  return deepmerge(globalRegionalizationData, sectionRegionalizationData)
}
