/** @jsx jsx */
import { Button, jsx } from 'theme-ui'
import type { FC } from 'react'
import type { ButtonProps } from 'theme-ui'

export type MinicartButtonProps = ButtonProps

const MinicartButton: FC<MinicartButtonProps> = ({ children, ...props }) => (
  <Button data-testid="openCart" aria-label="Open Cart" {...props}>
    {children}
  </Button>
)

export default MinicartButton
