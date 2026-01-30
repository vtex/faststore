import { regionSliderTypes, Button as UIButton, useUI } from '@faststore/ui'
import type { StoreFacetValueBoolean } from '@generated/graphql'
import { sessionStore } from 'src/sdk/session'
import type { GlobalCmsData } from 'src/utils/globalSettings'
import { textToTitleCase } from 'src/utils/utilities'

interface FilterDeliveryMethodFacetProps {
  item: StoreFacetValueBoolean
  deliveryMethods: GlobalCmsData['deliveryPromise']['deliveryMethods']
}

export default function FilterDeliveryMethodFacet({
  item,
  deliveryMethods,
}: FilterDeliveryMethodFacetProps) {
  const { city, postalCode } = sessionStore.read()
  const { openRegionSlider } = useUI()

  const location = city ? `${textToTitleCase(city)}, ${postalCode}` : postalCode
  const mapDeliveryMethodLabel: Record<string, string | undefined> = {
    delivery: deliveryMethods?.delivery,
    'pickup-in-point': deliveryMethods?.pickupInPoint,
    'pickup-nearby': deliveryMethods?.pickupNearby,
    'pickup-all': deliveryMethods?.pickupAll?.label,
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
