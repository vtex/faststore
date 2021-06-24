import type { MouseEvent, PropsWithChildren } from 'react'
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
   * Function that should be used to generate the aria-label attribute added
   * to each bullet that is inactive. It receives the bullet index as an
   * argument so that it can be interpolated in the generated string.
   */
  ariaLabelGenerator?: (index: number, isActive: boolean) => string
}

interface BulletProps {
  isActive: boolean
  testId: string
}

function Bullet({
  isActive,
  testId,
  children,
}: PropsWithChildren<BulletProps>) {
  return (
    <li
      data-testid={testId}
      data-bullet-item
      data-active={isActive || undefined}
    >
      {children}
    </li>
  )
}

const defaultAriaLabel = (idx: number, isActive: boolean) =>
  isActive ? 'Current page' : `Go to page ${idx + 1}`

function Bullets({
  totalQuantity,
  activeBullet,
  onClick,
  testId = 'store-bullets',
  ariaLabelGenerator = defaultAriaLabel,
}: BulletsProps) {
  const bulletIndexes = useMemo(() => [...new Array(totalQuantity).keys()], [
    totalQuantity,
  ])

  return (
    <ol data-store-bullets data-testid={testId}>
      {bulletIndexes.map((idx) => {
        const isActive = activeBullet === idx

        return (
          <Bullet key={idx} testId={`${testId}-item`} isActive={isActive}>
            <Button
              aria-label={ariaLabelGenerator(idx, isActive)}
              onClick={(e) => onClick(e, idx)}
              disabled={isActive}
            />
          </Bullet>
        )
      })}
    </ol>
  )
}

export default Bullets
