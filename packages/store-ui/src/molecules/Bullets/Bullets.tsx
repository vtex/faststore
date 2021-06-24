import type { MouseEvent } from 'react'
import React, { useMemo } from 'react'

import Button from '../../atoms/Button'

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
  /**
   * Function that should be used to generate the aria-label attribute added
   * to each bullet that is inactive. It receives the bullet index as an
   * argument so that it can be interpolated in the generated string.
   */
  ariaLabelGenerator?: (index: number) => string
  /**
   * aria-label attribute to be added to the currently active bullet.
   */
  activeAriaLabel?: string
}

function Bullets({
  totalQuantity,
  activeBullet,
  onClick,
  testId = 'store-bullets',
  listItemTestId = 'bullet-item',
  ariaLabelGenerator = (idx: number) => `Go to page ${idx + 1}`,
  activeAriaLabel = 'Current page',
}: BulletsProps) {
  const bulletIndexes = useMemo(() => [...new Array(totalQuantity).keys()], [
    totalQuantity,
  ])

  return (
    <ol data-store-bullets data-testid={testId}>
      {bulletIndexes.map((idx) => {
        const isActive = activeBullet === idx
        const ariaLabel = ariaLabelGenerator(idx)

        return (
          <li
            key={idx}
            data-testid={listItemTestId}
            data-bullet-item
            data-active={isActive || undefined}
          >
            <Button
              aria-label={isActive ? activeAriaLabel : ariaLabel}
              onClick={(e) => onClick(e, idx)}
            />
          </li>
        )
      })}
    </ol>
  )
}

export default Bullets
