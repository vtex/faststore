import React from 'react'
import { Flex, Box } from 'theme-ui'
import type { FC } from 'react'
import { useIntl } from '@vtex/gatsby-plugin-i18n'

import { useNumberFormat } from '../../../sdk/localization/useNumberFormat'
import type { OrderFormData } from '../../../sdk/product/useAvailability'
import { useAvailability } from '../../../sdk/product/useAvailability'
import { UnavailableItems } from './ContentItems/UnavailableItems'
import { AvailableItems } from './ContentItems/AvailableItems'

export interface MinicartContentProps {
  data: OrderFormData
  variant: string
  imageElement: React.ElementType
}

export const HeaderMinicartDrawerContent: FC<MinicartContentProps> = ({
  data,
  variant: v,
  imageElement,
}) => {
  const { format } = useNumberFormat()
  const { formatMessage } = useIntl()
  const { available, unavailable } = useAvailability(data)
  const variant = `${v}.content`

  return (
    <Flex variant={variant}>
      {unavailable.length > 0 && (
        <UnavailableItems
          items={unavailable}
          imageElement={imageElement}
          variant={variant}
          formats={{ format, formatMessage }}
        />
      )}
      {unavailable.length > 0 && available.length > 0 && (
        <Box variant={`${variant}.section`}>
          {available.length}
          {available.length > 1
            ? ' produtos disponíveis'
            : ' produto disponível'}
        </Box>
      )}
      {available.length > 0 && (
        <AvailableItems
          items={available}
          imageElement={imageElement}
          variant={variant}
          formats={{ format, formatMessage }}
        />
      )}
    </Flex>
  )
}
