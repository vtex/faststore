import React, { PropsWithoutRef, FC } from 'react'
import { Box, ButtonProps } from 'theme-ui'

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
