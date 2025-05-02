import { Button as UIButton } from '@faststore/ui'
import { sessionStore } from 'src/sdk/session'
import { textToTitleCase } from 'src/utils/utilities'

interface DeliveryCustomLabels {
  delivery?: string
  pickupInPoint?: string
  pickupNearby?: string
  pickupAll?: string
}

interface FacetValue {
  value: string
  label: string
  selected: boolean
  quantity: number
}

interface FilterDeliveryOptionProps {
  item: FacetValue
  deliveryCustomLabels: DeliveryCustomLabels
}

export function FilterDeliveryOption({
  item,
  deliveryCustomLabels,
}: FilterDeliveryOptionProps) {
  const { city, postalCode } = sessionStore.read()
  const location = city ? `${textToTitleCase(city)}, ${postalCode}` : postalCode

  const mapShippingLabel: Record<string, string> = {
    delivery: deliveryCustomLabels?.delivery ?? 'Deliver to',
    'pickup-in-point': deliveryCustomLabels?.pickupInPoint ?? 'Pickup at',
    'pickup-nearby': deliveryCustomLabels?.pickupNearby ?? 'Pickup Nearby',
    'pickup-all': deliveryCustomLabels?.pickupAll ?? 'Pickup Anywhere',
  }

  if (item.value === 'delivery') {
    return (
      <>
        {mapShippingLabel[item.value]}
        <UIButton
          data-fs-filter-list-item-button
          size="small"
          onClick={() => {
            // TODO: open edit local slideOver
            window.alert('Open Modal')
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
        {mapShippingLabel[item.value]}
        <UIButton
          data-fs-filter-list-item-button
          size="small"
          onClick={() => {
            // TODO: open edit local slideOver
            window.alert('Open Modal')
          }}
        >
          Robson St
        </UIButton>
      </>
    )
  }

  return <>{mapShippingLabel[item.value]}</>
}
export default FilterDeliveryOption
