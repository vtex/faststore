import type { PopoverProps as ReachPopoverProps } from '@reach/popover'
import ReachPopover, { positionDefault } from '@reach/popover'
import type { ReactNode } from 'react'
import React from 'react'

export type PopoverProps = Omit<ReachPopoverProps, 'position' | 'targetRef'> & {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
  /**
   * Ref for the component initial position.
   */
  targetRef: ReachPopoverProps['targetRef']
  children: ReactNode
}

const Popover = ({
  targetRef,
  testId = 'store-popover',
  children,
  ...otherProps
}: PopoverProps) => {
  return (
    <ReachPopover
      data-store-popover
      data-testid={testId}
      position={positionDefault}
      targetRef={targetRef}
      {...otherProps}
    >
      {children}
    </ReachPopover>
  )
}

export default Popover
