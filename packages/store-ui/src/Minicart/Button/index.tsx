import React from 'react'
import { Button } from 'theme-ui'
import type { ComponentPropsWithoutRef, FC, ComponentPropsWithRef } from 'react'

import MinicartButtonIcon from './Icon'
import MinicartButtomBadge from './Badge'

interface Props
  extends ComponentPropsWithoutRef<typeof Button>,
    ComponentPropsWithRef<typeof MinicartButtonIcon> {
  value: number
  variant?: string
}

const MinicartButton: FC<Props> = ({
  variant: v = 'default',
  value,
  height,
  width,
  viewBox,
  color,
  ...props
}) => {
  const variant = `minicart.${v}.button`

  return (
    <Button aria-label="Open Cart" variant={variant} {...props}>
      <MinicartButtonIcon
        height={height}
        width={width}
        viewBox={viewBox}
        color={color}
      />
      <MinicartButtomBadge variant={variant} value={value} />
    </Button>
  )
}

export default MinicartButton
