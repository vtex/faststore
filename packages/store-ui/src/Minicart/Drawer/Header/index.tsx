import React from 'react'
import { FormattedMessage } from '@vtex/gatsby-plugin-i18n'
import { Box, Heading } from 'theme-ui'
import type { FC } from 'react'

import MinicartDrawerCloseButton from './CloseButton'

interface Props {
  variant: string
  count: number
  onClose?: () => void
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
