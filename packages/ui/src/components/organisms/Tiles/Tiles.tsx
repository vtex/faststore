import React, { Children, forwardRef } from 'react'
import type { HTMLAttributes, ReactElement } from 'react'

import { Tile } from '.'

export interface TilesProps extends HTMLAttributes<HTMLUListElement> {
  /**
   * ID to find this component in testing tools (e.g.: Cypress,
   * Testing Library, and Jest).
   */
  testId?: string
}

const MIN_CHILDREN = 2
const MAX_CHILDREN = 4
const NUMBER_ITEMS_TO_EXPAND_FIRST_TWO = 2
const NUMBER_ITEMS_TO_EXPAND_FIRST = 3

const Tiles = forwardRef<HTMLUListElement, TilesProps>(function Tiles(
  { testId = 'store-tiles', children, ...otherProps },
  ref
) {
  const childrenCount = Children.count(children)

  if (process.env.NODE_ENV === 'development') {
    const isOutOfBounds =
      childrenCount < MIN_CHILDREN || childrenCount > MAX_CHILDREN

    if (isOutOfBounds) {
      throw new Error(
        `Tiles cannot receive less than ${MIN_CHILDREN} or more than ${MAX_CHILDREN} children.`
      )
    }
  }

  if (process.env.NODE_ENV === 'development') {
    Children.forEach(children as ReactElement, (child) => {
      if (child.type !== Tile) {
        throw new Error('Only Tile components allowed as children.')
      }
    })
  }

  const expandedClass =
    childrenCount === NUMBER_ITEMS_TO_EXPAND_FIRST
      ? 'expanded-first'
      : childrenCount === NUMBER_ITEMS_TO_EXPAND_FIRST_TWO
      ? 'expanded-first-two'
      : ''

  return (
    <ul
      ref={ref}
      role="list"
      data-fs-tiles
      data-fs-tiles-variant={expandedClass}
      data-fs-content="tiles"
      data-testid={testId}
      {...otherProps}
    >
      {children}
    </ul>
  )
})

export default Tiles
