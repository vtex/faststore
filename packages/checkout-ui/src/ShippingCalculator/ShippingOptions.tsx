import React, { FC, Fragment } from 'react'
import { Radio } from '@vtex/store-ui'

import { ShippingInfo } from './ShippingInfo'
import { DeliveryOptionsAvailability } from './DeliveryOptionsAvailability'
import { slugify } from './utils/slugify'
import { DeliveryOption } from './types'

interface CustomProps {
  numberOfItems: number
  numberOfUnavailableItems: number
  options: DeliveryOption[]
  selectDeliveryOption: (option: string) => void
}

export const ShippingOptions: FC<CustomProps> = ({
  numberOfItems,
  numberOfUnavailableItems,
  options = [],
  selectDeliveryOption,
}) => {
  const handleChange = (event: React.FormEvent<HTMLInputElement>) => {
    selectDeliveryOption(event.currentTarget.value)
  }

  const allItemsUnavailable = numberOfUnavailableItems === numberOfItems

  return (
    <Fragment>
      <DeliveryOptionsAvailability
        numberOfItems={numberOfItems}
        numberOfUnavailableItems={numberOfUnavailableItems}
      />
      {numberOfUnavailableItems > 0 && !allItemsUnavailable && (
        <div className="fw5 mt6 mb6">
          Options for remaining {numberOfItems - numberOfUnavailableItems}{' '}
          products
        </div>
      )}

      {options &&
        options.length > 0 &&
        options.map((option, i) => {
          const optionId = slugify(`shipping-option-${option.id}`)
          // eslint-disable-next-line
          const isLast = i + 1 >= options.length

          return (
            <div key={optionId} className={isLast ? '' : 'mb5'}>
              <label htmlFor={optionId}>
                <Radio
                  key={optionId}
                  name={optionId}
                  id={optionId}
                  checked={option.isSelected}
                  onChange={handleChange}
                  value={option.id}
                />
                <ShippingInfo option={option} />
              </label>
            </div>
          )
        })}
    </Fragment>
  )
}
