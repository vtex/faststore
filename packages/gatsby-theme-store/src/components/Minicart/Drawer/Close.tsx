import { useIntl } from '@vtex/gatsby-plugin-i18n'
import { Button } from '@vtex/store-ui'
import React, { FC } from 'react'

interface MinicartCloseProps {
  variant?: string
  onClose?: () => void
}

export const MinicartClose: FC<MinicartCloseProps> = ({ onClose, variant }) => {
  const customVariant = `${variant}.close`
  const { formatMessage } = useIntl()

  return (
    <Button onClick={onClose} variant={customVariant}>
      {formatMessage({ id: 'minicart.drawer.close' })}
    </Button>
  )
}
