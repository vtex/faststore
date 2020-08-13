/** @jsx jsx */
import { FC } from 'react'
import { Button, ButtonProps, jsx } from 'theme-ui'

export type MinicartButtonProps = ButtonProps

export const MinicartButton: FC<MinicartButtonProps> = ({
  children,
  ...props
}) => (
  <Button aria-label="Open Cart" {...props}>
    {children}
  </Button>
)
