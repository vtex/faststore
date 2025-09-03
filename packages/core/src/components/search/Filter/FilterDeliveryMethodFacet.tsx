import { regionSliderTypes, Button as UIButton, useUI } from '@faststore/ui'
import { sessionStore } from '../../../sdk/session'
import type { GlobalCmsData } from '../../../utils/globalSettings'
import { textToTitleCase } from '../../../utils/utilities'

interface FacetValue {
  value: string
  label: string
  selected: boolean
  quantity: number
}

interface FilterDeliveryMethodFacetProps {
  item: FacetValue
  deliveryMethods: GlobalCmsData['deliveryPromise']['deliveryMethods']
}

export default function FilterDeliveryMethodFacet({
  item,
  deliveryMethods,
}: FilterDeliveryMethodFacetProps) {
  const { city, postalCode } = sessionStore.read()
  const { openRegionSlider } = useUI()

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
            openRegionSlider(regionSliderTypes.changePickupPoint)
          }}
        >
          {item.label}
        </UIButton>
      </>
    )
  }

  return <>{mapDeliveryMethodLabel[item.value] ?? item.label}</>
}
