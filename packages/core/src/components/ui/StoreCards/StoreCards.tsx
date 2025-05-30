import {
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
}

function StoreCards({ selectedOption, onChange }: StoreCardsProps) {
  const pickupPoints = usePickupPoints()

  if (pickupPoints?.length === 0) {
    // TODO: Adjust this according prototype
    return <p>no stores</p>
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
