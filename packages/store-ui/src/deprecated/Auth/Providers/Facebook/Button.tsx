import { useIntl } from 'react-intl'
import { Box, Button } from 'theme-ui'
import React from 'react'
import type { FC } from 'react'

import Center from '../../../Center'
import type { AuthProviderButtonProps } from '../types'

const Logo: FC = () => (
  <svg
    width="20"
    height="20"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="88.428 12.828 107.543 207.085"
  >
    <path
      d="M158.232 219.912v-94.461h31.707l4.747-36.813h-36.454V65.134c0-10.658 2.96-17.922 18.245-17.922l19.494-.009V14.278c-3.373-.447-14.944-1.449-28.406-1.449-28.106 0-47.348 17.155-47.348 48.661v27.149H88.428v36.813h31.788v94.461l38.016-.001z"
      fill="#3c5a9a"
    />
  </svg>
)

const FacebookOAuthButton: FC<AuthProviderButtonProps> = ({
  variant,
  ...rest
}) => {
  const { formatMessage } = useIntl()

  return (
    <Button variant={`${variant}.facebook`} as="button" {...rest}>
      <Center>
        <Logo />
        <Box ml={2}>
          {formatMessage({
            id: 'login.page.facebookOAuth.button',
          })}
        </Box>
      </Center>
    </Button>
  )
}

export default FacebookOAuthButton
