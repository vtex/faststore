import type { ComponentProps } from 'react'
import React from 'react'

export interface OverlayProps extends ComponentProps<'div'> {
  /**
   * ID to find this component in testing tools (e.g.: testing library, and jest).
   */
  testId?: string
}

export default function Overlay({
  testId = 'fs-overlay',
  ref,
  ...otherProps
}: OverlayProps) {
  return (
    <div
      ref={ref}
      data-fs-overlay
      role="presentation"
      data-testid={testId}
      {...otherProps}
    />
  )
}
