import React, { FC, Fragment } from 'react'
import { helpers } from '@vtex/address-form'
import { Text, Button, Flex, Box } from '@vtex/store-ui'
import { useIntl } from '@vtex/gatsby-plugin-i18n'

import { AddressWithValidation, DeliveryOption } from './types'
import { ShippingOptions } from './ShippingOptions'

const { removeValidation } = helpers

interface CustomProps {
  address: AddressWithValidation
  canEditData: boolean
  options: DeliveryOption[]
  setShowResult: (showResult: boolean) => void
  selectDeliveryOption: (option: string) => void
  numberOfItems: number
  numberOfUnavailableItems: number
}

export const ShippingResult: FC<CustomProps> = ({
  address,
  canEditData,
  options,
  setShowResult,
  selectDeliveryOption,
  numberOfItems,
  numberOfUnavailableItems,
}) => {
  const intl = useIntl()

  const { postalCode } = removeValidation(address)

  return (
    <Fragment>
      <Flex mb=".75rem" sx={{ alignItems: 'center' }}>
        <Box id="postal-code" sx={{ flex: '1 1 auto' }}>
          <Text as="span" sx={{ fontWeight: 500 }}>
            {intl.formatMessage({ id: 'shipping-calculator.delivery-for' })}
          </Text>{' '}
          {postalCode}
        </Box>
        {canEditData && (
          <Box sx={{ flex: 'none' }}>
            <Button
              id="edit-shipping"
              variant="plain"
              onClick={() => setShowResult(false)}
              sx={{ textTransform: 'lowercase' }}
            >
              {intl.formatMessage({ id: 'shipping-calculator.edit' })}
            </Button>
          </Box>
        )}
      </Flex>
      <ShippingOptions
        numberOfItems={numberOfItems}
        numberOfUnavailableItems={numberOfUnavailableItems}
        options={options}
        selectDeliveryOption={selectDeliveryOption}
      />
    </Fragment>
  )
}
