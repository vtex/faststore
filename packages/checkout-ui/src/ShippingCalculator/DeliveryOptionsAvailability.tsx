import React, { FunctionComponent, Fragment } from 'react'
import { Box, Text } from '@vtex/store-ui'

interface Props {
  numberOfItems: number
  numberOfUnavailableItems: number
}

export const DeliveryOptionsAvailability: FunctionComponent<Props> = ({
  numberOfItems,
  numberOfUnavailableItems,
}) => {
  const allItemsUnavailable = numberOfUnavailableItems === numberOfItems

  return (
    <Fragment>
      {numberOfUnavailableItems > 0 && (
        <Box>
          {allItemsUnavailable ? (
            <Text>Products cannot be delivered to this address</Text>
          ) : (
            <Text>
              Products that cannot be delivered to this address were highlighted
            </Text>
          )}
        </Box>
      )}
    </Fragment>
  )
}
