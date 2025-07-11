import deepmerge from 'deepmerge'
import { usePage } from 'src/sdk/overrides/PageProvider'

export type GlobalCmsData = {
  regionalization?: RegionalizationCmsData
  deliveryPromise?: DeliveryPromiseCmsData
}

type RegionalizationCmsData = {
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
}

type DeliveryPromiseCmsData = {
  deliveryMethods?: {
    title?: string
    description?: string
    setLocationButtonLabel?: string
    allDeliveryMethods?: string
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
      globalChangePickupPoint?: string
    }
    pickupPointChangeApplyButtonLabel?: string
    pickupPointClearFilterButtonLabel?: string
    choosePickupPointAriaLabel?: string
    noPickupPointsAvailableInLocation?: string
  }
  filterByPickupPoint?: {
    enabled?: boolean
    label?: string
    icon?: {
      icon?: string
      alt?: string
    }
  }
  deliveryOptions?: {
    enabled?: boolean
    title?: string
    allDeliveryOptions?: string
  }
  dynamicEstimate?: {
    enabled?: boolean
    sameDay?: string
    nextDay?: string
  }
  deliveryPromiseBadges?: {
    enabled?: boolean
    delivery?: string
    deliveryUnavailable?: string
    pickupInPoint?: string
    pickupInPointUnavailable?: string
  }
  inStock?: {
    enabled?: boolean
    title?: string
    label?: string
  }
}

export function getGlobalSettings(
  sectionRegionalizationData?: GlobalCmsData['regionalization']
): GlobalCmsData {
  const context = usePage()
  const globalData: GlobalCmsData = context?.globalSettings ?? {}

  if (sectionRegionalizationData === undefined) {
    return globalData
  }

  return deepmerge(globalData, { regionalization: sectionRegionalizationData })
}
