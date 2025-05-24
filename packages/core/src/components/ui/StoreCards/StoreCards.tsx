import {
  List as UIList,
  RadioGroup as UIRadioGroup,
  RadioOption as UIRadioOption,
} from '@faststore/ui'
import { useState } from 'react'
import { StoreCard } from './StoreCard'

function StoreCards() {
  const [option, setOption] = useState<string | number>('')

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOption(event.target.value)
    console.log(event.target.value)
  }

  const store = {
    name: 'Botafogo',
    postalCode: '22250-040',
    address: 'Av. Brigadeiro Faria Lima',
    number: '4440',
    city: 'São Paulo',
    state: 'SP',
    distance: 125.0,
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
        <li data-fs-store-cards-item>
          <UIRadioOption value="radio-1" label="Radio 1">
            <StoreCard store={store} />
          </UIRadioOption>
        </li>
        <li data-fs-store-cards-item>
          <UIRadioOption value="radio-2" label="Radio 2">
            <StoreCard store={store} />
          </UIRadioOption>
        </li>
      </UIRadioGroup>
    </UIList>
  )
}

export default StoreCards
