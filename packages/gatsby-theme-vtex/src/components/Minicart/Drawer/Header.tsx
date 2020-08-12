import React, { FC } from 'react'
import { Box, Button, Heading } from '@vtex/store-ui'

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
        Close
      </Button>
      <Heading as="h1" variant={`${headerVariant}.title`}>
        {`Cart (${count})`}
      </Heading>
    </Box>
  )
}
