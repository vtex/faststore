import { useIntl } from '@vtex/gatsby-plugin-i18n'
import { Box, Heading } from '@vtex/store-ui'
import React from 'react'
import type { FC } from 'react'

import { MinicartClose } from './Close'

interface HeaderMinicartDrawerHeaderProps {
  variant?: string
  onClose?: () => void
  count?: number
}

export const HeaderMinicartDrawerHeader: FC<HeaderMinicartDrawerHeaderProps> = ({
  onClose,
  count,
  variant,
}) => {
  const headerVariant = `${variant}.header`
  const { formatMessage } = useIntl()

  return (
    <Box variant={headerVariant}>
      <MinicartClose variant={headerVariant} onClose={onClose} />
      <Heading as="h1" variant={`${headerVariant}.title`}>
        {formatMessage({ id: 'minicart.drawer.count' }, { count })}
      </Heading>
    </Box>
  )
}
