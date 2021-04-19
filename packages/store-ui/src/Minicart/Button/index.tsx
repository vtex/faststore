import React from 'react'
import { Button } from 'theme-ui'
import type { ComponentPropsWithoutRef, FC } from 'react'

import MinicartButtonSvg from './Svg'
import MinicartButtomBadge from './Badge'

interface Props extends ComponentPropsWithoutRef<typeof Button> {
  value: number
  variant?: string
}

const MinicartButton: FC<Props> = ({
  variant: v = 'default',
  value,
  ...props
}) => {
  const variant = `minicart.${v}.button`

  return (
    <Button aria-label="Open Cart" variant={variant} {...props}>
      <MinicartButtonSvg />
      <MinicartButtomBadge variant={variant} value={value} />
    </Button>
  )
}

export default MinicartButton
