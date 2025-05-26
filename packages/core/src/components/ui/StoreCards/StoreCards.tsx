import {
  List as UIList,
  RadioGroup as UIRadioGroup,
  RadioOption as UIRadioOption,
} from '@faststore/ui'
import { useState } from 'react'
import { usePickupPoints } from 'src/sdk/shipping/usePickupPoints'
import { StoreCard } from './StoreCard'

function StoreCards() {
  const [option, setOption] = useState<string | number>('')

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOption(event.target.value)
    // TODO: Handle the change event as needed
    console.log(event.target.value)
  }

  const pickupPoints = usePickupPoints()
  console.log(pickupPoints)

  if (pickupPoints?.length === 0) {
    // TODO: Adjust this according prototype
    return <p>no stores</p>
  }

  return (
    <UIList as="ol" data-fs-store-cards>
      <UIRadioGroup
        name="radio-group"
        onChange={(v) => {
          handleChange(v)
        }}
        selectedValue={option}
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
