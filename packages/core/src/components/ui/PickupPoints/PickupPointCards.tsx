import {
  EmptyState as UIEmptyState,
  Icon as UIIcon,
  List as UIList,
  RadioGroup as UIRadioGroup,
  RadioOption as UIRadioOption,
} from '@faststore/ui'
import type { ChangeEventHandler } from 'react'
import { usePickupPoints } from 'src/sdk/shipping/usePickupPoints'
import { PickupPointCard } from './PickupPointCard'

export interface PickupPointCardsProps {
  /**
   * Selected option value.
   */
  selectedOption?: string
  /**
   * Function that is triggered when any option is selected.
   */
  onChange?: ChangeEventHandler<HTMLInputElement>
  /**
   * Message to be displayed when no stores are available.
   */
  noStoresAvailableMessage?: string
  /**
   * Message to be displayed when there is an error when setting the location.
   */
  regionErrorMessage?: string
  /**
   * Helper message to be displayed when there is an error when setting the location.
   */
  regionErrorHelperMessage?: string
  /**
   * Aria label for the radio group.
   */
  choosePickupPointAriaLabel?: string
}

function PickupPointCards({
  selectedOption,
  onChange,
  noStoresAvailableMessage,
  regionErrorMessage,
  regionErrorHelperMessage,
  choosePickupPointAriaLabel = 'Select a store',
}: PickupPointCardsProps) {
  const pickupPoints = usePickupPoints()

  if (regionErrorMessage) {
    return (
      <UIEmptyState
        title={regionErrorMessage ?? ''}
        titleIcon={
          <UIIcon name="MapPin" width={56} height={56} weight="thin" />
        }
        bkgColor="light"
      >
        <p>{regionErrorHelperMessage}</p>
      </UIEmptyState>
    )
  }

  if (pickupPoints?.length === 0) {
    return (
      <UIEmptyState
        title={noStoresAvailableMessage ?? 'No available stores near location.'}
        titleIcon={
          <UIIcon name="Storefront" width={56} height={56} weight="thin" />
        }
        bkgColor="light"
      />
    )
  }

  return (
    <UIList as="ol" data-fs-pickup-point-cards>
      <UIRadioGroup
        name="stores-radio-group"
        onChange={onChange}
        selectedValue={selectedOption}
        aria-label={choosePickupPointAriaLabel}
      >
        {pickupPoints?.map((item) => (
          <li data-fs-pickup-point-cards-item key={item.id}>
            <UIRadioOption value={item.id} label={item.name}>
              <PickupPointCard
                store={{
                  name: item.name,
                  address: item.addressStreet,
                  number: item.addressNumber,
                  city: item.addressCity,
                  state: item.addressState,
                  postalCode: item.addressPostalCode,
                  distance: item.distance,
                }}
              />
            </UIRadioOption>
          </li>
        ))}
      </UIRadioGroup>
    </UIList>
  )
}

export default PickupPointCards
