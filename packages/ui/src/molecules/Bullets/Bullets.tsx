import type { HTMLAttributes, MouseEvent } from 'react'
import React, { forwardRef, useMemo } from 'react'

import Button from '../../atoms/Button'

export interface BulletsProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onClick' | 'role'> {
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
   * Function that should be used to generate the aria-label attribute added
   * to each bullet that is inactive. It receives the bullet index as an
   * argument so that it can be interpolated in the generated string.
   */
  ariaLabelGenerator?: (index: number, isActive: boolean) => string
  /**
   * Function that should be used to generate the aria-controls attribute added
   * to each bullet. It receives the bullet index as argument and should return a string.
   */
  ariaControlsGenerator?: (index: number) => string
}

const defaultAriaLabel = (idx: number, isActive: boolean) =>
  isActive ? 'Current page' : `Go to page ${idx + 1}`

const Bullets = forwardRef<HTMLDivElement, BulletsProps>(function Bullets(
  {
    totalQuantity,
    activeBullet,
    onClick,
    testId = 'store-bullets',
    ariaLabelGenerator = defaultAriaLabel,
    ariaControlsGenerator,
    ...otherProps
  },
  ref
) {
  const bulletIndexes = useMemo(() => Array(totalQuantity).fill(0), [
    totalQuantity,
  ])

  return (
    <div
      ref={ref}
      data-store-bullets
      data-testid={testId}
      role="tablist"
      {...otherProps}
    >
      {bulletIndexes.map((_, idx) => {
        const isActive = activeBullet === idx

        return (
          <Button
            data-bullet-item
            role="tab"
            tabIndex={-1}
            key={idx}
            testId={`${testId}-item`}
            onClick={(e) => onClick(e, idx)}
            aria-label={ariaLabelGenerator(idx, isActive)}
            aria-controls={ariaControlsGenerator?.(idx)}
            aria-selected={isActive}
          />
        )
      })}
    </div>
  )
})

export default Bullets
