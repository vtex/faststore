import type { PopoverProps as ReachPopoverProps } from '@reach/popover'
import ReachPopover, { positionDefault } from '@reach/popover'
import type { ReactNode } from 'react'
import React from 'react'

export type PopoverProps = Omit<ReachPopoverProps, 'position'> & {
  testId?: string
  children: ReactNode
}

const Popover = ({
  testId = 'store-popover',
  children,
  ...props
}: PopoverProps) => {
  return (
    <ReachPopover
      data-store-popover
      data-testid={testId}
      position={positionDefault}
      {...props}
    >
      {children}
    </ReachPopover>
  )
}

export default Popover
