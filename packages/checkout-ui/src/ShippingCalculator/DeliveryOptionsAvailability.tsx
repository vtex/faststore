import React, { FunctionComponent, Fragment } from 'react'
import { Box, Text } from '@vtex/store-ui'
import { useIntl } from '@vtex/gatsby-plugin-i18n'

interface Props {
  numberOfItems: number
  numberOfUnavailableItems: number
}

export const DeliveryOptionsAvailability: FunctionComponent<Props> = ({
  numberOfItems,
  numberOfUnavailableItems,
}) => {
  const intl = useIntl()
  const allItemsUnavailable = numberOfUnavailableItems === numberOfItems

  return (
    <Fragment>
      {numberOfUnavailableItems > 0 && (
        <Box>
          {allItemsUnavailable ? (
            <Text>
              {intl.formatMessage(
                { id: 'shipping-calculator.all-items-unavailable' },
                { numberOfUnavailableItems }
              )}
            </Text>
          ) : (
            <Text>
              {intl.formatMessage(
                { id: 'shipping-calculator.unavailable-items' },
                { numberOfUnavailableItems }
              )}
            </Text>
          )}
        </Box>
      )}
    </Fragment>
  )
}
