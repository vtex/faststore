import React from 'react'
import { Button } from 'theme-ui'
import { FormattedMessage } from '@vtex/gatsby-plugin-i18n'
import type { FC } from 'react'

interface Props {
  variant: string
  onClose?: () => void
}

const MinicartDrawerCloseButton: FC<Props> = ({ onClose, variant }) => (
  <Button onClick={onClose} variant={`${variant}.close`}>
    <FormattedMessage id="minicart.drawer.close" />
  </Button>
)

export default MinicartDrawerCloseButton
