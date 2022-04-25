import { forwardRef } from 'react'
import type { HTMLAttributes } from 'react'

export interface TileProps extends HTMLAttributes<HTMLLIElement> {
  /**
   * ID to find this component in testing tools (e.g.: cypress,
   * testing-library, and jest).
   */
  testId?: string
}

const Tile = forwardRef<HTMLLIElement, TileProps>(function Tile(
  { testId = 'store-tile', children, ...otherProps },
  ref
) {
  return (
    <li ref={ref} data-tile data-testid={testId} {...otherProps}>
      {children}
    </li>
  )
})

export default Tile
