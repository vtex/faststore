import React, { PropsWithoutRef, FC } from 'react'
import { Box, ButtonProps } from 'theme-ui'

type Props = PropsWithoutRef<ButtonProps>

const ButtonBox: FC<Props> = Box as any

const FloatingActionButton: FC<Props> = ({
  variant = 'floatingActionButton',
  children,
  ...rest
}) => (
  <ButtonBox as="button" variant={variant} {...rest}>
    {children}
  </ButtonBox>
)

export default FloatingActionButton
