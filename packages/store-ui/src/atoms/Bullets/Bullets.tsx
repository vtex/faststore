import type { MouseEvent } from 'react'
import React, { useMemo } from 'react'

import Button from '../Button'

export interface BulletsProps {
  /**
   * Number of bullets that should be rendered.
   */
  totalQuantity: number
  /**
   * The currently active bullet (zero-indexed).
   */
  activeBullet: number
  /**
   * Event handler for clicks on each bullet. The handler will be called with
   * the index of the bullet that received the click.
   */
  onClick: (e: MouseEvent, bulletIdx: number) => void
  /**
   * ID to find this component in testing tools (e.g.: cypress,
   * testing-library, and jest).
   */
  testId?: string
  /**
   * ID to find each `<li>` rendered by this component in testing tools
   * (e.g.: cypress, testing-library, and jest).
   */
  listItemTestId?: string
}

function Bullets({
  totalQuantity,
  activeBullet,
  onClick,
  testId = 'store-bullets',
  listItemTestId = 'bullet-item',
}: BulletsProps) {
  const bulletIndexes = useMemo(() => [...new Array(totalQuantity).keys()], [
    totalQuantity,
  ])

  return (
    <ol data-store-bullets data-testid={testId}>
      {bulletIndexes.map((idx) => {
        const isActive = activeBullet === idx

        return (
          <li
            key={idx}
            data-testid={listItemTestId}
            data-bullet-item
            data-active={isActive || undefined}
          >
            <Button
              aria-label={isActive ? 'Current page' : `Go to page ${idx + 1}`}
              onClick={(e) => onClick(e, idx)}
            />
          </li>
        )
      })}
    </ol>
  )
}

export default Bullets
