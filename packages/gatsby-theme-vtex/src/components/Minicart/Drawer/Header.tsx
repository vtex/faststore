import React, { FC } from 'react'
import { Box, Button, Heading } from '@vtex/store-ui'
import { useIntl } from '@vtex/gatsby-plugin-i18n'

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
      <Button onClick={onClose} variant={`${headerVariant}.close`}>
        {formatMessage({ id: 'minicart.drawer.close' })}
      </Button>
      <Heading as="h1" variant={`${headerVariant}.title`}>
        {formatMessage({ id: 'minicart.drawer.count' }, { count })}
      </Heading>
    </Box>
  )
}
