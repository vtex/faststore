import React from 'react'
import { Button } from 'theme-ui'
import type { ComponentPropsWithoutRef, FC, ComponentPropsWithRef } from 'react'

import MinicartButtonSvg from './Svg'
import MinicartButtomBadge from './Badge'

interface Props
  extends ComponentPropsWithoutRef<typeof Button>,
    ComponentPropsWithRef<typeof MinicartButtonSvg> {
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
      <MinicartButtonSvg
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
