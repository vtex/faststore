/** @jsx jsx */
import { Button, jsx } from 'theme-ui'
import type { FC } from 'react'
import type { ButtonProps } from 'theme-ui'

export type MinicartButtonProps = ButtonProps

export const MinicartButton: FC<MinicartButtonProps> = ({
  children,
  ...props
}) => (
  <Button aria-label="Open Cart" {...props}>
    {children}
  </Button>
)
