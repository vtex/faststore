/** @jsx jsx */
import { useIntl } from '@vtex/gatsby-plugin-i18n'
import { Box, jsx } from 'theme-ui'
import type { FC } from 'react'

import Logo from './Logo'
import LocalizedLink from '../LocalizedLink'

const Anonymous: FC = () => {
  const { formatMessage } = useIntl()

  return (
    <LocalizedLink to="/login" sx={{ variant: 'login.button.container' }}>
      <Logo />
      <Box variant="login.button.greeting">
        {formatMessage({
          id: 'login.button.action',
        })}
      </Box>
    </LocalizedLink>
  )
}

export default Anonymous
