import React, { FC } from 'react'
import { Box, Button, Heading } from '@vtex/store-ui'
import { FormattedMessage } from 'react-intl'

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

  return (
    <Box variant={headerVariant}>
      <Button onClick={onClose} variant={`${headerVariant}.close`}>
        <FormattedMessage id="minicart.drawer.close" />
      </Button>
      <Heading as="h1" variant={`${headerVariant}.title`}>
        <FormattedMessage id="minicart.drawer.count" values={{ count }} />
      </Heading>
    </Box>
  )
}
