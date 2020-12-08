/** @jsx jsx */
import { useIntl } from '@vtex/gatsby-plugin-i18n'
import { Box, LocalizedLink, jsx } from '@vtex/store-ui'
import type { FC } from 'react'

import Logo from './Logo'

interface Props {
  name: string
}

const Authenticated: FC<Props> = ({ name }) => {
  const { formatMessage } = useIntl()

  return (
    <LocalizedLink to="/account" sx={{ variant: 'login.button.container' }}>
      <Logo />
      <Box variant="login.button.greeting">
        {formatMessage({ id: 'login.button.greeting' }, { name })}
      </Box>
    </LocalizedLink>
  )
}

export default Authenticated
