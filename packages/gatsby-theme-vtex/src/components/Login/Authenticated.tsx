import { useIntl } from '@vtex/gatsby-plugin-i18n'
import { Box, LocalizedLink } from '@vtex/store-ui'
import React, { FC } from 'react'

import Logo from './Logo'

interface Props {
  name: string
}

const Authenticated: FC<Props> = ({ name }) => {
  const { formatMessage } = useIntl()

  return (
    <LocalizedLink to="/account">
      <Logo />
      <Box variant="login.button.greeting">
        {formatMessage(
          { id: 'login.button.greeting', defaultMessage: 'Hello {name}' },
          { name }
        )}
      </Box>
    </LocalizedLink>
  )
}

export default Authenticated
