import { regionSliderTypes, Button as UIButton, useUI } from '@faststore/ui'
import { RegionSlider } from 'src/components/region/RegionSlider'
import { sessionStore } from 'src/sdk/session'
import type { RegionalizationCmsData } from 'src/utils/globalSettings'
import { textToTitleCase } from 'src/utils/utilities'

interface FacetValue {
  value: string
  label: string
  selected: boolean
  quantity: number
}

interface FilterDeliveryOptionProps {
  item: FacetValue
  deliveryMethods: RegionalizationCmsData['deliverySettings']['deliveryMethods']
  cmsData: Record<string, any>
}

export default function FilterDeliveryOption({
  item,
  deliveryMethods,
  cmsData,
}: FilterDeliveryOptionProps) {
  const { city, postalCode } = sessionStore.read()
  const {
    regionSlider: { type: regionSliderType },
    openRegionSlider,
  } = useUI()

  const location = city ? `${textToTitleCase(city)}, ${postalCode}` : postalCode
  const mapDeliveryMethodLabel: Record<string, string> = {
    delivery: deliveryMethods?.delivery ?? 'Shipping to',
    'pickup-in-point': deliveryMethods?.pickupInPoint ?? 'Pickup at',
    'pickup-nearby': deliveryMethods?.pickupNearby ?? 'Pickup Nearby',
    'pickup-all': deliveryMethods?.pickupAll?.label ?? 'Pickup Anywhere',
  }

  if (item.value === 'delivery') {
    return (
      <>
        {mapDeliveryMethodLabel[item.value]}
        <UIButton
          data-fs-filter-list-item-button
          size="small"
          onClick={() => {
            openRegionSlider(regionSliderTypes.changeLocation)
          }}
        >
          {location}
        </UIButton>
        {regionSliderType === regionSliderTypes.changeLocation && (
          <RegionSlider cmsData={cmsData} />
        )}
      </>
    )
  }

  if (item.value === 'pickup-in-point') {
    return (
      <>
        {mapDeliveryMethodLabel[item.value]}
        <UIButton
          data-fs-filter-list-item-button
          size="small"
          onClick={() => {
            // TODO: open edit local slideOver
            window.alert('Open Modal')
          }}
        >
          {item.label}
        </UIButton>
      </>
    )
  }

  return <>{mapDeliveryMethodLabel[item.value]}</>
}
