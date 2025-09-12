import React from 'react'
import type { ComponentProps } from 'react'

export interface TileProps extends ComponentProps<'li'> {
  /**
   * ID to find this component in testing tools (e.g.: Testing Library, and Jest).
   */
  testId?: string
}

export default function Tile({
  testId = 'store-tile',
  children,
  ref,
  ...otherProps
}: TileProps) {
  return (
    <li
      ref={ref}
      role="listitem"
      data-fs-tile
      data-testid={testId}
      {...otherProps}
    >
      {children}
    </li>
  )
}
