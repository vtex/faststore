/** @jsx jsx */
import { FC } from 'react'
import { Button, ButtonProps, jsx } from 'theme-ui'

import { MinicartBadge } from './Badge'

export interface MinicartButtonProps extends ButtonProps {
  badgeValue?: number
}

export const MinicartButton: FC<MinicartButtonProps> = ({
  variant,
  onClick,
  badgeValue,
  children,
  ...props
}) => {
  const value = badgeValue ?? 0

  return (
    <Button
      variant={variant}
      aria-label="Open Cart"
      onClick={onClick}
      {...props}
    >
      {children}
      <MinicartBadge variant={variant} value={value} />
    </Button>
  )
}
