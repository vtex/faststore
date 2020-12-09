import React from 'react'
import { Box } from 'theme-ui'
import type { PropsWithoutRef, FC } from 'react'
import type { ButtonProps } from 'theme-ui'

type Props = PropsWithoutRef<ButtonProps>

const ButtonBox: FC<Props> = Box as any

const FloatingActionButton: FC<Props> = ({
  variant = 'floatingActionButton',
  children,
  ...rest
}) => (
  <Box variant={`${variant}.container`}>
    <ButtonBox as="button" variant={`${variant}.button`} {...rest}>
      {children}
    </ButtonBox>
  </Box>
)

export default FloatingActionButton
