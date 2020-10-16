/** @jsx jsx */
import { FC } from 'react'
import { useIntl } from '@vtex/gatsby-plugin-i18n'
import { Box, jsx, LocalizedLink } from '@vtex/store-ui'

import { useSession } from '../../sdk/session/useSession'
import Logo from './Logo'

const Login: FC = () => {
  const [session] = useSession()
  const { formatMessage } = useIntl()
  const name =
    session?.namespaces.profile?.firstName ?? session?.namespaces.profile?.email

  const isAuthenticated = session?.namespaces.profile?.isAuthenticated

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
