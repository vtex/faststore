/** @jsx jsx */
import { useIntl } from '@vtex/gatsby-plugin-i18n'
import { Box, LocalizedLink, jsx } from '@vtex/store-ui'
import { FC } from 'react'

import { useProfile } from '../../sdk/session/useProfile'
import Logo from './Logo'

const Login: FC = () => {
  const profile = useProfile()
  const { formatMessage } = useIntl()
  const name = profile?.firstName.value ?? profile?.email.value
  const isAuthenticated = profile?.isAuthenticated.value === 'true'

  return isAuthenticated ? (
    <LocalizedLink to="/account" sx={{ variant: 'login.button.container' }}>
      <Logo />
      <Box variant="login.button.greeting">
        {formatMessage(
          { id: 'login.button.greeting', defaultMessage: 'Hello {name}' },
          { name }
        )}
      </Box>
    </LocalizedLink>
  ) : (
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

export default Login
