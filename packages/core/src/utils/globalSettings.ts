import deepmerge from 'deepmerge'
import { usePage } from 'src/sdk/overrides/PageProvider'

export type GlobalCmsData = {
  regionalization?: RegionalizationCmsData
  deliveryPromise?: DeliveryPromiseCmsData
  fileUpload?: FileUploadCmsData
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

type FileUploadCmsData = {
  acceptedFileTypes?: string
  maxFileSize?: number
  errorMessages?: {
    unexpected?: {
      title?: string
      description?: string
    }
    unsupported?: {
      title?: string
      description?: string
    }
    unreadable?: {
      title?: string
      description?: string
    }
    invalidStructure?: {
      title?: string
      description?: string
    }
    empty?: {
      title?: string
      description?: string
    }
    tooLarge?: {
      title?: string
      description?: string
    }
  }
  labels?: {
    selectFile?: string
    downloadTemplate?: string
    search?: string
    remove?: string
    uploading?: string
    dropzone?: string
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
