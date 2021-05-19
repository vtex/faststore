import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Box, Heading } from 'theme-ui'
import type { FC, MouseEventHandler } from 'react'

import MinicartDrawerCloseButton from './CloseButton'

interface Props {
  variant: string
  count: number
  onClose?: MouseEventHandler<HTMLButtonElement>
}

const MinicartDrawerHeader: FC<Props> = ({ onClose, count, variant: v }) => {
  const variant = `${v}.header`

  return (
    <Box variant={variant}>
      <MinicartDrawerCloseButton variant={variant} onClose={onClose} />
      <Heading as="h1" variant={`${variant}.title`}>
        <FormattedMessage id="minicart.drawer.count" values={{ count }} />
      </Heading>
    </Box>
  )
}

export default MinicartDrawerHeader
