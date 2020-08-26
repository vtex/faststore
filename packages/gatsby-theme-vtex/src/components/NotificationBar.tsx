import React, { FC } from 'react'
import { Box } from '@vtex/store-ui'
// import { useLocalizationIntl } from '@vtex/gatsby-plugin-i18n'

interface Props {
  // text: string
  variant?: string
}

const StoreHeaderNotificationBar: FC<Props> = ({ variant }) => {
  // const { formatMessage } = useLocalizationIntl()
  return (
    <Box variant={variant}>OLA</Box>
  )
}

export default StoreHeaderNotificationBar
