import {
  EmptyState as UIEmptyState,
  Icon as UIIcon,
  List as UIList,
  RadioGroup as UIRadioGroup,
  RadioOption as UIRadioOption,
} from '@faststore/ui'
import type { ChangeEventHandler } from 'react'
import { usePickupPoints } from 'src/sdk/shipping/usePickupPoints'
import { StoreCard } from './StoreCard'

export interface StoreCardsProps {
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
}

function StoreCards({
  selectedOption,
  onChange,
  noStoresAvailableMessage,
  regionErrorMessage,
}: StoreCardsProps) {
  const pickupPoints = usePickupPoints()

  if (regionErrorMessage) {
    return (
      <UIEmptyState
        title={regionErrorMessage ?? 'Error fetching stores near location.'}
        titleIcon={
          <UIIcon name="MapPin" width={56} height={56} weight="thin" />
        }
        bkgColor="light"
      >
        <span>Try using a different postal code.</span>
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
    <UIList as="ol" data-fs-store-cards>
      <UIRadioGroup
        name="radio-group"
        onChange={onChange}
        selectedValue={selectedOption}
      >
        {pickupPoints?.map((item) => (
          <li data-fs-store-cards-item key={item.id}>
            <UIRadioOption value={item.id} label={item.name}>
              <StoreCard
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

export default StoreCards
