/** @jsx jsx */
import { useIntl } from '@vtex/gatsby-plugin-i18n'
import { Box, LocalizedLink, jsx } from '@vtex/store-ui'
import { FC } from 'react'

import Logo from './Logo'

const Anonymous: FC = () => {
  const { formatMessage } = useIntl()

  return (
    <LocalizedLink to="/login" sx={{ variant: 'login.button.container' }}>
      <Logo />
      <Box variant="login.button.greeting">
        {formatMessage({
          id: 'login.button.action',
          defaultMessage: 'Sign In',
        })}
      </Box>
    </LocalizedLink>
  )
}

export default Anonymous
