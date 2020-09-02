/** @jsx jsx */
import { FC, Fragment } from 'react'
import { Label, Radio, Box, jsx } from '@vtex/store-ui'
import { useIntl } from '@vtex/gatsby-plugin-i18n'

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
  const intl = useIntl()

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
        <Box sx={{ fontWeight: 500 }} mt="1.5rem" mb="1.5rem">
          {intl.formatMessage(
            { id: 'shipping-calculator.options-for-remaining-products' },
            {
              numberOfOptions: options.length,
              numberOfItems: numberOfItems - numberOfUnavailableItems,
            }
          )}
        </Box>
      )}

      {options &&
        options.length > 0 &&
        options.map((option, i) => {
          const optionId = slugify(`shipping-option-${option.id}`)
          // eslint-disable-next-line
          const isLast = i + 1 >= options.length

          return (
            <Box
              key={optionId}
              sx={{ ...(!isLast ? { marginBottom: '1rem' } : null) }}
            >
              <Label
                sx={{
                  display: 'flex',
                  position: 'relative',
                  alignItems: 'start',
                }}
                htmlFor={optionId}
              >
                <Radio
                  size={20}
                  key={optionId}
                  name={optionId}
                  id={optionId}
                  checked={option.isSelected}
                  onChange={handleChange}
                  value={option.id}
                />
                <ShippingInfo option={option} />
              </Label>
            </Box>
          )
        })}
    </Fragment>
  )
}
