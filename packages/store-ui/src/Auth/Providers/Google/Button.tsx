import { useIntl } from '@vtex/gatsby-plugin-i18n'
import { Box, Button } from 'theme-ui'
import React from 'react'
import type { FC } from 'react'

import Center from '../../../Center'
import type { AuthProviderButtonProps } from '../types'

const Logo: FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    x="0px"
    y="0px"
    width="20"
    height="20"
    viewBox="0 0 48 48"
  >
    <g id="surface1">
      <path
        d="M 43.609375 20.082031 L 42 20.082031 L 42 20 L 24 20 L 24 28 L 35.304688 28 C 33.652344 32.65625 29.222656 36 24 36 C 17.371094 36 12 30.628906 12 24 C 12 17.371094 17.371094 12 24 12 C 27.058594 12 29.84375 13.152344 31.960938 15.039063 L 37.617188 9.382813 C 34.046875 6.054688 29.269531 4 24 4 C 12.953125 4 4 12.953125 4 24 C 4 35.046875 12.953125 44 24 44 C 35.046875 44 44 35.046875 44 24 C 44 22.660156 43.863281 21.351563 43.609375 20.082031 Z "
        style={{ fill: 'rgb(255, 193, 7)' }}
      />
      <path
        d="M 6.304688 14.691406 L 12.878906 19.511719 C 14.65625 15.109375 18.960938 12 24 12 C 27.058594 12 29.84375 13.152344 31.960938 15.039063 L 37.617188 9.382813 C 34.046875 6.054688 29.269531 4 24 4 C 16.316406 4 9.65625 8.335938 6.304688 14.691406 Z "
        style={{ fill: 'rgb(255, 61, 0)' }}
      />
      <path
        d="M 24 44 C 29.164063 44 33.859375 42.023438 37.410156 38.808594 L 31.21875 33.570313 C 29.210938 35.089844 26.714844 36 24 36 C 18.796875 36 14.382813 32.683594 12.71875 28.054688 L 6.195313 33.078125 C 9.503906 39.554688 16.226563 44 24 44 Z "
        style={{ fill: 'rgb(76, 175, 80)' }}
      />
      <path
        d="M 43.609375 20.082031 L 42 20.082031 L 42 20 L 24 20 L 24 28 L 35.304688 28 C 34.511719 30.238281 33.070313 32.164063 31.214844 33.570313 C 31.21875 33.570313 31.21875 33.570313 31.21875 33.570313 L 37.410156 38.808594 C 36.972656 39.203125 44 34 44 24 C 44 22.660156 43.863281 21.351563 43.609375 20.082031 Z "
        style={{ fill: 'rgb(25, 118, 210)' }}
      />
    </g>
  </svg>
)

const GoogleOAuthButton: FC<AuthProviderButtonProps> = ({
  variant,
  ...rest
}) => {
  const { formatMessage } = useIntl()

  return (
    <Button variant={`${variant}.google`} as="button" {...rest}>
      <Center>
        <Logo />
        <Box ml={2}>
          {formatMessage({
            id: 'login.page.googleOAuth.button',
          })}
        </Box>
      </Center>
    </Button>
  )
}

export default GoogleOAuthButton
